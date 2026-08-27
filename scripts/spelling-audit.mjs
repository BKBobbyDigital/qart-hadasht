#!/usr/bin/env node
/**
 * spelling-audit.mjs — keep the corpus in American English.
 *
 *   node scripts/spelling-audit.mjs            # report only
 *   node scripts/spelling-audit.mjs --apply    # rewrite the known-safe list
 *
 * Two passes:
 *   1. KNOWN   — a curated British -> American map. Safe to auto-apply.
 *   2. REVIEW  — a generic -ise/-isation/-yse detector, filtered through an
 *                allowlist of words that legitimately carry an "s" in
 *                American English. Report-only: these need a human, because
 *                the fix depends on whether the word is prose or a title.
 *
 * Lines matching GUARDS are skipped entirely. Those exemptions are
 * deliberate and documented in CLAUDE.md; do not "fix" them:
 *   - foreign-language source titles (French "civilisation"/"romanisation")
 *   - quoted translations (Diodorus, "fame for valour" in sacred-band)
 *   - conventional titles of cited works ("On Marvellous Things Heard")
 *
 * Note: "tonne" is a unit, not a spelling. A tonne is metric and a US ton
 * is not, so it maps to "metric ton", never "ton".
 */
import { readFileSync, writeFileSync } from 'node:fs';
import { execSync } from 'node:child_process';

const APPLY = process.argv.includes('--apply');
const ROOTS = ['src/content', 'src/pages', 'src/components', 'src/layouts', 'src/data'];

const GUARDS = [
  /civilisation/i,
  /romanisation/i,
  /Marvellous Things Heard/i,
  /fame for valour/i,
];

/** Curated, ordered longest-first so plurals win over singulars. */
const KNOWN = [
  [/\btheatres\b/g, 'theaters'], [/\bTheatres\b/g, 'Theaters'],
  [/\btheatre\b/g, 'theater'], [/\bTheatre\b/g, 'Theater'],
  [/\bmanoeuvring\b/g, 'maneuvering'], [/\bmanoeuvrable\b/g, 'maneuverable'],
  [/\bmanoeuvred\b/g, 'maneuvered'], [/\bmanoeuvres\b/g, 'maneuvers'],
  [/\bmanoeuvre\b/g, 'maneuver'],
  [/\bcatalogued\b/g, 'cataloged'], [/\bcataloguing\b/g, 'cataloging'],
  [/\bcatalogues\b/g, 'catalogs'], [/\bcatalogue\b/g, 'catalog'],
  [/\bCatalogue\b/g, 'Catalog'],
  [/\bsceptres\b/g, 'scepters'], [/\bsceptre\b/g, 'scepter'],
  [/\bploughing\b/g, 'plowing'], [/\bploughed\b/g, 'plowed'],
  [/\bploughs\b/g, 'plows'], [/\bplough\b/g, 'plow'],
  [/\bprogrammes\b/g, 'programs'], [/\bprogramme\b/g, 'program'],
  [/\blabelling\b/g, 'labeling'], [/\blabelled\b/g, 'labeled'],
  [/\bmodelling\b/g, 'modeling'], [/\bmodelled\b/g, 'modeled'],
  [/\btotalling\b/g, 'totaling'], [/\btotalled\b/g, 'totaled'],
  [/\blevelling\b/g, 'leveling'], [/\blevelled\b/g, 'leveled'],
  [/\brivalling\b/g, 'rivaling'], [/\brivalled\b/g, 'rivaled'],
  [/\bsignalling\b/g, 'signaling'], [/\bsignalled\b/g, 'signaled'],
  [/\bchannelling\b/g, 'channeling'], [/\bchannelled\b/g, 'channeled'],
  [/\bfuelling\b/g, 'fueling'], [/\bfuelled\b/g, 'fueled'],
  [/\bcancelling\b/g, 'canceling'], [/\bcancelled\b/g, 'canceled'],
  [/\btravellers\b/g, 'travelers'], [/\btraveller\b/g, 'traveler'],
  [/\btravelling\b/g, 'traveling'], [/\btravelled\b/g, 'traveled'],
  [/\bmarvellous\b/g, 'marvelous'], [/\bcounsellors\b/g, 'counselors'],
  [/\bcounsellor\b/g, 'counselor'], [/\bjewellery\b/g, 'jewelry'],
  [/\binstalments\b/g, 'installments'], [/\binstalment\b/g, 'installment'],
  [/\bfulfilment\b/g, 'fulfillment'], [/\bfulfil\b/g, 'fulfill'],
  [/\benrolment\b/g, 'enrollment'], [/\bskilful\b/g, 'skillful'],
  [/\bwilful\b/g, 'willful'],
  // -our
  [/\bcolours\b/g, 'colors'], [/\bcoloured\b/g, 'colored'],
  [/\bcolourful\b/g, 'colorful'], [/\bcolour\b/g, 'color'],
  [/\bhonourable\b/g, 'honorable'], [/\bhonoured\b/g, 'honored'],
  [/\bhonours\b/g, 'honors'], [/\bhonour\b/g, 'honor'],
  [/\bfavourable\b/g, 'favorable'], [/\bfavourites\b/g, 'favorites'],
  [/\bfavourite\b/g, 'favorite'], [/\bfavoured\b/g, 'favored'],
  [/\bfavours\b/g, 'favors'], [/\bfavour\b/g, 'favor'],
  [/\bbehavioural\b/g, 'behavioral'], [/\bbehaviours\b/g, 'behaviors'],
  [/\bbehaviour\b/g, 'behavior'],
  [/\bneighbouring\b/g, 'neighboring'], [/\bneighbours\b/g, 'neighbors'],
  [/\bneighbour\b/g, 'neighbor'],
  [/\bharbours\b/g, 'harbors'], [/\bharboured\b/g, 'harbored'],
  [/\bharbour\b/g, 'harbor'],
  [/\barmoured\b/g, 'armored'], [/\barmour\b/g, 'armor'],
  [/\blaboured\b/g, 'labored'], [/\blabours\b/g, 'labors'],
  [/\blabour\b/g, 'labor'],
  [/\brumoured\b/g, 'rumored'], [/\brumours\b/g, 'rumors'],
  [/\brumour\b/g, 'rumor'],
  [/\bvalour\b/g, 'valor'], [/\bvigour\b/g, 'vigor'],
  [/\bsplendour\b/g, 'splendor'], [/\bendeavours\b/g, 'endeavors'],
  [/\bendeavour\b/g, 'endeavor'], [/\bfervour\b/g, 'fervor'],
  [/\bclamour\b/g, 'clamor'], [/\bardour\b/g, 'ardor'],
  [/\brigours\b/g, 'rigors'], [/\brigour\b/g, 'rigor'],
  [/\bhumour\b/g, 'humor'], [/\bodour\b/g, 'odor'],
  [/\bsaviour\b/g, 'savior'], [/\bdemeanour\b/g, 'demeanor'],
  [/\bparlour\b/g, 'parlor'], [/\bsuccour\b/g, 'succor'],
  // -re
  [/\bcentres\b/g, 'centers'], [/\bcentred\b/g, 'centered'],
  [/\bcentre\b/g, 'center'], [/\bCentre\b/g, 'Center'],
  [/\bkilometres\b/g, 'kilometers'], [/\bkilometre\b/g, 'kilometer'],
  [/\bmetres\b/g, 'meters'], [/\bmetre\b/g, 'meter'],
  [/\blitres\b/g, 'liters'], [/\blitre\b/g, 'liter'],
  [/\bfibres\b/g, 'fibers'], [/\bfibre\b/g, 'fiber'],
  [/\bsabres\b/g, 'sabers'], [/\bsabre\b/g, 'saber'],
  [/\bsombre\b/g, 'somber'], [/\bcalibre\b/g, 'caliber'],
  [/\blustre\b/g, 'luster'], [/\bspectre\b/g, 'specter'],
  // -ce / -se
  [/\bdefences\b/g, 'defenses'], [/\bdefence\b/g, 'defense'],
  [/\boffences\b/g, 'offenses'], [/\boffence\b/g, 'offense'],
  [/\bpretence\b/g, 'pretense'], [/\blicence\b/g, 'license'],
  [/\bpractising\b/g, 'practicing'], [/\bpractised\b/g, 'practiced'],
  // -yse
  [/\banalysing\b/g, 'analyzing'], [/\banalysed\b/g, 'analyzed'],
  [/\banalyse\b/g, 'analyze'], [/\bparalysed\b/g, 'paralyzed'],
  [/\bparalyse\b/g, 'paralyze'],
  // misc
  [/\bgreyish\b/g, 'grayish'], [/\bgrey\b/g, 'gray'], [/\bGrey\b/g, 'Gray'],
  [/\bscepticism\b/g, 'skepticism'], [/\bsceptically\b/g, 'skeptically'],
  [/\bsceptical\b/g, 'skeptical'], [/\bsceptics\b/g, 'skeptics'],
  [/\bsceptic\b/g, 'skeptic'],
  [/\bmoulded\b/g, 'molded'], [/\bmoulding\b/g, 'molding'],
  [/\bmould\b/g, 'mold'], [/\bsmouldering\b/g, 'smoldering'],
  [/\bsmoulder\b/g, 'smolder'],
  [/\bstoreys\b/g, 'stories'], [/\bstorey\b/g, 'story'],
  [/\bdraughts\b/g, 'drafts'], [/\bdraught\b/g, 'draft'],
  [/\bwhilst\b/g, 'while'], [/\bamongst\b/g, 'among'],
  [/\bamidst\b/g, 'amid'], [/\blearnt\b/g, 'learned'],
  [/\bspelt\b/g, 'spelled'], [/\bdreamt\b/g, 'dreamed'],
  [/\bleapt\b/g, 'leaped'],
  [/\bencyclopaedia\b/g, 'encyclopedia'], [/\bmediaeval\b/g, 'medieval'],
  [/\bsulphuric\b/g, 'sulfuric'], [/\bsulphur\b/g, 'sulfur'],
  [/\bageing\b/g, 'aging'], [/\bmoustache\b/g, 'mustache'],
  [/\bcheque\b/g, 'check'], [/\bgaol\b/g, 'jail'], [/\bkerb\b/g, 'curb'],
  [/\bspecialities\b/g, 'specialties'], [/\bspeciality\b/g, 'specialty'],
  [/\baluminium\b/g, 'aluminum'],
  // Unit, not spelling.
  [/\btonnes\b/g, 'metric tons'], [/\btonne\b/g, 'metric ton'],
];

/** Words that legitimately keep an "s" in American English. */
const ALLOW_BASES = [
  'advertise', 'advise', 'apprise', 'arise', 'chastise', 'circumcise',
  'comprise', 'compromise', 'despise', 'devise', 'disguise', 'excise',
  'exercise', 'improvise', 'incise', 'merchandise', 'premise', 'promise',
  'raise', 'revise', 'rise', 'supervise', 'surmise', 'surprise', 'televise',
  'appraise', 'praise', 'braise', 'cruise', 'bruise', 'poise', 'noise',
  'enterprise', 'franchise', 'treatise', 'guise', 'demise', 'malaise',
  'valise', 'tortoise', 'turquoise', 'mortise', 'anise', 'paradise',
  'expertise', 'concise', 'precise', 'otherwise', 'likewise', 'clockwise',
  'wise', 'noise', 'baptise',
];
const ALLOW = new Set();
for (const b of ALLOW_BASES) {
  const stem = b.endsWith('e') ? b.slice(0, -1) : b;
  for (const w of [b, b + 's', b + 'd', b + 'r', b + 'rs', stem + 'ing',
                   stem + 'ation', stem + 'ations', b + 'ment', b + 'ments']) {
    ALLOW.add(w);
  }
}
// Correct American plurals of -is nouns, and other look-alikes.
['analyses', 'crises', 'theses', 'bases', 'diagnoses', 'hypotheses',
 'parentheses', 'syntheses', 'oases', 'axes', 'dialogue', 'dialogues',
 'metropolis', 'metropolises', 'stepwise', 'streetwise'].forEach((w) => ALLOW.add(w));

/** Prefixes stripped before the allowlist check, so "unsurprising" and
 *  "uprising" resolve to "surprising" and "rising". */
const PREFIXES = ['un', 'im', 'in', 'dis', 're', 'over', 'under', 'up', 'step', 'non', 'mis'];

function allowed(word) {
  if (ALLOW.has(word)) return true;
  for (const p of PREFIXES) {
    if (word.startsWith(p) && ALLOW.has(word.slice(p.length))) return true;
  }
  return false;
}

/** Case-sensitive on purpose: an optional leading capital catches
 *  sentence-initial "Recognise" while leaving camelCase identifiers
 *  such as `lastRevised` alone. */
const REVIEW_RE = /\b[A-Z]?[a-z]{2,}(?:is(?:e|es|ed|ing|ation|ations)|ys(?:e|ed|ing))\b/g;

const files = execSync(
  `find ${ROOTS.join(' ')} -type f \\( -name '*.md' -o -name '*.yaml' -o -name '*.astro' -o -name '*.ts' -o -name '*.json' \\)`
).toString().trim().split('\n').filter(Boolean);

const knownHits = new Map();   // term -> [{file,line}]
const reviewHits = new Map();  // word -> [{file,line,text}]
let filesChanged = 0, totalEdits = 0;

for (const file of files) {
  const original = readFileSync(file, 'utf8');
  const lines = original.split('\n');
  let changed = false;

  const out = lines.map((line, i) => {
    if (GUARDS.some((g) => g.test(line))) return line;

    let next = line;
    for (const [re, rep] of KNOWN) {
      re.lastIndex = 0;
      const m = next.match(re);
      if (m) {
        const key = `${m[0]} -> ${rep}`;
        if (!knownHits.has(key)) knownHits.set(key, []);
        m.forEach(() => knownHits.get(key).push({ file, line: i + 1 }));
        totalEdits += m.length;
        next = next.replace(re, rep);
      }
    }
    if (next !== line) changed = true;

    // Review pass runs on the post-fix text so KNOWN items don't double-report.
    REVIEW_RE.lastIndex = 0;
    let r;
    while ((r = REVIEW_RE.exec(next)) !== null) {
      const w = r[0].toLowerCase();
      if (allowed(w)) continue;
      if (!reviewHits.has(w)) reviewHits.set(w, []);
      reviewHits.get(w).push({ file, line: i + 1, text: next.trim().slice(0, 100) });
    }
    return next;
  });

  if (changed) {
    filesChanged++;
    if (APPLY) writeFileSync(file, out.join('\n'));
  }
}

console.log('=== Known British spellings ===');
if (knownHits.size === 0) {
  console.log('  none');
} else {
  for (const [term, hits] of [...knownHits.entries()].sort((a, b) => b[1].length - a[1].length)) {
    console.log(`  ${term}  [${hits.length}]`);
    for (const h of hits.slice(0, 5)) console.log(`      ${h.file}:${h.line}`);
    if (hits.length > 5) console.log(`      ... and ${hits.length - 5} more`);
  }
  console.log(`\n  ${APPLY ? 'APPLIED' : 'NOT APPLIED (run with --apply)'}: ` +
              `${totalEdits} edits across ${filesChanged} files`);
}

console.log('\n=== Possible -ise/-yse forms needing review ===');
if (reviewHits.size === 0) {
  console.log('  none');
} else {
  for (const [w, hits] of [...reviewHits.entries()].sort((a, b) => b[1].length - a[1].length)) {
    console.log(`  ${w}  [${hits.length}]`);
    for (const h of hits.slice(0, 3)) console.log(`      ${h.file}:${h.line}  ${h.text}`);
    if (hits.length > 3) console.log(`      ... and ${hits.length - 3} more`);
  }
  console.log('\n  Judge each: prose gets the -ize form; foreign titles and');
  console.log('  quoted translations stay as they are (add a GUARD if so).');
}

const clean = knownHits.size === 0 && reviewHits.size === 0;
console.log(`\n${clean ? 'CLEAN — corpus is American English.' : 'Findings above.'}`);
