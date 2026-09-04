import { NextRequest, NextResponse } from 'next/server';
import { sendConfirmationEmail } from '@/lib/mailgun-send';
import { sendAdminNotification, ADMIN_EMAIL } from '@/lib/form-emails';
import { directusItemUrl } from '@/lib/inquiries';

const DIRECTUS_URL = process.env.NEXT_PUBLIC_DIRECTUS_URL || 'http://localhost:8055';
const DIRECTUS_TOKEN = process.env.DIRECTUS_STATIC_TOKEN;

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const authHeaders = {
  'Content-Type': 'application/json',
  ...(DIRECTUS_TOKEN ? { Authorization: `Bearer ${DIRECTUS_TOKEN}` } : {}),
};

interface ExistingSubscriber {
  id: number;
  status: 'Subscribed' | 'Unsubscribed';
}

interface UpsertResult {
  /** False when they were already Subscribed — no emails are sent in that case. */
  isNewlySubscribed: boolean;
  /** True when this is a returning subscriber who had previously unsubscribed. */
  isResubscribe: boolean;
  id: number | null;
}

/** Creates or re-activates a subscriber. */
async function upsertSubscriber(email: string, name: string | null, source: string): Promise<UpsertResult> {
  const findRes = await fetch(
    `${DIRECTUS_URL}/items/newsletter_subscribers?filter[email][_eq]=${encodeURIComponent(email)}&limit=1&fields=id,status`,
    { headers: authHeaders, cache: 'no-store' }
  );
  if (!findRes.ok) throw new Error(`Directus lookup failed (${findRes.status}): ${await findRes.text()}`);
  const { data } = (await findRes.json()) as { data: ExistingSubscriber[] };
  const existing = data[0];

  if (existing) {
    if (existing.status === 'Subscribed') {
      return { isNewlySubscribed: false, isResubscribe: false, id: existing.id };
    }
    const patchRes = await fetch(`${DIRECTUS_URL}/items/newsletter_subscribers/${existing.id}`, {
      method: 'PATCH',
      headers: authHeaders,
      body: JSON.stringify({ status: 'Subscribed', subscribed_at: new Date().toISOString(), unsubscribed_at: null }),
    });
    if (!patchRes.ok) throw new Error(`Directus re-subscribe failed (${patchRes.status}): ${await patchRes.text()}`);
    return { isNewlySubscribed: true, isResubscribe: true, id: existing.id };
  }

  const createRes = await fetch(`${DIRECTUS_URL}/items/newsletter_subscribers?fields=id`, {
    method: 'POST',
    headers: authHeaders,
    body: JSON.stringify({ email, name, status: 'Subscribed', subscribed_at: new Date().toISOString(), source }),
  });
  if (!createRes.ok) throw new Error(`Directus create failed (${createRes.status}): ${await createRes.text()}`);
  const created = (await createRes.json()) as { data: { id: number } };
  return { isNewlySubscribed: true, isResubscribe: false, id: created.data.id };
}

/** Tells the admin about a new subscriber. Never throws — a failed notification
 *  must not undo a signup that Directus already stored. */
async function notifyAdminOfSignup(
  email: string,
  name: string | null,
  sourcePage: string,
  isResubscribe: boolean,
  id: number | null
): Promise<void> {
  if (!ADMIN_EMAIL) return;
  try {
    await sendAdminNotification({
      subject: `[Newsletter] ${isResubscribe ? 'Re-subscribe' : 'New subscriber'} — ${email}`,
      heading: isResubscribe ? 'Someone re-subscribed to the newsletter' : 'New newsletter subscriber',
      fields: [
        ['Email', email],
        ['Name', name],
        ['From page', sourcePage],
        ['Type', isResubscribe ? 'Previously unsubscribed' : 'First-time signup'],
      ],
      replyTo: email,
      directusUrl: id != null ? directusItemUrl('newsletter_subscribers', id) : undefined,
    });
  } catch (err) {
    console.error('[newsletter] Admin notification failed:', err);
  }
}

/** Only relative, same-site paths are allowed — never redirect off-site. */
function safeRedirectPath(path: string | null): string | null {
  if (!path || !path.startsWith('/') || path.startsWith('//')) return null;
  return path;
}

export async function POST(request: NextRequest) {
  const contentType = request.headers.get('content-type') || '';
  let email = '';
  let name: string | null = null;
  let redirectTo: string | null = null;

  let sourcePage = '';

  // A field that is hidden in the form, so a person never sees it and never
  // fills it in. Automated signups fill every input they find, which is how
  // three Gmail dot-alias addresses reached the list in August and put a
  // "new subscriber" email in Mark's inbox for each one.
  let trap = '';

  if (contentType.includes('application/json')) {
    const body = await request.json().catch(() => ({}));
    email = String(body.email || '').trim();
    name = body.name ? String(body.name).trim() : null;
    sourcePage = body.source_page ? String(body.source_page).trim() : '';
    trap = String(body.company_website || '').trim();
  } else {
    const form = await request.formData();
    email = String(form.get('email') || '').trim();
    name = form.get('name') ? String(form.get('name')).trim() : null;
    redirectTo = safeRedirectPath(form.get('redirect_to') ? String(form.get('redirect_to')) : null);
    sourcePage = redirectTo || '';
    trap = String(form.get('company_website') || '').trim();
  }

  // Answered exactly as a successful signup would be. Telling a bot it was
  // caught invites whoever runs it to adjust and try again, and there is no
  // person on the other end to inform.
  if (trap) {
    console.warn('[newsletter] honeypot triggered, signup dropped');
    if (redirectTo) return NextResponse.redirect(new URL(`${redirectTo}?subscribed=success`, request.url));
    return NextResponse.json({ ok: true });
  }

  if (!EMAIL_RE.test(email)) {
    if (redirectTo) return NextResponse.redirect(new URL(`${redirectTo}?subscribed=error`, request.url));
    return NextResponse.json({ ok: false, error: 'A valid email is required' }, { status: 400 });
  }

  try {
    const { isNewlySubscribed, isResubscribe, id } = await upsertSubscriber(email, name, 'Website form');
    if (isNewlySubscribed) {
      // The subscriber is already stored — a failed confirmation must not 500 the signup.
      try {
        await sendConfirmationEmail(email, name);
      } catch (mailErr) {
        console.error('[newsletter] Confirmation email failed:', mailErr);
      }
      await notifyAdminOfSignup(email, name, sourcePage, isResubscribe, id);
    }
  } catch (err) {
    if (redirectTo) return NextResponse.redirect(new URL(`${redirectTo}?subscribed=error`, request.url));
    return NextResponse.json(
      { ok: false, error: err instanceof Error ? err.message : String(err) },
      { status: 500 }
    );
  }

  if (redirectTo) return NextResponse.redirect(new URL(`${redirectTo}?subscribed=success`, request.url));
  return NextResponse.json({ ok: true });
}
