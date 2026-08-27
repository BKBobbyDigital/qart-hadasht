import type { FamilyTreeConfig } from '../../lib/familyTree';

/**
 * The Massylii royal house.
 *
 * Three generations of the eastern Numidian kingdom, anchored on
 * Masinissa. Gala as Masinissa's father and predecessor; Masinissa
 * himself as the central figure who united the eastern (Massylii)
 * and western (Masaesylii) Numidian kingdoms after defeating
 * Syphax; Sophonisba as the diplomatic-dynastic instrument
 * connecting the Carthaginian and Numidian sides of the Second
 * Punic War's African endgame; and Masinissa's three sons who
 * jointly inherited the unified kingdom on his death in 148 BCE.
 *
 * The Carthaginian Hasdrubal Gisco appears as Sophonisba's father
 * with reduced opacity to mark him as a context node — he is here
 * to anchor the Sophonisba marriages, not as part of the Numidian
 * royal line.
 */
const config: FamilyTreeConfig = {
  title: 'The Massylii royal house',
  subtitle:
    'The eastern Numidian dynasty that produced Masinissa, the Carthaginian-trained prince who became the principal Numidian king and Rome\'s key African ally from Zama onward.',
  period: 'c. 230 – 148 BCE',
  viewBox: '0 0 1200 540',
  nodes: {
    gala: {
      label: 'Gala',
      personSlug: 'gala',
      role: 'King of the Massylii',
      dates: 'd. c. 206 BCE',
      x: 300, y: 80,
      category: 'numidian',
    },
    hasdrubal_gisco: {
      label: 'Hasdrubal Gisco',
      personSlug: 'hasdrubal-gisco',
      role: 'Carthaginian commander; SPW African theater',
      x: 900, y: 80,
      category: 'carthaginian',
      context: true,
    },
    masinissa: {
      label: 'Masinissa',
      personSlug: 'masinissa',
      role: 'King of unified Numidia',
      dates: 'c. 238 – 148 BCE',
      x: 300, y: 270,
      category: 'numidian',
    },
    sophonisba: {
      label: 'Sophonisba',
      personSlug: 'sophonisba',
      role: 'Carthaginian noblewoman',
      dates: 'd. 203 BCE',
      x: 600, y: 270,
      category: 'carthaginian',
    },
    syphax: {
      label: 'Syphax',
      personSlug: 'syphax',
      role: 'King of the Masaesylii (rival)',
      dates: 'reigned 213 – 203 BCE',
      x: 1000, y: 270,
      category: 'numidian',
    },
    micipsa: {
      label: 'Micipsa',
      personSlug: 'micipsa',
      role: 'Joint heir; senior king to 118 BCE',
      x: 200, y: 460,
      category: 'numidian',
    },
    gulussa: {
      label: 'Gulussa',
      personSlug: 'gulussa',
      role: 'Joint heir; military command',
      x: 400, y: 460,
      category: 'numidian',
    },
    mastanabal: {
      label: 'Mastanabal',
      personSlug: 'mastanabal',
      role: 'Joint heir; civil administration',
      x: 600, y: 460,
      category: 'numidian',
    },
  },
  edges: [
    // Parent edges in the Massylii line
    { from: 'gala', to: 'masinissa', kind: 'parent' },
    { from: 'masinissa', to: 'micipsa', kind: 'parent' },
    { from: 'masinissa', to: 'gulussa', kind: 'parent' },
    { from: 'masinissa', to: 'mastanabal', kind: 'parent' },
    // Sophonisba's lineage on the Carthaginian side
    { from: 'hasdrubal_gisco', to: 'sophonisba', kind: 'parent' },
    // Sophonisba's two marriages, in chronological order: first Syphax
    // (Carthaginian-arranged anti-Roman alignment), then briefly
    // Masinissa after his capture of Cirta in 203 BCE.
    { from: 'syphax', to: 'sophonisba', kind: 'marriage' },
    { from: 'masinissa', to: 'sophonisba', kind: 'marriage' },
  ],
  legend: [
    { category: 'numidian', label: 'Numidian royal' },
    { category: 'carthaginian', label: 'Carthaginian' },
  ],
  caption:
    "Three generations of the Massylii royal house, with the Carthaginian Hasdrubal Gisco and the rival Masaesylii king Syphax shown for the dynastic connections that bind the tree to the broader Second Punic War African theater. Masinissa's marriage to Sophonisba in 203 BCE was the brief sequel to her earlier marriage to Syphax; she took poison rather than be surrendered to Roman custody, and produced no children with either husband. Masinissa's three sons by other unions — Micipsa, Gulussa, and Mastanabal — jointly inherited the unified Numidian kingdom on his death in 148 BCE, with Scipio Aemilianus dividing administrative responsibilities among them. Micipsa's nephew Jugurtha would later contest the inheritance in the war that bears his name (112–105 BCE), but that arc falls outside the Punic-period scope this tree covers.",
};

export default config;
