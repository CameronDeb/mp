import type { Metadata } from 'next';
import Link from 'next/link';
import Image from 'next/image';
import { CheckCircle, Target, Compass, Zap, RefreshCw, Activity, FileText } from 'lucide-react';
import { getPageBySlug, buildMetadata } from '@/lib/pages';
import BlockRenderer from '@/components/blocks/BlockRenderer';

const DEFAULT_META = {
  title: 'SAAQ Assessment & Coaching | Dr. Mark Pirtle | SkillfullyAware®',
  description: 'The SkillfullyAware Awareness Quotient (SAAQ) is a private developmental assessment for individuals, leaders, EO/YPO forums, peer groups, and leadership teams.',
};

export async function generateMetadata(): Promise<Metadata> {
  const page = await getPageBySlug('/consultation');
  return buildMetadata(page?.seo, DEFAULT_META);
}

/* ── Copy ─────────────────────────────────────────── */
const steps = [
  {
    icon: Compass,
    title: 'Complete the SAAQ',
    body: 'Begin with a private developmental assessment that maps strengths, blind spots, stress reactions, and growth edges.',
  },
  {
    icon: FileText,
    title: 'Review your report',
    body: 'We identify the patterns that matter most right now and clarify what deserves attention first.',
  },
  {
    icon: Activity,
    title: 'Name the pressure points',
    body: 'We connect the report to real situations: decisions, relationships, conflict, avoidance, over-control, burnout, or transition.',
  },
  {
    icon: Target,
    title: 'Build a practical growth plan',
    body: 'Together we identify a focused set of practices, commitments, and next steps for the next 90 days.',
  },
  {
    icon: Zap,
    title: 'Practice in real life',
    body: 'You apply the work in the conversations, choices, routines, and leadership moments that matter most.',
  },
  {
    icon: RefreshCw,
    title: 'Integrate and adjust',
    body: 'We review what is changing, what is still repeating, and what support would help you continue developing.',
  },
];

const sessionItems = [
  {
    title: 'Current pressure',
    body: 'Work with the decisions, conversations, conflicts, or transitions that are active now.',
  },
  {
    title: 'SAAQ insights',
    body: 'Return to the report to understand what pattern may be showing up and what it is asking you to practice.',
  },
  {
    title: 'Pattern practice',
    body: 'Learn to notice old protective strategies before they run the conversation or decision.',
  },
  {
    title: 'Leadership and relationship work',
    body: 'Apply the work to trust, conflict, boundaries, communication, and responsibility.',
  },
  {
    title: 'Daily practices',
    body: 'Build simple practices that support attention, emotional regulation, perspective-taking, and follow-through.',
  },
];

const pathCards = [
  {
    heading: 'Individual SAAQ',
    subheading: 'Understand your own patterns.',
    body: 'For people who want a private developmental reflection on how they react, relate, decide, protect themselves, and grow under pressure.',
    cta: 'Take the Individual SAAQ',
    href: 'https://saaq-pi.vercel.app/',
    external: true,
  },
  {
    heading: 'SAAQ Coaching',
    subheading: 'Turn insight into practice.',
    body: 'For leaders and growth-minded individuals who want coaching built around their SAAQ report, current goals, stress patterns, relationships, and next developmental steps.',
    cta: 'Explore SAAQ Coaching',
    href: '#book',
    external: false,
  },
  {
    heading: 'SAAQ Forum Immersion',
    subheading: 'Give your forum a deeper map.',
    body: 'A one-day, six-hour premium developmental intensive for EO/YPO forums, peer groups, founders, and leadership teams. Each participant completes the SAAQ and receives a private report before the immersion, helping the group go deeper, faster, and with more clarity.',
    cta: 'Explore Forum Immersion',
    href: '/forum-retreats',
    external: false,
  },
];

const saaqOptions = [
  {
    heading: 'Individual SAAQ',
    price: '$350–$1,000',
    body: 'Choose from a 15-question snapshot or a 30-question deep dive, with report-only or report-plus-session options.',
    note: 'For most people, the recommended starting point is the 30-question report + sessions option because it provides the most complete reflection and gives you time to review the results with Dr. Mark.',
    cta: 'Take the SAAQ',
    href: 'https://saaq-pi.vercel.app/',
    external: true,
  },
  {
    heading: 'SAAQ Coaching',
    price: 'Available after the initial SAAQ',
    body: 'For people who want to apply their SAAQ insights to real decisions, relationships, leadership challenges, stress patterns, and practical next steps. Begin with the SAAQ, then discuss whether ongoing coaching is the right next step.',
    note: '',
    cta: 'Start with the SAAQ',
    href: 'https://saaq-pi.vercel.app/',
    external: true,
  },
  {
    heading: 'SAAQ Forum Immersion',
    price: 'Starting at $12,500 per forum',
    body: 'A premium developmental experience for EO/YPO forums, peer groups, founders, and leadership teams. Each participant completes the SAAQ and receives a private developmental report before the immersion. The group then comes together for a facilitated process focused on strengths, blind spots, stress patterns, growth edges, and a practical 90-day plan.',
    note: '',
    cta: 'Schedule a Conversation',
    href: '/contact',
    external: false,
  },
  {
    heading: 'Premium SAAQ Forum Immersion',
    price: 'Custom premium engagements from $18,000',
    body: 'Premium SAAQ engagements may include individual pre-immersion debriefs, a more customized group summary, additional follow-up calls, and more hands-on 90-day integration support.',
    note: 'Final pricing depends on format, group size, customization, debrief structure, and follow-up support.',
    cta: 'Book a SAAQ Conversation',
    href: '/contact',
    external: false,
  },
];

/* ── Page ─────────────────────────────────────────── */
export default async function ConsultationPage() {
  const cmsPage = await getPageBySlug('/consultation');
  if (cmsPage && cmsPage.blocks.length > 0) {
    return (
      <main className="min-h-screen" style={{ backgroundColor: 'var(--color-bg)' }}>
        <BlockRenderer blocks={cmsPage.blocks} />
      </main>
    );
  }

  return (
    <main className="min-h-screen" style={{ backgroundColor: 'var(--color-bg)' }}>

      {/* ── HERO ────────────────────────────────────────── */}
      <section
        className="section relative overflow-hidden"
        style={{ backgroundColor: 'var(--color-brand-navy)', paddingTop: '8rem', paddingBottom: '6rem' }}
      >
        {/* Mark teaching the material this page is selling. The page was a
            long stretch of type with nothing to look at, and a leadership
            assessment is easier to trust when you can see who is behind it.
            Sits under the existing rust glow, weighted low so the headline
            keeps its contrast. */}
        <Image
          src="/images/mark/saaq-coaching.webp"
          alt="Dr. Mark Pirtle teaching a leadership session"
          fill
          priority
          sizes="100vw"
          style={{ objectFit: 'cover', objectPosition: '70% center', opacity: 0.22 }}
        />
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background:
              'linear-gradient(90deg, var(--color-brand-navy) 0%, rgba(41,54,67,0.92) 45%, rgba(41,54,67,0.62) 100%)',
          }}
        />
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background: 'radial-gradient(ellipse 55% 70% at 75% 50%, rgba(192,82,42,0.12) 0%, transparent 70%)',
          }}
        />
        <div className="container relative z-10 max-w-3xl">
          <div className="section-divider mb-4" />
          <span className="eyebrow">SkillfullyAware Awareness Quotient (SAAQ)</span>
          <h1 className="mt-4 mb-6" style={{ color: '#ffffff' }}>
            See the patterns shaping how you lead, relate, decide, and grow.
          </h1>
          <p style={{ fontSize: 'var(--text-lead)', color: 'rgba(255,255,255,0.72)', lineHeight: 1.75, maxWidth: '52ch', marginBottom: '1rem' }}>
            The SkillfullyAware Awareness Quotient (SAAQ) is a private developmental assessment that
            helps you understand your strengths, blind spots, stress reactions, growth edges, and
            practical next steps.
          </p>
          <p style={{ fontSize: 'var(--text-lead)', color: 'rgba(255,255,255,0.72)', lineHeight: 1.75, maxWidth: '52ch' }}>
            The SAAQ can stand alone as an individual assessment, guide one-on-one coaching, or
            anchor a premium forum immersion for EO/YPO forums, founders, peer groups, and
            leadership teams.
          </p>
          <div className="mt-10 flex flex-wrap gap-4">
            <Link href="/contact" className="btn btn-primary">
              Book a SAAQ Conversation
            </Link>
            <a
              href="https://saaq-pi.vercel.app/"
              target="_blank"
              rel="noopener noreferrer"
              className="btn btn-outline"
              style={{ color: '#fff', borderColor: 'rgba(255,255,255,0.3)' }}
            >
              Take the Individual SAAQ
            </a>
          </div>
        </div>
      </section>

      {/* ── WHO IT'S FOR ────────────────────────────────── */}
      <section className="section" style={{ backgroundColor: 'var(--color-surface)' }}>
        <div className="container">
          <div className="section-divider mb-4" />
          <span className="eyebrow">Who It&apos;s For</span>
          <h2 className="mt-4 mb-12" style={{ maxWidth: '32ch' }}>
            Choose the SAAQ path that fits why you&apos;re here
          </h2>
          <div className="grid md:grid-cols-3 gap-8">
            {pathCards.map((card) => (
              <div
                key={card.heading}
                className="rounded-2xl p-8 flex flex-col gap-4"
                style={{ backgroundColor: 'var(--color-bg)', border: '1px solid var(--color-border)' }}
              >
                <div>
                  <h3 className="mb-1" style={{ fontSize: 'var(--text-h3)' }}>{card.heading}</h3>
                  <p style={{ fontWeight: 600, color: 'var(--color-brand-sienna)', marginBottom: '0.75rem', fontSize: 'var(--text-small)' }}>
                    {card.subheading}
                  </p>
                  <p style={{ color: 'var(--color-text-muted)', lineHeight: 1.75 }}>{card.body}</p>
                </div>
                {card.external ? (
                  <a
                    href={card.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn btn-outline mt-auto"
                    style={{ alignSelf: 'flex-start' }}
                  >
                    {card.cta}
                  </a>
                ) : (
                  <Link
                    href={card.href}
                    className="btn btn-outline mt-auto"
                    style={{ alignSelf: 'flex-start' }}
                  >
                    {card.cta}
                  </Link>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── START WITH A DEEPER MAP ─────────────────────── */}
      <section
        className="section"
        style={{
          background: 'linear-gradient(135deg, var(--color-brand-sienna) 0%, var(--color-brand-sienna-dark, #8B3A1A) 100%)',
        }}
      >
        <div className="container max-w-2xl text-center">
          <h2 className="mb-4" style={{ color: '#ffffff' }}>Start with a deeper map</h2>
          <p style={{ color: 'rgba(255,255,255,0.88)', fontSize: 'var(--text-lead)', lineHeight: 1.75, marginBottom: '1.25rem' }}>
            Every SAAQ engagement begins with a private assessment and developmental reflection.
            The assessment helps identify patterns that are often difficult to see from the inside:
            strengths, blind spots, stress reactions, protective strategies, growth edges, and
            practical next steps.
          </p>
          <p style={{ color: 'rgba(255,255,255,0.8)', fontSize: 'var(--text-lead)', lineHeight: 1.75, marginBottom: '2.5rem' }}>
            For individuals, the SAAQ can serve as a private starting point. For coaching, it
            becomes the map for focused work. For forums and leadership groups, it gives each
            participant a private report and gives the group a clearer foundation for deeper
            conversation.
          </p>
          <div className="flex flex-wrap gap-4 justify-center">
            <a
              href="https://saaq-pi.vercel.app/"
              target="_blank"
              rel="noopener noreferrer"
              className="btn"
              style={{ backgroundColor: '#ffffff', color: 'var(--color-brand-sienna)', fontWeight: 700 }}
            >
              Take the Individual SAAQ
            </a>
            <Link
              href="/contact"
              className="btn"
              style={{ backgroundColor: 'transparent', color: '#ffffff', border: '1.5px solid rgba(255,255,255,0.5)', fontWeight: 600 }}
            >
              Book a SAAQ Conversation
            </Link>
          </div>
        </div>
      </section>

      {/* ── SAAQ OPTIONS ────────────────────────────────── */}
      <section className="section">
        <div className="container">
          <div className="section-divider mb-4" />
          <span className="eyebrow">SAAQ Options</span>
          <h2 className="mt-4 mb-4">Find the right level of support</h2>
          <p
            className="mb-14"
            style={{ color: 'var(--color-text-muted)', fontSize: 'var(--text-lead)', maxWidth: '54ch', lineHeight: 1.75 }}
          >
            The SAAQ can be used in different ways depending on the level of support needed. Some
            people begin with an individual assessment. Others use the SAAQ as the foundation for
            coaching, a forum immersion, or a larger leadership development process.
          </p>
          <div className="grid md:grid-cols-2 gap-8">
            {saaqOptions.map((opt) => (
              <div
                key={opt.heading}
                className="rounded-2xl p-8 flex flex-col gap-4"
                style={{ backgroundColor: 'var(--color-surface)', border: '1px solid var(--color-border)' }}
              >
                <div>
                  <h3 className="mb-1" style={{ fontSize: 'var(--text-h4, 1.25rem)', fontWeight: 700 }}>{opt.heading}</h3>
                  <p style={{ fontWeight: 700, color: 'var(--color-brand-sienna)', fontSize: 'var(--text-small)', marginBottom: '0.875rem' }}>
                    {opt.price}
                  </p>
                  <p style={{ color: 'var(--color-text-muted)', lineHeight: 1.75, marginBottom: opt.note ? '0.875rem' : 0 }}>{opt.body}</p>
                  {opt.note && (
                    <p style={{ color: 'var(--color-text-muted)', lineHeight: 1.75, fontSize: 'var(--text-small)', fontStyle: 'italic' }}>{opt.note}</p>
                  )}
                </div>
                {opt.external ? (
                  <a
                    href={opt.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn btn-primary mt-auto"
                    style={{ alignSelf: 'flex-start' }}
                  >
                    {opt.cta}
                  </a>
                ) : (
                  <Link
                    href={opt.href}
                    className="btn btn-primary mt-auto"
                    style={{ alignSelf: 'flex-start' }}
                  >
                    {opt.cta}
                  </Link>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── COACHING STRUCTURE ──────────────────────────── */}
      <section className="section" style={{ backgroundColor: 'var(--color-surface)' }}>
        <div className="container">
          <div className="section-divider mb-4" />
          <span className="eyebrow">The Coaching Structure</span>
          <h2 className="mt-4 mb-4">From insight to practice</h2>
          <p
            className="mb-14"
            style={{ color: 'var(--color-text-muted)', fontSize: 'var(--text-lead)', maxWidth: '54ch', lineHeight: 1.75 }}
          >
            The SAAQ is useful because it does not stop at insight. It gives us a map we can
            practice with. Coaching helps you use that map in real decisions, conversations,
            relationships, and leadership challenges.
          </p>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {steps.map((s, i) => {
              const Icon = s.icon;
              return (
                <div key={s.title} className="flex flex-col gap-4">
                  <div className="flex items-center gap-3">
                    <span
                      className="text-sm font-bold tabular-nums"
                      style={{ color: 'var(--color-brand-sienna)', minWidth: '1.5rem' }}
                    >
                      {String(i + 1).padStart(2, '0')}
                    </span>
                    <Icon size={20} style={{ color: 'var(--color-brand-sienna)' }} />
                  </div>
                  <h3 style={{ fontSize: 'var(--text-h4, 1.125rem)', fontWeight: 600 }}>{s.title}</h3>
                  <p style={{ color: 'var(--color-text-muted)', lineHeight: 1.75 }}>{s.body}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ── SESSION FORMAT ──────────────────────────────── */}
      <section className="section">
        <div className="container max-w-3xl">
          <div className="section-divider mb-4" />
          <span className="eyebrow">Session Format</span>
          <h2 className="mt-4 mb-4">What SAAQ coaching focuses on</h2>
          <p
            className="mb-12"
            style={{ color: 'var(--color-text-muted)', fontSize: 'var(--text-lead)', lineHeight: 1.75 }}
          >
            Sessions are practical and responsive. We use the SAAQ map, current real-life pressure,
            and SkillfullyAware® practices to help you see patterns sooner and respond more skillfully.
          </p>
          <div className="flex flex-col gap-6">
            {sessionItems.map((item) => (
              <div key={item.title} className="flex gap-5 items-start">
                <CheckCircle size={20} style={{ color: 'var(--color-brand-sienna)', flexShrink: 0, marginTop: '0.2rem' }} />
                <div>
                  <p style={{ fontWeight: 600, marginBottom: '0.25rem' }}>{item.title}</p>
                  <p style={{ color: 'var(--color-text-muted)', lineHeight: 1.75 }}>{item.body}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── GET STARTED CTA ─────────────────────────────── */}
      <section
        id="book"
        className="section"
        style={{ backgroundColor: 'var(--color-brand-navy)', textAlign: 'center' }}
      >
        <div className="container max-w-2xl">
          <div className="section-divider mb-4 mx-auto" style={{ margin: '0 auto 1rem' }} />
          <span className="eyebrow">Get Started</span>
          <h2 className="mt-4 mb-4" style={{ color: '#ffffff' }}>
            Choose your SAAQ starting point
          </h2>
          <p
            className="mb-10"
            style={{ color: 'rgba(255,255,255,0.7)', fontSize: 'var(--text-lead)', lineHeight: 1.75 }}
          >
            Start with the individual assessment, book a conversation about SAAQ coaching, or
            explore a SAAQ Forum Immersion for your EO/YPO forum, peer group, or leadership team.
          </p>
          <div className="flex flex-wrap gap-4 justify-center">
            <Link href="/contact" className="btn btn-primary">
              Book a SAAQ Conversation
            </Link>
            <a
              href="https://saaq-pi.vercel.app/"
              target="_blank"
              rel="noopener noreferrer"
              className="btn btn-outline"
              style={{ color: '#fff', borderColor: 'rgba(255,255,255,0.3)' }}
            >
              Take the Individual SAAQ
            </a>
            <Link
              href="/forum-retreats"
              className="btn btn-outline"
              style={{ color: '#fff', borderColor: 'rgba(255,255,255,0.3)' }}
            >
              Explore Forum Immersion
            </Link>
          </div>
        </div>
      </section>

    </main>
  );
}
