// Accessibility + performance static audit for qart-hadasht.
//
// Crawls dist/ and checks each HTML page for common a11y violations
// and surface-level performance metrics. Sums findings into a per-
// issue rollup so the worst categories get prioritized.

import { readdirSync, readFileSync, statSync } from 'node:fs';
import { join, relative } from 'node:path';

const DIST = '/Users/bet/Claude/carthage/dist';

function walk(dir, out = []) {
  for (const name of readdirSync(dir)) {
    const full = join(dir, name);
    const s = statSync(full);
    if (s.isDirectory()) walk(full, out);
    else if (name.endsWith('.html')) out.push(full);
  }
  return out;
}

const files = walk(DIST).filter((f) => {
  // Skip Netlify's auto-generated forms-detection stub at the dist
  // root — it's a Netlify infrastructure file, not a user-facing page,
  // and intentionally lacks standard page elements.
  return !f.endsWith('/__forms.html');
});
const findings = {}; // category → array of { file, detail }
function add(category, file, detail) {
  if (!findings[category]) findings[category] = [];
  findings[category].push({ file: relative(DIST, file), detail });
}

// --- Per-page sizes ---
const sizes = [];

for (const f of files) {
  const raw = readFileSync(f, 'utf8');
  // Strip HTML comments so we don't false-positive on tag literals quoted
  // in code-explanation comments (e.g. "<!-- the <h1> here -->").
  const html = raw.replace(/<!--[\s\S]*?-->/g, '');
  sizes.push({ file: relative(DIST, f), bytes: Buffer.byteLength(raw, 'utf8') });

  // 1. <img> without alt attribute (or with empty alt only if intentional —
  //    we flag empty alt too, since decorative images are rare here).
  const imgRe = /<img\b([^>]*)>/gi;
  let m;
  while ((m = imgRe.exec(html)) !== null) {
    const attrs = m[1];
    if (!/\balt\s*=/i.test(attrs)) {
      add('img-missing-alt', f, m[0].slice(0, 120));
    }
    // Empty alt (alt="") is the correct accessibility pattern for
    // decorative images and for images inside a link/widget that has
    // its own text label — so we don't flag those. Missing alt entirely
    // is the genuine accessibility issue.
  }

  // 2. <a> tags without accessible text. Includes empty anchors, anchors
  //    with only whitespace, anchors whose entire content is <img> without
  //    alt. We don't flag links with text content because that's accessible.
  const aRe = /<a\b([^>]*?)>([\s\S]*?)<\/a>/gi;
  while ((m = aRe.exec(html)) !== null) {
    const attrs = m[1];
    const inner = m[2];
    const hasAriaLabel = /\baria-label\s*=\s*["'][^"']+["']/i.test(attrs);
    const hasText = inner.replace(/<[^>]+>/g, '').trim().length > 0;
    if (!hasText && !hasAriaLabel) {
      add('a-no-accessible-text', f, m[0].slice(0, 120));
    }
  }

  // 3. <button> without accessible text.
  const btnRe = /<button\b([^>]*?)>([\s\S]*?)<\/button>/gi;
  while ((m = btnRe.exec(html)) !== null) {
    const attrs = m[1];
    const inner = m[2];
    const hasAriaLabel = /\baria-label\s*=\s*["'][^"']+["']/i.test(attrs);
    const hasText = inner.replace(/<[^>]+>/g, '').trim().length > 0;
    if (!hasText && !hasAriaLabel) {
      add('button-no-accessible-text', f, m[0].slice(0, 120));
    }
  }

  // 4. Multiple <h1> per page.
  const h1Matches = html.match(/<h1\b/gi) || [];
  if (h1Matches.length > 1) {
    add('multiple-h1', f, `${h1Matches.length} h1 elements`);
  } else if (h1Matches.length === 0) {
    add('missing-h1', f, '0 h1 elements');
  }

  // 5. Heading hierarchy skips. Build the heading sequence in the document
  //    order. Flag when level jumps by more than +1 (e.g. h2 → h4).
  const headingSeq = [];
  const hRe = /<h([1-6])\b/gi;
  while ((m = hRe.exec(html)) !== null) headingSeq.push(parseInt(m[1], 10));
  for (let i = 1; i < headingSeq.length; i++) {
    if (headingSeq[i] - headingSeq[i - 1] > 1) {
      add('heading-skip', f, `h${headingSeq[i - 1]} → h${headingSeq[i]}`);
      break; // one report per file
    }
  }

  // 6. Lang attribute on <html>.
  if (!/<html[^>]+\blang\s*=/i.test(html)) {
    add('html-missing-lang', f, '');
  }

  // 7. <title> element.
  if (!/<title>[^<]+<\/title>/i.test(html)) {
    add('missing-title', f, '');
  }

  // 8. Viewport meta.
  if (!/<meta\s+name=["']viewport["']/i.test(html)) {
    add('missing-viewport', f, '');
  }

  // 9. Skip-to-main-content link.
  if (!/skip[-\s]?to[-\s]?(main|content)/i.test(html) && !/class\s*=\s*["'][^"']*skip[-_]?link/i.test(html)) {
    add('missing-skip-link', f, '');
  }

  // 10. <main> landmark.
  if (!/<main\b/i.test(html)) {
    add('missing-main-landmark', f, '');
  }

  // 11. Inline event handlers (onclick=, onmouseover=, etc) — accessibility
  //     red flag because keyboard users can't trigger them.
  if (/\son(click|mouseover|mouseenter|mouseleave|focus|blur)\s*=/i.test(html)) {
    add('inline-event-handler', f, '');
  }
}

// --- Report ---
console.log(`\n=== Accessibility audit ===`);
console.log(`Pages scanned: ${files.length}`);
console.log(`Categories with findings:\n`);

const sorted = Object.entries(findings).sort((a, b) => b[1].length - a[1].length);
for (const [cat, items] of sorted) {
  console.log(`  ${cat}: ${items.length} occurrence${items.length === 1 ? '' : 's'}`);
  // Show up to 3 sample affected files
  const uniqueFiles = Array.from(new Set(items.map((i) => i.file)));
  for (const f of uniqueFiles.slice(0, 3)) console.log(`    - ${f}`);
  if (uniqueFiles.length > 3) console.log(`    ... and ${uniqueFiles.length - 3} more files`);
  if (items[0].detail) {
    console.log(`    sample: ${items[0].detail.slice(0, 100)}`);
  }
  console.log('');
}

// --- Performance: largest pages and overall stats ---
console.log(`=== Performance signals ===`);
const totalBytes = sizes.reduce((a, b) => a + b.bytes, 0);
const avg = totalBytes / sizes.length;
console.log(`Total HTML output: ${(totalBytes / 1024 / 1024).toFixed(2)} MB across ${sizes.length} pages`);
console.log(`Average page HTML weight: ${(avg / 1024).toFixed(1)} KB`);
sizes.sort((a, b) => b.bytes - a.bytes);
console.log(`\nTop 10 heaviest pages (HTML only — no inline image sizes):`);
for (const s of sizes.slice(0, 10)) {
  console.log(`  ${(s.bytes / 1024).toFixed(1).padStart(7)} KB  ${s.file}`);
}

// --- Static asset weight (images, JS, CSS in dist) ---
function walkAll(dir, out = []) {
  for (const name of readdirSync(dir)) {
    const full = join(dir, name);
    const s = statSync(full);
    if (s.isDirectory()) walkAll(full, out);
    else out.push({ path: full, size: s.size });
  }
  return out;
}
const allAssets = walkAll(DIST);
const byKind = {};
for (const a of allAssets) {
  const ext = a.path.split('.').pop()?.toLowerCase() ?? '';
  byKind[ext] = (byKind[ext] || 0) + a.size;
}
console.log(`\nAsset weight by file extension:`);
const sortedKinds = Object.entries(byKind).sort((a, b) => b[1] - a[1]);
for (const [ext, total] of sortedKinds.slice(0, 8)) {
  console.log(`  ${ext.padEnd(8)} ${(total / 1024 / 1024).toFixed(2)} MB`);
}
