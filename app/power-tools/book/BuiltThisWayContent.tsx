import Link from 'next/link';
import Image from 'next/image';
import {
  CheckCircle, ArrowRight, BookOpen, Users,
  Heart, Star, Sparkles,
} from 'lucide-react';

/** "In Built This Way, readers will learn:" list. */
const LEARNS = [
  'Why painful patterns repeat even when we understand them',
  'Why insight alone is not enough to create lasting change',
  'How stress, story, trauma, and the nervous system shape our reactions',
  'Why old adaptations can become current limitations',
  'How mindful attunement helps us notice patterns as they arise',
  'How self-awareness, shadow work, and daily practice help us begin to change',
];

/* ─────────────────────────────────────────────
   PAGE
   Mark, Aug 2026: "Get rid of all the tiers. I'm not
   raising money for the book anymore. The CTA should
   just say JOIN THE LAUNCH TEAM." The paid tiers and
   their Stripe Payment Links are gone; recover them
   from git if fundraising ever returns.

   The hero scrolls to the launch team pitch, and the
   pitch's own CTA is the action. Mark still owes us
   the launch team copy and a decision on what joining
   actually does, so /contact is the interim target.
───────────────────────────────────────────── */
export default function BuiltThisWayContent() {
  return (
    <main style={{ fontFamily: 'var(--font-sans)' }}>

      {/* ── BREADCRUMB ── */}
      <div style={{ backgroundColor: 'var(--color-brand-off-white)', padding: '0.75rem 0' }}>
        <div className="container">
          <p style={{ fontSize: 'var(--text-xs)', color: 'var(--color-brand-text-light)', margin: 0 }}>
            <Link href="/" style={{ color: 'var(--color-brand-text-light)', textDecoration: 'none' }}>Home</Link>
            {' / '}
            <span style={{ color: 'var(--color-brand-text-muted)' }}>Built This Way</span>
          </p>
        </div>
      </div>

      {/* ═══════════════════════════════════════
          HERO
      ═══════════════════════════════════════ */}
      <section
        style={{
          backgroundColor: 'var(--color-brand-cream)',
          padding: 'clamp(4rem, 8vw, 7rem) 1.5rem clamp(4rem, 8vw, 6rem)',
          textAlign: 'center',
          position: 'relative',
          overflow: 'hidden',
        }}
      >
        {/* Subtle radial glow */}
        <div style={{
          position: 'absolute', inset: 0, pointerEvents: 'none',
          background: 'radial-gradient(ellipse 70% 60% at 50% 40%, rgba(192,82,42,0.07) 0%, transparent 70%)',
        }} />

        <div style={{ maxWidth: '820px', margin: '0 auto', position: 'relative' }}>
          {/* Eyebrow */}
          <span style={{
            display: 'inline-block',
            fontSize: 'var(--text-xs)',
            fontWeight: 700,
            letterSpacing: '0.14em',
            textTransform: 'uppercase',
            color: 'var(--color-brand-sienna)',
            marginBottom: '1.25rem',
          }}>
            Now Available · Book Launch Team
          </span>

          {/* Headline */}
          <h1 style={{
            fontSize: 'clamp(2rem, 4.5vw, 3.5rem)',
            fontWeight: 800,
            lineHeight: 1.1,
            letterSpacing: '-0.03em',
            color: 'var(--color-brand-text)',
            marginBottom: '1.5rem',
          }}>
            For anyone who has ever thought,<br />
            <em style={{ color: 'var(--color-brand-sienna)', fontStyle: 'italic' }}>
              "I know better, but I still do it."
            </em>
          </h1>

          {/* Book cover, between the headline and the subheadline — Mark, Aug 2026 */}
          <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '2.5rem' }}>
            <Image
              src="/images/book-cover.webp"
              alt="Built This Way: Why Painful Patterns Repeat and How to Change Them, by Dr. Mark Pirtle"
              width={640}
              height={986}
              priority
              sizes="(max-width: 640px) 55vw, 260px"
              style={{
                width: '100%',
                maxWidth: '260px',
                height: 'auto',
                borderRadius: '0.5rem',
                boxShadow: 'var(--shadow-premium)',
              }}
            />
          </div>

          {/* Subheadline. The subtitle matches the printed cover: "Why Painful
              Patterns Repeat", not "Why We Repeat Painful Patterns". */}
          <p style={{
            fontSize: 'clamp(1rem, 1.8vw, 1.2rem)',
            color: 'var(--color-brand-text-muted)',
            lineHeight: 1.75,
            maxWidth: '60ch',
            margin: '0 auto 2.5rem',
          }}>
            <em>Built This Way: Why Painful Patterns Repeat and How to Change Them</em>{' '}
            helps readers understand why old patterns repeat and how awareness, practice,
            integration, and compassion make change possible.
          </p>

          {/* CTA */}
          <a
            href="#launch-team"
            className="btn-primary"
            style={{ fontSize: '1rem', padding: '1rem 2.5rem' }}
          >
            Join the Launch Team <ArrowRight className="inline w-4 h-4 ml-1" />
          </a>
        </div>
      </section>

      {/* ═══════════════════════════════════════
          OPENING COPY
      ═══════════════════════════════════════ */}
      <section style={{ backgroundColor: 'var(--color-brand-cream)', padding: 'clamp(3.5rem,7vw,5.5rem) 1.5rem' }}>
        <div style={{ maxWidth: '720px', margin: '0 auto' }}>

          <p style={{ fontSize: '1.125rem', lineHeight: 1.85, color: 'var(--color-brand-text)', marginBottom: '1.5rem' }}>
            Most of us have patterns we understand but still repeat.
          </p>

          {/* Repeating pattern list */}
          <div style={{
            borderLeft: '3px solid var(--color-brand-sienna)',
            paddingLeft: '1.5rem',
            marginBottom: '2rem',
          }}>
            {[
              'We know we should pause before reacting.',
              'We know we should stop overthinking.',
              'We know we should take better care of ourselves.',
              'We know we should stop trying to prove our worth.',
              'We know we should stop carrying old pain into present relationships.',
            ].map((line, i) => (
              <p key={i} style={{
                fontSize: '1.0625rem',
                lineHeight: 1.8,
                color: 'var(--color-brand-text)',
                marginBottom: '0.375rem',
                fontStyle: 'italic',
              }}>
                {line}
              </p>
            ))}
          </div>

          <p style={{ fontSize: '1.125rem', lineHeight: 1.85, color: 'var(--color-brand-text)', marginBottom: '1.5rem' }}>
            And yet, under stress, the old pattern still takes over.
          </p>

          <p style={{ fontSize: '1.0625rem', lineHeight: 1.85, color: 'var(--color-brand-text-muted)', marginBottom: '1.5rem' }}>
            That does not mean something is wrong with us. It means the pattern has been repeated
            deeply enough that knowing better is not enough to change it.
          </p>

          <p style={{ fontSize: '1.0625rem', lineHeight: 1.85, color: 'var(--color-brand-text-muted)', marginBottom: '2rem' }}>
            <em>Built This Way</em> was written for people who are tired of asking,
            "What's wrong with me?" and are ready to ask a better question:
          </p>

          {/* Pull quote */}
          <blockquote style={{
            backgroundColor: '#ffffff',
            border: '1px solid var(--color-brand-warm-gray)',
            borderRadius: '0.75rem',
            padding: '2rem 2.25rem',
            boxShadow: 'var(--shadow-card)',
            margin: '0',
          }}>
            <p style={{
              fontSize: 'clamp(1.1rem, 2vw, 1.35rem)',
              fontWeight: 700,
              color: 'var(--color-brand-text)',
              lineHeight: 1.5,
              margin: 0,
            }}>
              How did this pattern get built into me, and what would help it change?
            </p>
          </blockquote>
        </div>
      </section>

      {/* ═══════════════════════════════════════
          WHY THIS BOOK MATTERS
      ═══════════════════════════════════════ */}
      <section style={{ backgroundColor: 'var(--color-brand-off-white)', padding: 'clamp(3.5rem,7vw,5.5rem) 1.5rem' }}>
        <div style={{ maxWidth: '720px', margin: '0 auto' }}>

          <div className="section-divider" style={{ marginBottom: '1rem' }} />
          <span className="eyebrow">Why This Book Matters</span>

          <h2 style={{
            fontSize: 'clamp(1.6rem, 3vw, 2.25rem)',
            fontWeight: 800,
            color: 'var(--color-brand-text)',
            marginTop: '1rem',
            marginBottom: '1.5rem',
            lineHeight: 1.2,
          }}>
            You are not broken.<br />
            You are built around patterns.<br />
            <span style={{ color: 'var(--color-brand-sienna)' }}>And patterns can change.</span>
          </h2>

          <p style={{ fontSize: '1.0625rem', lineHeight: 1.85, color: 'var(--color-brand-text-muted)', marginBottom: '1.5rem' }}>
            Painful patterns are rarely just bad choices or negative thoughts. They are conditioned
            loops involving the body, mind, nervous system, emotions, memory, attention,
            relationships, and story.
          </p>

          <p style={{ fontSize: '1.0625rem', lineHeight: 1.85, color: 'var(--color-brand-text-muted)', marginBottom: '1.5rem' }}>
            Many of these patterns began as adaptations. They may have helped us survive, belong,
            stay safe, earn love, avoid pain, manage fear, or make sense of an overwhelming world.
          </p>

          <p style={{ fontSize: '1.0625rem', lineHeight: 1.85, color: 'var(--color-brand-text-muted)', marginBottom: '0' }}>
            That pattern may have been adaptive then. But old adaptations can become current
            limitations. <em>Built This Way</em> offers a more compassionate and practical explanation.
          </p>
        </div>
      </section>

      {/* ═══════════════════════════════════════
          WHAT READERS WILL LEARN
      ═══════════════════════════════════════ */}
      <section style={{ backgroundColor: 'var(--color-brand-cream)', padding: 'clamp(3.5rem,7vw,5.5rem) 1.5rem' }}>
        <div style={{ maxWidth: '900px', margin: '0 auto' }}>

          <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
            <div className="section-divider" style={{ margin: '0 auto 1rem' }} />
            <span className="eyebrow">What Readers Will Learn</span>
            <h2 style={{
              fontSize: 'clamp(1.5rem, 3vw, 2.1rem)',
              fontWeight: 800,
              color: 'var(--color-brand-text)',
              marginTop: '0.75rem',
              lineHeight: 1.2,
            }}>
              In <em>Built This Way</em>, readers will learn:
            </h2>
          </div>

          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
            gap: '1rem',
          }}>
            {LEARNS.map((item, i) => (
              <div
                key={i}
                className="card"
                style={{ padding: '1.25rem 1.5rem', display: 'flex', gap: '0.875rem', alignItems: 'flex-start' }}
              >
                <CheckCircle className="flex-shrink-0 mt-0.5" style={{ color: 'var(--color-brand-sienna)', width: 20, height: 20 }} />
                <p style={{ fontSize: '0.9375rem', lineHeight: 1.65, color: 'var(--color-brand-text)', margin: 0 }}>
                  {item}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════
          LAUNCH TEAM INVITATION
      ═══════════════════════════════════════ */}
      <section id="launch-team" className="section-dark" style={{ padding: 'clamp(3.5rem,7vw,5.5rem) 1.5rem', textAlign: 'center', scrollMarginTop: '6.25rem' }}>
        <div style={{ maxWidth: '720px', margin: '0 auto' }}>

          <Sparkles className="mx-auto mb-4" style={{ color: 'var(--color-brand-sienna-light)', width: 36, height: 36 }} />

          <h2 style={{
            fontSize: 'clamp(1.7rem, 3.5vw, 2.5rem)',
            fontWeight: 800,
            color: '#ffffff',
            marginBottom: '1.5rem',
            lineHeight: 1.15,
          }}>
            Join the <em>Built This Way</em> Launch Team
          </h2>

          <p style={{ fontSize: '1.0625rem', lineHeight: 1.85, color: 'rgba(255,255,255,0.75)', marginBottom: '1rem' }}>
            The <em>Built This Way</em> Launch Team is for people who want to help bring this work
            into the world and practice the ideas as the book prepares for release.
          </p>

          <p style={{
            fontSize: '1.125rem',
            fontWeight: 600,
            color: '#ffffff',
            marginBottom: '1rem',
          }}>
            This is more than a preorder.
          </p>

          <p style={{ fontSize: '1.0625rem', lineHeight: 1.85, color: 'rgba(255,255,255,0.75)', marginBottom: '1rem' }}>
            It is a chance to help launch a book about why painful patterns repeat, while also
            beginning to work with your own patterns in a more skillful way.
          </p>

          <p style={{ fontSize: '1.0625rem', lineHeight: 1.85, color: 'rgba(255,255,255,0.75)', marginBottom: '2.5rem' }}>
            When you join, you'll receive early access to the book and practical support for
            bringing its ideas into your daily life.
          </p>

          <Link href="/contact" className="btn-primary" style={{ fontSize: '1rem', padding: '1rem 2.5rem' }}>
            Join the Launch Team <ArrowRight className="inline w-4 h-4 ml-1" />
          </Link>
        </div>
      </section>

      {/* ═══════════════════════════════════════
          90-DAY PRACTICE INVITATION
      ═══════════════════════════════════════ */}
      <section
        style={{
          backgroundColor: 'var(--color-brand-sienna)',
          padding: 'clamp(3.5rem,7vw,5.5rem) 1.5rem',
          textAlign: 'center',
        }}
      >
        <div style={{ maxWidth: '660px', margin: '0 auto' }}>
          <h2 style={{
            fontSize: 'clamp(1.6rem, 3vw, 2.25rem)',
            fontWeight: 800,
            color: '#ffffff',
            marginBottom: '1.5rem',
            lineHeight: 1.2,
          }}>
            A 90-Day Invitation
          </h2>

          <p style={{ fontSize: '1.0625rem', lineHeight: 1.85, color: 'rgba(255,255,255,0.85)', marginBottom: '1.25rem' }}>
            If you join the Launch Team, I invite you to choose one meaningful, non-trivial
            practice for the next 90 days.
          </p>

          <div style={{
            borderLeft: '3px solid rgba(255,255,255,0.5)',
            paddingLeft: '1.25rem',
            marginBottom: '1.25rem',
            textAlign: 'left',
          }}>
            <p style={{ color: 'rgba(255,255,255,0.85)', fontStyle: 'italic', lineHeight: 1.8, margin: 0 }}>
              It does not have to look like mine.<br />
              It does need to be intentional.
            </p>
          </div>

          <p style={{ fontSize: '1.0625rem', lineHeight: 1.85, color: 'rgba(255,255,255,0.85)', marginBottom: '1.25rem' }}>
            The point is not perfection. The point is practice.
          </p>

          <p style={{ fontSize: '1.0625rem', lineHeight: 1.85, color: 'rgba(255,255,255,0.85)', marginBottom: '0' }}>
            Choose one pattern, one habit, one relationship, one reaction, or one area of your life
            where you want to become more SkillfullyAware. Then work with it gently and consistently.
          </p>

          <p style={{
            fontSize: '1.0625rem',
            fontWeight: 700,
            color: '#ffffff',
            marginTop: '1.5rem',
          }}>
            That is how change begins: not all at once, but one intentional practice at a time.
          </p>
        </div>
      </section>

      {/* ═══════════════════════════════════════
          FINAL CTA
      ═══════════════════════════════════════ */}
      <section className="section-dark" style={{ padding: 'clamp(3.5rem,7vw,5.5rem) 1.5rem', textAlign: 'center' }}>
        <div style={{ maxWidth: '660px', margin: '0 auto' }}>

          <h2 style={{
            fontSize: 'clamp(1.7rem, 3.5vw, 2.5rem)',
            fontWeight: 800,
            color: '#ffffff',
            marginBottom: '1.5rem',
            lineHeight: 1.15,
          }}>
            Help Bring <em>Built This Way</em> Into the World
          </h2>

          <p style={{ fontSize: '1.0625rem', lineHeight: 1.85, color: 'rgba(255,255,255,0.72)', marginBottom: '1.75rem' }}>
            If this book speaks to something you have lived, struggled with, or seen in people you
            care about, I would love to have you with us.
          </p>

          <div style={{
            display: 'flex',
            flexDirection: 'column',
            gap: '0.5rem',
            alignItems: 'center',
            marginBottom: '2.5rem',
          }}>
            {['Read the book.', 'Practice the work.', 'Help others find it.'].map((line, i) => (
              <p key={i} style={{ color: '#ffffff', fontWeight: 600, fontSize: '1.0625rem', margin: 0 }}>
                {line}
              </p>
            ))}
          </div>

          <Link href="/contact" className="btn-primary" style={{ fontSize: '1rem', padding: '1rem 2.75rem' }}>
            Join the Launch Team
          </Link>
        </div>
      </section>

    </main>
  );
}