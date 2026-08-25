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
};

function assetUrl(fileId: string | null, fallback: string): string {
  return fileId ? `${DIRECTUS_URL}/assets/${fileId}` : fallback;
}

function text(value: string | null | undefined, fallback: string): string {
  return value && value.trim() ? value : fallback;
}

const FIELDS =
  'logo,logo_mark,hero_image,about_portrait,footer_brand_copy,' +
  'newsletter_heading,newsletter_body,newsletter_button_label,newsletter_privacy_line,' +
  'nav_cta_label,nav_cta_url';

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
