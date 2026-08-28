import type { Metadata } from 'next';
import Link from 'next/link';
import { CodeWordForm } from '@/components/book/CodeWordForm';

export const metadata: Metadata = {
  title: 'Boundarylessness of Awareness | Dr. Mark Pirtle',
  description:
    'The guided audio practice that accompanies Chapter 8 of Built This Way. Enter the code word from the chapter to listen.',
};

/**
 * The page Chapter 8 sends readers to, printed as drmarkpirtle.com/boundarylessness.
 *
 * Book readers arrive here with a code word from the page they were just
 * reading. The gate exists to keep the audio tied to the book rather than to
 * secure it — the word is in print, so it is semi-public by design.
 */
export default function BoundarylessnessPage() {
  return (
    <main style={{ fontFamily: 'var(--font-sans)' }}>
      <section
        style={{
          backgroundColor: 'var(--color-brand-cream)',
          padding: 'clamp(3.5rem, 7vw, 5.5rem) 1.5rem',
        }}
      >
        <div style={{ maxWidth: '34rem', margin: '0 auto', textAlign: 'center' }}>
          <span className="eyebrow">Chapter 8 · Reader Bonus</span>
          <h1
            style={{
              fontSize: 'clamp(1.75rem, 4vw, 2.6rem)',
              fontWeight: 800,
              letterSpacing: '-0.02em',
              lineHeight: 1.15,
              color: 'var(--color-brand-text)',
              margin: '1rem 0 1.25rem',
            }}
          >
            Boundarylessness of Awareness
          </h1>
          <p
            style={{
              fontSize: '1.0625rem',
              lineHeight: 1.8,
              color: 'var(--color-brand-text-muted)',
              margin: '0 0 1rem',
            }}
          >
            A guided audio practice for noticing that awareness itself has no edges. It
            accompanies Chapter 8 of <em>Built This Way</em>, and it lands best once you have read
            that chapter.
          </p>
          <p
            style={{
              fontSize: '0.9375rem',
              lineHeight: 1.75,
              color: 'var(--color-brand-text-light)',
              margin: '0 0 2rem',
            }}
          >
            Enter the code word from the chapter to listen.
          </p>

          <CodeWordForm />

          <p
            style={{
              marginTop: '2rem',
              fontSize: '0.875rem',
              lineHeight: 1.7,
              color: 'var(--color-brand-text-light)',
            }}
          >
            Don&apos;t have the book yet?{' '}
            <Link href="/power-tools/book" style={{ color: 'var(--color-brand-sienna)' }}>
              Built This Way publishes on 22 October
            </Link>
            .
          </p>
        </div>
      </section>
    </main>
  );
}
