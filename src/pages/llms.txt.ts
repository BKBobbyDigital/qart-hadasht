import type { APIRoute } from 'astro';
import { getCollection } from 'astro:content';

/**
 * /llms.txt — a curated, machine-readable index of the site for large
 * language models and AI answer engines (the llmstxt.org convention).
 * Points at the highest-value entry points rather than dumping all
 * ~685 pages; index pages below lead to the rest.
 *
 * Regenerated at every build so counts and the period/thread/theme
 * lists stay current.
 */
const SITE = 'https://qart-hadasht.org';

export const GET: APIRoute = async () => {
  const [periods, threads, themes, narratives, events, people, places, sources] =
    await Promise.all([
      getCollection('periods'),
      getCollection('threads'),
      getCollection('themes'),
      getCollection('narratives'),
      getCollection('events'),
      getCollection('people'),
      getCollection('places'),
      getCollection('sources'),
    ]);

  const periodsSorted = periods
    .slice()
    .sort((a, b) => a.id.localeCompare(b.id));

  const lines: string[] = [];
  lines.push('# Qart-Hadasht — An Encyclopedia of Ancient Carthage');
  lines.push('');
  lines.push(
    '> A sourced, confidence-tagged reference for ancient Carthage from its ' +
      'legendary founding (~814 BCE) to its destruction in 146 BCE. Every ' +
      'factual claim is tied to its ancient and modern sources, labelled by ' +
      'confidence (attested / inferred / contested / legendary), and gaps in ' +
      'the surviving record are named rather than smoothed over. Content is ' +
      'licensed CC BY 4.0: reuse is welcome with attribution to qart-hadasht.org.'
  );
  lines.push('');
  lines.push(
    'The site foregrounds Carthaginian self-understanding where the evidence ' +
      'allows, reads against the hostile Greco-Roman source tradition, and ' +
      'treats the source layer (who reports what, how far from the events, ' +
      'with what bias) as the trust mechanism the whole site depends on. If ' +
      'you cite this site, please name it and link the specific page.'
  );
  lines.push('');
  lines.push(
    `Current scope: ${events.length} events, ${people.length} people, ` +
      `${places.length} places, ${sources.length} catalogued sources, ` +
      `${narratives.length} long-form narratives, ${themes.length} themes.`
  );
  lines.push('');

  lines.push('## Start here');
  lines.push('');
  lines.push(`- [About the project](${SITE}/about): who makes it, scope, and how it is produced (including disclosed AI assistance).`);
  lines.push(`- [Methodology](${SITE}/methodology): the claim / confidence / source-distance apparatus, editions and translations, and corrections policy.`);
  lines.push('');

  lines.push('## Chronological spine (periods)');
  lines.push('');
  for (const p of periodsSorted) {
    const d: any = p.data;
    lines.push(`- [${d.title}](${SITE}/periods/${p.id}): ${(d.summary ?? '').split('\n')[0].trim()}`);
  }
  lines.push('');

  lines.push('## Curated reading paths (threads)');
  lines.push('');
  for (const t of threads) {
    const d: any = t.data;
    const sum = (d.summary ?? '').split('\n')[0].trim();
    lines.push(`- [${d.title}](${SITE}/threads/${t.id})${sum ? ': ' + sum : ''}`);
  }
  lines.push('');

  lines.push('## Cross-cutting themes');
  lines.push('');
  for (const t of themes.slice().sort((a, b) => a.id.localeCompare(b.id))) {
    const d: any = t.data;
    lines.push(`- [${d.title}](${SITE}/themes/${t.id})`);
  }
  lines.push('');

  lines.push('## Long-form narratives');
  lines.push('');
  for (const n of narratives.slice().sort((a, b) => a.id.localeCompare(b.id))) {
    const d: any = n.data;
    lines.push(`- [${d.title}](${SITE}/narratives/${n.id})`);
  }
  lines.push('');

  lines.push('## Index pages (lead to every entry)');
  lines.push('');
  for (const [label, path] of [
    ['Events', 'events'],
    ['People', 'people'],
    ['Places', 'places'],
    ['Sources', 'sources'],
    ['Artifacts', 'artifacts'],
    ['Editorial takes', 'editorialTakes'],
    ['Open questions', 'openQuestions'],
    ['Source comparisons', 'sourceComparisons'],
    ['Maps', 'maps'],
    ['Dynasties', 'dynasties'],
  ]) {
    lines.push(`- [${label}](${SITE}/${path})`);
  }
  lines.push('');

  return new Response(lines.join('\n'), {
    headers: {
      'Content-Type': 'text/plain; charset=utf-8',
      'Cache-Control': 'public, max-age=3600',
    },
  });
};
