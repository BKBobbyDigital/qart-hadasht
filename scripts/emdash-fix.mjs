// Em-dash fix script for qart-hadasht.
//
// House-style rule: em dashes are right for (a) sharp mid-sentence
// interruption with strong rhetorical weight, or (b) list-in-apposition
// where the items themselves contain commas. They are wrong for routine
// parentheticals (use commas or parens), list expansions (use colon),
// or sentence breaks where a period would do.
//
// This script targets the single highest-confidence wrongful use: paired
// em dashes around a parenthetical phrase. The pattern "X — phrase — Y"
// where the bracketed text functions parenthetically is the most common
// overuse and the easiest to fix safely.
//
// Conversion rule:
//   - If the parenthetical phrase contains no commas:
//       "X — phrase — Y" → "X, phrase, Y"
//   - If the parenthetical phrase contains commas (so parens are
//     clearer than nested commas):
//       "X — phrase, with commas — Y" → "X (phrase, with commas) Y"
//
// Single em dashes are left alone — they might be the legitimate
// rhetorical-weight use.
//
// Run with --dry to preview; --apply to write changes.

import { readdirSync, readFileSync, writeFileSync, statSync } from 'node:fs';
import { join, relative } from 'node:path';

const ROOT = '/Users/bet/Claude/carthage/src/content';
const dry = !process.argv.includes('--apply');

function walk(dir, pred, out = []) {
  for (const name of readdirSync(dir)) {
    const full = join(dir, name);
    const s = statSync(full);
    if (s.isDirectory()) walk(full, pred, out);
    else if (pred(name)) out.push(full);
  }
  return out;
}

const files = walk(ROOT, (n) => n.endsWith('.md') || n.endsWith('.yaml'));

// Match a paired em-dash construction. Pattern: "X — phrase — Y" where
// <phrase>:
//   - is non-empty
//   - contains no other em dash (so we don't bridge across uses)
//   - contains no sentence boundary (no ". " — period followed by
//     whitespace — which would indicate the match has crossed sentences
//     and is bridging two unrelated em-dash uses)
//   - contains no blank line (so we stay within one paragraph)
//   - is at most ~180 characters (longer is suspicious for a single
//     parenthetical; CLAUDE.md typical parentheticals are short)
//
// Newlines within the phrase are allowed since YAML wraps long
// summary fields. The leading and trailing context characters are
// captured so we can decide whether commas or parens are right.

// lead and trail required to be non-whitespace so we never consume YAML
// line-indent whitespace into the captured context. The boundary
// whitespace around each em-dash is \s+ (allows single space, newline+
// indent, or any wrap pattern). Phrase boundaries are also trimmed in
// the substitution function for safety.
const PAIRED_RE = /([^—\n\s])\s+—\s+((?:(?!\n\n|—|\.\s|\?\s|!\s)[\s\S]){1,180}?)\s+—\s+([^—\n\s])/g;

// Special case: a sentence-final paired em dash before a clause-ending
// period — "X — phrase — ." doesn't exist, but "X — phrase — \." does
// (where \ is end of line or paragraph). We handle that via the
// general regex; the trailing context just becomes whatever follows.

let totalReplacements = 0;
const fileReplacements = [];

for (const f of files) {
  const raw = readFileSync(f, 'utf8');
  let modified = raw;
  let count = 0;

  modified = modified.replace(PAIRED_RE, (match, lead, phrase, trail) => {
    // Defensive: trim any whitespace at the phrase boundaries (the
    // non-greedy match across YAML line wraps can include leading or
    // trailing whitespace fragments).
    const cleanPhrase = phrase.trim();
    if (!cleanPhrase) return match;
    count++;

    // Detect whether the phrase has commas that are NOT already
    // bounded by parentheses. If all the phrase's commas are inside
    // inner parens, the outer choice can be commas (cleaner than
    // nested parens). If there are unbracketed commas, use parens
    // for the outer.
    let depth = 0;
    let hasUnbracketedComma = false;
    for (const ch of cleanPhrase) {
      if (ch === '(') depth++;
      else if (ch === ')') depth--;
      else if (ch === ',' && depth === 0) {
        hasUnbracketedComma = true;
        break;
      }
    }

    if (hasUnbracketedComma) {
      // "X (phrase) Y" — if trail is punctuation, no space after )
      if (/[.,;:]/.test(trail)) return `${lead} (${cleanPhrase})${trail}`;
      return `${lead} (${cleanPhrase}) ${trail}`;
    }
    // "X, phrase, Y" — handle trailing punctuation.
    if (/[.,;:]/.test(trail)) return `${lead}, ${cleanPhrase}${trail}`;
    return `${lead}, ${cleanPhrase}, ${trail}`;
  });

  if (count > 0) {
    fileReplacements.push({ file: relative(ROOT, f), count });
    totalReplacements += count;
    if (!dry) {
      writeFileSync(f, modified);
    }
  }
}

console.log(`\n=== Em-dash paired-parenthetical fix ===`);
console.log(`Mode: ${dry ? 'DRY RUN (no files modified)' : 'APPLY (files written)'}`);
console.log(`Files scanned: ${files.length}`);
console.log(`Files with replacements: ${fileReplacements.length}`);
console.log(`Total replacements: ${totalReplacements}\n`);

fileReplacements.sort((a, b) => b.count - a.count);
for (const f of fileReplacements.slice(0, 30)) {
  console.log(`  ${f.count.toString().padStart(3)} × ${f.file}`);
}
if (fileReplacements.length > 30) {
  console.log(`  ... and ${fileReplacements.length - 30} more files`);
}

if (dry) {
  console.log(`\nRe-run with --apply to write changes.`);
}
