'use client';

import { useState } from 'react';

export function ResendDownloadsForm() {
  const [email, setEmail] = useState('');
  const [state, setState] = useState<'idle' | 'sending' | 'sent' | 'error'>('idle');
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
      setState('sent');
      setMessage(data.message);
    } catch {
      setState('error');
      setMessage('Could not reach the server. Please check your connection and try again.');
    }
  }

  // The success message is intentionally the same whether or not the address
  // has purchases, so this form cannot be used to discover who has bought.
  if (state === 'sent') {
    return (
      <div
        role="status"
        style={{
          backgroundColor: '#ffffff',
          border: '1px solid var(--color-brand-warm-gray)',
          borderRadius: '0.75rem',
          padding: '1.75rem',
          boxShadow: 'var(--shadow-card)',
        }}
      >
        <p style={{ margin: 0, fontSize: '1rem', lineHeight: 1.7, color: 'var(--color-brand-text)' }}>
          {message}
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={submit}>
      <label
        htmlFor="resend-email"
        style={{ display: 'block', fontSize: '0.875rem', fontWeight: 600, color: 'var(--color-brand-text)', marginBottom: '0.5rem' }}
      >
        Email address
      </label>
      <input
        id="resend-email"
        type="email"
        required
        value={email}
        onChange={e => setEmail(e.target.value)}
        placeholder="you@example.com"
        className="form-input"
        style={{ width: '100%', marginBottom: '1rem' }}
      />
      <button
        type="submit"
        disabled={state === 'sending'}
        className="btn-primary"
        style={{ width: '100%', padding: '0.875rem 1.5rem', border: 'none', cursor: state === 'sending' ? 'wait' : 'pointer', opacity: state === 'sending' ? 0.7 : 1 }}
      >
        {state === 'sending' ? 'Sending…' : 'Send my links'}
      </button>

      {state === 'error' && (
        <p role="alert" style={{ marginTop: '1rem', fontSize: '0.875rem', color: '#b3261e' }}>
          {message}
        </p>
      )}
    </form>
  );
}
