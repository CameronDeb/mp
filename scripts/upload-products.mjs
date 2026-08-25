/**
 * Uploads Mark's product files from power-tool-files/ to Spaces and prints the
 * DOWNLOAD_MANIFEST block to paste into lib/downloads.ts.
 *
 *   node scripts/upload-products.mjs            # dry run: shows the plan
 *   node scripts/upload-products.mjs --apply    # upload
 *
 * Reads straight out of the zips, so there is no need to extract 4.4GB first.
 * Skips objects already present with a matching size, which makes a re-run
 * cheap and an interrupted run safe to resume.
 */

import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import yauzl from 'yauzl';
import { S3Client, HeadObjectCommand } from '@aws-sdk/client-s3';
import { Upload } from '@aws-sdk/lib-storage';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const FILES_DIR = path.join(ROOT, 'power-tool-files');
const APPLY = process.argv.includes('--apply');

function loadEnv() {
  const out = {};
  for (const line of fs.readFileSync(path.join(ROOT, '.env'), 'utf8').split('\n')) {
    const t = line.trim();
    if (!t || t.startsWith('#') || !t.includes('=')) continue;
    const i = t.indexOf('=');
    out[t.slice(0, i)] = t.slice(i + 1).trim().replace(/^["']|["']$/g, '');
  }
  return out;
}

const env = { ...loadEnv(), ...process.env };

/**
 * Which product each source folder belongs to.
 *
 * The trap here: "BecomingSkillfullyAwareAudioFiles" is the 44-track
 * Comprehensive Program, NOT the $29 "Becoming SkillfullyAware — See Yourself"
 * workbook. Two different products with nearly identical names.
 */
const ROUTES = [
  { match: /AllAudioFiles\/BecomingSkillfullyAwareAudioFiles\//i, product: 'comprehensive_meditation_program' },
  { match: /AllAudioFiles\/LearnToMeditateAudioFiles\//i,          product: 'learn_to_meditate_series' },
  { match: /AllAudioFiles\/FeelBetterAudioFiles\//i,               product: 'feel_better_series' },
  { match: /BecomingSkillfullyAwareBookletCopy-ComprehensiveProgram\/FinalComprehensiveProgram\.pdf$/i, product: 'comprehensive_meditation_program' },
  { match: /LearnToMeditateBookletCopy\/FinalLearnToMeditateSeries\.pdf$/i, product: 'learn_to_meditate_series' },
  { match: /FeelBetterSeriesBookletCopy\/FinalFeelBetterSeries2025Version\.pdf$/i, product: 'feel_better_series' },
];

/** Only ship finished goods: no working files, no source art, no old drafts. */
function isDeliverable(name) {
  if (/\/$/.test(name)) return false;
  if (/OldBooklet|Revisions|\/Susan re-edit\//i.test(name)) return false;
  if (/\.(docx|psd|tif|ini|DS_Store)$/i.test(name)) return false;
  if (/__MACOSX|\.AppleDouble/i.test(name)) return false;
  return /\.(m4a|mp3|pdf)$/i.test(name);
}

function routeFor(name) {
  return ROUTES.find(r => r.match.test(name))?.product ?? null;
}

function objectKey(product, name) {
  const base = path.posix.basename(name);
  const bonus = /\/Bonus\//i.test(name) ? 'bonus/' : '';
  return `${product}/${bonus}${base}`;
}

function openZip(file) {
  return new Promise((resolve, reject) =>
    yauzl.open(file, { lazyEntries: true, autoClose: false }, (err, zip) => (err ? reject(err) : resolve(zip)))
  );
}

function readEntry(zip, entry) {
  return new Promise((resolve, reject) =>
    zip.openReadStream(entry, (err, stream) => (err ? reject(err) : resolve(stream)))
  );
}

async function collect() {
  const zips = fs.readdirSync(FILES_DIR).filter(f => f.toLowerCase().endsWith('.zip'));
  const found = new Map(); // objectKey -> {zip, entryName, size, product}

  for (const zipName of zips) {
    const zip = await openZip(path.join(FILES_DIR, zipName));
    await new Promise((resolve, reject) => {
      zip.on('entry', entry => {
        const name = entry.fileName;
        if (isDeliverable(name)) {
          const product = routeFor(name);
          if (product) {
            const key = objectKey(product, name);
            // Duplicates across zips: keep the first, they are identical.
            if (!found.has(key)) {
              found.set(key, { zip: zipName, entryName: name, size: entry.uncompressedSize, product });
            }
          }
        }
        zip.readEntry();
      });
      zip.on('end', resolve);
      zip.on('error', reject);
      zip.readEntry();
    });
    zip.close();
  }
  return found;
}

async function main() {
  for (const k of ['SPACES_REGION', 'SPACES_BUCKET', 'SPACES_ACCESS_KEY', 'SPACES_SECRET_KEY']) {
    if (!env[k]) { console.error(`${k} is not set in .env`); process.exit(1); }
  }
  const bucket = env.SPACES_BUCKET;
  const endpoint = (env.SPACES_ENDPOINT ?? '').replace(new RegExp(`^(https?://)${bucket}\\.`), '$1');

  const s3 = new S3Client({
    region: env.SPACES_REGION,
    endpoint,
    credentials: { accessKeyId: env.SPACES_ACCESS_KEY, secretAccessKey: env.SPACES_SECRET_KEY },
    requestChecksumCalculation: 'WHEN_REQUIRED',
    responseChecksumValidation: 'WHEN_REQUIRED',
  });

  console.log(`\nBucket   : ${bucket}`);
  console.log(`Endpoint : ${endpoint}`);
  console.log(`Action   : ${APPLY ? 'APPLY (uploading)' : 'DRY RUN'}\n`);

  const found = await collect();
  const byProduct = {};
  let totalBytes = 0;
  for (const [key, meta] of found) {
    (byProduct[meta.product] ??= []).push({ key, ...meta });
    totalBytes += meta.size;
  }

  for (const [product, files] of Object.entries(byProduct)) {
    const bytes = files.reduce((a, f) => a + f.size, 0);
    console.log(`  ${product}: ${files.length} files, ${(bytes / 1e9).toFixed(2)} GB`);
  }
  console.log(`\n  TOTAL: ${found.size} files, ${(totalBytes / 1e9).toFixed(2)} GB\n`);

  if (!APPLY) {
    console.log('Re-run with --apply to upload.\n');
    return;
  }

  // One pass per zip, uploading entries as they stream past. Re-opening the
  // archive per file would mean re-walking a 2GB zip 85 times.
  let uploaded = 0, skipped = 0, failed = 0;
  const wanted = new Map(); // entryName -> {key, size, product}
  for (const [key, meta] of found) wanted.set(meta.entryName, { key, ...meta });

  const zipNames = [...new Set([...found.values()].map(m => m.zip))];

  for (const zipName of zipNames) {
    const zip = await openZip(path.join(FILES_DIR, zipName));
    await new Promise((resolve, reject) => {
      const next = () => zip.readEntry();
      zip.on('entry', entry => {
        const meta = wanted.get(entry.fileName);
        if (!meta || meta.zip !== zipName || meta.done) return next();

        (async () => {
          try {
            try {
              const head = await s3.send(new HeadObjectCommand({ Bucket: bucket, Key: meta.key }));
              if (head.ContentLength === meta.size) { skipped++; meta.done = true; return next(); }
            } catch { /* not uploaded yet */ }

            const stream = await readEntry(zip, entry);
            const contentType = meta.key.endsWith('.pdf') ? 'application/pdf'
              : meta.key.endsWith('.m4a') ? 'audio/mp4'
              : 'application/octet-stream';

            await new Upload({
              client: s3,
              params: { Bucket: bucket, Key: meta.key, Body: stream, ContentType: contentType, ACL: 'private' },
              queueSize: 3,
              partSize: 16 * 1024 * 1024,
            }).done();

            uploaded++;
            meta.done = true;
          } catch (err) {
            failed++;
            console.error(`
  FAILED ${meta.key}: ${err.message}`);
          }
          process.stdout.write(`  uploaded ${uploaded}, skipped ${skipped}, failed ${failed} of ${found.size}   `);
          next();
        })().catch(reject);
      });
      zip.on('end', resolve);
      zip.on('error', reject);
      next();
    });
    zip.close();
  }
  console.log(`

Done. ${uploaded} uploaded, ${skipped} already present, ${failed} failed.
`);
  if (failed) { console.error('Some uploads failed — re-run to retry just those.'); process.exitCode = 1; }

  // Emit the manifest block for lib/downloads.ts.
  console.log('--- paste into lib/downloads.ts ---\n');
  console.log('export const DOWNLOAD_MANIFEST: Record<string, DownloadFile[]> = {');
  for (const p of ['becoming_skillfullyaware_workbook', 'unfinished_business_workbook', 'raising_awareness_workbook', 'power_tools_bundle']) {
    console.log(`  ${p}: [],`);
  }
  for (const [product, files] of Object.entries(byProduct)) {
    console.log(`  ${product}: [`);
    for (const f of files.sort((a, b) => a.key.localeCompare(b.key, undefined, { numeric: true }))) {
      console.log(`    { key: ${JSON.stringify(f.key)}, filename: ${JSON.stringify(path.posix.basename(f.key))} },`);
    }
    console.log('  ],');
  }
  console.log('};');
}

main().catch(err => { console.error('\nFailed:', err.message); process.exit(1); });
