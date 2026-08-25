import Link from 'next/link';
import Image from 'next/image';
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

        {/* Book cover. Centred within its grid column so it sits under the
            heading rather than hard against the left gutter. */}
        <div style={{ display: 'flex', justifyContent: 'center' }}>
          <Image
            src="/images/book-cover.webp"
            alt="Built This Way: Why Painful Patterns Repeat and How to Change Them, by Dr. Mark Pirtle"
            width={640}
            height={986}
            sizes="(max-width: 1024px) 60vw, 320px"
            style={{
              width: '100%',
              maxWidth: '320px',
              height: 'auto',
              borderRadius: '0.5rem',
              boxShadow: 'var(--shadow-premium)',
            }}
          />
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