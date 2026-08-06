'use client';
import { useState } from 'react';

const bgMap: Record<string, string> = {
  sienna: 'var(--color-brand-sienna)',
  navy:   'var(--color-brand-navy)',
  cream:  'var(--color-brand-cream)',
};

export type NewsletterSignupProps = {
  anchorId?: string;
  background?: 'sienna' | 'navy' | 'cream';
  eyebrow?: string;
  heading: string;
  body: string;
  buttonLabel: string;
  privacyLine: string;
};

export function NewsletterSignup({
  anchorId = 'newsletter',
  background = 'sienna',
  eyebrow = 'Newsletter',
  heading,
  body,
  buttonLabel,
  privacyLine,
}: NewsletterSignupProps) {
  const [email, setEmail] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState(false);

  const onCream    = background === 'cream';
  const ink        = onCream ? 'var(--color-brand-text)'       : '#ffffff';
  const inkMuted   = onCream ? 'var(--color-brand-text-muted)' : 'rgba(255,255,255,0.75)';
  const inkFaint   = onCream ? 'var(--color-brand-text-light)' : 'rgba(255,255,255,0.45)';
  const inkEyebrow = onCream ? 'var(--color-brand-sienna)'     : 'rgba(255,255,255,0.6)';

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(false);
    try {
      const res = await fetch('/api/newsletter/subscribe', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, source_page: window.location.pathname }),
      });
      if (res.ok) setSubmitted(true);
      else setError(true);
    } catch {
      setError(true);
    }
  };

  return (
    <section id={anchorId} style={{
      backgroundColor: bgMap[background] ?? bgMap.sienna,
      padding: '5rem 0',
    }}>
      <div className="container">
      <div style={{ maxWidth: '48rem', margin: '0 auto', textAlign: 'center' }}>

        <p style={{
          fontSize: '1rem',
          fontWeight: 500,
          letterSpacing: '0.06em',
          textTransform: 'uppercase',
          color: inkEyebrow,
          marginBottom: '1rem',
        }}>
          {eyebrow}
        </p>

        <h2 style={{
          fontSize: 'clamp(1.75rem, 3vw, 2.5rem)',
          fontWeight: 600,
          color: ink,
          marginBottom: '1rem',
          letterSpacing: '-0.02em',
        }}>
          {heading}
        </h2>

        <p style={{
          fontSize: '1.05rem',
          color: inkMuted,
          lineHeight: 1.7,
          maxWidth: '44ch',
          margin: '0 auto 2.5rem',
        }}>
          {body}
        </p>

        {submitted ? (
          <p style={{ fontSize: '1.1rem', fontWeight: 600, color: ink }}>
            You&apos;re in. Watch your inbox.
          </p>
        ) : (
          <form onSubmit={handleSubmit} style={{
            display: 'flex',
            gap: '0.75rem',
            maxWidth: '36rem',
            margin: '0 auto',
            flexWrap: 'wrap',
          }}>
            <input
              type="email"
              required
              value={email}
              onChange={e => setEmail(e.target.value)}
              placeholder="Enter your email"
              /* V3 design fix: the field read as low-contrast against the orange
                 band. It now has an explicit white fill, a defined edge, and a
                 darkened placeholder (see .newsletter-input in globals.css). */
              className="newsletter-input"
              style={{
                flex: 1,
                minWidth: '200px',
                padding: '0.875rem 1.25rem',
                borderRadius: '9999px',
                backgroundColor: '#ffffff',
                border: onCream
                  ? '1px solid var(--color-brand-border)'
                  : '1px solid rgba(0,0,0,0.18)',
                fontSize: 'var(--text-small)',
                outline: 'none',
                color: 'var(--color-brand-text)',
              }}
            />
            <button type="submit" style={{
              backgroundColor: onCream ? 'var(--color-brand-sienna)' : '#ffffff',
              color: onCream ? '#ffffff' : 'var(--color-brand-sienna)',
              padding: '0.875rem 1.75rem',
              borderRadius: '9999px',
              fontWeight: 700,
              fontSize: 'var(--text-small)',
              border: 'none',
              cursor: 'pointer',
              whiteSpace: 'nowrap',
            }}>
              {buttonLabel}
            </button>
          </form>
        )}

        {error && (
          <p style={{ color: inkMuted, fontSize: 'var(--text-small)', marginTop: '1rem' }}>
            Something went wrong. Please try again.
          </p>
        )}

        <p style={{ fontSize: 'var(--text-xs)', color: inkFaint, marginTop: '1.25rem' }}>
          {privacyLine}
        </p>

      </div>
      </div>
    </section>
  );
}
