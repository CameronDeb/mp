// Checks the code word printed in Chapter 8 and, if it matches, hands back a
// signed download link for the Boundarylessness of Awareness audio.
//
// The check runs here rather than in the page so the code never reaches the
// browser bundle. It is a soft gate by design — the word is printed in a book,
// so it is semi-public and only meant to keep the audio tied to reading the
// chapter, not to withstand a determined attacker.

import { NextRequest, NextResponse } from 'next/server';
import crypto from 'node:crypto';
import { createDownloadToken } from '@/lib/downloads';
import { isStorageConfigured } from '@/lib/storage';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

const CODE = process.env.BOUNDARYLESSNESS_CODE;

const AUDIO = {
  key: 'launch_team/Boundarylessness-of-Awareness.m4a',
  filename: 'Boundarylessness of Awareness.m4a',
};

/** Case- and whitespace-insensitive, compared in constant time. */
function codeMatches(supplied: string): boolean {
  if (!CODE) return false;
  const a = Buffer.from(supplied.trim().toLowerCase());
  const b = Buffer.from(CODE.trim().toLowerCase());
  if (a.length !== b.length) return false;
  return crypto.timingSafeEqual(a, b);
}

export async function POST(req: NextRequest) {
  if (!CODE || !isStorageConfigured()) {
    console.error('[boundarylessness] BOUNDARYLESSNESS_CODE or Spaces not configured');
    return NextResponse.json(
      { error: 'This is not available right now. Please try again shortly.' },
      { status: 503 }
    );
  }

  let supplied: string;
  try {
    const body = await req.json();
    supplied = String(body.code ?? '');
  } catch {
    return NextResponse.json({ error: 'Please enter the code word.' }, { status: 400 });
  }

  if (!supplied.trim()) {
    return NextResponse.json({ error: 'Please enter the code word.' }, { status: 400 });
  }

  if (!codeMatches(supplied)) {
    // Say where the word is rather than only that it is wrong — a reader with
    // the book in hand can act on that, and the gate is not a security control.
    return NextResponse.json(
      { error: "That code word doesn't match. It appears in Chapter 8, alongside this link." },
      { status: 401 }
    );
  }

  return NextResponse.json({
    ok: true,
    filename: AUDIO.filename,
    url: `/api/download/${createDownloadToken(AUDIO.key, AUDIO.filename)}`,
  });
}
