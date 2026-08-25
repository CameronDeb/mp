// Creates a Stripe Checkout Session for one Power Tools product.
//
// The price is never taken from the request. The client sends only a product
// key; the amount is resolved from the live Stripe product created by
// scripts/sync-stripe-products.mjs, so a tampered request cannot change what
// is charged.
//
// The product key is written into session metadata so the webhook knows
// exactly what was bought without having to parse a line item description.

import { NextRequest, NextResponse } from 'next/server';
import Stripe from 'stripe';
import { PRODUCTS_BY_KEY } from '@/lib/products';
import { isDeliverable } from '@/lib/downloads';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

const STRIPE_SECRET_KEY = process.env.STRIPE_SECRET_KEY;

/** Finds the live Stripe product carrying our product_key. */
async function findStripeProduct(stripe: Stripe, key: string): Promise<Stripe.Product | null> {
  try {
    const found = await stripe.products.search({
      query: `metadata['product_key']:'${key}'`,
      limit: 1,
    });
    if (found.data[0]) return found.data[0];
  } catch {
    /* search index can lag a fresh write; fall through to the scan */
  }
  for await (const candidate of stripe.products.list({ limit: 100, active: true })) {
    if (candidate.metadata?.product_key === key) return candidate;
  }
  return null;
}

export async function POST(req: NextRequest) {
  if (!STRIPE_SECRET_KEY || STRIPE_SECRET_KEY.includes('xxx')) {
    return NextResponse.json({ error: 'Payments are not configured yet.' }, { status: 503 });
  }

  let productKey: string;
  try {
    const body = await req.json();
    productKey = String(body.product_key ?? '');
  } catch {
    return NextResponse.json({ error: 'product_key required' }, { status: 400 });
  }

  const product = PRODUCTS_BY_KEY[productKey];
  if (!product) {
    return NextResponse.json({ error: 'Unknown product.' }, { status: 404 });
  }

  // Refuse to take money for a download we cannot deliver. The shop should
  // already be showing this as Coming Soon, so reaching here means the two
  // disagreed — better a clear error than a sale with nothing behind it.
  if (!isDeliverable(product.key, product.digitalDelivery)) {
    return NextResponse.json(
      { error: 'This product is not available for purchase yet.' },
      { status: 409 }
    );
  }

  const stripe = new Stripe(STRIPE_SECRET_KEY, { apiVersion: '2026-04-22.dahlia' });

  const stripeProduct = await findStripeProduct(stripe, product.key);
  if (!stripeProduct?.default_price) {
    console.error(`[checkout] No live Stripe product/price for ${product.key}`);
    return NextResponse.json({ error: 'This product is not available right now.' }, { status: 503 });
  }
  const priceId =
    typeof stripeProduct.default_price === 'string'
      ? stripeProduct.default_price
      : stripeProduct.default_price.id;

  const origin =
    req.headers.get('origin') ?? process.env.NEXT_PUBLIC_SITE_URL ?? 'https://drmarkpirtle.com';

  try {
    const session = await stripe.checkout.sessions.create({
      mode: 'payment',
      line_items: [{ price: priceId, quantity: 1 }],
      success_url: `${origin}/power-tools/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${origin}/power-tools`,
      // Needed so fulfilment has somewhere to send the download links.
      customer_creation: 'always',
      metadata: {
        product_key: product.key,
        category: product.category,
      },
      // Duplicated onto the PaymentIntent so the key survives on the charge
      // record even if the session is later expired or cleaned up.
      payment_intent_data: {
        metadata: { product_key: product.key },
      },
    });

    return NextResponse.json({ url: session.url });
  } catch (err) {
    console.error('[checkout] Stripe session creation failed:', err);
    return NextResponse.json({ error: 'Could not start checkout.' }, { status: 500 });
  }
}
