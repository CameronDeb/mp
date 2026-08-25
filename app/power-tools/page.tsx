import type { Metadata } from 'next';
import Link from 'next/link';
import Image from 'next/image';
import { PRODUCTS_BY_KEY } from '@/lib/products';
import { isDeliverable } from '@/lib/downloads';
import { ProductCard, type CardProduct } from '@/components/power-tools/ProductCard';

export const metadata: Metadata = {
  title: 'Power Tools | Classes, Workbooks & Meditations | Dr. Mark Pirtle',
  description:
    'Power Tools are practical classes, workbooks, guided meditations, books and free tools that help you keep practicing after the first insight.',
};

/**
 * The Power Tools shop.
 *
 * Structure follows Mark's "Power Tools Page Diagnosis" and its companion
 * prompt (Aug 2026): a guided shop rather than a catalogue, ordered free tool →
 * book → workbooks → meditations → classes, with the two true bundles featured
 * before the individual products.
 *
 * Deliberately absent, per those same docs:
 *  - No "Complete Practice Path" bundle. Mark never priced it, and it is the
 *    only offer containing a physical book, which would need shipping.
 *  - No meditation bundle. The Comprehensive Program already contains Learn to
 *    Meditate and the Feel Better Series, so a bundle of the three would be
 *    selling the same audio twice.
 *  - The free reflection tool is never bundled. It stays a lead generator.
 *
 * Prices and availability come from lib/products.ts and the download manifest,
 * so nothing here needs editing when Mark's files land — a product flips from
 * "Coming soon" to buyable as soon as it has files.
 */

/** "Best for" lines, from the diagnosis doc's buyer-need column. */
const BEST_FOR: Record<string, string> = {
  becoming_skillfullyaware_workbook:
    'Noticing your patterns sooner and strengthening attention.',
  unfinished_business_workbook:
    'Working with shadow, projection, resistance, anger and boundaries.',
  raising_awareness_workbook:
    'Expanding perspective, maturity and the ability to respond from a wider view.',
  power_tools_bundle:
    'Readers who want to practice the ideas from Built This Way on the page.',
  feel_better_series:
    'Stress, reactivity, and returning to steadiness in the body.',
  learn_to_meditate_series:
    'Anyone who wants a clear foundation for meditating.',
  comprehensive_meditation_program:
    'One complete audio practice library, rather than choosing series by series.',
  project_skillfullyaware_live_class:
    'People who want live structure, guidance and accountability.',
  mindfully_overcoming_addictive_behaviors_live_class:
    'Working with addictive or compulsive patterns alongside live support.',
};

const BADGES: Record<string, string> = {
  power_tools_bundle: 'Best value',
  comprehensive_meditation_program: 'Full library',
};

function card(key: string): CardProduct {
  const p = PRODUCTS_BY_KEY[key];
  return {
    ...p,
    deliverable: isDeliverable(p.key, p.digitalDelivery),
    bestFor: BEST_FOR[key],
    badge: BADGES[key],
  };
}

const CATEGORIES = [
  { label: 'Free Tool', copy: 'Use one real reaction and experience the work in a few minutes.', href: '#free-tool' },
  { label: 'Book & Media', copy: 'Understand the framework through the book and companion resources.', href: '#book-media' },
  { label: 'Workbooks', copy: 'Practice on the page with guided reflection and exercises.', href: '#workbooks' },
  { label: 'Meditations', copy: 'Guided audio for attention, stress, reactivity and awareness.', href: '#meditation-programs' },
  { label: 'Classes', copy: 'Learn live with structure, guidance and accountability.', href: '#online-classes' },
];

function SectionHeading({ id, eyebrow, title, intro }: { id?: string; eyebrow: string; title: string; intro?: string }) {
  return (
    <div id={id} style={{ marginBottom: '2rem', scrollMarginTop: '7rem' }}>
      <div className="section-divider" />
      <span className="eyebrow">{eyebrow}</span>
      <h2 style={{ fontSize: 'clamp(1.5rem, 3vw, 2.1rem)', fontWeight: 800, color: 'var(--color-brand-text)', margin: '0.75rem 0 0.5rem', lineHeight: 1.2 }}>
        {title}
      </h2>
      {intro && (
        <p style={{ fontSize: '1.0125rem', lineHeight: 1.7, color: 'var(--color-brand-text-muted)', maxWidth: '62ch', margin: 0 }}>
          {intro}
        </p>
      )}
    </div>
  );
}

const GRID: React.CSSProperties = {
  display: 'grid',
  gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 17rem), 1fr))',
  gap: '1.25rem',
};

export default function PowerToolsPage() {
  return (
    <main style={{ fontFamily: 'var(--font-sans)' }}>

      {/* ── HERO ── */}
      <section style={{ backgroundColor: 'var(--color-brand-cream)', padding: 'clamp(3.5rem, 7vw, 5.5rem) 1.5rem', textAlign: 'center' }}>
        <div style={{ maxWidth: '780px', margin: '0 auto' }}>
          <span className="eyebrow">Power Tools</span>
          <h1 style={{ fontSize: 'clamp(2rem, 4.5vw, 3.25rem)', fontWeight: 800, letterSpacing: '-0.03em', lineHeight: 1.1, color: 'var(--color-brand-text)', margin: '1rem 0 1.5rem' }}>
            Power Tools for Practicing Change
          </h1>
          <p style={{ fontSize: 'clamp(1rem, 1.8vw, 1.15rem)', lineHeight: 1.75, color: 'var(--color-brand-text-muted)', maxWidth: '60ch', margin: '0 auto 1rem' }}>
            Insight matters, but insight alone rarely changes a pattern. Power Tools are practical
            classes, workbooks, guided meditations, books and free tools that help you keep
            practicing after the first insight.
          </p>
          <p style={{ fontSize: '1.0125rem', color: 'var(--color-brand-text-muted)', marginBottom: '2rem' }}>
            Choose the support that fits what you are working with today.
          </p>
          <div style={{ display: 'flex', gap: '0.875rem', justifyContent: 'center', flexWrap: 'wrap' }}>
            <a href="#featured" className="btn-primary" style={{ padding: '0.875rem 2rem' }}>Browse the Shop</a>
            <a
              href="https://www.whydidireactthatway.com/?utm_source=drmarkpirtle&utm_medium=powertools&utm_campaign=free_tool"
              target="_blank"
              rel="noopener noreferrer"
              style={{ display: 'inline-flex', alignItems: 'center', border: '1.5px solid var(--color-brand-sienna)', color: 'var(--color-brand-sienna)', padding: '0.875rem 2rem', borderRadius: '9999px', fontWeight: 600, fontSize: 'var(--text-small)', textDecoration: 'none' }}
            >
              Try the Free Tool
            </a>
          </div>
        </div>
      </section>

      {/* ── CHOOSE YOUR STARTING POINT ── */}
      <section style={{ backgroundColor: '#ffffff', padding: 'clamp(3rem, 6vw, 4.5rem) 1.5rem' }}>
        <div className="container">
          <SectionHeading eyebrow="Start here" title="Choose your starting point" />
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 12rem), 1fr))', gap: '1rem' }}>
            {CATEGORIES.map(c => (
              <a
                key={c.label}
                href={c.href}
                style={{ display: 'block', padding: '1.25rem', borderRadius: '0.625rem', border: '1px solid var(--color-brand-warm-gray)', backgroundColor: 'var(--color-brand-off-white)', textDecoration: 'none' }}
              >
                <div style={{ fontWeight: 700, fontSize: '0.9375rem', color: 'var(--color-brand-text)', marginBottom: '0.375rem' }}>{c.label}</div>
                <div style={{ fontSize: '0.8125rem', lineHeight: 1.55, color: 'var(--color-brand-text-muted)' }}>{c.copy}</div>
              </a>
            ))}
          </div>
        </div>
      </section>

      {/* ── FEATURED PRACTICE PATHS ── */}
      <section id="featured" style={{ backgroundColor: 'var(--color-brand-off-white)', padding: 'clamp(3rem, 6vw, 4.5rem) 1.5rem', scrollMarginTop: '6.25rem' }}>
        <div className="container">
          <SectionHeading
            eyebrow="Featured"
            title="Featured practice paths"
            intro="The two purchases that make the most sense together, so you do not have to assemble the path yourself."
          />
          <div style={GRID}>
            <ProductCard product={card('power_tools_bundle')} />
            <ProductCard product={card('comprehensive_meditation_program')} />
          </div>
        </div>
      </section>

      {/* ── FREE TOOL ── */}
      <section style={{ backgroundColor: '#ffffff', padding: 'clamp(3rem, 6vw, 4.5rem) 1.5rem' }}>
        <div className="container">
          <SectionHeading id="free-tool" eyebrow="Free" title="Why Did I React That Way?" />
          <div style={{ border: '1px solid var(--color-brand-warm-gray)', borderRadius: '0.75rem', padding: '1.75rem', backgroundColor: 'var(--color-brand-cream)', maxWidth: '46rem' }}>
            <p style={{ fontSize: '1rem', lineHeight: 1.7, color: 'var(--color-brand-text)', marginTop: 0, marginBottom: '0.875rem' }}>
              You reacted, shut down, got defensive, spiralled, or repeated an old pattern — and you
              want to understand what may have happened.
            </p>
            <p style={{ fontSize: '0.9375rem', lineHeight: 1.7, color: 'var(--color-brand-text-muted)', marginBottom: '1.5rem' }}>
              A free personalised reflection based on one real reaction. No account required.
            </p>
            <a
              href="https://www.whydidireactthatway.com/?utm_source=drmarkpirtle&utm_medium=powertools&utm_campaign=free_tool_section"
              target="_blank"
              rel="noopener noreferrer"
              className="btn-primary"
              style={{ padding: '0.75rem 1.75rem' }}
            >
              Try the Free Tool
            </a>
          </div>
        </div>
      </section>

      {/* ── BOOK & MEDIA ── */}
      <section style={{ backgroundColor: 'var(--color-brand-off-white)', padding: 'clamp(3rem, 6vw, 4.5rem) 1.5rem' }}>
        <div className="container">
          <SectionHeading id="book-media" eyebrow="Book & media" title="Start with the framework" />
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 20rem), 1fr))', gap: '1.25rem', alignItems: 'start' }}>

            <div style={{ display: 'flex', gap: '1.25rem', backgroundColor: '#ffffff', border: '1px solid var(--color-brand-warm-gray)', borderRadius: '0.75rem', padding: '1.5rem', boxShadow: 'var(--shadow-card)' }}>
              <Image
                src="/images/book-cover.webp"
                alt="Built This Way, by Dr. Mark Pirtle"
                width={640}
                height={986}
                sizes="120px"
                style={{ width: '6.5rem', height: 'auto', borderRadius: '0.375rem', flexShrink: 0, alignSelf: 'flex-start', boxShadow: 'var(--shadow-card)' }}
              />
              <div>
                <h3 style={{ fontSize: '1.0625rem', fontWeight: 700, marginBottom: '0.5rem', color: 'var(--color-brand-text)' }}>Built This Way</h3>
                <p style={{ fontSize: '0.9375rem', lineHeight: 1.65, color: 'var(--color-brand-text-muted)', marginBottom: '1rem' }}>
                  The best starting point for understanding why painful patterns repeat and how real
                  change becomes possible.
                </p>
                <Link href="/power-tools/book" style={{ fontWeight: 600, fontSize: '0.9375rem', color: 'var(--color-brand-sienna)', textDecoration: 'none' }}>
                  Preorder the Book →
                </Link>
              </div>
            </div>

            <div style={{ backgroundColor: '#ffffff', border: '1px solid var(--color-brand-warm-gray)', borderRadius: '0.75rem', padding: '1.5rem', boxShadow: 'var(--shadow-card)' }}>
              <h3 style={{ fontSize: '1.0625rem', fontWeight: 700, marginBottom: '0.5rem', color: 'var(--color-brand-text)' }}>Is Your Story Making You Sick?</h3>
              <p style={{ fontSize: '0.9375rem', lineHeight: 1.65, color: 'var(--color-brand-text-muted)', marginBottom: '1rem' }}>
                Dr. Pirtle&apos;s documentary on the stories we carry and the toll they can take.
              </p>
              <a
                href="https://tubitv.com/movies/701292/is-your-story-making-you-sick"
                target="_blank"
                rel="noopener noreferrer"
                style={{ fontWeight: 600, fontSize: '0.9375rem', color: 'var(--color-brand-sienna)', textDecoration: 'none' }}
              >
                Watch the Film →
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* ── WORKBOOKS ── */}
      <section style={{ backgroundColor: '#ffffff', padding: 'clamp(3rem, 6vw, 4.5rem) 1.5rem' }}>
        <div className="container">
          <SectionHeading
            id="workbooks"
            eyebrow="Workbooks"
            title="Practice on the page"
            intro="Three guided workbooks in a progression: see yourself, understand yourself, evolve yourself. Buy the set or take them one at a time."
          />
          <div style={GRID}>
            <ProductCard product={card('power_tools_bundle')} />
            <ProductCard product={card('becoming_skillfullyaware_workbook')} />
            <ProductCard product={card('unfinished_business_workbook')} />
            <ProductCard product={card('raising_awareness_workbook')} />
          </div>
        </div>
      </section>

      {/* ── MEDITATION PROGRAMS ── */}
      <section style={{ backgroundColor: 'var(--color-brand-off-white)', padding: 'clamp(3rem, 6vw, 4.5rem) 1.5rem' }}>
        <div className="container">
          <SectionHeading
            id="meditation-programs"
            eyebrow="Meditation programs"
            title="Practice with guided audio"
            intro="The Comprehensive Program is the full library and already includes the other two, so there is no reason to buy them alongside it."
          />
          <div style={GRID}>
            <ProductCard product={card('comprehensive_meditation_program')} />
            <ProductCard product={card('learn_to_meditate_series')} />
            <ProductCard product={card('feel_better_series')} />
          </div>
        </div>
      </section>

      {/* ── CLASSES ── */}
      <section style={{ backgroundColor: '#ffffff', padding: 'clamp(3rem, 6vw, 4.5rem) 1.5rem' }}>
        <div className="container">
          <SectionHeading
            id="online-classes"
            eyebrow="Live online classes"
            title="Practice live, with support"
            intro="These are live cohorts rather than downloads. Mark will be in touch with the schedule after you join."
          />
          <div style={GRID}>
            <ProductCard product={card('project_skillfullyaware_live_class')} />
            <ProductCard product={card('mindfully_overcoming_addictive_behaviors_live_class')} />
          </div>
        </div>
      </section>

      {/* ── HOW TO CHOOSE ── */}
      <section style={{ backgroundColor: 'var(--color-brand-off-white)', padding: 'clamp(3rem, 6vw, 4.5rem) 1.5rem' }}>
        <div className="container" style={{ maxWidth: '48rem' }}>
          <SectionHeading eyebrow="Not sure?" title="How to choose your next Power Tool" />
          <p style={{ fontSize: '1.0125rem', lineHeight: 1.85, color: 'var(--color-brand-text-muted)' }}>
            Start with the free tool if you want to look at one reaction right now. Start with the
            book if you want the full framework. Choose the workbooks if you want to write and
            reflect. Choose the meditation programs if you want guided audio practice. Choose a
            class if you want live structure and support.
          </p>
        </div>
      </section>

      {/* ── FINAL CTA ── */}
      <section className="section-dark" style={{ padding: 'clamp(3rem, 6vw, 4.5rem) 1.5rem', textAlign: 'center' }}>
        <div style={{ maxWidth: '46rem', margin: '0 auto' }}>
          <h2 style={{ fontSize: 'clamp(1.5rem, 3vw, 2.1rem)', fontWeight: 800, color: '#ffffff', marginBottom: '1rem' }}>
            Not sure which Power Tool fits?
          </h2>
          <p style={{ fontSize: '1.0125rem', lineHeight: 1.8, color: 'rgba(255,255,255,0.75)', marginBottom: '2rem' }}>
            Start with the free tool or the book. If you already know what you want to practice,
            choose the workbook, meditation program or class that matches it. Still unsure? Send a
            note and we will point you toward the best starting place.
          </p>
          <div style={{ display: 'flex', gap: '0.875rem', justifyContent: 'center', flexWrap: 'wrap' }}>
            <Link href="/power-tools/book" className="btn-primary" style={{ padding: '0.875rem 2rem' }}>Start with the Book</Link>
            <Link
              href="/contact"
              style={{ display: 'inline-flex', alignItems: 'center', border: '1.5px solid rgba(255,255,255,0.5)', color: '#ffffff', padding: '0.875rem 2rem', borderRadius: '9999px', fontWeight: 600, fontSize: 'var(--text-small)', textDecoration: 'none' }}
            >
              Ask Which Tool Fits
            </Link>
          </div>
          <p style={{ marginTop: '2rem', fontSize: '0.8125rem', color: 'rgba(255,255,255,0.55)' }}>
            Already bought something?{' '}
            <Link href="/power-tools/downloads" style={{ color: 'rgba(255,255,255,0.8)' }}>
              Resend my download links
            </Link>
          </p>
        </div>
      </section>
    </main>
  );
}
