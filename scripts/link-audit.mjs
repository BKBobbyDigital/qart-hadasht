// Internal-link health audit for qart-hadasht
// Crawls the built dist/, extracts every internal <a href>, and reports
// links pointing to nonexistent pages.

import { readdirSync, readFileSync, statSync, existsSync } from 'node:fs';
import { join, relative } from 'node:path';

const DIST = '/Users/bet/Claude/carthage/dist';

// Walk dist/ and collect all .html files.
function walk(dir, out = []) {
  for (const name of readdirSync(dir)) {
    const full = join(dir, name);
    const s = statSync(full);
    if (s.isDirectory()) walk(full, out);
    else if (name.endsWith('.html')) out.push(full);
  }
  return out;
}

const htmlFiles = walk(DIST);

// Build the set of valid in-site paths. Astro outputs each route as
// either dist/<route>/index.html or dist/<route>.html. We normalize
// both to a leading-slash route with no trailing slash, plus the
// route with trailing slash, plus the root /.
const validPaths = new Set(['/', '']);
for (const f of htmlFiles) {
  const rel = '/' + relative(DIST, f).replace(/\\/g, '/');
  if (rel.endsWith('/index.html')) {
    const route = rel.slice(0, -'/index.html'.length) || '/';
    validPaths.add(route);
    validPaths.add(route + '/');
  } else if (rel.endsWith('.html')) {
    const route = rel.slice(0, -'.html'.length);
    validPaths.add(route);
    validPaths.add(route + '/');
  }
}

// Also accept any path that maps to a file in dist (static assets,
// favicon, robots.txt, etc.) — collect filenames.
function walkAll(dir, out = []) {
  for (const name of readdirSync(dir)) {
    const full = join(dir, name);
    const s = statSync(full);
    if (s.isDirectory()) walkAll(full, out);
    else out.push('/' + relative(DIST, full).replace(/\\/g, '/'));
  }
  return out;
}
const allFiles = new Set(walkAll(DIST));

// Extract <a href="..."> from each HTML file. We only care about
// internal hrefs (start with / and don't start with //).
const HREF_RE = /<a\b[^>]*\shref="([^"]+)"/g;

const broken = []; // {sourcePage, href, hrefStripped}

for (const f of htmlFiles) {
  const sourcePage = '/' + relative(DIST, f).replace(/\\/g, '/').replace(/\/index\.html$/, '').replace(/\.html$/, '');
  const html = readFileSync(f, 'utf8');
  let m;
  while ((m = HREF_RE.exec(html)) !== null) {
    const href = m[1];
    // Skip external, mailto, tel, hash-only, and javascript hrefs.
    if (
      !href.startsWith('/') ||
      href.startsWith('//') ||
      href.startsWith('mailto:') ||
      href.startsWith('tel:') ||
      href.startsWith('#') ||
      href.startsWith('javascript:')
    ) continue;
    // Strip hash and query for resolution.
    const hashIdx = href.indexOf('#');
    const queryIdx = href.indexOf('?');
    let stripped = href;
    const trimAt = [hashIdx, queryIdx].filter((i) => i >= 0);
    if (trimAt.length) stripped = href.slice(0, Math.min(...trimAt));
    // Normalize trailing slash variants.
    const candidates = [
      stripped,
      stripped.endsWith('/') ? stripped.slice(0, -1) : stripped + '/',
    ];
    if (
      candidates.some((c) => validPaths.has(c) || allFiles.has(c))
    ) continue;
    broken.push({ sourcePage: sourcePage || '/', href, stripped });
  }
}

// Group broken links by target.
const byTarget = new Map();
for (const b of broken) {
  const key = b.stripped;
  if (!byTarget.has(key)) byTarget.set(key, []);
  byTarget.get(key).push(b.sourcePage);
}

const sortedTargets = [...byTarget.entries()].sort((a, b) => b[1].length - a[1].length);

console.log(`\n=== Internal link audit ===`);
console.log(`Scanned: ${htmlFiles.length} HTML pages`);
console.log(`Total broken internal links found: ${broken.length}`);
console.log(`Unique broken targets: ${byTarget.size}\n`);

if (byTarget.size > 0) {
  console.log('Broken targets (sorted by reference count):\n');
  for (const [target, sources] of sortedTargets) {
    console.log(`  ${target}  (${sources.length} reference${sources.length === 1 ? '' : 's'})`);
    const unique = [...new Set(sources)];
    for (const s of unique.slice(0, 5)) {
      console.log(`    ← ${s}`);
    }
    if (unique.length > 5) console.log(`    ... and ${unique.length - 5} more`);
  }
}
