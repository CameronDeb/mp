import Link from 'next/link';

/**
 * The "choose your path" cards, shown only on phones.
 *
 * On desktop the same choice is made in the hero and again across the
 * leadership, Power Tools and About sections. On a phone those are hidden, so
 * this is the single place a visitor decides where to go — three options, one
 * line of explanation each, one button.
 *
 * Copy is Mark's, from his mobile brief.
 */

const PATHS = [
  {
    title: 'Understand My Patterns',
    body: 'Start with the book and reflection tool.',
    cta: 'Start Here',
    href: '/power-tools/book',
  },
  {
    title: 'Practice the Change',
    body: 'Explore workbooks, classes, guided audio, and practical tools.',
    cta: 'Explore Power Tools',
    href: '/power-tools',
  },
  {
    title: 'Leadership, Forums & Retreats',
    body: 'For leaders, founders, forums, and teams working with patterns under pressure.',
    cta: 'Explore Leadership Work',
    href: '/consultation',
  },
];

export function MobilePathCards() {
  return (
    <section style={{ backgroundColor: 'var(--color-brand-off-white)', padding: '2.5rem 1.25rem' }}>
      <h2
        style={{
          fontSize: '1.4rem',
          fontWeight: 800,
          color: 'var(--color-brand-text)',
          margin: '0 0 1.25rem',
          lineHeight: 1.25,
        }}
      >
        Where would you like to start?
      </h2>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.875rem' }}>
        {PATHS.map((p) => (
          <div
            key={p.title}
            style={{
              backgroundColor: '#ffffff',
              border: '1px solid var(--color-brand-warm-gray)',
              borderRadius: '0.75rem',
              padding: '1.25rem',
              boxShadow: 'var(--shadow-card)',
            }}
          >
            <h3
              style={{
                fontSize: '1.0625rem',
                fontWeight: 700,
                color: 'var(--color-brand-text)',
                margin: '0 0 0.4rem',
                lineHeight: 1.3,
              }}
            >
              {p.title}
            </h3>
            <p
              style={{
                fontSize: '0.9375rem',
                lineHeight: 1.6,
                color: 'var(--color-brand-text-muted)',
                margin: '0 0 1rem',
              }}
            >
              {p.body}
            </p>
            <Link
              href={p.href}
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                width: '100%',
                /* 48px tall: comfortably tappable rather than a desktop button
                   that happens to be on a phone. */
                minHeight: '3rem',
                border: '1.5px solid var(--color-brand-sienna)',
                color: 'var(--color-brand-sienna)',
                borderRadius: '9999px',
                fontWeight: 600,
                fontSize: 'var(--text-small)',
                textDecoration: 'none',
              }}
            >
              {p.cta}
            </Link>
          </div>
        ))}
      </div>
    </section>
  );
}
