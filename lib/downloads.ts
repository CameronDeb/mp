// Time-limited signed download links for purchased Power Tools.
//
// The links are stateless: a token carries the object key, the filename and an
// expiry, signed with an HMAC. Nothing is stored, so there is no purchases
// table to keep in sync — Stripe already knows who bought what, and that is
// what the resend flow reads.
//
// Files live in a private DigitalOcean Spaces bucket. Only
// /api/download/[token] can reach them, and only with a valid unexpired
// signature — it exchanges our token for a short-lived presigned URL and
// redirects, so the bytes never pass through a Vercel function.

import crypto from 'node:crypto';

const SECRET = process.env.DOWNLOAD_SIGNING_SECRET;

/** How long a link stays valid. Long enough to be useful, short enough to age out. */
export const LINK_TTL_HOURS = 72;

export interface DownloadFile {
  /** Object key in the Spaces bucket. */
  key: string;
  /** Filename the buyer sees. */
  filename: string;
}

/**
 * product_key -> the files that purchase entitles you to.
 *
 * Deliberately empty for products whose files Mark has not delivered yet. A
 * product with no files here is NOT sellable — see `isDeliverable` — so the
 * shop shows it as Coming Soon rather than taking money for something that
 * cannot be delivered. scripts/upload-products.mjs regenerates this block
 * after uploading to Spaces; no other code needs to change.
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
export function createDownloadToken(key: string, filename: string, ttlHours = LINK_TTL_HOURS): string {
  const payload = b64url(
    Buffer.from(JSON.stringify({ f: key, n: filename, e: Math.floor(Date.now() / 1000) + ttlHours * 3600 }))
  );
  return `${payload}.${sign(payload)}`;
}

export type TokenResult =
  | { ok: true; key: string; filename: string }
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

  return { ok: true, key: claims.f, filename: claims.n };
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
      if (seen.has(file.key)) continue;
      seen.add(file.key);
      links.push({
        filename: file.filename,
        url: `${siteUrl}/api/download/${createDownloadToken(file.key, file.filename)}`,
      });
    }
  }
  return links;
}
