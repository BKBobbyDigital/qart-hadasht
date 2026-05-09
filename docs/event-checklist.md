# Event build checklist

Top 10 events to populate as full vertical slices, matching the Zama
depth: dedicated event entry, supporting people, place(s), 5–8 claims
spanning the epistemic range, an editorial take where appropriate, an
open question where genuinely unresolved, a continuous-prose narrative,
and a map.

Listed here in **build order** — the order in which we'll work through
them, chosen to stress-test the schema progressively. The site itself
sorts events chronologically.

## Status

- [x] **Battle of Zama** — 202 BCE *(reference implementation)*
- [x] **Treaty of 201 BCE** *(built alongside Zama)*
- [x] **Battle of Cannae** — 216 BCE
- [x] **First Punic War — Outbreak** — 264 BCE
- [ ] **Agathocles' Invasion of Africa** — 310–307 BCE
- [ ] **Battle of the Aegates Islands & Treaty of Lutatius** — 241 BCE
- [ ] **The Mercenary War** — 241–237 BCE
- [ ] **Founding of Carthage** — traditional 814 BCE
- [ ] **First Treaty with Rome** — 509 BCE
- [ ] **Battle of Himera** — 480 BCE
- [ ] **Battle of Cape Ecnomus** — 256 BCE
- [ ] **Third Punic War & Destruction of Carthage** — 149–146 BCE

## Build-order rationale

1. **Cannae** — best-attested, tests casualties at scale, complements Zama
2. **First Punic War outbreak** — forces the causation model
3. **Agathocles' invasion** — tests campaigns / multi-year events, exercises Diodorus
4. **Aegates / Lutatius** — parallel structure to Zama / Treaty of 201
5. **Mercenary War** — internal-conflict pattern, exercises Polybius Book 1
6. **Founding** — by now schema has the muscle for legendary-confidence content
7. **First Roman Treaty** — small, tight, tests single-source attestation
8. **Battle of Himera** — Greek-source bias, opens the Sicilian-Wars cycle
9. **Cape Ecnomus** — naval, scale claims
10. **Third Punic War** — last because it's the biggest and Appian-as-principal-source deserves practice

## Future visual work (deferred)

Tracking ideas surfaced during the build that need a separate pass once
content is denser:

- **Battlefield disposition diagrams** — SVG illustrations of tactical
  layouts (Hannibal's three lines at Zama, the double envelopment at
  Cannae, the Carthaginian-Roman fleet dispositions at Mylae and
  Ecnomus). Hand-crafted, reusable component, marker conventions
  consistent across battles.
- **Campaign movement arrows** — over the map, showing march routes
  (Hannibal's Italian campaign 218–203, Scipio in Iberia and Africa,
  Agathocles' invasion).
- **Force-strength visualizations** — bar/area charts comparing
  reported troop figures across sources, surfacing the inflation
  problem visually.
- **Source-distance timeline strip** — "this claim attested by
  Polybius (50 yrs), Livy (200 yrs), Appian (350 yrs)" rendered as
  a small graphic on each claim card.
- **Time-aware territorial maps** — Carthaginian / Roman / Numidian
  control at 500, 300, 218, 200, 146 BCE.

## Slice template (for each)

- [ ] Event YAML in `src/content/events/`
- [ ] New people YAMLs in `src/content/people/` (reusing existing where possible)
- [ ] Place YAML(s) in `src/content/places/` with coordinates and candidates if contested
- [ ] 5–8 claim YAMLs in `src/content/claims/` spanning attested / inferred / contested
- [ ] Editorial take in `src/content/editorialTakes/` if there's a real synthesis to make
- [ ] Open question in `src/content/openQuestions/` if there's a genuine gap
- [ ] Narrative in `src/content/narratives/` — continuous-prose synthesis with thesis
- [ ] Sources updated in `docs/reading-list.md` if new ones cited
