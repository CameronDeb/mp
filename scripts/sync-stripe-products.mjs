/**
 * Creates or updates the Power Tools catalogue in Stripe from lib/products.ts.
 *
 *   node scripts/sync-stripe-products.mjs            # dry run, changes nothing
 *   node scripts/sync-stripe-products.mjs --apply    # actually write to Stripe
 *
 * Safe to run repeatedly. Products are matched on metadata.product_key rather
 * than on name, so renaming a product updates it instead of creating a second
 * one. Stripe prices are immutable, so a price change means creating a new
 * price, pointing the product's default_price at it, and archiving the old one
 * — never deleting it, because past payments still reference it.
 *
 * The key is read from .env (STRIPE_SECRET_KEY) and never printed. Whether it
 * writes to test or live data is determined entirely by which key that is;
 * the script reports which mode it is in before doing anything.
 */

import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import Stripe from 'stripe';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const APPLY = process.argv.includes('--apply');

// Read the catalogue out of the TS module without needing a build step.
async function loadProducts() {
  const src = fs.readFileSync(path.join(ROOT, 'lib/products.ts'), 'utf8');
  const start = src.indexOf('export const PRODUCTS: Product[] = [');
  const end = src.indexOf('\n];', start);
  if (start === -1 || end === -1) throw new Error('Could not locate PRODUCTS in lib/products.ts');
  const body = src.slice(src.indexOf('[', start), end + 2);
  // The literal is plain data (strings, numbers, booleans, arrays) plus
  // comments, so evaluating it is equivalent to parsing it.
  return new Function(`return ${body}`)();
}

function loadEnv() {
  const envPath = path.join(ROOT, '.env');
  if (!fs.existsSync(envPath)) return {};
  const out = {};
  for (const line of fs.readFileSync(envPath, 'utf8').split('\n')) {
    const t = line.trim();
    if (!t || t.startsWith('#') || !t.includes('=')) continue;
    const i = t.indexOf('=');
    out[t.slice(0, i)] = t.slice(i + 1).trim().replace(/^["']|["']$/g, '');
  }
  return out;
}

async function main() {
  const env = { ...loadEnv(), ...process.env };
  const key = env.STRIPE_SECRET_KEY;

  if (!key || /^sk_(test|live)_xxx/.test(key) || key === 'sk_test_xxx') {
    console.error('STRIPE_SECRET_KEY is missing or still a placeholder in .env.');
    console.error('Add a real key from the Stripe dashboard, then re-run.');
    process.exit(1);
  }

  const mode = key.startsWith('sk_live_') ? 'LIVE' : 'TEST';
  const stripe = new Stripe(key, { apiVersion: '2026-04-22.dahlia' });

  console.log(`\nStripe mode : ${mode}${mode === 'LIVE' ? '  ** real money **' : ''}`);
  console.log(`Action      : ${APPLY ? 'APPLY (writing)' : 'DRY RUN (no changes)'}\n`);

  const products = await loadProducts();
  let created = 0, updated = 0, repriced = 0, unchanged = 0;

  for (const p of products) {
    // Match on our own key. Search indexing lags writes, so fall back to a
    // list scan — otherwise a re-run moments later duplicates everything.
    let existing = null;
    try {
      const found = await stripe.products.search({
        query: `metadata['product_key']:'${p.key}'`,
        limit: 1,
      });
      existing = found.data[0] ?? null;
    } catch {
      /* search unavailable on brand-new accounts; fall through to the scan */
    }
    if (!existing) {
      for await (const candidate of stripe.products.list({ limit: 100 })) {
        if (candidate.metadata?.product_key === p.key) { existing = candidate; break; }
      }
    }

    const fields = {
      name: p.name,
      description: p.description,
      metadata: {
        product_key: p.key,
        category: p.category,
        includes: p.includes,
        digital_delivery: String(p.digitalDelivery),
        ...(p.contains ? { contains: p.contains.join(',') } : {}),
      },
    };

    if (!existing) {
      console.log(`  CREATE   ${p.key}  ${p.name}  $${(p.priceCents / 100).toFixed(2)}`);
      created++;
      if (!APPLY) continue;
      const product = await stripe.products.create(fields);
      const price = await stripe.prices.create({
        product: product.id,
        unit_amount: p.priceCents,
        currency: 'usd',
      });
      await stripe.products.update(product.id, { default_price: price.id });
      continue;
    }

    // Product exists. Refresh its copy, then reconcile the price.
    const nameChanged = existing.name !== p.name || existing.description !== p.description;
    if (nameChanged) {
      console.log(`  UPDATE   ${p.key}  copy changed`);
      updated++;
      if (APPLY) await stripe.products.update(existing.id, fields);
    }

    const currentPriceId =
      typeof existing.default_price === 'string'
        ? existing.default_price
        : existing.default_price?.id;
    const current = currentPriceId ? await stripe.prices.retrieve(currentPriceId) : null;

    if (current && current.unit_amount === p.priceCents && current.currency === 'usd') {
      if (!nameChanged) unchanged++;
      continue;
    }

    console.log(
      `  REPRICE  ${p.key}  ${current ? '$' + (current.unit_amount / 100).toFixed(2) : 'none'}` +
      ` -> $${(p.priceCents / 100).toFixed(2)}`
    );
    repriced++;
    if (!APPLY) continue;

    const price = await stripe.prices.create({
      product: existing.id,
      unit_amount: p.priceCents,
      currency: 'usd',
    });
    await stripe.products.update(existing.id, { default_price: price.id });
    // Archive rather than delete: past payments still reference the old price.
    if (current) await stripe.prices.update(current.id, { active: false });
  }

  console.log(
    `\n${APPLY ? 'Applied' : 'Would apply'}: ` +
    `${created} created, ${updated} updated, ${repriced} repriced, ${unchanged} unchanged.`
  );
  if (!APPLY) console.log('Re-run with --apply to write these to Stripe.\n');
}

main().catch((err) => {
  console.error('\nFailed:', err.message);
  process.exit(1);
});
