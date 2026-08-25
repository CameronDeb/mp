// Serves a purchased file against a signed, time-limited token.
//
// The file itself lives in Directus's private "Paid Products" folder, which is
// 403 to anonymous requests. This route holds the server-side Directus token
// and streams the bytes through only when the signature and expiry check out,
// so a link can be forwarded but not forged, and stops working after
// LINK_TTL_HOURS.

import { NextRequest, NextResponse } from 'next/server';
import { verifyDownloadToken, fetchPrivateFile, LINK_TTL_HOURS } from '@/lib/downloads';

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
    // An expired link is a normal thing to hit — a buyer coming back to an old
    // email — so it gets its own message and a route back rather than a 403.
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

  const upstream = await fetchPrivateFile(result.fileId);
  if (!upstream.ok || !upstream.body) {
    console.error(`[download] Directus returned ${upstream.status} for file ${result.fileId}`);
    return NextResponse.json(
      { error: 'That file could not be retrieved. Please contact us and we will send it directly.' },
      { status: 502 }
    );
  }

  const headers = new Headers();
  headers.set('Content-Type', upstream.headers.get('content-type') ?? 'application/octet-stream');
  const length = upstream.headers.get('content-length');
  if (length) headers.set('Content-Length', length);
  // Quote the filename so spaces survive, and strip quotes that would break it.
  headers.set('Content-Disposition', `attachment; filename="${result.filename.replace(/"/g, '')}"`);
  // Signed, expiring, and per-buyer: must never be cached by a shared proxy.
  headers.set('Cache-Control', 'private, no-store');

  return new NextResponse(upstream.body, { status: 200, headers });
}
