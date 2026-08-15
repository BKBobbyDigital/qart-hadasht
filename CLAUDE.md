# CLAUDE.md — session handoff for Qart-Hadasht

This file is the project briefing for any fresh Claude session. Read it
first. The README is for human visitors; this is for the working agent.

---

## The project in one paragraph

**Qart-Hadasht** is an evolving encyclopedia of ancient Carthage from its
legendary founding (~814 BCE) to its destruction in 146 BCE. It is built
as an Astro static site (TypeScript, Tailwind, content collections) and
deployed via Netlify at qart-hadasht.org. Every factual claim on the site
is sourced, confidence-tagged, and individually citable. The site
foregrounds Carthaginian self-understanding where evidence allows and is
explicit about gaps in the surviving record.

---

## Whose voice this is

The user is **not** a historian. He's framed himself this way and the
site's voice should match: someone who loves ancient Carthage and thinks
the city deserves better treatment on the open web than it currently has.
Most of what survives about Carthage was written by its enemies; what
little is widely read is mostly the dramatic highlights with the long arc
and the structural questions left out.

The "From the encyclopedia" section on the homepage captures this:

> I'm not a historian. I'm just someone who loves ancient Carthage and
> thinks the city deserves a better place on the open web than it
> currently has... The synthesis is mine; the underlying scholarship is
> everyone else's.

**When writing prose**, you should match this register: substantive,
positions-taking, but humble about the source base. Where the site takes
a position, it labels it as an editorial take or claim with explicit
confidence; the prose itself should not speak with God-voice.

---

## Architectural overview

### Stack

- **Astro 5** static site, TypeScript, Tailwind 3, content collections
- **Pagefind** for client-side search (built into the postbuild step)
- **Leaflet** for maps
- **Two custom remark plugins**:
  - `remarkAutolink.mjs` — auto-links entity mentions in markdown to
    their pages, first-mention-per-entity. Reads frontmatter from
    every entity collection (events, people, places, institutions,
    groups, deities, themes, artifacts) at build time and rewrites
    matching text nodes into `<a>` links. Mirrored at runtime by
    `src/lib/autolink.ts` for entity-page summary `set:html` prose;
    both share the same accept/reject rules (whole-word match,
    longest-match-wins, ambiguous-name skip, first-mention-per-key,
    `excludeKey` for self-references). The runtime `autolink.ts` also
    processes markdown-style `[text](url)` links in YAML summary fields
    as a first pass, converting them to anchor HTML before the entity-
    autolink pass — this lets YAML prose embed explicit links to
    editorial takes, narratives, and open questions inline.
  - `remarkCitations.mjs` — auto-links ancient-source citation patterns
    (Polybius 3.22, Plutarch *Cato Major* 27, etc.) to source pages

### Content collections (data model)

Located in `src/content/`. The schema is in `src/content/config.ts`.

| Collection | Type | Purpose |
|---|---|---|
| `events` | data | Battles, treaties, foundings, political crises, wars |
| `people` | data | Individuals (Hannibal, Cato, Dido, etc.) |
| `places` | data | Cities, battlefields, regions, rivers |
| `sources` | data | Ancient texts and modern scholarship — first-class entities |
| `claims` | data | **Atomic** factual statements with citations and confidence |
| `editorialTakes` | data | The site's own labeled positions on contested questions |
| `openQuestions` | data | What we don't know — gaps as first-class entities |
| `artifacts` | data | Material culture (stelae, coins, inscriptions, ships) — first-class evidence, parallel to sources |
| `narratives` | content (md) | Long-form interpretive prose (biographies, debates, event arcs) |
| `themes` | content (md) | Cross-cutting topics (religion, agriculture, governance, etc.) |
| `periods` | content (md) | Era-level synthesis (7 chronological periods) |
| `threads` | content (md) | Curated multi-page reading paths |
| `groups` | data | Collective entities (Mamertines, Numidians, dynasties) |
| `institutions` | data | Formal civic/political/sacred bodies |
| `deities` | data | Carthaginian pantheon entities |
| `causalLinks` | data | Explicit cause→effect relationships between events |
| `sourceComparisons` | data | Side-by-side parallel readings of contested events through multiple ancient sources, with points-of-difference and the site's working reconstruction |

### Render routes

Each collection has a `[slug].astro` route under `src/pages/<collection>/`
plus an `index.astro` listing page. The render pages compute reverse-
lookups (e.g., events that reference this person) and render them as
sidebar/footer sections with cross-links.

### Page structure pattern

Most entity detail pages follow this structure on `lg:` screens:

```
[two-column grid]
  article                    Infobox (right rail, sticky)
  ├── eyebrow label           - Quick facts
  ├── h1                      - Date / Type / Location
  ├── lead paragraph          - Belligerents / Commanders
  ├── name aside              - Sources cited (count)
  ├── prose body
  ├── reverse-lookup sections
  └── footer
```

On mobile: infobox renders at top but **collapsed by default** (a compact
"QUICK FACTS ▾" bar), so it doesn't bury the entry's name/prose; the
article headline and body flow directly below it. It's rendered `open` in
SSR (desktop + no-JS both show it expanded) and an inline script in
`Infobox.astro` collapses it below `lg` before paint — `d.open =
matchMedia('(min-width:1024px)').matches`, re-applied on breakpoint change.
On `lg+` it's the always-open sticky right-rail panel.

---

## Editorial conventions

### Prose discipline rules

Three house-style rules that apply to all content the project ships:

**No version self-references.** Do not write things like "in V1's
scope," "the V1 scope of this site," "this version of the
encyclopedia," or "out of scope for the first version." The site's
internal roadmap is not the reader's concern. Frame scope statements
in terms of the historical content itself ("of the Punic period,"
"outside the principal Punic-period focus"), not in terms of site
versions. Cross-references like "treated separately on this site as
an open question" are fine — those describe the site's structure,
not its version history.

**Em dash discipline.** Em dashes ("—") are heavily over-used by
default in long-form generated prose. Aim for **at most one em dash
per ~250 words**, and prefer commas, parentheses, periods, semicolons,
or colons in most cases. Em dashes are the right choice for: (a) a
sharp interruption mid-sentence with strong rhetorical weight; (b) a
list-in-apposition where the items themselves contain commas. They
are the wrong choice for: routine parentheticals (use commas or
parens), list expansions (use a colon), sentence breaks where a
period would do, or "for emphasis" where the content is unremarkable.
A long-form piece with more than ~10 em dashes is almost certainly
overusing them; pause and convert.

**AI-tic vocabulary discipline.** LLM-generated prose reaches by
default for an abstract analytical vocabulary that reads as
generic-systems-thinking rather than as substantive historical
writing. Watch these tells in particular:

- **The four-word cluster:** "structural / substantively /
  operationally / load-bearing." The corpus target is
  fewer than 10 instances per 1,000 words of these four
  combined. "Substantively" is almost always droppable;
  "load-bearing" can usually become "central" or "decisive";
  "structurally" and "operationally" are often empty
  adverbs that can be deleted without loss.
- **Nominalizations:** "The prisoner-release pattern shows
  X" reads better as "Hannibal released prisoners; that
  shows X."
- **Bolded inline mini-headings** (`**The X.**` opening
  every paragraph of a reasoning section). Strip them;
  the sentences flow as normal prose.
- **Formulaic closers:** "What the position is not claiming.
  This is not X. This is not Y..." and the
  "Confidence is moderate. The X is firmly attested..."
  paragraphs that close editorial-take reasoning bodies.
  Confidence belongs in the YAML metadata; the prose
  should close on substance.
- **Hyphenated noun compounds:** "alliance-dismemberment
  program" or "manpower-and-treaty infrastructure" pack
  thought-units into noun phrases that real prose would
  unpack into clauses.
- **Triadic structure abuse:** "Three converging lines of
  evidence" or "Three observations support the reading"
  is fine once but becomes formulaic if it opens every
  editorial-take reasoning section.
- **The "X reading" / "Y framing" nominalization:** "the
  alliance-dismemberment reading", "the Polybian framing",
  "the institutionally-mixed reading" — useful but
  overcrowded in default LLM prose.

Run `node scripts/tic-rank.mjs` to spot regression. Run
`node scripts/delm.mjs` (dry run by default; `--apply` to
write) for the safe mechanical pass. Anything beyond that
is per-file judgment work.

### The confidence vocabulary

Every claim on the site is tagged with one of:

- **`attested`** — directly stated in primary sources, not meaningfully
  disputed (emerald chip)
- **`inferred`** — reasoned from primary evidence; not directly stated
  but well-supported (sky chip)
- **`contested`** — genuinely disputed in the ancient sources, among
  modern scholars, or both (amber chip). A former separate `disputed`
  category (rose chip, modern-scholarship-only disagreement) was
  folded into `contested` in June 2026; it had zero uses.
- **`legendary`** — drawn from legendary or mythologized tradition;
  historicity uncertain (stone chip)

The `ConfidenceBadge` component renders these with a colored dot + label.
Use it consistently anywhere a confidence label appears.

### Claims vs. editorial takes vs. narratives

**Three distinct content kinds for the synthesis layer:**

- **Claims** are atomic factual statements with explicit citations and a
  single confidence rating. One assertion per claim. Linked from entity
  pages.
- **Editorial takes** are the site's *own* labeled positions on contested
  or interpretive questions. Each has a `subject_question`, `position`,
  `reasoning` body, `confidence` (tentative/moderate/strong), and
  `competing_positions` with `held_by` and `why_rejected`. Use these for
  positions that the surviving sources don't directly state — modern
  synthesis arguments.
- **Narratives** are long-form interpretive markdown prose. Used for
  biographies, debate histories, event arcs. Have a `thesis` and
  `primary_entities` and link to claims.

When the user gives feedback on prose like "this should be flagged as our
take," the right move is: pull the strongest position out into a formal
`editorialTakes/<slug>.yaml`, add a link to it from the prose, and
qualify the prose to attribute the position.

### Source rigor — the load-bearing thing

The user has explicitly said source-weaving is **the most important
thing** about the site. Every claim cites sources. Treat this as the
trust mechanism the entire site depends on.

Conventions:
- **Each claim has a `sources` array** with `source` reference,
  `stance` (`supports` / `contradicts` / `qualifies`), `passage_ref`,
  and `passage_summary` (our paraphrase, NOT a copyrighted translation).
- **Source-distance chips** appear next to each cited source on claim
  cards. The temporal gap between source composition and the events
  described is visible at a glance (the `SourceDistance.astro`
  component).
- **Inline citation linking** in narrative/theme/period prose is
  automatic via `remarkCitations.mjs` for ancient-source patterns
  ("Polybius 3.22", "Plutarch *Cato Major* 27", etc.).
- **Period pages list `principal_sources`** in their frontmatter — both
  ancient sources and modern scholarship the synthesis draws on.

When writing new content: cite explicitly, paraphrase rather than
quote-translate, weight archaeological/inscriptional evidence as
heavily as literary where appropriate.

### Take with opposition, label confidence

When prose takes a position:
1. Frame as "the site's reading" or "on this site's position"
2. Link to the formal editorial take if one exists
3. Name the competing reading and *why* it's rejected
4. Be explicit about whether the position is `inferred` synthesis or
   directly attested

The user's stated preference: *"strong takes are fine, but always call
out opposition and always denote the reality of how clear/true something
is known."*

---

## Visual design language

### Palette + type (Direction C redesign, Aug 2026)

A full editorial redesign toward a **modern magazine** feel (the
"Direction C" mockup): away from the ancient/Cormorant look, toward
big crisp grotesque headlines, high contrast, and tyrian promoted
from accent to a small graphic system. The masthead is the one
heritage element kept.

**Fonts** (loaded in `global.css` `@import`):
- **Bricolage Grotesque** — the display face for ALL headings and
  leads. Wired via the Tailwind `serif` family (kept that legacy
  class name to avoid churning 200+ `font-serif` usages — it now
  resolves to Bricolage, NOT Cormorant). Also aliased as `display`.
- **Inter** — body / UI (`sans`), 18px base, prose 19px.
- **Fraunces** — the masthead + footer wordmark only, via the
  `heritage` Tailwind family. A modern editorial serif (replaced
  Cormorant, which read too delicate/old). The one serif on the site.
- **Noto Sans Phoenician** — the wordmark glyph row.

**Colors** (`:root` in global.css):
- Canvas + surface: white `#ffffff`. Secondary surface `--color-rail`
  `#f5f5f6`. Hairline `--color-rule` `#e8e8ea`.
- Text `#0f0f11` (near-black), muted `#6a6a72` (neutral gray).
- Tyrian `#5b0f31` — now a graphic system, not just link color:
  the kicker leading-rule, drop-caps, section numbers, rail bars,
  lead standfirst rule.

**Signature elements:**
- `.eyebrow` — Bricolage, tyrian, uppercase, with a short tyrian
  **leading rule** (`::before` bar). Add `.no-bar` for tight/label
  contexts (masthead tagline, nav group labels).
- `.lead` — Inter-medium standfirst behind a 4px tyrian left-rule.
  Replaced the old boxed serif-italic abstracts (the narrative/period
  abstract boxes were unboxed into `.lead`). Used in exactly two
  places: narrative theses and period summaries. **Sized moderately**
  (`clamp(1.18rem, 1.7vw, 1.36rem)`, line-height 1.5), NOT at a big
  one-line-dek size — those fields hold 150–200-word abstracts, and the
  earlier ~1.72rem size turned them into a wall of oversized text.
  Distinct from body (larger + medium weight + rule) but calm enough to
  read as an intro paragraph. If a thesis still feels heavy, the lever
  is content (tighten the thesis), not type size.
- `.longform` (added to narrative/theme/period content divs) — adds
  a **tyrian drop-cap** on the first paragraph and **auto-numbered
  `01 / 02` tyrian section heads** (CSS counters) on its `h2`s.
  Scoped so short entity summaries (also `.prose-encyclopedia`) stay
  plain.
- Headings: Bricolage 700/800, tight tracking, `text-wrap: balance`.
  `h1` uses one fluid `clamp(2.35rem, 4.8vw, 3.85rem)` in global.css
  (dialed down Aug 2026 from an earlier `5rem`-cap that read oversized
  once the shell widened to `max-w-6xl` — single-word index titles like
  "Periods" hit the cap); the per-page Tailwind size utilities
  (`text-4xl` etc.) were stripped off every `<h1>` (38 files) so the
  global scale actually governs.
- Infobox: white card with a **filled tyrian header bar** ("QUICK
  FACTS" in white Bricolage), not the small kicker-bar.
- Prose h2: strong 2px near-black top rule.
- Oldstyle figures were DROPPED (they read "old"); prose uses normal
  lining figures now.

**Site width** (Aug 2026): the outer shell is **`max-w-6xl` (1152px)**
everywhere — header, footer, homepage, index pages, and entity
`[slug]` pages. Previously split (index/homepage `max-w-4xl` 896px,
detail pages `max-w-5xl` 1024px), which left the masthead narrower
than the content beneath it and felt cramped on a 13". Unified so the
masthead and content align and the primary nav fits on one line at
≥~1100px. Inner reading caps are untouched: `.prose-encyclopedia p`
holds `max-width: 68ch`, and intro blocks keep `max-w-3xl`/`max-w-2xl`,
so widening the shell adds whitespace/rail room, not longer lines. To
re-widen or narrow the whole site, change the `max-w-6xl` shells (43
of them; a `find src -name '*.astro' | xargs perl -pi` sweep).

**Single-column reading pages** (thread / editorial-take /
open-question / claim detail pages, search) use a **left-aligned**
`max-w-3xl` reading column nested inside the `max-w-6xl mx-auto px-6`
shell — NOT `max-w-3xl mx-auto` (which centered the column and left it
indented from the masthead's left edge). The column packs to the left
like the article column on the two-column entity pages; the extra width
is right-side whitespace. Only `thanks.astro` stays deliberately
`mx-auto text-center` (a confirmation screen).

**About + Methodology** go a step further: they're long enough to earn
a **sticky `ContentToc` rail** (the "On this page" section list), so
they use the two-column `lg:grid-cols-[minmax(0,1fr)_220px]` layout —
`max-w-3xl` prose column on the left, TOC rail on the right (`hidden
lg:block`, so mobile stays single-column). This needed `id`s on their
hard-coded `<h2>`s (the `.astro` pages don't get rehype-slug ids that
`.md` content does); a build-time slug was added to each, which also
gave these pages working ¶ heading-anchor permalinks. `ContentToc`
walks `h2[id]/h3[id]` inside its `contentSelector` and hides itself
under 2 headings.

**Entity kicker consistency:** every entity detail page leads with an
`.eyebrow` kicker (`{type}`, `Person · {role}`, `Deity`, `Group · …`,
etc.) directly above the `<h1>`. People and deities previously led with
the Punic-script name glyph instead; the glyph now sits **below** the
`<h1>` (native-script name under the romanized name), so the kicker is
the first element on all of them.

**Header / footer chrome** (`BaseLayout.astro`):
- Masthead sits on **white** (was the cream `sand-100` band); header
  and page share one surface, separated only by rules.
- The masthead is **left-aligned** (mock-c): Phoenician glyph row +
  Fraunces wordmark pack to the left; the Tanit mark + tagline cluster
  sit inline at the right (mark then right-aligned tagline). Below
  `sm` the tagline text hides (Tanit mark stays) and the wordmark is
  `whitespace-nowrap` at a slightly smaller size so it never breaks at
  the hyphen. The tagline's responsive toggle lives on a **wrapper
  div**, because `.eyebrow` hard-sets `display:inline-flex` in
  global.css and would override a `hidden` placed directly on it.
- Primary nav is **stacked columns** ("Option B", chosen Aug 2026 over
  an inline single-row layout that read as one jumbled string): each
  group is a left-aligned column with a tyrian `.eyebrow.no-bar` label
  sitting **above** its links (links separated by `·` middots). The
  three columns sit side by side (`flex flex-wrap gap-x-12`) and wrap
  as whole units; on mobile they stack label-over-links, still
  left-aligned. Stacking the label above the links is what separates
  the group heads from the link text.
- A **5px tyrian top bar** opens the page — this one is **full-bleed**
  across the viewport (per user preference; the only full-width rule).
  A hairline divides brand from nav; a **3px near-black rule** closes
  the nav, and that rule is **held to the content column** (inside the
  `max-w-6xl` container), not full-bleed.
- Footer bookends it: a **4px tyrian top bar** on a faint-gray
  (`#f6f6f7`) surface. Redesigned Aug 2026 as a **brand sign-off**
  ("Direction C", chosen over an editorial-sitemap-columns option and a
  balanced-two-end option): the Phoenician wordmark glyph row + a large
  Fraunces `Qart-Hadasht` (`text-[2rem] sm:text-[2.6rem]`) as a closing
  moment, then a one-line tagline, a hairline, a flat link row (About ·
  Methodology · Sources · Reading threads · Maps — ink links, tyrian
  hover), and the CC-BY/MIT license line. Replaced the old thin
  left-huddled Tanit-mark + 4-link cluster, which read sparse in the
  wide `max-w-6xl` shell.

The earlier all-cream and white/modern palettes are fully superseded.
The redesign was aligned faithfully to the chosen `mock-c.html`
(scratchpad) after a first pass under-shot it — see the "faithful to
mock-c" commit. Verified on homepage, narrative, and entity pages.

### The Tanit mark

The schematic sign of Tanit (triangle body + horizontal arms bar +
circle head) is the brand mark. SVG component at
`src/components/TanitMark.astro`. Used in masthead, footer, and
favicon. Phoenician script lockup is preserved alongside.

### Hover / click states (current, post-Direction-C)

- **Hover**: bg shifts to an on-brand purple tint (`hover:bg-tyrian-50`,
  `#faf0f4`); border darkens to `tyrian-500`.
- **Active/click**: bg deepens one step to `tyrian-100` (`#f5dee8`),
  so the click still registers a change on top of the purple hover.
- Applied **uniformly** to every card, sortable table row, list tile,
  and the search-modal / battle-diagram / cite-panel hover surfaces.
  Unified Aug 2026 (`hover:bg-sand-100`→`tyrian-50`, 52 sites;
  `active:bg-tyrian-50`→`tyrian-100`, 35 sites) after the hover color
  was found to be inconsistent — some cards hovered warm-gray
  (`sand-100`, read "brownish"), some hovered purple. Now all purple.
- (Historical note: the earlier neutral `sand-100` hover, the cream
  `#faf6ec` hover, and the lavender `purple-100` active are all gone —
  don't reintroduce them. Two intentional one-offs remain and are NOT
  cards: `hover:bg-tyrian-900` and `hover:bg-tyrian-200`.)

### Card system (normalized Aug 2026)

Cards grew page-by-page without a shared component and drifted. They
were normalized to one vocabulary (the homepage was later rebuilt in
this system too — see "Homepage redesign" below):

- **Radius**: `rounded-lg` everywhere.
- **Background**: solid white `bg-sand-50`. The translucent `bg-white/60`
  and `bg-sand-50/60` variants were swept out — they read muddy on the
  faint-gray (`sand-100`) band sections; solid white is crisp on both
  white and gray.
- **Border**: standard cards `border-sand-300` (the stray `sand-400`
  hairlines were reconciled to `sand-300`). **Feature cards** — the
  deliberately emphasized ones (featured editorial take, the Carthage
  callout on /themes, the "matching narrative" boxes on people/events,
  the About aside) — use **`border-tyrian-300`**. The tyrian-tinted
  border IS the feature signal; keep it, don't flatten it to sand-300.
- **Padding**: two tiers only — **`p-4` compact** (sidebar cross-link
  rows, dense list rows) and **`p-5` standard** (main index / grid /
  feature cards). The old `p-3` and `p-6` outliers were collapsed into
  these. (`components/Timeline.astro` keeps a responsive `p-3 sm:p-4`
  container padding — not a card, excluded.)
- **Hover/active**: the unified purple progression documented above
  (`hover:bg-tyrian-50 hover:border-tyrian-500 active:bg-tyrian-100`).
- **Meaningful type differences that STAY distinct**: list-row (`block`,
  dense) vs grid (`flex flex-col h-full`, equal height) vs media (carries
  an image, e.g. places/artifacts) vs feature (`border-tyrian-300`).
  Panels (`Infobox`, `CiteThisPage`) are not cards and are styled
  separately by design.
- There is still **no shared `<Card>` component** (only `ClaimCard`
  exists). A future refactor could extract one with these variants so
  pages can't drift again; until then, match an existing card's class
  string rather than inventing new token combinations.

### Components

Key components in `src/components/`:
- `Infobox.astro` — right-rail Quick facts panel; supports `emptyLabel`
  override (use `'none'` for count rows, default `'unknown'` for
  date/categorical rows)
- `Bibliography.astro` — auto-derives per-entity "Further reading"
  list from `relatedClaims`; splits ancient sources / modern
  scholarship; sorts by citation count desc; honors optional
  `principalSourceIds` (for entities with curated `principal_sources`)
- `MaterialEvidence.astro` — surfaces artifacts on entity pages via
  two derivation paths: (a) artifact frontmatter `referenced_themes`
  for theme pages, (b) claim co-occurrence for everyone else
- `ConfidenceBadge.astro` — claim confidence chip
- `EditorialConfidenceChip.astro` — editorial take confidence chip
- `SourceDistance.astro` — temporal-distance chip on cited sources
- `Map.astro` — Leaflet map for places/events (uses OSM tiles; older
  point-marker maps for individual places and events)
- `HistoricalMap.astro` — server-side SVG historical-atlas map. Cream
  paper background, Natural Earth 50m coastline, translucent
  polygons for territory, route lines for campaigns, city markers
  with Fraunces labels. No OSM tiles, no client JS. Map configs
  live in `src/data/maps/*.json`; coastline data in
  `src/data/coastline-mediterranean.json`. Period and event frontmatter
  can opt in via `map_id` + `map_caption` fields. Currently used for
  the three Punic War strategic maps (FPW, SPW, TPW) on the period
  pages and on the war-level event pages.
- `Timeline.astro` — keystone-events horizontal strip; no longer
  rendered anywhere (removed from /events when the Timeline view
  became the default). Preserved for potential future reuse.
- `TerritorialExtentMap.astro` — multi-state SVG map with date
  toggle. Sticky toggle group, segmented control; five named
  states (550/264/218/202/146 BCE); core/tributary/network/lost
  polygon types with distinct visual encoding (solid /
  diagonal-hatch / translucent dashed / faint dashed). Powers
  /maps/extent-over-time.
- `TanitMark.astro` — brand mark SVG. Used in masthead, footer,
  favicon, PWA icons, 404 page, place-index placeholder.
- `CmdKSearch.astro` — global Cmd-K search modal (native
  `<dialog>`; tracked via search-opened / search-query events).
- `IndexViewToggle.astro` — Cards / Table / Timeline view
  switcher. `views` prop lists supported views per page;
  `defaultView` prop sets the initial fallback (e.g. /events
  defaults to Timeline).
- `VersionStamp.astro` — "Last revised [date] · View revision
  history on GitHub →" footer. Surfaces frontmatter
  last_revised / last_reviewed; links to the file's GitHub
  commit log. Carries `data-version-stamp` for the
  read-complete IntersectionObserver in BaseLayout.
- `CiteThisPage.astro` — collapsible citation panel with
  Chicago / APA / MLA / BibTeX / RIS formatted strings + copy
  buttons. Institutional authorship only.
- `BattleDiagram.astro` — data-driven tactical battle diagram
  renderer. Reads a `BattleDiagramConfig` from
  `src/data/battles/<event-slug>.ts` and renders the parallel
  phase tiles plus a fullscreen `<dialog>` lightbox with
  prev/next phase navigation, keyboard arrow keys, touch swipe,
  and tap-backdrop-to-close. Currently used by seven event pages
  (Cannae, Trebia, Trasimene, Zama, Bagradas, Ilipa, Metaurus).
  Replaced the bespoke `CannaeDiagram.astro` from earlier work.
- `FamilyTree.astro` — data-driven dynasty / family-tree renderer.
  Reads a `FamilyTreeConfig` from `src/data/dynasties/<slug>.ts`
  (types in `src/lib/familyTree.ts`) and renders the tree as a
  single SVG. Nodes with a `personSlug` become clickable links to
  the person page; uncertain nodes get dashed borders and italic
  labels; context nodes get reduced opacity. Edges route
  orthogonally with optional hand-placed waypoints. Solid =
  parent, dashed = marriage, dotted = sibling. Currently
  rendering five dynasties (Barcids, Massylii, Magonids, the Roman
  Cornelii Scipiones, and the House of Tyre — the legendary Tyrian
  founding line).

### Sortable index tables

Index pages (`/events`, `/people`, `/places`, `/sources`) have a
view toggle. /events supports Cards / Table / Timeline with
Timeline as default. Others use Cards / Table. Tables sort on
column header click. Cards are forced on mobile.

### Imagery: places + artifacts

The artifacts collection has imagery in 38 of 41 entries (PD or
CC BY / CC BY-SA from Wikimedia Commons). The places collection
has imagery in 28 of 46 (added in two passes during the
next-level work).

For places that don't have imagery, the index card renders a
Tanit-watermark placeholder (low-opacity TanitMark on sand-100
background) so the grid stays visually consistent. Same
placeholder pattern was retrofitted onto the artifact index for
the 3 artifacts without images.

`scripts/fetch-place-image.mjs` is the reusable Wikimedia
Commons fetcher: pass a slug and a Commons file title; it
downloads the image (~1400px width) to public/places/ and prints
a ready-to-paste YAML image block. Use it for future imagery
additions.

---

## What's been recently shipped

The visual redesign is **Phase 1 + 2 complete**. Phase 3 (dark mode) is
parked until the day version settles. The site is **~694 pages** as of
the last build.

### Collection counts (current)

| Collection | Count |
|---|---|
| events | 93 |
| people | 82 |
| places | 57 |
| sources | 64 |
| claims | 172 |
| editorialTakes | 24 |
| openQuestions | 19 |
| artifacts | 41 |
| narratives | 41 |
| themes | 18 |
| periods | 8 |
| threads | 7 |
| groups | 18 |
| institutions | 6 |
| deities | 10 |
| causalLinks | 12 |
| sourceComparisons | 9 |

### Headline state (post next-level pass)

The 6-item active queue completed: link audit, prose proofread,
place imagery, chronological spine, citation rigor, accessibility.
Plus a substantial follow-on: analytics, 404, PWA, period 07 split,
places imagery expansion, artifact placeholder consistency.

Headline numbers:
- 694 pages indexed
- 38 of 56 places imaged; 38 of 41 artifacts imaged
- 0 broken internal links; 0 accessibility findings on user-facing pages
- Em-dash density 73% reduced from initial audit; AI-tic vocabulary
  (`structural`/`substantive`/`operational`/`load-bearing`) reduced
  by ~50% corpus-wide via two de-LLM passes
- Privacy-first analytics live with 9 tracked event types
- Installable PWA with Tanit-mark icon set
- Citation rigor: anchored headings, BibTeX/RIS/APA/MLA/Chicago export, version stamps with GitHub-history links
- Ten battles have tactical diagrams: seven land (Cannae, Trebia,
  Trasimene, Zama, Bagradas, Ilipa, Metaurus) and three naval
  (Ecnomus, Drepana, Aegates Islands), all in the June 2026
  atlas-plate idiom (numbered six-step Cannae as the model:
  phase descriptions, navy-Rome/tyrian-Carthage, hatch/dot
  cavalry patterns, curved sweep arrows), with a data-driven
  SVG component and a tap-to-enlarge dialog with prev/next
  phase navigation
- Nine source-comparison entries — a new first-class collection
  presenting contested events through multiple ancient sources in
  parallel, with the site's source-rivalry methodology made visible
  as a reading interface
- Six Louis Rawlings citations integrated across army-composition,
  Iberian-side-switching, Italian-allied defection, Hannibal-and-
  Hercules, and Polybian-atrocity-framing material

### What shipped in the next-level pass (most recent major work)

**1. Internal link audit (scripts/link-audit.mjs).** Scripted crawl of
every `<a href>` in dist against actual page existence. Surfaced 16
broken links + the entire missing `/openQuestions/` route (the
collection had 13 entries that had never rendered as pages because
the route was missing). Built the route. Re-audit clean.

**2. Prose proofread pass (scripts/prose-audit.mjs +
scripts/emdash-fix.mjs).** Auditor flags em-dash density (≤1 per
250 words per house style), version self-references, doubled
words, repeated phrases. 249 → 68 flagged files via scripted
paired-parenthetical conversion (`X — phrase — Y` → `X (phrase) Y`
or `X, phrase, Y` depending on internal commas). 558 conversions
across 242 files. Residual 65 are single em-dashes needing
human judgment; tracked for later.

**3. Place imagery (scripts/fetch-place-image.mjs).** Wikimedia
Commons fetcher with proper UA + metadata extraction + auto-emitted
YAML block. 28 places imaged in total across two batches. The
remaining ~16 are battles in obscure locations or broad regions
where Wikimedia doesn't have good iconic imagery; they keep the
Tanit-watermark placeholder card.

**4. Year-by-year chronology (Timeline view).** The original plan
was a separate /chronology collection. User flagged the duplication
correctly and we built it as a third view on /events instead.
Timeline view groups by era (the 8 site periods), then by year,
with one-line event entries. Sticky era-jump nav on the right rail.
Anchor IDs (#era-XX, #year-NNN) for prose cross-references. Default
view (was Cards).

**5. Citation rigor.** Three components:
- Anchored heading permalinks: every <h2>/<h3> on substantive pages
  gets a hover-revealed ¶ pilcrow that copies the absolute URL+hash
  to clipboard. JS-based (handles both YAML-summary headings and
  .md content headings); CSS `:target` flash; `.anchor-copied` class
  for "link copied" feedback.
- CiteThisPage component: collapsible panel on narratives/themes/
  periods/threads/editorial-takes with Chicago / APA / MLA / BibTeX /
  RIS formatted strings + copy buttons. Authorship is institutional
  ("Qart-Hadasht: An Encyclopedia of Ancient Carthage") — no
  personal attribution per user direction.
- VersionStamp component: "Last revised [date] · View revision
  history on GitHub →" footer on substantive pages. Date parsed
  without timezone shift (YYYY-MM-DD treated as local).

**6. Accessibility + performance audit (scripts/a11y-audit.mjs).**
Initial run flagged 6 categories; all real-page findings resolved:
- Skip-to-main-content link added in BaseLayout with off-screen-
  until-focused CSS
- Masthead "Qart-Hadasht" wordmark demoted from h1 to styled p with
  aria-label; homepage gets its own sr-only h1
- ClaimCard, EditorialTake, CannaeDiagram heading hierarchy fixes
  (h4/h5 widget-internal labels demoted to styled p; promoted some
  h3s to h2 where they were document-outline sections)
- :focus-visible outline on all focusable elements
- HTML comment false-positive in audit fixed
Final state: 0 a11y findings on all 623 user-facing pages.

**7. GoatCounter analytics.** Privacy-first (no cookies, no
personal data), ~3KB async script. window.qhTrack() helper wraps
the GoatCounter API. Nine tracked event types:
- cite-panel-open
- cite-copy:<format>
- anchor-copy
- github-history-click
- search-opened / search-query
- outbound-click:<host>
- read-complete (IntersectionObserver on VersionStamp footer)
- not-found (with attempted path)
Methodology page extended with full disclosure section.

**8. Custom 404 page.** Massive Phoenician 𐤋𐤀 ("not" / lo) glyph at
clamp 7–14rem in tyrian, site-voice paragraph, four entry-point
cards (Home/Periods/Events/Narratives), Cmd-K hint. Fires
not-found tracking event.

**9. PWA manifest.** Tanit-mark icon set (favicon.svg 64x64,
icon-maskable.svg 512x512 with Android adaptive-icon safe zone,
apple-touch-icon.svg 180x180). site.webmanifest with standalone
display, tyrian theme color, three quick-action shortcuts
(Periods, Maps, Search). Installable PWA (not offline-capable —
service worker is a separate future item).

**10. Period 07 split.** Previously period 07 was "The long peace
and destruction" (201–146), jamming the fifty-year peace and the
four-year war crisis into one chapter. Split into:
- Period 07: The long peace (201–150)
- Period 08: The Third Punic War and destruction (150–146)
Now the events Timeline view shows symmetric era treatment across
all three Punic Wars (FPW=period 04, SPW=period 06, TPW=period 08).
Two thread refs updated; the TPW strategic map moved to period 08.

**11. Markdown rendering in YAML summaries.** A bug where `##
heading`, `**bold**`, `*italic*`, bullet lists, and nested
bold/italic were rendering as literal text in YAML summary fields
across places, people, events, etc. Fixed via:
- Extended autolink.ts with inline-bold/italic passes alongside
  the existing markdown-link pass
- New renderSummaryHtml() helper handles block-level structure
  (headings, paragraphs, bullet lists with continuation-line
  normalization)
- All 8 entity render templates updated to use it
- stripMarkdownForMeta() helper for <meta description> contexts
- ClaimCard and EditorialTake components updated to use the
  renderSummaryHtml pipeline with an empty link registry
- Audit: 0 literal markdown in body content (was 133 + 259 + many)

### Scripts in scripts/

| Script | Purpose |
|---|---|
| link-audit.mjs | Crawl dist/ for broken internal links |
| prose-audit.mjs | Em-dash density + version self-refs + repeated phrases |
| emdash-fix.mjs | Targeted paired-parenthetical em-dash conversion |
| fetch-place-image.mjs | Wikimedia Commons image fetch + YAML block emit |
| a11y-audit.mjs | Static a11y violation scan + asset-weight signals |
| tic-rank.mjs | Rank all content files by AI-tic vocabulary density |
| delm.mjs | Mechanical de-LLM pass (bold mini-headings, boilerplate closers, safe word subs) |

All reusable; each prints results to stdout and (where applicable)
modifies files only with --apply flag.

### The MacDonald-direction framing pass (most recent major work)

A multi-session effort to address what an Eve MacDonald-style critique
would flag — the under-developed substantive dimensions of the site
that, if filled, would move it from good encyclopedia to important
encyclopedia. Ten items identified; all ten addressed. The framing
discipline throughout: **describe what specific people did within
documented structures; do not project modern frameworks back; treat
non-Greco-Roman peoples and Carthaginian women as active agents of
their own history; lead with non-Roman primary evidence where it
exists.** Each item produced new content with full back-citation:

1. **Hannibal as integrated Punic-Hellenistic figure** — covered
   via the cultural-integrator editorial take rather than as
   "Hellenistic-first" reframing
2. **Barcid Iberian state as substantive state-building** —
   `narratives/the-barcid-iberian-state.md`,
   `editorialTakes/barcid-iberian-state-as-state.yaml`, two
   load-bearing claims, period 05 rebalanced, coinage artifact
   expanded, Hasdrubal the Fair reframed
3. **Hellenistic Carthage as integrated** — formalized as
   `editorialTakes/carthage-as-cultural-integrator.yaml`: active
   cultural integrator on Punic terms, with class-stratification
   observation explicit (elite Hellenization deeper than popular)
4. **Punic inscriptional record as primary evidence category** —
   `themes/punic-inscriptional-record.md`, CIS and KAI source
   entries, Marseille Tariff and Carthage Tariff artifacts
5. **Italian/French/Spanish scholarship as proper sources** — six
   new non-Anglophone source entries (Moscati, Ribichini, Xella,
   Krings, Bonnet *Astarté*, López Castro), all fully back-cited
6. **Punic continuity in Roman Africa** —
   `narratives/punic-continuity-in-roman-africa.md` with the
   "no hard endpoint" framing discipline, open question on
   duration of Punic identity, Bénabou / Jongeling / Augustine
   as new sources, period 07 closing rewritten to disown the
   146-as-endpoint framing
7. **Women and family** — substantial theme rewrite with the
   "describe what's attested; don't project modern frameworks"
   discipline, Sophonisba page expanded with historiographical
   reframing (parallel to Indibilis-Mandonius), open question on
   what surviving evidence does and doesn't permit reconstruction
8. **Numidian-Punic interface** —
   `narratives/the-numidian-punic-interface.md`, Gala person page,
   Libyans group page (distinct from Libyo-Phoenicians),
   `editorialTakes/masinissa-strategic-opportunist.yaml` (not
   "Roman client" not "architect of destruction" but strategic
   opportunist with longevity-enabled patience), Masinissa person
   page substantially expanded, period 07 Masinissa section
   reframed
9. **Phoenician colonial network as system** —
   `themes/phoenician-colonial-network.md` with the network-first
   framing (Carthage as emergent dominant node larger than the
   system it produced), Bonnet *Cadmos* source, Melqart-cult-as-
   network-infrastructure claim, foundation narrative rebalanced
10. **Mago as the surviving Carthaginian voice** —
    `narratives/mago-of-carthage.md` tracing the 2,000-year
    transmission chain through Roman, Greek, Arabic, and medieval
    Latin agronomic literature, Mago treatise as primary source
    entry, Pliny / Varro / Columella as new source entries,
    open question on what the treatise contained

### Maps system

`HistoricalMap.astro` component renders server-side SVG historical-
atlas maps from JSON config + Natural Earth 50m coastline data. Three
maps shipped:
- `src/data/maps/fpw.json` — First Punic War strategic geography
- `src/data/maps/spw.json` — Second Punic War (widest theater, with
  Hannibal's dashed Pyrenees-Rhône-Alps route)
- `src/data/maps/tpw.json` — Third Punic War zoomed to Cap Bon

Periods 04, 06, 07 and the war-level event pages all surface the
relevant map via `map_id` + `map_caption` frontmatter fields.

### Polish-pass work (commits 7e828f6 → 97ead55)

After the MacDonald-direction framing pass landed, a focused polish
pass cleaned up the active-outstanding-work list. The shipped items:

**Thinner people pages, two rounds, nine figures expanded from
one-pager territory to 125–155 line range:** Scipio Africanus (with
the Carthage-perspective framing the user specified — substantive
Roman bio explicitly bracketed as Roman POV on a Carthage site);
Mago Barca; Hasdrubal Gisco; Maharbal; Hasdrubal Barca; Syphax;
Naravas; Hannibal son of Gisco (the 410–406 Magonid Sicilian
commander); Hamilcar son of Gisco (the Agathocles-period commander).
Together with the prior Sophonisba / Masinissa / Gala / Hannibal
expansions, the principal SPW and Mercenary War command structure
is now substantively treated across the people collection.

**Suffeteship institutional arc** — `narratives/the-suffeteship-arc.md`
walks seven moments (origins from the early monarchical period
through Aristotle's classical-period external recognition, the
structural separation from military command, Hannibal's 196 BCE
reforms, the destruction, the Roman-period continuation at Lepcis
Magna and elsewhere). Framing is Phoenician-first explicitly. The
load-bearing claim `claims/suffeteship-military-command-separation`
treats the civil-military separation as a substantive distinctive
Carthaginian constitutional achievement.

**SPW-outbreak Roman envoys** — three new people pages
(`baebius-tamphilus`, `licinius-varus`, `valerius-flaccus`) for the
documented envoys of the 219 and 218 BCE Roman embassies that bracket
the war's diplomatic opening, plus substantial expansion of
`livius-salinator`. The CLAUDE.md note "Marcus Atilius Regulus / co-
envoys" was resolved with the more honest historical-record approach
— Atilius Regulus is not in the standard envoy lists, so the
documented Fabius / Livius / Aemilius / Licinius / Baebius (218) and
Valerius / Baebius (219) co-envoys were added instead.

**Infobox polish pass — events, places, people**:

- **Events:** new optional `outcome` field. 29 principal events
  filled (every battle and siege event, plus the three Punic Wars
  and the destruction event). The infobox now shows outcome at a
  glance — decisive Carthaginian victory at Cannae, decisive Roman
  victory at Zama, pyrrhic Carthaginian-Etruscan victory at Alalia,
  etc.

- **Places:** new optional fields — `founded` (object with founder,
  date, notes), `cultural_sphere` (enum: phoenician/punic/greek/
  numidian/libyo-phoenician/iberian/roman/mixed), `current_status`
  (freeform), `patron_deity` (freeform). 23 principal places filled.
  Connects directly to the colonial-network framing.

- **People:** new optional `family` object (father, father_name,
  mother, mother_name, spouses[], spouse_names[], children[],
  children_names[]) with both reference-based and freeform-string
  fallbacks; and `offices_held` array (office name, year, notes).
  18 principal figures filled — the Barcid family tree with full
  bidirectional cross-references, the Massylii royal house, the
  Sophonisba marriage trajectory, the principal Roman figures with
  offices including the 218/219 BCE embassy roles. The render route
  shows Father / Mother / Spouse(s) / Child(ren) / Offices held
  rows.

### Content-gap fill pass (May 2026, commits ee88dda → b9d0df9)

Identified content gaps across collections and filled the
highest-priority ones:

**Ten new place pages with imagery.** Sardinian: Sulci,
Tharros, Nora, Caralis. Atlantic and Iberian: Lixus, Malaca,
Carmona, Abdera. Tripolitanian: Sabratha, Oea. All sourced
through `scripts/fetch-place-image.mjs` from Wikimedia
Commons, with full CC-license credit blocks. Places
collection 46 → 56.

**Eight new people pages.** Adherbal (the Drepana victor),
Hieron II of Syracuse, Ahiram of Byblos, Eshmunazar II of
Sidon, Hiram I of Tyre, Hannibal son of Bomilcar, Bostar,
Carthalo. Plus the three SPW-outbreak envoys (Baebius
Tamphilus, Licinius Varus, Valerius Flaccus) from the prior
batch. People collection 74 → 82.

**Four new open questions.** `hannibal-italian-objective`,
`hanno-periplus-authenticity`, `carthaginian-literacy-extent`,
`carthaginian-women-political-office`. OpenQuestions
13 → 17.

**Three new themes.** `carthaginian-warfare` (military
organization), `treaties-and-diplomacy` (the eight Roman
treaties plus Numidian, Greek, Hellenistic relationships),
`punic-numidian-relations` (the relationship as topical
hub, with the existing `the-numidian-punic-interface`
narrative as the substantive treatment). Themes 14 → 17.

**Three new editorial takes** with user-confirmed
positions:
- `hannibal-italian-objective-alliance-dismemberment` —
  structural-strategic intent reading; incorporates the
  oath at Hamilcar's altar
- `carthaginian-army-institutionally-mixed` — citizen
  command + Libyan subjects + Numidian/Iberian allies +
  mercenaries; rejects Polybian inferiority claim, with
  Polybius 6.52 as the load to push against
- `aristotle-carthaginian-governance-praise-qualified` —
  genuine but qualified, with the "actually equal/superior
  to the polis ideal" reading explicitly rejected

Editorial takes 21 → 24.

**Two new narratives.** `mago-barca-operational-arc`
(integrating the third Barcid brother's distributed
career into one biographical arc) and
`mercenary-war-leaders` (collective treatment of Spendius,
Mathos, Autaritus as a coordinated leadership unit).
Narratives 33 → 35.

### De-LLM revision passes (May 2026, commits 2213fcd → 1eb4659)

A multi-pass cleanup targeting AI verbal tics across the
site after the user flagged them in newly-written prose.
The seven strategies (in order from most-to-least mechanical):

1. Cut "structural / substantive / operational / load-bearing"
   density by ~70% in revised files
2. Replace nominalizations with verbs
3. Strip bolded inline mini-headings (the `**Heading.**`
   pattern inside reasoning bodies)
4. Vary formulaic closers ("What the position is not
   claiming"; "Confidence is moderate/strong" boilerplate)
5. Unpack hyphenated noun compounds
6. Cut closing recap paragraphs from narratives
7. Use specific concrete nouns over abstract ones

Implemented across three passes:

**Pass 1: mechanical script (`scripts/delm.mjs`).** Applied
across all 14 content collections. Stripped 315 bolded
mini-headings, removed 5 "what the position is not
claiming" closers + 5 "confidence is X" boilerplate
closers, made 124 safe word-level substitutions (delete
empty "substantively", "load-bearing" → "central", etc.).

**Pass 2: hand-rewrite the 8 newest-written files.** The 3
new editorial takes, 2 new narratives, 1 open question, 2
new themes — all by-hand revised with strategies 2, 5, 6,
7 applied.

**Pass 3: hand-rewrite 23 high + medium priority older
files.** Five central editorial takes (Masinissa,
Destruction, Cultural Integrator, Barcid State, Mercenary
War Atrocity), three long-form pieces (Suffeteship arc,
Numidian-Punic interface, Phoenician colonial network),
nine medium editorial takes (Alalia, Family-vs-Institution,
Cannae-Refusal, Agathocles-Masterstroke, FPW-Causation,
Punic-Religion-Method, Iberian-Side-Switching, TPW-Why,
Lutatius), four open questions and two themes (Mercenary
War Brutality, Women's Lives Gap, Agathocles How Close,
Women Political Office, Women-and-Family, Punic
Inscriptional Record).

Corpus-level results across all prose-heavy collections:
- "load-bearing": 25 → 4 (96% reduction)
- "substantive(ly)": 354 → ~110 (69% reduction)
- "operational(ly)": 147 → ~80 (46% reduction)
- "structural(ly)": 338 → ~200 (41% reduction)

Two new audit/utility scripts:
- `scripts/tic-rank.mjs` — ranks all 14 collections by
  AI-tic density per 1,000 words. Reusable; run any time
  to find regression hotspots.
- `scripts/delm.mjs` — the mechanical pass script. Idempotent
  (running it again only catches new instances).

### Editorial takes — now at 24

Major new takes from the framing pass:
- `tophet-happened-scale-unrecoverable` — "practice happened, scale
  unrecoverable"; bioarchaeology + *molk* formula + cross-source
  consistency carry the "happened" case
- `hannibal-195-denunciation-as-fabrication` — strong fabrication
  reading on the 195 Antiochus charge
- `mercenary-war-atrocity-structural` — Hoyos structural reading
  over Polybian individual-leadership reading
- `barcid-iberian-state-as-state` — integrated state-building +
  Rome-orientation framing
- `masinissa-strategic-opportunist` — neither Roman client nor
  architect-of-destruction
- `carthage-as-cultural-integrator` — active Punic agency in
  Hellenistic absorption

The pattern that emerges across these: **the site takes positions
with appropriate confidence-labels, explicitly weighs competing
readings (often noting "compatible alternative" vs "rejected
position"), and consistently treats agency rather than passive
reception as the load-bearing framing for non-Greco-Roman actors.**

### Autolink markdown-link fix

`src/lib/autolink.ts` was extended to process markdown-style
`[text](url)` links in YAML summary fields as a first pass before
the entity-autolink pass. Previously these rendered as literal
markdown syntax. Fix applies retroactively to all YAML summaries —
the back-citations into editorial takes and narratives from entity
pages now render as proper anchors.

### Sources index academic sort

The `/sources` index now sorts primary literary chronologically by
composition date, inscriptional corpora separately at the end of the
primary section, and modern scholarship alphabetically by author
surname. Each section has an italic explanatory note about the
sort order.

### Earlier shipped work (still relevant — recap from before the framing pass)

- Artifacts collection — 41 entries (39 originally + Marseille and
  Carthage tariffs); deep site integration; image-card index;
  MaterialEvidence cross-referencing component
- Editorial masthead, page-header standardization, color discipline
  (epistemic signal only)
- Three-phase source-weaving (inline citations, enriched source
  pages, /methodology page)
- Per-page bibliography (auto-derived from claims)
- Contact form (Netlify Forms; thanks page)
- Security and provenance hardening (cooperative robots.txt; HTTP
  headers including HSTS, Permissions-Policy, X-Robots-Tag; HTML
  provenance markers; 2FA on GitHub/Netlify/registrar)
- Per-page structured data (JSON-LD) pass (July 2026): every entity
  page emits a page-specific schema.org object alongside the site-wide
  `WebSite` one, plus an auto-generated `BreadcrumbList`. Builders in
  `src/lib/structuredData.ts` (Person / Place / Book / CreativeWork /
  Thing / ScholarlyArticle); `BaseLayout` takes an optional `jsonld`
  prop, injects the canonical `url`/`mainEntityOfPage`, and derives the
  breadcrumb from the path. Article types carry institutional
  author/publisher, CC-BY `license`, and `dateModified` from
  `last_revised`/`last_reviewed`; places carry `geo` from `primary`
  lat/lon. Date policy: ancient BCE dates are kept out of strict schema
  date fields (only modern publication years and revision stamps are
  emitted). Headlines capped at 110 chars per Google guidance. Strictly
  structural — no visible change. All ~2,050 JSON-LD blocks validate.
- SEO / AI-discoverability lean pass (July 2026): `@astrojs/sitemap`
  (emits `/sitemap-index.xml`, ~692 URLs; search/thanks excluded;
  `Sitemap:` line in robots.txt); per-page `<link rel="canonical">`;
  Open Graph + Twitter card meta in BaseLayout (optional `ogType`
  and `image` props; branded 1200x630 `/og-default.png` generated
  from an SVG via sharp — regenerate with the SVG in the commit if
  the wordmark changes); `/llms.txt` endpoint (`src/pages/llms.txt.ts`,
  llmstxt.org convention, curated index auto-built from collections);
  real meta descriptions on all ~20 index/static pages (entity
  `[slug]` pages already had them from summaries). robots.txt also
  extended to disallow aggressive commercial SEO crawlers (Ahrefs,
  Semrush, MJ12, DotBot, DataForSeo, BLEX, Petal, etc.). NOTE: the
  `noai, noimageai` robots meta + X-Robots-Tag header are a
  deliberate AI-*training* opt-out; they do not block the AI
  answer/live-fetch bots, which robots.txt explicitly allows.
- Richer deity infobox (sanctuary, iconography, consort, cult_period
  fields; all 10 deities filled)
- Threads collection (7 curated reading paths)
- Period pages (7 era syntheses)
- Cmd-K search modal global component

### Synthesis-and-evidence-layer pass (May 2026, commits fdf6241 → f11be67)

A substantial session focused on the synthesis layer and the
source-rivalry-as-feature direction. Five threads ran in
parallel:

**1. The /narratives index as synthesis hub.** The narrative
listing page was extended to host all four legs of the
interpretive layer: narratives (existing), editorial takes,
open questions, and source comparisons. A jump-to nav at the
top shows each section with its count. The H1 stays
"Narratives" but the page is conceptually the synthesis hub.

**2. Battle tactical diagrams — seven land battles complete.**
The original bespoke CannaeDiagram component was refactored
into a data-driven system: a shared `BattleDiagram.astro`
that takes a typed config (`src/lib/battleDiagram.ts`), per-
battle configs at `src/data/battles/<event-slug>.ts`, and a
tap-to-enlarge dialog with prev/next phase navigation,
keyboard arrows, touch swipe, tap-backdrop-to-close. Cannae
migrated; six new battles added: Trebia, Trasimene, Zama,
Bagradas (with a new event entry for the 255 BCE battle,
since the existing battle-of-bagradas-238 is the Mercenary
War battle), Ilipa, Metaurus. Naval battles deferred —
would require a different visual idiom (fleet wedges, wind
direction, harbor geography).

**3. aDNA framing extension.** The 2025 Ringbauer/Reich
Nature paper on Punic-period genetic ancestry (predominantly
Mediterranean, minimal Levantine component at western sites)
addressed via three pieces: new source entry
(`ringbauer-punic-genetics-2025`), new open question
(`punic-demographic-composition`) that explicitly separates
the foundation question from the demographic question, and a
new section in the `phoenician-colonial-network` theme,
"Cultural network, demographic mixing," that makes the
foundation-vs-demography distinction explicit. Framing:
Tyrian foundation is real and well-attested; demographic
composition across 700 years is a separate question; cultural
identity transmits through socialization, not genealogy; the
aDNA empirically confirms the cultural-integrator framing
the site had already arrived at on other grounds.

**4. Louis Rawlings sources — six new modern-scholarship
citations.** Cardiff specialist on ancient warfare with
particular strength on Punic War period. The six:
`rawlings-hall-unit-cohesion-2023` (the most direct recent
treatment of how a multi-ethnic Carthaginian army functioned
as a coherent institution), `rawlings-celts-spaniards-samnites-1996`
(non-Greco-Roman warrior agency), `rawlings-war-in-italy-2011`
(standard reference chapter on the Italian theatre),
`rawlings-hannibal-and-hercules-2005` (Hannibal's deliberate
self-association with Hercules via Melqart syncretism),
`rawlings-hannibal-cannibal-2007` (methodology on Polybian
atrocity framing), `rawlings-ancient-greeks-at-war-2007`
(survey monograph — added but not yet integrated). The
five integrated ones cite into: army-composition take,
Iberian-side-switching take, cannae-allies-defected claim,
hannibal-italian-objective take, cannae-march-on-rome take,
Hannibal Barca person page, and mercenary-war-atrocity take.

**5. Source comparisons — new first-class collection
("outside the box" feature).** The most distinctive direction
this session opened. New `sourceComparisons` collection: each
entry presents a contested episode through multiple ancient
sources in parallel (paraphrased passages with source-distance
chips), surfaces specific points where the sources differ
with the site's commentary, and offers a working
reconstruction. The aim is to make the source-rivalry work
the rest of the site does implicitly (in claim citations, in
editorial-take reasoning) visible as a reading interface.

Nine entries shipped across the principal Punic Wars arcs:
- `cannae` — 4 sources, 6 points of difference
- `mercenary-war-atrocities` — Polybius/Diodorus/Appian
- `sophonisbas-death` — Livy/Appian/Diodorus
- `lutatius-treaty` — the FPW settlement amendment question
- `saguntum-casus-belli` — Polybius's structural reading vs Livy's moral
- `alps-crossing` — vinegar-on-rocks as the textbook literary invention
- `hannibal-antiochus-denunciation` — Justinian skeptical framing
- `tarentine-betrayal` — political action vs treachery framing
- `declaration-of-war-218` — toga-gesture authentic, speeches elaboration

Schema in `src/content/config.ts`. Routes at
`src/pages/sourceComparisons/[slug].astro` and `index.astro`.
Surfaced on the /narratives synthesis hub, on subject-event
pages, on related editorial takes and open questions (via
reverse-lookup interlinking), and as a featured homepage
callout. The interlinking is generic — adding a new
comparison automatically surfaces it in the right places
without further wiring.

**Other small things in this stretch:**
- Cowell 1906 *Nature* paper on the Agathocles eclipse added
  as a source and integrated into the Agathocles invasion
  narrative
- Evidence-summary rendering fix: open-question `evidence_summary`
  fields were preserving YAML hard-wraps as visible line
  breaks via `whitespace-pre-line`; replaced with a
  `paragraphize()` helper that collapses single newlines to
  spaces and splits on blank lines. Now flows to full column
  width. The helper pattern is reusable — also used in the
  sourceComparisons route.
- Homepage callout for the Cannae source comparison
- Stale "All 13 open questions" link on homepage fixed to
  "All open questions" (count was drifting)

### Fifth-century gap-fill + reverse-lookup architecture (May 2026, commits 3c2250c → 2b33eec)

A focused session addressing the 5th-c. content gap (the
480–410 BCE stretch the site had treated only briefly in
Period 02's "What else was happening" section). Three new
period-arc narratives plus an architectural improvement to
the reverse-lookup infrastructure.

**1. The constitutional arc.** New narrative
`narratives/the-fifth-century-constitutional-arc` walks the
political transformation from Magonid quasi-monarchical
dominance to the oligarchic-republican constitution Aristotle
praises in the 340s. Pre-Himera Magonid pattern → Himera as
rupture point → emergent institutional landscape
(suffeteship, senate, Hundred and Four court, popular
assembly) → post-Himera Magonids in diminished form → the
mechanism question. Companion open question
`openQuestions/fifth-century-constitutional-development`
weighs three candidate readings (gradual evolution, discrete
reform via the Justin 19.2 reference, unanswerable).

**2. The religious transformation.** New narrative
`narratives/the-fifth-century-religious-transformation`
treats Tanit's emergence in the inscriptional record from
c. late 5th c. BCE, the votive formula shift to "Tanit Face
of Baal and Lord Baal Hammon" with Tanit named first, the
Tophet's intensification across the late 5th and 4th
centuries, and the broader pantheon stabilization. Four
candidate explanations for Tanit's emergence weighed
(differentiation from Astarte, import from elsewhere,
Libyan-Phoenician syncretic origin, internal Carthaginian
theological development), with the site landing on a
mixture of (a) and (c). The aDNA evidence reinforces the
Libyan-Phoenician syncretic reading.

**3. The Phoenician homeland under Persian rule.** New
narrative `narratives/phoenician-homeland-under-persian-rule`
treats the external structural context (539–332 BCE) within
which Carthage's internal 5th-c. transformations happened.
The Cambyses episode (Herodotus 3.17–19) as the load-bearing
direct attestation of Persian-Carthage contact and of the
metropolis-colony cultic bond surviving Persian rule. The
480 BCE Himera-Salamis coordination question treated
carefully (both readings weighed without picking a side).
Sidon's eclipse of Tyre, the Eshmunazar II and Tabnit
sarcophagi as Persian-period royal material, the
continuing Melqart-cult tribute, Aristotle's late-Persian-
period treatment, Alexander's siege of Tyre as the period's
close.

**4. Reverse-lookup architecture for narratives.** Discovered
during the gap-fill work that deity, institution, period,
and place render routes did not do narrative reverse-lookup
(only themes did). Extended the pattern: each route now pulls
narratives whose `primary_entities` references the current
entity, surfaced as a "Narratives" section. The pattern is
generic — any future narrative anchored to one of those
entity types will surface automatically without further
wiring. Also added `carthaginian-governance` to Period 02's
`key_themes` (legitimate content fix; the period covers
political development).

**Other smaller things this stretch:**
- Three small wins (Metaurus Phase 3 diagram review;
  Rawlings Greeks-at-War 2007 integrated into Sicilian-
  dialectic narrative + army-composition take; aDNA framing
  extensions on founding-tyrian-colonization claim,
  punic-identity theme, libyo-phoenicians group)
- AI-tic audit on the recent synthesis-layer prose; the
  nine source-comparison files brought from 17–23 tics/1k
  to under 5 tics/1k via mechanical sed batches plus hand
  rewrites of the two worst (tarentine-betrayal, mercenary-
  war-atrocities). Em-dash density on the Phoenician-homeland
  narrative reduced via emdash-fix.mjs.

### Dynasty / family-tree explorer (May 2026, commits 22b5b81 → 2d70e45)

A new first-class section: family-tree readings of the
aristocratic and royal houses that shaped Carthaginian history.
Three dynasties ship in this stretch with the architecture
generalized for future expansion.

**Architecture.** Same patterns as HistoricalMap and
BattleDiagram:

- `src/lib/familyTree.ts` — type definitions
  (`FamilyNode` with x/y position, category, optional
  personSlug, uncertain/context flags; `FamilyEdge` with
  parent/marriage/sibling kinds and optional waypoint;
  `FamilyTreeConfig` wrapping nodes + edges + caption +
  legend). `CATEGORY_COLORS` palette covers Carthaginian /
  Numidian / Iberian / Roman / other (Greek added via
  'other').
- `src/components/FamilyTree.astro` — pure-SVG renderer.
  Nodes: rounded rects with name + optional role + optional
  dates; nodes with a `personSlug` become clickable links to
  the person page. Wraps role text into up to two lines at
  word boundaries (26-char target). Uncertain nodes get
  dashed borders + italic labels; context nodes get reduced
  opacity. Edges: orthogonal routing with optional
  hand-placed waypoints. Solid = parent, dashed = marriage,
  dotted = sibling.
- `src/data/dynasties/<slug>.ts` — one config per dynasty.
- `src/pages/dynasties/[slug].astro` + `index.astro` —
  routes; the detail page auto-detects any matching group
  page (slug-match) and adds a back-link.

**Three dynasties shipped:**

- `barcids` (c. 290–200 BCE) — Hamilcar, his three sons
  (Hannibal, Hasdrubal, Mago), two unnamed daughters
  (italicized as partially attested) with their husbands
  (Hasdrubal the Fair, Naravas), Imilce, and Hannibal's
  unnamed son. Long-distance Hamilcar→daughter edges use
  explicit waypoints to route around the sons' row.
- `massylii` (c. 230–148 BCE) — Gala, Masinissa, Sophonisba
  (center), Syphax, Hasdrubal Gisco (Carthaginian context
  node), and Masinissa's three sons (Micipsa, Gulussa,
  Mastanabal). Sophonisba's two marriages render as
  horizontal dashed lines from both sides.
- `magonids` (c. 550–396 BCE) — five generations from Mago
  I through Hamilcar Magonid (Himera commander), his
  Syracusan wife (Herodotus 7.166), his daughter and her
  marriage to Gisco, and the late-5th-century Sicilian
  commanders. Uses a collapsed "intermediate generations"
  node for the two reconstructed generations between Mago I
  and Hamilcar Magonid; Himilco as context node off to the
  side.

**Discoverability wiring.** Bidirectional slug-match
convention between `/dynasties/<slug>` and `/groups/<slug>`:

- Person pages: reverse-lookup adds a "Dynasty" infobox row
  (with the family-tree SVG icon) when the person appears as
  a node in any dynasty config.
- Group pages: when a dynasty config exists with the same
  slug, the infobox gets a "Family tree" row.
- Dynasty pages: when a matching group page exists, the
  dynasty page closes with a "Read more about this family
  as a collective entity" link.
- `/people` index: new "Dynasties" section at the top
  (above Peoples) with cards, plus jump-to nav pill.
- Family-tree icon: small SVG (four nodes + connecting
  lines) defined inline in three sizes (13px in infoboxes,
  22px on synthesis-hub-style cards, 28px on the dynasties
  index).

**Smaller fixes in this stretch:**
- Initial deploy failure (commits 22b5b81 → 50e0006) from
  mid-frontmatter `import type` declarations; fixed by
  moving all imports to the top of the frontmatter blocks.
  Note for future: `astro check` passes mid-body imports
  silently while esbuild rejects them. Pipe the full build
  output rather than grepping just for "error".
- FamilyTree text overflow (commit 3d0d0c5): NODE_W
  130→150, NODE_H 50→70, added `wrap()` helper for two-line
  role rendering, vertical text layout computed dynamically
  from line count.
- FamilyTree edge routing for long-distance parents
  (commit 0a529d9): `edgePath()` refactored so when a
  waypoint is provided the route uses explicit
  bottom-center / top-center connection points rather than
  the auto-adjusted side-edges.

### Academic review pass (June 2026, commits e5796c5 → 904723f)

The user asked for a review of the site "from an academic
perspective." The review's verdict: the epistemic apparatus
(claims, stances, source-distance, source comparisons) is the
site's real contribution and is ahead of most digital-humanities
projects; the vulnerabilities were almost all in the source
layer's completeness. Seven priority items were identified; the
user worked the list in order. Items shipped:

**1. Modern-apparatus source batch (e5796c5).** Eight new
source entries closing the gap between scholarship the prose
already discussed and what the source layer catalogued:
`walbank-commentary-polybius` (the standard Polybius apparatus,
previously absent entirely; linked from the Polybius entry),
the three dueling tophet papers (`schwartz-tophet-2010`,
`smith-tophet-2011`, `xella-bones-of-contention-2013`, all
cited with stances into the tophet-child-sacrifice-contested
claim), `hoyos-companion-punic-wars-2011`, and
`docter-bir-massouda-2005`. Also corrected two errors in the
tophet controversy narrative: the Smith papers were
misattributed to "Smith, Stager, and Holladay" (Holladay was
not an author; Greene and Avishai were), and the Schwartz 2010
paper that triggered the exchange was never mentioned. The
bioarchaeology section now walks Schwartz 2010 → Smith
2011/2013 → Xella et al. 2013 → Ribichini in actual order.

**2. Bir Massouda radiocarbon integration (67d7bcc).** The
foundation-date material now presents three bodies of evidence
(literary 814, ceramic late-8th-century horizon, radiocarbon
c. 835–800 BCE). The `founding-archaeology-late-8th-century`
claim was retagged attested → contested because the
radiocarbon dates contradict its old statement outright.
Updated: the open question, both founding claims, the founding
event, the founding-how-to-read take.

**3. Methodology page additions (b4c914f).** Three new
sections: "Texts, editions, and translations" (standard
internal divisions, public-domain translations named per
source, Walbank as the model apparatus case, CIS/KAI corpus
numbers); "How this site is produced" (discloses AI assistance
with scope/positions/review as editorial decisions — wording
reviewed by the user); "Corrections" (contact-form route,
in-place corrections with revision stamps). The old "this
methodology page is itself revisable" closer was later removed
at user direction.

**4. Confidence re-audit (2484a1d).** All 118 attested claims
reviewed. Ten retagged attested → inferred — all modern
comparative judgments or interpretive syntheses ("largest
ambush in history," "most distinctive installation," etc.).
Also caught a factual overclaim repeated in four places: that
the 190s BCE indemnity payments were financed from Iberian
silver reserves (Carthage lost Iberia in 206; the 196
investigation found the indemnity payable from current African
revenues). Corrected in two claims, the iberia place page, the
hamilcars-iberian-conquest event, and the Iberian-silver
narrative.

**5. Inscriptional corpus interface — tabled again** by the
user ("let's table item 5 for now").

**6. Numismatics (904723f).** New `themes/carthaginian-coinage.md`:
late adoption (c. 410 BCE, coinage as military-fiscal
instrument; the *mḥnt* "camp" legends), Siculo-Punic beginnings
as a cultural-integrator case, the Tanit/horse metropolitan
series with type-readings explicitly labeled modern inference,
metal-debasement trajectory as the state's only surviving
fiscal record (including the rebel ΛΙΒΥΩΝ coinage of the
Mercenary War), Barcid shekels. Two new sources:
`jenkins-lewis-carthaginian-gold-1963`,
`visona-carthaginian-coinage-1998`. Wired into four related
themes and both coin artifacts.

**7. DOI minting — stays parked** per the review's own logic
(premature until the apparatus holes are closed).

**Also in this stretch (bf76666):** the `disputed` confidence
category (rose chip, zero uses across 172 claims) was folded
into `contested` at user direction — removed from the schema
enum, ConfidenceBadge, EditorialConfidenceChip, claims index,
about page, and methodology (now four chips). And the thesis
field of the new Iberian-silver narrative had markdown link
syntax stripped (a9166e7) — narrative `thesis` renders as
plain text via `{d.thesis}`, NOT through renderSummaryHtml, so
thesis fields must be plain prose.

Confidence distribution after the pass: 107 attested / 35
contested / 29 inferred / 1 legendary.

---

## Outstanding work

### Active work queue (complete)

The 6-item next-level queue plus the follow-on additions all
shipped (see "What shipped in the next-level pass" above for
detail). Items 1–6 (link audit, prose proofread, place imagery,
chronological spine, citation rigor, accessibility audit) plus
the analytics, 404, PWA, period split, and consistency-pass work
all landed in May 2026.

A subsequent content-gap fill pass added ten new place pages,
eight new people pages, four new open questions, three new
themes, three new editorial takes, and two new narratives.

A subsequent de-LLM revision pass (three sub-passes) cleaned
up AI verbal tics across the corpus: a mechanical script across
all collections, then hand-rewrites of the 8 newest files I had
written, then hand-rewrites of 23 high + medium priority older
files (5 central editorial takes, 3 long-form pieces, 9 medium
editorial takes, 4 open questions, 2 themes).

The next-level pass produced infrastructure (7 audit/utility
scripts, 3 new components, GoatCounter analytics, PWA manifest)
that future content work can lean on without rebuilding. The
audit scripts are reusable; run them periodically to catch
regression rot. The two newest scripts (`tic-rank.mjs`,
`delm.mjs`) target AI-tic density specifically.

### Tabled — substantial next-level moves, revisit later

These are real "next level" directions the user has explicitly
tabled. **Revisit each only when the user calls for them**; do
not surface unsolicited.

0. **Holistic visual-assets review (tabled Aug 2026, during the UI
   review pass).** The user wants **all images and diagrams reviewed
   together at a later point, once they have a clearer sense of what
   they want** — rather than piecemeal. Scope: the battle diagrams
   (read as functional-schematic / "rudimentary but they do the job";
   item 2), the family-tree/dynasty SVGs (item 3), the whole maps
   surface (item 8), and site imagery incl. the JSTOR-imagery idea
   (Parked-indefinitely list). Treat items 2, 3, 8 and the imagery
   notes as sub-parts of this one pass. Don't tweak any of them
   individually in the meantime; wait for the user to open the
   visual-assets pass with a defined direction.

1. **Revamp all UI** — full visual / interaction redesign. Distinct
   from the small UI/UX polish previously parked. User-scoped as
   a deliberate future direction once the content side is
   genuinely settled.

2. **Battle tactical visualizations** — *complete: ten battles
   shipped* via the data-driven `BattleDiagram` system + the
   tap-to-enlarge dialog. Land: Cannae, Trebia, Trasimene, Zama,
   Bagradas, Ilipa, Metaurus. Naval: Cape Ecnomus, Drepana,
   Aegates Islands. All ten use the atlas-plate idiom adopted in
   June 2026 (modeled on a print reference the user supplied):
   per-phase `description` prose with numbered circle badges,
   navy Rome / tyrian Carthage color convention (tyrian is the
   site's Carthage brand color; the original red-Rome scheme
   read backwards), `patternFill` 'hatch' for cavalry and 'dots'
   for Numidians, outlined blocks for Italian allies, rounded
   unit rects (`rx`), and curved sweep arrows (`via` quadratic
   control point). Cannae is the deepest example: six phases.
   The naval idiom reuses the same primitives: sea-blue
   `background`, coastline path units, ship-block rects in
   formation, dashed sky-colored wind arrows. Note: path units
   don't render `label` (rect-only in the component); label
   path shapes via annotations. Labels on hatched/dotted units
   must be dark (#1a0410), not white. The long-flagged Metaurus
   Phase 3 crowding was reviewed and fixed in the restyle pass
   (the congestion was the top-left march annotation + arrow +
   cavalry block, not the death annotations).
   - **Review note (Aug 2026):** user finds the diagrams "a bit
     rudimentary but they do the job for now." They read as
     functional-schematic rather than polished. A future visual
     upgrade (richer unit glyphs, terrain, typographic polish) is
     an open possibility — not urgent; fits the tabled "revamp all
     UI" direction. Revisit if the user calls for it.

3. **Family tree / dynasty explorer** — *five dynasties shipped*
   (Barcids, Massylii, Magonids; and, added Aug 2026, the
   **House of Tyre** — the legendary Tyrian founding line, Hiram I
   through Mattan to Pygmalion / Elissa-Dido / Sychaeus, the one tree
   anchored in the foundation legend rather than the historical record;
   its node borders encode an attestation gradient, solid = firm
   (Hiram, Pygmalion) vs dashed = legendary (Mattan, Dido, Sychaeus),
   with a dimmed collapsed-generations bridge for the ~150-year gap,
   and the caption carries the source name-variance, Justin's
   Mattan/Acerbas vs Virgil's Belus/Sychaeus — config
   `src/data/dynasties/house-of-tyre.ts`); and the
   **Cornelii Scipiones**, the Roman side, framed explicitly as the
   enemy side of the Carthage story: the house that bracketed the war,
   Africanus at Zama 202 through his adoptive grandson Aemilianus at
   the destruction 146, with Nasica Corculum as the internal
   spare-Carthage voice against Cato). The config
   (`src/data/dynasties/cornelii-scipiones.ts`) uses the `other` grey
   category for Aemilius Paullus to encode the adoption visually — born
   an Aemilius, adopted a Scipio — since the component has no dedicated
   adoption edge kind (adding one is off-limits until the tabled
   visual-assets review, item 0). The architecture still handles
   arbitrary additions: one typed config file per dynasty under
   `src/data/dynasties/`, slug-match convention for bidirectional
   group ↔ dynasty wiring, person infobox reverse-lookup automatic.
   The Cornelii Scipiones have no matching `groups/` page, so the
   dynasty page omits the collective-entity backlink (graceful).

4. **Punic inscriptional corpus interface** — searchable interface
   for the CIS/KAI corpus excerpts the site references — Punic
   text, transliteration, translation, find-context, museum
   location. Most academically distinctive feature the site could
   add. 4-6 weeks of careful work to do meaningfully.

5. **Audio narration** — recorded readings of the substantive
   narratives, hosted alongside the text. Podcast-like reach
   without a podcast feed. Production lift is non-trivial; reach
   gain is real but specific to a particular audience segment.

6. **DOI minting via Zenodo** — per-page DOIs for substantive
   narratives, making them citable at academic-publication
   standard. Distinctive but heavy: 2-3 days API integration + an
   ongoing per-deposit operational workflow. The citation rigor
   pass already delivers BibTeX/RIS/Chicago/APA/MLA export +
   version stamps which covers most academic-citation needs.
   Revisit if the site starts getting cited often enough that the
   DOI question comes up specifically.

7. **PWA offline mode (service worker)** — the current PWA
   manifest makes the site installable as a home-screen app;
   adding a service worker would make it offline-capable.
   Substantial work (cache strategy for 623+ pages, update flows,
   stale-while-revalidate logic). Foundation already in place via
   the manifest. Revisit if user wants offline access.

8. **Maps — holistic review (tabled Aug 2026).** During the UI
   review pass the user liked the period pages but wanted to
   revisit *maps in general* as their own topic rather than
   piecemeal. Scope when picked up: the whole maps surface — the
   three `HistoricalMap` strategic atlases (FPW/SPW/TPW), the two
   Atlantic-voyage maps (Hanno, Himilco), the Leaflet point maps on
   places/events, the `TerritorialExtentMap` (/maps/extent-over-time),
   and the /maps index — reviewed together for consistency, quality,
   and whether each earns its place. (The old Cormorant-ghost nit is
   **already fixed** — commit 53646cc, Aug 2026: all SVG labels across
   `HistoricalMap`, `TerritorialExtentMap`, `Map`, and `FamilyTree`
   were switched from the dropped Cormorant to Fraunces, the loaded
   heritage serif. No font work remains for the maps pass.) Revisit
   when the user calls for the maps pass.

### Residual prose work — COMPLETE (June 2026)

The long-held residual em-dash backlog was cleared in a manual
pass: all 75 files then flagged by `prose-audit.mjs` were
hand-edited per the house rule (paired dashes to parens/commas,
expansions to colons, pivots to periods/semicolons), with only
a handful of genuinely earned dashes or link-text titles kept.
The repeated-phrase flag on `places/sicily.yaml` ("Treated
separately on the site" used six times as a list refrain) and
the doubled-word flag on `people/hiram-i.yaml` were also fixed.
**`prose-audit.mjs` now reports 0 flagged files.** The
tic-rank ceiling was simultaneously brought down from ~31/1k to
~17/1k by hand-rewriting the eleven worst files (claims on the
Magonid army reform, Polybius decline narrative, suffeteship
separation, Melqart network, treaty sequence, Sardinia-as-cause,
falarica wound, truceless character; the three Rawlings source
entries; the why-Cannae thread). Run both audits periodically to
catch regression: new prose should keep prose-audit at zero.

**Em-dash pass on the `.astro` pages (Aug 2026).** Important caveat
surfaced during a later em-dash pass: **`prose-audit.mjs` only scans the
content collections (`.md` + `.yaml`) — it does NOT scan `.astro`
pages**, so em dashes in *hardcoded page prose* (methodology, about,
index, etc.) go unaudited and can drift over budget. `methodology.astro`
had accumulated 34; hand-cleaned to 12 (converted routine
parentheticals/glossary defs to commas/colons/periods, **kept** the
earned list-in-apposition dashes whose items contain commas + the
"where the site is wrong" rhetorical aside — the house-rule exceptions).
`about.astro` 4 → 1. The homepage was already 0 from its copy pass. The
content collections themselves remain within budget (audit clean); a
blind mass-conversion of the ~600 in-budget dashes there was
deliberately NOT done (many are earned). When adding prose to an
`.astro` page, apply the em-dash rule by hand — the audit won't catch it.

### Possible future content additions (held; diminishing returns)

These were flagged as possible content additions in earlier
sessions but have not been prioritized. Available if the user
calls for them; not part of the active queue:

- Sicilian-Greek/Punic 4th-c. dialectic between Himera 480 and
  the Agathocles crisis (existing treatments could be deepened)
- Mago Barca's specific operational arc as a dedicated narrative
  (currently substantive but distributed)
- Hamilcar Magonid (480 BCE Himera commander) — currently 49
  lines, slightly thinner than comparable major commanders
- Mercenary War leaders (Spendius, Mathos, Autaritus) — at
  28-29 lines each; substantive treatment lives in the war
  narrative
- Hellenistic-period synthesis of Punic Sardinia and Sicily
  (Sulci, Tharros, Motya, the Sicilian Punic zone) parallel to
  the Numidian-Punic-interface narrative

### Parked indefinitely

- **Dark mode** (Phase 3 of visual redesign) — once day version settles
- **Keyboard navigation** (`j`/`k` between siblings) — niche
- **Reception history** (Roman Carthage and onward, modern memory) —
  explicitly out of scope. The Punic-continuity-in-Roman-Africa
  narrative covers what's load-bearing for the site's framing without
  expanding scope into Roman Carthage proper.
- **Per-entity-page rich imagery** — the artifact collection has
  images because public-domain photos exist for material culture;
  entity pages (people, events, etc.) don't get imagery because
  AI-generated would feel cheap and consistent public-domain coverage
  doesn't exist.
  - **Tabled idea (Aug 2026): JSTOR imagery for big pages like
    Carthage.** User idea to source real scholarly imagery — via
    JSTOR / Artstor / academic image collections — for the major
    entity pages (Carthage first) that currently have no imagery,
    rather than the AI-generated route ruled out above. Not scoped
    yet: needs a look at what JSTOR/Artstor licensing actually
    permits for republication (much is rights-restricted / for
    research use only, which may not allow site display), which
    pages would qualify, and how it fits the existing
    place-imagery pipeline (`scripts/fetch-place-image.mjs` +
    the `image` block). Revisit when the user calls for it.

### Security audit (Aug 2026)

A full audit was run. The site is a **static Astro build on Netlify** —
no server, DB, auth, sessions, cookies, or user accounts, and **no
runtime user input reaches any template** — so SQLi / auth / CSRF /
SSRF / server-RCE classes don't apply. Findings and what shipped:

**Shipped:**
- **Content-Security-Policy** — added to `netlify.toml` as
  **`Content-Security-Policy-Report-Only`** first (reports, doesn't
  block) so the allowlist can be confirmed on the live console before
  flipping the header name to enforcing. Allowlist covers: self,
  inline scripts/styles (Astro `is:inline` + scoped styles),
  `'wasm-unsafe-eval'` (Pagefind), `gc.zgo.at` + `carthage.goatcounter.com`
  (GoatCounter), Google Fonts (`fonts.googleapis.com`/`gstatic.com`),
  `*.tile.openstreetmap.org` (Leaflet tiles); `frame-ancestors`/`object`/
  `base`/`form-action` locked down. `'unsafe-inline'` for scripts is a
  deliberate trade-off (many is:inline scripts, no per-request nonce on
  static hosting, no user-input XSS vector) — tightening to hashes is a
  possible later step. **Next step: watch the live console for
  CSP-Report-Only violations, then rename to `Content-Security-Policy`.**
- **Autolink URL-scheme guard** — `sanitizeHref()` in `autolink.ts`
  now rejects any non-http/https/mailto scheme (kills `javascript:`,
  `data:`, `vbscript:`) and escapes the href attribute in the
  markdown-link pass (`autolink()` line ~191). `renderInline` was
  already scheme-safe (regex only accepts `/…` or `https?://…`); added
  `"`-escaping there too. Defense-in-depth — all link URLs are
  author-authored today, but this future-proofs any outside-content path.

**Confirmed already-good:** live header baseline (HSTS, `X-Frame-Options:
DENY`, `nosniff`, `Referrer-Policy`, `Permissions-Policy`, no
`Set-Cookie`, no `X-Powered-By`); no secrets in the repo (`.env*`
gitignored); contact form has a Netlify honeypot and submissions aren't
reflected on-site; images are self-hosted (not hotlinked).

**Deferred — dependency CVEs (build-time only):** `npm audit` reports
~15 findings (incl. 9 high: astro, vite, sharp, postcss, svgo, yaml,
etc.). **All are build/dev-time deps — none ship to the browser or run
on a server**, so there is no live-visitor exposure; the only real risk
is build-time supply chain. `npm audit fix` clears the easy ones; the
Astro 6 major (define:vars XSS advisory, which the site doesn't use) is
a deliberate maintenance-window job. Revisit in 3–6 months or sooner if
a CVE ever applies to a runtime feature.

### Homepage redesign — magazine front (Aug 2026)

The homepage was rebuilt into a **typographic magazine front page**
("Direction A", chosen over a "come for / stay for" dual-band
alternative). No imagery — the magazine feel is carried by type, the
tyrian graphic system, and varied card weights. Structure of
`pages/index.astro`, top to bottom:

- **Lead story** — a two-column marquee (`lg:grid-cols-[1.55fr_1fr]`)
  closed by a 3px ink rule. Left: a big Bricolage headline
  (`text-[clamp(2.2rem,4.4vw,3.5rem)]`) + standfirst + byline, linking
  to a flagship piece. Right: a "Where this site differs" note in
  Fraunces italic. **The lead is a single hand-curated slot** (the
  `lead` object in frontmatter) — swap its copy/href to feature a
  different take/narrative/comparison. Currently the
  destruction-not-weak-enough take.
- **Famous entry points** — "Start with the famous stories": four
  broadsheet items (top-ruled, hand-curated `famous` array with custom
  framings, not entity summaries) — Hannibal, Dido, the Tophet, and the
  "salt the earth" myth-correction. Swap freely.
- **Read deeper** — one card each of the novel formats (narrative,
  source comparison, thread), pulled live; feature cards
  (`border-tyrian-300`). Followed by a links row to the full
  collections with **live counts** (were hard-coded + stale).
- **Personal voice** — the "From the encyclopedia" band on faint-gray,
  Fraunces pull-quote.
- **What this is** — the three value-prop columns.

The cards use the normalized card system (this replaced the old
excluded-from-normalization homepage tokens). A `trimGloss()` helper
(first-sentence-preferring truncation) feeds the pulled card previews.

(Earlier homepage — hero → start-here chips → reading threads → personal
voice → what-this-is — is superseded. The horizontal-line **timeline**
experiment was removed before this and did not return; if a chrono
element is ever wanted, a period-band sparkline strip was the floated
option.)

### UI/UX review pass (Aug 2026) — summary

A page-by-page review of the whole site after the Direction-C redesign
settled. Everything below shipped and is deployed; each has a detailed
note in the relevant section above. The arc, for a future session:

- **Header** — left-aligned masthead; nav switched from a centered grid
  to **stacked left-aligned columns** (Option B) to fix a "jumbled"
  read; **5px tyrian top bar made full-bleed**, 3px ink nav-rule held
  to the content column. (See "Header / footer chrome".)
- **Width** — unified the whole site to **`max-w-6xl` (1152px)** (was a
  4xl/5xl split that left the masthead narrower than content on a 13").
  (See "Site width".)
- **Cards** — normalized to one vocabulary (solid-white bg, `sand-300`
  borders, `tyrian-300` feature borders, `p-4`/`p-5`); **hover unified
  to purple** (`tyrian-50` → `tyrian-100` active). (See "Card system",
  "Hover / click states".)
- **Type** — `h1` clamp dialed down; **`.lead` moderated** for the
  150–200-word abstracts it holds. (See "Palette + type".)
- **Real bug fixes** — dead **table sorting** site-wide (`IndexViewToggle`
  inline script ran before the table parsed → deferred to
  DOMContentLoaded); **`:target` purple wash** on jumped-to sections
  (persistent bg → one-shot keyframe flash); **editorial-take Reasoning
  double-spacing + 3/4 width** (literal `|` scalars → folded `>`; lifted
  the 68ch cap inside the callout); a false **confidence byline** on the
  homepage lead (strong → moderate).
- **Mobile** — Quick Facts infobox now **collapsed by default** below
  `lg` so it doesn't bury the entry name. (See "Page structure pattern".)
- **Consistency** — every entity page leads with an **eyebrow kicker**
  (people/deities: glyph moved below the h1); the centered-narrow reading
  pages (thread/take/question/claim/about/methodology/search) were
  **left-aligned** into the shell; **About + Methodology gained a sticky
  `ContentToc` rail**; both synthesis hubs (`/narratives`, `/themes`)
  got a **glossed jump-to nav** (label · count · one-line gloss) and the
  narratives-hub intro was corrected from "three forms" to four.
- **Homepage** — rebuilt as the **magazine front** (see above), then a
  copy-tightening pass (de-duped the "written by its enemies" triple,
  cut em-dashes to zero in visible copy, fixed the confidence byline).
- **Footer** — rebuilt as a **brand sign-off** (see "Header / footer
  chrome").
- **Security** — full audit, then shipped a **live enforcing CSP**
  (report-only first, verified clean on maps/search/fonts/analytics,
  then flipped) + an autolink URL-scheme guard. (See "Security audit".)
- **Accessibility** — re-audited after the redesign (695 pages,
  `scripts/a11y-audit.mjs`): one finding, the 3 dynasty pages had no
  `<h1>` (FamilyTree rendered the title as `<h2>`) — promoted it to the
  document `<h1>`. Re-audit: **0 findings**. Contrast on the new grays
  (`#6a6a72` muted) checked ≈5:1 on white and the gray bands (passes AA);
  focus-visible + skip-link intact.
- **Prose** — em-dash pass on the un-audited `.astro` pages
  (methodology 34→12, about 4→1); content collections already within
  budget. (See "Em-dash pass on the `.astro` pages".)
- **Deferred (do not touch piecemeal)** — a **holistic visual-assets
  review** (battle diagrams, family-tree SVGs, maps, imagery incl. the
  JSTOR idea) is tabled as item 0 of the tabled list, to be done
  together once the user has a defined direction.

---

## How to work on the project

### Build / dev

- `npm run dev` — local dev server (no Pagefind index until build)
- `npm run build` — full build including Pagefind index → `dist/`
- `npm run preview` — preview the production build locally
- Netlify auto-deploys from `main` branch

### Commit conventions

When the user asks for a commit, follow this pattern:

```
git commit -m "$(cat <<'EOF'
Short summary line

Detailed body explaining what and why.

Co-Authored-By: Claude Opus 4.7 (1M context) <noreply@anthropic.com>
EOF
)"
```

The user has the full Co-Authored-By trailer baked into expectations.

### Schema validation

Astro will fail the build with helpful error messages if YAML doesn't
match the Zod schema. When adding new content, build often to catch
issues.

### Where things live

- **Page routes**: `src/pages/<collection>/[slug].astro` and
  `index.astro`
- **Content**: `src/content/<collection>/<slug>.{yaml,md}`
- **Components**: `src/components/`
- **Schema**: `src/content/config.ts`
- **Build plugins**: `src/lib/remarkAutolink.mjs`,
  `src/lib/remarkCitations.mjs`, `src/lib/historicalDate.ts`,
  `src/lib/autolink.ts`
- **Styles**: `src/styles/global.css`, `tailwind.config.mjs`
- **Layout**: `src/layouts/BaseLayout.astro` (the masthead and footer)

### Page count signal

A useful sanity check: the page count is reported in the `npm run build`
output. As of the last CLAUDE.md refresh it was around **694 pages**.
New entity additions will increase it; render-page additions for
already-existing collections will increase it dramatically.

### Schema features worth knowing about

The schema has grown substantively. Key non-obvious fields by
collection:

- **events**: `outcome` (freeform short string for battles/sieges;
  surfaced in infobox); `map_id` + `map_caption` (opt-in
  HistoricalMap embed)
- **periods**: `map_id` + `map_caption` (same)
- **places**: `founded` (founder + date object); `cultural_sphere`
  (enum); `current_status` (freeform); `patron_deity` (freeform)
- **people**: `family` (father / mother / spouses / children with
  reference + freeform-name fallbacks); `offices_held` (array of
  office + year + notes)
- **deities**: `sanctuaries[]`, `iconography`, `consort`,
  `cult_period`
- **artifacts**: `principal_sources[]`, `referenced_themes[]`,
  `image` block, `find_context`, `dating_method`,
  `interpretation_status`, `current_location`
- **places**: added `image` block (mirror of artifacts) during the
  place-imagery work. Same `src` / `alt` / `credit` / `credit_url`
  / `license` shape.
- **sourceComparisons**: `title`, `subject_event` (optional ref),
  `summary`, `source_passages[]` (each: `source` ref, `passage_ref`,
  `paraphrase`, optional `source_note`), `points_of_difference[]`
  (each: `topic`, `positions[]` per-source-slug + `what_it_says`,
  `commentary`), `working_reconstruction`, optional
  `related_takes` / `related_claims` / `related_questions` /
  `related_narratives` (string-arrays of slugs), `last_revised`.
  The source-comparison infrastructure also wires up reverse-
  lookup interlinking on event / editorialTake / openQuestion /
  narrative routes — adding a new entry surfaces automatically
  in the right places.

The battle-diagram system uses data files at
`src/data/battles/<event-slug>.ts`. Each file exports a
`BattleDiagramConfig` (types in `src/lib/battleDiagram.ts`)
describing the diagram's heading, phases (each with units, arrows,
annotations, optional rivers, optional north arrow), legend, and
caption. The events route auto-detects whether a config matches
the event slug and embeds the diagram via the shared
`BattleDiagram.astro` component, no per-slug check.

The autolink markdown-link first-pass (added to `lib/autolink.ts`)
means YAML summary fields can contain `[text](url)` links that get
rendered as proper anchors. Plus inline `**bold**` and `*italic*`
substitutions (parallel passes). Plus `## H2` / `### H3` heading
detection in `renderSummaryHtml()`, which is the helper to use for
rendering YAML summaries as full HTML with proper block structure.
Plus `stripMarkdownForMeta()` for plain-text contexts like
`<meta description>` and listing-card previews.

`renderSummaryHtml` also handles bullet lists (`- item` lines
within a block; consecutive bullet blocks group into one `<ul>`).
It normalizes YAML `>` folded scalar continuation lines (more-
indented `\n  ` runs collapse to spaces) before splitting on
single newlines for paragraph boundaries.

**Scalar-style convention (important):** because `renderSummaryHtml`
treats *every* newline as a paragraph break, any field it renders MUST
be a **folded `>`** scalar (or a single line), NOT a literal `|`
scalar. In a `>` scalar YAML folds hard-wraps to spaces, so only blank
lines survive as paragraph breaks — which is what the splitter wants.
A literal `|` scalar preserves every hard-wrap newline, so each ~50-char
line becomes its own `<p>` and the block renders double-spaced. This
bit the editorial-take `reasoning` fields (all 24 were `|`; converted
to `>` in Aug 2026). Entity `summary` fields are already `>`. If you
add a field rendered by `renderSummaryHtml`, use `>`.

### Heading anchor permalinks

Every `<h2>` and `<h3>` on substantive pages (narratives, themes,
periods, threads, editorial takes, place/people/etc detail pages
with `##` headings in YAML summaries) gets a hover-revealed ¶
pilcrow link via a small JS routine in BaseLayout. Clicking it
copies the absolute URL+hash to clipboard. CSS handles the
fade-in on `h2:hover > .anchor-link`, the `:target` flash, and
the `.anchor-copied` "link copied" feedback. The JS targets
`.prose-encyclopedia h2[id], .prose-encyclopedia h3[id]` plus
similar selectors so both YAML-summary and .md content paths get
anchored.

### Analytics

GoatCounter is wired in (script in BaseLayout `<head>`).
`window.qhTrack(name, detail)` helper in BaseLayout wraps the
GoatCounter custom-event API. Nine tracked events:
cite-panel-open, cite-copy:`<format>`, anchor-copy,
github-history-click, search-opened, search-query,
outbound-click:`<host>`, read-complete (IntersectionObserver
on `[data-version-stamp]`), not-found (on the 404 page with
attempted path). Full disclosure on /methodology under
"Analytics and privacy".

### PWA

Installable (not offline-capable). `public/site.webmanifest`
declares name, short_name, theme_color, three shortcuts
(Periods, Maps, Search). Icon set: `favicon.svg` (64x64),
`icon-maskable.svg` (512x512 with Android adaptive-icon safe
zone), `apple-touch-icon.svg` (180x180). All Tanit-mark on
tyrian. BaseLayout `<head>` has the standard link/meta complement
(manifest, apple-touch-icon, theme-color,
apple-mobile-web-app-title="Qart-Hadasht", capable=yes).

---

## Working style notes

The user appreciates:
- **Honest assessment** — including pushback when something they want
  isn't quite right
- **Substantive prose** — long-form descriptive YAML summaries on
  entity pages, real synthesis in narratives/themes/periods
- **Source rigor** — every position attributed, every claim cited
- **Decision-checking** — laying out options before building when
  there's a meaningful choice to make
- **Concise commits** — short summary + meaty body explaining the why

The user does not want:
- **Sycophancy or excessive enthusiasm** — keep it level
- **Position-taking without opposition framing** — always weigh
  competing readings
- **Over-reliance on hidden interactions** — visible structure
  preferred over hidden menus / clever JS UX
- **Visualization for its own sake** — graphics need to earn their
  place by being more useful than the alternative

---

## If you (the next Claude session) are unsure

- Read this file first
- Check recent git log for recent context
- Look at a representative entity page in each collection to absorb
  patterns before writing new content

### Canonical examples to model on

- **Long-form synthesis narratives** (the principal site voice):
  - `narratives/the-barcid-iberian-state.md` — integrated position
    with state-building and Rome-orientation as one project
  - `narratives/mago-of-carthage.md` — substantive transmission-chain
    treatment; how to walk centuries of cultural continuity from
    fragmentary evidence
  - `narratives/punic-continuity-in-roman-africa.md` — non-Roman-
    evidence-first methodology; "no hard endpoint" discipline
  - `narratives/the-numidian-punic-interface.md` — agency-of-non-
    Greco-Roman-actors framing
  - `narratives/the-tophet-controversy.md` — historiographical arc
    treatment (different from the position-taking narratives;
    walks a debate rather than synthesizing a position)
  - `narratives/the-fifth-century-constitutional-arc.md` —
    period-scope narrative that reconstructs an internal
    political transformation from thin evidence; pairs with the
    open question on the developmental mechanism

- **Editorial takes** (formal position-taking with opposition framing):
  - `editorialTakes/tophet-happened-scale-unrecoverable.yaml` —
    narrow defensible position with explicit evidence-as-load-bearing
    vs. evidence-as-non-resolving distinction
  - `editorialTakes/masinissa-strategic-opportunist.yaml` —
    rejects two conventional readings (Roman client; architect of
    destruction) in favor of a third more honest framing
  - `editorialTakes/carthage-as-cultural-integrator.yaml` — active
    agency framing parallel to Indibilis-Mandonius and Masinissa
  - `editorialTakes/barcid-iberian-state-as-state.yaml` —
    integrated framing rather than dual-track; class-stratification
    observation explicit
  - `editorialTakes/destruction-not-weak-enough.yaml` — the earliest
    canonical exemplar of the format

- **Themes as analytical hubs**:
  - `themes/punic-inscriptional-record.md` — treats a body of
    evidence as a category in its own right
  - `themes/phoenician-colonial-network.md` — structural-system
    framing with tangible-vs-legendary discipline
  - `themes/women-and-family.md` — honest evidence-base treatment
    with explicit gap-acknowledgment

- **Claims** (inferred with proper sourcing):
  - `claims/iberian-side-switching-as-agency.yaml` — the foundational
    agency reframing
  - `claims/barcid-dynastic-succession-as-state-form.yaml` —
    structural-pattern reading with multiple primary-source citations
  - `claims/melqart-cult-as-network-infrastructure.yaml` — tangible
    institutional-coordination evidence base

- **Open questions** (no-hard-answer entries with weighed candidates):
  - `openQuestions/duration-of-punic-cultural-identity.yaml` —
    framed without presumed endpoint
  - `openQuestions/punic-womens-lives-evidence-gap.yaml` — what
    surviving evidence does and doesn't permit
  - `openQuestions/punic-demographic-composition.yaml` —
    foundation-vs-demography distinction, the aDNA framing

- **Source comparisons** (multi-source parallel readings):
  - `sourceComparisons/cannae.yaml` — the POC; 4 sources, 6
    points of difference, the Maharbal anecdote as the
    headline source-critical case
  - `sourceComparisons/mercenary-war-atrocities.yaml` —
    methodologically central; Polybian framing as 6th-book
    rhetorical engine
  - `sourceComparisons/sophonisbas-death.yaml` — women's-history
    framing; Livian noble-tragic vs Diodoran politically
    substantive Sophonisba
  - `sourceComparisons/alps-crossing.yaml` — vinegar-on-rocks
    as the textbook case of Latin literary invention

- **Battle diagrams** (data-driven tactical SVG):
  - `data/battles/battle-of-cannae.ts` — the POC; two phases,
    the deepest example of the system
  - `data/battles/battle-of-zama.ts` — three phases, the
    elephant-channel and cavalry-return pattern
  - `data/battles/battle-of-lake-trasimene.ts` — uses a
    different visual idiom (hills + lake + column on the
    road) for an ambush rather than a line-of-battle event;
    shows the system can stretch when the tactical situation
    isn't a standard field engagement

### Framing discipline that runs across recent work

- **Agency framing.** When a non-Greco-Roman actor (Iberian tribal
  leader, Numidian king, Carthaginian woman) appears in the
  surviving record through hostile or moralizing Greek/Latin
  framing, the site reads against that framing to recover the
  actor's substantive agency rather than reproducing the
  framing.

- **No hard endpoints, no hard openings.** Punic civilization did
  not end at 146 BCE (continuity narrative) and did not begin at
  814 BCE Dido foundation (network theme). Both bookends push
  past Greco-Roman closure-and-opening framings to reveal longer
  integrated cultural arcs.

- **Active integration, not passive reception.** When elements
  flow between civilizations (Hellenistic forms entering
  Carthaginian practice; Punic forms entering Numidian or Roman-
  African practice), the framing emphasizes the receiving
  civilization's selection-and-adaptation agency rather than the
  donor civilization's projection.

- **Tangible-and-attested leads; legendary material bracketed.**
  When a topic mixes well-attested evidence (inscriptions,
  archaeology, multiple-source corroboration) with legendary
  tradition (Dido, foundation stories, romantic-narrative
  embellishment), the site leads with the tangible material and
  explicitly flags legendary content as such.

- **Honest gap-acknowledgment.** Where the surviving evidence
  does not support reconstruction, say so explicitly. The
  women-and-family theme and the open-question collection are
  the principal vehicles for this discipline.

Ask the user where to start if it's not obvious. Small concrete steps
beat big restructurings.
