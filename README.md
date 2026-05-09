# 𐤒𐤓𐤕𐤇𐤃𐤔𐤕 Qart-Hadasht

**The Carthage Encyclopedia.** An evolving reference for ancient Carthage from its founding to its destruction in 146 BCE.

## What this is

A structured, sourced, epistemically honest encyclopedia. Every factual claim is:

- **Atomic** — one assertion per claim, individually citable
- **Confidence-tagged** — `attested`, `inferred`, `contested`, or `legendary`
- **Source-linked** — to the ancient and modern works that support, qualify, or contradict it

Where the evidence supports a synthesis, the site offers labeled **editorial takes** — explicit positions with reasoning. Where we don't know, **open questions** get their own pages.

## Tech

- [Astro 5](https://astro.build) — static-first, content-driven
- TypeScript, Tailwind CSS
- Content collections with Zod schemas in `src/content/config.ts`
- Deploys to Netlify

## Content model

Eight collections, schemas in `src/content/config.ts`:

| Collection | Purpose |
|---|---|
| `sources` | Ancient and modern works cited by claims |
| `people` | Historical figures |
| `places` | Cities, battlefields, regions (with candidate locations for contested sites) |
| `events` | Battles, treaties, foundings |
| `claims` | Atomic factual statements with confidence + sources |
| `editorialTakes` | Site's signed interpretive positions |
| `openQuestions` | Named gaps in the historical record |
| `narratives` | Arc-level interpretive markdown writing |

## Develop

```bash
npm install
npm run dev      # http://localhost:4321
npm run build    # production build to dist/
```

## Adding content

Each collection is a directory of YAML (or markdown for narratives). Add a file, fill in the schema, restart dev. Schema errors surface at build time.

The Battle of Zama (`src/content/events/battle-of-zama.yaml` plus its claims, participants, and place) is the reference implementation — copy its shape when adding new events.

## Reading list

See [`docs/reading-list.md`](docs/reading-list.md) for the curated bibliography that grounds this project.

## License

- **Content**: [CC BY 4.0](https://creativecommons.org/licenses/by/4.0/) — use freely with attribution
- **Code**: MIT
