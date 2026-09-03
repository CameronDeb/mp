/**
 * Shared shell for the privacy policy and terms pages.
 *
 * These are plain coded routes rather than CMS pages on purpose. Every other
 * page pulls its blocks from Directus so Mark can edit it, but legal text is
 * the one thing on the site that should not be casually reworded, and it has to
 * stay reachable even if the CMS is unavailable — payment processors and email
 * providers check these URLs, and a 404 during a review is expensive.
 */
export default function LegalPage({
  title,
  updated,
  children,
}: {
  title: string;
  updated: string;
  children: React.ReactNode;
}) {
  return (
    <section
      className="section"
      style={{ backgroundColor: 'var(--color-brand-cream)', paddingTop: '9rem' }}
    >
      <div className="container">
        <div style={{ maxWidth: '68ch' }}>
          <div className="section-divider mb-4" />
          <span className="eyebrow">Legal</span>
          <h1 className="mt-4 mb-3" style={{ color: 'var(--color-brand-text)' }}>
            {title}
          </h1>
          <p
            style={{
              fontSize: 'var(--text-small)',
              color: 'var(--color-brand-text-muted)',
              marginBottom: '2.5rem',
            }}
          >
            Last updated {updated}
          </p>
          <div
            className="prose"
            style={{ color: 'var(--color-brand-text-muted)', lineHeight: 1.75 }}
          >
            {children}
          </div>
        </div>
      </div>
    </section>
  );
}
