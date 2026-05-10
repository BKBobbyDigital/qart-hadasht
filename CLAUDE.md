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
  - `remarkAutolink.mjs` — auto-links entity mentions in markdown to their
    pages, first-mention-per-entity
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
| `narratives` | content (md) | Long-form interpretive prose (biographies, debates, event arcs) |
| `themes` | content (md) | Cross-cutting topics (religion, agriculture, governance, etc.) |
| `periods` | content (md) | Era-level synthesis (7 chronological periods) |
| `threads` | content (md) | Curated multi-page reading paths |
| `groups` | data | Collective entities (Mamertines, Numidians, dynasties) |
| `institutions` | data | Formal civic/political/sacred bodies |
| `deities` | data | Carthaginian pantheon entities |
| `causalLinks` | data | Explicit cause→effect relationships between events |

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

On mobile: infobox renders at top (collapsible via `<details>`), article
flows below.

---

## Editorial conventions

### Prose discipline rules

Two house-style rules that apply to all content the project ships:

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

### The confidence vocabulary

Every claim on the site is tagged with one of:

- **`attested`** — directly stated in primary sources, not meaningfully
  disputed (emerald chip)
- **`inferred`** — reasoned from primary evidence; not directly stated
  but well-supported (sky chip)
- **`contested`** — genuinely disputed in the sources or among modern
  scholars (amber chip)
- **`disputed`** — active disagreement among modern scholars
  (rose chip)
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

### Palette

- **Canvas (sand-50): `#f4f0e6`** — warm cream, the page background.
  Anthropic-inspired. NOT the previous gray-cream.
- **Tyrian (700: `#5b0f31`)** — the Phoenician brand color. Used as
  primary accent: rules, eyebrow labels, brand mark, citation links.
- **Ink (`#111111`)** — primary text color. Sharper than the previous
  brown-black.
- **Sand (100-700)** — borders, secondary surfaces, muted text.
- **Tyrian-100 (`#f5dee8`)** — used as decorative pink-rose for tyrian-
  themed featured cards.
- **Purple-100 (`#f3e8ff`)** — Tailwind's lavender, used for the
  card/table click/active state. Distinct from tyrian's pink.

### Typography

- **Headings**: Cormorant Garamond, semibold, tight letter-spacing
  (`-0.015em` body / `-0.02em` display), sharper near-black.
  Hero h1 = `text-5xl sm:text-7xl`. Section h2 = `text-3xl sm:text-4xl`.
- **Body**: Inter, 17px, line-height 1.6.
- **Phoenician**: Noto Sans Phoenician, used as decorative cultural
  signature throughout.
- **Eyebrow labels** (`.eyebrow`): 11px, 0.18em tracking, semibold,
  uppercase, tyrian-colored. Used above section headings.

### The Tanit mark

The schematic sign of Tanit (triangle body + horizontal arms bar +
circle head) is the brand mark. SVG component at
`src/components/TanitMark.astro`. Used in masthead, footer, and
favicon. Phoenician script lockup is preserved alongside.

### Hover / click states

- **Hover**: bg shifts from cream to slightly brighter cream
  (`hover:bg-[#faf6ec]`); border darkens to `tyrian-500`. Subtle lift.
- **Active/click**: bg goes to `purple-100` (clearly lavender, not
  pink). Distinct visual feedback for press state.
- Applied uniformly to all standard cards and sortable table rows.

### Components

Key components in `src/components/`:
- `Infobox.astro` — right-rail Quick facts panel; supports `emptyLabel`
  override (use `'none'` for count rows, default `'unknown'` for
  date/categorical rows)
- `ConfidenceBadge.astro` — claim confidence chip
- `EditorialConfidenceChip.astro` — editorial take confidence chip
- `SourceDistance.astro` — temporal-distance chip on cited sources
- `Map.astro` — Leaflet map for places/events
- `Timeline.astro` — currently NOT on homepage (removed for redesign);
  still appears on `/events`
- `TanitMark.astro` — brand mark SVG
- `CmdKSearch.astro` — global Cmd-K search modal
- `IndexViewToggle.astro` — Cards/Table view switcher for index pages

### Sortable index tables

Index pages (`/events`, `/people`, `/places`, `/sources`) have a
Cards/Table view toggle. Tables sort on column header click.
Cards are default; tables are forced to cards on mobile.

---

## What's been recently shipped

The visual redesign is **Phase 1 + 2 complete**. Phase 3 (dark mode) is
parked until the day version settles.

Most recent significant work:
1. Visual redesign Phase 1+2 — cream canvas, tyrian rules, Tanit mark,
   bigger headlines, eyebrow labels, hover/click states
2. Inline source citations across narrative/theme/period prose via
   `remarkCitations.mjs`
3. Tophet narrative (`/narratives/the-tophet-controversy`) — historiographical
   arc rather than position-taking essay
4. Infobox audit — `emptyLabel` distinction between "unknown" (genuine
   missing fact) and "none" (count = 0); inappropriate rows suppressed
   per entity-type
5. Theme pages reworked as hubs with quick-jump navigation
6. Cmd-K search modal global component
7. Threads collection (curated reading paths) — 7 threads
8. Period pages — 7 era synthesis pages with structured sidebars

---

## Outstanding work

The user wants to do these next:

### Source-weaving Phase 2 (next)
**Enriched source pages.** Source pages currently list claims that cite
them. Should become richer: for each citing claim, surface the
`passage_summary` and `passage_quote` from YAML so the source page reads
as a *digest* of the source's content as it relates to Carthaginian
history. Reading the Polybius source page should tell you "here are the
passages he preserves about Cannae, Mercenary War, etc." — not just
"here are claims that cite Polybius."

### Source-weaving Phase 3 (after)
**A "How we know what we know" methodology page.** Meta-page (probably
under About) explaining:
- The confidence vocabulary
- Source-distance reasoning (why temporal gap matters)
- Access-to-witnesses categories (contemporary / one-step / literary
  tradition / late)
- The stance vocabulary (supports / qualifies / contradicts)
- How editorial takes work
- The contested-question framework

### Other items parked / flagged across past sessions

- **Dark mode** (Phase 3 of visual redesign) — once day version settles
- **Time-aware territorial maps** — Carthaginian extent at 550 / 264 /
  218 / 202 / 146 BCE. Significant lift, big visual payoff.
- **Per-page bibliography / "further reading"** sections
- **Keyboard navigation** (`j`/`k` between siblings) — niche
- **Artifacts collection** — Motya charioteer, Pyrgi tablets,
  sign-of-Tanit stelae, Hanno's Periplus inscription. Same
  infrastructure pattern as deities.
- **Reception history** (Roman Carthage, Augustine, modern memory) —
  explicitly out of scope per original framing, possible v2

Smaller content gaps still flagged:
- Eshmun temple foundation as event
- Annual Tyre delegation as event
- Tophet-specific stratigraphic events
- Lepcis Magna, Hadrumetum (major Punic North African cities)
- Byrsa as standalone place
- Specific Iberian tribes as groups (Olcades, Vaccaei, Carpetani,
  Lacetani)
- Hanno the Great existing page upgrade (surface his speeches)
- *Ius fetiale* ritual claim
- Marcus Atilius Regulus / co-envoys of 218 BCE
- Battle of the Insubres (203 BCE Mago Barca engagement)
- More editorial takes elevated from existing prose
- Richer deity infobox (sanctuary, iconography fields)

### The timeline on the homepage was removed

We tried multiple approaches and concluded the horizontal-line format
doesn't fit data with this shape. Was removed; will revisit later.
Options floated: tiny period-band sparkline strip, vertical
chronological format, or none at all. The homepage now has no
timeline, just the period cards (themselves later removed —
homepage is now hero → start-here chips → reading threads → personal
voice → what-this-is).

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
output. As of last session it was around **505 pages**. New entity
additions will increase it; render-page additions for already-existing
collections will increase it dramatically.

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
- The `narratives/the-tophet-controversy.md`, `themes/punic-religion.md`,
  and `periods/06-second-punic-war.md` are good examples of the
  long-form synthesis voice
- The `editorialTakes/cannae-roman-refusal-to-negotiate.yaml` and
  `editorialTakes/destruction-not-weak-enough.yaml` are good examples of
  formal position-taking with opposition framing
- The `claims/cannae-tactical-template-for-italy.yaml` and
  `claims/iberian-side-switching-as-agency.yaml` are good examples of
  inferred claims with proper source structure

Ask the user where to start if it's not obvious. Small concrete steps
beat big restructurings.
