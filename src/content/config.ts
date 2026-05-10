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
    /**
     * Institutions this person is substantively connected to (offices held,
     * bodies they reformed or led, sacred precincts they were associated with).
     * Bidirectional rendering with reverse-lookup on the institution page.
     */
    referenced_institutions: z.array(reference('institutions')).default([]),
    /**
     * Themes this person is substantively connected to (Hannibal → Carthaginian
     * economy via his suffete reforms; Dido → Punic identity via the foundation
     * tradition). Bidirectional rendering.
     */
    referenced_themes: z.array(reference('themes')).default([]),
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
      'war',
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
    /**
     * Soft associations to other events — concurrent campaigns, comparative
     * cases, see-also references. Distinct from causalLinks, which model
     * explicit cause/effect with mechanism. Bidirectional in rendering: if
     * event A lists B, the event page for B also surfaces A.
     */
    related_events: z
      .array(
        z.object({
          event: reference('events'),
          relation: z.string(),
          notes: z.string().optional(),
        })
      )
      .default([]),
    /**
     * Carthaginian institutions substantively relevant to this event
     * (Senate decisions, Council of 104 judgments, Tophet rituals). The
     * institution page reverse-lookups to display the event in its
     * "Referenced in events" section.
     */
    referenced_institutions: z.array(reference('institutions')).default([]),
    /**
     * Themes substantively relevant to this event (Punic religion at
     * Hamilcar's sacrificial fire, Carthaginian economy at the Lutatius
     * indemnity). Same bidirectional rendering as institutions.
     */
    referenced_themes: z.array(reference('themes')).default([]),
    /** Optional map id (filename stem under src/data/maps/) to render
     *  a historical-atlas map on the event page. Useful for war-level
     *  events that span the same strategic theater as the period map. */
    map_id: z.string().optional(),
    /** Optional caption for the historical map. */
    map_caption: z.string().optional(),
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
  type: z.enum(['person', 'place', 'event', 'institution', 'deity', 'artifact', 'theme', 'group']),
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

// ─── Groups — collective entities (peoples, mercenary bands, ethnic groups) ───
//
// Distinct from people (individuals) and from institutions (formal political
// bodies like the Carthaginian Senate). Groups are collective actors —
// Mamertines, Numidians, Italian socii, Greek Sicilians — that participate in
// events but cannot be reduced to a single named person or a formal office.

const groups = defineCollection({
  type: 'data',
  schema: z.object({
    slug: z.string(),
    name_display: z.string(),
    name_alt: z
      .object({
        greek: z.string().optional(),
        latin: z.string().optional(),
        punic: z.string().optional(),
        modern: z.string().optional(),
      })
      .optional(),
    /** What kind of collective: ethnic, mercenary, political faction, etc. */
    type: z.enum([
      'ethnic',
      'mercenary',
      'civic',
      'tribal',
      'political_faction',
      'military_unit',
    ]),
    /** Period of existence as an identifiable group. */
    active_from: historicalDate.optional(),
    active_to: historicalDate.optional(),
    polity_affiliation: z.string().optional(), // "Carthage", "Rome", "Numidia", or "independent"
    summary: z.string(),
  }),
});

// ─── Causal links — explicit cause/effect relationships between events ────────
//
// First-class modeling of historical causation. Lets us trace, for example,
// the Battle of Zama -> the Treaty of 201 -> Masinissa's later encroachments,
// or the Treaty of Lutatius -> the Mercenary War. The mechanism field captures
// *how* one event caused the other; confidence captures whether the causal
// claim itself is well-attested, inferred, or contested.

const causalLinks = defineCollection({
  type: 'data',
  schema: z.object({
    slug: z.string(),
    cause: reference('events'),
    effect: reference('events'),
    /** A short label for navigation: "ended", "led directly to", "set conditions for". */
    relation: z.string(),
    /** How the causation operated. Markdown-friendly. */
    mechanism: z.string(),
    confidence: z.enum(['attested', 'inferred', 'contested']),
    /** True if the causal claim itself (not the events) is disputed. */
    contested: z.boolean().default(false),
    notes: z.string().optional(),
    sources: z.array(claimSource).optional(),
  }),
});

// ─── Themes, cross-cutting topical pages ──────────────────────────────────────
//
// Long-form prose for topics that span the whole civilization rather than
// belonging to any single event, place, or person. Religion, daily life,
// trade networks, identity. Markdown-bodied with structured frontmatter so
// they slot into the same renderer pattern as narratives but live at /themes.

const themes = defineCollection({
  type: 'content',
  schema: z.object({
    title: z.string(),
    scope: z.enum([
      'religion',
      'daily_life',
      'society',
      'economy',
      'culture',
      'language',
      'trade',
      'identity',
      'material_culture',
      'agriculture',
      'governance',
    ]),
    summary: z.string(),
    primary_entities: z.array(claimEntity).default([]),
    related_themes: z.array(reference('themes')).default([]),
    referenced_claims: z.array(reference('claims')).default([]),
    last_revised: z.string(),
  }),
});

// ─── Institutions, formal civic and political bodies ──────────────────────────
//
// Suffetes, Senate, Council of 104, Tophet (as priestly institution), popular
// assembly. Distinct from groups (collective actors like Mamertines) and from
// places (geographic locations). An institution has a function, members, and
// an active period.

const institutions = defineCollection({
  type: 'data',
  schema: z.object({
    slug: z.string(),
    name_display: z.string(),
    name_punic: z.string().optional(),
    name_punic_script: z.string().optional(),
    name_greek: z.string().optional(),
    name_latin: z.string().optional(),
    type: z.enum([
      'magistracy',
      'council',
      'assembly',
      'sacred',
      'judicial',
      'military',
    ]),
    polity: z.string().default('Carthage'),
    active_from: historicalDate.optional(),
    active_to: historicalDate.optional(),
    summary: z.string(),
    /** Sources that describe or attest the institution. */
    principal_sources: z.array(reference('sources')).default([]),
  }),
});

// ─── Deities, the gods of the Carthaginian pantheon ───────────────────────────
//
// First-class entities for the principal deities. Distinct from people
// (mortal historical figures) and from institutions (priestly bodies and
// sanctuaries). Each deity has Phoenician/Greek/Roman attestation patterns,
// associated cults and sanctuaries, and characteristic iconography. The
// surviving evidence is uneven — much more inscriptional and archaeological
// than literary — so the schema is designed to accommodate fragmentary
// attestation.

const deities = defineCollection({
  type: 'data',
  schema: z.object({
    slug: z.string(),
    name_display: z.string(),
    name_punic: z.string().optional(),
    name_punic_script: z.string().optional(),
    name_greek: z.string().optional(),
    name_latin: z.string().optional(),
    /** "Lord of X", "the great mother", etc. */
    epithet: z.string().optional(),
    /** Brief etymology, with appropriate caution about contested readings. */
    etymology: z.string().optional(),
    /** Greco-Roman gods this deity was identified with via interpretatio. */
    interpretatio: z
      .object({
        greek: z.string().optional(),
        roman: z.string().optional(),
      })
      .optional(),
    /** "supreme male god", "great mother", "healing", "sea & maritime", etc. */
    domain: z.string().optional(),
    /** How securely attested, broadly: "well-attested", "well-attested locally",
     *  "attested in inscriptions only", "primarily literary", etc. */
    attestation: z.string().optional(),
    /** Known sanctuaries / principal cult sites. Free-form short strings,
     *  e.g. "Tophet at Carthage", "Eshmun sanctuary at Sidon",
     *  "Antas sanctuary, Sardinia". */
    sanctuaries: z.array(z.string()).default([]),
    /** Characteristic visual attributes — symbols, attributes,
     *  iconographic conventions. A short prose paragraph. */
    iconography: z.string().optional(),
    /** Divine consort or principal pairing, if any. Short string. */
    consort: z.string().optional(),
    /** Chronological span of attested cult at Carthage (or in the
     *  Punic sphere), e.g. "8th c. BCE – 146 BCE", "5th c. BCE – 146 BCE". */
    cult_period: z.string().optional(),
    summary: z.string(),
    principal_sources: z.array(reference('sources')).default([]),
    /** Themes this deity appears in: religion, identity, etc. */
    referenced_themes: z.array(reference('themes')).default([]),
  }),
});

// ─── Threads, curated reading paths through the encyclopedia ─────────────────
//
// A thread is an explicitly curated multi-page journey: an ordered list of
// stops (events, people, places, narratives, claims, etc.) framed by an
// introductory thesis. Threads complement the period pages — periods are
// chronological synthesis, threads are topical or biographical journeys
// that may cut across periods.

const threadStop = z.object({
  type: z.enum([
    'event',
    'person',
    'place',
    'institution',
    'group',
    'deity',
    'theme',
    'narrative',
    'claim',
    'editorial-take',
    'period',
    'source',
  ]),
  slug: z.string(),
  /** Optional editorial annotation explaining what to look for at this stop. */
  note: z.string().optional(),
});

const threads = defineCollection({
  type: 'content', // markdown
  schema: z.object({
    title: z.string(),
    /** Short tagline shown on the index card and as page subtitle. */
    summary: z.string(),
    /** What kind of journey: biography / question / period / theatre / debate. */
    scope: z.enum(['biography', 'question', 'period', 'theatre', 'debate']),
    stops: z.array(threadStop).min(2),
    last_revised: z.string(),
  }),
});

// ─── Artifacts — material culture as first-class entities ────────────────────
//
// The site's source layer is heavily weighted toward literary sources
// (Polybius, Livy, modern monographs). Modern Punic studies has shifted
// decisively toward archaeological / material evidence over the last
// fifty years — the Tophet bioarchaeology, Quinn's reframing of the
// Phoenician category, the long arc of Moscati / Lancel / Markoe — and
// a reference encyclopedia of Carthage that doesn't surface material
// culture as primary evidence is missing the field's actual scholarly
// center of gravity. Artifacts are first-class entities here for the
// same reason sources are: a claim that rests on the Pyrgi tablets or
// the Motya charioteer should cite the artifact as a navigable,
// metadata-rich entity rather than mention it in passing prose.

const artifacts = defineCollection({
  type: 'data',
  schema: z.object({
    slug: z.string(),
    name_display: z.string(),
    name_alt: z
      .object({
        punic: z.string().optional(),
        punic_script: z.string().optional(),
        greek: z.string().optional(),
        latin: z.string().optional(),
        /** Etruscan, Iberian, etc. — for multilingual artifacts. */
        other: z.string().optional(),
      })
      .optional(),
    /** What kind of object. */
    type: z.enum([
      'statuary',
      'inscription',
      'stele',
      'coin',
      'vessel',
      'architecture',
      'sarcophagus',
      'shipwreck',
      'metalwork',
      'jewelry',
      'mosaic',
      'composite',
    ]),
    material: z.string().optional(),     // "Carrara marble", "limestone", "silver"
    dimensions: z.string().optional(),   // "h. 1.81m", "23.4 × 18.6 cm"
    date_made: historicalDate.optional(),
    current_location: z.string().optional(),
    find_context: z
      .object({
        site: z.string(),
        year: z.number().int().optional(),
        excavator: z.string().optional(),
        circumstances: z.string().optional(),
      })
      .optional(),
    /** How scholars date the object. */
    dating_method: z
      .enum([
        'stratigraphic',
        'paleographic',
        'stylistic',
        'radiocarbon',
        'numismatic',
        'epigraphic',
        'multiple',
        'unknown',
      ])
      .optional(),
    /** Languages on inscriptions (when applicable). */
    languages: z
      .array(
        z.enum([
          'punic',
          'neopunic',
          'phoenician',
          'greek',
          'latin',
          'etruscan',
          'iberian',
          'other',
        ])
      )
      .optional(),
    /** Whether scholars agree on what the artifact attests / means. */
    interpretation_status: z
      .enum(['attested', 'contested', 'fragmentary'])
      .optional(),
    /** Brief one-liner, used on index cards. */
    summary_short: z.string(),
    /** Long-form summary. */
    summary: z.string(),
    principal_sources: z.array(reference('sources')).default([]),
    referenced_themes: z.array(reference('themes')).default([]),
    /** Image data, with Wikimedia-style attribution. */
    image: z
      .object({
        src: z.string(),                 // local path, e.g. /artifacts/motya-charioteer.jpg
        alt: z.string(),
        credit: z.string(),              // human-readable attribution
        credit_url: z.string().url().optional(),
        license: z.string(),             // "Public domain", "CC BY-SA 3.0", etc.
      })
      .optional(),
  }),
});

// ─── Periods, era-level synthesis pages ───────────────────────────────────────
//
// The narrative connective tissue between the entity collections. Each period
// is markdown prose tying the events, people, and themes of an era into a
// coherent arc. Frontmatter declares the constituent entities so the render
// page can produce a structured "in this period" sidebar / footer.

const periods = defineCollection({
  type: 'content', // markdown
  schema: z.object({
    title: z.string(),
    /** Negative for BCE. Used for chronological ordering. */
    start_year: z.number().int(),
    end_year: z.number().int(),
    /** Short prose summary for the index card and the page subtitle. */
    summary: z.string(),
    /** Curated principal events of the era; not exhaustive. */
    key_events: z.array(reference('events')).default([]),
    /** Curated principal figures. */
    key_people: z.array(reference('people')).default([]),
    /** Curated principal places. */
    key_places: z.array(reference('places')).default([]),
    /** Themes whose treatment is anchored in this period. */
    key_themes: z.array(reference('themes')).default([]),
    /** Modern and ancient sources the synthesis draws on. */
    principal_sources: z.array(reference('sources')).default([]),
    /** Optional map id (filename stem under src/data/maps/) to render
     *  a historical-atlas map at the top of the period page. */
    map_id: z.string().optional(),
    /** Optional caption for the historical map. */
    map_caption: z.string().optional(),
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
  groups,
  causalLinks,
  themes,
  institutions,
  deities,
  periods,
  threads,
  artifacts,
};
