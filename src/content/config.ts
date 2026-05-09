import { defineCollection, z, reference } from 'astro:content';

/**
 * Qart-Hadasht content schemas.
 *
 * Design principles:
 * - Every factual claim is atomic and citable.
 * - Every claim has explicit confidence (attested / inferred / contested / legendary).
 * - Sources are first-class entities; "Polybius 15.11" is a row, not a string.
 * - Editorial takes are explicitly labeled, never blended into prose.
 * - Open questions are first-class — gaps get pages too.
 */

// ─── Shared primitives ────────────────────────────────────────────────────────

const historicalDate = z
  .object({
    /** Negative for BCE (e.g. -202 = 202 BCE). */
    value: z.number().int(),
    precision: z.enum(['exact', 'year', 'decade', 'century', 'legendary']),
    circa: z.boolean().default(false),
    /** For ranges; null for point-in-time. */
    range_end: z.number().int().nullable().default(null),
    notes: z.string().optional(),
  })
  .strict();

const confidence = z.enum(['attested', 'inferred', 'contested', 'legendary', 'disputed']);

const citationStance = z.enum(['supports', 'contradicts', 'qualifies']);

// ─── Sources ──────────────────────────────────────────────────────────────────

const sources = defineCollection({
  type: 'data',
  schema: z.object({
    slug: z.string(),
    title: z.string(),
    author: z.string().optional(),
    type: z.enum([
      'literary',
      'inscription',
      'archaeological',
      'numismatic',
      'modern_scholarship',
    ]),
    is_primary: z.boolean(),
    language: z.enum(['greek', 'latin', 'punic', 'neopunic', 'phoenician', 'english', 'french', 'italian', 'german']),
    date_composed: historicalDate.optional(),
    /** Approximate years between events described and composition. */
    temporal_distance_years: z.number().int().nullable().optional(),
    access_to_witnesses: z
      .enum(['contemporary', 'one_step', 'literary_tradition', 'late'])
      .optional(),
    bias_notes: z.string().optional(),
    public_domain_translation: z
      .object({
        translator: z.string(),
        year: z.number().int(),
        url: z.string().url(),
      })
      .optional(),
    summary: z.string().optional(),
  }),
});

// ─── People ───────────────────────────────────────────────────────────────────

const people = defineCollection({
  type: 'data',
  schema: z.object({
    slug: z.string(),
    name_display: z.string(),
    name_punic: z.string().optional(),
    name_punic_script: z.string().optional(), // 𐤇𐤍𐤁𐤏𐤋
    name_greek: z.string().optional(),
    name_latin: z.string().optional(),
    etymology: z.string().optional(),
    birth: historicalDate.optional(),
    death: historicalDate.optional(),
    floruit: historicalDate.optional(),
    roles: z.array(z.string()),
    polity: z.string().optional(), // "Carthage", "Rome", "Numidia", ...
    summary: z.string(),
  }),
});

// ─── Places ───────────────────────────────────────────────────────────────────

const placeCandidate = z.object({
  label: z.string(),
  lat: z.number(),
  lon: z.number(),
  confidence: z.enum(['certain', 'probable', 'possible', 'speculative']),
  notes: z.string().optional(),
});

const places = defineCollection({
  type: 'data',
  schema: z.object({
    slug: z.string(),
    name_display: z.string(),
    names_alt: z
      .object({
        punic: z.string().optional(),
        punic_script: z.string().optional(),
        greek: z.string().optional(),
        latin: z.string().optional(),
        modern: z.string().optional(),
      })
      .optional(),
    type: z.enum([
      'city',
      'battlefield',
      'sanctuary',
      'river',
      'region',
      'island',
      'harbor',
      'building',
    ]),
    /** Single best-guess location. */
    primary: placeCandidate.optional(),
    /** Used when location is contested or unknown — multiple candidates. */
    candidates: z.array(placeCandidate).optional(),
    modern_location: z.string().optional(),
    summary: z.string(),
  }),
});

// ─── Events ───────────────────────────────────────────────────────────────────

const eventParticipant = z.object({
  person: reference('people'),
  role: z.string(), // "commander", "envoy", "combatant", "witness"
  side: z.string().optional(), // "Carthaginian", "Roman", "Numidian", ...
});

const events = defineCollection({
  type: 'data',
  schema: z.object({
    slug: z.string(),
    name: z.string(),
    type: z.enum([
      'battle',
      'siege',
      'treaty',
      'founding',
      'political',
      'expedition',
      'disaster',
      'cultural',
    ]),
    date_start: historicalDate,
    date_end: historicalDate.optional(),
    place: reference('places').optional(),
    /** For events spanning multiple locations. */
    places: z.array(reference('places')).optional(),
    participants: z.array(eventParticipant).default([]),
    summary: z.string(),
    /** Which sources are the principal narrators of this event. */
    principal_sources: z.array(reference('sources')).default([]),
  }),
});

// ─── Claims — the epistemic atoms ─────────────────────────────────────────────

const claimSource = z.object({
  source: reference('sources'),
  stance: citationStance,
  passage_ref: z.string().optional(), // optional — modern scholarship citations may omit specific page
  /** Our own paraphrase, NOT a copyrighted translation. */
  passage_summary: z.string(),
  /** Optional public-domain quote. */
  passage_quote: z.string().optional(),
});

const claimEntity = z.object({
  type: z.enum(['person', 'place', 'event', 'institution', 'deity', 'artifact', 'theme']),
  slug: z.string(),
  role: z.string(), // "subject", "object", "location", "context"
});

const claims = defineCollection({
  type: 'data',
  schema: z.object({
    slug: z.string(),
    statement: z.string(),
    confidence: confidence,
    scholarly_consensus: z.string().optional(),
    dispute_summary: z.string().optional(),
    sources: z.array(claimSource).min(1),
    entities: z.array(claimEntity).default([]),
    notes: z.string().optional(),
  }),
});

// ─── Editorial takes — the site's signed positions ────────────────────────────

const editorialTakes = defineCollection({
  type: 'data',
  schema: z.object({
    slug: z.string(),
    subject_question: z.string(),
    subject_entity: claimEntity.optional(),
    position: z.string(),
    reasoning: z.string(), // markdown-friendly
    confidence: z.enum(['tentative', 'moderate', 'strong']),
    weighed_claims: z.array(reference('claims')).default([]),
    competing_positions: z
      .array(
        z.object({
          position: z.string(),
          why_rejected: z.string(),
          held_by: z.string().optional(),
        })
      )
      .default([]),
    last_reviewed: z.string(), // ISO date
    open_to_revision: z.boolean().default(true),
  }),
});

// ─── Open questions — gaps as first-class entities ────────────────────────────

const openQuestions = defineCollection({
  type: 'data',
  schema: z.object({
    slug: z.string(),
    question: z.string(),
    why_unknown: z.string(),
    evidence_summary: z.string(),
    candidate_answers: z
      .array(
        z.object({
          answer: z.string(),
          arguments_for: z.string(),
          arguments_against: z.string().optional(),
          held_by: z.string().optional(),
        })
      )
      .default([]),
    relevant_entities: z.array(claimEntity).default([]),
    what_would_resolve_this: z.string().optional(),
  }),
});

// ─── Narratives — interpretive arc-level writing ──────────────────────────────

const narratives = defineCollection({
  type: 'content', // markdown
  schema: z.object({
    title: z.string(),
    scope: z.enum(['event', 'period', 'theme', 'biography', 'debate']),
    thesis: z.string(),
    primary_entities: z.array(claimEntity).default([]),
    referenced_claims: z.array(reference('claims')).default([]),
    last_revised: z.string(),
  }),
});

// ─── Export ───────────────────────────────────────────────────────────────────

export const collections = {
  sources,
  people,
  places,
  events,
  claims,
  editorialTakes,
  openQuestions,
  narratives,
};
