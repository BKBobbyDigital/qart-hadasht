import type { FamilyTreeConfig } from '../../lib/familyTree';

/**
 * The Magonid dynasty.
 *
 * The aristocratic house that dominated Carthaginian political
 * and military life from Mago I's reorganization c. 550 BCE
 * through the catastrophic defeat at Himera in 480 BCE and the
 * post-Himera revival under Hannibal son of Gisco in the late
 * fifth century. The genealogy preserved by Justin (19.1–2) is
 * partially reconstructed; the two generations between Mago I
 * and Hamilcar Magonid (the Himera commander) are represented
 * here as a collapsed "intermediate generations" node since
 * the individual names are contested in the surviving record.
 *
 * The Greek mother of Hamilcar Magonid is attested by
 * Herodotus 7.166 (a Syracusan noblewoman whose name does not
 * survive) and documents elite intermarriage between
 * Carthaginian aristocratic and Sicilian Greek families at
 * least as early as the late sixth century BCE.
 */
const config: FamilyTreeConfig = {
  title: 'The Magonids',
  subtitle:
    "The aristocratic house that effectively governed Carthage for a century and a half — from Mago I's military reorganization through the catastrophe at Himera and the late-fifth-century Sicilian revival under Hannibal son of Gisco.",
  period: 'c. 550 – 396 BCE',
  viewBox: '0 0 1100 720',
  nodes: {
    mago_i: {
      label: 'Mago I',
      personSlug: 'mago-i',
      role: 'Founder; military reorganization',
      dates: 'fl. c. 550 BCE',
      x: 400, y: 80,
      category: 'carthaginian',
    },
    intermediate: {
      label: 'Two generations',
      role: "Mago I's sons and grandsons; individual names reconstructed",
      x: 400, y: 220,
      category: 'carthaginian',
      uncertain: true,
    },
    hamilcar_magonid: {
      label: 'Hamilcar (Magonid)',
      personSlug: 'hamilcar-magonid',
      role: 'Himera commander; son of Hanno',
      dates: 'd. 480 BCE',
      x: 320, y: 360,
      category: 'carthaginian',
    },
    syracusan_wife: {
      label: 'Syracusan noblewoman',
      role: 'm. Hamilcar; per Herodotus 7.166',
      x: 540, y: 360,
      category: 'other',
      uncertain: true,
    },
    daughter: {
      label: "Hamilcar's daughter",
      role: 'm. Gisco; name not preserved',
      x: 320, y: 500,
      category: 'carthaginian',
      uncertain: true,
    },
    gisco: {
      label: 'Gisco',
      role: 'Exiled after Himera; father of the late-5th-c. commanders',
      x: 540, y: 500,
      category: 'carthaginian',
      uncertain: true,
    },
    hannibal_son_of_gisco: {
      label: 'Hannibal son of Gisco',
      personSlug: 'hannibal-son-of-gisco',
      role: '410 BCE Sicilian commander',
      dates: 'd. 406 BCE',
      x: 220, y: 640,
      category: 'carthaginian',
    },
    hamilcar_son_of_gisco: {
      label: 'Hamilcar son of Gisco',
      personSlug: 'hamilcar-son-of-gisco',
      role: 'Joint commander 406-396',
      x: 480, y: 640,
      category: 'carthaginian',
    },
    himilco: {
      label: 'Himilco',
      personSlug: 'himilco',
      role: 'Sicilian commander; possibly Magonid via separate line',
      dates: 'd. 396 BCE',
      x: 850, y: 640,
      category: 'carthaginian',
      context: true,
    },
  },
  edges: [
    { from: 'mago_i', to: 'intermediate', kind: 'parent' },
    { from: 'intermediate', to: 'hamilcar_magonid', kind: 'parent' },
    { from: 'hamilcar_magonid', to: 'syracusan_wife', kind: 'marriage' },
    { from: 'hamilcar_magonid', to: 'daughter', kind: 'parent' },
    { from: 'daughter', to: 'gisco', kind: 'marriage' },
    { from: 'gisco', to: 'hannibal_son_of_gisco', kind: 'parent' },
    { from: 'gisco', to: 'hamilcar_son_of_gisco', kind: 'parent' },
  ],
  legend: [
    { category: 'carthaginian', label: 'Carthaginian' },
    { category: 'other', label: 'Greek (Syracusan)' },
  ],
  caption:
    "The Magonid dynasty's genealogy as preserved by Justin 19.1–2 is partially reconstructed; the individual names in the two generations between Mago I and Hamilcar at Himera are not consistently attested across sources, and the tree collapses them into a single intermediate node. From Hamilcar Magonid onward the lineage is better established: his marriage to a Syracusan noblewoman is preserved by Herodotus 7.166 as direct attestation of late-sixth-century Carthaginian-Greek aristocratic intermarriage; his daughter's marriage to Gisco produced the late-fifth-century Sicilian commanders Hannibal son of Gisco and Hamilcar son of Gisco. Himilco, the joint commander with Hannibal son of Gisco in the campaigns of 406–396 BCE, is shown as a context node — his exact relationship to the Mago I line is contested but he operated within the same dynastic-Sicilian-revival project. The dynasty's political dominance ended with the catastrophic Sicilian failures of 396 BCE and the suicide of Himilco on his return to Carthage; the broader transition is treated in the [fifth-century constitutional arc narrative](/narratives/the-fifth-century-constitutional-arc).",
};

export default config;
