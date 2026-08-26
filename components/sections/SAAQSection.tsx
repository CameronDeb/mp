import Link from 'next/link';
import type { HomepageCopy } from '@/lib/homepage';

export function SAAQSection({ copy }: { copy: HomepageCopy }) {
  return (
    <section style={{
      backgroundColor: 'var(--color-brand-cream)',
      padding: '5rem 0',
    }}>
      {/* .split-2 stacks below 900px — see globals.css */}
      <div className="container split-2">

        <div>
          <p style={{
            fontSize: '1rem',
            fontWeight: 500,
            letterSpacing: '0.06em',
            textTransform: 'uppercase',
            color: 'var(--color-brand-sienna)',
            marginBottom: '1rem',
          }}>
            {copy.saaq_eyebrow}
          </p>

          <h2 style={{
            fontSize: 'clamp(1.75rem, 3vw, 2.75rem)',
            fontWeight: 600,
            letterSpacing: '-0.02em',
            color: 'var(--color-brand-text)',
            marginBottom: '1.5rem',
            lineHeight: 1.1,
          }}>
            {copy.saaq_heading}
          </h2>

          <p style={{
            fontSize: '1.05rem',
            color: 'var(--color-brand-text-muted)',
            lineHeight: 1.75,
            marginBottom: '1.25rem',
          }}>
            {copy.saaq_body_1}
          </p>

          <p style={{
            fontSize: '1.05rem',
            color: 'var(--color-brand-text-muted)',
            lineHeight: 1.75,
            marginBottom: '1.25rem',
          }}>
            <span dangerouslySetInnerHTML={{ __html: copy.saaq_body_2 }} />
          </p>

          <p style={{
            fontSize: '1.05rem',
            color: 'var(--color-brand-text-muted)',
            lineHeight: 1.75,
            marginBottom: '2rem',
          }}>
            {copy.saaq_body_3}
          </p>

          <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap', alignItems: 'center' }}>
            <Link href={copy.saaq_cta_url} style={{
              display: 'inline-flex',
              alignItems: 'center',
              backgroundColor: 'var(--color-brand-sienna)',
              color: '#ffffff',
              padding: '0.875rem 2rem',
              borderRadius: '9999px',
              fontWeight: 600,
              fontSize: 'var(--text-small)',
              textDecoration: 'none',
            }}>
              {copy.saaq_cta_label} →
            </Link>

            {copy.saaq_cta_secondary_label && copy.saaq_cta_secondary_url && (
              <a
                href={copy.saaq_cta_secondary_url}
                target={copy.saaq_cta_secondary_url.startsWith('http') ? '_blank' : undefined}
                rel={copy.saaq_cta_secondary_url.startsWith('http') ? 'noopener noreferrer' : undefined}
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  fontSize: 'var(--text-small)',
                  fontWeight: 600,
                  color: 'var(--color-brand-text-muted)',
                  textDecoration: 'none',
                  padding: '0.875rem 0',
                }}
              >
                {copy.saaq_cta_secondary_label} →
              </a>
            )}
          </div>
        </div>

        {/* Visual block */}
        <div style={{
          backgroundColor: '#ffffff',
          border: '1px solid var(--color-brand-border)',
          borderRadius: '0.625rem',
          padding: '2.5rem',
        }}>
          {[
            { label: 'How I lead under pressure', value: 85 },
            { label: 'How I relate to others', value: 72 },
            { label: 'How I make decisions', value: 90 },
            { label: 'How I handle stress', value: 61 },
            { label: 'How I protect myself', value: 78 },
          ].map((item) => (
            <div key={item.label} style={{ marginBottom: '1.25rem' }}>
              <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                marginBottom: '0.4rem',
              }}>
                <span style={{ fontSize: 'var(--text-small)', fontWeight: 600, color: 'var(--color-brand-text)' }}>
                  {item.label}
                </span>
              </div>
              <div style={{
                height: '6px',
                backgroundColor: 'var(--color-brand-warm-gray)',
                borderRadius: '9999px',
                overflow: 'hidden',
              }}>
                <div style={{
                  height: '100%',
                  width: `${item.value}%`,
                  backgroundColor: 'var(--color-brand-sienna)',
                  borderRadius: '9999px',
                }} />
              </div>
            </div>
          ))}
          <p style={{
            fontSize: 'var(--text-xs)',
            color: 'var(--color-brand-text-light)',
            marginTop: '1.5rem',
            fontStyle: 'italic',
          }}>
            Sample SAAQ developmental reflection
          </p>
        </div>

      </div>
    </section>
  );
}