import type { Metadata } from 'next';
import Link from 'next/link';
import { ProductCard, type ProductCardProps } from '@/components/shop/ProductCard';
import { PRODUCTS_BY_KEY, formatPrice } from '@/lib/products';
import { isDeliverable } from '@/lib/downloads';
import { getBookCta } from '@/lib/site-settings';

export const metadata: Metadata = {
  title: 'Power Tools | Classes, Workbooks & Guided Meditations | Dr. Mark Pirtle',
  description:
    'Practical classes, workbooks, guided meditations, and free tools that help you keep practicing after the first insight.',
};

/**
 * The Power Tools shop.
 *
 * Structure and copy follow Mark's PowerToolsPageDiagnosisV3: this used to be a
 * resource list, and his note was that "a shop has to do more than name what
 * exists". So the page walks a buyer through free tool → book → workbooks →
 * meditations → classes, with bundles surfaced up front.
 *
 * Status per card is computed, not hardcoded: a digital product with no files
 * uploaded yet renders Coming Soon. That is what stops the shop selling
 * something we cannot deliver.
 */

const REFLECTION_TOOL_URL =
  'https://www.whydidireactthatway.com/?utm_source=drmarkpirtle&utm_medium=powertools&utm_campaign=free_tool';

/** Builds a card from the catalogue, resolving price and deliverability. */
function card(
  key: string,
  extra: Omit<ProductCardProps, 'title' | 'price' | 'status' | 'includes' | 'productKey' | 'badge'> &
    Partial<Pick<ProductCardProps, 'badge' | 'title' | 'includes'>>
): ProductCardProps {
  const p = PRODUCTS_BY_KEY[key];
  const deliverable = isDeliverable(key, p.digitalDelivery);
  return {
    title: extra.title ?? p.name,
    badge: extra.badge ?? p.category,
    includes: extra.includes ?? p.includes,
    price: formatPrice(p.priceCents),
    productKey: key,
    status: deliverable ? 'buyable' : 'coming-soon',
    ...extra,
  };
}

function Section({
  id,
  eyebrow,
  heading,
  intro,
  background,
  children,
}: {
  id?: string;
  eyebrow?: string;
  heading: string;
  intro?: string;
  background?: string;
  children: React.ReactNode;
}) {
  return (
    <section
      id={id}
      style={{
        backgroundColor: background ?? '#ffffff',
        padding: 'clamp(3rem, 6vw, 4.5rem) 1.5rem',
        scrollMarginTop: '6.25rem',
      }}
    >
      <div className="container" style={{ maxWidth: '72rem' }}>
        <div style={{ marginBottom: '2.25rem', maxWidth: '54ch' }}>
          {eyebrow && <span className="eyebrow">{eyebrow}</span>}
          <h2
            style={{
              fontSize: 'clamp(1.5rem, 3vw, 2.1rem)',
              fontWeight: 800,
              color: 'var(--color-brand-text)',
              margin: eyebrow ? '0.75rem 0 0.75rem' : '0 0 0.75rem',
              lineHeight: 1.2,
            }}
          >
            {heading}
          </h2>
          {intro && (
            <p style={{ fontSize: '1.0625rem', lineHeight: 1.75, color: 'var(--color-brand-text-muted)', margin: 0 }}>
              {intro}
            </p>
          )}
        </div>
        {children}
      </div>
    </section>
  );
}

function Grid({ children, min = '18rem' }: { children: React.ReactNode; min?: string }) {
  return (
    <div
      style={{
        display: 'grid',
        gridTemplateColumns: `repeat(auto-fit, minmax(min(100%, ${min}), 1fr))`,
        gap: '1.5rem',
        alignItems: 'stretch',
      }}
    >
      {children}
    </div>
  );
}

const STARTING_POINTS = [
  { label: 'Free Tool', purpose: 'Use one real reaction and experience the work in a few minutes.', href: '#free-tool' },
  { label: 'Book & Media', purpose: 'Understand the framework through the book and companion resources.', href: '#book-media' },
  { label: 'Workbooks', purpose: 'Practice on the page with guided reflection and exercises.', href: '#workbooks' },
  { label: 'Meditation Programs', purpose: 'Practice with guided audio for attention, stress, and reactivity.', href: '#meditations' },
  { label: 'Classes', purpose: 'Learn live with structure, guidance, and accountability.', href: '#classes' },
];

export default async function PowerToolsPage() {
  const trilogyDeliverable = isDeliverable('power_tools_bundle', true);
  const bookCta = await getBookCta();

  return (
    <main style={{ fontFamily: 'var(--font-sans)' }}>

      {/* ── HERO ── */}
      <section style={{ backgroundColor: 'var(--color-brand-cream)', padding: 'clamp(3.5rem, 7vw, 5.5rem) 1.5rem', textAlign: 'center' }}>
        <div style={{ maxWidth: '780px', margin: '0 auto' }}>
          <span className="eyebrow">Power Tools</span>
          <h1
            style={{
              fontSize: 'clamp(1.9rem, 4.5vw, 3rem)',
              fontWeight: 800,
              letterSpacing: '-0.03em',
              lineHeight: 1.12,
              color: 'var(--color-brand-text)',
              margin: '1rem 0 1.5rem',
            }}
          >
            Power Tools for Practicing Change
          </h1>
          <p style={{ fontSize: '1.0625rem', lineHeight: 1.8, color: 'var(--color-brand-text-muted)', maxWidth: '60ch', margin: '0 auto 1rem' }}>
            Insight matters, but insight alone rarely changes a pattern. Power Tools are practical
            classes, workbooks, guided meditations, books, media resources, and free tools that help
            you keep practicing after the first insight.
          </p>
          <p style={{ fontSize: '1.0625rem', lineHeight: 1.8, color: 'var(--color-brand-text-muted)', maxWidth: '60ch', margin: '0 auto 2.25rem' }}>
            Choose the support that fits what you are working with today.
          </p>
          <div style={{ display: 'flex', gap: '0.875rem', justifyContent: 'center', flexWrap: 'wrap' }}>
            <a href="#paths" className="btn-primary" style={{ padding: '0.9375rem 2.25rem', fontSize: '1rem' }}>
              Browse the Shop
            </a>
            <a
              href={REFLECTION_TOOL_URL}
              target="_blank"
              rel="noopener noreferrer"
              style={{ display: 'inline-flex', alignItems: 'center', border: '1.5px solid var(--color-brand-sienna)', color: 'var(--color-brand-sienna)', padding: '0.9375rem 2.25rem', borderRadius: '9999px', fontWeight: 600, fontSize: '1rem', textDecoration: 'none' }}
            >
              Try the Free Tool
            </a>
          </div>
        </div>
      </section>

      {/* ── CHOOSE YOUR STARTING POINT ── */}
      <Section
        heading="Choose your starting point"
        intro="Five ways in. Pick the one that matches where you are today."
        background="var(--color-brand-off-white)"
      >
        <Grid min="14rem">
          {STARTING_POINTS.map(s => (
            <a
              key={s.label}
              href={s.href}
              style={{
                display: 'block',
                backgroundColor: '#ffffff',
                border: '1px solid var(--color-brand-warm-gray)',
                borderRadius: '0.625rem',
                padding: '1.25rem',
                textDecoration: 'none',
                boxShadow: 'var(--shadow-card)',
              }}
            >
              <div style={{ fontWeight: 700, fontSize: 'var(--text-small)', color: 'var(--color-brand-text)', marginBottom: '0.4rem' }}>
                {s.label}
              </div>
              <div style={{ fontSize: '0.8125rem', lineHeight: 1.55, color: 'var(--color-brand-text-muted)' }}>
                {s.purpose}
              </div>
            </a>
          ))}
        </Grid>
      </Section>

      {/* ── FEATURED PRACTICE PATHS ──
          Mark's doc asks for only two true bundles, and explicitly rules out a
          meditation bundle because the Comprehensive Program already contains
          the other two — it is the flagship, not a third bundle. The Complete
          Practice Path is absent because he never priced it, and it is the only
          offer containing a physical book. */}
      <Section
        id="paths"
        eyebrow="Featured"
        heading="Practice paths"
        intro="If you already know you want more than one resource, these are the obvious ways to buy."
      >
        <Grid min="20rem">
          <ProductCard
            {...card('power_tools_bundle', {
              badge: 'Bundle',
              title: 'SkillfullyAware Workbook Trilogy',
              bestFor: 'Readers who want to practice the ideas from Built This Way on the page.',
              problem:
                'Three guided workbooks for seeing your patterns, understanding what drives them, and practicing a more aware way of living.',
              includes: 'All three workbooks: See Yourself, Understand Yourself, Evolve Yourself.',
              ctaLabel: 'Get the Workbook Trilogy',
              featured: trilogyDeliverable,
              wasPrice: '$87',
              saving: 'Save $18',
              comingSoonNote: 'Coming soon',
            })}
          />
          <ProductCard
            {...card('comprehensive_meditation_program', {
              badge: 'Flagship',
              title: 'Comprehensive Guided Meditation Program',
              bestFor: 'People who want one complete audio practice library rather than choosing track by track.',
              problem:
                'The full guided meditation library, including Learn to Meditate, the Feel Better Series, and advanced and specialty practices.',
              ctaLabel: 'Access the Program',
            })}
          />
        </Grid>
      </Section>

      {/* ── FREE TOOL ── */}
      <Section
        id="free-tool"
        eyebrow="Start free"
        heading="Why Did I React That Way?"
        intro="Bring one real reaction and get a personalised reflection on the pattern underneath. Free, and no account required."
        background="var(--color-brand-off-white)"
      >
        <Grid min="20rem">
          <ProductCard
            title="Why Did I React That Way?"
            badge="Free tool"
            bestFor="Anyone who reacted, shut down, got defensive, or repeated an old pattern and wants to understand it."
            problem="A free personalised reflection based on one real reaction."
            includes="Five questions, a written reflection on screen and by email. No account required."
            status="free"
            href={REFLECTION_TOOL_URL}
            ctaLabel="Try the Free Tool"
          />
        </Grid>
      </Section>

      {/* ── BOOK & MEDIA ── */}
      <Section
        id="book-media"
        eyebrow="Understand the framework"
        heading="Book and media"
        intro="Start here if you want the whole picture before you start practising."
      >
        <Grid min="18rem">
          <ProductCard
            title="Built This Way"
            badge="Book"
            bestFor="Anyone who has ever thought, “I know better, but I still do it.”"
            problem="The best starting point for understanding why painful patterns repeat and how real change becomes possible."
            includes="The book, publishing 22 October 2026. Join the launch team for early excerpts."
            status="link"
            href={bookCta.url}
            ctaLabel={bookCta.label}
          />
          <ProductCard
            title="Is Your Story Making You Sick?"
            badge="Documentary"
            bestFor="People who want to see the ideas through real stories rather than read about them."
            problem="Dr. Pirtle's documentary on the stories we carry and the toll they can take."
            includes="Feature documentary, available to stream."
            status="link"
            href="https://tubitv.com/movies/701292/is-your-story-making-you-sick"
            ctaLabel="Stream the Film"
          />
          <ProductCard
            title="Boundarylessness of Awareness"
            badge="Reader bonus"
            bestFor="Readers of Built This Way working through Chapter 8."
            problem="A companion guided audio for readers of the book."
            includes="Guided audio, included with the book rather than sold separately."
            status="coming-soon"
            comingSoonNote="With the book, October"
          />
        </Grid>
      </Section>

      {/* ── WORKBOOKS ── */}
      <Section
        id="workbooks"
        eyebrow="Practice on the page"
        heading="Workbooks"
        intro="Three guided workbooks, designed as a progression: see yourself, understand yourself, evolve yourself. Buy one, or take the trilogy."
        background="var(--color-brand-off-white)"
      >
        <Grid>
          <ProductCard
            {...card('becoming_skillfullyaware_workbook', {
              badge: 'Workbook',
              bestFor: 'People who want to notice their patterns sooner.',
              problem: 'Guided workbook for seeing patterns clearly and practising with attention, emotion, and reaction.',
              ctaLabel: 'Buy Workbook',
            })}
          />
          <ProductCard
            {...card('unfinished_business_workbook', {
              badge: 'Workbook',
              bestFor: 'People working with shadow, projection, resistance, anger, and boundaries.',
              problem: 'Guided workbook for understanding and integrating hidden protective strategies.',
              ctaLabel: 'Buy Workbook',
            })}
          />
          <ProductCard
            {...card('raising_awareness_workbook', {
              badge: 'Workbook',
              bestFor: 'People who want to expand perspective, maturity, and compassion.',
              problem: 'Guided workbook for development, perspective-taking, and higher-good practice.',
              ctaLabel: 'Buy Workbook',
            })}
          />
        </Grid>
      </Section>

      {/* ── MEDITATION PROGRAMS ── */}
      <Section
        id="meditations"
        eyebrow="Practice with audio"
        heading="Guided meditation programs"
        intro="Guided audio for attention, stress, reactivity, and awareness. The Comprehensive Program is the full library and includes the other two."
      >
        <Grid>
          <ProductCard
            {...card('learn_to_meditate_series', {
              badge: 'Meditation',
              bestFor: 'People who want to meditate but need a clear foundation.',
              problem:
                'Guidance for what to do with attention, posture, breath, and a wandering mind.',
              ctaLabel: 'Get the Program',
            })}
          />
          <ProductCard
            {...card('feel_better_series', {
              badge: 'Meditation',
              bestFor: 'People feeling stressed, reactive, or activated in the body.',
              problem: 'Guided support for returning to steadiness when the body is activated.',
              ctaLabel: 'Get the Series',
            })}
          />
          <ProductCard
            {...card('comprehensive_meditation_program', {
              badge: 'Flagship',
              bestFor: 'People who want the full library rather than one series at a time.',
              problem: 'The complete guided practice library, including both other programs.',
              ctaLabel: 'Access the Program',
              featured: isDeliverable('comprehensive_meditation_program', true),
            })}
          />
        </Grid>
      </Section>

      {/* ── CLASSES ── */}
      <Section
        id="classes"
        eyebrow="Practice live"
        heading="Online classes"
        intro="Live classes with Mark, for people who want structure, guidance, and accountability. These are scheduled cohorts rather than downloads."
        background="var(--color-brand-off-white)"
      >
        <Grid min="20rem">
          <ProductCard
            {...card('project_skillfullyaware_live_class', {
              badge: 'Live class',
              bestFor: 'People who want live structure applying SkillfullyAware to daily pattern change.',
              problem:
                'Live, guided practice with attention, emotions, habits, reactions, and daily pattern change.',
              includes: 'Live six-week online class. Mark will be in touch with cohort dates.',
              ctaLabel: 'Join the Class',
            })}
          />
          <ProductCard
            {...card('mindfully_overcoming_addictive_behaviors_live_class', {
              badge: 'Live class',
              bestFor: 'People wanting live support with addictive or compulsive patterns.',
              problem:
                'Live support for addictive or compulsive patterns, nervous system responses, and the protective strategies underneath them. Educational support, not treatment.',
              includes: 'Live ten-week online class. Mark will be in touch with cohort dates.',
              ctaLabel: 'Join the Class',
            })}
          />
        </Grid>
      </Section>

      {/* ── HOW TO CHOOSE ── */}
      <Section heading="How to choose your next Power Tool">
        <p style={{ fontSize: '1.0625rem', lineHeight: 1.85, color: 'var(--color-brand-text-muted)', maxWidth: '62ch', margin: 0 }}>
          Start with the free tool if you want to look at one reaction right now. Start with the book
          if you want the full framework. Choose the workbooks if you want to write and reflect.
          Choose the meditation programs if you want guided audio practice. Choose a class if you
          want live structure and support.
        </p>
      </Section>

      {/* ── FINAL CTA ── */}
      <section className="section-dark" style={{ padding: 'clamp(3rem, 6vw, 4.5rem) 1.5rem', textAlign: 'center' }}>
        <div style={{ maxWidth: '620px', margin: '0 auto' }}>
          <h2 style={{ fontSize: 'clamp(1.5rem, 3vw, 2.1rem)', fontWeight: 800, color: '#ffffff', marginBottom: '1rem', lineHeight: 1.2 }}>
            Not sure what fits?
          </h2>
          <p style={{ fontSize: '1.0625rem', lineHeight: 1.8, color: 'rgba(255,255,255,0.75)', marginBottom: '2rem' }}>
            Tell Mark what you are working with and he will point you to the right starting place.
          </p>
          <div style={{ display: 'flex', gap: '0.875rem', justifyContent: 'center', flexWrap: 'wrap' }}>
            <Link href="/contact" className="btn-primary" style={{ padding: '0.9375rem 2.25rem', fontSize: '1rem' }}>
              Ask Mark
            </Link>
            <Link
              href="/power-tools/downloads"
              style={{ display: 'inline-flex', alignItems: 'center', border: '1.5px solid rgba(255,255,255,0.5)', color: '#ffffff', padding: '0.9375rem 2.25rem', borderRadius: '9999px', fontWeight: 600, fontSize: '1rem', textDecoration: 'none' }}
            >
              Find my downloads
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
