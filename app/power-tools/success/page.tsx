import type { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Thank you | Dr. Mark Pirtle',
  robots: { index: false },
};

/**
 * Post-checkout landing page.
 *
 * Deliberately does not try to show download links. Fulfilment happens in the
 * Stripe webhook, which may not have fired by the time the buyer is redirected
 * here — rendering links from the session would race it, and showing "no files"
 * to someone who has just paid is the worst possible moment to be wrong. The
 * email is the delivery mechanism; this page just sets expectations.
 */
export default async function SuccessPage({
  searchParams,
}: {
  searchParams: Promise<{ session_id?: string }>;
}) {
  const { session_id } = await searchParams;

  return (
    <main style={{ fontFamily: 'var(--font-sans)', backgroundColor: 'var(--color-brand-cream)', minHeight: '70vh' }}>
      <section style={{ padding: 'clamp(3.5rem, 7vw, 5.5rem) 1.5rem' }}>
        <div style={{ maxWidth: '36rem', margin: '0 auto', textAlign: 'center' }}>
          <span className="eyebrow">Thank you</span>
          <h1
            style={{
              fontSize: 'clamp(1.7rem, 3.5vw, 2.4rem)',
              fontWeight: 800,
              color: 'var(--color-brand-text)',
              margin: '1rem 0 1.25rem',
              lineHeight: 1.2,
            }}
          >
            Your order is complete.
          </h1>

          <p style={{ fontSize: '1.0625rem', lineHeight: 1.8, color: 'var(--color-brand-text-muted)', marginBottom: '1.25rem' }}>
            Check your email. If you bought a download, your links are on their way and stay active
            for 72 hours. If you joined a live class, Mark will be in touch directly with the
            schedule and joining details.
          </p>

          <p style={{ fontSize: '0.9375rem', lineHeight: 1.75, color: 'var(--color-brand-text-light)', marginBottom: '2.25rem' }}>
            Nothing after a few minutes? Check your spam folder, then request a fresh set of links
            below — or just reply to the receipt and we&apos;ll sort it out.
          </p>

          <div style={{ display: 'flex', gap: '0.875rem', justifyContent: 'center', flexWrap: 'wrap' }}>
            <Link href="/power-tools/downloads" className="btn-primary" style={{ padding: '0.875rem 2rem', fontSize: '1rem' }}>
              Find my downloads
            </Link>
            <Link
              href="/power-tools"
              style={{ display: 'inline-flex', alignItems: 'center', border: '1.5px solid var(--color-brand-sienna)', color: 'var(--color-brand-sienna)', padding: '0.875rem 2rem', borderRadius: '9999px', fontWeight: 600, fontSize: '1rem', textDecoration: 'none' }}
            >
              Back to Power Tools
            </Link>
          </div>

          {session_id && (
            <p style={{ marginTop: '2rem', fontSize: '0.75rem', color: 'var(--color-brand-text-light)' }}>
              Order reference: {session_id.slice(-12)}
            </p>
          )}
        </div>
      </section>
    </main>
  );
}
