import type { FamilyTreeConfig } from '../../lib/familyTree';

/**
 * The Cornelii Scipiones — the Roman side of the Carthage story.
 *
 * Included on a Carthage-focused site because this one house brackets
 * the whole war with Carthage: Publius Cornelius Scipio Africanus beat
 * Hannibal at Zama in 202 BCE, and three generations later — reaching
 * the name by adoption, not birth — Scipio Aemilianus destroyed the
 * city in 146. The tree also carries the internal Roman argument over
 * Carthage's fate: Scipio Nasica Corculum, of the cousin branch, was
 * the standing voice against Cato's "Carthago delenda est."
 *
 * The adoption is the load-bearing relationship and is encoded by
 * color: Aemilianus was born an Aemilius (grey, another gens) and
 * married into the Cornelii Scipiones (red) by adoption — the two
 * solid parent lines into his node are his biological father
 * (Aemilius Paullus) and his adoptive father (Africanus's son).
 * Unlinked nodes (Gnaeus Calvus, the intermediate Nasica, Africanus's
 * son) have no person page yet; the intermediate Nasica is dimmed as
 * a genealogical bridge rather than a figure treated in his own right.
 */
const config: FamilyTreeConfig = {
  title: 'The Cornelii Scipiones',
  subtitle:
    'The Roman house that bracketed the war with Carthage: Scipio Africanus won at Zama in 202 BCE and, three generations later by adoption, Scipio Aemilianus destroyed the city in 146.',
  period: 'c. 250 – 129 BCE',
  viewBox: '0 0 1040 620',
  nodes: {
    publius_elder: {
      label: 'P. Scipio (the elder)',
      personSlug: 'scipio-the-elder',
      role: 'Cos. 218; fought Hannibal; died in Iberia',
      dates: 'd. 211 BCE',
      x: 300, y: 80,
      category: 'roman',
    },
    gnaeus_calvus: {
      label: 'Gn. Scipio Calvus',
      role: 'Cos. 222; Iberian command; died 211',
      dates: 'd. 211 BCE',
      x: 560, y: 80,
      category: 'roman',
    },
    africanus: {
      label: 'Scipio Africanus',
      personSlug: 'scipio-africanus',
      role: 'Victor of Zama, 202 BCE',
      dates: '236 – 183 BCE',
      x: 300, y: 230,
      category: 'roman',
    },
    nasica_intermediate: {
      label: 'P. Scipio Nasica',
      role: 'Cos. 191; the cousin branch',
      dates: 'fl. 190s BCE',
      x: 620, y: 230,
      category: 'roman',
      context: true,
    },
    aemilius_paullus: {
      label: 'L. Aemilius Paullus',
      personSlug: 'aemilius-paullus',
      role: 'Victor of Pydna; biological father',
      dates: 'c. 229 – 160 BCE',
      x: 900, y: 230,
      category: 'other',
    },
    adopter: {
      label: "P. Scipio (Africanus's son)",
      role: 'Augur; adoptive father of Aemilianus',
      dates: 'fl. 170s BCE',
      x: 300, y: 380,
      category: 'roman',
    },
    nasica_corculum: {
      label: 'Scipio Nasica Corculum',
      personSlug: 'scipio-nasica-corculum',
      role: 'Argued to spare Carthage against Cato',
      dates: 'cos. 162, 155 BCE',
      x: 620, y: 380,
      category: 'roman',
    },
    aemilianus: {
      label: 'Scipio Aemilianus',
      personSlug: 'scipio-aemilianus',
      role: 'Destroyed Carthage, 146 BCE',
      dates: '185/4 – 129 BCE',
      x: 430, y: 530,
      category: 'roman',
    },
  },
  edges: [
    // The two brothers who opened the Iberian war against the Barcids,
    // both killed there in 211.
    { from: 'publius_elder', to: 'gnaeus_calvus', kind: 'sibling' },
    // The Zama line.
    { from: 'publius_elder', to: 'africanus', kind: 'parent' },
    { from: 'africanus', to: 'adopter', kind: 'parent' },
    // The cousin (Nasica) branch descends from Gnaeus Calvus.
    { from: 'gnaeus_calvus', to: 'nasica_intermediate', kind: 'parent' },
    { from: 'nasica_intermediate', to: 'nasica_corculum', kind: 'parent' },
    // Aemilianus reaches the destruction of 146 by two fathers: born an
    // Aemilius (biological line from Paullus, routed down the right side),
    // adopted a Scipio (adoptive line from Africanus's son).
    { from: 'aemilius_paullus', to: 'aemilianus', kind: 'parent', waypoint: { x: 900, y: 0 } },
    { from: 'adopter', to: 'aemilianus', kind: 'parent' },
  ],
  legend: [
    { category: 'roman', label: 'Cornelii Scipiones' },
    { category: 'other', label: 'Aemilii (Aemilianus by birth)' },
  ],
  caption:
    "The Roman house that bookends the war with Carthage, shown here for that context — the tree is the enemy side of the story this site tells. The elder Publius Cornelius Scipio and his brother Gnaeus Scipio Calvus opened the Iberian front against the Barcids and were both killed there in 211 BCE; Publius's son became Scipio Africanus, the victor of Zama in 202. Three generations down, the man who destroyed Carthage in 146, Scipio Aemilianus, was not a Scipio by blood at all: born a son of Lucius Aemilius Paullus (the victor of Pydna), he was adopted by Africanus's own son and so carried the family that had beaten Hannibal to the city's final ruin. The cousin branch supplies the dissenting Roman voice: Scipio Nasica Corculum argued repeatedly in the Senate against Cato's demand that Carthage be destroyed, on the reasoning that a rival kept Rome disciplined. Grey marks the Aemilii, the gens Aemilianus was born into before adoption brought him among the Scipiones. Unlinked nodes have no page of their own yet.",
};

export default config;
