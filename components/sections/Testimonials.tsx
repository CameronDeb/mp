'use client';

import { useState } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { FALLBACK_TESTIMONIALS, type Testimonial } from '@/lib/testimonials';

function Initials({ name }: { name: string }) {
  return (
    <div
      className="w-12 h-12 rounded-full flex items-center justify-center text-white font-bold text-sm flex-shrink-0"
      style={{ backgroundColor: 'var(--color-brand-sienna)' }}
    >
      {name.split(' ').map(n => n[0]).join('').slice(0, 2)}
    </div>
  );
}

function TypeBadge() {
  return (
    <span
      className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold uppercase tracking-wider"
      style={{
        backgroundColor: 'rgba(26,26,26,0.06)',
        border: '1px solid rgba(26,26,26,0.15)',
        color: 'var(--color-brand-text-muted)',
      }}
    >
      Written
    </span>
  );
}

function TextCard({ t }: { t: Testimonial }) {
  return (
    <div className="card p-6 flex flex-col h-full">
      <div className="mb-3">
        <TypeBadge />
      </div>
      {/* Large quote mark */}
      <div
        className="text-5xl leading-none mb-2"
        style={{ color: 'var(--color-brand-sienna)', opacity: 0.4 }}
      >
        "
      </div>
      <blockquote
        className="flex-1 mb-6 italic"
        style={{ fontSize: '1rem', color: 'var(--color-brand-text)', lineHeight: 1.8 }}
      >
        {t.quote}
      </blockquote>
      <div className="flex items-center gap-3 pt-4" style={{ borderTop: '1px solid var(--color-brand-border)' }}>
        <Initials name={t.name} />
        <div>
          <div style={{ fontWeight: 600, fontSize: 'var(--text-small)', color: 'var(--color-brand-text)' }}>
            {t.name}
          </div>
          <div style={{ fontSize: 'var(--text-xs)', color: 'var(--color-brand-text-muted)' }}>
            {t.title}{t.company ? `, ${t.company}` : ''}
          </div>
          <div style={{ fontSize: 'var(--text-xs)', color: 'var(--color-brand-text-light)', fontStyle: 'italic' }}>
            {t.location}
          </div>
        </div>
      </div>
    </div>
  );
}

export function Testimonials({
  items = FALLBACK_TESTIMONIALS,
  eyebrow = 'Testimonials',
  heading = 'What People Experience in the Work',
  intro = 'Reflections from leaders, clients, and participants who have used SkillfullyAware® to understand patterns, build trust, and practice meaningful change.',
  ctaLabel,
  ctaUrl,
}: {
  items?: Testimonial[];
  eyebrow?: string;
  heading?: string;
  intro?: string;
  /** V3 added a next step under the proof. Omit either prop to hide it. */
  ctaLabel?: string;
  ctaUrl?: string;
}) {
  const [page, setPage] = useState(0);
  const perPage = 3;
  const testimonials = items;
  const totalPages = Math.ceil(testimonials.length / perPage);
  const visible = testimonials.slice(page * perPage, page * perPage + perPage);

  if (testimonials.length === 0) return null;

  return (
    <section className="section" style={{ backgroundColor: 'var(--color-brand-off-white)' }}>
      <div className="container">

        {/* Header */}
        <div className="text-center mb-14">
          <div className="section-divider mx-auto mb-4" />
          <span className="eyebrow">{eyebrow}</span>
          <h2 className="mt-4 mb-4">
            {heading}
          </h2>
          <p className="mx-auto" style={{ maxWidth: '52ch', color: 'var(--color-brand-text-muted)' }}>
            {intro}
          </p>
        </div>

        {/* Cards grid — every testimonial renders as a written card.
            Mark, Aug 2026: the videos were not footage of the people giving the
            testimonial, so the video player and the audio card (whose waveform
            was decorative rather than real) were removed. The quotes themselves
            are genuine and are all kept. Restore from git if real recordings
            ever arrive. */}
        <div className="grid md:grid-cols-3 gap-6 mb-10">
          {visible.map(t => <TextCard key={t.id} t={t} />)}
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex items-center justify-center gap-4">
            <button
              onClick={() => setPage(p => Math.max(0, p - 1))}
              disabled={page === 0}
              className="w-10 h-10 rounded-full flex items-center justify-center transition-colors duration-200"
              style={{
                backgroundColor: '#ffffff',
                border: '1px solid var(--color-brand-border)',
                color: page === 0 ? 'var(--color-brand-text-light)' : 'var(--color-brand-text)',
                cursor: page === 0 ? 'not-allowed' : 'pointer',
              }}
            >
              <ChevronLeft className="w-4 h-4" />
            </button>

            <div className="flex gap-2">
              {Array.from({ length: totalPages }).map((_, i) => (
                <button
                  key={i}
                  onClick={() => setPage(i)}
                  className="rounded-full transition-all duration-200"
                  style={{
                    width: i === page ? '2rem' : '0.625rem',
                    height: '0.625rem',
                    backgroundColor: i === page ? 'var(--color-brand-sienna)' : 'var(--color-brand-warm-gray)',
                  }}
                />
              ))}
            </div>

            <button
              onClick={() => setPage(p => Math.min(totalPages - 1, p + 1))}
              disabled={page === totalPages - 1}
              className="w-10 h-10 rounded-full flex items-center justify-center transition-colors duration-200"
              style={{
                backgroundColor: '#ffffff',
                border: '1px solid var(--color-brand-border)',
                color: page === totalPages - 1 ? 'var(--color-brand-text-light)' : 'var(--color-brand-text)',
                cursor: page === totalPages - 1 ? 'not-allowed' : 'pointer',
              }}
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        )}

        {/* The proof earns a next step — V3 */}
        {ctaLabel && ctaUrl && (
          <div className="text-center" style={{ marginTop: '3rem' }}>
            <a href={ctaUrl} style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.5rem',
              backgroundColor: 'var(--color-brand-sienna)',
              color: '#ffffff',
              padding: '0.875rem 2rem',
              borderRadius: '9999px',
              fontWeight: 600,
              fontSize: 'var(--text-small)',
              textDecoration: 'none',
            }}>
              {ctaLabel} →
            </a>
          </div>
        )}
      </div>

    </section>
  );
}