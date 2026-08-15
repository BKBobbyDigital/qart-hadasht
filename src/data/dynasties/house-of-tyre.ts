import type { FamilyTreeConfig } from '../../lib/familyTree';

/**
 * The House of Tyre — the royal line from which Carthage's founder came.
 *
 * The one dynasty tree anchored in the foundation legend rather than
 * the historical record, and a deliberate showcase of the site's
 * legendary confidence tier: the node borders encode an attestation
 * gradient rather than a clean genealogy. Hiram I (the temple-builder,
 * Solomon's contemporary) is the firm historical anchor at the top;
 * Pygmalion has an independent historical kernel (the Tyrian king
 * Pumayyaton); Mattan, Elissa/Dido, and Sychaeus survive only inside
 * the foundation narrative and are drawn with the dashed
 * legendary/uncertain border.
 *
 * Solid border = relatively firm attestation; dashed border =
 * legendary or reconstructed. Dimmed node = collapsed generations.
 * The sources also disagree on names — Justin calls the father Mattan
 * (Mutto) and the husband Acerbas; Virgil calls them Belus and
 * Sychaeus — which is noted on the nodes and in the caption.
 */
const config: FamilyTreeConfig = {
  title: 'The House of Tyre',
  subtitle:
    "The royal line of Tyre from which Carthage's founder came: in the foundation legend, Elissa (Dido) flees her brother Pygmalion after he murders her husband, and sails west to found Qart-Hadasht.",
  period: 'c. 970 – 814 BCE · largely legendary',
  viewBox: '0 0 900 630',
  nodes: {
    hiram_i: {
      label: 'Hiram I',
      personSlug: 'hiram-i',
      role: "Built the temple of Melqart; Solomon's ally",
      dates: 'r. c. 969 – 936 BCE',
      x: 450, y: 80,
      category: 'carthaginian',
    },
    bridge: {
      label: 'Later kings of Tyre',
      role: 'generations not preserved in the legend',
      x: 450, y: 230,
      category: 'carthaginian',
      context: true,
      uncertain: true,
    },
    mattan: {
      label: 'Mattan I',
      role: 'Father of Elissa; Mattan in Justin, Belus in Virgil',
      dates: 'd. c. 831 BCE',
      x: 450, y: 380,
      category: 'carthaginian',
      uncertain: true,
    },
    pygmalion: {
      label: 'Pygmalion of Tyre',
      personSlug: 'pygmalion',
      role: 'King of Tyre; murdered Sychaeus',
      dates: 'r. c. 831 – 785 BCE',
      x: 250, y: 540,
      category: 'carthaginian',
    },
    dido: {
      label: 'Elissa / Dido',
      personSlug: 'dido',
      role: 'Founder of Carthage in the legend',
      dates: 'trad. founding 814 BCE',
      x: 520, y: 540,
      category: 'carthaginian',
      uncertain: true,
    },
    sychaeus: {
      label: 'Sychaeus',
      role: "Priest of Melqart; Elissa's husband",
      x: 730, y: 540,
      category: 'carthaginian',
      uncertain: true,
    },
  },
  edges: [
    { from: 'hiram_i', to: 'bridge', kind: 'parent' },
    { from: 'bridge', to: 'mattan', kind: 'parent' },
    { from: 'mattan', to: 'pygmalion', kind: 'parent' },
    { from: 'mattan', to: 'dido', kind: 'parent' },
    { from: 'dido', to: 'sychaeus', kind: 'marriage' },
  ],
  legend: [{ category: 'carthaginian', label: 'Tyrian royal house' }],
  caption:
    "The founding line, told as the surviving tradition tells it — which is to say unevenly. Hiram I, the tenth-century king who built the great temple of Melqart and supplied cedar and craftsmen to Solomon, is the one firmly historical figure here; he sits generations above the founding, and the kings between him and Mattan are not preserved. Pygmalion has an independent historical kernel, the Tyrian king Pumayyaton, but his role in the legend — murdering his sister's husband Sychaeus, a priest of Melqart, for his hidden treasure — belongs to the foundation story preserved by Justin (drawing on Timaeus). Elissa, whom the later Latin tradition calls Dido, survives almost entirely inside that story; her flight west with Sychaeus's treasure and a band of followers is the legend's account of how Qart-Hadasht came to be founded, traditionally in 814 BCE. Dashed borders mark the figures who reach us only through the legend; the solid border marks the historical Hiram. The sources cannot even agree on the names: Justin calls the father Mattan (Mutto) and the husband Acerbas, where Virgil's Aeneid calls them Belus and Sychaeus. The historicity of Elissa herself is treated separately on this site as an open question.",
};

export default config;
