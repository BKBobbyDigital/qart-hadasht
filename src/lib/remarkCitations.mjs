/**
 * Remark plugin: inline citation linking for ancient-source references.
 *
 * Walks markdown text nodes and converts citation patterns like
 *   "Polybius 3.22"
 *   "Diodorus (20.14)"
 *   "Plutarch *Cato Major* 27"
 *   "Aristotle II.11"
 * into clickable links to the corresponding source page.
 *
 * Detects ancient-source citations only — modern scholarship is generally
 * referenced by author name + year and is too easily confused with prose
 * mentions ("Hoyos analyzes..." vs "Hoyos 2007"). Modern citations stay
 * plain text; the source name is already auto-linked when relevant via
 * the broader autolink plugin.
 */

import { visit, SKIP } from 'unist-util-visit';

// Map of recognized ancient-author names → source slug + display title.
// Order matters for the Plutarch-with-work form: longer matches first.
const AUTHORS = [
  { name: 'Cornelius Nepos', slug: 'nepos-hannibal', title: 'Cornelius Nepos' },
  { name: 'Nepos', slug: 'nepos-hannibal', title: 'Nepos' },
  { name: 'Polybius', slug: 'polybius-histories', title: 'Polybius' },
  { name: 'Livy', slug: 'livy-auc', title: 'Livy' },
  { name: 'Diodorus', slug: 'diodorus-library', title: 'Diodorus Siculus' },
  { name: 'Appian', slug: 'appian-punica', title: 'Appian' },
  { name: 'Plutarch', slug: 'plutarch-lives', title: 'Plutarch' },
  { name: 'Aristotle', slug: 'aristotle-politics', title: 'Aristotle' },
  { name: 'Herodotus', slug: 'herodotus-histories', title: 'Herodotus' },
  { name: 'Justin', slug: 'justin-epitome', title: 'Justin' },
  { name: 'Virgil', slug: 'virgil-aeneid', title: 'Virgil' },
];

const AUTHOR_RE_SOURCE = AUTHORS.map((a) => a.name.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')).join('|');

// Pattern A: Author optionally with italicized work, followed by passage ref.
// Examples:
//   Polybius 3.22
//   Polybius 3.22-26
//   Polybius (3.22)
//   Plutarch *Cato Major* 27
//   Aristotle II.11
//   Aristotle (II.11)
//   Diodorus 20.14
//
// The reference itself is digits/Roman numerals optionally containing
// '.' or '-' / '–' (en dash). May be wrapped in parens, and may contain
// multiple comma- or semicolon-separated passage segments
// (e.g., "Polybius (3.10, 3.27-28)" or "Aristotle II.11; III.1").
//
// Note: the hyphen MUST be escaped inside the character class —
// '[.-–]' would otherwise be interpreted as the Unicode range from
// '.' to '–'.
const PASSAGE_SEG = String.raw`(?:[IVXLCM]+|\d+)(?:[.\-–][IVXLCM\d]+)*`;
const PASSAGE = String.raw`(?:\(\s*)?${PASSAGE_SEG}(?:[,;]\s*${PASSAGE_SEG})*(?:\s*\))?`;

// Italic work: *Title* (markdown italic) — captured as a single token.
// In the raw markdown text node, italic is already parsed by the time
// we visit; the work token will appear as a separate `emphasis` node
// rather than embedded in text. So we only handle Author + passage in
// text-node matching. The work title (when present) lives in an
// adjacent emphasis node.
const CITATION_RE = new RegExp(
  String.raw`(^|[^A-Za-z0-9_-])(${AUTHOR_RE_SOURCE})(?:'s)?\s+(${PASSAGE})(?![A-Za-z0-9_-])`,
  'g'
);

// Look up source slug by exact name match (case-sensitive — the regex
// matches them precisely, so this is safe).
function authorSlug(name) {
  const a = AUTHORS.find((au) => au.name === name);
  return a ? a.slug : null;
}

const SKIP_PARENTS = new Set([
  'link',
  'linkReference',
  'inlineCode',
  'code',
  'image',
  'imageReference',
  'html',
  'heading',
]);

function rewriteText(value) {
  if (!value) return null;
  const replacements = [];
  let m;
  CITATION_RE.lastIndex = 0;
  while ((m = CITATION_RE.exec(value)) !== null) {
    const [full, lead, author, passage] = m;
    const slug = authorSlug(author);
    if (!slug) continue;
    const start = m.index + lead.length;
    const end = start + (full.length - lead.length);
    replacements.push({ start, end, author, passage, slug });
  }
  if (replacements.length === 0) return null;

  const out = [];
  let cursor = 0;
  for (const r of replacements) {
    if (cursor < r.start) {
      out.push({ type: 'text', value: value.slice(cursor, r.start) });
    }
    // The link's display text is the matched substring (Author + passage).
    // Cleaning of trailing/leading spaces happens here.
    const display = value.slice(r.start, r.end).trim();
    out.push({
      type: 'link',
      url: `/sources/${r.slug}`,
      data: {
        hProperties: {
          className: ['citation-link'],
          title: `Source: ${r.author} ${r.passage}`,
        },
      },
      children: [{ type: 'text', value: display }],
    });
    cursor = r.end;
  }
  if (cursor < value.length) {
    out.push({ type: 'text', value: value.slice(cursor) });
  }
  return out;
}

// Match an Author at the END of a text node so the next node can be
// the work emphasis. Allows trailing "'s" or "(".
const TAIL_AUTHOR_RE = new RegExp(
  String.raw`(^|[^A-Za-z0-9_-])(${AUTHOR_RE_SOURCE})(?:'s)?\s*\(?\s*$`
);

// Match a passage at the START of a text node, optionally trailing close-paren.
const HEAD_PASSAGE_RE = new RegExp(
  String.raw`^\s*(${PASSAGE_SEG}(?:[,;]\s*${PASSAGE_SEG})*)\s*\)?(?![A-Za-z0-9_-])`
);

/**
 * Process a parent node's children array to find italic-work citation
 * patterns: text ending "Author " + emphasis (work title) + text starting
 * "passage". Replace those three siblings with a single link wrapping
 * all three pieces.
 */
function rewriteItalicWorkCitations(parent) {
  if (!parent.children) return;
  const children = parent.children;
  for (let i = 0; i < children.length - 2; i++) {
    const a = children[i];
    const b = children[i + 1];
    const c = children[i + 2];
    if (a.type !== 'text' || b.type !== 'emphasis' || c.type !== 'text') continue;

    const tail = a.value.match(TAIL_AUTHOR_RE);
    if (!tail) continue;
    const author = tail[2];
    const slug = authorSlug(author);
    if (!slug) continue;
    const tailLead = tail[1] ?? '';
    const tailMatchStart = tail.index + tailLead.length;

    const head = c.value.match(HEAD_PASSAGE_RE);
    if (!head) continue;
    const passage = head[1];
    const headMatchEnd = head[0].length;

    const beforeText = a.value.slice(0, tailMatchStart);
    const afterText = c.value.slice(headMatchEnd);

    const linkChildren = [
      { type: 'text', value: a.value.slice(tailMatchStart).trim() + ' ' },
      { ...b },
      { type: 'text', value: ' ' + passage },
    ];

    const replacement = [];
    if (beforeText) replacement.push({ type: 'text', value: beforeText });
    replacement.push({
      type: 'link',
      url: `/sources/${slug}`,
      data: {
        hProperties: {
          className: ['citation-link'],
          title: `Source: ${author} ${passage}`,
        },
      },
      children: linkChildren,
    });
    if (afterText) replacement.push({ type: 'text', value: afterText });

    children.splice(i, 3, ...replacement);
    // Position the loop so the NEXT iteration starts at the last replacement
    // element. That last element is text-after (or the link itself) — and
    // text-after may be the start of another triple ending in the next
    // emphasis. So we set i = (position of last replacement element) - 1
    // and let the for loop's i++ move us there.
    i = i + replacement.length - 2;
  }
}

export default function remarkCitations() {
  return (tree) => {
    // First pass: italic-work citations (Author *Work* N)
    visit(tree, (node) => {
      if (!node || !node.children) return;
      if (SKIP_PARENTS.has(node.type)) return;
      rewriteItalicWorkCitations(node);
    });
    // Second pass: simple text-only citations (Author N.NN)
    visit(tree, 'text', (node, index, parent) => {
      if (!parent || typeof index !== 'number') return;
      if (SKIP_PARENTS.has(parent.type)) return;
      const replacements = rewriteText(node.value);
      if (!replacements) return;
      parent.children.splice(index, 1, ...replacements);
      return [SKIP, index + replacements.length];
    });
  };
}
