// Exchanges a signed download token for a short-lived presigned Spaces URL.
//
// The bytes deliberately do not pass through this function. Product audio runs
// to 100MB+ per track and ~4.4GB in total; proxying it would hit the function's
// duration limit on slow connections and route every gigabyte through Vercel's
// billable bandwidth. Instead we verify entitlement here and hand the browser
// a URL that Spaces serves directly.
//
// Two independent lifetimes are at work: our token carries the real
// entitlement and lasts LINK_TTL_HOURS, while the presigned URL it is
// exchanged for lasts minutes — long enough to start a download, short enough
// that a leaked redirect target is worthless.

import { NextRequest, NextResponse } from 'next/server';
import { verifyDownloadToken, LINK_TTL_HOURS } from '@/lib/downloads';
import { presignDownload, isStorageConfigured } from '@/lib/storage';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function GET(_req: NextRequest, { params }: { params: Promise<{ token: string }> }) {
  const { token } = await params;

  let result;
  try {
    result = verifyDownloadToken(token);
  } catch (err) {
    console.error('[download] verification failed:', err);
    return NextResponse.json({ error: 'Downloads are not configured.' }, { status: 500 });
  }

  if (!result.ok) {
    // An expired link is a normal thing to hit — a buyer returning to an old
    // email — so it gets its own status and a route back rather than a 403.
    if (result.reason === 'expired') {
      return NextResponse.json(
        {
          error: `This download link has expired. Links are valid for ${LINK_TTL_HOURS} hours.`,
          next: 'Request a fresh set at /power-tools/downloads',
        },
        { status: 410 }
      );
    }
    return NextResponse.json({ error: 'This download link is not valid.' }, { status: 403 });
  }

  if (!isStorageConfigured()) {
    console.error('[download] Spaces is not configured');
    return NextResponse.json({ error: 'Downloads are not available right now.' }, { status: 503 });
  }

  let url: string;
  try {
    url = await presignDownload(result.key, result.filename);
  } catch (err) {
    console.error(`[download] Could not presign ${result.key}:`, err);
    return NextResponse.json(
      { error: 'That file could not be retrieved. Please contact us and we will send it directly.' },
      { status: 502 }
    );
  }

  // 302 rather than 307/308: this is a one-off, non-cacheable handoff, and the
  // target changes on every request.
  const res = NextResponse.redirect(url, 302);
  res.headers.set('Cache-Control', 'private, no-store');
  return res;
}
