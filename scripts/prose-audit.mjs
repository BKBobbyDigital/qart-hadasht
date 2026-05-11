// Prose-quality audit for qart-hadasht long-form content
//
// Scans markdown bodies of narratives/themes/periods and the substantive
// `summary:` fields of data-collection YAML entries. Reports:
//
//   1. Em-dash density violations — house style: at most ~1 em dash per
//      250 words. Flag anything substantially above.
//   2. Version self-references — "V1", "this version of the
//      encyclopedia", "first version", "out of scope for the first
//      version", etc.
//   3. Common quality red flags — repeated adjacent words, common
//      typos, doubled spaces.
//
// Output is grouped by file, sorted by total flags. The principal use:
// run before a proofread pass to focus attention on the worst offenders.

import { readdirSync, readFileSync, statSync } from 'node:fs';
import { join, relative } from 'node:path';

const ROOT = '/Users/bet/Claude/carthage/src/content';

// Walk a directory and collect every file matching a predicate.
function walk(dir, pred, out = []) {
  for (const name of readdirSync(dir)) {
    const full = join(dir, name);
    const s = statSync(full);
    if (s.isDirectory()) walk(full, pred, out);
    else if (pred(name)) out.push(full);
  }
  return out;
}

// Extract long-form prose from a file.
// For .md: everything after the second `---` (frontmatter end).
// For .yaml: any value of a top-level multi-line scalar (`summary: >`,
// `summary: |`, `etymology: >`, `position:`, `reasoning:`, etc.).
function extractProse(filePath) {
  const raw = readFileSync(filePath, 'utf8');
  if (filePath.endsWith('.md')) {
    // Strip YAML frontmatter between two `---` lines.
    const m = raw.match(/^---\n[\s\S]*?\n---\n([\s\S]*)$/);
    return m ? m[1] : raw;
  }
  if (filePath.endsWith('.yaml')) {
    // Crude extraction: pull every multi-line scalar value. A line that
    // matches /^(\s*\w+):\s*[>|]\s*$/ opens a block; subsequent more-
    // indented lines are body until indentation returns to the opener's
    // column or less.
    const lines = raw.split('\n');
    const blocks = [];
    let i = 0;
    while (i < lines.length) {
      const m = lines[i].match(/^(\s*)([\w_]+):\s*[>|][+-]?\s*$/);
      if (m) {
        const openIndent = m[1].length;
        i++;
        const block = [];
        while (
          i < lines.length &&
          (lines[i].trim() === '' || (lines[i].match(/^(\s*)/)[1].length > openIndent))
        ) {
          block.push(lines[i]);
          i++;
        }
        if (block.length) blocks.push(block.join('\n'));
      } else {
        i++;
      }
    }
    return blocks.join('\n\n');
  }
  return '';
}

function wordCount(text) {
  return (text.match(/\b[\w'-]+\b/g) ?? []).length;
}

function countEmDashes(text) {
  return (text.match(/—/g) ?? []).length;
}

const VERSION_SELF_REF_RE = /(\bv1\b|\bV1\b|\bversion 1\b|first version|this version of the (?:site|encyclopedia)|V1's? scope|V1's? frame|out of scope for the first version)/g;

function findVersionSelfRefs(text) {
  const hits = [];
  let m;
  while ((m = VERSION_SELF_REF_RE.exec(text)) !== null) {
    // Skip false positives — "Aubet (2nd ed. 2001)" etc.
    hits.push({ index: m.index, match: m[0] });
  }
  return hits;
}

// Doubled adjacent identical words (the the, a a) — case-insensitive,
// ignoring short connective words that can legitimately repeat (e.g.
// "had had", "that that").
const DOUBLE_WORD_RE = /\b([A-Za-z]{4,})\s+\1\b/gi;
function findDoubledWords(text) {
  const hits = [];
  let m;
  while ((m = DOUBLE_WORD_RE.exec(text)) !== null) {
    hits.push({ index: m.index, match: m[0] });
  }
  return hits;
}

// Repeated phrases — same 5+ word sequence appearing twice in close
// proximity (within ~500 chars). Catches accidentally-doubled
// sentences from copy-paste drift.
function findRepeatedPhrases(text) {
  const hits = [];
  const lower = text.toLowerCase();
  // Match runs of 5+ words
  const re = /\b(\w+(?:\s+\w+){4,})\b/g;
  let m;
  while ((m = re.exec(lower)) !== null) {
    const phrase = m[1];
    if (phrase.length < 30) continue;
    const after = lower.slice(m.index + phrase.length, m.index + phrase.length + 500);
    if (after.includes(phrase)) {
      hits.push({ index: m.index, match: phrase.slice(0, 80) + (phrase.length > 80 ? '...' : '') });
      re.lastIndex = m.index + phrase.length; // skip ahead
    }
  }
  return hits;
}

// Collect files
const mdFiles = [
  ...walk(join(ROOT, 'narratives'), (n) => n.endsWith('.md')),
  ...walk(join(ROOT, 'themes'), (n) => n.endsWith('.md')),
  ...walk(join(ROOT, 'periods'), (n) => n.endsWith('.md')),
];
const yamlFiles = walk(ROOT, (n) => n.endsWith('.yaml'));

const allFiles = [...mdFiles, ...yamlFiles];

const reports = [];

for (const f of allFiles) {
  const text = extractProse(f);
  if (!text || text.length < 200) continue; // skip stubs and short summaries
  const wc = wordCount(text);
  const em = countEmDashes(text);
  const emPer250 = wc > 0 ? (em * 250) / wc : 0;
  const versionRefs = findVersionSelfRefs(text);
  const doubled = findDoubledWords(text);
  const repeated = findRepeatedPhrases(text);

  const flags = [];
  // House style: at most ~1 em dash per 250 words. Flag at >1.5 (50%
  // over the soft limit) so we surface only genuine overuse, not minor
  // creep.
  if (emPer250 > 1.5) flags.push({ kind: 'em-dash-density', detail: `${em} em dashes / ${wc} words = ${emPer250.toFixed(2)} per 250` });
  if (versionRefs.length) flags.push({ kind: 'version-self-ref', detail: versionRefs.map((r) => r.match).join(', ') });
  if (doubled.length) flags.push({ kind: 'doubled-words', detail: doubled.map((r) => r.match).join('; ') });
  if (repeated.length) flags.push({ kind: 'repeated-phrase', detail: repeated.map((r) => r.match).slice(0, 3).join(' | ') });

  if (flags.length) {
    reports.push({
      file: relative(ROOT, f),
      wc,
      em,
      emPer250,
      flags,
    });
  }
}

// Sort by total flag severity. em-dash density gets weighted by the
// excess over the threshold; version-self-ref is always high priority.
function severity(r) {
  let s = 0;
  for (const f of r.flags) {
    if (f.kind === 'em-dash-density') s += Math.max(0, r.emPer250 - 1) * 10;
    if (f.kind === 'version-self-ref') s += 50;
    if (f.kind === 'doubled-words') s += 5;
    if (f.kind === 'repeated-phrase') s += 8;
  }
  return s;
}

reports.sort((a, b) => severity(b) - severity(a));

console.log(`\n=== Prose audit ===`);
console.log(`Scanned: ${allFiles.length} files (${mdFiles.length} md + ${yamlFiles.length} yaml)`);
console.log(`Files with flags: ${reports.length}\n`);

// Summary counts by flag kind
const counts = {};
for (const r of reports) {
  for (const f of r.flags) counts[f.kind] = (counts[f.kind] ?? 0) + 1;
}
console.log('Flag-kind counts:');
for (const [k, v] of Object.entries(counts).sort((a, b) => b[1] - a[1])) {
  console.log(`  ${k}: ${v}`);
}
console.log('');

// Top 40 by severity
console.log('Top flagged files (by severity):\n');
for (const r of reports.slice(0, 40)) {
  console.log(`  ${r.file}  (${r.wc} words, ${r.em} em dashes = ${r.emPer250.toFixed(2)}/250)`);
  for (const f of r.flags) {
    const d = f.detail.length > 120 ? f.detail.slice(0, 120) + '...' : f.detail;
    console.log(`    [${f.kind}] ${d}`);
  }
}

if (reports.length > 40) {
  console.log(`\n... and ${reports.length - 40} more flagged files (severity descending)`);
}
