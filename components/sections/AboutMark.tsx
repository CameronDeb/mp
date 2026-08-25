'use client';

import Link from 'next/link';
import Image from 'next/image';
import { ArrowRight } from 'lucide-react';
import type { HomepageCopy } from '@/lib/homepage';

export function AboutMark({
  portrait = '/images/mark-hero-v3.webp',
  copy,
}: {
  portrait?: string;
  copy: HomepageCopy;
}) {
  return (
    <section className="section" style={{ backgroundColor: 'var(--color-brand-cream)' }}>
      <div className="container">
        <div className="grid lg:grid-cols-2 gap-16 items-center">

          {/* Left — photo. Capped and centred in its column: at wide viewports
              the column outgrows the portrait's useful size, and left-aligning
              it left an obvious gap between photo and copy. */}
          <div style={{ position: 'relative', width: '100%', maxWidth: '26rem', margin: '0 auto' }}>
            <div
              style={{
                aspectRatio: '4/5',
                borderRadius: '1.25rem',
                overflow: 'hidden',
                position: 'relative',
                boxShadow: 'var(--shadow-premium)',
              }}
            >
              {/* Placeholder sits *behind* the photo so it only shows if the image
                  fails to load. Previously it was painted on top and hid the photo. */}
              <div
                style={{
                  position: 'absolute', inset: 0,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  backgroundColor: 'var(--color-brand-warm-gray)',
                }}
              >
                <span style={{ fontSize: '4rem', fontWeight: 800, color: 'var(--color-brand-text-light)' }}>MP</span>
              </div>
              <Image
                src={portrait}
                alt="Dr. Mark Pirtle"
                fill
                sizes="(max-width: 768px) 100vw, 40vw"
                className="object-cover"
                /* Source is a 2:1 landscape with Mark right-of-centre; pull the
                   crop toward him so the 4:5 frame doesn't cut him off. */
                style={{ objectPosition: '70% center' }}
              />
            </div>

            {/* Floating credential badge */}
            <div
              style={{
                position: 'absolute', bottom: '2rem', right: '-1.5rem',
                backgroundColor: '#ffffff',
                borderRadius: '1rem',
                padding: '1rem 1.25rem',
                boxShadow: 'var(--shadow-premium)',
                border: '1px solid var(--color-brand-warm-gray)',
              }}
              className="hidden lg:block"
            >
              <div style={{ fontSize: 'var(--text-xs)', color: 'var(--color-brand-text-light)', fontWeight: 600, letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: '0.25rem' }}>
                Experience
              </div>
              <div style={{ fontSize: '1.5rem', fontWeight: 800, color: 'var(--color-brand-text)', lineHeight: 1 }}>
                20+
              </div>
              <div style={{ fontSize: 'var(--text-xs)', color: 'var(--color-brand-text-muted)', marginTop: '0.2rem' }}>
                Years Coaching
              </div>
            </div>
          </div>

          {/* Right — content */}
          <div>
            <div className="section-divider mb-4" />
            <span className="eyebrow">{copy.about_eyebrow}</span>

            <h2 className="mt-4 mb-6">
              {copy.about_heading}
            </h2>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', marginBottom: '2.5rem' }}>
              {[copy.about_body_1, copy.about_body_2, copy.about_body_3].map((text, i) => (
                <p key={i} style={{ fontSize: 'var(--text-lead)', color: 'var(--color-brand-text-muted)', lineHeight: 1.75, maxWidth: '52ch' }}>
                  {text}
                </p>
              ))}
            </div>

            {/* The Story / The System / The Science pills */}
            <div style={{ display: 'flex', gap: '0.625rem', flexWrap: 'wrap', marginBottom: '2.5rem' }}>
              {['The Story', 'The System', 'The Science'].map(label => (
                <Link
                  key={label}
                  href={`/about#${label.toLowerCase().replace(' ', '-')}`}
                  style={{
                    padding: '0.4rem 1rem',
                    borderRadius: '9999px',
                    fontSize: 'var(--text-xs)',
                    fontWeight: 700,
                    letterSpacing: '0.04em',
                    textDecoration: 'none',
                    backgroundColor: 'var(--color-brand-off-white)',
                    border: '1px solid var(--color-brand-border)',
                    color: 'var(--color-brand-text)',
                    transition: 'background-color 0.15s, border-color 0.15s',
                  }}
                  onMouseEnter={e => {
                    e.currentTarget.style.backgroundColor = 'var(--color-brand-blue)';
                    e.currentTarget.style.color = '#ffffff';
                    e.currentTarget.style.borderColor = 'var(--color-brand-blue)';
                  }}
                  onMouseLeave={e => {
                    e.currentTarget.style.backgroundColor = 'var(--color-brand-off-white)';
                    e.currentTarget.style.color = 'var(--color-brand-text)';
                    e.currentTarget.style.borderColor = 'var(--color-brand-border)';
                  }}
                >
                  {label}
                </Link>
              ))}
            </div>

            <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
              <Link
                href={copy.about_cta_primary_url}
                className="inline-flex items-center gap-2"
                style={{
                  backgroundColor: '#ffffff',
                  color: '#c34d27',
                  border: '2px solid #c34d27',
                  padding: '0.875rem 1.75rem',
                  borderRadius: '9999px',
                  fontWeight: 600,
                  fontSize: 'var(--text-small)',
                  letterSpacing: '0.04em',
                  textTransform: 'uppercase' as const,
                  textDecoration: 'none',
                  transition: 'background-color 0.2s, color 0.2s',
                }}
                onMouseEnter={e => { e.currentTarget.style.backgroundColor = '#c34d27'; e.currentTarget.style.color = '#ffffff'; }}
                onMouseLeave={e => { e.currentTarget.style.backgroundColor = '#ffffff'; e.currentTarget.style.color = '#c34d27'; }}
              >
                {copy.about_cta_primary_label} <ArrowRight className="w-4 h-4" />
              </Link>

              <Link
                href={copy.about_cta_secondary_url}
                style={{
                  backgroundColor: 'transparent',
                  color: 'var(--color-brand-text)',
                  padding: '0.875rem 1.75rem',
                  borderRadius: '9999px',
                  fontWeight: 700,
                  fontSize: 'var(--text-small)',
                  letterSpacing: '0.04em',
                  textTransform: 'uppercase' as const,
                  textDecoration: 'none',
                  border: '2px solid var(--color-brand-text)',
                  transition: 'background-color 0.2s, color 0.2s',
                }}
                onMouseEnter={e => {
                  e.currentTarget.style.backgroundColor = 'var(--color-brand-text)';
                  e.currentTarget.style.color = '#ffffff';
                }}
                onMouseLeave={e => {
                  e.currentTarget.style.backgroundColor = 'transparent';
                  e.currentTarget.style.color = 'var(--color-brand-text)';
                }}
              >
                {copy.about_cta_secondary_label}
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}