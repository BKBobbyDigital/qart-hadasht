#!/usr/bin/env node
// De-LLM-ify pass: safe mechanical transformations across prose-heavy collections.
// Strategies applied:
//   3. Strip bolded `**Heading.**` mini-heading markers inside reasoning blocks
//   4. Remove formulaic boilerplate closers ("What the position is not claiming",
//      "Confidence is moderate/strong/tentative" + boilerplate continuation)
//   plus: safe word-level substitutions for the worst tic-words
//
// Usage:
//   node scripts/delm.mjs                # dry run, prints stats
//   node scripts/delm.mjs --apply        # write changes
//
// Designed to be conservative: never produces ungrammatical results.
// All substitutions tested against the live corpus before shipping.

import { readFileSync, writeFileSync, readdirSync, statSync } from 'fs';
import { join } from 'path';

const APPLY = process.argv.includes('--apply');

const ROOTS = [
  'src/content/narratives',
  'src/content/editorialTakes',
  'src/content/themes',
  'src/content/openQuestions',
  'src/content/periods',
  'src/content/places',
  'src/content/people',
  'src/content/groups',
  'src/content/institutions',
  'src/content/deities',
  'src/content/claims',
  'src/content/artifacts',
  'src/content/sources',
  'src/content/events',
];

function* walk(dir) {
  for (const entry of readdirSync(dir)) {
    const p = join(dir, entry);
    if (statSync(p).isFile() && (p.endsWith('.md') || p.endsWith('.yaml'))) yield p;
  }
}

// Bolded inline mini-heading pattern: `  **Heading text.** Body text...`
// Strip the asterisks. Keep the bold text as a normal sentence opener.
// Match `**...**` where the bold contains no asterisks and ends with `.?!`.
// Allow newlines inside the bold span (YAML block scalars wrap headings).
// Cap length at 200 chars to avoid eating whole paragraphs.
const BOLD_MINI_HEADING = /\*\*([^*]{3,200}?[.?!])\*\*(\s)/gs;

// "What the position is not claiming" paragraph: starts with that phrase as a
// bolded mini-heading or sentence, runs until the next blank line or YAML key.
// Match both bolded and unbolded forms (in case bold has already been stripped).
const POSITION_NOT_CLAIMING = /\s*(?:\*\*)?What the position is not claiming\.(?:\*\*)?[\s\S]*?(?=\n\s*\n|\n\s+confidence:|\n[a-z_]+:)/g;

// "Confidence is moderate/strong/tentative." sentence + the continuation paragraph
// that follows it inside reasoning bodies. Match conservatively. Only target the
// boilerplate that appears as a free-standing closing sentence inside a reasoning
// or position body (not metadata `confidence: moderate` YAML keys).
const CONFIDENCE_BOILERPLATE = /\n\s*Confidence is (moderate|strong|tentative)\.[\s\S]*?(?=\n\s*\n|\nconfidence:|\n[a-z_]+:)/g;

// Word-level: contexts where these adverbs are pure padding.
// `substantively` is almost always droppable; only keep where it disambiguates
// against `substantially` quantitatively. Same for many `operationally` uses.
const WORD_SUBS = [
  // "X substantively Y" -> "X Y" (delete the empty intensifier)
  [/ substantively /g, ' '],
  // "substantively documented" -> "well documented"
  [/substantively documented/g, 'well documented'],
  [/substantively attested/g, 'well attested'],
  // "operationally significant" -> "significant" (the adverb is empty)
  [/ operationally significant/g, ' significant'],
  [/ operationally coherent/g, ' coherent'],
  // "load-bearing" -> "central" (slightly more direct)
  [/load-bearing/g, 'central'],
  // "Polybian framing" stays; "the framing" as bare noun-phrase variation:
  // leave "framing" alone — too context-dependent.
];

// Run a substitution pass safely on a text body. Skip frontmatter (everything
// before the second `---` line in .md files, and YAML keys generally).
function safeSubstitute(text, filepath) {
  const isMd = filepath.endsWith('.md');
  let body, head;
  if (isMd) {
    const m = text.match(/^---\n[\s\S]*?\n---\n/);
    if (m) {
      head = m[0];
      body = text.slice(m[0].length);
    } else {
      head = '';
      body = text;
    }
  } else {
    // YAML: process the whole file but be careful not to touch keys.
    head = '';
    body = text;
  }

  // Apply transformations to body only.
  let out = body;
  // 1) Remove "What the position is not claiming" paragraph FIRST (before bold
  //    stripping would erase the bold markers we use to identify it).
  out = out.replace(POSITION_NOT_CLAIMING, '');
  // 2) Remove "Confidence is X." boilerplate.
  out = out.replace(CONFIDENCE_BOILERPLATE, '');
  // 3) Strip bolded mini-headings.
  out = out.replace(BOLD_MINI_HEADING, '$1$2');
  // 4) Word-level substitutions.
  for (const [re, sub] of WORD_SUBS) {
    out = out.replace(re, sub);
  }
  // Collapse triple newlines down to double.
  out = out.replace(/\n\n\n+/g, '\n\n');

  return head + out;
}

const stats = {
  filesTouched: 0,
  boldHeadings: 0,
  positionClaimings: 0,
  confidenceBoilerplate: 0,
  wordSubs: {},
};

for (const re of WORD_SUBS.map(([r]) => r)) {
  stats.wordSubs[re.source] = 0;
}

for (const root of ROOTS) {
  for (const f of walk(root)) {
    const text = readFileSync(f, 'utf8');
    const boldCount = (text.match(BOLD_MINI_HEADING) || []).length;
    const posCount = (text.match(POSITION_NOT_CLAIMING) || []).length;
    const confCount = (text.match(CONFIDENCE_BOILERPLATE) || []).length;
    let wordCount = 0;
    for (const [re] of WORD_SUBS) {
      const m = text.match(re);
      if (m) {
        wordCount += m.length;
        stats.wordSubs[re.source] = (stats.wordSubs[re.source] || 0) + m.length;
      }
    }
    const changed = boldCount || posCount || confCount || wordCount;
    if (!changed) continue;
    stats.filesTouched++;
    stats.boldHeadings += boldCount;
    stats.positionClaimings += posCount;
    stats.confidenceBoilerplate += confCount;

    if (APPLY) {
      const out = safeSubstitute(text, f);
      writeFileSync(f, out, 'utf8');
    }
  }
}

console.log(`Files affected:      ${stats.filesTouched}`);
console.log(`Bold mini-headings:  ${stats.boldHeadings}`);
console.log(`Position-not-claim:  ${stats.positionClaimings}`);
console.log(`Confidence boilerplate: ${stats.confidenceBoilerplate}`);
console.log(`Word substitutions:`);
for (const [pat, n] of Object.entries(stats.wordSubs)) {
  console.log(`  ${pat}: ${n}`);
}
console.log(APPLY ? '\nApplied.' : '\nDry run. Pass --apply to write.');
