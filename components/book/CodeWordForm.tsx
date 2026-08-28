'use client';

import { useState } from 'react';

/**
 * Code-word gate for the Chapter 8 audio.
 *
 * The code is never held here — it is posted to the server and checked there,
 * so it stays out of the browser bundle. On success the server returns a signed
 * link, and the button becomes the download.
 */
export function CodeWordForm() {
  const [code, setCode] = useState('');
  const [state, setState] = useState<'idle' | 'checking' | 'ok' | 'error'>('idle');
  const [error, setError] = useState('');
  const [download, setDownload] = useState<{ url: string; filename: string } | null>(null);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    if (state === 'checking') return;
    setState('checking');
    setError('');
    try {
      const res = await fetch('/api/boundarylessness', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ code }),
      });
      const data = await res.json();
      if (!res.ok) {
        setState('error');
        setError(data.error ?? 'Something went wrong. Please try again.');
        return;
      }
      setDownload({ url: data.url, filename: data.filename });
      setState('ok');
    } catch {
      setState('error');
      setError('Could not reach the server. Please check your connection.');
    }
  }

  if (state === 'ok' && download) {
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
        <p
          style={{
            fontSize: '1.0625rem',
            fontWeight: 700,
            color: 'var(--color-brand-text)',
            margin: '0 0 0.5rem',
          }}
        >
          That&apos;s the one. Here it is.
        </p>
        <p
          style={{
            fontSize: '0.9375rem',
            lineHeight: 1.7,
            color: 'var(--color-brand-text-muted)',
            margin: '0 0 1.5rem',
          }}
        >
          Give it your full attention the first time through, then come back to it whenever the
          chapter feels relevant again.
        </p>
        <a
          href={download.url}
          className="btn-primary"
          style={{ padding: '0.875rem 2rem', fontSize: '1rem', textDecoration: 'none' }}
        >
          Download the audio
        </a>
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
        htmlFor="code-word"
        style={{
          display: 'block',
          fontSize: '0.875rem',
          fontWeight: 600,
          color: 'var(--color-brand-text)',
          marginBottom: '0.4rem',
        }}
      >
        Code word from Chapter 8
      </label>
      <input
        id="code-word"
        type="text"
        required
        autoComplete="off"
        autoCapitalize="none"
        spellCheck={false}
        value={code}
        onChange={(e) => setCode(e.target.value)}
        className="form-input"
        style={{ width: '100%', marginBottom: '1.25rem' }}
      />
      <button
        type="submit"
        disabled={state === 'checking'}
        className="btn-primary"
        style={{
          width: '100%',
          padding: '0.875rem 1.5rem',
          border: 'none',
          fontSize: '1rem',
          cursor: state === 'checking' ? 'wait' : 'pointer',
          opacity: state === 'checking' ? 0.7 : 1,
        }}
      >
        {state === 'checking' ? 'Checking…' : 'Unlock the audio'}
      </button>
      {state === 'error' && (
        <p
          role="alert"
          style={{ marginTop: '1rem', marginBottom: 0, fontSize: '0.875rem', color: '#b3261e' }}
        >
          {error}
        </p>
      )}
    </form>
  );
}
