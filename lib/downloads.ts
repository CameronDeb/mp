// Time-limited signed download links for purchased Power Tools.
//
// The links are stateless: a token carries the product key, the file id and an
// expiry, signed with an HMAC. Nothing is stored, so there is no purchases
// table to keep in sync — Stripe already knows who bought what, and that is
// what the resend flow reads.
//
// Files live in the Directus "Paid Products (private)" folder, which returns
// 403 to anonymous requests. Only /api/download/[token] can read them, and
// only with a valid unexpired signature.

import crypto from 'node:crypto';

const SECRET = process.env.DOWNLOAD_SIGNING_SECRET;
const DIRECTUS_URL = process.env.NEXT_PUBLIC_DIRECTUS_URL;
const DIRECTUS_TOKEN = process.env.DIRECTUS_STATIC_TOKEN;

/** How long a link stays valid. Long enough to be useful, short enough to age out. */
export const LINK_TTL_HOURS = 72;

export interface DownloadFile {
  /** Directus file id in the private folder. */
  fileId: string;
  /** Filename the buyer sees. */
  filename: string;
}

/**
 * product_key -> the files that purchase entitles you to.
 *
 * Deliberately empty for products whose files Mark has not delivered yet. A
 * product with no files here is NOT sellable — see `isDeliverable` — so the
 * shop shows it as Coming Soon rather than taking money for something that
 * cannot be delivered. Fill this in as files are uploaded to the private
 * Directus folder; no other code needs to change.
 */
export const DOWNLOAD_MANIFEST: Record<string, DownloadFile[]> = {
  becoming_skillfullyaware_workbook: [],
  unfinished_business_workbook: [],
  raising_awareness_workbook: [],
  power_tools_bundle: [],
  feel_better_series: [],
  learn_to_meditate_series: [],
  comprehensive_meditation_program: [],
};

function b64url(buf: Buffer): string {
  return buf.toString('base64').replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
}

function sign(payload: string): string {
  if (!SECRET) throw new Error('DOWNLOAD_SIGNING_SECRET is not set');
  return b64url(crypto.createHmac('sha256', SECRET).update(payload).digest());
}

/** A token granting access to one file until it expires. */
export function createDownloadToken(fileId: string, filename: string, ttlHours = LINK_TTL_HOURS): string {
  const payload = b64url(
    Buffer.from(JSON.stringify({ f: fileId, n: filename, e: Math.floor(Date.now() / 1000) + ttlHours * 3600 }))
  );
  return `${payload}.${sign(payload)}`;
}

export type TokenResult =
  | { ok: true; fileId: string; filename: string }
  | { ok: false; reason: 'malformed' | 'bad-signature' | 'expired' };

export function verifyDownloadToken(token: string): TokenResult {
  const dot = token.lastIndexOf('.');
  if (dot < 1) return { ok: false, reason: 'malformed' };

  const payload = token.slice(0, dot);
  const provided = token.slice(dot + 1);

  // Constant-time compare, and only after a length check — timingSafeEqual
  // throws on mismatched lengths, which would itself leak.
  const expected = sign(payload);
  if (
    provided.length !== expected.length ||
    !crypto.timingSafeEqual(Buffer.from(provided), Buffer.from(expected))
  ) {
    return { ok: false, reason: 'bad-signature' };
  }

  let claims: { f?: string; n?: string; e?: number };
  try {
    claims = JSON.parse(Buffer.from(payload.replace(/-/g, '+').replace(/_/g, '/'), 'base64').toString());
  } catch {
    return { ok: false, reason: 'malformed' };
  }

  if (!claims.f || !claims.n || !claims.e) return { ok: false, reason: 'malformed' };
  if (claims.e < Math.floor(Date.now() / 1000)) return { ok: false, reason: 'expired' };

  return { ok: true, fileId: claims.f, filename: claims.n };
}

/** Fetches a private file from Directus using the server-side token. */
export async function fetchPrivateFile(fileId: string): Promise<Response> {
  if (!DIRECTUS_URL || !DIRECTUS_TOKEN) throw new Error('Directus is not configured');
  return fetch(`${DIRECTUS_URL}/assets/${encodeURIComponent(fileId)}`, {
    headers: { Authorization: `Bearer ${DIRECTUS_TOKEN}` },
    cache: 'no-store',
  });
}

/**
 * Whether a purchase of `productKey` can actually be delivered right now.
 *
 * Live classes have nothing to download — buying one books a seat — so they are
 * always deliverable. Everything else needs at least one file in the manifest.
 * The shop uses this to decide between a buy button and "Coming Soon", which is
 * what stops us selling files we do not have.
 */
export function isDeliverable(productKey: string, digitalDelivery: boolean): boolean {
  if (!digitalDelivery) return true;
  return (DOWNLOAD_MANIFEST[productKey]?.length ?? 0) > 0;
}

/** Signed links for everything a product entitles the buyer to. */
export function buildDownloadLinks(
  productKeys: string[],
  siteUrl: string
): { filename: string; url: string }[] {
  const seen = new Set<string>();
  const links: { filename: string; url: string }[] = [];
  for (const key of productKeys) {
    for (const file of DOWNLOAD_MANIFEST[key] ?? []) {
      if (seen.has(file.fileId)) continue;
      seen.add(file.fileId);
      links.push({
        filename: file.filename,
        url: `${siteUrl}/api/download/${createDownloadToken(file.fileId, file.filename)}`,
      });
    }
  }
  return links;
}
