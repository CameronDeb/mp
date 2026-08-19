import Link from 'next/link';
import { ForumRetreatInquiryForm } from './ForumRetreatInquiryForm';

// The `#inquiry` landing section. Rendered two ways:
//  - after the CMS blocks on /forum-retreats, where the final blocks_cta already
//    carries the pitch, so this only needs the short "tell us about your group" framing
//  - inside the hard-coded ForumRetreatsContent fallback, which passes its own heading
//    and intro because there is no CTA block above it

export function ForumRetreatInquirySection({
  heading = 'Tell us about your group',
  intro = 'A few details are enough to begin. No commitment — this just gives Mark the context to shape the right conversation.',
  anchorId = 'inquiry-form',
}: {
  heading?: string;
  intro?: string;
  /** The CMS page's final CTA block already owns `#inquiry`, so the default avoids a
   *  duplicate DOM id. The hard-coded fallback has no such block and passes `inquiry`. */
  anchorId?: string;
}) {
  return (
    <section
      id={anchorId}
      style={{
        background: 'linear-gradient(135deg, var(--color-brand-sienna-dark) 0%, var(--color-brand-sienna) 100%)',
        padding: '6rem 1.5rem',
      }}
    >
      <div className="container" style={{ textAlign: 'center', maxWidth: 780 }}>
        <h2 style={{ color: '#ffffff', marginBottom: '1.25rem' }}>{heading}</h2>
        <p style={{
          color: 'rgba(255,255,255,0.82)',
          fontSize: 'var(--text-lead)',
          lineHeight: 1.75,
          marginBottom: '2.5rem',
        }}>
          {intro}
        </p>

        <ForumRetreatInquiryForm />

        <p style={{ marginTop: '1.75rem', marginBottom: 0 }}>
          <Link href="/contact?type=call" style={{
            display: 'inline-flex', alignItems: 'center', gap: '0.375rem',
            color: 'rgba(255,255,255,0.75)', fontSize: 'var(--text-small)', fontWeight: 600,
            textDecoration: 'underline', textUnderlineOffset: 4,
          }}>
            Or book a 30-minute call instead →
          </Link>
        </p>
      </div>
    </section>
  );
}
