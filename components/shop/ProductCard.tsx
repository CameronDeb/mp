import Image from 'next/image';
import { BuyButton, ComingSoon } from './BuyButton';

/**
 * A shop product card.
 *
 * Mark's diagnosis doc asks every card to answer, quickly: what is this, who is
 * it for, what problem does it solve, what do I get, what does it cost, and
 * what do I click. The prop list mirrors those questions deliberately — a card
 * missing one of them is the "resource list" behaviour he asked us to move away
 * from.
 *
 * `status` is what keeps us honest: a product with no files to deliver renders
 * Coming Soon rather than a buy button, because his other instruction is never
 * to leave a visitor guessing — and taking money for something undeliverable is
 * worse than saying "not yet".
 */
export interface ProductCardProps {
  title: string;
  badge: string;
  /** "Best for …" — who this is aimed at. */
  bestFor: string;
  /** One plain sentence on the problem it solves. */
  problem: string;
  /** Format, contents, track counts — what the buyer actually receives. */
  includes: string;
  price?: string;
  /** Struck-through original, shown only when the saving is real. */
  wasPrice?: string;
  saving?: string;
  productKey?: string;
  ctaLabel?: string;
  /** External or internal link, when this is not a Stripe purchase. */
  href?: string;
  status: 'buyable' | 'coming-soon' | 'free' | 'link';
  featured?: boolean;
  comingSoonNote?: string;
  /** Cover art. Cards without one keep the plain badge header. */
  image?: string;
}

export function ProductCard(p: ProductCardProps) {
  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        backgroundColor: '#ffffff',
        border: p.featured ? '2px solid var(--color-brand-sienna)' : '1px solid var(--color-brand-warm-gray)',
        borderRadius: '0.75rem',
        padding: '1.5rem',
        boxShadow: p.featured ? 'var(--shadow-premium)' : 'var(--shadow-card)',
        height: '100%',
        position: 'relative',
      }}
    >
      {p.featured && (
        <span
          style={{
            position: 'absolute',
            top: '-0.7rem',
            left: '1.5rem',
            backgroundColor: 'var(--color-brand-sienna)',
            color: '#ffffff',
            fontSize: '0.65rem',
            fontWeight: 700,
            letterSpacing: '0.08em',
            textTransform: 'uppercase',
            padding: '0.25rem 0.625rem',
            borderRadius: '9999px',
          }}
        >
          Best value
        </span>
      )}

      {/* Cover art. Contained rather than cropped: these are book covers, and
          cropping one cuts the title off. Slightly dimmed while a product is
          not yet buyable so the card reads as pending at a glance. */}
      {p.image && (
        <div
          style={{
            display: 'flex',
            justifyContent: 'center',
            marginBottom: '1rem',
            opacity: p.status === 'coming-soon' ? 0.55 : 1,
          }}
        >
          <Image
            src={p.image}
            alt={p.title}
            width={600}
            height={750}
            sizes="(max-width: 768px) 60vw, 220px"
            style={{
              width: '100%',
              maxWidth: '11rem',
              height: 'auto',
              borderRadius: '0.5rem',
              boxShadow: 'var(--shadow-card)',
            }}
          />
        </div>
      )}

      <span
        style={{
          alignSelf: 'flex-start',
          fontSize: '0.65rem',
          fontWeight: 700,
          letterSpacing: '0.08em',
          textTransform: 'uppercase',
          color: 'var(--color-brand-sienna)',
          backgroundColor: 'rgba(192,82,42,0.08)',
          border: '1px solid rgba(192,82,42,0.18)',
          padding: '0.2rem 0.5rem',
          borderRadius: '0.25rem',
          marginBottom: '0.875rem',
        }}
      >
        {p.badge}
      </span>

      <h3
        style={{
          fontSize: '1.0625rem',
          fontWeight: 700,
          lineHeight: 1.3,
          color: 'var(--color-brand-text)',
          margin: '0 0 0.625rem',
        }}
      >
        {p.title}
      </h3>

      <p style={{ fontSize: '0.875rem', lineHeight: 1.6, color: 'var(--color-brand-text-muted)', margin: '0 0 0.75rem' }}>
        {p.problem}
      </p>

      <p style={{ fontSize: '0.8125rem', lineHeight: 1.55, color: 'var(--color-brand-text-light)', margin: '0 0 0.375rem' }}>
        <strong style={{ color: 'var(--color-brand-text-muted)' }}>Best for:</strong> {p.bestFor}
      </p>

      <p style={{ fontSize: '0.8125rem', lineHeight: 1.55, color: 'var(--color-brand-text-light)', margin: '0 0 1.25rem' }}>
        <strong style={{ color: 'var(--color-brand-text-muted)' }}>Includes:</strong> {p.includes}
      </p>

      {/* Price sits directly above the CTA so cost and action read together. */}
      <div style={{ marginTop: 'auto' }}>
        {p.price && (
          <div style={{ display: 'flex', alignItems: 'baseline', gap: '0.5rem', marginBottom: '0.75rem' }}>
            <span style={{ fontSize: '1.375rem', fontWeight: 800, color: 'var(--color-brand-text)' }}>{p.price}</span>
            {p.wasPrice && (
              <span style={{ fontSize: '0.9375rem', color: 'var(--color-brand-text-light)', textDecoration: 'line-through' }}>
                {p.wasPrice}
              </span>
            )}
            {p.saving && (
              <span style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--color-brand-sienna)' }}>{p.saving}</span>
            )}
          </div>
        )}

        {p.status === 'buyable' && p.productKey && (
          <BuyButton productKey={p.productKey} label={p.ctaLabel ?? 'Buy Now'} variant={p.featured ? 'primary' : 'secondary'} />
        )}
        {p.status === 'coming-soon' && <ComingSoon note={p.comingSoonNote ?? 'Coming soon'} />}
        {(p.status === 'free' || p.status === 'link') && p.href && (
          <a
            href={p.href}
            {...(/^https?:\/\//.test(p.href) ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center',
              width: '100%',
              padding: '0.8125rem 1.5rem',
              borderRadius: '9999px',
              fontWeight: 600,
              fontSize: 'var(--text-small)',
              textDecoration: 'none',
              backgroundColor: p.status === 'free' ? 'var(--color-brand-sienna)' : 'transparent',
              border: p.status === 'free' ? 'none' : '1.5px solid var(--color-brand-sienna)',
              color: p.status === 'free' ? '#ffffff' : 'var(--color-brand-sienna)',
            }}
          >
            {p.ctaLabel ?? 'Learn more'}
          </a>
        )}
      </div>
    </div>
  );
}
