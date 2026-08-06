import type { Metadata } from 'next';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { getPageBySlug, buildMetadata } from '@/lib/pages';
import BlockRenderer from '@/components/blocks/BlockRenderer';

const DEFAULT_META = {
  title: 'About Dr. Mark Pirtle | SkillfullyAware®',
  description: 'Dr. Mark Pirtle is the creator of SkillfullyAware®, author of Built This Way, and creator of the SAAQ. His work helps people understand why painful patterns repeat and how to change them.',
};

export async function generateMetadata(): Promise<Metadata> {
  const page = await getPageBySlug('/about');
  return buildMetadata(page?.seo, DEFAULT_META);
}

/* ─── Science / roots sections ──────────────────────────────────── */
const scienceSections = [
  {
    names: 'Mindfulness and Meditation Practice',
    body: "Mark's meditation training gave him a systematic way to work with attention, emotion, awareness, and moment-to-moment experience.",
  },
  {
    names: 'Shadow and Relational Work',
    body: 'Shadow integration and relational development help reveal hidden adaptations, projections, wounds, and protective strategies that shape how people react and relate.',
  },
  {
    names: 'Development and Perspective-Taking',
    body: 'Adult developmental theory informs how SkillfullyAware® understands growth, maturity, perspective, and the expanding capacity to hold complexity.',
  },
  {
    names: 'Systems Thinking',
    body: 'Systems thinking helps explain why patterns do not live only inside a person. They emerge through relationships, environments, stories, bodies, habits, incentives, and repeated interactions over time.',
  },
];

/* ─── Sub-section label ─────────────────────────────────────────── */
function Eyebrow({ children }: { children: React.ReactNode }) {
  return (
    <p style={{
      fontSize: 'var(--text-xs)',
      fontWeight: 700,
      letterSpacing: '0.14em',
      textTransform: 'uppercase' as const,
      color: 'var(--color-brand-sienna)',
      marginBottom: '0.75rem',
    }}>
      {children}
    </p>
  );
}

/* ─── Section wrapper ───────────────────────────────────────────── */
function Section({ id, bg, children }: { id: string; bg?: string; children: React.ReactNode }) {
  return (
    <section
      id={id}
      style={{
        padding: '6rem 0',
        backgroundColor: bg ?? 'var(--color-brand-cream)',
        scrollMarginTop: '80px',
      }}
    >
      <div className="container">
        <div style={{ maxWidth: '820px', margin: '0 auto' }}>
          {children}
        </div>
      </div>
    </section>
  );
}

/* ─── Divider ───────────────────────────────────────────────────── */
function Divider() {
  return <hr style={{ border: 'none', borderTop: '1px solid var(--color-brand-border)', margin: '2.5rem 0' }} />;
}

/* ═══════════════════════════════════════════════════════════════════
   PAGE
═══════════════════════════════════════════════════════════════════ */
export default async function AboutPage() {
  const cmsPage = await getPageBySlug('/about');
  if (cmsPage && cmsPage.blocks.length > 0) {
    return (
      <main className="min-h-screen" style={{ backgroundColor: 'var(--color-bg)' }}>
        <BlockRenderer blocks={cmsPage.blocks} />
      </main>
    );
  }

  return (
    <>
      {/* ── HERO ──────────────────────────────────────────────────── */}
      <section style={{
        background: 'linear-gradient(135deg, var(--color-brand-navy) 0%, #2a1a0e 100%)',
        padding: '8rem 0 6rem',
        textAlign: 'center',
      }}>
        <div className="container">
        <div style={{ maxWidth: '720px', margin: '0 auto' }}>
          <Eyebrow>About Dr. Mark Pirtle</Eyebrow>
          <h1 style={{
            fontFamily: 'var(--font-sans)',
            fontSize: 'clamp(2.5rem, 5vw, 4rem)',
            fontWeight: 800,
            color: '#ffffff',
            lineHeight: 1.05,
            letterSpacing: '-0.03em',
            marginBottom: '1.25rem',
          }}>
            Helping people understand their patterns and live them differently.
          </h1>
          <p style={{
            fontSize: 'clamp(1rem, 1.6vw, 1.15rem)',
            color: 'rgba(255,255,255,0.7)',
            lineHeight: 1.75,
            maxWidth: '52ch',
            margin: '0 auto 2rem',
          }}>
            Dr. Mark Pirtle is the creator of SkillfullyAware®, author of{' '}
            <em>Built This Way: Why Painful Patterns Repeat and How to Change Them</em>, and creator of the SkillfullyAware Awareness Quotient, or SAAQ.
          </p>
          <p style={{
            fontSize: 'clamp(1rem, 1.6vw, 1.15rem)',
            color: 'rgba(255,255,255,0.7)',
            lineHeight: 1.75,
            maxWidth: '52ch',
            margin: '0 auto 2.5rem',
          }}>
            His work helps people understand why painful patterns repeat, how those patterns shape life, relationships, and leadership, and how awareness, practice, integration, and compassion make change possible.
          </p>
          <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap' }}>
            <Link
              href="/power-tools/book"
              style={{
                backgroundColor: '#ffffff',
                color: 'var(--color-brand-sienna)',
                padding: '0.875rem 1.75rem',
                borderRadius: '9999px',
                fontWeight: 700,
                fontSize: 'var(--text-small)',
                letterSpacing: '0.04em',
                textTransform: 'uppercase' as const,
                textDecoration: 'none',
              }}
            >
              Start with the Book
            </Link>
            <Link
              href="/forum-retreats"
              style={{
                backgroundColor: 'transparent',
                color: '#ffffff',
                padding: '0.875rem 1.75rem',
                borderRadius: '9999px',
                fontWeight: 700,
                fontSize: 'var(--text-small)',
                letterSpacing: '0.04em',
                textTransform: 'uppercase' as const,
                textDecoration: 'none',
                border: '1.5px solid rgba(255,255,255,0.4)',
              }}
            >
              Explore Leadership Work
            </Link>
          </div>
        </div>
        </div>
      </section>

      {/* ── THE STORY ─────────────────────────────────────────────── */}
      <Section id="story">
        <Eyebrow>The Story</Eyebrow>
        <h2 style={{ fontSize: 'clamp(1.75rem, 3.5vw, 2.5rem)', fontWeight: 800, lineHeight: 1.15, marginBottom: '2rem', letterSpacing: '-0.02em' }}>
          How the Work Began
        </h2>

        <p style={{ marginBottom: '1.25rem', lineHeight: 1.8, color: 'var(--color-brand-text)' }}>
          Mark's work did not begin as a brand strategy or a business model. It began when a professional crisis exposed how much identity, stress, anger, and old protective patterns were running his life.
        </p>
        <p style={{ marginBottom: '1.25rem', lineHeight: 1.8 }}>
          Early in his career, Mark was a successful physical therapist and entrepreneur. Then a loophole in an operating agreement cost him his business, title, income, professional identity, and much of what he thought made him secure. The fallout was not only financial or professional. It affected his body, his relationships, his sleep, and his sense of self.
        </p>
        <p style={{ marginBottom: '1.25rem', lineHeight: 1.8 }}>
          During a two-month retreat at a Tibetan Buddhist monastery, Mark immersed himself in meditation, silence, and sustained self-reflection. He began to see that painful patterns could be observed, understood, practiced with, and changed.
        </p>

        <blockquote style={{
          borderLeft: '3px solid var(--color-brand-sienna)',
          paddingLeft: '1.5rem',
          margin: '2rem 0',
          fontStyle: 'italic',
          fontSize: '1.2rem',
          color: 'var(--color-brand-text-muted)',
          lineHeight: 1.7,
        }}>
          "That retreat taught me something I still teach today: awareness is not an idea. It is a practice."
        </blockquote>

        <p style={{ marginBottom: '2rem', lineHeight: 1.8 }}>
          Today, his work includes <em>Built This Way</em>, the SAAQ, Power Tools, coaching, forum retreats, leadership experiences, and the PBS documentary <em>Is Your Story Making You Sick?</em> Each doorway serves the same purpose: helping people understand their patterns, work with them, and continue evolving throughout life.
        </p>

        <Link
          href="/about#system"
          className="inline-flex items-center gap-2"
          style={{
            color: 'var(--color-brand-sienna)',
            fontWeight: 700,
            fontSize: 'var(--text-small)',
            letterSpacing: '0.04em',
            textTransform: 'uppercase' as const,
            textDecoration: 'none',
          }}
        >
          Explore the SkillfullyAware® System <ArrowRight className="w-4 h-4" />
        </Link>
      </Section>

      {/* ── THE SYSTEM ────────────────────────────────────────────── */}
      <Section id="system" bg="var(--color-brand-off-white)">
        <Eyebrow>The System</Eyebrow>
        <h2 style={{ fontSize: 'clamp(1.75rem, 3.5vw, 2.5rem)', fontWeight: 800, lineHeight: 1.15, marginBottom: '1rem', letterSpacing: '-0.02em' }}>
          A Practical System for Understanding and Changing Patterns
        </h2>
        <p style={{ marginBottom: '1.25rem', lineHeight: 1.8, color: 'var(--color-brand-text-muted)' }}>
          SkillfullyAware® is a practical system for understanding and changing painful patterns. It helps people see what is happening, understand how the pattern was built, and practice responding with more awareness and care.
        </p>
        <p style={{ marginBottom: '2.5rem', lineHeight: 1.8 }}>
          If you are here to understand your own painful patterns, the work often begins with{' '}
          <em>Built This Way</em> and the reader tools. If you are here for leadership, forums, retreats, or coaching, the work may begin with the SAAQ, coaching, or a forum retreat.
          <br /><br />
          Different starting points. One integrated system.
        </p>

        {/* Three practices */}
        <div style={{ display: 'grid', gap: '1.5rem', marginBottom: '3rem' }}>
          {[
            {
              title: 'Seeing Yourself',
              label: 'Awareness and Mindfulness',
              body: 'These practices strengthen attention, emotional regulation, and present-moment awareness so you can see what is happening before old patterns take over.',
            },
            {
              title: 'Understanding Yourself',
              label: 'Shadow and Unfinished Business',
              body: 'Shadow work brings hidden or disowned patterns into conscious view. What once drove reactivity from the background can become something you understand and work with more skillfully.',
            },
            {
              title: 'Evolving Yourself',
              label: 'Perspective and Development',
              body: 'Perspective-taking helps you see through more than one lens, understand blind spots, and respond with greater maturity, flexibility, and compassion.',
            },
          ].map(p => (
            <div key={p.title} style={{
              padding: '1.75rem 2rem',
              backgroundColor: '#ffffff',
              borderRadius: 'var(--radius-card)',
              border: '1px solid var(--color-brand-border)',
              boxShadow: 'var(--shadow-card)',
            }}>
              <p style={{ fontSize: 'var(--text-xs)', fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase' as const, color: 'var(--color-brand-sienna)', marginBottom: '0.35rem' }}>{p.label}</p>
              <h3 style={{ fontSize: '1.15rem', fontWeight: 800, marginBottom: '0.5rem' }}>{p.title}</h3>
              <p style={{ lineHeight: 1.75, color: 'var(--color-brand-text-muted)', margin: 0 }}>{p.body}</p>
            </div>
          ))}
        </div>

        {/* World-Body-Mind Venn (SVG) */}
        <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
          <p style={{ fontSize: 'var(--text-xs)', fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase' as const, color: 'var(--color-brand-text-muted)', marginBottom: '1rem' }}>The World · Body · Mind Model</p>
          <svg viewBox="0 0 320 280" style={{ width: '100%', maxWidth: '340px', display: 'inline-block' }} aria-label="World Body Mind Venn diagram">
            {/* Mind */}
            <circle cx="160" cy="90" r="90" fill="rgba(61,141,174,0.12)" stroke="#3D8DAE" strokeWidth="1.5" />
            {/* World */}
            <circle cx="110" cy="185" r="90" fill="rgba(192,82,42,0.10)" stroke="#c0522a" strokeWidth="1.5" />
            {/* Body */}
            <circle cx="210" cy="185" r="90" fill="rgba(26,26,26,0.07)" stroke="#555" strokeWidth="1.5" />
            {/* Labels */}
            <text x="160" y="42" textAnchor="middle" fontSize="11" fontWeight="700" fill="#3D8DAE">— Mind —</text>
            <text x="160" y="56" textAnchor="middle" fontSize="10" fill="#3D8DAE">Cultivate Clarity</text>
            <text x="55" y="230" textAnchor="middle" fontSize="11" fontWeight="700" fill="#c0522a">— World —</text>
            <text x="55" y="244" textAnchor="middle" fontSize="10" fill="#c0522a">Foster Connection</text>
            <text x="265" y="230" textAnchor="middle" fontSize="11" fontWeight="700" fill="#555">— Body —</text>
            <text x="265" y="244" textAnchor="middle" fontSize="10" fill="#555">Strengthen Resilience</text>
            {/* Center */}
            <text x="160" y="152" textAnchor="middle" fontSize="10" fontWeight="800" fill="#1a1a1a">Integration</text>
            <text x="160" y="165" textAnchor="middle" fontSize="9" fill="#555">Enlightened</text>
            <text x="160" y="177" textAnchor="middle" fontSize="9" fill="#555">Leadership</text>
          </svg>
        </div>

        <p style={{ lineHeight: 1.8, color: 'var(--color-brand-text-muted)', marginBottom: '2rem' }}>
          The World-Body-Mind model helps people understand how experience is shaped by outer circumstances, inner stories, nervous system patterns, relationships, attention, and meaning-making. When these dimensions become more integrated, people can respond with greater clarity, connection, and resilience.
        </p>

        <Link
          href="/about#science"
          className="inline-flex items-center gap-2"
          style={{
            color: 'var(--color-brand-sienna)',
            fontWeight: 700,
            fontSize: 'var(--text-small)',
            letterSpacing: '0.04em',
            textTransform: 'uppercase' as const,
            textDecoration: 'none',
          }}
        >
          See the Science Behind the System <ArrowRight className="w-4 h-4" />
        </Link>
      </Section>

      {/* ── THE SCIENCE ───────────────────────────────────────────── */}
      <Section id="science">
        <Eyebrow>The Science</Eyebrow>
        <h2 style={{ fontSize: 'clamp(1.75rem, 3.5vw, 2.5rem)', fontWeight: 800, lineHeight: 1.15, marginBottom: '1rem', letterSpacing: '-0.02em' }}>
          Grounded in Practice, Informed by Science
        </h2>
        <p style={{ marginBottom: '1.25rem', lineHeight: 1.8, color: 'var(--color-brand-text-muted)' }}>
          SkillfullyAware® is practical first. The point is helping people understand the patterns shaping their lives and practice living them differently.
        </p>
        <p style={{ marginBottom: '2.5rem', lineHeight: 1.8, color: 'var(--color-brand-text-muted)' }}>
          The work is informed by mindfulness, adult development, shadow and relational work, systems thinking, Buddhist psychology, CBT, Socratic inquiry, and decades of direct work with clients, leaders, retreats, and practice communities.
        </p>

        {/* V3 removed the row of discipline chips that sat here — it duplicated
            the roots list below and made the section read as credential stacking. */}

        <h3 style={{ fontWeight: 800, marginBottom: '1.75rem', color: 'var(--color-brand-text-muted)', textTransform: 'uppercase' as const, fontSize: 'var(--text-xs)', letterSpacing: '0.12em' }}>
          The Roots of the Work
        </h3>

        <div style={{ display: 'flex', flexDirection: 'column' as const }}>
          {scienceSections.map((c, i) => (
            <div key={c.names}>
              <div style={{ padding: '1.5rem 0' }}>
                <h3 style={{ fontSize: '1.1rem', fontWeight: 800, marginBottom: '0.6rem' }}>{c.names}</h3>
                <p style={{ lineHeight: 1.8, color: 'var(--color-brand-text-muted)', margin: 0 }}>{c.body}</p>
              </div>
              {i < scienceSections.length - 1 && <Divider />}
            </div>
          ))}
        </div>

        {/* CTA block */}
        <div style={{
          marginTop: '4rem',
          padding: '3rem 2.5rem',
          backgroundColor: 'var(--color-brand-navy)',
          borderRadius: 'var(--radius-card)',
          textAlign: 'center',
        }}>
          <h3 style={{ fontSize: 'clamp(1.4rem, 3vw, 1.9rem)', fontWeight: 800, color: '#ffffff', marginBottom: '1rem' }}>
            Choose Your Next Step
          </h3>
          <p style={{ color: 'rgba(255,255,255,0.6)', lineHeight: 1.7, marginBottom: '2rem', maxWidth: '44ch', margin: '0 auto 2rem' }}>
            If you are here to understand your own painful patterns, start with <em>Built This Way</em>. If you are here for leadership, forums, retreats, or coaching, explore the leadership path.
          </p>
          <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap' }}>
            <Link
              href="/power-tools/book"
              className="inline-flex items-center gap-2"
              style={{
                backgroundColor: 'var(--color-brand-sienna)',
                color: '#ffffff',
                padding: '0.875rem 1.75rem',
                borderRadius: 'var(--radius-btn)',
                fontWeight: 700,
                fontSize: 'var(--text-small)',
                letterSpacing: '0.04em',
                textTransform: 'uppercase' as const,
                textDecoration: 'none',
                boxShadow: 'var(--shadow-cta)',
              }}
            >
              Start with the Book <ArrowRight className="w-4 h-4" />
            </Link>
            <Link
              href="/forum-retreats"
              className="inline-flex items-center gap-2"
              style={{
                backgroundColor: 'rgba(255,255,255,0.12)',
                color: '#ffffff',
                padding: '0.875rem 1.75rem',
                borderRadius: 'var(--radius-btn)',
                fontWeight: 700,
                fontSize: 'var(--text-small)',
                letterSpacing: '0.04em',
                textTransform: 'uppercase' as const,
                textDecoration: 'none',
                border: '1px solid rgba(255,255,255,0.25)',
              }}
            >
              Explore Leadership Work
            </Link>
          </div>
        </div>
      </Section>
    </>
  );
}
