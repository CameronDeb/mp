import { NextRequest, NextResponse } from 'next/server';
import { saveAndNotify, EMAIL_RE } from '@/lib/inquiries';
import { getExperienceBySlug } from '@/lib/data/experiences';

// Interest-list signups from the 16 experience pages.
//
// `interest_list_signups.experience_interested_in` is an m2o to Directus's own
// `experiences` table, which the site does not use — experiences are static data in
// lib/data/experiences.ts with string ids. So the slug is written to the
// `experience_slug` column instead, and the m2o is left null.

export async function POST(request: NextRequest) {
  let body: Record<string, unknown>;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: 'Invalid request.' }, { status: 400 });
  }

  const firstName = String(body.firstName ?? body.name ?? '').trim();
  const email     = String(body.email      ?? '').trim();
  const slug      = String(body.experience ?? '').trim();
  const company   = String(body.company    ?? '').trim(); // honeypot

  if (company) return NextResponse.json({ ok: true });

  if (!firstName || !email) {
    return NextResponse.json({ error: 'Name and email are required.' }, { status: 400 });
  }
  if (!EMAIL_RE.test(email)) {
    return NextResponse.json({ error: 'Please enter a valid email address.' }, { status: 400 });
  }

  const experience = slug ? getExperienceBySlug(slug) : null;
  const experienceTitle = experience?.title ?? slug ?? 'an experience';
  const sourcePage = slug ? `/experiences/${slug}` : '';

  const result = await saveAndNotify({
    collection: 'interest_list_signups',
    payload: {
      name: firstName,
      email,
      experience_slug: slug || null,
      source_page: sourcePage || null,
      status: 'Active',
    },
    notification: {
      subject: `[Interest list] ${firstName} — ${experienceTitle}`,
      heading: 'New interest-list signup',
      fields: [
        ['Name', firstName],
        ['Email', email],
        ['Experience', experienceTitle],
        ['From page', sourcePage],
      ],
      replyTo: email,
    },
    autoReply: {
      to: email,
      subject: `You're on the interest list — ${experienceTitle}`,
      heading: "You're on the list",
      paragraphs: [
        `Hi ${firstName},`,
        `Thanks for your interest in ${experienceTitle}. You're on the interest list, which means you'll hear first when dates, details, and availability are confirmed.`,
        "Over the next little while you'll also receive a short series of emails about this work — what it involves, who it's for, and what tends to shift for the people who do it.",
        'If you have a question before then, just reply to this email.',
      ],
      footnote: "You signed up for this list at drmarkpirtle.com. You can unsubscribe at any time by replying to this email and asking to be removed.",
    },
  });

  if (!result.ok) {
    return NextResponse.json(
      { error: 'Could not add you to the list. Please try again shortly.' },
      { status: 502 }
    );
  }

  return NextResponse.json({ ok: true });
}
