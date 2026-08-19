import { NextRequest, NextResponse } from 'next/server';
import { saveAndNotify, EMAIL_RE } from '@/lib/inquiries';

// Contact submissions are stored in Directus (`contact_submissions`), notified to the
// admin, and acknowledged with an auto-reply. See lib/inquiries.ts for the partial-
// failure contract.

const REASON_LABELS: Record<string, string> = {
  general:  'General enquiry',
  book:     'Built This Way — book / launch team',
  saaq:     'SAAQ / consultation',
  retreat:  'Forum Retreats',
  call:     'Book a call',
  speaking: 'Speaking / media',
};

/** What the auto-reply promises, per reason. Keeps the acknowledgement specific
 *  rather than a generic "we got your message". */
const REASON_ACKS: Record<string, string> = {
  general:  'Mark reads every message personally and will get back to you as soon as he can.',
  book:     'Mark will be in touch with details on Built This Way and how to join the launch team.',
  saaq:     'Mark will follow up with how the SAAQ works and what a consultation involves.',
  retreat:  'Mark will be in touch to learn more about your forum and what a retreat could look like for your group.',
  call:     'Mark will follow up shortly with a couple of times for a 30-minute call.',
  speaking: 'Mark will get back to you about the event, format, and availability.',
};

export async function POST(request: NextRequest) {
  let body: Record<string, unknown>;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: 'Invalid request.' }, { status: 400 });
  }

  const name       = String(body.name        ?? '').trim();
  const email      = String(body.email       ?? '').trim();
  const message    = String(body.message     ?? '').trim();
  const reason     = String(body.reason      ?? 'general').trim();
  const sourcePage = String(body.source_page ?? '').trim();
  const company    = String(body.company     ?? '').trim(); // honeypot

  // Bot filled the hidden field — accept silently so it doesn't retry.
  if (company) return NextResponse.json({ ok: true });

  if (!name || !email || !message) {
    return NextResponse.json({ error: 'Name, email, and message are required.' }, { status: 400 });
  }
  if (!EMAIL_RE.test(email)) {
    return NextResponse.json({ error: 'Please enter a valid email address.' }, { status: 400 });
  }

  const storedReason = reason in REASON_LABELS ? reason : 'general';
  const reasonLabel = REASON_LABELS[storedReason];

  const result = await saveAndNotify({
    collection: 'contact_submissions',
    payload: {
      name,
      email,
      reason: storedReason,
      message,
      source_page: sourcePage || null,
      status: 'New',
    },
    notification: {
      subject: `[${reasonLabel}] New message from ${name}`,
      heading: 'New contact form submission',
      fields: [
        ['Name', name],
        ['Email', email],
        ['About', reasonLabel],
        ['From page', sourcePage],
      ],
      message,
      replyTo: email,
    },
    autoReply: {
      to: email,
      subject: 'Thanks for getting in touch',
      heading: 'Thanks for getting in touch',
      paragraphs: [
        `Hi ${name.split(' ')[0]},`,
        'Your message came through — this is just to confirm it landed.',
        REASON_ACKS[storedReason],
        'If anything else comes to mind in the meantime, simply reply to this email.',
      ],
      footnote: 'This is an automatic acknowledgement of the message you sent at drmarkpirtle.com.',
    },
  });

  if (!result.ok) {
    // Nothing stored and nobody notified — don't pretend it sent.
    return NextResponse.json(
      { error: 'Could not send your message. Please try again shortly, or email mark@drmarkpirtle.com directly.' },
      { status: 502 }
    );
  }

  return NextResponse.json({ ok: true });
}
