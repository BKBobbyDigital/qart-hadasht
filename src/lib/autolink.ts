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
  return result;
}
