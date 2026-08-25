// What happens after a Power Tools purchase clears.
//
// Digital products get signed, expiring download links by email. Live classes
// have nothing to download, so the buyer gets a confirmation explaining that
// Mark will be in touch with cohort details.
//
// Every step fails independently and is logged. The webhook always acks 200
// once the signature verifies, because a non-200 makes Stripe retry the whole
// event and a retry must never mean a second charge's worth of emails.

import { PRODUCTS_BY_KEY, entitlementsFor, formatPrice } from './products';
import { buildDownloadLinks, LINK_TTL_HOURS } from './downloads';
import { sendSimpleEmail } from './mailgun-send';

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://drmarkpirtle.com';
const ADMIN_EMAIL = process.env.ADMIN_NOTIFICATION_EMAIL;
const REPLY_TO = process.env.NEWSLETTER_REPLY_TO;

export interface PowerToolsPurchase {
  productKey: string;
  email: string;
  name: string | null;
  amountTotal: number | null;
  currency: string | null;
  sessionId: string;
}

function esc(s: string): string {
  return s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
}

function shell(inner: string): string {
  return `<!DOCTYPE html><html lang="en"><head><meta charset="utf-8" />
<meta name="viewport" content="width=device-width, initial-scale=1.0" /></head>
<body style="margin:0;padding:0;background-color:#f4f2ef;">
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0"><tr>
<td align="center" style="padding:28px 12px;">
<table role="presentation" width="560" cellpadding="0" cellspacing="0" border="0"
 style="max-width:560px;width:100%;background:#ffffff;border-radius:14px;border:1px solid #e5e1db;">
<tr><td style="padding:36px;font-family:Arial,Helvetica,sans-serif;color:#1a1a1a;">
${inner}
</td></tr></table></td></tr></table></body></html>`;
}

/** Buyer receipt with download links, or class confirmation. */
async function emailBuyer(purchase: PowerToolsPurchase): Promise<void> {
  const product = PRODUCTS_BY_KEY[purchase.productKey];
  if (!product) throw new Error(`Unknown product_key: ${purchase.productKey}`);

  const greeting = purchase.name ? `Hi ${esc(purchase.name.split(' ')[0])},` : 'Hi there,';
  let body: string;

  if (product.digitalDelivery) {
    const links = buildDownloadLinks(entitlementsFor(product.key), SITE_URL);

    if (links.length === 0) {
      // Checkout is supposed to block this, so reaching here is a real fault.
      // Tell the buyer something true and useful rather than sending nothing.
      console.error(`[fulfilment] No files mapped for ${product.key} — buyer ${purchase.email} has paid`);
      body = `<p>${greeting}</p>
<p>Thank you for buying <strong>${esc(product.name)}</strong>.</p>
<p>Your files are being prepared and will arrive in a separate email shortly.
If you have not received them within one business day, just reply to this
message and we will send them straight over.</p>`;
    } else {
      const rows = links
        .map(
          (l) => `<tr><td style="padding:8px 0;border-bottom:1px solid #eee;">
<a href="${l.url}" style="color:#c0522a;font-weight:bold;text-decoration:none;">${esc(l.filename)}</a>
</td></tr>`
        )
        .join('');
      body = `<p>${greeting}</p>
<p>Thank you for buying <strong>${esc(product.name)}</strong>. Your ${links.length === 1 ? 'download is' : 'downloads are'} below.</p>
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="margin:18px 0;">${rows}</table>
<p style="font-size:13px;color:#666;">These links stay active for ${LINK_TTL_HOURS} hours.
If they expire, you can get a fresh set any time at
<a href="${SITE_URL}/power-tools/downloads" style="color:#c0522a;">${SITE_URL.replace(/^https?:\/\//, '')}/power-tools/downloads</a>
using this email address.</p>`;
    }
  } else {
    body = `<p>${greeting}</p>
<p>Thank you for joining <strong>${esc(product.name)}</strong>.</p>
<p>This is a live class rather than a download. Mark will be in touch directly
with the schedule, the joining link, and anything you need beforehand.</p>
<p>If you have questions in the meantime, just reply to this email.</p>`;
  }

  await sendSimpleEmail(
    purchase.email,
    product.digitalDelivery ? `Your ${product.name} download` : `You're in — ${product.name}`,
    shell(body),
    { replyTo: REPLY_TO }
  );
}

/** Lets Mark know a sale happened without him having to watch Stripe. */
async function notifyAdmin(purchase: PowerToolsPurchase): Promise<void> {
  if (!ADMIN_EMAIL) return;
  const product = PRODUCTS_BY_KEY[purchase.productKey];
  const amount =
    purchase.amountTotal != null
      ? formatPrice(purchase.amountTotal)
      : '(unknown)';
  await sendSimpleEmail(
    ADMIN_EMAIL,
    `[Power Tools] ${product?.name ?? purchase.productKey} — ${amount}`,
    shell(`<p><strong>New Power Tools purchase</strong></p>
<p>
Product: ${esc(product?.name ?? purchase.productKey)}<br />
Amount: ${amount}<br />
Buyer: ${esc(purchase.name ?? '(no name)')} &lt;${esc(purchase.email)}&gt;<br />
Stripe session: ${esc(purchase.sessionId)}
</p>
${product && !product.digitalDelivery ? '<p><strong>This is a live class — the buyer is expecting you to contact them with cohort details.</strong></p>' : ''}`),
    { replyTo: purchase.email }
  );
}

export async function handlePowerToolsPurchase(purchase: PowerToolsPurchase): Promise<void> {
  const results = await Promise.allSettled([emailBuyer(purchase), notifyAdmin(purchase)]);
  results.forEach((r, i) => {
    if (r.status === 'rejected') {
      console.error(`[fulfilment] step ${i === 0 ? 'buyer email' : 'admin notify'} failed:`, r.reason);
    }
  });
}
