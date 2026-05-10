/**
 * Remark plugin: auto-link entity mentions in markdown content.
 *
 * Mirrors the build-time auto-linker used on entity summaries (src/lib/
 * autolink.ts), but operates on the mdast AST so it can run during the
 * markdown processing pipeline. Used to enrich narratives and themes —
 * markdown bodies that bypass the per-entity summary autolinker.
 *
 * Rules (same as autolink.ts):
 *   - Exact display-name match, longest-first, whole-word, case-sensitive.
 *   - First mention per target entity per file.
 *   - Skip text inside link / code / inlineCode / linkReference parents
 *     (already a link, or syntactically code).
 *   - Skip the current file's own entity (self-reference).
 *   - Names < 4 chars excluded; ambiguous display names dropped.
 */

import { readFileSync, readdirSync, statSync } from 'node:fs';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import yaml from 'js-yaml';
import { visit, SKIP } from 'unist-util-visit';

const __dirname = dirname(fileURLToPath(import.meta.url));
const CONTENT_ROOT = resolve(__dirname, '..', 'content');

/** Sources for the registry: which collections to pull link targets from. */
const COLLECTIONS = [
  { dir: 'events', nameKey: 'name', urlPrefix: '/events', keyType: 'event' },
  { dir: 'people', nameKey: 'name_display', urlPrefix: '/people', keyType: 'person' },
  { dir: 'places', nameKey: 'name_display', urlPrefix: '/places', keyType: 'place' },
  { dir: 'institutions', nameKey: 'name_display', urlPrefix: '/institutions', keyType: 'institution' },
  { dir: 'groups', nameKey: 'name_display', urlPrefix: '/groups', keyType: 'group' },
  { dir: 'deities', nameKey: 'name_display', urlPrefix: '/deities', keyType: 'deity' },
];

/** Markdown-bodied collections — frontmatter under `title`, slug = filename. */
const MARKDOWN_COLLECTIONS = [
  { dir: 'themes', urlPrefix: '/themes', keyType: 'theme' },
];

let registryCache = null;

function readYaml(path) {
  return yaml.load(readFileSync(path, 'utf8'));
}

function readMarkdownFrontmatter(path) {
  const raw = readFileSync(path, 'utf8');
  const m = raw.match(/^---\n([\s\S]*?)\n---/);
  return m ? yaml.load(m[1]) : {};
}

function buildRegistry() {
  if (registryCache) return registryCache;

  const raw = [];

  for (const c of COLLECTIONS) {
    const dir = join(CONTENT_ROOT, c.dir);
    let entries = [];
    try { entries = readdirSync(dir); } catch { continue; }
    for (const file of entries) {
      if (!file.endsWith('.yaml') && !file.endsWith('.yml')) continue;
      const slug = file.replace(/\.ya?ml$/, '');
      try {
        const data = readYaml(join(dir, file));
        const name = data?.[c.nameKey];
        if (typeof name !== 'string' || !name) continue;
        raw.push({
          name,
          href: `${c.urlPrefix}/${slug}`,
          key: `${c.keyType}:${slug}`,
        });
      } catch (err) {
        console.warn(`[remarkAutolink] Failed to parse ${file}:`, err.message);
      }
    }
  }

  for (const c of MARKDOWN_COLLECTIONS) {
    const dir = join(CONTENT_ROOT, c.dir);
    let entries = [];
    try { entries = readdirSync(dir); } catch { continue; }
    for (const file of entries) {
      if (!file.endsWith('.md')) continue;
      const slug = file.replace(/\.md$/, '');
      try {
        const data = readMarkdownFrontmatter(join(dir, file));
        const name = data?.title;
        if (typeof name !== 'string' || !name) continue;
        raw.push({
          name,
          href: `${c.urlPrefix}/${slug}`,
          key: `${c.keyType}:${slug}`,
        });
      } catch (err) {
        console.warn(`[remarkAutolink] Failed to read ${file}:`, err.message);
      }
    }
  }

  // Drop ambiguous names
  const byName = new Map();
  for (const r of raw) {
    if (!byName.has(r.name)) byName.set(r.name, []);
    byName.get(r.name).push(r);
  }
  const candidates = [];
  for (const [name, group] of byName) {
    if (group.length > 1) {
      console.warn(
        `[remarkAutolink] Ambiguous display name "${name}" used by ${group.length} entities. Skipping.`
      );
      continue;
    }
    if (group[0].name.length < 4) continue;
    candidates.push(group[0]);
  }

  candidates.sort((a, b) => b.name.length - a.name.length);
  registryCache = candidates;
  return registryCache;
}

function escapeRegExp(s) {
  return s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

/**
 * Compute an excludeKey from the markdown vfile path so a narrative or theme
 * doesn't auto-link itself when it mentions its own subject.
 */
function fileToExcludeKey(filePath) {
  if (!filePath) return undefined;
  const norm = filePath.replace(/\\/g, '/');
  const parts = norm.split('/');
  const idx = parts.lastIndexOf('content');
  if (idx === -1 || idx + 2 > parts.length - 1) return undefined;
  const collection = parts[idx + 1];
  const file = parts[idx + 2];
  if (!file) return undefined;
  const slug = file.replace(/\.(md|ya?ml)$/, '');
  const map = {
    narratives: 'narrative',
    themes: 'theme',
    events: 'event',
    people: 'person',
    places: 'place',
    institutions: 'institution',
    groups: 'group',
    deities: 'deity',
  };
  const t = map[collection];
  return t ? `${t}:${slug}` : undefined;
}

const SKIP_PARENT_TYPES = new Set([
  'link',
  'linkReference',
  'inlineCode',
  'code',
  'image',
  'imageReference',
  'html',
]);

/**
 * Replace a single text node's value with a mix of text + link mdast nodes,
 * applying the longest-first, first-mention-per-key, exclude-self rules.
 * Returns null if no replacements were made.
 */
function rewriteText(value, registry, usedKeys, excludeKey) {
  if (!value) return null;

  // Find all candidate replacements. Each is { start, end, target }.
  const claimed = [];
  const overlaps = (s, e) => claimed.some(([cs, ce]) => !(e <= cs || s >= ce));
  const replacements = [];
  for (const c of registry) {
    if (c.key === excludeKey) continue;
    if (usedKeys.has(c.key)) continue;
    const re = new RegExp(
      `(^|[^A-Za-z0-9_-])(${escapeRegExp(c.name)})(?![A-Za-z0-9_-])`,
      'g'
    );
    let m;
    while ((m = re.exec(value)) !== null) {
      const start = m.index + m[1].length;
      const end = start + m[2].length;
      if (overlaps(start, end)) continue;
      replacements.push({ start, end, target: c, matched: m[2] });
      claimed.push([start, end]);
      usedKeys.add(c.key);
      break;
    }
  }
  if (replacements.length === 0) return null;

  replacements.sort((a, b) => a.start - b.start);
  const out = [];
  let cursor = 0;
  for (const r of replacements) {
    if (cursor < r.start) {
      out.push({ type: 'text', value: value.slice(cursor, r.start) });
    }
    out.push({
      type: 'link',
      url: r.target.href,
      data: { hProperties: { className: ['auto-link'] } },
      children: [{ type: 'text', value: r.matched }],
    });
    cursor = r.end;
  }
  if (cursor < value.length) {
    out.push({ type: 'text', value: value.slice(cursor) });
  }
  return out;
}

/** The remark plugin factory. */
export default function remarkAutolink() {
  return (tree, file) => {
    const registry = buildRegistry();
    if (!registry || registry.length === 0) return;
    const excludeKey = fileToExcludeKey(file?.path || file?.history?.[0]);
    const usedKeys = new Set();

    visit(tree, 'text', (node, index, parent) => {
      if (!parent || typeof index !== 'number') return;
      if (SKIP_PARENT_TYPES.has(parent.type)) return;

      const replacements = rewriteText(node.value, registry, usedKeys, excludeKey);
      if (!replacements) return;

      parent.children.splice(index, 1, ...replacements);
      return [SKIP, index + replacements.length];
    });
  };
}
