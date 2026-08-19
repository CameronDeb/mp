// Shared email templates for every website form: one auto-reply to the person who
// submitted, one notification to the admin. Both go out through the same Mailgun
// helper the newsletter uses (lib/mailgun-send.ts) so there is a single send path.
//
// Form mail is sent from `hello@` rather than the newsletter's `newsletter@` sender,
// so a transactional reply never sits in a subscriber's promotions folder alongside
// the newsletter — and so Mailgun's newsletter unsubscribe suppression can't silently
// drop someone's contact-form receipt.

import { sendSimpleEmail } from './mailgun-send';

const MAILGUN_DOMAIN = process.env.MAILGUN_DOMAIN;
const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://drmarkpirtle.com';

/** Where admin notifications land. `ADMIN_NOTIFICATION_EMAIL` is the current name;
 *  `CONTACT_NOTIFICATION_EMAIL` is kept as a fallback so the older var keeps working. */
export const ADMIN_EMAIL =
  process.env.ADMIN_NOTIFICATION_EMAIL || process.env.CONTACT_NOTIFICATION_EMAIL || '';

const FORMS_FROM =
  process.env.MAILGUN_FROM_FORMS ||
  (MAILGUN_DOMAIN ? `Dr. Mark Pirtle <hello@${MAILGUN_DOMAIN}>` : '');

const NOTIFY_FROM = MAILGUN_DOMAIN ? `Website Forms <noreply@${MAILGUN_DOMAIN}>` : '';

export function escapeHtml(value: string): string {
  return value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

/* ── Shared shell ────────────────────────────────────────────────────────────
   Table-based, inline-styled, 480–560px card. Web-safe fonts only — Georgia for
   headings (nearest ubiquitous serif to the site's display face), Arial for body.
──────────────────────────────────────────────────────────────────────────────*/
function shell(innerHtml: string, width = 520): string {
  return `<!DOCTYPE html>
<html lang="en">
<head><meta charset="utf-8" /><meta name="viewport" content="width=device-width, initial-scale=1.0" /></head>
<body style="margin:0;padding:0;background-color:#f5f4f2;">
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="background-color:#f5f4f2;">
    <tr>
      <td align="center" style="padding:32px 16px;">
        <table role="presentation" width="${width}" cellpadding="0" cellspacing="0" border="0" style="max-width:${width}px;width:100%;background-color:#ffffff;border-radius:16px;overflow:hidden;border:1px solid #e5e2dd;">
          <tr><td style="padding:40px;font-family:Arial,Helvetica,sans-serif;">
${innerHtml}
          </td></tr>
        </table>
        <p style="margin:20px 0 0 0;font-family:Arial,Helvetica,sans-serif;font-size:11px;color:#9ca3af;">
          <a href="${SITE_URL}" style="color:#9ca3af;text-decoration:none;">drmarkpirtle.com</a>
        </p>
      </td>
    </tr>
  </table>
</body>
</html>`;
}

const H1 = 'margin:0 0 20px 0;font-family:Georgia,\'Times New Roman\',serif;font-size:22px;font-weight:bold;color:#1a1a1a;line-height:1.3;';
const P  = 'margin:0 0 16px 0;font-size:15px;line-height:1.65;color:#33312e;';
const SMALL = 'margin:24px 0 0 0;font-size:12px;line-height:1.6;color:#9ca3af;';

/* ── Auto-reply ──────────────────────────────────────────────────────────── */

export interface AutoReplyOptions {
  to: string;
  subject: string;
  heading: string;
  /** Body paragraphs, in order. Plain text — escaped before rendering. */
  paragraphs: string[];
  /** Optional closing note in small grey type (e.g. unsubscribe wording). */
  footnote?: string;
}

/** Sent to the person who submitted the form. Reply-To is the admin so a human
 *  answer to the auto-reply reaches an inbox instead of a noreply black hole. */
export async function sendAutoReply({
  to,
  subject,
  heading,
  paragraphs,
  footnote,
}: AutoReplyOptions): Promise<{ messageId: string }> {
  const body =
    `<p style="${H1}">${escapeHtml(heading)}</p>` +
    paragraphs.map((p) => `<p style="${P}">${escapeHtml(p)}</p>`).join('') +
    `<p style="${P}">— Mark</p>` +
    (footnote ? `<p style="${SMALL}">${escapeHtml(footnote)}</p>` : '');

  return sendSimpleEmail(to, subject, shell(body, 520), {
    from: FORMS_FROM || undefined,
    replyTo: ADMIN_EMAIL || undefined,
  });
}

/* ── Admin notification ──────────────────────────────────────────────────── */

export interface AdminNotificationOptions {
  subject: string;
  heading: string;
  /** Rendered as a label/value table. Entries with empty values are dropped. */
  fields: Array<[label: string, value: string | null | undefined]>;
  /** Free-text block rendered below the table, whitespace preserved. */
  message?: string | null;
  /** Reply-To, so hitting reply answers the enquirer directly. */
  replyTo?: string;
  /** Deep link into the Directus record, when one was created. */
  directusUrl?: string;
}

/** Sent to ADMIN_EMAIL for every submission. Throws if no admin address is set. */
export async function sendAdminNotification({
  subject,
  heading,
  fields,
  message,
  replyTo,
  directusUrl,
}: AdminNotificationOptions): Promise<{ messageId: string }> {
  if (!ADMIN_EMAIL) {
    throw new Error('No admin recipient — set ADMIN_NOTIFICATION_EMAIL');
  }

  const rows = fields
    .filter(([, value]) => value != null && String(value).trim() !== '')
    .map(
      ([label, value]) =>
        `<tr>
          <td style="padding:8px 16px 8px 0;font-size:13px;color:#6b7280;white-space:nowrap;vertical-align:top;">${escapeHtml(label)}</td>
          <td style="padding:8px 0;font-size:14px;color:#1a1a1a;vertical-align:top;">${escapeHtml(String(value))}</td>
        </tr>`
    )
    .join('');

  const body =
    `<p style="${H1}">${escapeHtml(heading)}</p>` +
    `<table role="presentation" cellpadding="0" cellspacing="0" border="0" width="100%" style="border-top:1px solid #e5e2dd;border-bottom:1px solid #e5e2dd;margin-bottom:20px;">${rows}</table>` +
    (message
      ? `<p style="margin:0 0 8px 0;font-size:13px;color:#6b7280;">Message</p>` +
        `<div style="${P}white-space:pre-wrap;background-color:#faf9f7;border-radius:8px;padding:16px;">${escapeHtml(message)}</div>`
      : '') +
    (replyTo
      ? `<p style="${SMALL}">Reply to this email to answer ${escapeHtml(replyTo)} directly.</p>`
      : '') +
    (directusUrl
      ? `<p style="margin:8px 0 0 0;font-size:12px;"><a href="${directusUrl}" style="color:#C0522A;">Open in Directus →</a></p>`
      : '');

  return sendSimpleEmail(ADMIN_EMAIL, subject, shell(body, 560), {
    from: NOTIFY_FROM || undefined,
    replyTo,
  });
}
