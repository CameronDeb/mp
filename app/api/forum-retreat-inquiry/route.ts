import { NextRequest, NextResponse } from 'next/server';
import { saveAndNotify, EMAIL_RE } from '@/lib/inquiries';

// The forum-retreat inquiry form on /forum-retreats#inquiry.
// Field names and allowed values mirror the `forum_retreat_inquiries` collection —
// anything not on these lists is dropped rather than stored, so the Directus
// dropdowns never show a value they can't render.

const GROUP_SIZES   = ['5-10', '11-20', '21-40', '40+'];
const LENGTHS       = ['1', '2', '3', '4+'];
const BUDGETS       = ['<$5k', '$5k–$10k', '$10k–$25k', '$25k+'];
const GOALS         = ['Leadership', 'Team Cohesion', 'Shadow Work', 'Mindfulness', 'Strategic Planning'];

const LENGTH_LABELS: Record<string, string> = {
  '1': '1 day', '2': '2 days', '3': '3 days', '4+': '4+ days',
};

function pick(value: unknown, allowed: string[]): string | null {
  const v = String(value ?? '').trim();
  return allowed.includes(v) ? v : null;
}

export async function POST(request: NextRequest) {
  let body: Record<string, unknown>;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: 'Invalid request.' }, { status: 400 });
  }

  const name    = String(body.name    ?? '').trim();
  const email   = String(body.email   ?? '').trim();
  const phone   = String(body.phone   ?? '').trim();
  const org     = String(body.forum_organization ?? '').trim();
  const dates   = String(body.preferred_dates    ?? '').trim();
  const notes   = String(body.notes   ?? '').trim();
  const company = String(body.company ?? '').trim(); // honeypot

  if (company) return NextResponse.json({ ok: true });

  if (!name || !email) {
    return NextResponse.json({ error: 'Name and email are required.' }, { status: 400 });
  }
  if (!EMAIL_RE.test(email)) {
    return NextResponse.json({ error: 'Please enter a valid email address.' }, { status: 400 });
  }

  const groupSize     = pick(body.group_size,     GROUP_SIZES);
  const retreatLength = pick(body.retreat_length, LENGTHS);
  const budgetRange   = pick(body.budget_range,   BUDGETS);
  const primaryGoals  = Array.isArray(body.primary_goals)
    ? body.primary_goals.map(String).filter((g) => GOALS.includes(g))
    : [];

  const result = await saveAndNotify({
    collection: 'forum_retreat_inquiries',
    payload: {
      name,
      email,
      phone: phone || null,
      forum_organization: org || null,
      group_size: groupSize,
      preferred_dates: dates || null,
      retreat_length: retreatLength,
      primary_goals: primaryGoals.length ? primaryGoals : null,
      budget_range: budgetRange,
      notes: notes || null,
      source_page: '/forum-retreats',
      status: 'draft',
    },
    notification: {
      subject: `[Forum retreat] ${name}${org ? ` — ${org}` : ''}`,
      heading: 'New forum retreat inquiry',
      fields: [
        ['Name', name],
        ['Email', email],
        ['Phone', phone],
        ['Forum / org', org],
        ['Group size', groupSize],
        ['Preferred dates', dates],
        ['Length', retreatLength ? LENGTH_LABELS[retreatLength] : null],
        ['Primary goals', primaryGoals.join(', ')],
        ['Budget', budgetRange],
      ],
      message: notes || null,
      replyTo: email,
    },
    autoReply: {
      to: email,
      subject: 'Your forum retreat inquiry',
      heading: 'Thanks for reaching out about a forum retreat',
      paragraphs: [
        `Hi ${name.split(' ')[0]},`,
        'Your inquiry came through with the details about your group — thank you for taking the time.',
        'The next step is a short planning call to understand where your forum is, what you want the retreat to do, and whether this is the right fit. Mark will be in touch to find a time.',
        'After that call you receive a tailored proposal covering the recommended format, itinerary, experiences, logistics, and pricing. No commitment before then.',
      ],
      footnote: 'This is an automatic acknowledgement of the inquiry you submitted at drmarkpirtle.com/forum-retreats.',
    },
  });

  if (!result.ok) {
    return NextResponse.json(
      { error: 'Could not send your inquiry. Please try again shortly, or email mark@drmarkpirtle.com directly.' },
      { status: 502 }
    );
  }

  return NextResponse.json({ ok: true });
}
