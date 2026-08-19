'use client';

import { useState } from 'react';

// Fields mirror the `forum_retreat_inquiries` collection in Directus. Values in the
// dropdowns must match the collection's choice values exactly — the API route drops
// anything it doesn't recognise rather than storing it.

const GROUP_SIZES = [
  { value: '5-10',  label: '5–10 people'  },
  { value: '11-20', label: '11–20 people' },
  { value: '21-40', label: '21–40 people' },
  { value: '40+',   label: '40+ people'   },
];

const LENGTHS = [
  { value: '1',  label: '1 day'     },
  { value: '2',  label: '2 days'    },
  { value: '3',  label: '3 days'    },
  { value: '4+', label: '4+ days'   },
];

const BUDGETS = [
  { value: '<$5k',       label: 'Under $5k'  },
  { value: '$5k–$10k',   label: '$5k–$10k'   },
  { value: '$10k–$25k',  label: '$10k–$25k'  },
  { value: '$25k+',      label: '$25k+'      },
];

const GOALS = ['Leadership', 'Team Cohesion', 'Shadow Work', 'Mindfulness', 'Strategic Planning'];

type Status = 'idle' | 'loading' | 'success' | 'error';

export function ForumRetreatInquiryForm() {
  const [name, setName]         = useState('');
  const [email, setEmail]       = useState('');
  const [phone, setPhone]       = useState('');
  const [org, setOrg]           = useState('');
  const [groupSize, setGroupSize]   = useState('');
  const [dates, setDates]       = useState('');
  const [length, setLength]     = useState('');
  const [goals, setGoals]       = useState<string[]>([]);
  const [budget, setBudget]     = useState('');
  const [notes, setNotes]       = useState('');
  const [company, setCompany]   = useState(''); // honeypot
  const [status, setStatus]     = useState<Status>('idle');
  const [error, setError]       = useState('');

  function toggleGoal(goal: string) {
    setGoals((prev) => (prev.includes(goal) ? prev.filter((g) => g !== goal) : [...prev, goal]));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!name.trim() || !email.trim()) {
      setError('Please fill in your name and email.');
      setStatus('error');
      return;
    }
    setStatus('loading');
    setError('');
    try {
      const res = await fetch('/api/forum-retreat-inquiry', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name, email, phone,
          forum_organization: org,
          group_size: groupSize,
          preferred_dates: dates,
          retreat_length: length,
          primary_goals: goals,
          budget_range: budget,
          notes,
          company,
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
      <div style={{
        backgroundColor: '#ffffff', borderRadius: '1rem', padding: '2.5rem', textAlign: 'center',
      }}>
        <h3 style={{ fontFamily: 'var(--font-serif)', marginBottom: '0.75rem' }}>
          Thank you — your inquiry is in.
        </h3>
        <p style={{ color: 'var(--color-brand-text-muted)', margin: 0 }}>
          Check your inbox for a confirmation. Mark will be in touch to arrange a short planning call.
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
    textAlign: 'left',
  };

  return (
    <form
      onSubmit={handleSubmit}
      style={{
        backgroundColor: '#ffffff',
        borderRadius: '1rem',
        padding: '2rem',
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
        gap: '1.25rem',
        textAlign: 'left',
      }}
    >
      <div>
        <label style={labelStyle} htmlFor="fr-name">Name *</label>
        <input id="fr-name" type="text" value={name} required
          onChange={(e) => setName(e.target.value)} style={inputStyle} />
      </div>

      <div>
        <label style={labelStyle} htmlFor="fr-email">Email *</label>
        <input id="fr-email" type="email" value={email} required
          onChange={(e) => setEmail(e.target.value)} style={inputStyle} />
      </div>

      <div>
        <label style={labelStyle} htmlFor="fr-phone">Phone</label>
        <input id="fr-phone" type="tel" value={phone}
          onChange={(e) => setPhone(e.target.value)} style={inputStyle} />
      </div>

      <div>
        <label style={labelStyle} htmlFor="fr-org">Forum or organization</label>
        <input id="fr-org" type="text" value={org}
          onChange={(e) => setOrg(e.target.value)} style={inputStyle} />
      </div>

      <div>
        <label style={labelStyle} htmlFor="fr-size">Group size</label>
        <select id="fr-size" value={groupSize}
          onChange={(e) => setGroupSize(e.target.value)} style={inputStyle}>
          <option value="">Select…</option>
          {GROUP_SIZES.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}
        </select>
      </div>

      <div>
        <label style={labelStyle} htmlFor="fr-length">Retreat length</label>
        <select id="fr-length" value={length}
          onChange={(e) => setLength(e.target.value)} style={inputStyle}>
          <option value="">Select…</option>
          {LENGTHS.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}
        </select>
      </div>

      <div>
        <label style={labelStyle} htmlFor="fr-dates">Preferred dates</label>
        <input id="fr-dates" type="text" value={dates} placeholder="e.g. Spring 2027, or flexible"
          onChange={(e) => setDates(e.target.value)} style={inputStyle} />
      </div>

      <div>
        <label style={labelStyle} htmlFor="fr-budget">Budget range</label>
        <select id="fr-budget" value={budget}
          onChange={(e) => setBudget(e.target.value)} style={inputStyle}>
          <option value="">Select…</option>
          {BUDGETS.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}
        </select>
      </div>

      <fieldset style={{ gridColumn: '1 / -1', border: 'none', padding: 0, margin: 0 }}>
        <legend style={{ ...labelStyle, padding: 0 }}>What do you want the retreat to do?</legend>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
          {GOALS.map((goal) => {
            const active = goals.includes(goal);
            return (
              <button
                key={goal} type="button" onClick={() => toggleGoal(goal)}
                aria-pressed={active}
                style={{
                  padding: '0.5rem 1rem',
                  borderRadius: '9999px',
                  border: `1px solid ${active ? 'var(--color-brand-sienna)' : 'var(--color-brand-border)'}`,
                  backgroundColor: active ? 'var(--color-brand-sienna)' : '#ffffff',
                  color: active ? '#ffffff' : 'var(--color-brand-text)',
                  fontSize: 'var(--text-small)',
                  fontFamily: 'inherit',
                  fontWeight: 600,
                  cursor: 'pointer',
                  transition: 'background-color 0.15s, border-color 0.15s',
                }}
              >
                {goal}
              </button>
            );
          })}
        </div>
      </fieldset>

      <div style={{ gridColumn: '1 / -1' }}>
        <label style={labelStyle} htmlFor="fr-notes">Anything else we should know?</label>
        <textarea id="fr-notes" value={notes} rows={5}
          onChange={(e) => setNotes(e.target.value)}
          style={{ ...inputStyle, resize: 'vertical' }} />
      </div>

      {/* Honeypot — visually hidden, ignored by humans, filled by bots */}
      <div style={{ position: 'absolute', left: '-9999px' }} aria-hidden="true">
        <label htmlFor="fr-company">Company</label>
        <input id="fr-company" type="text" tabIndex={-1} autoComplete="off"
          value={company} onChange={(e) => setCompany(e.target.value)} />
      </div>

      {status === 'error' && error && (
        <p role="alert" style={{
          gridColumn: '1 / -1', color: 'var(--color-brand-red, #dc2626)',
          fontSize: 'var(--text-small)', margin: 0,
        }}>
          {error}
        </p>
      )}

      <div style={{ gridColumn: '1 / -1' }}>
        <button
          type="submit"
          disabled={status === 'loading'}
          className="btn btn-primary"
          style={{ opacity: status === 'loading' ? 0.6 : 1 }}
        >
          {status === 'loading' ? 'Sending…' : 'Send Inquiry'}
        </button>
        <p style={{
          fontSize: 'var(--text-xs)', color: 'var(--color-brand-text-muted)',
          marginTop: '0.75rem', marginBottom: 0,
        }}>
          No commitment — this just gives Mark enough context to begin shaping the right conversation.
        </p>
      </div>
    </form>
  );
}
