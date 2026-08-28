import type { Metadata } from 'next';
import Link from 'next/link';
import Image from 'next/image';
import { LaunchTeamForm } from '@/components/book/LaunchTeamForm';

export const metadata: Metadata = {
  title: 'Join the Built This Way Launch Team | Dr. Mark Pirtle',
  description:
    'Help Built This Way reach the people who need it. Join the launch team for early excerpts, launch updates, and simple ways to help.',
};

/**
 * The Built This Way Launch Team page.
 *
 * Copy is Mark's, from BTWLaunchTeamWebpageCopy (Aug 2026), used close to
 * verbatim. This replaced the four paid tiers — he is no longer raising money
 * for the book, so joining is an opt-in rather than a purchase.
 *
 * This page exists only for the launch window (book publishes 22 Oct 2026).
 */

const WHAT_MEMBERS_DO = [
  'Buy or preorder the book during launch week, if you’re able.',
  'Read early excerpts and become familiar with the message.',
  'Leave an honest review on Amazon, Goodreads, or another book platform.',
  'Share the book with people, groups, clients, colleagues, friends, or communities who may benefit from it.',
  'Post about the book or send a short personal recommendation during launch week.',
];

/**
 * Names are Mark's, confirmed 27 Aug 2026, and must match the newsletter that
 * goes to the whole list — it had been describing the same six things under
 * different names, so "Reader Reflection Guide" became the Pattern Reflection
 * Kit and "private live conversation" became the Pattern Lab.
 */
const WHAT_MEMBERS_RECEIVE = [
  'Early launch updates from me',
  'Selected excerpts from the book',
  'The Pattern Reflection Kit',
  'The Boundarylessness of Awareness guided audio',
  'A launch-week sharing kit with sample posts, email language, and book graphics',
  'An invitation to the Pattern Lab — a private live session with me about the book, the practices, and the larger SkillfullyAware path',
];

function Heading({ children }: { children: React.ReactNode }) {
  return (
    <h2
      style={{
        fontSize: 'clamp(1.5rem, 3vw, 2.1rem)',
        fontWeight: 800,
        color: 'var(--color-brand-text)',
        marginBottom: '1.25rem',
        lineHeight: 1.2,
      }}
    >
      {children}
    </h2>
  );
}

const P: React.CSSProperties = {
  fontSize: '1.0625rem',
  lineHeight: 1.85,
  color: 'var(--color-brand-text-muted)',
  marginBottom: '1.25rem',
};

export default function LaunchTeamPage() {
  return (
    <main style={{ fontFamily: 'var(--font-sans)' }}>

      {/* ── HERO ── */}
      <section style={{ backgroundColor: 'var(--color-brand-cream)', padding: 'clamp(3.5rem, 8vw, 6rem) 1.5rem', textAlign: 'center' }}>
        <div style={{ maxWidth: '780px', margin: '0 auto' }}>
          <span className="eyebrow">Book Launch Team</span>
          <h1
            style={{
              fontSize: 'clamp(1.9rem, 4.5vw, 3.1rem)',
              fontWeight: 800,
              letterSpacing: '-0.03em',
              lineHeight: 1.12,
              color: 'var(--color-brand-text)',
              margin: '1rem 0 1.75rem',
            }}
          >
            Help <em style={{ fontStyle: 'italic' }}>Built This Way</em> reach the people who need it.
          </h1>

          <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '1.75rem' }}>
            <Image
              src="/images/book-cover.webp"
              alt="Built This Way: Why Painful Patterns Repeat and How to Change Them, by Dr. Mark Pirtle"
              width={640}
              height={986}
              priority
              sizes="(max-width: 640px) 50vw, 220px"
              style={{ width: '100%', maxWidth: '220px', height: 'auto', borderRadius: '0.5rem', boxShadow: 'var(--shadow-premium)' }}
            />
          </div>

          <p style={{ ...P, maxWidth: '62ch', margin: '0 auto 1.25rem' }}>
            <em>Built This Way: Why Painful Patterns Repeat and How to Change Them</em> is a
            practical, personal book about why we keep repeating patterns we understand but still
            struggle to change.
          </p>
          <p style={{ ...P, maxWidth: '62ch', margin: '0 auto 2.25rem' }}>
            If the message speaks to you, I&apos;d be grateful for your help bringing it into the world.
          </p>

          <div style={{ display: 'flex', gap: '0.875rem', justifyContent: 'center', flexWrap: 'wrap' }}>
            <a href="#join" className="btn-primary" style={{ padding: '0.9375rem 2.25rem', fontSize: '1rem' }}>
              Join the Launch Team
            </a>
            <Link
              href="/power-tools/book"
              style={{ display: 'inline-flex', alignItems: 'center', border: '1.5px solid var(--color-brand-sienna)', color: 'var(--color-brand-sienna)', padding: '0.9375rem 2.25rem', borderRadius: '9999px', fontWeight: 600, fontSize: '1rem', textDecoration: 'none' }}
            >
              Learn About the Book
            </Link>
          </div>
        </div>
      </section>

      {/* ── WHAT THE BOOK IS ── */}
      <section style={{ backgroundColor: '#ffffff', padding: 'clamp(3rem, 6vw, 4.5rem) 1.5rem' }}>
        <div style={{ maxWidth: '720px', margin: '0 auto' }}>
          <Heading>What <em style={{ fontStyle: 'italic' }}>Built This Way</em> Is About</Heading>
          <p style={P}>Most of us have patterns we wish we could change.</p>
          <p style={P}>
            We know better, then react anyway. We understand the issue, but under stress the old
            response still takes over. We repeat the relationship pattern, the emotional pattern,
            the health pattern, the leadership pattern, or the story we thought we had outgrown.
          </p>
          <p style={P}><em>Built This Way</em> explains why that happens.</p>
          <p style={P}>
            The book brings together mindfulness, body awareness, nervous system science, shadow
            work, systems thinking, Buddhist psychology, and lived experience to answer one central
            question:
          </p>
          <blockquote
            style={{
              margin: '0 0 1.5rem',
              padding: '1.5rem 1.75rem',
              backgroundColor: 'var(--color-brand-off-white)',
              borderLeft: '3px solid var(--color-brand-sienna)',
              borderRadius: '0 0.5rem 0.5rem 0',
            }}
          >
            <p style={{ margin: 0, fontSize: '1.125rem', fontWeight: 700, lineHeight: 1.5, color: 'var(--color-brand-text)' }}>
              Why do painful patterns repeat, and how do we change them?
            </p>
          </blockquote>
          <p style={{ ...P, marginBottom: 0 }}>
            The message is simple: there&apos;s nothing wrong with you. There is a reason the pattern
            repeats. And with awareness, practice, and compassion, patterns can change.
          </p>
        </div>
      </section>

      {/* ── WHY LAUNCH SUPPORT MATTERS ── */}
      <section style={{ backgroundColor: 'var(--color-brand-off-white)', padding: 'clamp(3rem, 6vw, 4.5rem) 1.5rem' }}>
        <div style={{ maxWidth: '720px', margin: '0 auto' }}>
          <Heading>Why Launch Support Matters</Heading>
          <p style={P}>Books do not move into the world by themselves.</p>
          <p style={P}>
            They move because real people read them, talk about them, review them, share them,
            recommend them, and place them in the hands of someone who may need the message.
          </p>
          <p style={P}>
            <em>Built This Way</em> is for people who are trying to understand themselves more
            honestly, relate more skillfully, and stop repeating painful patterns in their lives,
            relationships, families, leadership, and health.
          </p>
          <p style={{ ...P, marginBottom: 0 }}>
            Your support during launch week can help the book reach people I may never meet. A
            review, a share, a personal recommendation, a social post, or one thoughtful
            conversation can make a real difference.
          </p>
        </div>
      </section>

      {/* ── WHAT MEMBERS DO / RECEIVE ── */}
      <section style={{ backgroundColor: '#ffffff', padding: 'clamp(3rem, 6vw, 4.5rem) 1.5rem' }}>
        <div className="container" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 20rem), 1fr))', gap: '3rem', maxWidth: '64rem' }}>
          <div>
            <Heading>What Launch Team Members Will Do</Heading>
            <p style={P}>The launch team is simple. No pressure. No complicated assignments.</p>
            <ul style={{ listStyle: 'none', padding: 0, margin: '0 0 1.25rem' }}>
              {WHAT_MEMBERS_DO.map(item => (
                <li key={item} style={{ display: 'flex', gap: '0.75rem', marginBottom: '0.875rem' }}>
                  <span aria-hidden="true" style={{ color: 'var(--color-brand-sienna)', fontWeight: 700, flexShrink: 0 }}>—</span>
                  <span style={{ fontSize: '1rem', lineHeight: 1.7, color: 'var(--color-brand-text-muted)' }}>{item}</span>
                </li>
              ))}
            </ul>
            <p style={{ ...P, marginBottom: 0, fontWeight: 600, color: 'var(--color-brand-text)' }}>
              You do not need a large audience to help. A sincere recommendation to the right person
              is what matters.
            </p>
          </div>

          <div>
            <Heading>What You&apos;ll Receive</Heading>
            <p style={P}>
              As a thank-you for helping launch <em>Built This Way</em>, launch team members will
              receive:
            </p>
            <ul style={{ listStyle: 'none', padding: 0, margin: '0 0 1.25rem' }}>
              {WHAT_MEMBERS_RECEIVE.map(item => (
                <li key={item} style={{ display: 'flex', gap: '0.75rem', marginBottom: '0.875rem' }}>
                  <span aria-hidden="true" style={{ color: 'var(--color-brand-sienna)', fontWeight: 700, flexShrink: 0 }}>+</span>
                  <span style={{ fontSize: '1rem', lineHeight: 1.7, color: 'var(--color-brand-text-muted)' }}>{item}</span>
                </li>
              ))}
            </ul>
            <p style={{ ...P, marginBottom: 0 }}>
              This is not a sales campaign to me. It is a shared effort to get useful work into the
              hands of people who are ready for it.
            </p>
          </div>
        </div>
      </section>

      {/* ── OPT-IN ── */}
      <section id="join" style={{ backgroundColor: 'var(--color-brand-off-white)', padding: 'clamp(3rem, 6vw, 5rem) 1.5rem', scrollMarginTop: '6.25rem' }}>
        <div style={{ maxWidth: '34rem', margin: '0 auto', textAlign: 'center' }}>
          <Heading>Join the <em style={{ fontStyle: 'italic' }}>Built This Way</em> Launch Team</Heading>
          <p style={{ ...P, marginBottom: '2rem' }}>
            If you&apos;d like to help <em>Built This Way</em> reach more people, enter your name and
            email below. I&apos;ll send occasional launch updates, early excerpts, simple ways to
            help, and access to launch team bonuses.
          </p>
          <LaunchTeamForm />
        </div>
      </section>
    </main>
  );
}
