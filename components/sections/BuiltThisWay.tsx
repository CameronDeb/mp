import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import type { HomepageCopy } from '@/lib/homepage';

export function BuiltThisWay({ copy }: { copy: HomepageCopy }) {
  return (
    <section style={{
      backgroundColor: '#ffffff',
      padding: '5rem 0',
    }}>
      <div className="container" style={{
        display: 'grid',
        gridTemplateColumns: '1fr 1fr',
        gap: '4rem',
        alignItems: 'center',
      }}>

        {/* Book cover placeholder */}
        <div style={{
          aspectRatio: '3/4',
          backgroundColor: 'var(--color-brand-sienna)',
          borderRadius: '1rem',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          maxWidth: '320px',
        }}>
          <div style={{ textAlign: 'center', padding: '2rem' }}>
            <p style={{
              fontSize: 'var(--text-xs)',
              fontWeight: 700,
              letterSpacing: '0.1em',
              textTransform: 'uppercase',
              color: 'rgba(255,255,255,0.6)',
              marginBottom: '1rem',
            }}>
              Book Cover
            </p>
            <p style={{
              fontSize: '1.25rem',
              fontWeight: 600,
              color: '#ffffff',
              lineHeight: 1.3,
            }}>
              Built This Way
            </p>
          </div>
        </div>

        {/* Content */}
        <div>
          <p style={{
            fontSize: '1rem',
            fontWeight: 500,
            letterSpacing: '0.06em',
            textTransform: 'uppercase',
            color: 'var(--color-brand-sienna-light)',
            marginBottom: '1rem',
          }}>
            {copy.book_eyebrow}
          </p>

          <h2 style={{
            fontSize: 'clamp(1.5rem, 3vw, 2.25rem)',
            fontWeight: 600,
            letterSpacing: '-0.02em',
            color: 'var(--color-brand-text)',
            marginBottom: '1.5rem',
            lineHeight: 1.15,
          }}>
            {copy.book_heading}
          </h2>

          <p style={{
            fontSize: '1.05rem',
            color: 'var(--color-brand-text-muted)',
            lineHeight: 1.75,
            marginBottom: '1.25rem',
          }}>
            {copy.book_body_1}
          </p>

          <p
            style={{
              fontSize: '1.05rem',
              color: 'var(--color-brand-text-muted)',
              lineHeight: 1.75,
              marginBottom: '1.25rem',
            }}
            dangerouslySetInnerHTML={{ __html: copy.book_body_2 }}
          />

          <p
            style={{
              fontSize: '1.05rem',
              color: 'var(--color-brand-text-muted)',
              lineHeight: 1.75,
              marginBottom: '2rem',
            }}
            dangerouslySetInnerHTML={{ __html: copy.book_body_3 }}
          />

          {/* Two CTAs of equal weight — preorder and launch team — then a quiet
              third link for people who want to read about the book first. */}
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '1rem', alignItems: 'center' }}>
            <Link href={copy.book_cta_primary_url} style={{
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
            }}>
              {copy.book_cta_primary_label} <ArrowRight className="w-4 h-4" />
            </Link>

            <Link href={copy.book_cta_secondary_url} style={{
              display: 'inline-flex',
              alignItems: 'center',
              border: '1.5px solid var(--color-brand-sienna)',
              color: 'var(--color-brand-sienna)',
              padding: '0.875rem 2rem',
              borderRadius: '9999px',
              fontWeight: 600,
              fontSize: 'var(--text-small)',
              textDecoration: 'none',
            }}>
              {copy.book_cta_secondary_label}
            </Link>
          </div>

          {copy.book_link_label && (
            <Link href={copy.book_link_url} style={{
              display: 'inline-flex',
              alignItems: 'center',
              marginTop: '1.5rem',
              fontSize: 'var(--text-small)',
              fontWeight: 600,
              color: 'var(--color-brand-text-muted)',
              textDecoration: 'none',
            }}>
              {copy.book_link_label}
            </Link>
          )}
        </div>

      </div>
    </section>
  );
}