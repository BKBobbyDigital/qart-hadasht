import type { BattleDiagramConfig } from '../../lib/battleDiagram';

/**
 * Drepana (249 BCE) — the great Carthaginian naval victory of the
 * First Punic War.
 *
 * Publius Claudius Pulcher attempted a dawn surprise attack on the
 * Carthaginian fleet in its harbor at Drepana on the western
 * Sicilian coast. Adherbal, rather than be trapped at anchor, led
 * his fleet out of the harbor along the seaward side of the
 * channel while the strung-out Roman column was still feeding into
 * the harbor mouth, rounded the Roman line, and formed up in open
 * water. The recalled Roman ships were forced into a ragged line
 * with the shore directly astern: no room to back water, no room
 * to maneuver. Adherbal's captains, with sea room behind them,
 * could charge, back off, and charge again. Roughly 93 of the 123
 * Roman ships were lost. Polybius 1.49-51 is the principal source.
 */
const config: BattleDiagramConfig = {
  heading: 'Battle diagram: Adherbal turns the trap inside out',
  phases: [
    {
      label: 'Phase 1 · The dawn approach',
      title:
        'Pulcher’s column hugs the coast toward the harbor of Drepana at dawn while Adherbal’s fleet lies at anchor inside',
      background: '#eaf4fb',
      northArrow: true,
      units: [
        // Western Sicilian mainland along the right edge
        {
          path: 'M 296 56 Q 282 140 292 220 Q 300 280 290 320 L 400 320 L 400 56 Z',
          fill: '#ecdcb0',
          stroke: '#a16207',
        },
        // The sickle spit enclosing the harbor at the top
        {
          path: 'M 400 30 L 252 22 Q 200 24 174 48 L 182 62 Q 208 40 254 38 L 400 46 Z',
          fill: '#ecdcb0',
          stroke: '#a16207',
        },
        // Adherbal's fleet at anchor inside the harbor
        { rect: { x: 304, y: 66, w: 14, h: 6 }, fill: '#5b0f31', stroke: '#1a0410' },
        { rect: { x: 326, y: 74, w: 14, h: 6 }, fill: '#5b0f31', stroke: '#1a0410' },
        { rect: { x: 306, y: 84, w: 14, h: 6 }, fill: '#5b0f31', stroke: '#1a0410' },
        { rect: { x: 328, y: 92, w: 14, h: 6 }, fill: '#5b0f31', stroke: '#1a0410' },
        { rect: { x: 308, y: 102, w: 14, h: 6 }, fill: '#5b0f31', stroke: '#1a0410' },
        // Roman column strung along the coast from the south
        { rect: { x: 236, y: 96, w: 7, h: 14 }, fill: '#dc2626', stroke: '#7f1d1d' },
        { rect: { x: 244, y: 124, w: 7, h: 14 }, fill: '#dc2626', stroke: '#7f1d1d' },
        { rect: { x: 250, y: 152, w: 7, h: 14 }, fill: '#dc2626', stroke: '#7f1d1d' },
        { rect: { x: 254, y: 180, w: 7, h: 14 }, fill: '#dc2626', stroke: '#7f1d1d' },
        { rect: { x: 258, y: 208, w: 7, h: 14 }, fill: '#dc2626', stroke: '#7f1d1d' },
        { rect: { x: 260, y: 236, w: 7, h: 14 }, fill: '#dc2626', stroke: '#7f1d1d' },
        { rect: { x: 262, y: 264, w: 7, h: 14 }, fill: '#dc2626', stroke: '#7f1d1d' },
        { rect: { x: 262, y: 292, w: 7, h: 14 }, fill: '#dc2626', stroke: '#7f1d1d' },
      ],
      arrows: [
        // Lead ships entering the harbor mouth
        { from: [240, 92], to: [262, 66], color: '#7f1d1d' },
      ],
      annotations: [
        { x: 350, y: 16, text: 'Drepana', size: 10, color: '#7c5b1e', italic: true, weight: 600 },
        { x: 340, y: 124, text: 'Adherbal at anchor', size: 8, color: '#1a0410', weight: 600 },
        { x: 196, y: 78, text: 'harbor mouth', size: 7, color: '#57534e', italic: true },
        { x: 180, y: 200, text: 'Pulcher’s column (123 ships)', size: 8, color: '#7f1d1d', weight: 600 },
        { x: 180, y: 214, text: 'hugging the coast at dawn', size: 8, color: '#7f1d1d', italic: true },
        { x: 80, y: 300, text: 'open water', size: 8, color: '#0369a1', italic: true },
      ],
    },
    {
      label: 'Phase 2 · Adherbal slips out and rounds the line',
      title:
        'Adherbal leads his fleet out of the harbor on the seaward side and forms a line in open water while the recalled Roman ships bunch against the coast',
      background: '#eaf4fb',
      units: [
        // Mainland
        {
          path: 'M 296 56 Q 282 140 292 220 Q 300 280 290 320 L 400 320 L 400 56 Z',
          fill: '#ecdcb0',
          stroke: '#a16207',
        },
        // Spit
        {
          path: 'M 400 30 L 252 22 Q 200 24 174 48 L 182 62 Q 208 40 254 38 L 400 46 Z',
          fill: '#ecdcb0',
          stroke: '#a16207',
        },
        // Carthaginian line forming in open water, west of the Romans
        { rect: { x: 116, y: 96, w: 14, h: 6 }, fill: '#5b0f31', stroke: '#1a0410' },
        { rect: { x: 112, y: 122, w: 14, h: 6 }, fill: '#5b0f31', stroke: '#1a0410' },
        { rect: { x: 108, y: 148, w: 14, h: 6 }, fill: '#5b0f31', stroke: '#1a0410' },
        { rect: { x: 106, y: 174, w: 14, h: 6 }, fill: '#5b0f31', stroke: '#1a0410' },
        { rect: { x: 104, y: 200, w: 14, h: 6 }, fill: '#5b0f31', stroke: '#1a0410' },
        // Roman ships recalled, bunching into a ragged inshore line
        { rect: { x: 226, y: 104, w: 7, h: 14 }, fill: '#dc2626', stroke: '#7f1d1d' },
        { rect: { x: 234, y: 132, w: 7, h: 14 }, fill: '#dc2626', stroke: '#7f1d1d' },
        { rect: { x: 228, y: 160, w: 7, h: 14 }, fill: '#dc2626', stroke: '#7f1d1d' },
        { rect: { x: 236, y: 188, w: 7, h: 14 }, fill: '#dc2626', stroke: '#7f1d1d' },
        { rect: { x: 230, y: 216, w: 7, h: 14 }, fill: '#dc2626', stroke: '#7f1d1d' },
        { rect: { x: 238, y: 244, w: 7, h: 14 }, fill: '#dc2626', stroke: '#7f1d1d' },
      ],
      arrows: [
        // Adherbal's exit: out the mouth, around, and down the seaward side
        { from: [280, 58], to: [196, 56], color: '#1a0410' },
        { from: [186, 60], to: [128, 92], color: '#1a0410' },
        // Roman recall: lead ships backing out of the mouth
        { from: [254, 70], to: [234, 100], color: '#7f1d1d', dasharray: '4,3' },
      ],
      annotations: [
        { x: 130, y: 44, text: 'Adherbal exits seaward', size: 8, color: '#1a0410', weight: 600 },
        { x: 86, y: 156, text: 'Carthaginian line:', size: 8, color: '#1a0410', anchor: 'end' },
        { x: 86, y: 168, text: 'open water astern', size: 8, color: '#1a0410', italic: true, anchor: 'end' },
        { x: 296, y: 170, text: 'Romans recalled,', size: 8, color: '#7f1d1d', anchor: 'start' },
        { x: 296, y: 182, text: 'shore astern', size: 8, color: '#7f1d1d', italic: true, anchor: 'start' },
        { x: 200, y: 300, text: 'the trap has reversed before a ram touches a hull', size: 8, color: '#57534e', italic: true },
      ],
    },
    {
      label: 'Phase 3 · Pinned against the shore',
      title:
        'With sea room to charge and recover, the Carthaginian line destroys the Roman fleet against the coast; Pulcher escapes south with about thirty ships',
      background: '#eaf4fb',
      units: [
        // Mainland
        {
          path: 'M 296 56 Q 282 140 292 220 Q 300 280 290 320 L 400 320 L 400 56 Z',
          fill: '#ecdcb0',
          stroke: '#a16207',
        },
        // Spit
        {
          path: 'M 400 30 L 252 22 Q 200 24 174 48 L 182 62 Q 208 40 254 38 L 400 46 Z',
          fill: '#ecdcb0',
          stroke: '#a16207',
        },
        // Carthaginian line pressing east
        { rect: { x: 152, y: 100, w: 14, h: 6 }, fill: '#5b0f31', stroke: '#1a0410' },
        { rect: { x: 148, y: 128, w: 14, h: 6 }, fill: '#5b0f31', stroke: '#1a0410' },
        { rect: { x: 146, y: 156, w: 14, h: 6 }, fill: '#5b0f31', stroke: '#1a0410' },
        { rect: { x: 144, y: 184, w: 14, h: 6 }, fill: '#5b0f31', stroke: '#1a0410' },
        { rect: { x: 142, y: 212, w: 14, h: 6 }, fill: '#5b0f31', stroke: '#1a0410' },
        // Roman line breaking up against the coast
        { rect: { x: 230, y: 108, w: 7, h: 14 }, fill: '#dc2626', stroke: '#7f1d1d', strokeDasharray: '3,2', opacity: 0.6 },
        { rect: { x: 238, y: 138, w: 7, h: 14 }, fill: '#dc2626', stroke: '#7f1d1d', strokeDasharray: '3,2', opacity: 0.6 },
        { rect: { x: 232, y: 168, w: 7, h: 14 }, fill: '#dc2626', stroke: '#7f1d1d', strokeDasharray: '3,2', opacity: 0.6 },
        { rect: { x: 240, y: 198, w: 7, h: 14 }, fill: '#dc2626', stroke: '#7f1d1d', strokeDasharray: '3,2', opacity: 0.6 },
        // Pulcher's surviving squadron escaping south
        { rect: { x: 218, y: 268, w: 7, h: 14 }, fill: '#dc2626', stroke: '#7f1d1d' },
      ],
      arrows: [
        // Carthaginian charges with room to back and re-charge
        { from: [170, 110], to: [224, 116], color: '#1a0410' },
        { from: [166, 166], to: [226, 176], color: '#1a0410' },
        { from: [162, 218], to: [232, 208], color: '#1a0410' },
        // Pulcher's escape
        { from: [224, 264], to: [212, 308], color: '#7f1d1d', dasharray: '4,3' },
      ],
      annotations: [
        { x: 110, y: 90, text: 'charge, back water, charge again', size: 8, color: '#1a0410', italic: true },
        { x: 312, y: 154, text: 'no room', size: 8, color: '#7f1d1d', anchor: 'start' },
        { x: 312, y: 166, text: 'to back water', size: 8, color: '#7f1d1d', italic: true, anchor: 'start' },
        { x: 160, y: 296, text: 'Pulcher escapes with ~30 ships', size: 8, color: '#7f1d1d', italic: true },
        { x: 200, y: 24, text: '~93 of 123 Roman ships lost', size: 9, color: '#57534e', weight: 600 },
      ],
    },
  ],
  legend: [
    { label: 'Roman fleet (Pulcher)', fill: '#dc2626', stroke: '#7f1d1d' },
    { label: 'Carthaginian fleet (Adherbal)', fill: '#5b0f31', stroke: '#1a0410' },
    { label: 'Drepana and the Sicilian coast', fill: '#ecdcb0', stroke: '#a16207' },
  ],
  caption:
    'Drepana, 249 BCE. Pulcher’s dawn surprise depended on catching the Carthaginian fleet at anchor; Adherbal’s answer was to refuse the harbor entirely, leading his ships out along the seaward channel while the Roman column was still feeding into the mouth. The geometry that resulted decided the battle before contact: the Carthaginian line fought with open water astern, free to charge and recover, while the Roman line fought with the shore at its back and nowhere to go. About 93 of 123 Roman ships were lost, the worst Roman naval defeat of the war, and Roman naval operations in western Sicilian waters effectively ceased for nearly a decade. The chickens-overboard omen story attached to Pulcher is later moralizing; the defeat itself is firmly attested. Positions are schematic reconstructions from Polybius 1.49-51.',
};

export default config;
