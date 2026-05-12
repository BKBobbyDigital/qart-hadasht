#!/usr/bin/env node
// Rank prose-heavy content files by AI-tic density.
import { readFileSync, readdirSync, statSync } from 'fs';
import { join } from 'path';

const ROOTS = [
  'src/content/narratives',
  'src/content/editorialTakes',
  'src/content/themes',
  'src/content/openQuestions',
  'src/content/periods',
];

const TIC_RE = /\b(structural|substantively|substantive|operationally|operational|load-bearing|framing|configuration|calibrat\w*)\b/gi;

function* walk(dir) {
  for (const entry of readdirSync(dir)) {
    const p = join(dir, entry);
    if (statSync(p).isFile() && (p.endsWith('.md') || p.endsWith('.yaml'))) yield p;
  }
}

const rows = [];
for (const root of ROOTS) {
  for (const f of walk(root)) {
    const text = readFileSync(f, 'utf8');
    const words = text.split(/\s+/).filter(Boolean).length;
    if (words < 200) continue;
    const tics = (text.match(TIC_RE) || []).length;
    const per1k = (tics * 1000) / words;
    rows.push({ f, words, tics, per1k });
  }
}

rows.sort((a, b) => b.per1k - a.per1k);
console.log('per_1k_words  tic_count  word_count  file');
for (const r of rows.slice(0, 30)) {
  console.log(
    `${r.per1k.toFixed(1).padStart(6)}        ${String(r.tics).padStart(4)}       ${String(r.words).padStart(5)}       ${r.f}`
  );
}
console.log(`\nTotal files scanned: ${rows.length}`);
console.log(`Total tic instances: ${rows.reduce((s, r) => s + r.tics, 0)}`);
console.log(`Total words: ${rows.reduce((s, r) => s + r.words, 0)}`);
