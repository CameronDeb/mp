// Object storage for paid product files (DigitalOcean Spaces, S3-compatible).
//
// Buyers never receive a Spaces URL directly. /api/download/[token] verifies
// our own signed token, then issues a short-lived presigned URL and redirects
// to it, so the bytes come straight from Spaces rather than through a Vercel
// function. The product files are 100MB+ audio; proxying them would hit
// function duration limits and route every gigabyte through Vercel's billable
// bandwidth.
//
// The bucket must have File Listing set to Restricted. If it is public, the
// signing below is decorative.

import { S3Client, GetObjectCommand, HeadObjectCommand } from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';

const REGION = process.env.SPACES_REGION;
const BUCKET = process.env.SPACES_BUCKET;
const ACCESS_KEY = process.env.SPACES_ACCESS_KEY;
const SECRET_KEY = process.env.SPACES_SECRET_KEY;

/**
 * DigitalOcean shows a bucket-specific endpoint on the bucket page
 * (https://<bucket>.<region>.digitaloceanspaces.com) but the SDK wants the
 * regional one and takes the bucket separately — otherwise the bucket ends up
 * doubled in the host. Accept either and normalise.
 */
export function normaliseEndpoint(raw: string | undefined, bucket: string | undefined): string {
  const endpoint = (raw ?? '').trim().replace(/\/+$/, '');
  if (!endpoint || !bucket) return endpoint;
  return endpoint.replace(new RegExp(`^(https?://)${bucket}\\.`), '$1');
}

export function isStorageConfigured(): boolean {
  return Boolean(REGION && BUCKET && ACCESS_KEY && SECRET_KEY);
}

let client: S3Client | null = null;

export function getClient(): S3Client {
  if (!isStorageConfigured()) throw new Error('Spaces is not configured');
  if (client) return client;
  client = new S3Client({
    region: REGION!,
    endpoint: normaliseEndpoint(process.env.SPACES_ENDPOINT, BUCKET),
    credentials: { accessKeyId: ACCESS_KEY!, secretAccessKey: SECRET_KEY! },
    // Spaces rejects the SDK's default flexible-checksum headers with
    // InvalidArgument, so only send them when an operation requires it.
    requestChecksumCalculation: 'WHEN_REQUIRED',
    responseChecksumValidation: 'WHEN_REQUIRED',
  });
  return client;
}

export function getBucket(): string {
  if (!BUCKET) throw new Error('SPACES_BUCKET is not set');
  return BUCKET;
}

/**
 * A presigned GET valid for `expiresIn` seconds.
 *
 * Kept deliberately short: our own token already carries the real entitlement
 * and lifetime, and this URL only needs to survive the moment between the
 * redirect and the download starting.
 */
export async function presignDownload(
  key: string,
  filename: string,
  expiresIn = 300
): Promise<string> {
  const command = new GetObjectCommand({
    Bucket: getBucket(),
    Key: key,
    // Makes the browser save it under the real name rather than the object key.
    ResponseContentDisposition: `attachment; filename="${filename.replace(/"/g, '')}"`,
  });
  return getSignedUrl(getClient(), command, { expiresIn });
}

/** Whether an object exists, for verifying a manifest without downloading. */
export async function objectExists(key: string): Promise<boolean> {
  try {
    await getClient().send(new HeadObjectCommand({ Bucket: getBucket(), Key: key }));
    return true;
  } catch {
    return false;
  }
}
