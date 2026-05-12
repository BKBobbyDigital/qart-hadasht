import type { BattleDiagramConfig } from '../../lib/battleDiagram';

/**
 * Trebia (December 218 BCE) — the cold-river ambush.
 *
 * Numidian cavalry skirmished at the Roman camp at dawn and feigned
 * retreat back across the icy Trebia. Sempronius Longus took the bait
 * and marched his army out without breakfast, fording the freezing
 * river chest-deep. He deployed cold and hungry against Hannibal's
 * rested and fed line. Carthaginian cavalry routed both Roman cavalry
 * wings while the elephants and skirmishers attacked the Roman flanks.
 * Mago Barca's 2,000 picked troops, hidden in a watercourse the Roman
 * advance had passed over without seeing, emerged behind the Roman
 * line at the critical moment and struck their rear. The Roman center
 * (~10,000 men) cut through the Punic line and escaped to Placentia;
 * the rest of the army was destroyed.
 */
const config: BattleDiagramConfig = {
  heading: 'Battlefield diagram: the cold-river ambush',
  phases: [
    {
      label: 'Phase 1 · The lure and the hidden ambush',
      title: 'The Numidian feint draws the Romans across the icy river; Mago hides in the watercourse',
      northArrow: true,
      rivers: [
        {
          path: 'M 0 22 Q 100 30 200 22 T 400 22',
          label: 'Trebia river (chest-deep, freezing)',
          labelY: 44,
          width: 3,
        },
      ],
      units: [
        // Roman camp far north (across the river)
        { rect: { x: 150, y: 0, w: 100, h: 12 }, fill: '#dc2626', stroke: '#7f1d1d', opacity: 0.5, label: 'Roman camp', labelPosition: 'inside', labelSize: 7, labelColor: '#fff' },

        // Roman army deployed just south of the river, cold and hungry
        { rect: { x: 60, y: 80, w: 50, h: 18 }, fill: '#fca5a5', stroke: '#7f1d1d', label: 'Italian cav.', labelPosition: 'above', labelSize: 8, labelColor: '#7f1d1d' },
        { rect: { x: 120, y: 80, w: 160, h: 28 }, fill: '#dc2626', stroke: '#7f1d1d', label: 'Roman legions (cold, hungry)', labelPosition: 'inside', labelSize: 10, labelColor: '#fff', labelWeight: 600 },
        { rect: { x: 290, y: 80, w: 50, h: 18 }, fill: '#dc2626', stroke: '#7f1d1d', label: 'Roman cav.', labelPosition: 'above', labelSize: 8, labelColor: '#7f1d1d' },

        // Punic main line south, well rested; elephants on the wings (decorative; legend explains)
        { rect: { x: 60, y: 180, w: 50, h: 18 }, fill: '#92400e', stroke: '#451a03', label: 'Numidian cav.', labelPosition: 'below', labelSize: 8, labelColor: '#451a03' },
        { rect: { x: 120, y: 180, w: 30, h: 18 }, fill: '#9ca3af', stroke: '#374151' },
        { rect: { x: 155, y: 180, w: 90, h: 18 }, fill: '#fbbf24', stroke: '#92400e', label: 'Iberian / Gallic', labelPosition: 'inside', labelSize: 8, labelColor: '#451a03' },
        { rect: { x: 250, y: 180, w: 30, h: 18 }, fill: '#9ca3af', stroke: '#374151' },
        { rect: { x: 290, y: 180, w: 50, h: 18 }, fill: '#5b0f31', stroke: '#1a0410', label: 'Punic cav.', labelPosition: 'below', labelSize: 8, labelColor: '#1a0410' },

        // Mago's ambush hidden in a watercourse between the lines (east flank)
        { path: 'M 340 130 Q 360 138 380 130 Q 360 144 340 130 Z', fill: '#6b5638', stroke: '#3d2f1a', opacity: 0.55 },
      ],
      arrows: [
        // Numidian feigned retreat draws Romans south across the river
        { from: [200, 50], to: [200, 75], color: '#7f1d1d', dasharray: '3,2', width: 2 },
      ],
      annotations: [
        { x: 200, y: 64, text: 'Romans crossed cold, hungry, undeployed', size: 8, color: '#7f1d1d', italic: true },
        { x: 200, y: 148, text: 'plain', size: 8, color: '#6b5638', italic: true },
        { x: 360, y: 124, text: 'Mago hidden (2,000)', size: 8, color: '#3d2f1a', italic: true, anchor: 'middle' },
        { x: 200, y: 222, text: "Hannibal's main line, rested and fed", size: 8, color: '#5b0f31', italic: true },
      ],
    },
    {
      label: 'Phase 2 · The engagement',
      title: 'The cavalry wings collapse and the elephants pressure the Roman flanks',
      rivers: [
        { path: 'M 0 22 Q 100 30 200 22 T 400 22', width: 3 },
      ],
      units: [
        // Roman line still in place, holding center but wings folding
        { rect: { x: 60, y: 80, w: 50, h: 18 }, fill: '#fca5a5', stroke: '#7f1d1d', strokeDasharray: '3,2', opacity: 0.4, label: 'Italian cav. broken', labelPosition: 'above', labelSize: 7, labelColor: '#7f1d1d', labelItalic: true },
        { rect: { x: 120, y: 80, w: 160, h: 28 }, fill: '#dc2626', stroke: '#7f1d1d', label: 'Roman legions (engaged)', labelPosition: 'inside', labelSize: 10, labelColor: '#fff', labelWeight: 600 },
        { rect: { x: 290, y: 80, w: 50, h: 18 }, fill: '#dc2626', stroke: '#7f1d1d', strokeDasharray: '3,2', opacity: 0.4, label: 'Roman cav. broken', labelPosition: 'above', labelSize: 7, labelColor: '#7f1d1d', labelItalic: true },

        // Elephants now in the gap between cavalry and legions
        { rect: { x: 100, y: 120, w: 24, h: 16 }, fill: '#9ca3af', stroke: '#374151' },
        { rect: { x: 276, y: 120, w: 24, h: 16 }, fill: '#9ca3af', stroke: '#374151' },

        // Punic infantry advancing on Roman center
        { rect: { x: 155, y: 150, w: 90, h: 18 }, fill: '#fbbf24', stroke: '#92400e', label: 'Iberian / Gallic', labelPosition: 'inside', labelSize: 8, labelColor: '#451a03' },

        // Punic cavalry having driven off Roman wings (now circling round); labels inside to avoid overlap with the dashed broken-cav rects
        { rect: { x: 30, y: 100, w: 30, h: 18 }, fill: '#92400e', stroke: '#451a03', label: 'Numid.', labelPosition: 'inside', labelSize: 7, labelColor: '#fff', labelWeight: 600 },
        { rect: { x: 340, y: 100, w: 30, h: 18 }, fill: '#5b0f31', stroke: '#1a0410', label: 'Punic', labelPosition: 'inside', labelSize: 7, labelColor: '#fff', labelWeight: 600 },

        // Mago still hidden, watching
        { path: 'M 340 130 Q 360 138 380 130 Q 360 144 340 130 Z', fill: '#6b5638', stroke: '#3d2f1a', opacity: 0.55 },
      ],
      arrows: [
        // Cavalry wings driving in, elephants on flanks
        { from: [110, 132], to: [128, 110], color: '#374151' },
        { from: [290, 132], to: [272, 110], color: '#374151' },
        { from: [60, 110], to: [115, 100], color: '#451a03', width: 2 },
        { from: [340, 110], to: [285, 100], color: '#1a0410', width: 2 },
      ],
      annotations: [
        { x: 360, y: 124, text: '(still hidden)', size: 7, color: '#3d2f1a', italic: true, anchor: 'middle' },
        { x: 200, y: 200, text: 'Roman center fights uphill against fresh Punic infantry', size: 8, color: '#1a0410', italic: true },
      ],
    },
    {
      label: 'Phase 3 · Mago emerges and the trap closes',
      title: 'Mago strikes the Roman rear; the army is enveloped; only the center breaks through',
      rivers: [
        { path: 'M 0 22 Q 100 30 200 22 T 400 22', width: 3 },
      ],
      units: [
        // Roman center punching south through the Punic line — the breakout
        { rect: { x: 140, y: 110, w: 120, h: 24 }, fill: '#dc2626', stroke: '#7f1d1d', strokeWidth: 1.5, label: '~10,000 break south to Placentia', labelPosition: 'inside', labelSize: 9, labelColor: '#fff', labelWeight: 600 },

        // Punic line broken at the center where the Romans punched through
        { rect: { x: 80, y: 160, w: 60, h: 18 }, fill: '#fbbf24', stroke: '#92400e', label: 'Iberians', labelPosition: 'inside', labelSize: 8, labelColor: '#451a03' },
        { rect: { x: 260, y: 160, w: 60, h: 18 }, fill: '#fbbf24', stroke: '#92400e', label: 'Gauls', labelPosition: 'inside', labelSize: 8, labelColor: '#451a03' },

        // Roman wings being destroyed; dark-red label on faded red for readability
        { rect: { x: 30, y: 80, w: 90, h: 22 }, fill: '#dc2626', stroke: '#7f1d1d', strokeDasharray: '4,3', opacity: 0.35, label: 'Roman left destroyed', labelPosition: 'inside', labelSize: 8, labelColor: '#7f1d1d', labelItalic: true, labelWeight: 600 },
        { rect: { x: 280, y: 80, w: 90, h: 22 }, fill: '#dc2626', stroke: '#7f1d1d', strokeDasharray: '4,3', opacity: 0.35, label: 'Roman right destroyed', labelPosition: 'inside', labelSize: 8, labelColor: '#7f1d1d', labelItalic: true, labelWeight: 600 },

        // Mago emerging behind Roman line
        { rect: { x: 130, y: 50, w: 140, h: 20 }, fill: '#3d0a21', stroke: '#1a0410', label: "Mago strikes Roman rear", labelPosition: 'inside', labelSize: 9, labelColor: '#fff', labelWeight: 600 },

        // Cavalry now closing in
        { rect: { x: 30, y: 130, w: 40, h: 18 }, fill: '#92400e', stroke: '#451a03', label: 'Numidians', labelPosition: 'below', labelSize: 7, labelColor: '#451a03' },
        { rect: { x: 330, y: 130, w: 40, h: 18 }, fill: '#5b0f31', stroke: '#1a0410', label: 'Punic cav.', labelPosition: 'below', labelSize: 7, labelColor: '#1a0410' },
      ],
      arrows: [
        // Mago striking south into Roman rear
        { from: [200, 75], to: [200, 105], color: '#1a0410' },
        // Breakout south
        { from: [200, 134], to: [200, 175], color: '#7f1d1d', width: 3 },
        // Cavalry closing flanks
        { from: [75, 138], to: [125, 110], color: '#451a03', width: 2 },
        { from: [325, 138], to: [275, 110], color: '#1a0410', width: 2 },
      ],
      annotations: [
        { x: 200, y: 250, text: 'The breakout cut south to Placentia; the rest of the army was destroyed where it stood', size: 8, color: '#5b0f31', italic: true },
        { x: 200, y: 285, text: '~10,000 Romans escaped; ~20,000 killed or captured', size: 8, color: '#5b0f31', italic: true },
      ],
    },
  ],
  legend: [
    { label: 'Roman legions', fill: '#dc2626', stroke: '#7f1d1d' },
    { label: 'Italian allied cav.', fill: '#fca5a5', stroke: '#7f1d1d' },
    { label: 'Iberian / Gallic infantry', fill: '#fbbf24', stroke: '#92400e' },
    { label: 'African heavy infantry (Mago)', fill: '#3d0a21', stroke: '#000' },
    { label: 'Carthaginian cavalry', fill: '#5b0f31', stroke: '#000' },
    { label: 'Numidian cavalry', fill: '#92400e', stroke: '#451a03' },
    { label: 'War elephants', fill: '#9ca3af', stroke: '#374151' },
  ],
  caption:
    'Schematic, not to scale. The battle hinged on three preparations Hannibal made before contact: the dawn feint that drew the Romans cold and hungry across the icy river, the cavalry superiority that broke both Roman wings before the infantry engagement was decided, and Mago’s 2,000-man ambush concealed in a watercourse the Romans had advanced over without seeing. Only the Roman center, ~10,000 men, cut through the Punic line and escaped to Placentia.',
};

export default config;
