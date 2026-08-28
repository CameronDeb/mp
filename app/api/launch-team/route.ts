// Built This Way Launch Team signups.
//
// Copy and fields come from Mark's BTWLaunchTeamWebpageCopy doc (Aug 2026).
// This is an opt-in, not a purchase — the tiers it replaced were removed when
// Mark stopped raising money for the book.
//
// Members land in `newsletter_subscribers` rather than a separate table, since
// what he promises them ("occasional launch updates, early excerpts") is a
// newsletter. Tagging them means he can send to just the launch team without
// maintaining a second list, and they flow through the same warm-up batching
// as everyone else.

import { NextRequest, NextResponse } from 'next/server';
import { EMAIL_RE } from '@/lib/inquiries';
import { sendSimpleEmail } from '@/lib/mailgun-send';

const DIRECTUS_URL = process.env.NEXT_PUBLIC_DIRECTUS_URL;
const DIRECTUS_TOKEN = process.env.DIRECTUS_STATIC_TOKEN;
const ADMIN_EMAIL = process.env.ADMIN_NOTIFICATION_EMAIL;
const REPLY_TO = process.env.NEWSLETTER_REPLY_TO;
const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://drmarkpirtle.com';

function esc(s: string): string {
  return s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
}

function authHeaders() {
  return {
    'Content-Type': 'application/json',
    ...(DIRECTUS_TOKEN ? { Authorization: `Bearer ${DIRECTUS_TOKEN}` } : {}),
  };
}

/**
 * Adds or updates the subscriber, preserving any tags they already carry so
 * joining the launch team never drops an earlier tag.
 */
async function upsertLaunchTeamMember(
  email: string,
  name: string,
  willingToShare: boolean
): Promise<void> {
  if (!DIRECTUS_URL) throw new Error('Directus is not configured');

  const lookup = await fetch(
    `${DIRECTUS_URL}/items/newsletter_subscribers?filter[email][_eq]=${encodeURIComponent(email)}&fields=id,tags&limit=1`,
    { headers: authHeaders(), cache: 'no-store' }
  );
  if (!lookup.ok) throw new Error(`Subscriber lookup failed (${lookup.status})`);
  const existing = (await lookup.json()).data?.[0];

  const tags = new Set<string>(Array.isArray(existing?.tags) ? existing.tags : []);
  tags.add('launch-team');
  if (willingToShare) tags.add('willing-to-share');

  if (existing) {
    const res = await fetch(`${DIRECTUS_URL}/items/newsletter_subscribers/${existing.id}`, {
      method: 'PATCH',
      headers: authHeaders(),
      // Re-subscribe them: joining the launch team is unambiguous consent.
      body: JSON.stringify({
        status: 'Subscribed',
        unsubscribed_at: null,
        name,
        tags: [...tags],
      }),
    });
    if (!res.ok) throw new Error(`Subscriber update failed (${res.status})`);
    return;
  }

  const res = await fetch(`${DIRECTUS_URL}/items/newsletter_subscribers`, {
    method: 'POST',
    headers: authHeaders(),
    body: JSON.stringify({
      email,
      name,
      status: 'Subscribed',
      source: 'launch-team',
      subscribed_at: new Date().toISOString(),
      tags: [...tags],
    }),
  });
  if (!res.ok) throw new Error(`Subscriber create failed (${res.status})`);
}

export async function POST(request: NextRequest) {
  let body: Record<string, unknown>;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: 'Invalid request.' }, { status: 400 });
  }

  const firstName = String(body.firstName ?? '').trim();
  const email = String(body.email ?? '').trim().toLowerCase();
  const heardFrom = String(body.heardFrom ?? '').trim();
  const willingToShare = Boolean(body.willingToShare);
  const company = String(body.company ?? '').trim(); // honeypot

  // Bots fill hidden fields; humans never see this one.
  if (company) return NextResponse.json({ ok: true });

  if (!firstName || !email) {
    return NextResponse.json({ error: 'Name and email are required.' }, { status: 400 });
  }
  if (!EMAIL_RE.test(email)) {
    return NextResponse.json({ error: 'Please enter a valid email address.' }, { status: 400 });
  }

  try {
    await upsertLaunchTeamMember(email, firstName, willingToShare);
  } catch (err) {
    console.error('[launch-team] Could not record signup:', err);
    return NextResponse.json(
      { error: 'We could not record that just now. Please try again in a moment.' },
      { status: 500 }
    );
  }

  // The member is saved. Emails are best-effort from here — a mail failure
  // must not tell someone their signup did not work when it did.
  await Promise.allSettled([
    sendSimpleEmail(
      email,
      "You're on the Built This Way Launch Team",
      `<!DOCTYPE html><html lang="en"><head><meta charset="utf-8" /></head>
<body style="margin:0;background:#f4f2ef;"><table role="presentation" width="100%" cellpadding="0" cellspacing="0"><tr>
<td align="center" style="padding:28px 12px;"><table role="presentation" width="560" cellpadding="0" cellspacing="0"
 style="max-width:560px;width:100%;background:#fff;border-radius:14px;border:1px solid #e5e1db;">
<tr><td style="padding:36px;font-family:Arial,Helvetica,sans-serif;color:#1a1a1a;line-height:1.7;">
<p>Hi ${esc(firstName)},</p>
<p>Thank you for joining the <em>Built This Way</em> Launch Team.</p>
<p>Books do not move into the world by themselves. They move because real people read them, talk
about them, and place them in the hands of someone who may need the message. I am grateful for
your help doing that.</p>
<p><strong>Everything the launch team receives lives here:</strong></p>
<p style="margin:22px 0;">
  <a href="${SITE_URL}/launch-team/welcome"
     style="background:#c0522a;color:#ffffff;padding:13px 26px;border-radius:999px;text-decoration:none;font-weight:bold;display:inline-block;">
    Open your launch team page
  </a>
</p>
<p style="font-size:13px;color:#666;">Worth bookmarking — the Pattern Reflection Kit, the
Boundarylessness of Awareness audio, selected excerpts, the launch-week sharing kit and Pattern
Lab details all appear on that page as they become available.</p>
<p>I will also be in touch with launch updates as we get closer. Nothing complicated, and no
pressure.</p>
<p>— Mark</p>
<p style="font-size:11px;color:#9ca3af;">You can <a href="%unsubscribe_url%" style="color:#9ca3af;">unsubscribe</a> at any time.</p>
</td></tr></table></td></tr></table></body></html>`,
      { replyTo: REPLY_TO }
    ),
    ADMIN_EMAIL
      ? sendSimpleEmail(
          ADMIN_EMAIL,
          `[Launch Team] ${firstName} joined`,
          `<div style="font-family:Arial,Helvetica,sans-serif;line-height:1.7;">
<p><strong>New Built This Way Launch Team member</strong></p>
<p>
Name: ${esc(firstName)}<br />
Email: ${esc(email)}<br />
Willing to share during launch week: <strong>${willingToShare ? 'Yes' : 'Not indicated'}</strong><br />
How they heard: ${heardFrom ? esc(heardFrom) : '(not given)'}
</p>
<p style="font-size:13px;color:#666;">Tagged <code>launch-team</code>${willingToShare ? ' and <code>willing-to-share</code>' : ''} in the newsletter list.</p>
</div>`,
          { replyTo: email }
        )
      : Promise.resolve(),
  ]).then(results =>
    results.forEach((r, i) => {
      if (r.status === 'rejected') {
        console.error(`[launch-team] ${i === 0 ? 'welcome' : 'admin'} email failed:`, r.reason);
      }
    })
  );

  return NextResponse.json({ ok: true, siteUrl: SITE_URL });
}
