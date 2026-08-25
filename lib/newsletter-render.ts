// Fetches a newsletter's structured fields + the 2 latest blog posts from Directus
// and renders the final send-ready HTML. Used by app/api/send-newsletter/route.ts
// before triggering the Mailgun send Flow.

import { renderNewsletterHTML, type NewsletterPostSummary, type NewsletterTemplateData } from './newsletter-template';

const DIRECTUS_URL = process.env.NEXT_PUBLIC_DIRECTUS_URL || 'http://localhost:8055';
const DIRECTUS_TOKEN = process.env.DIRECTUS_STATIC_TOKEN;

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://drmarkpirtle.com';
const PHYSICAL_ADDRESS = process.env.NEWSLETTER_PHYSICAL_ADDRESS || 'ADDRESS NOT SET — required by CAN-SPAM, set NEWSLETTER_PHYSICAL_ADDRESS';

/**
 * CAN-SPAM requires a real postal address in every commercial send. The env var
 * has shipped as a placeholder before, and a placeholder reaching the full list
 * is both a legal problem and an embarrassing one, so a real send is blocked
 * until it is set. Test sends are deliberately exempt — seeing the footer as it
 * currently stands is the point of a test.
 */
export function physicalAddressProblem(): string | null {
  const addr = (process.env.NEWSLETTER_PHYSICAL_ADDRESS || '').trim();
  if (!addr) return 'NEWSLETTER_PHYSICAL_ADDRESS is not set.';
  if (/replace|not set|your address|placeholder|xxx/i.test(addr)) {
    return `NEWSLETTER_PHYSICAL_ADDRESS still looks like a placeholder ("${addr}").`;
  }
  // A usable postal address has a number and some words. Catches "TBD" etc.
  if (!/\d/.test(addr) || addr.length < 12) {
    return `NEWSLETTER_PHYSICAL_ADDRESS does not look like a postal address ("${addr}").`;
  }
  return null;
}

interface DirectusNewsletterItem {
  id: number;
  intro_title: string;
  intro_description: string;
  main_image: string | null;
  body_content: string;
  promo_banner_heading: string | null;
  promo_banner_text: string | null;
  promo_banner_link_text: string | null;
  promo_banner_link_url: string | null;
  promo_banner_image: string | null;
  final_banner_image: string | null;
  final_banner_link_url: string | null;
  contact_banner_heading: string | null;
  contact_banner_subtext: string | null;
  contact_banner_button_text: string | null;
  contact_banner_button_url: string | null;
}

interface DirectusBlogPost {
  id: number;
  title: string;
  slug: string;
  excerpt: string;
  featured_image: string | null;
}

function assetUrl(fileId: string | null): string {
  if (!fileId) return '';
  return `${DIRECTUS_URL}/assets/${fileId}`;
}

async function directusFetch<T>(path: string): Promise<T> {
  const res = await fetch(`${DIRECTUS_URL}${path}`, {
    headers: DIRECTUS_TOKEN ? { Authorization: `Bearer ${DIRECTUS_TOKEN}` } : {},
    cache: 'no-store',
  });
  if (!res.ok) {
    throw new Error(`Directus request failed (${res.status}): ${path}`);
  }
  const json = await res.json();
  return json.data as T;
}

async function getNewsletterItem(newsletterId: number): Promise<DirectusNewsletterItem> {
  return directusFetch<DirectusNewsletterItem>(
    `/items/newsletters/${newsletterId}?fields=id,intro_title,intro_description,main_image,body_content,promo_banner_heading,promo_banner_text,promo_banner_link_text,promo_banner_link_url,promo_banner_image,final_banner_image,final_banner_link_url,contact_banner_heading,contact_banner_subtext,contact_banner_button_text,contact_banner_button_url`
  );
}

async function getLatestPosts(limit = 2): Promise<DirectusBlogPost[]> {
  return directusFetch<DirectusBlogPost[]>(
    `/items/blog_posts?filter[status][_eq]=published&sort=-date_created&limit=${limit}&fields=id,title,slug,excerpt,featured_image`
  );
}

/** Same logo the live site's header uses — kept in sync via Directus, not a static file. */
async function getSiteLogoUrl(): Promise<string> {
  if (process.env.NEWSLETTER_LOGO_URL) return process.env.NEWSLETTER_LOGO_URL;
  const settings = await directusFetch<{ logo: string | null }>('/items/site_settings?fields=logo');
  return assetUrl(settings.logo);
}

/** Fetches a newsletter + latest posts and renders the final send-ready HTML. */
export async function renderNewsletterById(newsletterId: number): Promise<string> {
  const [item, posts, logoUrl] = await Promise.all([
    getNewsletterItem(newsletterId),
    getLatestPosts(2),
    getSiteLogoUrl(),
  ]);

  const templateData: NewsletterTemplateData = {
    introTitle: item.intro_title ?? '',
    introDescription: item.intro_description ?? '',
    mainImageUrl: assetUrl(item.main_image),
    bodyContentHtml: item.body_content ?? '',
    promoBannerHeading: item.promo_banner_heading,
    promoBannerText: item.promo_banner_text,
    promoBannerLinkText: item.promo_banner_link_text,
    promoBannerLinkUrl: item.promo_banner_link_url,
    promoBannerImageUrl: assetUrl(item.promo_banner_image),
    finalBannerImageUrl: assetUrl(item.final_banner_image),
    finalBannerLinkUrl: item.final_banner_link_url,
    contactBannerHeading: item.contact_banner_heading,
    contactBannerSubtext: item.contact_banner_subtext,
    contactBannerButtonText: item.contact_banner_button_text,
    contactBannerButtonUrl: item.contact_banner_button_url,
  };

  const postSummaries: NewsletterPostSummary[] = posts.map((post) => ({
    title: post.title,
    excerpt: post.excerpt,
    url: `${SITE_URL}/blog/${post.slug}`,
    imageUrl: assetUrl(post.featured_image),
  }));

  return renderNewsletterHTML(templateData, postSummaries, {
    logoUrl,
    siteUrl: SITE_URL,
    physicalAddress: PHYSICAL_ADDRESS,
  });
}
