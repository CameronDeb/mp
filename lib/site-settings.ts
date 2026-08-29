// lib/site-settings.ts
// Global site media, managed in the Directus `site_settings` singleton.
//
// Every value falls back to the bundled file in /public, so the logo and hero
// never disappear if Directus is unreachable. Directus is the source of truth.

const DIRECTUS_URL = process.env.NEXT_PUBLIC_DIRECTUS_URL;
const DIRECTUS_TOKEN = process.env.DIRECTUS_STATIC_TOKEN;

export type SiteMedia = {
  logo: string;
  logoMark: string;
  heroImage: string;
  aboutPortrait: string;
};

/** Copy that repeats across pages — footer brand line and every newsletter band. */
export type SiteCopy = {
  footerBrandCopy: string;
  newsletterHeading: string;
  newsletterBody: string;
  newsletterButtonLabel: string;
  newsletterPrivacyLine: string;
  /**
   * The header's top-right button. V3 made this the launch CTA, and it changes
   * to "Get the Book" after 22 Oct — so it lives here rather than in code, and
   * Mark can switch it himself on the day without a deploy.
   */
  navCtaLabel: string;
  navCtaUrl: string;
};

/** Bundled originals — also the fallback when Directus can't be reached. */
const LOCAL_FALLBACK: SiteMedia = {
  logo: '/logos/logo-2026.png',
  logoMark: '/logos/logo.webp',
  heroImage: '/images/mark-hero-v3.webp',
  aboutPortrait: '/images/mark-hero-v3.webp',
};

/** Signed-off copy from the V2 page docs — the fallback for the same reason. */
export const COPY_FALLBACK: SiteCopy = {
  footerBrandCopy:
    'SkillfullyAware® helps people understand painful patterns, work with them in real life, and become wiser, healthier, and more effective in how they live, relate, and lead.',
  newsletterHeading: 'Get the Breaking Bad (habits) Newsletter',
  newsletterBody:
    'Practical reflections on painful patterns, habit change, leadership, and becoming more SkillfullyAware in daily life.',
  newsletterButtonLabel: 'Subscribe',
  newsletterPrivacyLine: 'No spam. Unsubscribe anytime.',
  navCtaLabel: 'Preorder the Book',
  // Mark, Aug 2026: point this at the shop, "where customers can pre-order",
  // rather than at the book's own landing page.
  navCtaUrl: '/power-tools',
};

type SettingsRow = {
  logo: string | null;
  logo_mark: string | null;
  hero_image: string | null;
  about_portrait: string | null;
  footer_brand_copy: string | null;
  newsletter_heading: string | null;
  newsletter_body: string | null;
  newsletter_button_label: string | null;
  newsletter_privacy_line: string | null;
  nav_cta_label: string | null;
  nav_cta_url: string | null;
  book_preorder_url: string | null;
  show_ecosystem_section: boolean | null;
  show_saaq_section: boolean | null;
  show_testimonials_section: boolean | null;
  show_blog_section: boolean | null;
  show_about_section: boolean | null;
  show_powertools_section: boolean | null;
};

/**
 * The book's call to action, derived from one field Mark controls.
 *
 * While `book_preorder_url` is empty there is nowhere to preorder, so every
 * button says "Get Book Updates" and goes to the launch team signup. The moment
 * he pastes the publisher's link in, all of them become real preorder buttons.
 * One field, no deploy, and the site can never promise a preorder that does not
 * exist — which is exactly the loop he found.
 */
export type BookCta = { label: string; url: string; isPreorder: boolean };

/** Which homepage sections are switched on. */
export type SectionToggles = {
  ecosystem: boolean;
  saaq: boolean;
  testimonials: boolean;
  blog: boolean;
  about: boolean;
  powertools: boolean;
};

const SECTION_FALLBACK: SectionToggles = {
  // Mark asked for both of these off: they repeat choices the page already
  // offers. Off by default so a Directus outage does not bring them back.
  ecosystem: false,
  saaq: false,
  testimonials: true,
  blog: true,
  about: true,
  powertools: true,
};

/** Directus can return booleans as 0/1 depending on the column type. */
function bool(value: boolean | number | null | undefined, fallback: boolean): boolean {
  if (value === null || value === undefined) return fallback;
  return Boolean(value);
}

function assetUrl(fileId: string | null, fallback: string): string {
  return fileId ? `${DIRECTUS_URL}/assets/${fileId}` : fallback;
}

function text(value: string | null | undefined, fallback: string): string {
  return value && value.trim() ? value : fallback;
}

const FIELDS =
  'logo,logo_mark,hero_image,about_portrait,footer_brand_copy,' +
  'newsletter_heading,newsletter_body,newsletter_button_label,newsletter_privacy_line,' +
  'nav_cta_label,nav_cta_url,book_preorder_url,' +
  'show_ecosystem_section,show_saaq_section,show_testimonials_section,' +
  'show_blog_section,show_about_section,show_powertools_section';

async function fetchSettings(): Promise<SettingsRow | null> {
  if (!DIRECTUS_URL) return null;
  try {
    const res = await fetch(`${DIRECTUS_URL}/items/site_settings?fields=${FIELDS}`, {
      headers: DIRECTUS_TOKEN ? { Authorization: `Bearer ${DIRECTUS_TOKEN}` } : {},
      next: { tags: ['site-settings'] },
    });
    if (!res.ok) throw new Error(`Directus responded ${res.status}`);
    const row: SettingsRow | undefined = (await res.json())?.data;
    if (!row) throw new Error('site_settings singleton is empty');
    return row;
  } catch (err) {
    console.error('[site-settings] Directus fetch failed, using bundled defaults:', err);
    return null;
  }
}

export async function getSiteMedia(): Promise<SiteMedia> {
  const row = await fetchSettings();
  if (!row) return LOCAL_FALLBACK;

  return {
    logo:          assetUrl(row.logo,           LOCAL_FALLBACK.logo),
    logoMark:      assetUrl(row.logo_mark,      LOCAL_FALLBACK.logoMark),
    heroImage:     assetUrl(row.hero_image,     LOCAL_FALLBACK.heroImage),
    aboutPortrait: assetUrl(row.about_portrait, LOCAL_FALLBACK.aboutPortrait),
  };
}

export async function getSiteCopy(): Promise<SiteCopy> {
  const row = await fetchSettings();
  if (!row) return COPY_FALLBACK;

  return {
    footerBrandCopy:       text(row.footer_brand_copy,       COPY_FALLBACK.footerBrandCopy),
    newsletterHeading:     text(row.newsletter_heading,      COPY_FALLBACK.newsletterHeading),
    newsletterBody:        text(row.newsletter_body,         COPY_FALLBACK.newsletterBody),
    newsletterButtonLabel: text(row.newsletter_button_label, COPY_FALLBACK.newsletterButtonLabel),
    newsletterPrivacyLine: text(row.newsletter_privacy_line, COPY_FALLBACK.newsletterPrivacyLine),
    navCtaLabel:           text(row.nav_cta_label,           COPY_FALLBACK.navCtaLabel),
    navCtaUrl:             text(row.nav_cta_url,             COPY_FALLBACK.navCtaUrl),
  };
}

export async function getBookCta(): Promise<BookCta> {
  const row = await fetchSettings();
  const url = row?.book_preorder_url?.trim();

  if (url) {
    return { label: 'Preorder the Book', url, isPreorder: true };
  }
  // No preorder link yet, so do not claim there is one.
  return { label: 'Get Book Updates', url: '/launch-team', isPreorder: false };
}

export async function getSectionToggles(): Promise<SectionToggles> {
  const row = await fetchSettings();
  if (!row) return SECTION_FALLBACK;

  return {
    ecosystem:    bool(row.show_ecosystem_section,    SECTION_FALLBACK.ecosystem),
    saaq:         bool(row.show_saaq_section,         SECTION_FALLBACK.saaq),
    testimonials: bool(row.show_testimonials_section, SECTION_FALLBACK.testimonials),
    blog:         bool(row.show_blog_section,         SECTION_FALLBACK.blog),
    about:        bool(row.show_about_section,        SECTION_FALLBACK.about),
    powertools:   bool(row.show_powertools_section,   SECTION_FALLBACK.powertools),
  };
}
