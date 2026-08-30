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
import { MobilePathCards }   from '@/components/sections/MobilePathCards';
import { getPageBySlug }     from '@/lib/pages';
import { getHomepageCopy }   from '@/lib/homepage';
import { getSiteMedia, getSiteCopy, getSectionToggles } from '@/lib/site-settings';
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
  const [cmsPage, copy, media, siteCopy, testimonials, posts, sections] = await Promise.all([
    getPageBySlug('/'),
    getHomepageCopy(),
    getSiteMedia(),
    getSiteCopy(),
    getTestimonials(),
    getAllPosts(),
    getSectionToggles(),
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
      {/* Wrapped in .home-sections so mobile can reorder with flex `order`
          rather than shipping a second page. Desktop order is the DOM order;
          phones put the reflection tool before the book and hide the heavier
          sections. See globals.css. */}
      <div className="home-sections">
      <div className="sec-hero"><Hero image={media.heroImage} copy={copy} /></div>
      <div className="sec-book"><BuiltThisWay copy={copy} /></div>
      <div className="sec-reflection"><WhyDidIReact copy={copy} /></div>
      <div className="sec-paths mobile-only"><MobilePathCards /></div>
      <div className="sec-leadership"><LeaderPathway copy={copy} /></div>
      {/* Each of these is switched on or off from Site Settings in the CMS, so
          Mark can hide a section himself without any of its wording being
          deleted. */}
      {sections.powertools && (
        <div className="sec-powertools"><PowerToolsPreview copy={copy} /></div>
      )}
      {sections.about && (
        <div className="sec-about"><AboutMark portrait={media.aboutPortrait} copy={copy} /></div>
      )}
      {sections.testimonials && (
        <div className="sec-testimonial">
          {/* One testimonial on a phone, all of them on desktop — three stacked
              cards is a screen and a half of scrolling on mobile. */}
          <div className="desktop-only">
            <Testimonials
              items={testimonials}
              eyebrow={copy.testimonials_eyebrow}
              heading={copy.testimonials_heading}
              intro={copy.testimonials_intro}
              ctaLabel={copy.testimonials_cta_label}
              ctaUrl={copy.testimonials_cta_url}
            />
          </div>
          <div className="mobile-only">
            <Testimonials
              items={testimonials.slice(0, 1)}
              eyebrow={copy.testimonials_eyebrow}
              heading={copy.testimonials_heading}
              intro=""
            />
          </div>
        </div>
      )}
      {sections.blog && (
        <div className="sec-blog">
          {/* Three post cards on desktop, one plus a link on a phone. */}
          <div className="desktop-only">
            <LatestBlogPosts copy={copy} posts={posts.slice(0, 3)} />
          </div>
          <div className="mobile-only">
            <LatestBlogPosts copy={copy} posts={posts.slice(0, 1)} />
          </div>
        </div>
      )}
      <div className="sec-newsletter">
        <NewsletterSignup
          heading={siteCopy.newsletterHeading}
          body={siteCopy.newsletterBody}
          buttonLabel={siteCopy.newsletterButtonLabel}
          privacyLine={siteCopy.newsletterPrivacyLine}
        />
      </div>
      </div>
    </div>
  );
}
