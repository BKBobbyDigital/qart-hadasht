// Evidence audit for qart-hadasht content
//
// Built from the second-read audits of Sep 2026, which kept finding the
// same kinds of fault. Two passes:
//
//   1. REGRESSIONS (gate). Wordings of factual errors that have already
//      been corrected somewhere on the site. Every hit is a real error
//      coming back, so the target is zero and the script exits 1 on any
//      hit. When you correct a fact, add its wrong wording here.
//
//   2. REVIEW (report only). Language that overstates what the evidence
//      supports: unsourced consensus, universals, design read back from
//      outcome; plus modern-scholarship citations on claims with no page
//      reference, and `held_by` fields that name scholars. None of these
//      is automatically wrong. They are the places to look first.
//
// Usage:
//   node scripts/evidence-audit.mjs              summary
//   node scripts/evidence-audit.mjs --list TERM  every hit for one review term
//   node scripts/evidence-audit.mjs --all        every hit for every term

import { readdirSync, readFileSync, statSync } from 'node:fs';
import { join, relative } from 'node:path';
import YAML from 'yaml';

const REPO = '/Users/bet/Claude/carthage';
const SCAN = ['src/content', 'src/data', 'src/pages'];

// Each regression: the wrong wording, what is right, and where it was fixed.
const REGRESSIONS = [
  {
    id: 'italy-seventeen-years',
    re: /seventeen years (in|of (the )?(war in|campaigning in|fighting in)) Italy|Italy for seventeen years|seventeen years? (of|in) the Italian/i,
    right: 'Hannibal was in Italy fifteen years (218–203); the whole war was seventeen.',
    fixed: 'f319694',
  },
  {
    id: 'mercenary-war-dates',
    re: /(240 ?[–-] ?23[78]|241 ?[–-] ?238)[^.]{0,40}Mercenary|Mercenary War[^.]{0,40}(240 ?[–-] ?23[78]|241 ?[–-] ?238)/,
    right: 'Site convention for the Mercenary War is 241–237.',
    fixed: 'evidence-audit commit',
  },
  {
    id: 'judges-law-consecutive',
    re: /(requir|mandat|compel)\w*[^.]{0,60}consecutive/i,
    right: 'Livy 33.46.6: the law barred serving two consecutive years.',
    fixed: 'cc2d26f',
  },
  {
    id: 'indemnity-paid-early',
    re: /ahead of schedule|(paid|repaid|cleared|discharged) (off )?(the )?(\w+ )?(indemnity )?early/i,
    right: 'Livy 36.4 (191): Carthage offered early payment; Rome refused it.',
    fixed: 'cc2d26f',
  },
  {
    id: 'indemnity-from-iberian-silver',
    re: /indemnit[^.]{0,80}(from|with|out of) (the )?Iberian silver|Iberian silver[^.]{0,60}(paid|financed|funded|covered) (the )?(\w+ )?indemnit/i,
    right: 'Iberia was lost in 206; the 190s indemnity came from African revenues.',
    fixed: '2484a1d, cc2d26f',
  },
  {
    id: 'tophet-holladay',
    re: /Holladay/,
    right: 'Smith et al. 2011 authors: Smith, Avishai, Greene, Stager. No Holladay.',
    fixed: 'e5796c5, 8dc7d38',
  },
  {
    id: 'tophet-age-cohort',
    re: /1[–-]3[ -]year/,
    right: 'Smith et al. 2011: ages peak at 1–1.5 months.',
    fixed: '8dc7d38',
  },
  {
    id: 'masinissa-every-ruling',
    re: /every (arbitration|ruling|Roman (ruling|decision|commission))/i,
    right: 'The arbitration record is mixed and partly unrecorded (Livy 34.62; Polybius 31.21; Appian 68–69).',
    fixed: '9f2ab97',
  },
  {
    id: 'ebro-in-greek',
    re: /negotiated in Greek/i,
    right: 'No source says what language the Ebro agreement was negotiated in.',
    fixed: 'f400aa0',
  },
  {
    id: 'demeter-imported-priests',
    re: /(Sicilian|imported)[- ]Greek priest|imported[^.]{0,40}priest(ess)?/i,
    right: 'Diodorus 14.77: leading Carthaginian citizens as priests, resident Greeks assisting.',
    fixed: '8ec7af6',
  },
  {
    id: 'polybius-vinegar',
    re: /Polybius(?![^.]{0,80}\bno (fire|vinegar))[^.]{0,80}vinegar/,
    right: 'Polybius 3.55 has a path cut along the cliff; the vinegar is Livy 21.37 only.',
    fixed: 'd517de4',
  },
  {
    id: 'hannibal-never-stormed-city',
    re: /never (took|captured|stormed) a (fortified |major )?city/i,
    right: 'Saguntum fell by storm after eight months (Polybius 3.17).',
    fixed: '49df531',
  },
  {
    id: 'sacred-band-invented',
    re: /Sacred Band[^.]{0,150}(oath|necropol)/i,
    right: 'No source gives the Sacred Band oaths, a necropolis or inscriptions.',
    fixed: 'f319694',
  },
  {
    id: 'crimisus-ended-citizen-army',
    re: /(after|following|since) (the )?Crimisus[^.]{0,80}(abandon|ceased|no longer)/i,
    right: 'Diodorus 20.10–12: 40,000 citizens and the Sacred Band fought in 310.',
    fixed: 'f319694',
  },
  {
    id: 'scipio-generations',
    re: /Africanus[^.]{0,100}three generations/i,
    right: 'Aemilianus was Africanus\'s adoptive grandson: two generations.',
    fixed: 'evidence-audit commit',
  },
  {
    id: 'barcid-three-generations',
    re: /three generations of (the )?Barcid|Barcid[^.]{0,40}three generations/i,
    right: 'Barcid rule ran two generations; Hasdrubal the Fair was a son-in-law.',
    fixed: 'f400aa0',
  },
  {
    id: 'masinissa-continuous-reign',
    re: /fifty-eight[- ]years?|continuous(ly)? (reign|rule|ruled)[^.]{0,40}(Masinissa|Numidia|206)|Masinissa[^.]{0,80}continuous(ly)? (reign|rule|ruled)/i,
    right: 'Syphax drove Masinissa out; he recovered the kingdom in 203 (Appian 106). Polybius 36.16: over sixty years.',
    fixed: 'Masinissa audit',
  },
  {
    id: 'masinissa-roman-cavalry-commander',
    re: /Roman cavalry commander at Zama|served as a Roman cavalry/i,
    right: 'At Zama he commanded his own Numidian cavalry on the Roman right (Polybius 15.9).',
    fixed: 'Masinissa audit',
  },
  {
    id: 'polybius-always-lost-cases',
    re: /always lost its cases/i,
    right: 'Polybius 31.21 "always came off second best" refers to the Emporia embassies, not every dispute.',
    fixed: 'Masinissa audit',
  },
  {
    id: 'sophonisba-betrothal-senate-or-gala',
    re: /(senate|Gala)[^.]{0,40}(reversed|rescinded|arranged)[^.]{0,40}betrothal|betrothal[^.]{0,40}(rescinded|reversed) by (the senate|her father)/i,
    right: 'Only Appian (Pun. 10) has the betrothal: the Carthaginians gave her to Syphax without Hasdrubal\'s knowledge. Livy 29.23 has no betrothal.',
    fixed: 'Masinissa audit',
  },
  {
    id: 'polybius-sophonisba',
    re: /Polybius[^.]{0,30}14\.[7-9][^.]{0,80}(Sophonisba|poison)|(Sophonisba|poison)[^.]{0,80}Polybius[^.]{0,20}14\.[7-9]/i,
    right: 'Polybius Book 14 breaks off after the Great Plains; the Sophonisba episode is Livy 30.12–15 and Appian 27–28.',
    fixed: 'Masinissa audit',
  },
  {
    id: 'methodologically-more-honest',
    re: /methodologically more honest/i,
    right: 'Self-congratulation; say what the reading does instead.',
    fixed: 'cc2d26f',
  },
];

// Review terms: overstated confidence and outcome-read-as-design.
const REVIEW = [
  { id: 'consensus', re: /(?<!scholarly_)\bconsensus\b/i, ask: 'Is there a source for the consensus, or is it our impression?' },
  { id: 'universal', re: /\b(universally|overwhelmingly|invariably)\b|\b(all|most) (modern )?(scholars|historians)\b|\b(scholars|historians) agree\b/i, ask: 'Who, exactly? Name a holder or describe the reading.' },
  { id: 'inevitable', re: /\binevitabl[ey]\b/i, ask: 'Does a source say this, or does the outcome?' },
  { id: 'design-from-outcome', re: /\bcalibrated\b(?! (to approximately|dates|radiocarbon))|\bplanned outputs?\b|\bfrom the (outset|start)\b|\bdeliberately impossible\b|\bby design\b/i, ask: 'Is intent attested, or read back from what happened?' },
];

const args = process.argv.slice(2);
const listTerm = args.includes('--list') ? args[args.indexOf('--list') + 1] : null;
const listAll = args.includes('--all');

function walk(dir, out = []) {
  for (const name of readdirSync(dir)) {
    const full = join(dir, name);
    if (statSync(full).isDirectory()) walk(full, out);
    else if (/\.(md|ya?ml|ts|astro)$/.test(name)) out.push(full);
  }
  return out;
}

const files = SCAN.flatMap((d) => walk(join(REPO, d)));

// Collapse whitespace so phrases hard-wrapped across YAML lines still match.
function hits(text, re) {
  const flat = text.replace(/\s+/g, ' ');
  const g = new RegExp(re.source, re.flags.includes('g') ? re.flags : re.flags + 'g');
  return [...flat.matchAll(g)].map((m) =>
    flat.slice(Math.max(0, m.index - 60), m.index + m[0].length + 40).trim(),
  );
}

const texts = files.map((f) => [relative(REPO, f), readFileSync(f, 'utf8')]);

// 1. Regressions
const regressionHits = [];
for (const r of REGRESSIONS) {
  for (const [path, text] of texts) {
    for (const snip of hits(text, r.re)) regressionHits.push({ r, path, snip });
  }
}

console.log('REGRESSIONS (must be 0)');
if (regressionHits.length === 0) {
  console.log(`  CLEAN: none of ${REGRESSIONS.length} corrected errors has come back.`);
} else {
  for (const { r, path, snip } of regressionHits) {
    console.log(`  [${r.id}] ${path}\n    …${snip}…\n    right: ${r.right} (fixed ${r.fixed})`);
  }
}

// 2. Review
console.log('\nREVIEW (report only; judge each hit)');
for (const t of REVIEW) {
  const byFile = [];
  for (const [path, text] of texts) {
    const h = hits(text, t.re);
    if (h.length) byFile.push({ path, h });
  }
  const total = byFile.reduce((n, x) => n + x.h.length, 0);
  console.log(`  ${t.id}: ${total} in ${byFile.length} files. ${t.ask}`);
  if (listAll || listTerm === t.id) {
    for (const { path, h } of byFile) for (const s of h) console.log(`    ${path}: …${s}…`);
  }
}

// Modern-scholarship citations on claims with no page reference.
const modern = new Set();
for (const f of readdirSync(join(REPO, 'src/content/sources'))) {
  const d = YAML.parse(readFileSync(join(REPO, 'src/content/sources', f), 'utf8'));
  if (d?.type === 'modern_scholarship') modern.add(d.slug);
}
const unpaged = [];
for (const f of readdirSync(join(REPO, 'src/content/claims'))) {
  const d = YAML.parse(readFileSync(join(REPO, 'src/content/claims', f), 'utf8'));
  for (const s of d?.sources ?? []) {
    if (modern.has(s.source) && !s.passage_ref) unpaged.push(`${d.slug} → ${s.source}`);
  }
}
console.log(`  unpaged-modern: ${unpaged.length} modern citations on claims with no passage_ref. Has the argument been checked in the work itself?`);
if (listAll || listTerm === 'unpaged-modern') unpaged.forEach((u) => console.log(`    ${u}`));

// held_by fields that name scholars: each name should be verified.
const named = [];
for (const col of ['editorialTakes', 'openQuestions']) {
  for (const f of readdirSync(join(REPO, 'src/content', col))) {
    const text = readFileSync(join(REPO, 'src/content', col, f), 'utf8');
    const d = YAML.parse(text);
    const blocks = [
      ...(d?.competing_positions ?? []),
      ...(d?.candidate_answers ?? []),
    ];
    for (const b of blocks) {
      const hb = (b.held_by ?? '').replace(/\s+/g, ' ');
      // A parenthesized or comma list of two or more capitalized surnames.
      if (/\b[A-Z][a-zé]+,\s+[A-Z][a-zé]+/.test(hb)) named.push(`${col}/${f}: ${hb.trim().slice(0, 110)}`);
    }
  }
}
console.log(`  named-holders: ${named.length} held_by fields listing scholars. Is each name checked against the work?`);
if (listAll || listTerm === 'named-holders') named.forEach((n) => console.log(`    ${n}`));

process.exit(regressionHits.length ? 1 : 0);
