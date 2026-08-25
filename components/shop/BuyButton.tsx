'use client';

import { useState } from 'react';

/**
 * Starts Stripe Checkout for one product.
 *
 * The price is never sent from here — only the product key. The server resolves
 * the amount from the live Stripe product, so nothing the browser can edit
 * changes what is charged.
 */
export function BuyButton({
  productKey,
  label = 'Buy Now',
  price,
  variant = 'primary',
}: {
  productKey: string;
  label?: string;
  price?: string;
  variant?: 'primary' | 'secondary';
}) {
  const [state, setState] = useState<'idle' | 'starting' | 'error'>('idle');
  const [error, setError] = useState('');

  async function buy() {
    if (state === 'starting') return;
    setState('starting');
    setError('');
    try {
      const res = await fetch('/api/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ product_key: productKey }),
      });
      const data = await res.json();
      if (!res.ok || !data.url) {
        setState('error');
        setError(data.error ?? 'Could not start checkout. Please try again.');
        return;
      }
      window.location.href = data.url;
    } catch {
      setState('error');
      setError('Could not reach checkout. Please check your connection.');
    }
  }

  const base: React.CSSProperties = {
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '0.5rem',
    width: '100%',
    padding: '0.8125rem 1.5rem',
    borderRadius: '9999px',
    fontWeight: 600,
    fontSize: 'var(--text-small)',
    cursor: state === 'starting' ? 'wait' : 'pointer',
    border: variant === 'primary' ? 'none' : '1.5px solid var(--color-brand-sienna)',
    backgroundColor: variant === 'primary' ? 'var(--color-brand-sienna)' : 'transparent',
    color: variant === 'primary' ? '#ffffff' : 'var(--color-brand-sienna)',
    opacity: state === 'starting' ? 0.7 : 1,
  };

  return (
    <div>
      <button onClick={buy} disabled={state === 'starting'} style={base}>
        {state === 'starting' ? 'Starting checkout…' : label}
        {price && state !== 'starting' ? (
          <span style={{ opacity: 0.85, fontWeight: 500 }}>· {price}</span>
        ) : null}
      </button>
      {state === 'error' && (
        <p role="alert" style={{ marginTop: '0.5rem', marginBottom: 0, fontSize: '0.8125rem', color: '#b3261e' }}>
          {error}
        </p>
      )}
    </div>
  );
}

/** Shown in place of a buy button when a product has nothing to deliver yet. */
export function ComingSoon({ note = 'Coming soon' }: { note?: string }) {
  return (
    <div
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        width: '100%',
        padding: '0.8125rem 1.5rem',
        borderRadius: '9999px',
        fontWeight: 600,
        fontSize: 'var(--text-small)',
        backgroundColor: 'var(--color-brand-off-white)',
        border: '1px solid var(--color-brand-warm-gray)',
        color: 'var(--color-brand-text-light)',
        cursor: 'default',
      }}
    >
      {note}
    </div>
  );
}
