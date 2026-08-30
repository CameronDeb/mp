'use client';

// V3 removed the duplicate footer signup form; the newsletter section on each
// page is now the only place that asks for an email.
import Link from 'next/link';
import { ExternalLink, PlayCircle, Camera, Mail } from 'lucide-react';

// ── Link data ────────────────────────────────────────────────────────────────
const columns = [
  // V3 gave the book its own column for the launch window.
  {
    heading: 'The Book',
    links: [
      { name: 'Built This Way',           href: '/power-tools/book'             },
      // Was pointing at the book page, so the one link in the footer actually
      // labelled "Launch Team" never reached the signup. Every Launch Team link
      // on the site now lands on /launch-team.
      { name: 'Launch Team',              href: '/launch-team#join'             },
      { name: 'Why Did I React That Way?', href: 'https://www.whydidireactthatway.com/?utm_source=drmarkpirtle&utm_medium=footer', external: true },
    ],
  },
  {
    heading: 'Forum Retreats',
    links: [
      { name: 'Forum Retreats',   href: '/forum-retreats' },
      { name: 'SAAQ for Leaders', href: '/consultation'   },
    ],
  },
  {
    heading: 'SAAQ Coaching',
    links: [
      { name: 'SAAQ Assessment',     href: '/consultation' },
      { name: 'Book a Consultation', href: '/contact'      },
    ],
  },
  {
    heading: 'Power Tools',
    links: [
      { name: 'All Power Tools',       href: '/power-tools'      },
      { name: 'Built This Way (Book)', href: '/power-tools/book' },
      { name: 'Documentary Film',      href: 'https://tubitv.com/movies/701292/is-your-story-making-you-sick', external: true },
    ],
  },
  {
    heading: 'About',
    links: [
      { name: "Mark's Story",    href: '/about#story'   },
      { name: 'The System',      href: '/about#system'  },
      { name: 'The Science',     href: '/about#science' },
      { name: 'Testimonials',    href: '/about#results' },
      { name: 'PBS Documentary', href: 'https://www.wholehearted.org/', external: true },
    ],
  },
  {
    heading: 'Legal',
    links: [
      { name: 'Privacy Policy',   href: '/privacy'    },
      { name: 'Terms of Service', href: '/terms'      },
      { name: 'Disclaimer',       href: '/disclaimer' },
      { name: 'Contact',          href: '/contact'    },
    ],
  },
];

const socials = [
  { label: 'LinkedIn',  href: 'https://linkedin.com',          icon: ExternalLink },
  { label: 'YouTube',   href: 'https://youtube.com',           icon: PlayCircle   },
  { label: 'Instagram', href: 'https://instagram.com',         icon: Camera       },
  { label: 'Email',     href: 'mailto:mark@drmarkpirtle.com',  icon: Mail         },
];

// ── Shared link style helper ─────────────────────────────────────────────────
const mutedLink: React.CSSProperties = {
  color: 'rgba(255,255,255,0.45)',
  fontSize: 'var(--text-small)',
  textDecoration: 'none',
  transition: 'color 0.15s',
};

// ── Footer ───────────────────────────────────────────────────────────────────
/** Brand copy, newsletter copy and blog categories all come from Directus. */
export function Footer({
  blogCategories = [],
  brandCopy,
  newsletterHeading,
}: {
  blogCategories?: string[];
  brandCopy: string;
  newsletterHeading: string;
  newsletterBody: string;
  newsletterButtonLabel: string;
  newsletterPrivacyLine: string;
}) {
  return (
    <footer style={{ backgroundColor: 'var(--color-brand-navy)', color: '#ffffff' }}>

      {/* ── Newsletter link ──
          V3 removed the second signup form. Every page already carries the
          full newsletter section, so the footer keeps a single quiet link to
          it rather than asking for the same email twice on one screen. */}
      <div style={{ borderBottom: '1px solid rgba(255,255,255,0.07)' }}>
        <div className="container" style={{ paddingTop: '2.5rem', paddingBottom: '2.5rem' }}>
          <div style={{ textAlign: 'center' }}>
            <Link href="/#newsletter" style={{
              color: '#ffffff',
              fontSize: 'var(--text-small)',
              fontWeight: 600,
              textDecoration: 'none',
              letterSpacing: '0.02em',
            }}>
              {newsletterHeading} →
            </Link>
          </div>
        </div>
      </div>

      {/* ── Main grid — brand + 6 link columns ── */}
      <div className="container" style={{ paddingTop: '4rem', paddingBottom: '4rem', borderBottom: '1px solid rgba(255,255,255,0.07)' }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(min(100%, 11rem), 1fr))', gap: '2.5rem' }}>

          {/* Brand — spans 2 cols on wide screens */}
          <div style={{ gridColumn: 'span 2' }}>
            <div style={{ fontFamily: 'var(--font-sans)', fontSize: '1.1rem', fontWeight: 800, color: '#ffffff', letterSpacing: '-0.02em', marginBottom: '0.375rem' }}>
              Dr. Mark Pirtle
            </div>
            <div style={{ fontSize: 'var(--text-xs)', fontWeight: 600, letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--color-brand-sienna-light)', marginBottom: '1rem' }}>
              SkillfullyAware®
            </div>
            <p style={{ color: 'rgba(255,255,255,0.45)', fontSize: 'var(--text-small)', lineHeight: 1.75, maxWidth: '26ch', marginBottom: '1.5rem' }}>
              {brandCopy}
            </p>
            <div style={{ display: 'flex', gap: '0.625rem', flexWrap: 'wrap' }}>
              {socials.map(s => (
                <a key={s.label} href={s.href} target="_blank" rel="noopener noreferrer" aria-label={s.label}
                  style={{ width: '2.1rem', height: '2.1rem', borderRadius: '9999px', backgroundColor: 'rgba(255,255,255,0.07)', border: '1px solid rgba(255,255,255,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'rgba(255,255,255,0.6)', transition: 'background-color 0.2s, color 0.2s', textDecoration: 'none' }}
                  onMouseEnter={e => { (e.currentTarget as HTMLAnchorElement).style.backgroundColor = 'var(--color-brand-sienna)'; (e.currentTarget as HTMLAnchorElement).style.color = '#fff'; }}
                  onMouseLeave={e => { (e.currentTarget as HTMLAnchorElement).style.backgroundColor = 'rgba(255,255,255,0.07)'; (e.currentTarget as HTMLAnchorElement).style.color = 'rgba(255,255,255,0.6)'; }}
                >
                  <s.icon className="w-3.5 h-3.5" />
                </a>
              ))}
            </div>
          </div>

          {/* 6 link columns */}
          {columns.map(col => (
            <div key={col.heading}>
              <h4 style={{ fontWeight: 700, fontSize: 'var(--text-small)', color: '#ffffff', marginBottom: '1rem', letterSpacing: '0.01em' }}>
                {col.heading}
              </h4>
              <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '0.625rem' }}>
                {col.links.map(l => (
                  <li key={l.name}>
                    <Link
                      href={l.href}
                      target={'external' in l && l.external ? '_blank' : undefined}
                      rel={'external' in l && l.external ? 'noopener noreferrer' : undefined}
                      style={mutedLink}
                      onMouseEnter={e => (e.currentTarget.style.color = '#ffffff')}
                      onMouseLeave={e => (e.currentTarget.style.color = 'rgba(255,255,255,0.45)')}
                    >
                      {l.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>

      {/* ── Blog categories band (CNN-style) ── */}
      <div style={{ borderBottom: '1px solid rgba(255,255,255,0.07)' }}>
        <div className="container" style={{ paddingTop: '1.75rem', paddingBottom: '1.75rem' }}>
          <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'baseline', gap: '0.25rem 0' }}>
            {/* Section label */}
            <span style={{ fontSize: 'var(--text-xs)', fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', color: '#ffffff', marginRight: '1.25rem', whiteSpace: 'nowrap' }}>
              Blog
            </span>
            {/* All Articles */}
            <Link
              href="/blog"
              style={mutedLink}
              onMouseEnter={e => (e.currentTarget.style.color = '#ffffff')}
              onMouseLeave={e => (e.currentTarget.style.color = 'rgba(255,255,255,0.45)')}
            >
              All Articles
            </Link>
            {/* Divider + each category */}
            {blogCategories.map(cat => (
              <span key={cat} style={{ display: 'inline-flex', alignItems: 'center' }}>
                <span style={{ color: 'rgba(255,255,255,0.15)', margin: '0 0.625rem', fontSize: '0.6rem' }}>●</span>
                <Link
                  href={`/blog?category=${encodeURIComponent(cat)}`}
                  style={mutedLink}
                  onMouseEnter={e => (e.currentTarget.style.color = '#ffffff')}
                  onMouseLeave={e => (e.currentTarget.style.color = 'rgba(255,255,255,0.45)')}
                >
                  {cat}
                </Link>
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* ── Bottom bar (unchanged) ── */}
      <div className="container" style={{ paddingTop: '1.5rem', paddingBottom: '1.5rem', display: 'flex', flexWrap: 'wrap' as const, justifyContent: 'space-between', alignItems: 'center', gap: '0.5rem' }}>
        <p style={{ color: 'rgba(255,255,255,0.3)', fontSize: 'var(--text-xs)' }}>
          © {new Date().getFullYear()} Dr. Mark Pirtle. All rights reserved.
        </p>
        <p style={{ color: 'rgba(255,255,255,0.3)', fontSize: 'var(--text-xs)' }}>
          SkillfullyAware® is a registered trademark.
        </p>
      </div>
    </footer>
  );
}