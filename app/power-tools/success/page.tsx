import type { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Thank you | Power Tools | Dr. Mark Pirtle',
  // Nothing to gain from indexing a post-purchase page.
  robots: { index: false, follow: false },
};

/**
 * Post-checkout landing page.
 *
 * Deliberately does not read the Stripe session or show download links. The
 * webhook is the only thing that fulfils a purchase, and links belong in the
 * buyer's inbox rather than on a URL that could be shared or sit in browser
 * history. This page's job is to set the expectation and give a route out if
 * the email does not arrive.
 */
export default function PowerToolsSuccessPage() {
  return (
    <main style={{ fontFamily: 'var(--font-sans)', backgroundColor: 'var(--color-brand-cream)' }}>
      <section style={{ padding: 'clamp(4rem, 9vw, 7rem) 1.5rem', textAlign: 'center' }}>
        <div style={{ maxWidth: '38rem', margin: '0 auto' }}>
          <span className="eyebrow">Thank you</span>
          <h1
            style={{
              fontSize: 'clamp(1.75rem, 4vw, 2.75rem)',
              fontWeight: 800,
              lineHeight: 1.15,
              color: 'var(--color-brand-text)',
              margin: '1rem 0 1.5rem',
            }}
          >
            Your purchase is complete.
          </h1>

          <p style={{ fontSize: '1.0625rem', lineHeight: 1.8, color: 'var(--color-brand-text-muted)', marginBottom: '1.25rem' }}>
            Check your email. If you bought workbooks or a meditation program, your download links
            are on their way. If you joined a live class, Mark will be in touch directly with the
            schedule and joining details.
          </p>

          <p style={{ fontSize: '0.9375rem', lineHeight: 1.8, color: 'var(--color-brand-text-light)', marginBottom: '2.5rem' }}>
            Email can take a minute or two, and it sometimes lands in spam or promotions. If nothing
            has arrived after a few minutes, you can send yourself a fresh set of links.
          </p>

          <div style={{ display: 'flex', gap: '0.875rem', justifyContent: 'center', flexWrap: 'wrap' }}>
            <Link href="/power-tools/downloads" className="btn-primary" style={{ padding: '0.875rem 2rem' }}>
              Resend my download links
            </Link>
            <Link
              href="/power-tools"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                border: '1.5px solid var(--color-brand-sienna)',
                color: 'var(--color-brand-sienna)',
                padding: '0.875rem 2rem',
                borderRadius: '9999px',
                fontWeight: 600,
                fontSize: 'var(--text-small)',
                textDecoration: 'none',
              }}
            >
              Back to Power Tools
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
