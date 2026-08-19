'use client';

import { useState } from 'react';

/** Preset reasons. The `?type=` query param on inbound links selects one. */
const REASONS = [
  { value: 'general',  label: 'General enquiry' },
  { value: 'book',     label: 'Built This Way — book / launch team' },
  { value: 'saaq',     label: 'SAAQ / consultation' },
  { value: 'retreat',  label: 'Forum Retreats' },
  { value: 'call',     label: 'Book a call' },
  { value: 'speaking', label: 'Speaking / media' },
] as const;

type Status = 'idle' | 'loading' | 'success' | 'error';

export default function ContactForm({ defaultType }: { defaultType?: string }) {
  const initialReason = REASONS.some((r) => r.value === defaultType)
    ? (defaultType as string)
    : 'general';

  const [name, setName]       = useState('');
  const [email, setEmail]     = useState('');
  const [reason, setReason]   = useState(initialReason);
  const [message, setMessage] = useState('');
  const [company, setCompany] = useState(''); // honeypot — real people leave this empty
  const [status, setStatus]   = useState<Status>('idle');
  const [error, setError]     = useState('');

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!name.trim() || !email.trim() || !message.trim()) {
      setError('Please fill in your name, email, and message.');
      setStatus('error');
      return;
    }
    setStatus('loading');
    setError('');
    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name, email, reason, message, company,
          source_page: window.location.pathname + window.location.search,
        }),
      });
      if (res.ok) {
        setStatus('success');
        return;
      }
      const data = await res.json().catch(() => ({}));
      setError(data?.error || 'Something went wrong. Please try again.');
      setStatus('error');
    } catch {
      setError('Could not reach the server. Please try again.');
      setStatus('error');
    }
  }

  if (status === 'success') {
    return (
      <div
        style={{
          backgroundColor: '#ffffff',
          border: '1px solid var(--color-brand-warm-gray)',
          borderRadius: '1rem',
          padding: '2.5rem',
          textAlign: 'center',
        }}
      >
        <h3 style={{ fontFamily: 'var(--font-serif)', marginBottom: '0.75rem' }}>Thank you — message sent.</h3>
        <p style={{ color: 'var(--color-brand-text-muted)', margin: 0 }}>
          Mark reads every message personally and will get back to you soon.
        </p>
      </div>
    );
  }

  const inputStyle: React.CSSProperties = {
    width: '100%',
    padding: '0.75rem 1rem',
    borderRadius: '0.5rem',
    border: '1px solid var(--color-brand-border)',
    backgroundColor: '#ffffff',
    color: 'var(--color-brand-text)',
    fontSize: 'var(--text-body)',
    fontFamily: 'inherit',
  };

  const labelStyle: React.CSSProperties = {
    display: 'block',
    fontSize: 'var(--text-small)',
    fontWeight: 600,
    color: 'var(--color-brand-text)',
    marginBottom: '0.375rem',
  };

  return (
    <form
      onSubmit={handleSubmit}
      style={{
        backgroundColor: '#ffffff',
        border: '1px solid var(--color-brand-warm-gray)',
        borderRadius: '1rem',
        padding: '2rem',
        display: 'flex',
        flexDirection: 'column',
        gap: '1.25rem',
      }}
    >
      <div>
        <label style={labelStyle} htmlFor="contact-name">Name</label>
        <input
          id="contact-name" type="text" value={name} required
          onChange={(e) => setName(e.target.value)} style={inputStyle}
        />
      </div>

      <div>
        <label style={labelStyle} htmlFor="contact-email">Email</label>
        <input
          id="contact-email" type="email" value={email} required
          onChange={(e) => setEmail(e.target.value)} style={inputStyle}
        />
      </div>

      <div>
        <label style={labelStyle} htmlFor="contact-reason">What&apos;s this about?</label>
        <select
          id="contact-reason" value={reason}
          onChange={(e) => setReason(e.target.value)} style={inputStyle}
        >
          {REASONS.map((r) => (
            <option key={r.value} value={r.value}>{r.label}</option>
          ))}
        </select>
      </div>

      <div>
        <label style={labelStyle} htmlFor="contact-message">Message</label>
        <textarea
          id="contact-message" value={message} required rows={6}
          onChange={(e) => setMessage(e.target.value)}
          style={{ ...inputStyle, resize: 'vertical' }}
        />
      </div>

      {/* Honeypot — visually hidden, ignored by humans, filled by bots */}
      <div style={{ position: 'absolute', left: '-9999px' }} aria-hidden="true">
        <label htmlFor="contact-company">Company</label>
        <input
          id="contact-company" type="text" tabIndex={-1} autoComplete="off"
          value={company} onChange={(e) => setCompany(e.target.value)}
        />
      </div>

      {status === 'error' && error && (
        <p role="alert" style={{ color: 'var(--color-brand-red)', fontSize: 'var(--text-small)', margin: 0 }}>
          {error}
        </p>
      )}

      <button
        type="submit"
        disabled={status === 'loading'}
        className="btn btn-primary"
        style={{ alignSelf: 'flex-start', opacity: status === 'loading' ? 0.6 : 1 }}
      >
        {status === 'loading' ? 'Sending…' : 'Send message'}
      </button>
    </form>
  );
}
