// Server-side plumbing shared by every form route: write the submission to Directus,
// notify the admin, auto-reply to the sender.
//
// The three steps fail independently on purpose. A Mailgun outage must not lose a
// submission that Directus already stored, and a Directus outage must not stop the
// admin being told someone got in touch. The route only reports failure to the visitor
// when *both* durable paths are gone — nothing stored and nobody notified.

import {
  sendAdminNotification,
  sendAutoReply,
  ADMIN_EMAIL,
  type AdminNotificationOptions,
  type AutoReplyOptions,
} from './form-emails';

const DIRECTUS_URL = process.env.NEXT_PUBLIC_DIRECTUS_URL || 'http://localhost:8055';
const DIRECTUS_TOKEN = process.env.DIRECTUS_STATIC_TOKEN;

export const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const authHeaders: Record<string, string> = {
  'Content-Type': 'application/json',
  ...(DIRECTUS_TOKEN ? { Authorization: `Bearer ${DIRECTUS_TOKEN}` } : {}),
};

/** Admin deep link to a single record, for the notification email. */
export function directusItemUrl(collection: string, id: string | number): string {
  return `${DIRECTUS_URL}/admin/content/${collection}/${id}`;
}

/** Creates one item and returns its primary key. */
export async function createItem(
  collection: string,
  payload: Record<string, unknown>
): Promise<string | number> {
  if (!DIRECTUS_TOKEN) {
    throw new Error('Directus not configured — set DIRECTUS_STATIC_TOKEN');
  }
  const res = await fetch(`${DIRECTUS_URL}/items/${collection}?fields=id`, {
    method: 'POST',
    headers: authHeaders,
    body: JSON.stringify(payload),
    cache: 'no-store',
  });
  if (!res.ok) {
    throw new Error(`Directus create failed on ${collection} (${res.status}): ${await res.text()}`);
  }
  const { data } = (await res.json()) as { data: { id: string | number } };
  return data.id;
}

/** Best-effort write-back of the two delivery flags. Never throws. */
async function recordDelivery(
  collection: string,
  id: string | number,
  flags: { admin_notified: boolean; auto_reply_sent: boolean }
): Promise<void> {
  try {
    await fetch(`${DIRECTUS_URL}/items/${collection}/${id}`, {
      method: 'PATCH',
      headers: authHeaders,
      body: JSON.stringify(flags),
      cache: 'no-store',
    });
  } catch (err) {
    console.error(`[inquiries] Could not record delivery flags on ${collection}/${id}:`, err);
  }
}

export interface SubmitOptions {
  collection: string;
  payload: Record<string, unknown>;
  /** Omit `directusUrl` — it is filled in once the record id is known. */
  notification: Omit<AdminNotificationOptions, 'directusUrl'>;
  autoReply: AutoReplyOptions;
}

export interface SubmitResult {
  /** True when the submission reached Directus, the admin, or both. */
  ok: boolean;
  itemId: string | number | null;
  adminNotified: boolean;
  autoReplySent: boolean;
}

/**
 * Stores the submission and sends both emails, tolerating partial failure.
 * Returns `ok: false` only when the submission was neither stored nor notified,
 * which is the one case the visitor needs to be told about.
 */
export async function saveAndNotify({
  collection,
  payload,
  notification,
  autoReply,
}: SubmitOptions): Promise<SubmitResult> {
  let itemId: string | number | null = null;
  try {
    itemId = await createItem(collection, payload);
  } catch (err) {
    console.error(`[inquiries] Directus write failed for ${collection}:`, err);
  }

  let adminNotified = false;
  try {
    if (!ADMIN_EMAIL) throw new Error('ADMIN_NOTIFICATION_EMAIL is not set');
    await sendAdminNotification({
      ...notification,
      directusUrl: itemId != null ? directusItemUrl(collection, itemId) : undefined,
    });
    adminNotified = true;
  } catch (err) {
    console.error(`[inquiries] Admin notification failed for ${collection}:`, err);
  }

  // The auto-reply is a courtesy — a bounce here never fails the submission.
  let autoReplySent = false;
  try {
    await sendAutoReply(autoReply);
    autoReplySent = true;
  } catch (err) {
    console.error(`[inquiries] Auto-reply to ${autoReply.to} failed:`, err);
  }

  if (itemId != null) {
    await recordDelivery(collection, itemId, {
      admin_notified: adminNotified,
      auto_reply_sent: autoReplySent,
    });
  }

  return { ok: itemId != null || adminNotified, itemId, adminNotified, autoReplySent };
}
