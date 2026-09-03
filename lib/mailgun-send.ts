// Sends a newsletter to every `Subscribed` row in Directus's newsletter_subscribers
// via Mailgun's batch-send API (recipient-variables), rather than a Mailgun mailing
// list — mailing lists on this account are capped at a small member count.
// Mailgun's per-domain suppression (bounces, complaints, unsubscribes) still applies
// automatically to plain batch sends, so %unsubscribe_url% keeps working without Lists.

const DIRECTUS_URL = process.env.NEXT_PUBLIC_DIRECTUS_URL || 'http://localhost:8055';
const DIRECTUS_TOKEN = process.env.DIRECTUS_STATIC_TOKEN;
const MAILGUN_API_KEY = process.env.MAILGUN_API_KEY;
const MAILGUN_DOMAIN = process.env.MAILGUN_DOMAIN;
const MAILGUN_FROM = process.env.MAILGUN_FROM || 'Dr. Mark Pirtle <newsletter@mg.drmarkpirtle.com>';
// The From address has to live on MAILGUN_DOMAIN for SPF/DKIM alignment, which
// makes it an address nobody monitors. Replies are redirected to a real inbox.
const NEWSLETTER_REPLY_TO = process.env.NEWSLETTER_REPLY_TO;

// Mailgun's per-call recipient cap. A cohort larger than this is split across
// several calls sent in sequence.
//
// Kept below Mailgun's documented 1000 for failure isolation rather than
// because of any limit. Smaller calls mean a bad batch loses fewer people and
// is easier to identify from the event log.
//
// This is deliberately not the fix for the 3 September 2026 incident, where a
// cohort was recorded as sent but reached one person. That was an unquoted
// display name containing a comma breaking the address list — see
// formatRecipient above. Chunking only reduced the blast radius; the first two
// chunks succeeded and the one holding the bad name failed exactly as before.
//
// The lesson worth keeping: Mailgun returned 200 OK with a message id for a
// send that went nowhere. After any change to how recipients are built or
// batched, confirm the accepted count in the events API matches what was
// requested. The API response on its own does not tell you the mail went out.
const MAILGUN_CALL_CAP = Number(process.env.MAILGUN_MAX_RECIPIENTS_PER_CALL || 100);

// A short pause between calls. Firing hundreds of requests back to back at a
// domain that is already rate-limited is how a warm-up turns into a block.
const MAILGUN_CALL_DELAY_MS = Number(process.env.MAILGUN_CALL_DELAY_MS || 600);

interface Subscriber {
  id: number;
  email: string;
  name: string | null;
}

/**
 * One entry for the `to` header, with the display name always quoted.
 *
 * Subscriber names come from an imported list and several contain a trailing
 * comma ("Rosanne Sheinberg,"). Interpolated raw into a comma-separated address
 * list that comma ends the address early, so the rest of the list parses as
 * garbage and Mailgun quietly delivers to a single recipient while still
 * returning 200 OK with a message id. That is how a 250-person cohort reached
 * one person on 3 September 2026 and was recorded as fully sent.
 *
 * Quoting makes the name opaque to the address parser, so commas, colons,
 * semicolons and angle brackets inside it can no longer terminate it. Backslash
 * and quote are escaped first, since either would otherwise close the quoted
 * string. Names are display text only — personalisation uses recipient
 * variables — so quoting costs nothing.
 */
function formatRecipient(r: Subscriber): string {
  const name = (r.name || '').trim();
  if (!name) return r.email;
  const escaped = name.replace(/([\\"])/g, '\\$1');
  return `"${escaped}" <${r.email}>`;
}

function chunk<T>(arr: T[], size: number): T[][] {
  const out: T[][] = [];
  for (let i = 0; i < arr.length; i += size) out.push(arr.slice(i, i + size));
  return out;
}

/**
 * Subscribed recipients ordered by id, optionally starting after a cursor.
 *
 * Ordering by id (rather than offset paging) is what makes a multi-day warm-up
 * safe: new signups always land on higher ids, so they queue up after the
 * cursor instead of shifting rows into or out of batches that already went out.
 * Offset paging would silently skip or double-send people whenever the list
 * changed between batches, which over a four-day warm-up it certainly will.
 */
async function getSubscribedRecipients(afterId = 0, limit?: number): Promise<Subscriber[]> {
  const params = new URLSearchParams({
    'filter[status][_eq]': 'Subscribed',
    'filter[id][_gt]': String(afterId),
    fields: 'id,email,name',
    sort: 'id',
    limit: String(limit && limit > 0 ? limit : -1),
  });
  const res = await fetch(`${DIRECTUS_URL}/items/newsletter_subscribers?${params}`, {
    headers: DIRECTUS_TOKEN ? { Authorization: `Bearer ${DIRECTUS_TOKEN}` } : {},
    cache: 'no-store',
  });
  if (!res.ok) {
    throw new Error(`Failed to fetch subscribers (${res.status}): ${await res.text()}`);
  }
  const json = await res.json();
  return json.data;
}

/** How many Subscribed rows remain strictly after `afterId`. */
async function countRemaining(afterId: number): Promise<number> {
  const params = new URLSearchParams({
    'filter[status][_eq]': 'Subscribed',
    'filter[id][_gt]': String(afterId),
    'aggregate[count]': '*',
  });
  const res = await fetch(`${DIRECTUS_URL}/items/newsletter_subscribers?${params}`, {
    headers: DIRECTUS_TOKEN ? { Authorization: `Bearer ${DIRECTUS_TOKEN}` } : {},
    cache: 'no-store',
  });
  if (!res.ok) return 0;
  const json = await res.json();
  return Number(json.data?.[0]?.count ?? 0);
}

export interface SendOptions {
  /** Send only this many recipients. Omit to send to the whole remaining list. */
  batchSize?: number;
  /** Resume after this subscriber id. Pass the previous batch's `lastId`. */
  afterId?: number;
  /** Resolve the recipient set and return it without sending anything. */
  dryRun?: boolean;
}

export interface SendResult {
  recipientCount: number;
  messageIds: string[];
  /** Highest subscriber id in this batch — pass as `afterId` for the next one. */
  lastId: number;
  /** Subscribed rows still unsent after this batch. 0 means the send is complete. */
  remaining: number;
  dryRun?: boolean;
  /** Present on a dry run so the operator can eyeball who is about to be mailed. */
  preview?: string[];
  /** How many Mailgun calls the cohort was split across. */
  callsMade?: number;
  /**
   * Set when the sequence stopped early. `recipientCount` and `lastId` then
   * describe what actually went out, not what was intended — the caller must
   * still record them, or the people already mailed get a second copy.
   */
  error?: string;
}

/**
 * Sends `html` to subscribed recipients. With no options this mails the entire
 * list in one go, exactly as before. With `batchSize` it mails one warm-up
 * cohort and reports the cursor to resume from.
 */
export async function sendNewsletterToSubscribers(
  subject: string,
  html: string,
  options: SendOptions = {}
): Promise<SendResult> {
  if (!MAILGUN_API_KEY || !MAILGUN_DOMAIN) {
    throw new Error('Mailgun not configured — set MAILGUN_API_KEY and MAILGUN_DOMAIN');
  }

  const afterId = options.afterId ?? 0;
  const recipients = await getSubscribedRecipients(afterId, options.batchSize);

  if (recipients.length === 0) {
    return { recipientCount: 0, messageIds: [], lastId: afterId, remaining: 0 };
  }

  const lastId = recipients[recipients.length - 1].id;

  if (options.dryRun) {
    return {
      recipientCount: recipients.length,
      messageIds: [],
      lastId,
      remaining: await countRemaining(lastId),
      dryRun: true,
      preview: recipients.slice(0, 10).map((r) => r.email),
    };
  }

  const messageIds: string[] = [];
  // Tracked as the sequence goes so a failure halfway through still reports
  // exactly how far it got. Sending is not transactional: once a call is
  // accepted those people have been mailed, and throwing that away would make
  // the next run start from a cursor that has already been passed.
  let sent = 0;
  let lastSentId = afterId;
  let failure: string | undefined;

  const batches = chunk(recipients, MAILGUN_CALL_CAP);

  for (let i = 0; i < batches.length; i++) {
    const batch = batches[i];
    const to = batch.map(formatRecipient).join(',');
    const recipientVariables: Record<string, { name: string }> = {};
    for (const r of batch) {
      recipientVariables[r.email] = { name: r.name || 'there' };
    }

    const form = new FormData();
    form.append('from', MAILGUN_FROM);
    form.append('to', to);
    form.append('subject', subject);
    form.append('html', html);
    form.append('recipient-variables', JSON.stringify(recipientVariables));
    if (NEWSLETTER_REPLY_TO) form.append('h:Reply-To', NEWSLETTER_REPLY_TO);
    // Gmail and Yahoo expect bulk senders to offer one-click unsubscribe, and
    // its absence is itself a filtering signal. Mailgun expands
    // %unsubscribe_url% here the same as in the body, but only while the
    // domain's unsubscribe tracking is switched on.
    form.append('h:List-Unsubscribe', '<%unsubscribe_url%>');
    form.append('h:List-Unsubscribe-Post', 'List-Unsubscribe=One-Click');

    try {
      const res = await fetch(`https://api.mailgun.net/v3/${MAILGUN_DOMAIN}/messages`, {
        method: 'POST',
        headers: { Authorization: `Basic ${Buffer.from(`api:${MAILGUN_API_KEY}`).toString('base64')}` },
        body: form,
      });
      if (!res.ok) {
        throw new Error(`Mailgun send failed (${res.status}): ${await res.text()}`);
      }
      const json = await res.json();
      messageIds.push(json.id);
      sent += batch.length;
      lastSentId = batch[batch.length - 1].id;
    } catch (err) {
      // Stop rather than push on. Whatever caused this — rate limit, a batch
      // cap, a suspension — will almost certainly reject the next call too, and
      // each further attempt only widens the gap between sent and recorded.
      failure = err instanceof Error ? err.message : String(err);
      break;
    }

    if (i < batches.length - 1 && MAILGUN_CALL_DELAY_MS > 0) {
      await new Promise((resolve) => setTimeout(resolve, MAILGUN_CALL_DELAY_MS));
    }
  }

  // Nothing got out, so there is no progress worth recording and the caller
  // should treat it as a plain failure, exactly as it did when this was a
  // single all-or-nothing call.
  if (sent === 0 && failure) throw new Error(failure);

  return {
    recipientCount: sent,
    messageIds,
    lastId: lastSentId,
    remaining: await countRemaining(lastSentId),
    callsMade: messageIds.length,
    ...(failure ? { error: failure } : {}),
  };
}

export interface SimpleEmailOptions {
  /** Overrides MAILGUN_FROM — form mail goes out as `hello@`, not `newsletter@`. */
  from?: string;
  /** So replying to a notification lands in the enquirer's inbox, not Mailgun's. */
  replyTo?: string;
}

/** Low-level single-recipient send — shared by test sends, signup confirmations, and form mail. */
export async function sendSimpleEmail(
  to: string,
  subject: string,
  html: string,
  options: SimpleEmailOptions = {}
): Promise<{ messageId: string }> {
  if (!MAILGUN_API_KEY || !MAILGUN_DOMAIN) {
    throw new Error('Mailgun not configured — set MAILGUN_API_KEY and MAILGUN_DOMAIN');
  }

  const form = new FormData();
  form.append('from', options.from || MAILGUN_FROM);
  form.append('to', to);
  form.append('subject', subject);
  form.append('html', html);
  if (options.replyTo) form.append('h:Reply-To', options.replyTo);

  const res = await fetch(`https://api.mailgun.net/v3/${MAILGUN_DOMAIN}/messages`, {
    method: 'POST',
    headers: { Authorization: `Basic ${Buffer.from(`api:${MAILGUN_API_KEY}`).toString('base64')}` },
    body: form,
  });

  if (!res.ok) {
    throw new Error(`Mailgun send failed (${res.status}): ${await res.text()}`);
  }
  const json = await res.json();
  return { messageId: json.id };
}

/** Sends `html` to a single address only — for previewing/testing before a real send. */
export async function sendTestEmail(to: string, subject: string, html: string): Promise<{ messageId: string }> {
  // Mirror the real send's headers so the test previews true deliverability.
  return sendSimpleEmail(to, `[TEST] ${subject}`, html, { replyTo: NEWSLETTER_REPLY_TO });
}

/** Sent immediately when someone subscribes via a site form. */
export async function sendConfirmationEmail(to: string, name?: string | null): Promise<{ messageId: string }> {
  const greeting = name ? `Hi ${name},` : 'Hi there,';
  const html = `<!DOCTYPE html>
<html lang="en">
<head><meta charset="utf-8" /><meta name="viewport" content="width=device-width, initial-scale=1.0" /></head>
<body style="margin:0;padding:0;background-color:#e5e7eb;">
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0">
    <tr>
      <td align="center" style="padding:24px 0;">
        <table role="presentation" width="480" cellpadding="0" cellspacing="0" border="0" style="max-width:480px;width:100%;background-color:#ffffff;border-radius:16px;overflow:hidden;border:1px solid #e5e7eb;">
          <tr>
            <td style="padding:40px;font-family:Arial,Helvetica,sans-serif;">
              <p style="margin:0 0 20px 0;font-size:20px;font-weight:bold;color:#1a1a1a;">You're subscribed!</p>
              <p style="margin:0 0 16px 0;font-size:14px;line-height:1.6;color:#1a1a1a;">${greeting}</p>
              <p style="margin:0 0 16px 0;font-size:14px;line-height:1.6;color:#1a1a1a;">Thanks for subscribing to Dr. Mark Pirtle's newsletter — you'll get reflections, practical tools, and updates on new work as they come out.</p>
              <p style="margin:0;font-size:11px;color:#9ca3af;">Didn't sign up for this? You can <a href="%unsubscribe_url%" style="color:#9ca3af;">unsubscribe here</a>.</p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>`;
  return sendSimpleEmail(to, 'You’re subscribed to the newsletter', html);
}
