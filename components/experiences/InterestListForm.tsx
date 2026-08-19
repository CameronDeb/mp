
'use client';

import { useState } from 'react';

export function InterestListForm({ experienceSlug }: { experienceSlug: string }) {
  const [firstName, setFirstName] = useState('');
  const [email, setEmail] = useState('');
  const [company, setCompany] = useState(''); // honeypot — real people leave this empty
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');

  async function handleSubmit() {
    if (!firstName || !email) return;
    setStatus('loading');
    try {
      const res = await fetch('/api/interest-list', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ firstName, email, experience: experienceSlug, company }),
      });
      setStatus(res.ok ? 'success' : 'error');
    } catch {
      setStatus('error');
    }
  }

  if (status === 'success') {
    return (
      <p style={{
        color: 'var(--color-brand-blue)',
        fontWeight: 600,
        fontSize: 'var(--text-small)',
      }}>
        You&apos;re on the list. Check your inbox for what comes next.
      </p>
    );
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
      <input
        type="text"
        placeholder="First Name"
        value={firstName}
        onChange={(e) => setFirstName(e.target.value)}
        className="interest-form-input"
      />
      <input
        type="email"
        placeholder="Email Address"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        className="interest-form-input"
      />
      {/* Honeypot — visually hidden, ignored by humans, filled by bots */}
      <div style={{ position: 'absolute', left: '-9999px' }} aria-hidden="true">
        <label htmlFor={`il-company-${experienceSlug}`}>Company</label>
        <input
          id={`il-company-${experienceSlug}`} type="text" tabIndex={-1} autoComplete="off"
          value={company} onChange={(e) => setCompany(e.target.value)}
        />
      </div>
      <button
        onClick={handleSubmit}
        disabled={status === 'loading'}
        className="btn-primary"
        style={{ opacity: status === 'loading' ? 0.6 : 1 }}
      >
        {status === 'loading' ? 'Joining...' : 'Join the Interest List'}
      </button>
      <p style={{
        fontSize: 'var(--text-xs)',
        color: 'var(--color-brand-text-light)',
      }}>
        You&apos;ll receive a short email series on this experience. Unsubscribe anytime.
      </p>
      {status === 'error' && (
        <p style={{ color: '#dc2626', fontSize: 'var(--text-xs)' }}>
          Something went wrong. Please try again.
        </p>
      )}
    </div>
  );
}