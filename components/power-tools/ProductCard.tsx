'use client';

import { useState } from 'react';
import { ArrowRight } from 'lucide-react';
import { formatPrice, type Product } from '@/lib/products';

export type CardProduct = Product & {
  /** False when we cannot yet deliver it — the card shows Coming Soon. */
  deliverable: boolean;
  /** Optional "best for" line from Mark's diagnosis doc. */
  bestFor?: string;
  /** Shown as a ribbon, e.g. "Best value". */
  badge?: string;
};

const TYPE_LABEL: Record<Product['category'], string> = {
  workbook: 'Workbook',
  bundle: 'Bundle',
  meditation: 'Audio',
  class: 'Live class',
};

export function ProductCard({ product }: { product: CardProduct }) {
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function buy() {
    setBusy(true);
    setError(null);
    try {
      const res = await fetch('/api/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ product_key: product.key }),
      });
      const data = await res.json();
      if (!res.ok || !data.url) {
        setError(data.error ?? 'Could not start checkout. Please try again.');
        setBusy(false);
        return;
      }
      window.location.href = data.url;
    } catch {
      setError('Could not reach checkout. Please check your connection and try again.');
      setBusy(false);
    }
  }

  // Mark's rule: never leave a visitor guessing whether something is free,
  // paid, included or coming soon. Every card states price and status.
  const cta = product.category === 'class' ? 'Join the Class' : 'Buy Now';

  return (
    <div
      style={{
        backgroundColor: '#ffffff',
        border: '1px solid var(--color-brand-warm-gray)',
        borderRadius: '0.75rem',
        boxShadow: 'var(--shadow-card)',
        padding: '1.5rem',
        display: 'flex',
        flexDirection: 'column',
        position: 'relative',
        height: '100%',
      }}
    >
      {product.badge && (
        <span
          style={{
            position: 'absolute',
            top: '-0.6rem',
            right: '1rem',
            backgroundColor: 'var(--color-brand-sienna)',
            color: '#ffffff',
            fontSize: '0.65rem',
            fontWeight: 700,
            letterSpacing: '0.08em',
            textTransform: 'uppercase',
            padding: '0.25rem 0.6rem',
            borderRadius: '9999px',
          }}
        >
          {product.badge}
        </span>
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
          border: '1px solid rgba(192,82,42,0.2)',
          padding: '0.2rem 0.5rem',
          borderRadius: '0.25rem',
          marginBottom: '0.875rem',
        }}
      >
        {TYPE_LABEL[product.category]}
      </span>

      <h3
        style={{
          fontSize: '1.0625rem',
          fontWeight: 700,
          lineHeight: 1.3,
          color: 'var(--color-brand-text)',
          marginBottom: '0.625rem',
        }}
      >
        {product.name}
      </h3>

      <p
        style={{
          fontSize: '0.9375rem',
          lineHeight: 1.65,
          color: 'var(--color-brand-text-muted)',
          marginBottom: '0.875rem',
        }}
      >
        {product.description}
      </p>

      {product.bestFor && (
        <p
          style={{
            fontSize: '0.8125rem',
            lineHeight: 1.6,
            color: 'var(--color-brand-text-light)',
            marginBottom: '0.875rem',
          }}
        >
          <strong style={{ color: 'var(--color-brand-text-muted)' }}>Best for:</strong>{' '}
          {product.bestFor}
        </p>
      )}

      <p
        style={{
          fontSize: '0.8125rem',
          color: 'var(--color-brand-text-light)',
          marginBottom: '1.25rem',
          paddingBottom: '1.25rem',
          borderBottom: '1px solid var(--color-brand-warm-gray)',
        }}
      >
        {product.includes}
      </p>

      {/* Price and action pinned to the bottom so cards line up in a row. */}
      <div style={{ marginTop: 'auto' }}>
        <div
          style={{
            display: 'flex',
            alignItems: 'baseline',
            justifyContent: 'space-between',
            marginBottom: '0.875rem',
          }}
        >
          <span style={{ fontSize: '1.5rem', fontWeight: 700, color: 'var(--color-brand-text)' }}>
            {formatPrice(product.priceCents)}
          </span>
          {!product.deliverable && (
            <span
              style={{
                fontSize: '0.7rem',
                fontWeight: 700,
                letterSpacing: '0.06em',
                textTransform: 'uppercase',
                color: 'var(--color-brand-text-light)',
              }}
            >
              Coming soon
            </span>
          )}
        </div>

        {product.deliverable ? (
          <button
            onClick={buy}
            disabled={busy}
            style={{
              width: '100%',
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '0.4rem',
              backgroundColor: 'var(--color-brand-sienna)',
              color: '#ffffff',
              border: 'none',
              padding: '0.75rem 1.25rem',
              borderRadius: '9999px',
              fontWeight: 600,
              fontSize: '0.9375rem',
              cursor: busy ? 'wait' : 'pointer',
              opacity: busy ? 0.7 : 1,
            }}
          >
            {busy ? 'Starting checkout…' : cta}
            {!busy && <ArrowRight style={{ width: 15, height: 15 }} />}
          </button>
        ) : (
          <button
            disabled
            title="Not available for purchase yet"
            style={{
              width: '100%',
              backgroundColor: 'transparent',
              color: 'var(--color-brand-text-light)',
              border: '1.5px solid var(--color-brand-warm-gray)',
              padding: '0.75rem 1.25rem',
              borderRadius: '9999px',
              fontWeight: 600,
              fontSize: '0.9375rem',
              cursor: 'not-allowed',
            }}
          >
            Coming soon
          </button>
        )}

        {error && (
          <p role="alert" style={{ marginTop: '0.75rem', fontSize: '0.8125rem', color: '#b3261e' }}>
            {error}
          </p>
        )}
      </div>
    </div>
  );
}
