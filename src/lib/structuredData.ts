/**
 * Per-page schema.org JSON-LD builders.
 *
 * These return plain objects; BaseLayout serializes them into
 * <script type="application/ld+json"> tags in <head>, injects the
 * canonical `url` / `mainEntityOfPage`, and auto-adds a BreadcrumbList.
 * Nothing here renders visibly — it is metadata for search engines and
 * AI answer engines only.
 *
 * Date policy: ancient (BCE) dates are NOT emitted in strict schema
 * date fields (ISO-8601 negative years are poorly supported and often
 * dropped). Only modern, valid dates — publication years and revision
 * stamps — go in datePublished / dateModified. Ancient chronology lives
 * in name/description text where it is safe and still readable.
 */

const SITE = 'https://qart-hadasht.org';
const LICENSE = 'https://creativecommons.org/licenses/by/4.0/';

const PUBLISHER = {
  '@type': 'Organization',
  name: 'Qart-Hadasht',
  alternateName: 'The Carthage Encyclopedia',
  url: SITE,
};

/** Drop null/undefined/empty-string keys so JSON-LD stays clean. */
function compact<T extends Record<string, any>>(obj: T): T {
  const out: any = {};
  for (const [k, v] of Object.entries(obj)) {
    if (v === null || v === undefined || v === '') continue;
    if (Array.isArray(v) && v.length === 0) continue;
    out[k] = v;
  }
  return out;
}

type Base = { description?: string };

/** Shared fields for the encyclopedia's own authored/synthesis pages. */
function scholarlyBase(headline: string, d: Base & { last_revised?: string; last_reviewed?: string }) {
  const dateModified = d.last_revised || d.last_reviewed || undefined;
  // Google recommends headline ≤110 chars; keep the full text in name/description.
  const shortHeadline = headline.length > 110 ? headline.slice(0, 107).trimEnd() + '…' : headline;
  return compact({
    '@context': 'https://schema.org',
    '@type': 'ScholarlyArticle',
    headline: shortHeadline,
    name: headline,
    description: d.description,
    inLanguage: 'en',
    isAccessibleForFree: true,
    license: LICENSE,
    author: PUBLISHER,
    publisher: PUBLISHER,
    dateModified: isoDate(dateModified),
  });
}

/** Only pass through a valid modern ISO date (YYYY or YYYY-MM-DD, year > 0). */
function isoDate(s?: string): string | undefined {
  if (!s) return undefined;
  const m = String(s).match(/^(\d{4})(-\d{2}-\d{2})?/);
  return m ? m[1] + (m[2] ?? '') : undefined;
}

// ─── Entity builders ─────────────────────────────────────────────────

export function personSchema(d: any, base: Base) {
  const alt = [d.name_punic, d.name_greek, d.name_latin].filter(Boolean);
  return compact({
    '@context': 'https://schema.org',
    '@type': 'Person',
    name: d.name_display,
    alternateName: alt.length ? alt : undefined,
    description: base.description,
    knowsLanguage: undefined,
    // Provenance: this is an encyclopedia entry describing the person.
    subjectOf: { '@type': 'ScholarlyArticle', publisher: PUBLISHER, license: LICENSE },
  });
}

export function placeSchema(d: any, base: Base) {
  const geo = d.primary && typeof d.primary.lat === 'number'
    ? { '@type': 'GeoCoordinates', latitude: d.primary.lat, longitude: d.primary.lon }
    : undefined;
  const alt = d.names_alt ? Object.values(d.names_alt).filter((v) => typeof v === 'string') : [];
  return compact({
    '@context': 'https://schema.org',
    '@type': 'Place',
    name: d.name_display,
    alternateName: alt.length ? alt : undefined,
    description: base.description,
    geo,
  });
}

export function sourceSchema(d: any, base: Base) {
  const isModern = d.type === 'modern_scholarship';
  const year = d.date_composed?.value;
  return compact({
    '@context': 'https://schema.org',
    '@type': isModern ? 'Book' : d.type === 'inscription' ? 'CreativeWork' : 'Book',
    name: d.title,
    author: d.author ? { '@type': 'Person', name: d.author } : undefined,
    inLanguage: d.language,
    description: base.description,
    // Only modern (positive-year) publication dates are safe to emit.
    datePublished: isModern && typeof year === 'number' && year > 0 ? String(year) : undefined,
    isAccessibleForFree: true,
  });
}

export function artifactSchema(d: any, base: Base) {
  return compact({
    '@context': 'https://schema.org',
    '@type': 'CreativeWork',
    name: d.name_display || d.title,
    description: base.description,
    material: d.material,
    image: d.image?.src ? SITE + d.image.src : undefined,
    isAccessibleForFree: true,
  });
}

export function thingSchema(d: any, base: Base) {
  return compact({
    '@context': 'https://schema.org',
    '@type': 'Thing',
    name: d.name_display || d.name || d.title,
    description: base.description,
  });
}

/** Narratives, themes, periods, editorial takes, open questions, events. */
export function articleSchema(headline: string, d: any, base: Base) {
  return scholarlyBase(headline, { ...base, ...d });
}

export { PUBLISHER, SITE, LICENSE };
