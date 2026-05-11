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
  with Cormorant labels. No OSM tiles, no client JS. Map configs
  live in `src/data/maps/*.json`; coastline data in
  `src/data/coastline-mediterranean.json`. Period and event frontmatter
  can opt in via `map_id` + `map_caption` fields. Currently used for
  the three Punic War strategic maps (FPW, SPW, TPW) on the period
  pages and on the war-level event pages.
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
parked until the day version settles. The site is **~598 pages** as of
the last build.

### Collection counts (current)

| Collection | Count |
|---|---|
| events | 89 |
| people | 74 |
| places | 44 |
| sources | 47 |
| claims | 172 |
| editorialTakes | 21 |
| openQuestions | 13 |
| artifacts | 41 |
| narratives | 30 |
| themes | 14 |
| periods | 7 |
| threads | 7 |
| groups | 18 |
| institutions | 6 |
| deities | 10 |
| causalLinks | 12 |

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

### Editorial takes — now at 21

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
- Richer deity infobox (sanctuary, iconography, consort, cult_period
  fields; all 10 deities filled)
- Threads collection (7 curated reading paths)
- Period pages (7 era syntheses)
- Cmd-K search modal global component

---

## Outstanding work

### Active work queue (next-level pass)

After the polish-pass and the territorial-maps + three-companion-
narratives + maps-index work, the project sits at ~602 pages with
comprehensive entity coverage. Content additions are at diminishing
returns; the queue below targets quality, scholarly rigor, and
visible polish over new content surface.

**Order is foundation-first** — link audit and proofread before new
content lands; new content (place imagery, year-by-year) on cleaned
foundation; citation rigor and accessibility audit at the end so
they capture the settled state.

1. **Internal-link health audit** — scripted crawl of every
   `<a href>` against actual page existence. 602 pages with heavy
   cross-referencing means there are almost certainly broken or
   stale internal references by now. Foundation work; also the
   fastest item (single afternoon of scripted crawling + targeted
   fixes).

2. **Substantive prose proofread pass** — clean-eyes editorial walk
   across all narratives, themes, periods, and substantive entity
   summaries. Catches awkward phrasing from cross-session drift,
   internal inconsistencies, accidentally-doubled coverage between
   narrative and theme, em-dash overuse against the house-style
   rule. Unsexy but the difference between good encyclopedia and
   great encyclopedia.

3. **Place imagery** — public-domain photos of Carthage,
   Kerkouane, Motya, Tharros, Sulci, the cothon, the Byrsa, Lepcis
   Magna, etc. Same source/credit discipline as artifacts. The
   places collection has been intentionally text-only; PD
   archaeological-site photos do exist (Wikimedia Commons,
   French/Italian national archive collections), and the visual
   gap is real.

4. **Year-by-year chronological spine** — `/chronology` collection
   where each significant year from ~600 BCE to 146 BCE gets a
   page tying together what happened. Currently the site has
   three organizational axes (event importance, period era, theme
   topic); year-by-year is the fourth, and it's the one a lot of
   readers actually want ("what happened in 218 BCE?"). The data
   exists across events; this synthesizes.

5. **Citation rigor for academic use** — DOI minting via Zenodo
   for substantive narratives. BibTeX/RIS export per claim. Stable
   anchored permalinks per paragraph. Lets academics cite the site,
   which drives academic linking and credibility. Possibly
   highest-leverage move for scholarly standing, though invisible
   to general readers.

6. **Accessibility / performance audit** — Lighthouse scores;
   screen-reader testing of maps and Cmd-K; color contrast
   verification on muted text; keyboard navigation completeness.
   Last because it should capture the whole settled site.

### Tabled — substantial next-level moves, revisit after the active queue completes

These are real "next level" directions the user has explicitly
tabled until the active 6-item queue ships. **Revisit each after
queue completion**; do not surface unsolicited.

1. **Revamp all UI** — full visual / interaction redesign. Distinct
   from the small UI/UX polish previously parked. User-scoped as
   a deliberate future direction once the content side is
   genuinely settled.

2. **Battle tactical visualizations** — animated/diagrammatic SVG
   of Cannae, Zama, Trebia, Trasimene, Aegates Islands, Drepana,
   with step-through deployment-to-resolution views and sourcing
   notes. The single biggest "wow" addition the site could take;
   tooling fit is identical to the existing maps system plus the
   territorial-map toggle pattern. ~10 days for the canonical
   battle set done well.

3. **Family tree / dynasty explorer** — SVG-rendered interactive
   family trees for the Barcids (Hamilcar → Hannibal/Hasdrubal/
   Mago + their generation and successors), the Magonid clan, the
   Massylii royal house (Gala → Masinissa → his three sons), the
   Cornelii Scipiones. Ancient prosopography is hard to follow in
   prose; visual trees genuinely useful.

4. **Punic inscriptional corpus interface** — searchable interface
   for the CIS/KAI corpus excerpts the site references — Punic
   text, transliteration, translation, find-context, museum
   location. Most academically distinctive feature the site could
   add. 4-6 weeks of careful work to do meaningfully.

5. **Audio narration** — recorded readings of the substantive
   narratives, hosted alongside the text. Podcast-like reach
   without a podcast feed. Production lift is non-trivial; reach
   gain is real but specific to a particular audience segment.

### Residual prose work from active queue item #2 (held for later)

The em-dash audit reduced the flagged file count from 249 to 68
(73% reduction) via scripted paired-parenthetical conversion. The
**65 remaining em-dash-overuse files** are single em-dashes used
for sentence pivots, list intros, or appositives — cases that
genuinely need per-file human judgment per the CLAUDE.md rule's
"sharp interruption with strong rhetorical weight" allowance. Run
`node scripts/prose-audit.mjs` to see the current list ranked by
severity. Top residual hotspots: `people/malchus.yaml` (4.88/250),
`claims/tagus-tactical-template-for-italy.yaml` (4.17/250),
`groups/magonids.yaml` (3.73/250). Address organically as content
gets touched, or run a manual pass when convenient.

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
  doesn't exist

### Known issues — flagged, not urgent

**`npm audit` reports two moderate-severity CVEs:**

1. **Astro <6.1.6** — XSS in `define:vars` directive. The codebase
   doesn't use `define:vars`, so the vulnerability has no real-world
   exploitability here. Fix requires upgrading to Astro 6 (major
   version, breaking changes — content collections API has shifted,
   some directives deprecated). Defer until a deliberate maintenance
   window.

2. **`yaml` package** — stack overflow on deeply nested YAML.
   Transitive dependency of `yaml-language-server` via
   `@astrojs/check`. Build-time / dev-time only; no production
   runtime exposure. Defer.

Revisit dependencies in 3-6 months or sooner if a CVE applies to a
feature the site actually uses. `npm audit` will continue to flag
these but they're informational for this codebase.

### The timeline on the homepage was removed

We tried multiple approaches and concluded the horizontal-line format
doesn't fit data with this shape. Was removed; will revisit later.
Options floated: tiny period-band sparkline strip, vertical
chronological format, or none at all. The homepage is now hero →
start-here chips → reading threads → personal voice → what-this-is.

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
output. As of the last CLAUDE.md refresh it was around **598 pages**.
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

The autolink markdown-link first-pass (added to `lib/autolink.ts`)
means YAML summary fields can contain `[text](url)` links that get
rendered as proper anchors. This is heavily used for back-citations
from people / deity / artifact summary fields into editorial takes
and narratives.

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
