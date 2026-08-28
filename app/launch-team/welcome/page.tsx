import type { Metadata } from 'next';
import Link from 'next/link';
import { LAUNCH_MATERIALS, materialStatus } from '@/lib/launch-team-materials';
import { createDownloadToken } from '@/lib/downloads';

export const metadata: Metadata = {
  title: 'Launch Team Materials | Built This Way',
  description: 'Everything the Built This Way Launch Team receives, in one place.',
  // Unlisted rather than gated: these are free thank-yous, not paid goods, and
  // a login wall would cost more members than the materials are worth
  // protecting. Members reach it from their welcome email and bookmark it.
  robots: { index: false, follow: false },
};

export const dynamic = 'force-dynamic';

/**
 * Where launch team members collect what Mark promised them.
 *
 * Download links are minted fresh on every render rather than emailed once.
 * Members need access across the whole eight-week run-up, and a link posted in
 * an email would expire long before publication day — this way the page is the
 * durable thing and the links behind it are always current.
 */
export default function LaunchTeamWelcomePage() {
  const materials = LAUNCH_MATERIALS.map((m) => {
    const status = materialStatus(m);
    return {
      ...m,
      status,
      links:
        status === 'ready'
          ? m.files.map((f) => ({
              filename: f.filename,
              url: `/api/download/${createDownloadToken(f.key, f.filename)}`,
            }))
          : [],
    };
  });

  const readyCount = materials.filter((m) => m.status !== 'coming').length;

  return (
    <main style={{ fontFamily: 'var(--font-sans)' }}>
      <section
        style={{
          backgroundColor: 'var(--color-brand-cream)',
          padding: 'clamp(3rem, 7vw, 5rem) 1.5rem clamp(2rem, 4vw, 3rem)',
          textAlign: 'center',
        }}
      >
        <div style={{ maxWidth: '46rem', margin: '0 auto' }}>
          <span className="eyebrow">Launch Team</span>
          <h1
            style={{
              fontSize: 'clamp(1.8rem, 4vw, 2.75rem)',
              fontWeight: 800,
              letterSpacing: '-0.02em',
              lineHeight: 1.15,
              color: 'var(--color-brand-text)',
              margin: '1rem 0 1.25rem',
            }}
          >
            Thank you for helping bring{' '}
            <em style={{ fontStyle: 'italic' }}>Built This Way</em> into the world.
          </h1>
          <p
            style={{
              fontSize: '1.0625rem',
              lineHeight: 1.8,
              color: 'var(--color-brand-text-muted)',
              maxWidth: '58ch',
              margin: '0 auto',
            }}
          >
            Everything the launch team receives lives on this page. Bookmark it — as more
            becomes available between now and publication on 22 October, it appears here.
          </p>
        </div>
      </section>

      <section
        style={{
          backgroundColor: 'var(--color-brand-off-white)',
          padding: 'clamp(2rem, 5vw, 3.5rem) 1.5rem clamp(3rem, 6vw, 4.5rem)',
        }}
      >
        <div style={{ maxWidth: '46rem', margin: '0 auto' }}>
          <p
            style={{
              fontSize: '0.875rem',
              color: 'var(--color-brand-text-light)',
              margin: '0 0 1.5rem',
            }}
          >
            {readyCount} of {materials.length} available now
          </p>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {materials.map((m) => (
              <div
                key={m.key}
                style={{
                  backgroundColor: '#ffffff',
                  border: '1px solid var(--color-brand-warm-gray)',
                  borderRadius: '0.75rem',
                  padding: '1.5rem',
                  boxShadow: 'var(--shadow-card)',
                  opacity: m.status === 'coming' ? 0.72 : 1,
                }}
              >
                <div
                  style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'baseline',
                    gap: '1rem',
                    flexWrap: 'wrap',
                    marginBottom: '0.5rem',
                  }}
                >
                  <h2
                    style={{
                      fontSize: '1.125rem',
                      fontWeight: 700,
                      color: 'var(--color-brand-text)',
                      margin: 0,
                      lineHeight: 1.3,
                    }}
                  >
                    {m.name}
                  </h2>
                  {m.status === 'coming' && (
                    <span
                      style={{
                        fontSize: '0.65rem',
                        fontWeight: 700,
                        letterSpacing: '0.08em',
                        textTransform: 'uppercase',
                        color: 'var(--color-brand-text-light)',
                        backgroundColor: 'var(--color-brand-off-white)',
                        border: '1px solid var(--color-brand-warm-gray)',
                        padding: '0.2rem 0.5rem',
                        borderRadius: '0.25rem',
                        whiteSpace: 'nowrap',
                      }}
                    >
                      {m.note ?? 'Coming soon'}
                    </span>
                  )}
                </div>

                <p
                  style={{
                    fontSize: '0.9375rem',
                    lineHeight: 1.7,
                    color: 'var(--color-brand-text-muted)',
                    margin: '0 0 1rem',
                  }}
                >
                  {m.description}
                </p>

                {m.status === 'link' && m.href && (
                  <a
                    href={m.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      border: '1.5px solid var(--color-brand-sienna)',
                      color: 'var(--color-brand-sienna)',
                      padding: '0.625rem 1.375rem',
                      borderRadius: '9999px',
                      fontWeight: 600,
                      fontSize: 'var(--text-small)',
                      textDecoration: 'none',
                    }}
                  >
                    Try the reflection tool →
                  </a>
                )}

                {m.status === 'ready' && (
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.625rem' }}>
                    {m.links.map((l) => (
                      <a
                        key={l.url}
                        href={l.url}
                        style={{
                          display: 'inline-flex',
                          alignItems: 'center',
                          backgroundColor: 'var(--color-brand-sienna)',
                          color: '#ffffff',
                          padding: '0.625rem 1.375rem',
                          borderRadius: '9999px',
                          fontWeight: 600,
                          fontSize: 'var(--text-small)',
                          textDecoration: 'none',
                        }}
                      >
                        Download {m.links.length > 1 ? l.filename : ''}
                      </a>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>

          <div
            style={{
              marginTop: '2.5rem',
              padding: '1.5rem',
              backgroundColor: '#ffffff',
              border: '1px solid var(--color-brand-warm-gray)',
              borderRadius: '0.75rem',
            }}
          >
            <h2
              style={{
                fontSize: '1rem',
                fontWeight: 700,
                margin: '0 0 0.75rem',
                color: 'var(--color-brand-text)',
              }}
            >
              What would help most
            </h2>
            <p
              style={{
                fontSize: '0.9375rem',
                lineHeight: 1.75,
                color: 'var(--color-brand-text-muted)',
                margin: '0 0 1rem',
              }}
            >
              Pre-order the book during launch week if you are able, leave an honest review
              once you have read it, and pass it to one person who may need the message. A
              sincere recommendation to the right person matters more than a large audience.
            </p>
            <Link
              href="/power-tools/book"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                border: '1.5px solid var(--color-brand-sienna)',
                color: 'var(--color-brand-sienna)',
                padding: '0.625rem 1.375rem',
                borderRadius: '9999px',
                fontWeight: 600,
                fontSize: 'var(--text-small)',
                textDecoration: 'none',
              }}
            >
              About the book
            </Link>
          </div>

          <p
            style={{
              marginTop: '2rem',
              fontSize: '0.875rem',
              color: 'var(--color-brand-text-light)',
              textAlign: 'center',
            }}
          >
            Something not working? Reply to any email from Mark and we will sort it out.
          </p>
        </div>
      </section>
    </main>
  );
}
