'use client';

import { useState } from 'react';

export function LaunchTeamForm() {
  const [firstName, setFirstName] = useState('');
  const [email, setEmail] = useState('');
  const [heardFrom, setHeardFrom] = useState('');
  const [willingToShare, setWillingToShare] = useState(false);
  const [company, setCompany] = useState(''); // honeypot
  const [state, setState] = useState<'idle' | 'sending' | 'done' | 'error'>('idle');
  const [error, setError] = useState('');

  /**
   * The button stays disabled until there is a name and a plausible email, so
   * the form cannot be submitted empty. `required` alone only complains after
   * a click; this makes it visible that something is still needed.
   */
  const ready = firstName.trim().length > 0 && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim());

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    if (state === 'sending' || !ready) return;
    setState('sending');
    setError('');
    try {
      const res = await fetch('/api/launch-team', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ firstName, email, heardFrom, willingToShare, company }),
      });
      const data = await res.json();
      if (!res.ok) {
        setState('error');
        setError(data.error ?? 'Something went wrong. Please try again.');
        return;
      }
      setState('done');
      // The confirmation replaces the form in place, which on a long page can
      // leave someone staring at the middle of it. Bring them back to the top
      // so the thank-you is the thing they see.
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } catch {
      setState('error');
      setError('Could not reach the server. Please check your connection and try again.');
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
          padding: '2rem',
          textAlign: 'center',
        }}
      >
        <p style={{ fontSize: '1.125rem', fontWeight: 700, color: 'var(--color-brand-text)', marginTop: 0, marginBottom: '0.75rem' }}>
          You&apos;re on the team. Thank you.
        </p>
        <p style={{ fontSize: '0.9375rem', lineHeight: 1.7, color: 'var(--color-brand-text-muted)', margin: 0 }}>
          Check your email for a note from Mark. Launch updates, early excerpts, and simple ways to
          help will follow as we get closer.
        </p>
      </div>
    );
  }

  const labelStyle: React.CSSProperties = {
    display: 'block',
    fontSize: '0.875rem',
    fontWeight: 600,
    color: 'var(--color-brand-text)',
    marginBottom: '0.4rem',
  };

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
      {/* Honeypot — hidden from people, irresistible to bots. */}
      <div style={{ position: 'absolute', left: '-9999px' }} aria-hidden="true">
        <label htmlFor="lt-company">Company</label>
        <input id="lt-company" type="text" tabIndex={-1} autoComplete="off" value={company} onChange={e => setCompany(e.target.value)} />
      </div>

      <div style={{ marginBottom: '1rem' }}>
        <label htmlFor="lt-first" style={labelStyle}>First name</label>
        <input id="lt-first" type="text" required value={firstName} onChange={e => setFirstName(e.target.value)} className="form-input" style={{ width: '100%' }} />
      </div>

      <div style={{ marginBottom: '1rem' }}>
        <label htmlFor="lt-email" style={labelStyle}>Email address</label>
        <input id="lt-email" type="email" required value={email} onChange={e => setEmail(e.target.value)} className="form-input" style={{ width: '100%' }} />
      </div>

      <div style={{ marginBottom: '1rem' }}>
        <label htmlFor="lt-heard" style={labelStyle}>
          How did you hear about the book?{' '}
          <span style={{ fontWeight: 400, color: 'var(--color-brand-text-light)' }}>(optional)</span>
        </label>
        <input id="lt-heard" type="text" value={heardFrom} onChange={e => setHeardFrom(e.target.value)} className="form-input" style={{ width: '100%' }} />
      </div>

      <label style={{ display: 'flex', gap: '0.625rem', alignItems: 'flex-start', marginBottom: '1.5rem', cursor: 'pointer' }}>
        <input
          type="checkbox"
          checked={willingToShare}
          onChange={e => setWillingToShare(e.target.checked)}
          style={{ marginTop: '0.2rem', flexShrink: 0 }}
        />
        <span style={{ fontSize: '0.9375rem', lineHeight: 1.6, color: 'var(--color-brand-text-muted)' }}>
          I&apos;m willing to share the book with my network during launch week.
        </span>
      </label>

      <button
        type="submit"
        disabled={state === 'sending' || !ready}
        className="btn-primary"
        style={{
          width: '100%',
          padding: '0.9375rem 1.5rem',
          border: 'none',
          fontSize: '1rem',
          cursor: state === 'sending' ? 'wait' : ready ? 'pointer' : 'not-allowed',
          opacity: state === 'sending' || !ready ? 0.55 : 1,
          transition: 'opacity 0.15s',
        }}
      >
        {state === 'sending' ? 'Joining…' : 'Join the Launch Team'}
      </button>
      {!ready && (
        <p style={{ marginTop: '0.6rem', marginBottom: 0, fontSize: '0.8125rem', color: 'var(--color-brand-text-light)', textAlign: 'center' }}>
          Add your first name and email to join.
        </p>
      )}

      {state === 'error' && (
        <p role="alert" style={{ marginTop: '1rem', fontSize: '0.875rem', color: '#b3261e' }}>{error}</p>
      )}

      <p style={{ marginTop: '1rem', marginBottom: 0, fontSize: '0.8125rem', color: 'var(--color-brand-text-light)', textAlign: 'center' }}>
        No spam. No pressure. You can unsubscribe anytime.
      </p>
    </form>
  );
}
