// Fetch a Wikimedia Commons image and its metadata for use in a place
// entry. Downloads the image at ~1200px width to public/places/<slug>.jpg
// and prints the YAML image block to stdout for paste-in.
//
// Usage:
//   node scripts/fetch-place-image.mjs <slug> "File:Title On Commons.jpg"
//
// Example:
//   node scripts/fetch-place-image.mjs kerkouane "File:20231210 012 Kerkouane.jpg"

import { writeFileSync } from 'node:fs';
import { join } from 'node:path';

const slug = process.argv[2];
const fileTitle = process.argv[3];

if (!slug || !fileTitle) {
  console.error('Usage: node fetch-place-image.mjs <slug> "File:Title.jpg"');
  process.exit(1);
}

const UA = 'qart-hadasht-encyclopedia/1.0 (https://qart-hadasht.org)';
const apiUrl = new URL('https://commons.wikimedia.org/w/api.php');
apiUrl.searchParams.set('action', 'query');
apiUrl.searchParams.set('format', 'json');
apiUrl.searchParams.set('prop', 'imageinfo');
apiUrl.searchParams.set('titles', fileTitle);
apiUrl.searchParams.set('iiprop', 'url|extmetadata|user|mime');
apiUrl.searchParams.set('iiurlwidth', '1400');

const res = await fetch(apiUrl, { headers: { 'User-Agent': UA } });
const json = await res.json();

const pages = json.query?.pages ?? {};
const page = Object.values(pages)[0];
if (!page || page.missing !== undefined) {
  console.error(`File not found on Commons: ${fileTitle}`);
  process.exit(2);
}
const ii = page.imageinfo?.[0];
if (!ii) {
  console.error('No imageinfo returned');
  process.exit(2);
}

const imageUrl = ii.thumburl || ii.url;
const meta = ii.extmetadata ?? {};

// Extract usable attribution. Wikimedia returns HTML in some fields;
// strip tags for the human-readable credit.
function stripHtml(s) {
  if (!s) return '';
  return s.replace(/<[^>]+>/g, '').replace(/&amp;/g, '&').replace(/&nbsp;/g, ' ').trim();
}
const artist = stripHtml(meta.Artist?.value);
const credit = stripHtml(meta.Credit?.value);
const license = stripHtml(meta.LicenseShortName?.value) || stripHtml(meta.UsageTerms?.value);
const description = stripHtml(meta.ImageDescription?.value);
const commonsPageUrl = `https://commons.wikimedia.org/wiki/${encodeURIComponent(fileTitle.replace(/ /g, '_'))}`;

// Compose attribution string.
let creditStr = '';
if (artist) creditStr = `Photograph: ${artist}`;
else if (credit) creditStr = credit;
else creditStr = 'Wikimedia Commons';
creditStr += `, via Wikimedia Commons`;

// Map common license labels to short forms.
const licenseShort = (() => {
  const L = license.toLowerCase();
  if (L.includes('public domain') || L.includes('pd-')) return 'Public domain';
  if (L.includes('cc0')) return 'CC0 (Public Domain Dedication)';
  if (L.includes('cc-by-sa') || L.includes('cc by-sa')) {
    const m = license.match(/[0-9]\.[0-9]/);
    return `CC BY-SA ${m ? m[0] : ''}`.trim();
  }
  if (L.includes('cc-by') || L.includes('cc by')) {
    const m = license.match(/[0-9]\.[0-9]/);
    return `CC BY ${m ? m[0] : ''}`.trim();
  }
  return license || 'See Commons page for license';
})();

// Download the image.
const imgRes = await fetch(imageUrl, { headers: { 'User-Agent': UA } });
if (!imgRes.ok) {
  console.error(`Failed to download image: HTTP ${imgRes.status}`);
  process.exit(3);
}
const buf = Buffer.from(await imgRes.arrayBuffer());
const ext = (ii.mime || '').includes('png') ? 'png' : 'jpg';
const localPath = join('/Users/bet/Claude/carthage/public/places', `${slug}.${ext}`);
writeFileSync(localPath, buf);

// Print result + ready-to-paste YAML block.
console.log(`\nDownloaded ${(buf.length / 1024).toFixed(0)} KB to public/places/${slug}.${ext}`);
console.log(`License: ${licenseShort}`);
console.log(`Description snippet: ${description.slice(0, 200)}`);
console.log(`\n--- YAML block ---`);
console.log(`image:`);
console.log(`  src: /places/${slug}.${ext}`);
console.log(`  alt: ${JSON.stringify('TODO write a descriptive alt — current Commons description: ' + description.slice(0, 200))}`);
console.log(`  credit: ${JSON.stringify(creditStr)}`);
console.log(`  credit_url: ${commonsPageUrl}`);
console.log(`  license: ${licenseShort}`);
