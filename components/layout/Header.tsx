'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Menu, X, Search } from 'lucide-react';

/** Blog categories, curated in Directus and resolved by the server layout. */
export type HeaderCategory = { name: string; description: string };

function buildNavigation(blogCategories: HeaderCategory[]) {
  return [
    {
      name: 'About',
      href: '/about',
      dropdown: [
        { name: 'The Story',   href: '/about#story',   description: "Mark's journey and mission" },
        { name: 'The System',  href: '/about#system',  description: 'SkillfullyAware® methodology' },
        { name: 'The Science', href: '/about#science', description: 'Neuroscience behind the work' },
      ],
    },
    // V3 promoted the book into the main nav for the launch window.
    { name: 'Book',           href: '/power-tools/book' },
    { name: 'Forum Retreats', href: '/forum-retreats'   },
    { name: 'SAAQ Coaching',  href: '/consultation'     },
    {
      name: 'Power Tools',
      href: '/power-tools',
      dropdown: [
        { name: 'All Power Tools',    href: '/power-tools',                      description: 'Classes, workbooks, meditations' },
        { name: 'Online Classes',     href: '/power-tools#online-classes',       description: 'Live cohort classes' },
        { name: 'Workbooks',          href: '/power-tools#workbooks',            description: 'Work through it on the page' },
        { name: 'Meditation Programs', href: '/power-tools#meditation-programs', description: 'Guided practice, at your own pace' },
        { name: 'Built This Way',     href: '/power-tools/book',                 description: 'The book' },
      ],
    },
    {
      name: 'Blog',
      href: '/blog',
      dropdown: [
        { name: 'All Essays', href: '/blog', description: 'Patterns, practice, leadership, and growth' },
        ...blogCategories.map(({ name, description }) => ({
          name,
          href: `/blog?category=${encodeURIComponent(name)}`,
          description,
        })),
      ],
    },
  ];
}

export function Header({
  logo = '/logos/logo-2026.png',
  categories = [],
  ctaLabel = 'Preorder the Book',
  ctaUrl = '/power-tools/book',
}: {
  logo?: string;
  categories?: HeaderCategory[];
  /** Launch CTA, from site_settings so it can become "Get the Book" on 22 Oct. */
  ctaLabel?: string;
  ctaUrl?: string;
}) {
  const navigation = buildNavigation(categories);
  const [pastHero, setPastHero]         = useState(false);
  const [mobileOpen, setMobileOpen]     = useState(false);
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);
  const [searchOpen, setSearchOpen]     = useState(false);

  useEffect(() => {
    const sentinel = document.getElementById('hero-sentinel');
    if (!sentinel) {
      const onScroll = () => setPastHero(window.scrollY > window.innerHeight - 100);
      window.addEventListener('scroll', onScroll, { passive: true });
      return () => window.removeEventListener('scroll', onScroll);
    }
    const obs = new IntersectionObserver(
      ([e]) => setPastHero(!e.isIntersecting),
      { threshold: 0, rootMargin: '-100px 0px 0px 0px' }
    );
    obs.observe(sentinel);
    return () => obs.disconnect();
  }, []);

  // Header is light on every page now that the heroes are cream rather than navy/black.
  // `pastHero` no longer flips the colour scheme — it only adds the scrolled border.
  const linkColor = 'rgba(0,0,0,0.72)';
  const linkHover = '#000000';

  return (
    <>
      <header style={{
        position: 'fixed', top: 0, left: 0, right: 0, zIndex: 50,
        height: '6.25rem',
        backgroundColor: '#ffffff',
        borderBottom: pastHero ? '1px solid rgba(0,0,0,0.07)' : 'none',
        transition: 'background-color 0.35s ease',
      }}>
        <div style={{
          margin: '0 auto',
          padding: '0 clamp(1.5rem, 7.5vw, 6.75rem)',
          height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        }}>

          {/* Logo — natural colour; header is light on every page */}
          <Link href="/" style={{ display: 'flex', alignItems: 'center', textDecoration: 'none', flexShrink: 0, height: '100%' }}>
            <Image
              src={logo}
              alt="Dr. Mark Pirtle"
              width={325}
              height={66}
              priority
              style={{
                height: '2.25rem',
                width: 'auto',
                filter: 'none',
                transition: 'filter 0.35s ease',
                objectFit: 'contain',
              }}
            />
          </Link>

          {/* Desktop nav */}
          <nav className="hidden lg:flex items-center" style={{ gap: '2rem' }}>
            {navigation.map(item => (
              <div
                key={item.name}
                style={{ position: 'relative' }}
                onMouseEnter={() => setOpenDropdown(item.name)}
                onMouseLeave={() => setOpenDropdown(null)}
              >
                {/* Every top-level label is a real link; the dropdown is hover-only. */}
                <Link href={item.href} style={{
                  padding: '0.25rem 0', textDecoration: 'none',
                  color: linkColor, fontSize: 'var(--text-small)', fontWeight: 600,
                  fontFamily: 'var(--font-sans)', letterSpacing: '0.05em',
                  transition: 'color 0.15s',
                }}
                  onMouseEnter={e => (e.currentTarget.style.color = linkHover)}
                  onMouseLeave={e => (e.currentTarget.style.color = linkColor)}
                >
                  {item.name}
                </Link>

                {/* Dropdown panel */}
                {item.dropdown && openDropdown === item.name && (
                  <div style={{
                    position: 'absolute', top: '100%',
                    left: '50%', transform: 'translateX(-50%)',
                    paddingTop: '0.75rem',
                    zIndex: 60, minWidth: '16rem',
                  }}>
                    <div style={{
                      backgroundColor: '#ffffff',
                      border: '1px solid rgba(0,0,0,0.07)', borderRadius: '0.875rem',
                      overflow: 'hidden', boxShadow: '0 16px 48px rgba(0,0,0,0.12)',
                    }}>
                      {item.dropdown.map((d, i) => (
                        <Link key={d.name} href={d.href} style={{
                          display: 'block', padding: '0.8rem 1.25rem', textDecoration: 'none',
                          borderTop: i > 0 ? '1px solid rgba(0,0,0,0.05)' : 'none',
                          transition: 'background 0.15s',
                        }}
                          onMouseEnter={e => (e.currentTarget.style.backgroundColor = '#f9f7f4')}
                          onMouseLeave={e => (e.currentTarget.style.backgroundColor = 'transparent')}
                        >
                          <div style={{ color: '#000', fontWeight: 600, fontSize: 'var(--text-small)' }}>{d.name}</div>
                          <div style={{ color: 'var(--color-brand-text-muted)', fontSize: 'var(--text-xs)', marginTop: '0.1rem' }}>{d.description}</div>
                        </Link>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            ))}
          </nav>

          {/* Right: Search + Start Here */}
          <div className="hidden lg:flex items-center" style={{ gap: '1.25rem' }}>
            <button onClick={() => setSearchOpen(o => !o)} aria-label="Search"
              style={{ background: 'none', border: 'none', cursor: 'pointer', padding: '0.4rem', color: linkColor, transition: 'color 0.15s' }}
              onMouseEnter={e => (e.currentTarget.style.color = linkHover)}
              onMouseLeave={e => (e.currentTarget.style.color = linkColor)}
            >
              <Search className="w-5 h-5" />
            </button>

            <Link href={ctaUrl} style={{
              border: '1.5px solid #c34d27',
              backgroundColor: 'transparent',
              color: '#c34d27',
              padding: '0.6875rem 1.625rem',
              borderRadius: '9999px',
              fontWeight: 600,
              fontSize: 'var(--text-small)',
              letterSpacing: '0.03em',
              textDecoration: 'none',
              transition: 'color 0.3s, background-color 0.3s',
              whiteSpace: 'nowrap',
            }}
              onMouseEnter={e => { e.currentTarget.style.backgroundColor = '#c34d27'; e.currentTarget.style.color = '#ffffff'; }}
              onMouseLeave={e => { e.currentTarget.style.backgroundColor = 'transparent'; e.currentTarget.style.color = '#c34d27'; }}
            >
              {ctaLabel}
            </Link>
          </div>

          {/* Mobile burger */}
          <button onClick={() => setMobileOpen(o => !o)} className="lg:hidden"
            style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#000', padding: '0.5rem', transition: 'color 0.3s' }}>
            {mobileOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

        {/* Search bar */}
        {searchOpen && (
          <div style={{ backgroundColor: '#ffffff', borderTop: '1px solid rgba(0,0,0,0.07)', padding: '0.875rem 2rem' }}>
            <div style={{ maxWidth: '96rem', margin: '0 auto' }}>
              <input autoFocus type="search" placeholder="Search articles, tools, retreats..."
                className="form-input" style={{ maxWidth: '32rem' }}
                onKeyDown={e => e.key === 'Escape' && setSearchOpen(false)} />
            </div>
          </div>
        )}
      </header>

      {/* Mobile menu */}
      {mobileOpen && (
        <div style={{ position: 'fixed', inset: 0, zIndex: 40 }} className="lg:hidden">
          <div style={{ position: 'fixed', inset: 0, backgroundColor: 'rgba(0,0,0,0.4)' }} onClick={() => setMobileOpen(false)} />
          <div style={{
            position: 'fixed', top: '6.25rem', left: 0, right: 0, bottom: 0,
            backgroundColor: '#ffffff', overflowY: 'auto', borderTop: '1px solid rgba(0,0,0,0.07)',
          }}>
            <nav style={{ padding: '1rem 1.25rem', display: 'flex', flexDirection: 'column', gap: '0.125rem' }}>
              {navigation.map(item => (
                <div key={item.name}>
                  {!item.dropdown ? (
                    <Link href={item.href} onClick={() => setMobileOpen(false)}
                      style={{ display: 'block', padding: '0.75rem', borderRadius: '0.5rem', textDecoration: 'none', fontWeight: 600, fontSize: 'var(--text-small)', color: '#000', transition: 'background 0.15s' }}
                      onMouseEnter={e => (e.currentTarget.style.backgroundColor = '#f9f7f4')}
                      onMouseLeave={e => (e.currentTarget.style.backgroundColor = 'transparent')}
                    >
                      {item.name}
                    </Link>
                  ) : (
                    <>
                      {/* The section label is itself a link to the section's page. */}
                      <Link href={item.href} onClick={() => setMobileOpen(false)}
                        style={{ display: 'block', color: 'var(--color-brand-text-light)', fontSize: 'var(--text-xs)', fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', padding: '1rem 0.75rem 0.4rem', textDecoration: 'none' }}
                      >
                        {item.name}
                      </Link>
                      {item.dropdown.map(d => (
                        <Link key={d.name} href={d.href} onClick={() => setMobileOpen(false)}
                          style={{ display: 'block', padding: '0.65rem 0.75rem', borderRadius: '0.5rem', textDecoration: 'none', transition: 'background 0.15s' }}
                          onMouseEnter={e => (e.currentTarget.style.backgroundColor = '#f9f7f4')}
                          onMouseLeave={e => (e.currentTarget.style.backgroundColor = 'transparent')}
                        >
                          <div style={{ color: '#000', fontWeight: 600, fontSize: 'var(--text-small)' }}>{d.name}</div>
                          <div style={{ color: 'var(--color-brand-text-muted)', fontSize: 'var(--text-xs)', marginTop: '0.1rem' }}>{d.description}</div>
                        </Link>
                      ))}
                    </>
                  )}
                </div>
              ))}
              <div style={{ paddingTop: '1.25rem', display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                <Link href={ctaUrl} onClick={() => setMobileOpen(false)}
                  style={{ display: 'block', textAlign: 'center', border: '1.5px solid #c34d27', color: '#c34d27', backgroundColor: 'transparent', padding: '0.875rem', borderRadius: '9999px', fontWeight: 600, fontSize: 'var(--text-small)', textDecoration: 'none' }}>
                  {ctaLabel}
                </Link>
              </div>
            </nav>
          </div>
        </div>
      )}
    </>
  );
}
