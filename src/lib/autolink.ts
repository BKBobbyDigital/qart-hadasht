/**
 * Build-time auto-linker for entity summaries.
 *
 * Given a paragraph of plain text and a registry of known entities, find
 * mentions of those entities by their canonical display names and wrap each
 * first mention in a link. Returns an HTML string suitable for `set:html`.
 *
 * Rules:
 *   - Exact display-name match only (we don't try to fuzzy-match "Hannibal"
 *     to "Hannibal Barca" — too risky). Aliases live alongside the canonical
 *     name in the registry; each is its own candidate.
 *   - Longest match wins (so "First Punic War" beats "Punic War" if both
 *     exist).
 *   - Whole-word match (\b boundaries), case-sensitive.
 *   - Skip self-references via `excludeKey`.
 *   - First mention per target entity only.
 *   - Ambiguous display names (same name, multiple entities) are skipped
 *     entirely — too dangerous to guess.
 */

export type LinkTarget = {
  name: string;
  href: string;
  /** Canonical key — `${type}:${slug}`. First-mention dedup is per-key. */
  key: string;
};

export type LinkRegistry = {
  /** Pre-built candidate list, sorted by name length descending. */
  candidates: LinkTarget[];
};

/**
 * Build a registry from raw entity collections. Pass the collections you want
 * to auto-link from. Each call computes the candidate list and resolves
 * ambiguities (entities sharing the same display name are dropped).
 */
export function buildLinkRegistry(input: {
  events?: Array<{ id: string; data: { name: string } }>;
  people?: Array<{ id: string; data: { name_display: string } }>;
  places?: Array<{ id: string; data: { name_display: string } }>;
  institutions?: Array<{ id: string; data: { name_display: string } }>;
  groups?: Array<{ id: string; data: { name_display: string } }>;
  themes?: Array<{ id: string; data: { title: string } }>;
  deities?: Array<{ id: string; data: { name_display: string } }>;
  artifacts?: Array<{ id: string; data: { name_display: string } }>;
}): LinkRegistry {
  const raw: LinkTarget[] = [];

  (input.events ?? []).forEach((e) =>
    raw.push({
      name: e.data.name,
      href: `/events/${e.id}`,
      key: `event:${e.id}`,
    })
  );
  (input.people ?? []).forEach((p) =>
    raw.push({
      name: p.data.name_display,
      href: `/people/${p.id}`,
      key: `person:${p.id}`,
    })
  );
  (input.places ?? []).forEach((p) =>
    raw.push({
      name: p.data.name_display,
      href: `/places/${p.id}`,
      key: `place:${p.id}`,
    })
  );
  (input.institutions ?? []).forEach((i) =>
    raw.push({
      name: i.data.name_display,
      href: `/institutions/${i.id}`,
      key: `institution:${i.id}`,
    })
  );
  (input.groups ?? []).forEach((g) =>
    raw.push({
      name: g.data.name_display,
      href: `/groups/${g.id}`,
      key: `group:${g.id}`,
    })
  );
  (input.themes ?? []).forEach((t) =>
    raw.push({
      name: t.data.title,
      href: `/themes/${t.id.replace(/\.md$/, '')}`,
      key: `theme:${t.id.replace(/\.md$/, '')}`,
    })
  );
  (input.deities ?? []).forEach((d) =>
    raw.push({
      name: d.data.name_display,
      href: `/deities/${d.id}`,
      key: `deity:${d.id}`,
    })
  );
  (input.artifacts ?? []).forEach((a) =>
    raw.push({
      name: a.data.name_display,
      href: `/artifacts/${a.id}`,
      key: `artifact:${a.id}`,
    })
  );

  // Drop ambiguous display names: if multiple entities share the same exact
  // name string, none auto-links. (Build-time warning logged.)
  const byName = new Map<string, LinkTarget[]>();
  for (const c of raw) {
    if (!byName.has(c.name)) byName.set(c.name, []);
    byName.get(c.name)!.push(c);
  }
  const candidates: LinkTarget[] = [];
  for (const [name, group] of byName) {
    if (group.length > 1) {
      // eslint-disable-next-line no-console
      console.warn(
        `[autolink] Ambiguous display name "${name}" used by ${group.length} entities (${group.map((g) => g.key).join(', ')}). Skipping.`
      );
      continue;
    }
    candidates.push(group[0]);
  }

  // Skip very short names — too risky for word-boundary collisions.
  const filtered = candidates.filter((c) => c.name.length >= 4);

  // Sort by length descending so we match longest first.
  filtered.sort((a, b) => b.name.length - a.name.length);

  return { candidates: filtered };
}

/**
 * Escape the parts of a candidate name that would otherwise be interpreted
 * as regex metacharacters (parens, question marks, periods…).
 */
function escapeRegExp(s: string): string {
  return s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

/**
 * Escape HTML special chars in plain text we pass through unmodified.
 */
function escapeHtml(s: string): string {
  return s
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');
}

// Sanitize a URL for use inside a double-quoted href="" attribute.
// Rejects any scheme other than http/https/mailto (so javascript:, data:,
// vbscript:, etc. can't produce a live link) — schemeless URLs (/path, #hash,
// ?query, relative) are allowed. Then escapes the attribute delimiters,
// including the double-quote that escapeHtml leaves alone. All link URLs are
// author-authored today; this is defense-in-depth against any future path
// that ingests outside content.
function sanitizeHref(url: string): string {
  const trimmed = url.trim();
  const scheme = /^([a-z][a-z0-9+.-]*):/i.exec(trimmed);
  if (scheme && !['http', 'https', 'mailto'].includes(scheme[1].toLowerCase())) {
    return '#';
  }
  return trimmed
    .replace(/&/g, '&amp;')
    .replace(/"/g, '&quot;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');
}

/**
 * Auto-link a single paragraph of plain text. Returns HTML.
 *
 * @param text - the source string (plain text — no HTML)
 * @param registry - the precomputed link registry
 * @param opts.excludeKey - canonical key of the current page's entity (e.g.
 *   "event:battle-of-cannae"); never link to it
 */
export function autolink(
  text: string,
  registry: LinkRegistry,
  opts: { excludeKey?: string } = {}
): string {
  if (!text) return '';

  type Replacement = { start: number; end: number; html: string };
  const replacements: Replacement[] = [];
  const claimed: Array<[number, number]> = [];
  const usedKeys = new Set<string>();

  const overlapsClaimed = (s: number, e: number) =>
    claimed.some(([cs, ce]) => !(e <= cs || s >= ce));

  // First pass: process explicit markdown-style links [text](url).
  // These are pre-authored links in YAML summary fields (e.g. to editorial
  // takes, narratives, or other entities the autolink registry may not cover).
  // We convert them to <a> HTML up front and mark their ranges as claimed so
  // the subsequent entity-autolink pass doesn't try to nest links inside them.
  const mdLinkRe = /\[([^\]\n]+)\]\(([^)\s]+)\)/g;
  let mdMatch: RegExpExecArray | null;
  while ((mdMatch = mdLinkRe.exec(text)) !== null) {
    const start = mdMatch.index;
    const end = start + mdMatch[0].length;
    const linkText = mdMatch[1];
    const href = mdMatch[2];
    replacements.push({
      start,
      end,
      html: `<a class="auto-link" href="${sanitizeHref(href)}">${escapeHtml(linkText)}</a>`,
    });
    claimed.push([start, end]);
  }

  // Inline italic substitution for use INSIDE bold spans (where the inner
  // content might contain *italic* markers we want to render).
  const inlineItalic = (s: string): string =>
    s.replace(/(?<![*\w])\*([^*\n]+?)\*(?![*\w])/g, (_m, inner) => `<em>${inner}</em>`);

  // Inline markdown: **bold** and *italic*. YAML summary fields use these
  // for emphasis (proper nouns the autolink doesn't catch, citation-style
  // title italics, named-entity bolding within paragraphs). We claim these
  // ranges before the entity-autolink pass so the asterisks don't get
  // escaped as literal text.
  //
  // Bold uses a non-greedy match that allows inner asterisks so that
  // patterns like `**The *gladius* term.**` (bold with nested italic) work.
  // The inner content gets HTML-escaped, then italic substitution is run
  // on the escaped result (the <em> tags themselves are emitted by
  // inlineItalic and survive the escape).
  const boldRe = /\*\*([^\n]+?)\*\*/g;
  let bMatch: RegExpExecArray | null;
  while ((bMatch = boldRe.exec(text)) !== null) {
    const start = bMatch.index;
    const end = start + bMatch[0].length;
    if (overlapsClaimed(start, end)) continue;
    replacements.push({
      start,
      end,
      html: `<strong>${inlineItalic(escapeHtml(bMatch[1]))}</strong>`,
    });
    claimed.push([start, end]);
  }
  // Single-asterisk italic outside of bold spans. Must NOT match within
  // bold (claimed ranges) and must NOT match across newlines.
  const italicRe = /(?<![*\w])\*([^*\n]+?)\*(?![*\w])/g;
  let iMatch: RegExpExecArray | null;
  while ((iMatch = italicRe.exec(text)) !== null) {
    const start = iMatch.index;
    const end = start + iMatch[0].length;
    if (overlapsClaimed(start, end)) continue;
    replacements.push({
      start,
      end,
      html: `<em>${escapeHtml(iMatch[1])}</em>`,
    });
    claimed.push([start, end]);
  }

  for (const c of registry.candidates) {
    if (c.key === opts.excludeKey) continue;
    if (usedKeys.has(c.key)) continue;

    // Whole-word, case-sensitive match. Use lookarounds approximated via
    // capture groups around the boundary to keep BCE/Carthage-level prose
    // happy with apostrophes and hyphens.
    const re = new RegExp(`(^|[^A-Za-z0-9_-])(${escapeRegExp(c.name)})(?![A-Za-z0-9_-])`, 'g');
    let m: RegExpExecArray | null;
    while ((m = re.exec(text)) !== null) {
      const matchStart = m.index + m[1].length;
      const matchEnd = matchStart + m[2].length;
      if (overlapsClaimed(matchStart, matchEnd)) continue;
      replacements.push({
        start: matchStart,
        end: matchEnd,
        html: `<a class="auto-link" href="${c.href}">${escapeHtml(m[2])}</a>`,
      });
      claimed.push([matchStart, matchEnd]);
      usedKeys.add(c.key);
      break; // first mention per entity only
    }
  }

  if (replacements.length === 0) return escapeHtml(text);

  // Apply replacements right-to-left so earlier indices stay valid.
  replacements.sort((a, b) => b.start - a.start);
  let out = text;
  for (const r of replacements) {
    out = escapeHtml(out.slice(0, r.start)) + r.html + out.slice(r.end);
    // Leftward slice still has un-escaped text; we'll escape on the next loop.
    // To keep this simple: rebuild by walking once at the end instead.
  }

  // The above leaves un-escaped right-of-replacement segments. Cleaner to
  // build the output by walking left-to-right with the sorted replacements.
  const ordered = [...replacements].sort((a, b) => a.start - b.start);
  let cursor = 0;
  let result = '';
  for (const r of ordered) {
    result += escapeHtml(text.slice(cursor, r.start));
    result += r.html;
    cursor = r.end;
  }
  result += escapeHtml(text.slice(cursor));
  return italicizeAnchorText(result);
}

/**
 * Convert residual inline markdown (*italic*, _italic_, **bold**) that
 * survives INSIDE anchor text — e.g. an autolinked source name whose
 * display text contains `*Manuel de recherche*`. Operates only on the
 * text between `<a …>` and `</a>`, so hrefs and other markup are never
 * touched.
 */
export function italicizeAnchorText(html: string): string {
  if (!html || html.indexOf('*') === -1 && html.indexOf('_') === -1) return html;
  return html.replace(/(<a\b[^>]*>)([^<]*)(<\/a>)/g, (_m, open, txt, close) => {
    const t = txt
      .replace(/\*\*([^*]+?)\*\*/g, '<strong>$1</strong>')
      .replace(/(?<![*\w])\*([^*]+?)\*(?![*\w])/g, '<em>$1</em>')
      .replace(/(?<![_\w])_([^_]+?)_(?![_\w])/g, '<em>$1</em>');
    return open + t + close;
  });
}

/**
 * Slugify heading text for stable anchor URLs. Mirrors rehype-slug's
 * default behavior (which Astro applies to .md headings automatically)
 * so YAML-summary headings and .md headings produce comparable anchors.
 */
function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '')
    .trim()
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-');
}

/**
 * Anchor link emitted alongside each heading. The `¶` glyph is a
 * pilcrow — the standard academic permalink convention. Default
 * opacity 0; revealed on heading hover via CSS. Clicking copies the
 * URL+hash to clipboard via a small script in BaseLayout.
 */
function anchorLink(id: string): string {
  return ` <a class="anchor-link" href="#${id}" aria-label="Copy link to this section" data-anchor>¶</a>`;
}

/**
 * Render a YAML summary field as HTML, handling block-level markdown
 * (## h2, ### h3) plus everything `autolink` covers (inline bold/italic,
 * markdown links, entity autolinks).
 *
 * Returns a single HTML string ready for `set:html` on a wrapping div
 * styled with the prose-encyclopedia class (which provides typography
 * for h2/h3/p/ul/a within it).
 *
 * Block-level rules:
 *   - A paragraph starting with `## ` is rendered as <h2>...</h2>.
 *   - A paragraph starting with `### ` is rendered as <h3>...</h3>.
 *   - Any other non-empty block is rendered as <p>...</p>.
 *   - Blocks are separated by blank lines (the same convention the
 *     prior split-on-\n\n+ rendering used).
 *
 * Inline content within each block goes through `autolink`, which
 * handles `**bold**`, `*italic*`, `[text](url)`, and entity-name
 * autolinks with appropriate escaping.
 */
export function renderSummaryHtml(
  text: string,
  registry: LinkRegistry,
  opts: { excludeKey?: string } = {}
): string {
  if (!text) return '';
  // Pre-process: collapse "more-indented continuation lines" into spaces.
  // YAML `>` folded scalars fold normal soft-wraps to spaces but preserve
  // newlines before more-indented lines (used to keep code blocks, bullet
  // continuations, etc. as distinct lines). For summary prose those
  // preserved newlines are just continuation softwraps that we want to
  // collapse back into the same paragraph or bullet item.
  const normalized = text.replace(/\n[ \t]+/g, ' ');
  // Split on any run of newlines. Every remaining `\n` is an authored
  // paragraph break (since soft-wraps were already folded by YAML and
  // continuation-line newlines were normalized to spaces just above).
  const blocks = normalized.split(/\n+/).map((b) => b.trim()).filter(Boolean);

  const parts: string[] = [];
  let pendingItems: string[] = [];

  const flushList = () => {
    if (pendingItems.length === 0) return;
    const lis = pendingItems
      .map((it) => `<li>${autolink(it, registry, opts)}</li>`)
      .join('');
    parts.push(`<ul>${lis}</ul>`);
    pendingItems = [];
  };

  for (const block of blocks) {
    // Headings — emit with a slug-derived id and an appended anchor
    // link for permalink/copy behavior. The slug logic mirrors what
    // rehype-slug does for .md content (lowercase, alpha-num + hyphens)
    // so YAML-derived headings and .md-derived headings share the same
    // anchor-style convention.
    if (block.startsWith('### ')) {
      flushList();
      const text = block.slice(4).trim();
      const id = slugify(text);
      parts.push(`<h3 id="${id}">${autolink(text, registry, opts)}${anchorLink(id)}</h3>`);
      continue;
    }
    if (block.startsWith('## ')) {
      flushList();
      const text = block.slice(3).trim();
      const id = slugify(text);
      parts.push(`<h2 id="${id}">${autolink(text, registry, opts)}${anchorLink(id)}</h2>`);
      continue;
    }
    // Bullet item — accumulate; consecutive bullets group into one <ul>.
    if (block.startsWith('- ')) {
      pendingItems.push(block.slice(2).trim());
      continue;
    }
    // Anything else: flush any pending list, then paragraph.
    flushList();
    parts.push(`<p>${autolink(block, registry, opts)}</p>`);
  }
  flushList();
  return parts.join('\n');
}

/**
 * Strip markdown formatting from a YAML summary so it can be used in
 * a <meta name="description"> tag without literal asterisks, hashes,
 * or link syntax leaking into search-engine snippets and social
 * unfurl cards. Returns plain text truncated to ~250 characters at a
 * word boundary.
 */
/**
 * Render inline markdown (**bold**, *italic* / _italic_, [text](url)) to
 * safe HTML for short single-line fields like titles and editorial-take
 * subject questions. Source HTML is escaped first; there is no block
 * structure and no entity autolinking (headings shouldn't sprout links).
 * Use with `set:html`; for plain-text contexts (<title>, citation
 * strings) use stripMarkdownForMeta instead.
 */
export function renderInline(text: string): string {
  if (!text) return '';
  let out = text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');
  // Links [text](url). The URL group only matches root-relative (/…) or
  // http(s):// URLs, so dangerous schemes (javascript:, data:) never form a
  // link. &<> were escaped above; escape any " in the URL too so it can't
  // break out of the double-quoted href attribute.
  out = out.replace(/\[([^\]\n]+)\]\((\/[^)\s]*|https?:\/\/[^)\s]+)\)/g,
    (_m, txt, url) => `<a href="${url.replace(/"/g, '&quot;')}">${txt}</a>`);
  out = out.replace(/\*\*([^\n]+?)\*\*/g, '<strong>$1</strong>');
  out = out.replace(/(?<![*\w])\*([^*\n]+?)\*(?![*\w])/g, '<em>$1</em>');
  out = out.replace(/(?<![_\w])_([^_\n]+?)_(?![_\w])/g, '<em>$1</em>');
  return out;
}

export function stripMarkdownForMeta(text: string, maxLen = 250): string {
  if (!text) return '';
  let out = text;
  // Remove heading markers entirely.
  out = out.replace(/^#{1,6}\s+/gm, '');
  // Convert markdown links to their visible text.
  out = out.replace(/\[([^\]\n]+)\]\([^)\s]+\)/g, '$1');
  // Bold and italic — strip the surrounding asterisks.
  out = out.replace(/\*\*([^\n]+?)\*\*/g, '$1');
  out = out.replace(/(?<![*\w])\*([^*\n]+?)\*(?![*\w])/g, '$1');
  // Bullet markers at line start.
  out = out.replace(/^\s*[-*]\s+/gm, '');
  // Collapse all whitespace runs to single spaces.
  out = out.replace(/\s+/g, ' ').trim();
  if (out.length <= maxLen) return out;
  // Truncate at word boundary, append ellipsis.
  const cut = out.slice(0, maxLen);
  const lastSpace = cut.lastIndexOf(' ');
  return (lastSpace > maxLen * 0.7 ? cut.slice(0, lastSpace) : cut).trimEnd() + '…';
}
