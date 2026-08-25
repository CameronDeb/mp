// Stripe webhook — the source of truth for post-purchase side effects on the
// Built This Way Launch Team. Each tier button on /power-tools/book is a Stripe
// Payment Link, so there is no server-created Checkout Session to hook into on the
// way out; instead Stripe calls us here once payment completes.
//
// Stripe dashboard setup (one-time):
//   1. Developers → Webhooks → Add endpoint → https://<site>/api/stripe/webhook
//   2. Subscribe to the `checkout.session.completed` event
//   3. Copy the signing secret into STRIPE_WEBHOOK_SECRET
//
// The buyer receipt + admin notification + newsletter subscribe all happen in
// lib/book-launch.ts and fail independently. We always ack with 200 once the
// signature verifies, so Stripe never retries a sale into duplicate emails.

import { NextRequest, NextResponse } from 'next/server';
import { handleBookPurchase, type BookPurchase } from '@/lib/book-launch';
import { handlePowerToolsPurchase } from '@/lib/fulfilment';
import { PRODUCTS_BY_KEY } from '@/lib/products';

// Stripe signature verification needs the raw request body and Node crypto.
export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

const STRIPE_SECRET_KEY = process.env.STRIPE_SECRET_KEY;
const STRIPE_WEBHOOK_SECRET = process.env.STRIPE_WEBHOOK_SECRET;

export async function POST(req: NextRequest) {
  if (!STRIPE_SECRET_KEY || !STRIPE_WEBHOOK_SECRET) {
    console.error('[stripe/webhook] Missing STRIPE_SECRET_KEY or STRIPE_WEBHOOK_SECRET');
    return NextResponse.json({ error: 'Webhook not configured.' }, { status: 500 });
  }

  const signature = req.headers.get('stripe-signature');
  if (!signature) {
    return NextResponse.json({ error: 'Missing stripe-signature header.' }, { status: 400 });
  }

  const Stripe = (await import('stripe')).default;
  const stripe = new Stripe(STRIPE_SECRET_KEY, { apiVersion: '2026-04-22.dahlia' });

  // Raw body is required — parsing it (e.g. req.json()) would break the signature check.
  const rawBody = await req.text();

  let event: import('stripe').Stripe.Event;
  try {
    event = await stripe.webhooks.constructEventAsync(rawBody, signature, STRIPE_WEBHOOK_SECRET);
  } catch (err) {
    console.error('[stripe/webhook] Signature verification failed:', err);
    return NextResponse.json({ error: 'Invalid signature.' }, { status: 400 });
  }

  if (event.type !== 'checkout.session.completed') {
    // Acknowledge everything else so Stripe stops resending it.
    return NextResponse.json({ received: true });
  }

  const session = event.data.object as import('stripe').Stripe.Checkout.Session;

  const email = session.customer_details?.email ?? null;
  if (!email) {
    console.error('[stripe/webhook] checkout.session.completed with no customer email:', session.id);
    return NextResponse.json({ received: true });
  }

  // Power Tools sessions are created by /api/checkout and carry the product key
  // in metadata, so fulfilment is unambiguous — no parsing of line item text.
  // Anything without that key is a book-launch payment link and follows the
  // original path.
  const productKey = session.metadata?.product_key;
  if (productKey && PRODUCTS_BY_KEY[productKey]) {
    await handlePowerToolsPurchase({
      productKey,
      email,
      name: session.customer_details?.name ?? null,
      amountTotal: session.amount_total,
      currency: session.currency,
      sessionId: session.id,
    });
    return NextResponse.json({ received: true });
  }

  // The line item carries the tier name; it isn't on the session by default.
  let product: string | null = null;
  try {
    const lineItems = await stripe.checkout.sessions.listLineItems(session.id, { limit: 1 });
    product = lineItems.data[0]?.description ?? null;
  } catch (err) {
    console.error('[stripe/webhook] Could not list line items:', err);
  }

  const purchase: BookPurchase = {
    email,
    name: session.customer_details?.name ?? null,
    product,
    amountTotal: session.amount_total,
    currency: session.currency,
    metadata: (session.metadata as Record<string, string>) ?? undefined,
  };

  await handleBookPurchase(purchase);

  return NextResponse.json({ received: true });
}
