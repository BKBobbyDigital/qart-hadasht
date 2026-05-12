import type { BattleDiagramConfig } from '../../lib/battleDiagram';

/**
 * Lake Trasimene (21 June 217 BCE) — the column ambush.
 *
 * Hannibal positioned his force in the hills above the narrow road
 * running along the north shore of Lake Trasimene and waited for
 * Flaminius's army to march into the defile in the early-morning
 * fog. The Roman column was strung out along several miles of road
 * with the lake on its left flank and the hills on its right. When
 * the head of the column reached the far end of the defile,
 * Hannibal's forces struck simultaneously along the whole length of
 * the column from the hills above. The Romans had no time to deploy
 * into battle order. Flaminius was killed in the fighting; ~15,000
 * Romans died, ~10,000 escaped, and ~6,000 of the lead element cut
 * through and surrendered the next day. It is the largest ambush
 * in surviving ancient military history.
 */
const config: BattleDiagramConfig = {
  heading: 'Battlefield diagram: the column ambush',
  phases: [
    {
      label: 'Phase 1 · The Roman column marches into the defile',
      title: 'Flaminius marches along the lake road in dawn fog while Hannibal waits in the hills',
      northArrow: true,
      units: [
        // The hills — a long northern band with gaps where Punic forces lurk
        { path: 'M 0 0 L 400 0 L 400 110 Q 300 90 200 105 Q 100 90 0 110 Z', fill: '#a8a29e', stroke: '#57534e' },

        // The lake — a long southern band
        { path: 'M 0 230 Q 100 220 200 232 Q 300 220 400 230 L 400 320 L 0 320 Z', fill: '#7dd3fc', stroke: '#0369a1', opacity: 0.65 },

        // The road — thin band between hills and lake
        { rect: { x: 0, y: 145, w: 400, h: 6 }, fill: '#fef3c7', stroke: '#a16207', strokeWidth: 0.5 },

        // Roman column strung out along the road (multiple small blocks)
        { rect: { x: 18, y: 152, w: 24, h: 11 }, fill: '#dc2626', stroke: '#7f1d1d' },
        { rect: { x: 50, y: 152, w: 24, h: 11 }, fill: '#dc2626', stroke: '#7f1d1d' },
        { rect: { x: 82, y: 152, w: 24, h: 11 }, fill: '#dc2626', stroke: '#7f1d1d' },
        { rect: { x: 114, y: 152, w: 24, h: 11 }, fill: '#dc2626', stroke: '#7f1d1d' },
        { rect: { x: 146, y: 152, w: 24, h: 11 }, fill: '#dc2626', stroke: '#7f1d1d' },
        { rect: { x: 178, y: 152, w: 24, h: 11 }, fill: '#dc2626', stroke: '#7f1d1d' },
        { rect: { x: 210, y: 152, w: 24, h: 11 }, fill: '#dc2626', stroke: '#7f1d1d' },
        { rect: { x: 242, y: 152, w: 24, h: 11 }, fill: '#dc2626', stroke: '#7f1d1d' },
        { rect: { x: 274, y: 152, w: 24, h: 11 }, fill: '#dc2626', stroke: '#7f1d1d' },
        { rect: { x: 306, y: 152, w: 24, h: 11 }, fill: '#dc2626', stroke: '#7f1d1d' },
        { rect: { x: 338, y: 152, w: 24, h: 11 }, fill: '#dc2626', stroke: '#7f1d1d' },

        // Punic forces hidden in hills — labels inside the rects for contrast
        { rect: { x: 40, y: 60, w: 90, h: 22 }, fill: '#5b0f31', stroke: '#1a0410', opacity: 0.85, label: 'Iberian / Gallic', labelPosition: 'inside', labelSize: 8, labelColor: '#fff', labelWeight: 600 },
        { rect: { x: 155, y: 50, w: 90, h: 22 }, fill: '#3d0a21', stroke: '#1a0410', opacity: 0.85, label: 'Africans + Hannibal', labelPosition: 'inside', labelSize: 7, labelColor: '#fff', labelWeight: 600 },
        { rect: { x: 270, y: 60, w: 90, h: 22 }, fill: '#92400e', stroke: '#451a03', opacity: 0.85, label: 'Numidian cav.', labelPosition: 'inside', labelSize: 8, labelColor: '#fff', labelWeight: 600 },
      ],
      annotations: [
        { x: 200, y: 30, text: 'Hannibal hidden along the entire ridge line', size: 9, color: '#1a0410', italic: true, weight: 600 },
        { x: 200, y: 130, text: 'narrow road in dawn fog', size: 8, color: '#7c5b1e', italic: true },
        { x: 200, y: 192, text: 'Roman column (~25,000) strung out along several miles', size: 8, color: '#7f1d1d', italic: true },
        { x: 200, y: 290, text: 'Lake Trasimene', size: 10, color: '#0369a1', italic: true, weight: 600 },
      ],
    },
    {
      label: 'Phase 2 · The simultaneous strike',
      title: 'Hannibal’s forces strike down from the hills along the whole length of the column',
      units: [
        // Hills (still)
        { path: 'M 0 0 L 400 0 L 400 110 Q 300 90 200 105 Q 100 90 0 110 Z', fill: '#a8a29e', stroke: '#57534e' },
        // Lake (still)
        { path: 'M 0 230 Q 100 220 200 232 Q 300 220 400 230 L 400 320 L 0 320 Z', fill: '#7dd3fc', stroke: '#0369a1', opacity: 0.65 },
        // Road
        { rect: { x: 0, y: 145, w: 400, h: 6 }, fill: '#fef3c7', stroke: '#a16207', strokeWidth: 0.5 },

        // Punic forces now sweeping down onto the road
        { rect: { x: 40, y: 110, w: 90, h: 28 }, fill: '#5b0f31', stroke: '#1a0410', label: 'Iberian / Gallic', labelPosition: 'inside', labelSize: 8, labelColor: '#fff', labelWeight: 600 },
        { rect: { x: 155, y: 110, w: 90, h: 28 }, fill: '#3d0a21', stroke: '#1a0410', label: 'Africans + Hannibal', labelPosition: 'inside', labelSize: 8, labelColor: '#fff', labelWeight: 600 },
        { rect: { x: 270, y: 110, w: 90, h: 28 }, fill: '#92400e', stroke: '#451a03', label: 'Numidian cav.', labelPosition: 'inside', labelSize: 8, labelColor: '#fff', labelWeight: 600 },

        // Roman column now in chaos — fragmented, pinned against lake
        { rect: { x: 18, y: 156, w: 24, h: 11 }, fill: '#dc2626', stroke: '#7f1d1d', strokeDasharray: '3,2', opacity: 0.6 },
        { rect: { x: 50, y: 158, w: 24, h: 11 }, fill: '#dc2626', stroke: '#7f1d1d', strokeDasharray: '3,2', opacity: 0.6 },
        { rect: { x: 82, y: 156, w: 24, h: 11 }, fill: '#dc2626', stroke: '#7f1d1d', strokeDasharray: '3,2', opacity: 0.6 },
        { rect: { x: 114, y: 158, w: 24, h: 11 }, fill: '#dc2626', stroke: '#7f1d1d', strokeDasharray: '3,2', opacity: 0.6 },
        { rect: { x: 146, y: 156, w: 24, h: 11 }, fill: '#dc2626', stroke: '#7f1d1d', strokeDasharray: '3,2', opacity: 0.6 },
        { rect: { x: 178, y: 158, w: 24, h: 11 }, fill: '#dc2626', stroke: '#7f1d1d', strokeDasharray: '3,2', opacity: 0.6 },
        { rect: { x: 210, y: 156, w: 24, h: 11 }, fill: '#dc2626', stroke: '#7f1d1d', strokeDasharray: '3,2', opacity: 0.6 },
        { rect: { x: 242, y: 158, w: 24, h: 11 }, fill: '#dc2626', stroke: '#7f1d1d', strokeDasharray: '3,2', opacity: 0.6 },
        { rect: { x: 274, y: 156, w: 24, h: 11 }, fill: '#dc2626', stroke: '#7f1d1d', strokeDasharray: '3,2', opacity: 0.6 },
        { rect: { x: 306, y: 158, w: 24, h: 11 }, fill: '#dc2626', stroke: '#7f1d1d', strokeDasharray: '3,2', opacity: 0.6 },
        { rect: { x: 338, y: 156, w: 24, h: 11 }, fill: '#dc2626', stroke: '#7f1d1d', strokeDasharray: '3,2', opacity: 0.6 },
      ],
      arrows: [
        // Punic forces striking down at multiple points; arrowheads land on the road
        { from: [80, 140], to: [80, 148], color: '#1a0410', width: 2.5 },
        { from: [140, 140], to: [140, 148], color: '#1a0410', width: 2.5 },
        { from: [200, 140], to: [200, 148], color: '#1a0410', width: 2.5 },
        { from: [260, 140], to: [260, 148], color: '#1a0410', width: 2.5 },
        { from: [320, 140], to: [320, 148], color: '#1a0410', width: 2.5 },
      ],
      annotations: [
        { x: 200, y: 30, text: 'Simultaneous attack along the whole column', size: 9, color: '#1a0410', italic: true, weight: 600 },
        { x: 200, y: 196, text: 'Romans pinned between hills and lake; no room to deploy', size: 8, color: '#7f1d1d', italic: true },
        { x: 200, y: 215, text: 'Flaminius killed; ~15,000 dead, ~6,000 captured', size: 8, color: '#5b0f31', italic: true },
        { x: 200, y: 290, text: 'Lake Trasimene', size: 10, color: '#0369a1', italic: true, weight: 600 },
      ],
    },
  ],
  legend: [
    { label: 'Roman legions (column)', fill: '#dc2626', stroke: '#7f1d1d' },
    { label: 'Iberian / Gallic infantry', fill: '#5b0f31', stroke: '#000' },
    { label: 'African heavy infantry (Hannibal)', fill: '#3d0a21', stroke: '#000' },
    { label: 'Numidian cavalry', fill: '#92400e', stroke: '#451a03' },
    { label: 'Hills', fill: '#a8a29e', stroke: '#57534e' },
    { label: 'Lake', fill: '#7dd3fc', stroke: '#0369a1' },
  ],
  caption:
    'Schematic, not to scale. Unlike the open-field battles at Trebia, Cannae, and Zama, Trasimene was not a battle but an ambush of a column on the march. Hannibal’s forces struck simultaneously down from concealed positions along the whole length of the column, giving the Romans no opportunity to deploy into battle order. The defile between the hills and the lake’s north shore had no room for maneuver and no escape line. It is the largest successful ambush of an organized army in surviving ancient military history.',
};

export default config;
