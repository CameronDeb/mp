// lib/homepage.ts
// Homepage copy, managed in the Directus `homepage` singleton.
//
// The layout lives in the section components; every string on the page lives
// here. Each field falls back to the copy signed off in HomepageDiagnosisV3 so
// the page never renders empty if Directus is unreachable.
//
// V3 dropped five sections from the homepage (Choose Your Path, Explore the
// Ecosystem, the standalone SAAQ section, the old Start Here book section and
// the Final Summary). Their fields are deliberately kept below — the sections
// are no longer rendered, not deleted, so any of them can be restored by
// putting the component back in app/page.tsx.

const DIRECTUS_URL = process.env.NEXT_PUBLIC_DIRECTUS_URL;
const DIRECTUS_TOKEN = process.env.DIRECTUS_STATIC_TOKEN;

export type HeroCta = { title: string; subtitle: string; url: string };
export type PathCard = {
  eyebrow: string; heading: string; subheading: string;
  body: string; path_line: string; cta_label: string; cta_url: string;
};
export type LinkedItem = { title: string; body: string; cta_label: string; cta_url: string };
export type PowerToolItem = {
  category: string; name: string; href: string; tag: string; external?: boolean;
};

export type HomepageCopy = {
  hero_headline: string;
  hero_body_1: string;
  hero_body_2: string;
  /**
   * Phone-only copy. Mark's mobile brief: "Do not simply shrink desktop
   * content. Mobile should be written and structured for phone users." Each of
   * these falls back to its desktop equivalent when left empty, so a blank
   * field is never a blank section.
   */
  hero_mobile_headline: string;
  hero_mobile_body: string;
  reflection_mobile_body: string;
  book_mobile_body: string;
  hero_orientation_line: string;
  hero_ctas: HeroCta[];
  hero_scroll_label: string;
  hero_scroll_url: string;

  path_eyebrow: string;
  path_heading: string;
  path_intro: string;
  path_cards: PathCard[];

  ecosystem_eyebrow: string;
  ecosystem_heading: string;
  ecosystem_intro: string;
  ecosystem_items: LinkedItem[];

  leadership_eyebrow: string;
  leadership_heading: string;
  leadership_body_1: string;
  leadership_body_2: string;
  leadership_cards: LinkedItem[];

  book_eyebrow: string;
  book_heading: string;
  book_body_1: string;
  book_body_2: string;
  book_body_3: string;
  book_cta_primary_label: string;
  book_cta_primary_url: string;
  book_cta_secondary_label: string;
  book_cta_secondary_url: string;
  book_link_label: string;
  book_link_url: string;

  reflection_eyebrow: string;
  reflection_heading: string;
  reflection_body_1: string;
  reflection_body_2: string;
  reflection_cta_label: string;
  reflection_cta_url: string;

  saaq_eyebrow: string;
  saaq_heading: string;
  saaq_body_1: string;
  saaq_body_2: string;
  saaq_body_3: string;
  saaq_cta_label: string;
  saaq_cta_url: string;
  saaq_cta_secondary_label: string;
  saaq_cta_secondary_url: string;

  powertools_eyebrow: string;
  powertools_heading: string;
  powertools_body_1: string;
  powertools_body_2: string;
  powertools_items: PowerToolItem[];
  powertools_cta_label: string;
  powertools_cta_url: string;

  about_eyebrow: string;
  about_heading: string;
  about_body_1: string;
  about_body_2: string;
  about_body_3: string;
  about_cta_primary_label: string;
  about_cta_primary_url: string;
  about_cta_secondary_label: string;
  about_cta_secondary_url: string;

  testimonials_eyebrow: string;
  testimonials_heading: string;
  testimonials_intro: string;
  testimonials_cta_label: string;
  testimonials_cta_url: string;

  blog_eyebrow: string;
  blog_heading: string;
  blog_body: string;
  blog_cta_label: string;
  blog_cta_url: string;

  final_heading: string;
  final_body: string;
  final_cta_primary_label: string;
  final_cta_primary_url: string;
  final_cta_secondary_label: string;
  final_cta_secondary_url: string;
  final_link_label: string;
  final_link_url: string;

  seo_title: string;
  seo_description: string;
};

/** HomepageDiagnosisV3 copy — also the fallback when Directus can't be reached. */
export const HOMEPAGE_FALLBACK: HomepageCopy = {
  hero_headline: 'Why do painful patterns repeat in life and at work?',
  hero_body_1: 'You can understand the issue and still struggle to change it.',
  hero_body_2:
    'SkillfullyAware® helps you understand your patterns, work with them in real life, and become wiser, healthier, and more effective in how you live, relate, and lead.',
  hero_orientation_line: 'Choose the path that fits why you’re here today.',
  // Empty on purpose: the components fall back to the desktop copy above, so an
  // unfilled mobile field shows the full wording rather than nothing.
  hero_mobile_headline: '',
  hero_mobile_body: '',
  reflection_mobile_body: '',
  book_mobile_body: '',
  hero_ctas: [
    { title: 'Understand My Patterns', subtitle: 'Start with the Book', url: '/power-tools/book' },
    { title: 'Leadership, Forums & Retreats', subtitle: 'Explore Leadership Work', url: '/forum-retreats' },
  ],
  // V3 removed the "Not sure where to begin?" link — it pointed at the deleted
  // Choose Your Path section. Blank label hides it; refill to bring it back.
  hero_scroll_label: '',
  hero_scroll_url: '/#start',

  path_eyebrow: 'One Ecosystem. Two Clear Paths.',
  path_heading: 'Choose your path',
  path_intro:
    'SkillfullyAware® is one ecosystem with two common entry points. Start with the path that matches why you’re here today.',
  path_cards: [
    {
      eyebrow: 'For Readers',
      heading: 'Understand My Patterns',
      subheading: 'Start with the book.',
      body: 'If you keep repeating painful patterns, reacting before you can think, or getting in your own way despite your best intentions, begin with Built This Way.',
      path_line: 'Built This Way → Reader Tool → Power Tools',
      cta_label: 'Start with the Book',
      cta_url: '/power-tools/book',
    },
    {
      eyebrow: 'For Leaders',
      heading: 'Leadership, Forums & Retreats',
      subheading: 'Bring SkillfullyAware® into leadership, forums, and high-trust growth work.',
      body: 'For founders, executives, EO/YPO members, forums, and leadership groups seeking deeper insight, stronger trust, better conversations, and guided developmental experiences.',
      path_line: 'SAAQ → Forum Retreats → Coaching',
      cta_label: 'Explore Leadership Work',
      cta_url: '#leader-path',
    },
  ],

  ecosystem_eyebrow: 'The Ecosystem',
  ecosystem_heading: 'Explore the Ecosystem',
  ecosystem_intro: 'Once you know your starting point, these are the main ways to continue the work.',
  ecosystem_items: [
    { title: 'Built This Way', body: 'Understand why painful patterns repeat.', cta_label: 'Start with the Book', cta_url: '/power-tools/book' },
    { title: 'Why Did I React That Way?', body: 'Look at one real reaction from your own life.', cta_label: 'Try the Reader Tool', cta_url: '/power-tools/book#reader-tool' },
    { title: 'Power Tools', body: 'Practice with classes, workbooks, and guided meditations.', cta_label: 'Explore Power Tools', cta_url: '/power-tools' },
    { title: 'SkillfullyAware Awareness Quotient (SAAQ)', body: 'Get a deeper developmental reflection on how you lead, relate, decide, and react under pressure.', cta_label: 'Explore the SAAQ', cta_url: '/consultation' },
    { title: 'Retreats & Leadership', body: 'Bring SkillfullyAware® into coaching, forums, retreats, and leadership development.', cta_label: 'Explore Leadership Work', cta_url: '/forum-retreats' },
  ],

  leadership_eyebrow: 'For Leaders',
  leadership_heading: 'For leaders, founders, forums, and teams',
  leadership_body_1:
    'The same patterns that shape personal life also show up in leadership: decision-making, conflict, trust, avoidance, over-control, burnout, and the private pressure many high-performing people carry alone.',
  leadership_body_2:
    'SkillfullyAware® leadership work helps leaders and groups see those patterns more clearly, talk about them more honestly, and practice better ways of responding under pressure.',
  leadership_cards: [
    { title: 'SAAQ for Leaders', body: 'A private developmental reflection on how you lead, relate, decide, protect, and grow under pressure.', cta_label: 'Explore SAAQ Coaching', cta_url: '/consultation' },
    { title: 'Forum Retreats', body: 'Guided experiences for EO/YPO forums and leadership groups ready for honest, skillful, well-held development.', cta_label: 'Explore Forum Retreats', cta_url: '/forum-retreats' },
    { title: 'Executive Coaching', body: 'One-on-one support for leaders navigating pressure, transition, conflict, decision-making, identity, or growth.', cta_label: 'Book a Conversation', cta_url: '/contact' },
  ],

  // V3: this is now the launch section directly under the hero. The "START HERE"
  // eyebrow was dropped — it implied every visitor should begin with the book,
  // which contradicts the two-path structure.
  book_eyebrow: 'The Book',
  book_heading: 'Built This Way is publishing October 22',
  book_body_1: 'There’s nothing wrong with you. There is a reason the pattern repeats.',
  book_body_2:
    '<strong>Built This Way: Why Painful Patterns Repeat and How to Change Them</strong> is the best place to begin if you want to understand why old patterns repeat and how real change becomes possible.',
  book_body_3:
    'The book is for people who know better but still react anyway, who understand the issue but keep finding themselves back in the same loop. It is also useful for parents, partners, leaders, coaches, therapists, and anyone who wants to understand the patterns that shape how people respond under stress.',
  // TODO: swap to the publisher's preorder URL once it exists — it points at the
  // book page meanwhile so the CTA is never dead.
  book_cta_primary_label: 'Preorder the Book',
  book_cta_primary_url: '/power-tools/book',
  book_cta_secondary_label: 'Join the Launch Team',
  // TODO: retarget once the Launch Team page is rewritten. V3 asks for it with
  // no tiers and no fundraising language, so it deliberately does NOT point at
  // the existing #tiers section — that is the part being removed.
  book_cta_secondary_url: '/power-tools/book',
  book_link_label: 'Learn more about Built This Way →',
  book_link_url: '/power-tools/book',

  reflection_eyebrow: 'Reader Tool',
  reflection_heading: 'Try Why Did I React That Way?',
  reflection_body_1:
    '<strong>Why Did I React That Way?</strong> is a reflection tool connected to <em>Built This Way</em>. Use it after a moment when you reacted, shut down, got defensive, felt hurt, got angry, or repeated an old pattern.',
  reflection_body_2:
    'The tool helps you slow the moment down and look at what may have been happening in your body, your story, your emotional pattern, and your next best practice step.',
  reflection_cta_label: 'Try the Reflection Tool',
  reflection_cta_url: 'https://why-did-i-react.vercel.app/',

  saaq_eyebrow: 'Go Deeper',
  saaq_heading: 'Go deeper with the SAAQ.',
  saaq_body_1:
    'Some patterns are easy to see. Others are hidden in how we lead, relate, decide, protect ourselves, handle pressure, and make meaning.',
  saaq_body_2:
    'The <strong>SkillfullyAware Awareness Quotient, or SAAQ,</strong> is a private developmental reflection that helps you see your strengths, blind spots, stress reactions, growth edges, and practical next steps.',
  saaq_body_3:
    'For leaders, the SAAQ can become a powerful starting point for coaching, forum retreats, and deeper leadership development.',
  saaq_cta_label: 'Explore the SAAQ',
  saaq_cta_url: '/consultation',
  saaq_cta_secondary_label: 'See a Sample Report',
  saaq_cta_secondary_url: 'https://saaq-pi.vercel.app/',

  powertools_eyebrow: 'Power Tools',
  powertools_heading: 'Practice the Change',
  powertools_body_1: 'Insight matters, but insight alone rarely changes a pattern.',
  powertools_body_2:
    'Power Tools are classes, workbooks, guided meditations, books, and practical resources that help you keep practicing after the first insight. Use them when attention is fixated, emotions are activated, habits are running, or you want support working with a specific pattern.',
  powertools_items: [
    { category: 'Online Classes', name: 'Project SkillfullyAware', href: '/power-tools#online-classes', tag: 'Class' },
    { category: 'Online Classes', name: 'Overcoming Addictive Behaviors', href: '/power-tools#online-classes', tag: 'Class' },
    { category: 'Workbooks', name: 'Becoming SkillfullyAware', href: '/power-tools#workbooks', tag: 'PDF' },
    { category: 'Workbooks', name: 'Raising Awareness', href: '/power-tools#workbooks', tag: 'PDF' },
    { category: 'Workbooks', name: 'Chasing Shadow Work', href: '/power-tools#workbooks', tag: 'PDF' },
    { category: 'Meditation Programs', name: 'Feel Better Series', href: '/power-tools#meditation-programs', tag: 'Audio + PDF' },
    { category: 'Meditation Programs', name: 'Learn To Meditate', href: '/power-tools#meditation-programs', tag: 'Audio + PDF' },
    { category: 'Meditation Programs', name: 'Comprehensive Program', href: '/power-tools#meditation-programs', tag: 'Bundle' },
    { category: 'Media', name: 'Built This Way', href: '/power-tools/book', tag: 'Book' },
    { category: 'Media', name: 'Is Your Story Making You Sick?', href: 'https://tubitv.com/movies/701292/is-your-story-making-you-sick', tag: 'Film', external: true },
    { category: 'Media', name: 'Boundarylessness of Awareness Audio', href: '/power-tools#media', tag: 'Audio' },
  ],
  powertools_cta_label: 'Explore Power Tools',
  powertools_cta_url: '/power-tools',

  about_eyebrow: 'About Dr. Mark',
  about_heading: 'Meet Dr. Mark Pirtle',
  about_body_1:
    'Dr. Mark Pirtle is the creator of SkillfullyAware®, author of Built This Way, and creator of the SkillfullyAware Awareness Quotient, or SAAQ.',
  about_body_2:
    'His work helps people understand why painful patterns repeat, how those patterns shape life and leadership, and how awareness, practice, integration, and compassion make change possible.',
  about_body_3:
    'Mark’s teaching brings together mindfulness, adult development, shadow work, somatic awareness, systems thinking, and decades of work with clients, leaders, groups, and retreat participants.',
  about_cta_primary_label: 'Read Full Story',
  about_cta_primary_url: '/about',
  about_cta_secondary_label: 'Book a Conversation',
  about_cta_secondary_url: '/contact',

  testimonials_eyebrow: 'Testimonials',
  testimonials_heading: 'What People Experience in the Work',
  testimonials_intro:
    'Reflections from leaders, clients, and participants who have used SkillfullyAware® to understand patterns, build trust, and practice meaningful change.',
  testimonials_cta_label: 'Book a Conversation',
  testimonials_cta_url: '/contact',

  blog_eyebrow: 'The Blog',
  blog_heading: 'Breaking Bad <em>(habits)</em>',
  blog_body:
    'Essays on why painful patterns repeat, why change is hard, and how to practice becoming more SkillfullyAware in daily life.',
  blog_cta_label: 'Read the Latest Essays',
  blog_cta_url: '/blog',

  final_heading:
    'There’s nothing wrong with you. Patterns form for a reason, and patterns can change.',
  final_body:
    'Start with the book, explore the leadership work, try the reader tool, practice with Power Tools, or go deeper with the SAAQ. Choose the path that fits why you’re here today.',
  final_cta_primary_label: 'Start with the Book',
  final_cta_primary_url: '/power-tools/book',
  final_cta_secondary_label: 'Explore Leadership Work',
  final_cta_secondary_url: '#leader-path',
  final_link_label: 'Get the Newsletter →',
  final_link_url: '/#newsletter',

  seo_title: 'Dr. Mark Pirtle | SkillfullyAware® — Understand Why Painful Patterns Repeat',
  seo_description:
    'SkillfullyAware® helps people understand their patterns, work through them, and continue evolving in life, relationships, and leadership. Start with Built This Way, or explore the SAAQ, forum retreats, and coaching.',
};

/** Directus wins where it has a value; the V3 fallback fills every hole. */
function merge(row: Partial<HomepageCopy> | null | undefined): HomepageCopy {
  if (!row) return HOMEPAGE_FALLBACK;
  const out = { ...HOMEPAGE_FALLBACK };
  for (const key of Object.keys(HOMEPAGE_FALLBACK) as (keyof HomepageCopy)[]) {
    const value = row[key];
    if (value === null || value === undefined || value === '') continue;
    if (Array.isArray(value) && value.length === 0) continue;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (out as any)[key] = value;
  }
  return out;
}

export async function getHomepageCopy(): Promise<HomepageCopy> {
  if (!DIRECTUS_URL) return HOMEPAGE_FALLBACK;
  try {
    const res = await fetch(`${DIRECTUS_URL}/items/homepage`, {
      headers: DIRECTUS_TOKEN ? { Authorization: `Bearer ${DIRECTUS_TOKEN}` } : {},
      next: { tags: ['homepage'] },
    });
    if (!res.ok) throw new Error(`Directus responded ${res.status}`);
    return merge((await res.json())?.data);
  } catch (err) {
    console.error('[homepage] Directus fetch failed, using bundled V3 copy:', err);
    return HOMEPAGE_FALLBACK;
  }
}
