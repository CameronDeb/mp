import type { HomepageCopy } from '@/lib/homepage';

/**
 * The reflection tool, sitting directly under the book launch section because
 * it is the book applied to one real moment. The tool is a separate app, so the
 * CTA is a plain <a> rather than next/link.
 */
export function WhyDidIReact({ copy }: { copy: HomepageCopy }) {
  const external = /^https?:\/\//.test(copy.reflection_cta_url);

  return (
    <section id="reflection-tool" style={{
      backgroundColor: 'var(--color-brand-off-white)',
      padding: '5rem 1.5rem',
    }}>
      <div style={{ maxWidth: '60rem', margin: '0 auto', textAlign: 'center' }}>

        <p style={{
          fontSize: '1rem',
          fontWeight: 500,
          letterSpacing: '0.06em',
          textTransform: 'uppercase',
          color: 'var(--color-brand-sienna)',
          marginBottom: '1rem',
        }}>
          {copy.reflection_eyebrow}
        </p>

        <h2 style={{
          fontSize: 'clamp(1.75rem, 3vw, 2.75rem)',
          fontWeight: 600,
          letterSpacing: '-0.02em',
          color: 'var(--color-brand-text)',
          marginBottom: '1.5rem',
          lineHeight: 1.1,
        }}>
          {copy.reflection_heading}
        </h2>

        <p
          style={{
            fontSize: '1.05rem',
            color: 'var(--color-brand-text-muted)',
            lineHeight: 1.75,
            maxWidth: '52ch',
            margin: '0 auto 1.25rem',
          }}
          dangerouslySetInnerHTML={{ __html: copy.reflection_body_1 }}
        />

        {/* Phones get Mark's shorter wording when it is filled in. */}
        <p className={copy.reflection_mobile_body ? 'desktop-only' : undefined} style={{
          fontSize: '1.05rem',
          color: 'var(--color-brand-text-muted)',
          lineHeight: 1.75,
          maxWidth: '52ch',
          margin: '0 auto 2.5rem',
        }}>
          {copy.reflection_body_2}
        </p>
        {copy.reflection_mobile_body && (
          <p className="mobile-only" style={{
            fontSize: '1.05rem',
            color: 'var(--color-brand-text-muted)',
            lineHeight: 1.75,
            maxWidth: '52ch',
            margin: '0 auto 2.5rem',
          }}>
            {copy.reflection_mobile_body}
          </p>
        )}

        <a
          href={copy.reflection_cta_url}
          {...(external ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '0.5rem',
            backgroundColor: 'var(--color-brand-sienna)',
            color: '#ffffff',
            padding: '0.875rem 2rem',
            borderRadius: '9999px',
            fontWeight: 600,
            fontSize: 'var(--text-small)',
            textDecoration: 'none',
          }}
        >
          {copy.reflection_cta_label} →
        </a>

      </div>
    </section>
  );
}
