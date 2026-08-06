import type { Metadata } from 'next';
import { Hero }              from '@/components/sections/Hero';
import { BuiltThisWay }      from '@/components/sections/BuiltThisWay';
import { WhyDidIReact }      from '@/components/sections/WhyDidIReact';
import { LeaderPathway }     from '@/components/sections/LeaderPathway';
import { PowerToolsPreview } from '@/components/sections/PowerToolsPreview';
import { AboutMark }         from '@/components/sections/AboutMark';
import { Testimonials }      from '@/components/sections/Testimonials';
import { LatestBlogPosts }   from '@/components/sections/LatestBlogPosts';
import { NewsletterSignup }  from '@/components/sections/NewsletterSignup';
import { getPageBySlug }     from '@/lib/pages';
import { getHomepageCopy }   from '@/lib/homepage';
import { getSiteMedia, getSiteCopy } from '@/lib/site-settings';
import { getTestimonials }   from '@/lib/testimonials';
import { getAllPosts }       from '@/lib/blog';
import BlockRenderer         from '@/components/blocks/BlockRenderer';

export async function generateMetadata(): Promise<Metadata> {
  const copy = await getHomepageCopy();
  return {
    title: copy.seo_title,
    description: copy.seo_description,
    openGraph: { title: copy.seo_title, description: copy.seo_description },
  };
}

export default async function HomePage() {
  const [cmsPage, copy, media, siteCopy, testimonials, posts] = await Promise.all([
    getPageBySlug('/'),
    getHomepageCopy(),
    getSiteMedia(),
    getSiteCopy(),
    getTestimonials(),
    getAllPosts(),
  ]);

  // If the homepage is ever rebuilt with the page builder, those blocks win.
  if (cmsPage && cmsPage.blocks.length > 0) {
    return (
      <div className="min-h-screen">
        <BlockRenderer blocks={cmsPage.blocks} />
      </div>
    );
  }

  // Otherwise the bespoke sections render, every string coming from Directus.
  //
  // Order per HomepageDiagnosisV3: the visitor chooses a path once, in the hero,
  // then sees the next relevant step rather than the whole ecosystem again.
  // ChooseYourPath, ReaderPathway, SAAQSection and FinalCTA were dropped as
  // duplicate path-selection moments — the components still exist and can be
  // put back here if that decision is ever reversed.
  return (
    <div className="min-h-screen">
      <Hero image={media.heroImage} copy={copy} />  {/* The one path choice */}
      <BuiltThisWay copy={copy} />                   {/* Launch: publishing Oct 22 */}
      <WhyDidIReact copy={copy} />                   {/* The book, applied */}
      <LeaderPathway copy={copy} />                  {/* SAAQ → Forum Retreats → Coaching */}
      <PowerToolsPreview copy={copy} />
      <AboutMark portrait={media.aboutPortrait} copy={copy} />
      <Testimonials
        items={testimonials}
        eyebrow={copy.testimonials_eyebrow}
        heading={copy.testimonials_heading}
        intro={copy.testimonials_intro}
        ctaLabel={copy.testimonials_cta_label}
        ctaUrl={copy.testimonials_cta_url}
      />
      <LatestBlogPosts copy={copy} posts={posts.slice(0, 3)} />
      <NewsletterSignup
        heading={siteCopy.newsletterHeading}
        body={siteCopy.newsletterBody}
        buttonLabel={siteCopy.newsletterButtonLabel}
        privacyLine={siteCopy.newsletterPrivacyLine}
      />
    </div>
  );
}
