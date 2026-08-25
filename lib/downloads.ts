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
  comprehensive_meditation_program: [
    { key: "comprehensive_meditation_program/1. Skillfully Aware1.m4a", filename: "1. Skillfully Aware1.m4a" },
    { key: "comprehensive_meditation_program/2. Skillfully Aware1 (Background Wave).m4a", filename: "2. Skillfully Aware1 (Background Wave).m4a" },
    { key: "comprehensive_meditation_program/3. Skillfully Aware2.m4a", filename: "3. Skillfully Aware2.m4a" },
    { key: "comprehensive_meditation_program/4. Skillfully Aware2 (Background Wave).m4a", filename: "4. Skillfully Aware2 (Background Wave).m4a" },
    { key: "comprehensive_meditation_program/5. Skillfully Aware3.m4a", filename: "5. Skillfully Aware3.m4a" },
    { key: "comprehensive_meditation_program/6. Skillfully Aware3 (Background Wave).m4a", filename: "6. Skillfully Aware3 (Background Wave).m4a" },
    { key: "comprehensive_meditation_program/7. Talk Space1.m4a", filename: "7. Talk Space1.m4a" },
    { key: "comprehensive_meditation_program/8. Talk Space2.m4a", filename: "8. Talk Space2.m4a" },
    { key: "comprehensive_meditation_program/9. Talk Space3.m4a", filename: "9. Talk Space3.m4a" },
    { key: "comprehensive_meditation_program/10. Image Space1.m4a", filename: "10. Image Space1.m4a" },
    { key: "comprehensive_meditation_program/11. Image Space2.m4a", filename: "11. Image Space2.m4a" },
    { key: "comprehensive_meditation_program/12. Image Space3.m4a", filename: "12. Image Space3.m4a" },
    { key: "comprehensive_meditation_program/13. Feel Space1.m4a", filename: "13. Feel Space1.m4a" },
    { key: "comprehensive_meditation_program/14. Feel Space2.m4a", filename: "14. Feel Space2.m4a" },
    { key: "comprehensive_meditation_program/15. Feel Space3.m4a", filename: "15. Feel Space3.m4a" },
    { key: "comprehensive_meditation_program/16. Touch Space1.m4a", filename: "16. Touch Space1.m4a" },
    { key: "comprehensive_meditation_program/17. Touch Space2.m4a", filename: "17. Touch Space2.m4a" },
    { key: "comprehensive_meditation_program/18. Touch Space3.m4a", filename: "18. Touch Space3.m4a" },
    { key: "comprehensive_meditation_program/19. Sight Space1.m4a", filename: "19. Sight Space1.m4a" },
    { key: "comprehensive_meditation_program/20. Sight Space2.m4a", filename: "20. Sight Space2.m4a" },
    { key: "comprehensive_meditation_program/21. Sight Space3.m4a", filename: "21. Sight Space3.m4a" },
    { key: "comprehensive_meditation_program/22. Sound Space1.m4a", filename: "22. Sound Space1.m4a" },
    { key: "comprehensive_meditation_program/23. Sound Space2.m4a", filename: "23. Sound Space2.m4a" },
    { key: "comprehensive_meditation_program/24. Sound Space3.m4a", filename: "24. Sound Space3.m4a" },
    { key: "comprehensive_meditation_program/25. Turn Inward.m4a", filename: "25. Turn Inward.m4a" },
    { key: "comprehensive_meditation_program/26. Turn Outward.m4a", filename: "26. Turn Outward.m4a" },
    { key: "comprehensive_meditation_program/27. Strong Determination.m4a", filename: "27. Strong Determination.m4a" },
    { key: "comprehensive_meditation_program/28. Focus on Positive.m4a", filename: "28. Focus on Positive.m4a" },
    { key: "comprehensive_meditation_program/29. Focus on Positive (Background Wave).m4a", filename: "29. Focus on Positive (Background Wave).m4a" },
    { key: "comprehensive_meditation_program/30. Focus on Flow.m4a", filename: "30. Focus on Flow.m4a" },
    { key: "comprehensive_meditation_program/31. Focus on Flow (Background Wave).m4a", filename: "31. Focus on Flow (Background Wave).m4a" },
    { key: "comprehensive_meditation_program/32. Enter Stillspace.m4a", filename: "32. Enter Stillspace.m4a" },
    { key: "comprehensive_meditation_program/33. Enter Stillspace (Background Wave).m4a", filename: "33. Enter Stillspace (Background Wave).m4a" },
    { key: "comprehensive_meditation_program/34. Allow Yourself to Sleep.m4a", filename: "34. Allow Yourself to Sleep.m4a" },
    { key: "comprehensive_meditation_program/35. Allow Yourself to Sleep (Background Wave).m4a", filename: "35. Allow Yourself to Sleep (Background Wave).m4a" },
    { key: "comprehensive_meditation_program/36. Working With Pain.m4a", filename: "36. Working With Pain.m4a" },
    { key: "comprehensive_meditation_program/37. Working With Pain (Background Wave).m4a", filename: "37. Working With Pain (Background Wave).m4a" },
    { key: "comprehensive_meditation_program/38. Insight into Pain.m4a", filename: "38. Insight into Pain.m4a" },
    { key: "comprehensive_meditation_program/39. Insight into Pain (Background Wave).m4a", filename: "39. Insight into Pain (Background Wave).m4a" },
    { key: "comprehensive_meditation_program/40. Working With Strong Emotions and Urges.m4a", filename: "40. Working With Strong Emotions and Urges.m4a" },
    { key: "comprehensive_meditation_program/41. Working With Strong Emotions and Urges (Background Wave).m4a", filename: "41. Working With Strong Emotions and Urges (Background Wave).m4a" },
    { key: "comprehensive_meditation_program/42. Insight into Strong Emotions and Urges.m4a", filename: "42. Insight into Strong Emotions and Urges.m4a" },
    { key: "comprehensive_meditation_program/43. Insight into Strong Emotions and Urges (Background Wave).m4a", filename: "43. Insight into Strong Emotions and Urges (Background Wave).m4a" },
    { key: "comprehensive_meditation_program/44. 60-Minute Delta Wave for Relaxation or Sleep.m4a", filename: "44. 60-Minute Delta Wave for Relaxation or Sleep.m4a" },
    { key: "comprehensive_meditation_program/FinalComprehensiveProgram.pdf", filename: "FinalComprehensiveProgram.pdf" },
  ],
  feel_better_series: [
    { key: "feel_better_series/1. Allow Yourself to Sleep.m4a", filename: "1. Allow Yourself to Sleep.m4a" },
    { key: "feel_better_series/2. Allow Yourself to Sleep (Background Wave).m4a", filename: "2. Allow Yourself to Sleep (Background Wave).m4a" },
    { key: "feel_better_series/3. Working With Pain.m4a", filename: "3. Working With Pain.m4a" },
    { key: "feel_better_series/4. Working With Pain (Background Wave).m4a", filename: "4. Working With Pain (Background Wave).m4a" },
    { key: "feel_better_series/5. Insight into Pain.m4a", filename: "5. Insight into Pain.m4a" },
    { key: "feel_better_series/6. Insight into Pain (Background Wave).m4a", filename: "6. Insight into Pain (Background Wave).m4a" },
    { key: "feel_better_series/7. Working With Strong Emotions and Urges.m4a", filename: "7. Working With Strong Emotions and Urges.m4a" },
    { key: "feel_better_series/8. Working With Strong Emotions and Urges (Background Wave).m4a", filename: "8. Working With Strong Emotions and Urges (Background Wave).m4a" },
    { key: "feel_better_series/9. Insight into Strong Emotions and Urges.m4a", filename: "9. Insight into Strong Emotions and Urges.m4a" },
    { key: "feel_better_series/10. Insight into Strong Emotions and Urges (Background Wave).m4a", filename: "10. Insight into Strong Emotions and Urges (Background Wave).m4a" },
    { key: "feel_better_series/bonus/60-Minute Delta Wave for Relaxation or Sleep.m4a", filename: "60-Minute Delta Wave for Relaxation or Sleep.m4a" },
    { key: "feel_better_series/FinalFeelBetterSeries2025Version.pdf", filename: "FinalFeelBetterSeries2025Version.pdf" },
  ],
  learn_to_meditate_series: [
    { key: "learn_to_meditate_series/1. Skillfully Aware1.m4a", filename: "1. Skillfully Aware1.m4a" },
    { key: "learn_to_meditate_series/2. Skillfully Aware1 (Background Wave).m4a", filename: "2. Skillfully Aware1 (Background Wave).m4a" },
    { key: "learn_to_meditate_series/3. Skillfully Aware2.m4a", filename: "3. Skillfully Aware2.m4a" },
    { key: "learn_to_meditate_series/4. Skillfully Aware2 (Background Wave).m4a", filename: "4. Skillfully Aware2 (Background Wave).m4a" },
    { key: "learn_to_meditate_series/5. Skillfully Aware3.m4a", filename: "5. Skillfully Aware3.m4a" },
    { key: "learn_to_meditate_series/6. Skillfully Aware3 (Background Wave).m4a", filename: "6. Skillfully Aware3 (Background Wave).m4a" },
    { key: "learn_to_meditate_series/7. Touch Space1.m4a", filename: "7. Touch Space1.m4a" },
    { key: "learn_to_meditate_series/8. Touch Space2.m4a", filename: "8. Touch Space2.m4a" },
    { key: "learn_to_meditate_series/9. Touch Space3.m4a", filename: "9. Touch Space3.m4a" },
    { key: "learn_to_meditate_series/10. Sight Space1.m4a", filename: "10. Sight Space1.m4a" },
    { key: "learn_to_meditate_series/11. Sight Space2.m4a", filename: "11. Sight Space2.m4a" },
    { key: "learn_to_meditate_series/12. Sight Space3.m4a", filename: "12. Sight Space3.m4a" },
    { key: "learn_to_meditate_series/13. Sound Space1.m4a", filename: "13. Sound Space1.m4a" },
    { key: "learn_to_meditate_series/14. Sound Space2.m4a", filename: "14. Sound Space2.m4a" },
    { key: "learn_to_meditate_series/15. Sound Space3.m4a", filename: "15. Sound Space3.m4a" },
    { key: "learn_to_meditate_series/16. Talk Space1.m4a", filename: "16. Talk Space1.m4a" },
    { key: "learn_to_meditate_series/17. Talk Space2.m4a", filename: "17. Talk Space2.m4a" },
    { key: "learn_to_meditate_series/18. Talk Space3.m4a", filename: "18. Talk Space3.m4a" },
    { key: "learn_to_meditate_series/19. Image Space1.m4a", filename: "19. Image Space1.m4a" },
    { key: "learn_to_meditate_series/20. Image Space2.m4a", filename: "20. Image Space2.m4a" },
    { key: "learn_to_meditate_series/21. Image Space3.m4a", filename: "21. Image Space3.m4a" },
    { key: "learn_to_meditate_series/22. Feel Space1.m4a", filename: "22. Feel Space1.m4a" },
    { key: "learn_to_meditate_series/23. Feel Space2.m4a", filename: "23. Feel Space2.m4a" },
    { key: "learn_to_meditate_series/24. Feel Space3.m4a", filename: "24. Feel Space3.m4a" },
    { key: "learn_to_meditate_series/25. Turn Outward.m4a", filename: "25. Turn Outward.m4a" },
    { key: "learn_to_meditate_series/26. Turn Inward.m4a", filename: "26. Turn Inward.m4a" },
    { key: "learn_to_meditate_series/27. Strong Determination.m4a", filename: "27. Strong Determination.m4a" },
    { key: "learn_to_meditate_series/FinalLearnToMeditateSeries.pdf", filename: "FinalLearnToMeditateSeries.pdf" },
  ],
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
