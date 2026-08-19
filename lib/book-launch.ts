// Server-side handling for a completed Built This Way Launch Team purchase.
//
// Called by the Stripe webhook (app/api/stripe/webhook) after `checkout.session.completed`.
// Three things happen, and — following the same pattern as lib/inquiries.ts — they fail
// INDEPENDENTLY: a Directus outage must not stop the buyer's receipt, and a bounced
// receipt must not stop the admin being told a sale happened. The webhook always returns
// 200 once the signature is verified, so Stripe never retries a purchase into duplicate
// emails; every failure below is logged, not thrown.

import { sendAutoReply, sendAdminNotification, ADMIN_EMAIL } from './form-emails';
import { directusItemUrl } from './inquiries';

const DIRECTUS_URL = process.env.NEXT_PUBLIC_DIRECTUS_URL || 'http://localhost:8055';
const DIRECTUS_TOKEN = process.env.DIRECTUS_STATIC_TOKEN;

const authHeaders: Record<string, string> = {
  'Content-Type': 'application/json',
  ...(DIRECTUS_TOKEN ? { Authorization: `Bearer ${DIRECTUS_TOKEN}` } : {}),
};

export interface BookPurchase {
  email: string;
  name: string | null;
  /** Product / tier name pulled from the Stripe line item, e.g. "Practice Cohort". */
  product: string | null;
  /** Total in the smallest currency unit (cents), straight from Stripe. */
  amountTotal: number | null;
  currency: string | null;
  /** Any metadata set on the Payment Link in the Stripe dashboard (e.g. { tier }). */
  metadata?: Record<string, string>;
}

/** Formats a Stripe amount (cents) as a display string, e.g. 29700 → "$297.00". */
function formatAmount(amountTotal: number | null, currency: string | null): string | null {
  if (amountTotal == null) return null;
  const value = (amountTotal / 100).toFixed(2);
  const symbol = currency?.toUpperCase() === 'USD' ? '$' : '';
  return symbol ? `${symbol}${value}` : `${value} ${currency?.toUpperCase() ?? ''}`.trim();
}

/**
 * Adds the buyer to newsletter_subscribers (or re-activates them if they'd unsubscribed),
 * so future newsletters reach them. Idempotent — a second call for the same email is a no-op.
 * Returns the Directus row id, or null if the write could not happen.
 */
async function subscribeBuyer(email: string, name: string | null): Promise<number | null> {
  if (!DIRECTUS_TOKEN) return null;

  const findRes = await fetch(
    `${DIRECTUS_URL}/items/newsletter_subscribers?filter[email][_eq]=${encodeURIComponent(email)}&limit=1&fields=id,status`,
    { headers: authHeaders, cache: 'no-store' }
  );
  if (!findRes.ok) throw new Error(`Directus lookup failed (${findRes.status}): ${await findRes.text()}`);
  const { data } = (await findRes.json()) as { data: Array<{ id: number; status: string }> };
  const existing = data[0];

  if (existing) {
    if (existing.status !== 'Subscribed') {
      const patchRes = await fetch(`${DIRECTUS_URL}/items/newsletter_subscribers/${existing.id}`, {
        method: 'PATCH',
        headers: authHeaders,
        body: JSON.stringify({ status: 'Subscribed', subscribed_at: new Date().toISOString(), unsubscribed_at: null }),
      });
      if (!patchRes.ok) throw new Error(`Directus re-subscribe failed (${patchRes.status}): ${await patchRes.text()}`);
    }
    return existing.id;
  }

  const createRes = await fetch(`${DIRECTUS_URL}/items/newsletter_subscribers?fields=id`, {
    method: 'POST',
    headers: authHeaders,
    body: JSON.stringify({
      email,
      name,
      status: 'Subscribed',
      subscribed_at: new Date().toISOString(),
      source: 'Book Launch Team',
    }),
  });
  if (!createRes.ok) throw new Error(`Directus create failed (${createRes.status}): ${await createRes.text()}`);
  const created = (await createRes.json()) as { data: { id: number } };
  return created.data.id;
}

/** The buyer's receipt — sent from hello@, not the newsletter sender. */
async function sendBuyerWelcome(purchase: BookPurchase): Promise<void> {
  const firstName = purchase.name?.split(' ')[0] || null;
  const tierLine = purchase.product ? `You joined at the ${purchase.product} level. ` : '';

  await sendAutoReply({
    to: purchase.email,
    subject: 'Welcome to the Built This Way Launch Team',
    heading: 'Welcome to the Launch Team.',
    paragraphs: [
      firstName ? `Hi ${firstName},` : 'Hi there,',
      `Thank you for joining the Built This Way Launch Team. ${tierLine}Your place is confirmed, and you're now part of the group helping bring this work into the world.`,
      "Over the next few days you'll receive everything you need to get started, including how to access what's included with your tier.",
      'In the meantime, think about one pattern, one habit, or one relationship where you want to show up differently over the next 90 days. That is where the practice begins.',
    ],
    footnote: 'You are receiving this because you joined the Built This Way Launch Team.',
  });
}

/** Tells Mark a sale came through, with the tier, amount, and buyer details. */
async function notifyAdminOfPurchase(purchase: BookPurchase, subscriberId: number | null): Promise<void> {
  if (!ADMIN_EMAIL) return;
  await sendAdminNotification({
    subject: `[Launch Team] New purchase — ${purchase.product ?? 'Built This Way'} — ${purchase.email}`,
    heading: 'New Built This Way Launch Team purchase',
    fields: [
      ['Buyer', purchase.name],
      ['Email', purchase.email],
      ['Tier', purchase.product],
      ['Amount', formatAmount(purchase.amountTotal, purchase.currency)],
      ...(purchase.metadata?.tier ? [['Tier code', purchase.metadata.tier] as [string, string]] : []),
    ],
    replyTo: purchase.email,
    directusUrl: subscriberId != null ? directusItemUrl('newsletter_subscribers', subscriberId) : undefined,
  });
}

/**
 * Orchestrates the three post-purchase steps, tolerating partial failure.
 * Never throws — the webhook must acknowledge the event regardless.
 */
export async function handleBookPurchase(purchase: BookPurchase): Promise<void> {
  let subscriberId: number | null = null;
  try {
    subscriberId = await subscribeBuyer(purchase.email, purchase.name);
  } catch (err) {
    console.error('[book-launch] Directus subscribe failed:', err);
  }

  try {
    await sendBuyerWelcome(purchase);
  } catch (err) {
    console.error('[book-launch] Buyer welcome email failed:', err);
  }

  try {
    await notifyAdminOfPurchase(purchase, subscriberId);
  } catch (err) {
    console.error('[book-launch] Admin notification failed:', err);
  }
}
