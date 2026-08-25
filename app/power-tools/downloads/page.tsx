import type { Metadata } from 'next';
import { ResendDownloadsForm } from '@/components/shop/ResendDownloadsForm';

export const metadata: Metadata = {
  title: 'Find my downloads | Dr. Mark Pirtle',
  description: 'Request a fresh set of download links for your Power Tools purchases.',
  robots: { index: false },
};

export default function DownloadsPage() {
  return (
    <main style={{ fontFamily: 'var(--font-sans)', backgroundColor: 'var(--color-brand-cream)', minHeight: '70vh' }}>
      <section style={{ padding: 'clamp(3.5rem, 7vw, 5.5rem) 1.5rem' }}>
        <div style={{ maxWidth: '34rem', margin: '0 auto', textAlign: 'center' }}>
          <span className="eyebrow">Downloads</span>
          <h1
            style={{
              fontSize: 'clamp(1.6rem, 3.5vw, 2.25rem)',
              fontWeight: 800,
              color: 'var(--color-brand-text)',
              margin: '1rem 0 1rem',
              lineHeight: 1.2,
            }}
          >
            Find my downloads
          </h1>
          <p style={{ fontSize: '1.0625rem', lineHeight: 1.8, color: 'var(--color-brand-text-muted)', marginBottom: '2rem' }}>
            Download links expire after 72 hours. Enter the email address you used at checkout and
            we&apos;ll send a fresh set.
          </p>
          <ResendDownloadsForm />
        </div>
      </section>
    </main>
  );
}
