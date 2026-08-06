import type { Metadata } from "next";
import { Plus_Jakarta_Sans, Playfair_Display } from "next/font/google";
import "./globals.css";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { getSiteMedia, getSiteCopy } from "@/lib/site-settings";
import { getCuratedCategories } from "@/lib/blog";

const jakarta = Plus_Jakarta_Sans({
  subsets: ["latin"],
  variable: "--font-jakarta",
  display: "swap",
  weight: ["400", "500", "600", "700", "800"],
});

const playfair = Playfair_Display({
  subsets: ["latin"],
  variable: "--font-playfair",
  display: "swap",
  weight: ["400", "700"],
});

export const metadata: Metadata = {
  title: "Dr. Mark Pirtle | SkillfullyAware®",
  description:
    "SkillfullyAware® helps people understand their patterns, work through them, and continue evolving in life, relationships, and leadership.",
  keywords:
    "painful patterns, habit change, executive coaching, leadership development, EO retreats, YPO forums, shadow work, mindfulness, SAAQ",
};

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  // Nav and footer chrome is driven by Directus: logo and copy from
  // site_settings, blog categories from the curated `blog_categories` taxonomy.
  const [media, copy, categories] = await Promise.all([
    getSiteMedia(),
    getSiteCopy(),
    getCuratedCategories(),
  ]);

  return (
    <html lang="en" className={`${jakarta.variable} ${playfair.variable}`}>
      <body style={{ fontFamily: "var(--font-sans)", backgroundColor: "var(--color-brand-cream)" }}>
        <Header
          logo={media.logo}
          categories={categories}
          ctaLabel={copy.navCtaLabel}
          ctaUrl={copy.navCtaUrl}
        />
        <main>{children}</main>
        <Footer
          blogCategories={categories.map((c) => c.name)}
          brandCopy={copy.footerBrandCopy}
          newsletterHeading={copy.newsletterHeading}
          newsletterBody={copy.newsletterBody}
          newsletterButtonLabel={copy.newsletterButtonLabel}
          newsletterPrivacyLine={copy.newsletterPrivacyLine}
        />
      </body>
    </html>
  );
}
