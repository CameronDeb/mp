// Re-sends download links for everything an email address has bought.
//
// Stripe is the record of purchase, so there is no local table to consult or
// keep in sync. Links are emailed rather than returned in the response: the
// only proof of ownership we have is control of the mailbox, so that is where
// the files must go.
//
// The response is deliberately identical whether or not the address has ever
// bought anything, so this cannot be used to discover Mark's customers.

import { NextRequest, NextResponse } from 'next/server';
import Stripe from 'stripe';
import { PRODUCTS_BY_KEY, entitlementsFor } from '@/lib/products';
import { buildDownloadLinks, LINK_TTL_HOURS } from '@/lib/downloads';
import { sendSimpleEmail } from '@/lib/mailgun-send';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

const STRIPE_SECRET_KEY = process.env.STRIPE_SECRET_KEY;
const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://drmarkpirtle.com';
const REPLY_TO = process.env.NEWSLETTER_REPLY_TO;

const SAME_ANSWER = {
  ok: true,
  message:
    'If that email address has purchases, a fresh set of download links is on its way. Please check your inbox, including spam.',
};

function esc(s: string): string {
  return s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
}

export async function POST(req: NextRequest) {
  let email: string;
  try {
    const body = await req.json();
    email = String(body.email ?? '').trim().toLowerCase();
  } catch {
    return NextResponse.json({ error: 'email required' }, { status: 400 });
  }
  if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email)) {
    return NextResponse.json({ error: 'Please enter a valid email address.' }, { status: 400 });
  }
  if (!STRIPE_SECRET_KEY || STRIPE_SECRET_KEY.includes('xxx')) {
    return NextResponse.json({ error: 'Downloads are not available right now.' }, { status: 503 });
  }

  const stripe = new Stripe(STRIPE_SECRET_KEY, { apiVersion: '2026-04-22.dahlia' });

  try {
    // Completed sessions for this address, newest first.
    const sessions = await stripe.checkout.sessions.list({ limit: 100 });
    const keys = new Set<string>();
    for (const s of sessions.data) {
      if (s.payment_status !== 'paid') continue;
      if ((s.customer_details?.email ?? '').toLowerCase() !== email) continue;
      const key = s.metadata?.product_key;
      if (key && PRODUCTS_BY_KEY[key]) keys.add(key);
    }

    const downloadable = [...keys].filter((k) => PRODUCTS_BY_KEY[k]?.digitalDelivery);
    if (downloadable.length > 0) {
      const links = buildDownloadLinks(downloadable.flatMap((k) => entitlementsFor(k)), SITE_URL);
      if (links.length > 0) {
        const rows = links
          .map(
            (l) => `<tr><td style="padding:8px 0;border-bottom:1px solid #eee;">
<a href="${l.url}" style="color:#c0522a;font-weight:bold;text-decoration:none;">${esc(l.filename)}</a></td></tr>`
          )
          .join('');
        await sendSimpleEmail(
          email,
          'Your Power Tools downloads',
          `<!DOCTYPE html><html lang="en"><head><meta charset="utf-8" /></head>
<body style="margin:0;padding:0;background:#f4f2ef;">
<table role="presentation" width="100%" cellpadding="0" cellspacing="0"><tr><td align="center" style="padding:28px 12px;">
<table role="presentation" width="560" cellpadding="0" cellspacing="0"
 style="max-width:560px;width:100%;background:#fff;border-radius:14px;border:1px solid #e5e1db;">
<tr><td style="padding:36px;font-family:Arial,Helvetica,sans-serif;color:#1a1a1a;">
<p>Here are your Power Tools downloads, as requested.</p>
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="margin:18px 0;">${rows}</table>
<p style="font-size:13px;color:#666;">These links stay active for ${LINK_TTL_HOURS} hours.
You can request a fresh set any time at
<a href="${SITE_URL}/power-tools/downloads" style="color:#c0522a;">${SITE_URL.replace(/^https?:\/\//, '')}/power-tools/downloads</a>.</p>
</td></tr></table></td></tr></table></body></html>`,
          { replyTo: REPLY_TO }
        );
      }
    }
  } catch (err) {
    // Log, but still answer identically — an error here must not become a
    // signal about whether the address exists.
    console.error('[downloads/resend] lookup or send failed:', err);
  }

  return NextResponse.json(SAME_ANSWER);
}
