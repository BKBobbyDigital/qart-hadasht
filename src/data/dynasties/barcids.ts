import type { FamilyTreeConfig } from '../../lib/familyTree';

/**
 * The Barcid family tree.
 *
 * Three generations: Hamilcar Barca (FPW veteran, founder of the
 * Iberian project), his three sons (Hannibal, Hasdrubal, Mago) and
 * two daughters (married to Hasdrubal the Fair and to Naravas the
 * Numidian), and Hannibal's son by Imilce (name not preserved).
 * The unnamed daughters are rendered in italic with dashed borders
 * to indicate their partial attestation; the broader political
 * significance of their marriages is captured by the marriage
 * edges to their husbands.
 */
const config: FamilyTreeConfig = {
  title: 'The Barcids',
  subtitle:
    'The Carthaginian aristocratic house that produced Hannibal and that ran the Iberian state from 237 BCE until the Roman conquest.',
  period: 'c. 290 – 200 BCE',
  viewBox: '0 0 1000 540',
  nodes: {
    hamilcar: {
      label: 'Hamilcar Barca',
      personSlug: 'hamilcar-barca',
      role: 'FPW commander; Iberian project founder',
      dates: 'c. 275 – 228 BCE',
      x: 500, y: 80,
      category: 'carthaginian',
    },
    mago: {
      label: 'Mago Barca',
      personSlug: 'mago-barca',
      role: 'Cannae officer; Italian theatre',
      dates: 'd. c. 203 BCE',
      x: 160, y: 240,
      category: 'carthaginian',
    },
    hasdrubal_barca: {
      label: 'Hasdrubal Barca',
      personSlug: 'hasdrubal-barca',
      role: 'Iberian commander; killed at Metaurus',
      dates: 'd. 207 BCE',
      x: 340, y: 240,
      category: 'carthaginian',
    },
    hannibal: {
      label: 'Hannibal Barca',
      personSlug: 'hannibal-barca',
      role: 'SPW commander; later suffete',
      dates: '247 – c. 183 BCE',
      x: 520, y: 240,
      category: 'carthaginian',
    },
    imilce: {
      label: 'Imilce',
      role: 'Iberian noblewoman; m. Hannibal',
      x: 680, y: 240,
      category: 'iberian',
      uncertain: true,
    },
    daughter_a: {
      label: "Hamilcar's daughter",
      role: 'm. Hasdrubal the Fair',
      x: 200, y: 400,
      category: 'carthaginian',
      uncertain: true,
    },
    hasdrubal_fair: {
      label: 'Hasdrubal the Fair',
      personSlug: 'hasdrubal-the-fair',
      role: 'Iberian commander 229 – 221',
      dates: 'd. 221 BCE',
      x: 370, y: 400,
      category: 'carthaginian',
    },
    daughter_b: {
      label: "Hamilcar's daughter",
      role: 'm. Naravas',
      x: 620, y: 400,
      category: 'carthaginian',
      uncertain: true,
    },
    naravas: {
      label: 'Naravas',
      personSlug: 'naravas',
      role: 'Numidian ally; Mercenary War',
      x: 790, y: 400,
      category: 'numidian',
    },
    son_imilce: {
      label: "Son by Imilce",
      role: 'name not preserved',
      x: 480, y: 500,
      category: 'carthaginian',
      uncertain: true,
    },
  },
  edges: [
    // Hamilcar → his sons (auto-routing; sons sit in row 2)
    { from: 'hamilcar', to: 'mago', kind: 'parent' },
    { from: 'hamilcar', to: 'hasdrubal_barca', kind: 'parent' },
    { from: 'hamilcar', to: 'hannibal', kind: 'parent' },
    // Hamilcar → his daughters: explicit waypoints route the lines around
    // the sons' row by going far left / right of all row-2 boxes.
    { from: 'hamilcar', to: 'daughter_a', kind: 'parent', waypoint: { x: 40, y: 0 } },
    { from: 'hamilcar', to: 'daughter_b', kind: 'parent', waypoint: { x: 960, y: 0 } },
    // Marriages
    { from: 'hannibal', to: 'imilce', kind: 'marriage' },
    { from: 'daughter_a', to: 'hasdrubal_fair', kind: 'marriage' },
    { from: 'daughter_b', to: 'naravas', kind: 'marriage' },
    // Hannibal → his son (placed at x=480, in the gap between hasdrubal_fair
    // and daughter_b in row 3, so the line routes through empty space)
    { from: 'hannibal', to: 'son_imilce', kind: 'parent' },
  ],
  legend: [
    { category: 'carthaginian', label: 'Carthaginian' },
    { category: 'iberian', label: 'Iberian (Imilce)' },
    { category: 'numidian', label: 'Numidian (Naravas)' },
  ],
  caption:
    "Three generations of the house Hamilcar founded. The three sons commanded the principal Second Punic War theatres (Hannibal in Italy, Hasdrubal Barca in Iberia and the Alps crossing of 207, Mago in Iberia and later Liguria). The two daughters' marriages bound the family to its principal political-military alliances: Hasdrubal the Fair was Hamilcar's son-in-law and the political successor who consolidated the Iberian state from 229 to 221 BCE; Naravas was the Numidian ally whose defection from the rebel side during the Mercenary War of 240 – 238 BCE saved the Carthaginian position. The daughters' names are not preserved in the surviving record. Hannibal's marriage to the Iberian noblewoman Imilce produced a son whose name is also not preserved.",
};

export default config;
