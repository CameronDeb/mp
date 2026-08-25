import { NextRequest, NextResponse } from 'next/server';
import { renderNewsletterById, physicalAddressProblem } from '@/lib/newsletter-render';
import { sendNewsletterToSubscribers, sendTestEmail } from '@/lib/mailgun-send';

const DIRECTUS_URL = process.env.NEXT_PUBLIC_DIRECTUS_URL || 'http://localhost:8055';
const DIRECTUS_TOKEN = process.env.DIRECTUS_STATIC_TOKEN;
const API_SECRET = process.env.NEWSLETTER_API_SECRET;

export async function POST(request: NextRequest) {
  // Simple secret check so random requests can't trigger sends
  const auth = request.headers.get('x-api-secret');
  if (API_SECRET && auth !== API_SECRET) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  let newsletterId: number;
  let testEmail: string | null = null;
  let batchSize: number | undefined;
  let afterId = 0;
  let dryRun = false;
  try {
    const body = await request.json();
    newsletterId = Number(body.newsletter_id);
    if (!newsletterId || isNaN(newsletterId)) throw new Error('invalid id');
    if (body.test_email) testEmail = String(body.test_email);
    if (body.batch_size != null) {
      batchSize = Number(body.batch_size);
      if (!Number.isFinite(batchSize) || batchSize < 1) throw new Error('invalid batch_size');
    }
    if (body.after_id != null) {
      afterId = Number(body.after_id);
      if (!Number.isFinite(afterId) || afterId < 0) throw new Error('invalid after_id');
    }
    dryRun = Boolean(body.dry_run);
  } catch {
    return NextResponse.json(
      { error: 'newsletter_id required; batch_size/after_id must be positive numbers' },
      { status: 400 }
    );
  }

  // Compose the final send-ready HTML from the structured template fields
  // (intro/main image/body/promo banner/latest posts/final banner/contact banner)
  // and the 2 latest published blog posts.
  let html: string;
  try {
    html = await renderNewsletterById(newsletterId);
  } catch (err) {
    return NextResponse.json(
      { error: `Failed to render newsletter template: ${err instanceof Error ? err.message : String(err)}` },
      { status: 500 }
    );
  }

  const authHeaders = {
    'Content-Type': 'application/json',
    ...(DIRECTUS_TOKEN ? { Authorization: `Bearer ${DIRECTUS_TOKEN}` } : {}),
  };

  const itemRes = await fetch(`${DIRECTUS_URL}/items/newsletters/${newsletterId}?fields=subject,recipient_count,mailgun_message_id`, {
    headers: authHeaders,
  });
  if (!itemRes.ok) {
    return NextResponse.json({ error: `Failed to load newsletter: ${await itemRes.text()}` }, { status: 500 });
  }
  const { data: newsletterItem } = await itemRes.json();

  // Test mode: sends only to test_email, touches nothing in Directus (no content
  // save, no status/sent tracking) — safe to run against a real newsletter item
  // without affecting real subscribers or marking it as sent.
  if (testEmail) {
    try {
      const testResult = await sendTestEmail(testEmail, newsletterItem.subject, html);
      return NextResponse.json({ ok: true, test: true, sentTo: testEmail, ...testResult });
    } catch (err) {
      return NextResponse.json(
        { error: `Mailgun test send failed: ${err instanceof Error ? err.message : String(err)}` },
        { status: 500 }
      );
    }
  }

  // Real send from here on. Refuse before anything is written or sent if the
  // CAN-SPAM footer address is still a placeholder.
  const addressProblem = physicalAddressProblem();
  if (addressProblem) {
    return NextResponse.json(
      { error: `Refusing to send to the full list: ${addressProblem} Set it in Vercel and redeploy. Test sends still work.` },
      { status: 409 }
    );
  }

  // A dry run resolves the cohort and returns it without sending or writing
  // anything, so a warm-up batch can be inspected before it goes out.
  if (dryRun) {
    try {
      const preview = await sendNewsletterToSubscribers(newsletterItem.subject, html, {
        batchSize,
        afterId,
        dryRun: true,
      });
      return NextResponse.json({ ok: true, ...preview });
    } catch (err) {
      return NextResponse.json(
        { error: `Dry run failed: ${err instanceof Error ? err.message : String(err)}` },
        { status: 500 }
      );
    }
  }

  // Stash the rendered HTML on `content` for a permanent record of exactly
  // what was sent.
  const patchContentRes = await fetch(`${DIRECTUS_URL}/items/newsletters/${newsletterId}`, {
    method: 'PATCH',
    headers: authHeaders,
    body: JSON.stringify({ content: html }),
  });
  if (!patchContentRes.ok) {
    return NextResponse.json({ error: `Failed to save rendered newsletter content: ${await patchContentRes.text()}` }, { status: 500 });
  }

  // Batch-sends directly to Subscribed rows in newsletter_subscribers via
  // Mailgun (no mailing list — this account's list feature caps member count).
  let sendResult;
  try {
    sendResult = await sendNewsletterToSubscribers(newsletterItem.subject, html, { batchSize, afterId });
  } catch (err) {
    return NextResponse.json(
      { error: `Mailgun send failed: ${err instanceof Error ? err.message : String(err)}` },
      { status: 500 }
    );
  }

  // During a staged warm-up the newsletter stays `sending` until the last
  // cohort clears, so a half-delivered send is never recorded as finished.
  // recipient_count accumulates across batches rather than being overwritten.
  // afterId 0 means this is the first cohort, so prior totals are from an older
  // send and must not be carried forward.
  const complete = sendResult.remaining === 0;
  const isContinuation = afterId > 0;
  const priorCount = isContinuation ? Number(newsletterItem.recipient_count ?? 0) : 0;
  const priorIds = isContinuation ? String(newsletterItem.mailgun_message_id ?? '').trim() : '';

  const patchStatusRes = await fetch(`${DIRECTUS_URL}/items/newsletters/${newsletterId}`, {
    method: 'PATCH',
    headers: authHeaders,
    body: JSON.stringify({
      status: complete ? 'sent' : 'sending',
      send_date: new Date().toISOString(),
      recipient_count: priorCount + sendResult.recipientCount,
      mailgun_message_id: [priorIds, ...sendResult.messageIds].filter(Boolean).join(', '),
    }),
  });
  if (!patchStatusRes.ok) {
    return NextResponse.json(
      { error: `Sent successfully but failed to update newsletter status: ${await patchStatusRes.text()}`, sendResult },
      { status: 500 }
    );
  }

  return NextResponse.json({
    ok: true,
    ...sendResult,
    complete,
    // Hand the operator the exact cursor for the next warm-up cohort so no one
    // has to work it out by hand between batches.
    nextAfterId: complete ? null : sendResult.lastId,
  });
}
