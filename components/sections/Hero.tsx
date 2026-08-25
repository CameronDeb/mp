'use client';
import Link from 'next/link';
import Image from 'next/image';
import type { HomepageCopy } from '@/lib/homepage';

/** Alternating brand colours for the audience CTAs, in Figma order. */
const CTA_COLORS = ['#c34d27', '#3d8cad'];
const CTA_WIDTHS = ['17.5rem', '19.375rem'];

export function Hero({
  image = '/images/mark-hero-v3.webp',
  copy,
}: {
  image?: string;
  copy: HomepageCopy;
}) {
  return (
    <section style={{ backgroundColor: 'var(--color-brand-cream)', paddingTop: '6.25rem', paddingBottom: '2rem' }}>
      <div className="container">
        {/* Hero image card */}
        {/* Sizing, photo crop and scrim are all viewport-dependent, so they
            live in globals.css under .hero-* rather than inline here. */}
        <div className="hero-card" style={{
          position: 'relative',
          borderRadius: '0.75rem',
          overflow: 'hidden',
          display: 'flex',
          flexDirection: 'column',
        }}>

          {/* Background photo */}
          <Image
            src={image}
            alt="Dr. Mark Pirtle"
            fill
            className="object-cover hero-photo"
            priority
          />

          {/* Scrim behind the text — horizontal on desktop, vertical on mobile */}
          <div className="hero-scrim" />

          {/* Content */}
          <div className="hero-content" style={{
            position: 'relative',
            display: 'flex',
            flexDirection: 'column',
            gap: '2.2rem',
            padding: 'clamp(1.5rem, 3vw, 1.875rem) clamp(2rem, 10vw, 7.875rem) clamp(4rem, 8vw, 7rem) clamp(1.5rem, 4vw, 3.75rem)',
            flex: 1,
          }}>

            <h1 style={{
              fontSize: 'clamp(2.25rem, 5.5vw, 5rem)',
              fontWeight: 600,
              lineHeight: 1.0625,
              color: '#ffffff',
              maxWidth: '14ch',
              margin: 0,
            }}>
              {copy.hero_headline}
            </h1>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', maxWidth: '35rem' }}>
              <p style={{
                fontSize: 'clamp(1rem, 1.4vw, 1.25rem)',
                color: 'rgba(255,255,255,0.7)',
                lineHeight: 1.5,
                margin: 0,
              }}>
                {copy.hero_body_1}
              </p>
              <p style={{
                fontSize: 'clamp(1rem, 1.4vw, 1.25rem)',
                color: '#ffffff',
                lineHeight: 1.5,
                margin: 0,
              }}>
                {copy.hero_body_2}
              </p>
            </div>

            <p style={{
              fontSize: '1rem',
              color: 'rgba(255,255,255,0.7)',
              fontWeight: 600,
              letterSpacing: '0.05em',
              margin: 0,
            }}>
              {copy.hero_orientation_line}
            </p>

            {/* Two audience CTAs */}
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '1.25rem' }}>
              {copy.hero_ctas.map((cta, i) => (
                <Link key={cta.title} href={cta.url} style={{
                  display: 'inline-flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: 'center',
                  backgroundColor: CTA_COLORS[i % CTA_COLORS.length],
                  color: '#ffffff',
                  padding: '0.875rem 1.5rem',
                  borderRadius: '9999px',
                  textDecoration: 'none',
                  minWidth: CTA_WIDTHS[i % CTA_WIDTHS.length],
                  height: '4.6875rem',
                  gap: '0.2rem',
                }}>
                  <span style={{ fontWeight: 600, fontSize: '1rem', letterSpacing: '0.03em' }}>
                    {cta.title}
                  </span>
                  <span style={{ fontSize: '0.8125rem', color: 'rgba(255,255,255,0.8)', fontWeight: 400 }}>
                    {cta.subtitle}
                  </span>
                </Link>
              ))}
            </div>

            {/* V3 removed this link — it opened a second path-selection moment.
                It renders again the moment hero_scroll_label has a value. */}
            {copy.hero_scroll_label && (
              <Link href={copy.hero_scroll_url} style={{
                fontSize: '1rem',
                color: '#3d8cad',
                textDecoration: 'none',
                fontWeight: 600,
                letterSpacing: '0.03em',
              }}>
                {copy.hero_scroll_label}
              </Link>
            )}

          </div>

          {/* Bottom spacer (matches Figma spacer h-80px) */}
          <div style={{ position: 'relative', height: '5rem', flexShrink: 0 }} />

        </div>
      </div>
    </section>
  );
}
