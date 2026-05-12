import type { BattleDiagramConfig } from '../../lib/battleDiagram';

/**
 * Cannae (2 August 216 BCE) — the canonical double envelopment.
 *
 * Hannibal's weakest troops (Iberian and Gallic infantry) deployed
 * in a forward crescent that flexed back under Roman pressure; his
 * veteran African heavy infantry waited on the wings and wheeled
 * inward as the Romans pushed deeper; his cavalry, having broken
 * both Roman cavalry wings, returned to strike the Roman rear.
 */
const config: BattleDiagramConfig = {
  heading: 'Battlefield diagram: the double envelopment',
  phases: [
    {
      label: 'Phase 1 · Initial deployment',
      title: 'Initial deployment at Cannae',
      northArrow: true,
      rivers: [
        {
          path: 'M 0 12 Q 100 20 200 12 T 400 12',
          label: 'Aufidus river',
          labelY: 32,
        },
      ],
      units: [
        // Roman (north side, facing south)
        { rect: { x: 40, y: 55, w: 50, h: 22 }, fill: '#fca5a5', stroke: '#7f1d1d', label: 'Italian cav.', labelPosition: 'above', labelSize: 8, labelColor: '#7f1d1d' },
        { rect: { x: 100, y: 50, w: 200, h: 32 }, fill: '#dc2626', stroke: '#7f1d1d', label: 'Roman legions (deepened)', labelPosition: 'inside', labelSize: 11, labelWeight: 600 },
        { rect: { x: 310, y: 55, w: 50, h: 22 }, fill: '#dc2626', stroke: '#7f1d1d', label: 'Roman cav.', labelPosition: 'above', labelSize: 8, labelColor: '#7f1d1d' },
        // Carthaginian (south side, facing north)
        { rect: { x: 40, y: 240, w: 50, h: 22 }, fill: '#92400e', stroke: '#451a03', label: 'Numidian cav.', labelPosition: 'below', labelSize: 8, labelColor: '#451a03' },
        { rect: { x: 100, y: 245, w: 50, h: 20 }, fill: '#3d0a21', stroke: '#1a0410', label: 'Africans (back)', labelPosition: 'below', labelSize: 7, labelColor: '#3d0a21' },
        // Iberian/Gallic crescent (bowed forward)
        { path: 'M 150 245 Q 200 175 250 245', fill: '#fbbf24', stroke: '#92400e', strokeWidth: 1.5 },
        { rect: { x: 250, y: 245, w: 50, h: 20 }, fill: '#3d0a21', stroke: '#1a0410', label: 'Africans (back)', labelPosition: 'below', labelSize: 7, labelColor: '#3d0a21' },
        { rect: { x: 310, y: 240, w: 50, h: 22 }, fill: '#5b0f31', stroke: '#1a0410', label: 'Carth. cav. (Hasdrubal)', labelPosition: 'below', labelSize: 8, labelColor: '#1a0410' },
      ],
      annotations: [
        { x: 200, y: 200, text: 'Iberian/Gallic crescent', size: 9, color: '#451a03' },
        { x: 200, y: 212, text: '(bowed forward)', size: 7, color: '#451a03', italic: true },
        { x: 200, y: 310, text: 'Hannibal commanding', size: 8, color: '#5b0f31', italic: true },
      ],
    },
    {
      label: 'Phase 2 · The envelopment',
      title: 'The double envelopment at Cannae',
      rivers: [
        {
          path: 'M 0 12 Q 100 20 200 12 T 400 12',
        },
      ],
      units: [
        // Flexed-back crescent (now bowed south, dashed)
        { path: 'M 100 100 Q 200 200 300 100', fill: 'none', stroke: '#fbbf24', strokeWidth: 3, strokeDasharray: '4,3', opacity: 0.6 },
        // Roman legions encircled in center
        { rect: { x: 130, y: 115, w: 140, h: 60 }, fill: '#dc2626', stroke: '#7f1d1d', strokeWidth: 1.5, label: 'Roman legions', labelPosition: 'inside', labelSize: 11, labelWeight: 600 },
        // African heavy infantry wheeling inward — left wing
        { rect: { x: 60, y: 130, w: 60, h: 35 }, fill: '#3d0a21', stroke: '#1a0410', label: 'Africans', labelPosition: 'inside', labelSize: 9, labelColor: '#fff' },
        // African heavy infantry wheeling inward — right wing
        { rect: { x: 280, y: 130, w: 60, h: 35 }, fill: '#3d0a21', stroke: '#1a0410', label: 'Africans', labelPosition: 'inside', labelSize: 9, labelColor: '#fff' },
        // Cavalry strike on Roman rear
        { rect: { x: 130, y: 220, w: 140, h: 25 }, fill: '#5b0f31', stroke: '#1a0410', label: 'Cavalry strike on rear', labelPosition: 'inside', labelSize: 9, labelColor: '#fff' },
        // Roman cavalry destroyed (faint, dashed)
        { rect: { x: 40, y: 55, w: 50, h: 22 }, fill: '#fca5a5', stroke: '#7f1d1d', strokeDasharray: '3,2', opacity: 0.4, label: 'Italian cav. broken', labelPosition: 'above', labelSize: 7, labelColor: '#7f1d1d', labelItalic: true },
        { rect: { x: 310, y: 55, w: 50, h: 22 }, fill: '#dc2626', stroke: '#7f1d1d', strokeDasharray: '3,2', opacity: 0.4, label: 'Roman cav. broken', labelPosition: 'above', labelSize: 7, labelColor: '#7f1d1d', labelItalic: true },
      ],
      arrows: [
        { from: [120, 148], to: [132, 148], color: '#3d0a21' },
        { from: [280, 148], to: [268, 148], color: '#3d0a21' },
        { from: [200, 218], to: [200, 188], color: '#5b0f31' },
      ],
      annotations: [
        { x: 200, y: 92, text: '(crescent flexed back)', size: 8, color: '#92400e', italic: true },
        { x: 200, y: 280, text: '~50,000 Roman casualties in a single afternoon', size: 8, color: '#5b0f31', italic: true },
      ],
    },
  ],
  legend: [
    { label: 'Roman legions', fill: '#dc2626', stroke: '#7f1d1d' },
    { label: 'Italian allied cav.', fill: '#fca5a5', stroke: '#7f1d1d' },
    { label: 'Iberian / Gallic infantry', fill: '#fbbf24', stroke: '#92400e' },
    { label: 'African heavy infantry', fill: '#3d0a21', stroke: '#000' },
    { label: 'Carthaginian cavalry', fill: '#5b0f31', stroke: '#000' },
    { label: 'Numidian cavalry', fill: '#92400e', stroke: '#451a03' },
  ],
  caption:
    'Schematic, not to scale. Hannibal placed his weakest troops (Iberians and Gauls) in a forward crescent that flexed back as Roman pressure built; his veteran African heavy infantry on the wings then wheeled inward to attack Roman flanks while his cavalry, having broken both Roman cavalry wings, returned to strike the Roman rear. The result was complete encirclement.',
};

export default config;
