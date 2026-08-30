// The Power Tools catalogue — single source of truth for the shop and for
// Stripe. Prices come from Mark's "SkillfullyAware Product Pricing" doc
// (2026-08-23); see docs/POWER_TOOLS_PRICING.md for the original and for the
// open questions.
//
// Prices are in cents. Mark's instruction is explicit: these are standard
// customer-facing prices and NO launch pricing is to be coded at this stage.
//
// `key` is the stable identifier. It is written to Stripe as
// metadata.product_key and is what the sync script matches on, so changing a
// key orphans the existing Stripe product. Don't.

export type ProductCategory = 'workbook' | 'bundle' | 'meditation' | 'class';

export interface Product {
  key: string;
  name: string;
  /** Shown on the Stripe checkout page and on the product card. */
  description: string;
  priceCents: number;
  category: ProductCategory;
  /** What the buyer actually receives. Drives the card's "what's included". */
  includes: string;
  /** Live classes are scheduled seats, not instant downloads. */
  digitalDelivery: boolean;
  /** Cover art shown on the shop card. Cards fall back to a plain header. */
  image?: string;
  /** Product keys contained in a bundle, for entitlement on fulfilment. */
  contains?: string[];
  /**
   * Names this product went by in Stripe before the catalogue existed. The
   * sync adopts a match instead of creating a duplicate alongside it, which
   * matters because the older product may already have been sold.
   */
  legacyNames?: string[];
}

export const PRODUCTS: Product[] = [
  // ── Workbooks ──────────────────────────────────────────────────────────
  {
    key: 'becoming_skillfullyaware_workbook',
    image: '/images/products/becoming-skillfullyaware.webp',
    name: 'Becoming SkillfullyAware — See Yourself',
    description:
      'Train attention, expand awareness, and practice seeing your patterns as they happen so you can respond with more care and skill.',
    priceCents: 2900,
    category: 'workbook',
    includes: 'Workbook (PDF)',
    digitalDelivery: true,
    // Created by hand in live Stripe on 2026-03-07 at $24, before this
    // catalogue existed. Adopted rather than duplicated.
    legacyNames: ['Becoming SkillfullyAware Workbook'],
  },
  {
    key: 'unfinished_business_workbook',
    image: '/images/products/unfinished-business.webp',
    name: 'Unfinished Business — Understand Yourself',
    description:
      'Explore the hidden needs, fears, projections, and protective patterns beneath repeated reactions so you can understand yourself more clearly.',
    priceCents: 2900,
    category: 'workbook',
    includes: 'Workbook (PDF)',
    digitalDelivery: true,
  },
  {
    key: 'raising_awareness_workbook',
    image: '/images/products/raising-awareness.webp',
    name: 'Raising Awareness — Evolve Yourself',
    description:
      'Widen your perspective, increase maturity, and practice responding from a larger view with greater wisdom and care.',
    priceCents: 2900,
    category: 'workbook',
    includes: 'Workbook (PDF)',
    digitalDelivery: true,
  },

  // ── Bundle ─────────────────────────────────────────────────────────────
  // The three workbooks are designed as a progression, so this is the offer
  // Mark wants emphasised. 3 x $29 = $87 against $69, so the $18 saving is
  // real and may be shown. His docs forbid implying savings that aren't.
  {
    key: 'power_tools_bundle',
    image: '/images/products/workbook-bundle.webp',
    name: 'Complete Power Tools Workbook Bundle',
    description:
      'A three-workbook practice sequence to help you see your patterns, understand what drives them, and respond from a wider, more SkillfullyAware perspective. Saves $18 against buying them separately.',
    priceCents: 6900,
    category: 'bundle',
    includes: 'Three workbooks (PDF)',
    digitalDelivery: true,
    contains: [
      'becoming_skillfullyaware_workbook',
      'unfinished_business_workbook',
      'raising_awareness_workbook',
    ],
  },

  // ── Guided meditation programs ─────────────────────────────────────────
  // No meditation bundle: the Comprehensive Program already contains the other
  // two, and Mark's diagnosis doc explicitly rules one out.
  {
    key: 'feel_better_series',
    name: 'Feel Better Series',
    description:
      'Guided meditations for stress, discomfort, emotional activation, and body-based reactivity, for returning to steadiness.',
    priceCents: 4900,
    category: 'meditation',
    includes: 'Workbook + 10 audio tracks',
    digitalDelivery: true,
  },
  {
    key: 'learn_to_meditate_series',
    name: 'Learn to Meditate Series',
    description:
      'Step-by-step meditation training covering attention, posture, breath, and what to do with a wandering mind.',
    priceCents: 8900,
    category: 'meditation',
    includes: 'Workbook + 27 audio tracks',
    digitalDelivery: true,
  },
  {
    key: 'comprehensive_meditation_program',
    name: 'Comprehensive SkillfullyAware Meditation Program',
    description:
      'The complete guided practice library, including Learn to Meditate and the Feel Better Series plus advanced and specialty practices.',
    priceCents: 14900,
    category: 'meditation',
    includes: 'Workbook + 44 audio tracks',
    digitalDelivery: true,
    contains: ['learn_to_meditate_series', 'feel_better_series'],
  },

  // ── Live classes ───────────────────────────────────────────────────────
  // Not downloads. Buying one books a seat in a cohort, so fulfilment is a
  // confirmation and a schedule rather than a signed download link.
  {
    key: 'project_skillfullyaware_live_class',
    name: 'Project SkillfullyAware',
    description:
      'A live six-week online class applying SkillfullyAware practices to attention, emotion, habits, reactions, and daily pattern change.',
    priceCents: 29900,
    category: 'class',
    includes: 'Live 6-week online class',
    digitalDelivery: false,
  },
  {
    key: 'mindfully_overcoming_addictive_behaviors_live_class',
    name: 'Mindfully Overcoming Addictive Behaviors',
    description:
      'A live ten-week online class for working with addictive or compulsive patterns, nervous system responses, and the protective strategies underneath them. Educational support, not treatment.',
    priceCents: 49900,
    category: 'class',
    includes: 'Live 10-week online class',
    digitalDelivery: false,
  },
];

export const PRODUCTS_BY_KEY: Record<string, Product> = Object.fromEntries(
  PRODUCTS.map((p) => [p.key, p])
);

export function formatPrice(cents: number): string {
  return `$${(cents / 100).toFixed(cents % 100 === 0 ? 0 : 2)}`;
}

/**
 * Everything a buyer is entitled to, flattening bundles one level and
 * de-duplicating. Bundles never nest more than one deep today, but the
 * recursion keeps it honest if that changes.
 */
export function entitlementsFor(key: string, seen = new Set<string>()): string[] {
  const product = PRODUCTS_BY_KEY[key];
  if (!product || seen.has(key)) return [];
  seen.add(key);
  if (!product.contains) return [key];
  return product.contains.flatMap((child) => entitlementsFor(child, seen));
}
