'use client';

import { useState } from 'react';
import { Play, Volume2, ChevronLeft, ChevronRight } from 'lucide-react';
import { FALLBACK_TESTIMONIALS, type Testimonial, type TestimonialType } from '@/lib/testimonials';

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

function TypeBadge({ type }: { type: TestimonialType }) {
  const config = {
    video: { label: 'Video', icon: Play, color: 'rgba(192,82,42,0.12)', border: 'rgba(192,82,42,0.3)', text: 'var(--color-brand-sienna)' },
    audio: { label: 'Audio', icon: Volume2, color: 'rgba(26,26,26,0.08)', border: 'rgba(26,26,26,0.2)', text: 'var(--color-brand-text)' },
    text: { label: 'Written', icon: null, color: 'rgba(26,26,26,0.06)', border: 'rgba(26,26,26,0.15)', text: 'var(--color-brand-text-muted)' },
  }[type];

  const Icon = config.icon;

  return (
    <span
      className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold uppercase tracking-wider"
      style={{ backgroundColor: config.color, border: `1px solid ${config.border}`, color: config.text }}
    >
      {Icon && <Icon className="w-3 h-3" />}
      {config.label}
    </span>
  );
}

function VideoCard({ t, onClick }: { t: Testimonial; onClick: () => void }) {
  return (
    <div className="card flex flex-col h-full">
      {/* Thumbnail */}
      <div
        className="relative w-full aspect-video flex items-center justify-center cursor-pointer group"
        style={{ backgroundColor: 'var(--color-brand-navy)' }}
        onClick={onClick}
      >
        {t.thumbnail ? (
          <img src={t.thumbnail} alt={t.name} className="w-full h-full object-cover" />
        ) : (
          <div
            className="absolute inset-0"
            style={{
              background: 'linear-gradient(135deg, #1a1a1a 0%, #2d1a0e 100%)',
            }}
          />
        )}
        {/* Play button */}
        <div
          className="relative z-10 w-14 h-14 rounded-full flex items-center justify-center transition-transform duration-200 group-hover:scale-110"
          style={{ backgroundColor: 'var(--color-brand-sienna)' }}
        >
          <Play className="w-6 h-6 text-white ml-0.5" />
        </div>
      </div>

      {/* Content */}
      <div className="p-6 flex flex-col flex-1">
        <div className="mb-3">
          <TypeBadge type="video" />
        </div>
        <blockquote
          className="flex-1 mb-6 italic"
          style={{ fontSize: '1rem', color: 'var(--color-brand-text)', lineHeight: 1.75 }}
        >
          "{t.quote}"
        </blockquote>
        <div className="flex items-center gap-3">
          <Initials name={t.name} />
          <div>
            <div style={{ fontWeight: 600, fontSize: 'var(--text-small)', color: 'var(--color-brand-text)' }}>
              {t.name}
            </div>
            <div style={{ fontSize: 'var(--text-xs)', color: 'var(--color-brand-text-muted)' }}>
              {t.title}{t.company ? `, ${t.company}` : ''}
            </div>
            <div style={{ fontSize: 'var(--text-xs)', color: 'var(--color-brand-text-light)' }}>
              {t.location}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function TextCard({ t }: { t: Testimonial }) {
  return (
    <div className="card p-6 flex flex-col h-full">
      <div className="mb-3">
        <TypeBadge type="text" />
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

function AudioCard({ t }: { t: Testimonial }) {
  const [playing, setPlaying] = useState(false);

  return (
    <div className="card p-6 flex flex-col h-full">
      <div className="mb-3">
        <TypeBadge type="audio" />
      </div>

      {/* Audio player bar */}
      <div
        className="flex items-center gap-3 p-3 rounded-xl mb-5"
        style={{ backgroundColor: 'var(--color-brand-off-white)', border: '1px solid var(--color-brand-warm-gray)' }}
      >
        <button
          onClick={() => setPlaying(p => !p)}
          className="w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 transition-colors duration-200"
          style={{ backgroundColor: playing ? 'var(--color-brand-sienna-dark)' : 'var(--color-brand-sienna)' }}
        >
          <Volume2 className="w-4 h-4 text-white" />
        </button>
        {/* Fake waveform */}
        <div className="flex items-center gap-0.5 flex-1">
          {Array.from({ length: 28 }).map((_, i) => (
            <div
              key={i}
              className="rounded-full flex-1"
              style={{
                height: `${8 + Math.sin(i * 0.8) * 6 + Math.random() * 4}px`,
                backgroundColor: playing && i < 10
                  ? 'var(--color-brand-sienna)'
                  : 'var(--color-brand-warm-gray)',
                transition: 'background-color 0.2s',
              }}
            />
          ))}
        </div>
        <span style={{ fontSize: 'var(--text-xs)', color: 'var(--color-brand-text-muted)', flexShrink: 0 }}>
          2:34
        </span>
      </div>

      <blockquote
        className="flex-1 mb-6 italic"
        style={{ fontSize: '1rem', color: 'var(--color-brand-text)', lineHeight: 1.8 }}
      >
        "{t.quote}"
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
  const [videoModal, setVideoModal] = useState<string | null>(null);
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

        {/* Cards grid */}
        <div className="grid md:grid-cols-3 gap-6 mb-10">
          {visible.map(t => {
            if (t.type === 'video') return <VideoCard key={t.id} t={t} onClick={() => t.mediaUrl && setVideoModal(t.mediaUrl)} />;
            if (t.type === 'audio') return <AudioCard key={t.id} t={t} />;
            return <TextCard key={t.id} t={t} />;
          })}
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

      {/* Video Modal */}
      {videoModal && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4"
          style={{ backgroundColor: 'rgba(0,0,0,0.85)' }}
          onClick={() => setVideoModal(null)}
        >
          <div
            className="w-full max-w-3xl rounded-2xl overflow-hidden"
            onClick={e => e.stopPropagation()}
          >
            <div className="aspect-video">
              <iframe
                src={videoModal.replace('vimeo.com/', 'player.vimeo.com/video/') + '?autoplay=1'}
                className="w-full h-full"
                allow="autoplay; fullscreen"
                allowFullScreen
              />
            </div>
          </div>
        </div>
      )}
    </section>
  );
}