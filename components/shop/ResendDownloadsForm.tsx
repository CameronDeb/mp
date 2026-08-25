'use client';

import { useState } from 'react';

/**
 * Requests a fresh set of download links by email.
 *
 * The success message is deliberately the same whether or not the address has
 * ever bought anything — the server answers identically too, so this cannot be
 * used to find out who Mark's customers are.
 */
export function ResendDownloadsForm() {
  const [email, setEmail] = useState('');
  const [state, setState] = useState<'idle' | 'sending' | 'done' | 'error'>('idle');
  const [message, setMessage] = useState('');

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    if (state === 'sending') return;
    setState('sending');
    try {
      const res = await fetch('/api/downloads/resend', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });
      const data = await res.json();
      if (!res.ok) {
        setState('error');
        setMessage(data.error ?? 'Something went wrong. Please try again.');
        return;
      }
      setState('done');
      setMessage(data.message);
    } catch {
      setState('error');
      setMessage('Could not reach the server. Please check your connection.');
    }
  }

  if (state === 'done') {
    return (
      <div
        role="status"
        style={{
          backgroundColor: '#ffffff',
          border: '1px solid var(--color-brand-warm-gray)',
          borderRadius: '0.75rem',
          padding: '1.75rem',
        }}
      >
        <p style={{ margin: 0, fontSize: '0.9375rem', lineHeight: 1.7, color: 'var(--color-brand-text-muted)' }}>
          {message}
        </p>
      </div>
    );
  }

  return (
    <form
      onSubmit={submit}
      style={{
        backgroundColor: '#ffffff',
        border: '1px solid var(--color-brand-warm-gray)',
        borderRadius: '0.75rem',
        padding: '1.75rem',
        textAlign: 'left',
      }}
    >
      <label
        htmlFor="dl-email"
        style={{ display: 'block', fontSize: '0.875rem', fontWeight: 600, color: 'var(--color-brand-text)', marginBottom: '0.4rem' }}
      >
        Email address used at checkout
      </label>
      <input
        id="dl-email"
        type="email"
        required
        value={email}
        onChange={e => setEmail(e.target.value)}
        className="form-input"
        style={{ width: '100%', marginBottom: '1.25rem' }}
      />
      <button
        type="submit"
        disabled={state === 'sending'}
        className="btn-primary"
        style={{ width: '100%', padding: '0.875rem 1.5rem', border: 'none', fontSize: '1rem', cursor: state === 'sending' ? 'wait' : 'pointer', opacity: state === 'sending' ? 0.7 : 1 }}
      >
        {state === 'sending' ? 'Sending…' : 'Send my download links'}
      </button>
      {state === 'error' && (
        <p role="alert" style={{ marginTop: '1rem', marginBottom: 0, fontSize: '0.875rem', color: '#b3261e' }}>
          {message}
        </p>
      )}
    </form>
  );
}
