import type { Metadata } from 'next';
import { ResendDownloadsForm } from '@/components/power-tools/ResendDownloadsForm';

export const metadata: Metadata = {
  title: 'Resend my downloads | Power Tools | Dr. Mark Pirtle',
  description: 'Send yourself a fresh set of download links for Power Tools you have purchased.',
  robots: { index: false, follow: false },
};

export default function DownloadsPage() {
  return (
    <main style={{ fontFamily: 'var(--font-sans)', backgroundColor: 'var(--color-brand-cream)' }}>
      <section style={{ padding: 'clamp(4rem, 9vw, 6.5rem) 1.5rem' }}>
        <div style={{ maxWidth: '34rem', margin: '0 auto' }}>
          <span className="eyebrow">Downloads</span>
          <h1
            style={{
              fontSize: 'clamp(1.6rem, 3.5vw, 2.4rem)',
              fontWeight: 800,
              lineHeight: 1.2,
              color: 'var(--color-brand-text)',
              margin: '1rem 0 1.25rem',
            }}
          >
            Send my download links again
          </h1>
          <p style={{ fontSize: '1rem', lineHeight: 1.8, color: 'var(--color-brand-text-muted)', marginBottom: '2rem' }}>
            Download links expire after 72 hours. Enter the email address you used at checkout and
            we will send a fresh set for everything you have bought.
          </p>
          <ResendDownloadsForm />
        </div>
      </section>
    </main>
  );
}
