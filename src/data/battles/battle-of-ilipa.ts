import type { BattleDiagramConfig } from '../../lib/battleDiagram';

/**
 * Ilipa (206 BCE) — Scipio's reverse-Cannae.
 *
 * For several days before the battle Scipio deployed each morning
 * in the standard order — strong Romans in the center, Iberian
 * allies on the wings — and Hasdrubal Gisco and Mago Barca
 * deployed in the matching mirror order with Carthaginian and
 * Libyan veterans in their center. On the day of battle Scipio
 * marched out at dawn before the Carthaginians had eaten, with
 * his order REVERSED: Iberian allies in the Roman center, Roman
 * heavy infantry on the wings. Hasdrubal had to deploy in his
 * usual order without time to reorganize. Scipio held his weak
 * center back and wheeled his strong wings forward at an oblique
 * angle, engaging the weak Carthaginian wings while the strong
 * Carthaginian center was pinned by the threat of the Roman
 * center it could not advance against without exposing its
 * flanks. The Carthaginian wings collapsed; the whole line then
 * had to retire toward camp; rain saved most of the army from
 * destruction but ended Carthaginian field power in Iberia.
 */
const config: BattleDiagramConfig = {
  heading: 'Battlefield diagram: the reversed deployment and the refused center',
  phases: [
    {
      label: 'The reversed deployment',
      title: 'Scipio reverses his usual deployment; strong Romans on wings, weak Iberians in center',
      description:
        'For days Scipio had paraded in the standard order, his strongest troops in the center; on the day of battle he marches out at dawn with the order reversed, Roman heavy infantry on the wings and Iberian allies in the middle. Hasdrubal Gisco, deploying hastily before his men have eaten, falls into his usual array, and his weakest troops now stand opposite Scipio’s strongest.',
      northArrow: true,
      units: [
        // Roman (north side, facing south) — REVERSED order
        { rect: { x: 35, y: 65, w: 50, h: 20, rx: 2 }, fill: '#1e3a8a', stroke: '#172554', patternFill: 'hatch', label: 'Roman cav.', labelPosition: 'above', labelSize: 8, labelColor: '#172554' },
        // Strong Roman heavy infantry — LEFT wing
        { rect: { x: 95, y: 65, w: 70, h: 28, rx: 2 }, fill: '#1e3a8a', stroke: '#172554', label: 'Roman heavies', labelPosition: 'inside', labelSize: 9, labelColor: '#fff', labelWeight: 600 },
        // Weak Iberian allies in CENTER (Scipio's holds them back)
        { rect: { x: 170, y: 65, w: 60, h: 28, rx: 2 }, fill: '#fde68a', stroke: '#92400e', label: 'Iberian allies', labelPosition: 'inside', labelSize: 9, labelColor: '#451a03', labelWeight: 600 },
        // Strong Roman heavy infantry — RIGHT wing
        { rect: { x: 235, y: 65, w: 70, h: 28, rx: 2 }, fill: '#1e3a8a', stroke: '#172554', label: 'Roman heavies', labelPosition: 'inside', labelSize: 9, labelColor: '#fff', labelWeight: 600 },
        { rect: { x: 315, y: 65, w: 50, h: 20, rx: 2 }, fill: '#92400e', stroke: '#451a03', patternFill: 'dots', label: 'Numidian cav. (allied)', labelPosition: 'above', labelSize: 8, labelColor: '#451a03' },

        // Carthaginian (south side, facing north) — STANDARD order
        { rect: { x: 35, y: 215, w: 50, h: 20, rx: 2 }, fill: '#5b0f31', stroke: '#1a0410', patternFill: 'hatch', label: 'Punic cav.', labelPosition: 'below', labelSize: 8, labelColor: '#1a0410' },
        // Iberian allies on Punic LEFT (weak)
        { rect: { x: 95, y: 207, w: 70, h: 28, rx: 2 }, fill: '#fbbf24', stroke: '#92400e', label: 'Iberian allies', labelPosition: 'inside', labelSize: 9, labelColor: '#451a03', labelWeight: 600 },
        // Carthaginian / Libyan veterans in CENTER (strong)
        { rect: { x: 170, y: 207, w: 60, h: 28, rx: 2 }, fill: '#3d0a21', stroke: '#1a0410', label: 'Punic veterans', labelPosition: 'inside', labelSize: 9, labelColor: '#fff', labelWeight: 600 },
        // Iberian allies on Punic RIGHT (weak)
        { rect: { x: 235, y: 207, w: 70, h: 28, rx: 2 }, fill: '#fbbf24', stroke: '#92400e', label: 'Iberian allies', labelPosition: 'inside', labelSize: 9, labelColor: '#451a03', labelWeight: 600 },
        { rect: { x: 315, y: 215, w: 50, h: 20, rx: 2 }, fill: '#92400e', stroke: '#451a03', patternFill: 'dots', label: 'Numidian cav.', labelPosition: 'below', labelSize: 8, labelColor: '#451a03' },

        // Elephants on Punic wings, forward of infantry
        { rect: { x: 100, y: 175, w: 30, h: 18, rx: 2 }, fill: '#9ca3af', stroke: '#374151' },
        { rect: { x: 270, y: 175, w: 30, h: 18, rx: 2 }, fill: '#9ca3af', stroke: '#374151' },
      ],
      annotations: [
        { x: 200, y: 130, text: 'Scipio marches out at dawn; Hasdrubal deploys hastily without breakfast', size: 8, color: '#172554', italic: true },
        { x: 200, y: 148, text: 'Scipio’s strong troops now face Hasdrubal’s WEAK wings', size: 9, color: '#1a0410', italic: true, weight: 600 },
        { x: 200, y: 268, text: 'Hasdrubal Gisco and Mago Barca commanding', size: 8, color: '#5b0f31', italic: true },
      ],
    },
    {
      label: 'The oblique advance · the center refused',
      title: 'The strong Roman wings wheel forward at an oblique angle; the weak center is held back',
      description:
        'Scipio wheels his strong wings forward at an oblique angle while holding the weak Iberian center back out of contact. The Carthaginian and Libyan veterans in the center cannot move to relieve their wings without exposing their own flanks, so the best troops on the field never engage.',
      units: [
        // Roman wings wheeling forward at an oblique
        { rect: { x: 35, y: 65, w: 50, h: 20, rx: 2 }, fill: '#1e3a8a', stroke: '#172554', patternFill: 'hatch', label: 'Roman cav.', labelPosition: 'above', labelSize: 8, labelColor: '#172554' },
        { rect: { x: 80, y: 110, w: 80, h: 32, rx: 2 }, fill: '#1e3a8a', stroke: '#172554', strokeWidth: 1.5, label: 'Roman heavies (advancing)', labelPosition: 'inside', labelSize: 9, labelColor: '#fff', labelWeight: 600 },
        // Iberian center HELD BACK (still at original position)
        { rect: { x: 170, y: 65, w: 60, h: 28, rx: 2 }, fill: '#fde68a', stroke: '#92400e', label: 'Iberian center (held back)', labelPosition: 'inside', labelSize: 8, labelColor: '#451a03', labelWeight: 600 },
        { rect: { x: 240, y: 110, w: 80, h: 32, rx: 2 }, fill: '#1e3a8a', stroke: '#172554', strokeWidth: 1.5, label: 'Roman heavies (advancing)', labelPosition: 'inside', labelSize: 9, labelColor: '#fff', labelWeight: 600 },
        { rect: { x: 315, y: 65, w: 50, h: 20, rx: 2 }, fill: '#92400e', stroke: '#451a03', patternFill: 'dots', label: 'Numidian cav.', labelPosition: 'above', labelSize: 8, labelColor: '#451a03' },

        // Punic line still in original position
        { rect: { x: 35, y: 215, w: 50, h: 20, rx: 2 }, fill: '#5b0f31', stroke: '#1a0410', patternFill: 'hatch' },
        { rect: { x: 95, y: 207, w: 70, h: 28, rx: 2 }, fill: '#fbbf24', stroke: '#92400e', label: 'Iberians', labelPosition: 'inside', labelSize: 9, labelColor: '#451a03', labelWeight: 600 },
        { rect: { x: 170, y: 207, w: 60, h: 28, rx: 2 }, fill: '#3d0a21', stroke: '#1a0410', label: 'Veterans (pinned)', labelPosition: 'inside', labelSize: 9, labelColor: '#fff', labelWeight: 600 },
        { rect: { x: 235, y: 207, w: 70, h: 28, rx: 2 }, fill: '#fbbf24', stroke: '#92400e', label: 'Iberians', labelPosition: 'inside', labelSize: 9, labelColor: '#451a03', labelWeight: 600 },
        { rect: { x: 315, y: 215, w: 50, h: 20, rx: 2 }, fill: '#92400e', stroke: '#451a03', patternFill: 'dots' },

        // Elephants
        { rect: { x: 100, y: 175, w: 30, h: 18, rx: 2 }, fill: '#9ca3af', stroke: '#374151' },
        { rect: { x: 270, y: 175, w: 30, h: 18, rx: 2 }, fill: '#9ca3af', stroke: '#374151' },
      ],
      arrows: [
        // Oblique wheel — left wing curves outward then in
        { from: [120, 90], to: [120, 145], color: '#172554', width: 2.5, via: [70, 118] },
        // Oblique wheel — right wing curves outward then in
        { from: [280, 90], to: [280, 145], color: '#172554', width: 2.5, via: [330, 118] },
      ],
      annotations: [
        { x: 200, y: 162, text: 'The Punic veterans cannot move to relieve the wings without exposing their own flanks', size: 8, color: '#1a0410', italic: true },
        { x: 200, y: 268, text: 'The strong Punic center is pinned by a Roman center it never engages', size: 9, color: '#5b0f31', italic: true, weight: 600 },
      ],
    },
    {
      label: 'The wings collapse',
      title: 'The weak Punic wings break under Roman heavy pressure; the whole line retires; rain saves the remnant',
      description:
        'The weak Punic wings break under the Roman heavy infantry, and the whole line has to retire toward camp. A sudden downpour saves the remnant from destruction, but the army is finished as a field force and Carthaginian power in Iberia with it.',
      units: [
        // Punic wings collapsing — faded
        { rect: { x: 95, y: 207, w: 70, h: 28, rx: 2 }, fill: '#fbbf24', stroke: '#92400e', strokeDasharray: '4,3', opacity: 0.4, label: 'Iberians broken', labelPosition: 'inside', labelSize: 9, labelColor: '#451a03', labelWeight: 600, labelItalic: true },
        { rect: { x: 235, y: 207, w: 70, h: 28, rx: 2 }, fill: '#fbbf24', stroke: '#92400e', strokeDasharray: '4,3', opacity: 0.4, label: 'Iberians broken', labelPosition: 'inside', labelSize: 9, labelColor: '#451a03', labelWeight: 600, labelItalic: true },

        // Punic veterans retiring south
        { rect: { x: 150, y: 245, w: 100, h: 26, rx: 2 }, fill: '#3d0a21', stroke: '#1a0410', label: 'Punic veterans retire', labelPosition: 'inside', labelSize: 9, labelColor: '#fff', labelWeight: 600 },

        // Roman heavies pressing south after the wings
        { rect: { x: 70, y: 150, w: 100, h: 32, rx: 2 }, fill: '#1e3a8a', stroke: '#172554', strokeWidth: 1.5, label: 'Roman heavies pressing', labelPosition: 'inside', labelSize: 9, labelColor: '#fff', labelWeight: 600 },
        { rect: { x: 230, y: 150, w: 100, h: 32, rx: 2 }, fill: '#1e3a8a', stroke: '#172554', strokeWidth: 1.5, label: 'Roman heavies pressing', labelPosition: 'inside', labelSize: 9, labelColor: '#fff', labelWeight: 600 },

        // Iberian center holding back, still
        { rect: { x: 170, y: 65, w: 60, h: 28, rx: 2 }, fill: '#fde68a', stroke: '#92400e', label: 'Iberian center', labelPosition: 'inside', labelSize: 9, labelColor: '#451a03', labelWeight: 600 },
        { rect: { x: 170, y: 100, w: 60, h: 14, rx: 2 }, fill: '#fde68a', stroke: '#92400e', opacity: 0.5 },
      ],
      arrows: [
        // Roman wings pressing further south
        { from: [120, 185], to: [120, 205], color: '#172554', width: 2.5 },
        { from: [280, 185], to: [280, 205], color: '#172554', width: 2.5 },
      ],
      annotations: [
        { x: 200, y: 50, text: 'Sudden rain ends the day; the Carthaginian remnant escapes toward camp', size: 8, color: '#0369a1', italic: true, weight: 600 },
        { x: 200, y: 295, text: 'Hasdrubal\'s army destroyed as a field force; the Iberian campaign effectively over', size: 8, color: '#5b0f31', italic: true },
        { x: 200, y: 312, text: 'Mirror of Cannae from the Roman side: strong wings, refused center, lateral envelopment', size: 8, color: '#1a0410', italic: true },
      ],
    },
  ],
  legend: [
    { label: 'Roman heavy infantry', fill: '#1e3a8a', stroke: '#172554' },
    { label: 'Roman cavalry', fill: '#1e3a8a', stroke: '#172554', pattern: 'hatch' },
    { label: 'Iberian allies (Roman side)', fill: '#fde68a', stroke: '#92400e' },
    { label: 'Iberian allies (Punic side)', fill: '#fbbf24', stroke: '#92400e' },
    { label: 'Punic veterans', fill: '#3d0a21', stroke: '#1a0410' },
    { label: 'Punic cavalry', fill: '#5b0f31', stroke: '#1a0410', pattern: 'hatch' },
    { label: 'Numidian cavalry', fill: '#92400e', stroke: '#451a03', pattern: 'dots' },
    { label: 'War elephants', fill: '#9ca3af', stroke: '#374151' },
  ],
  caption:
    'Schematic, not to scale. Ilipa is the most explicit case in the Second Punic War of a Roman commander adopting and inverting Hannibal’s own tactical method. Scipio’s strong-on-wings, weak-in-center deployment, his oblique advance with the wings, and his refusal of the center together engineered a situation in which the strongest enemy infantry — Hasdrubal Gisco’s Carthaginian and Libyan veterans — could not engage at all without exposing their own flanks. By the time the Punic line had to retire toward camp, the wings were already gone. The mirror of Cannae from the Roman side, fought against a Carthaginian field army in Iberia ten years and a few weeks after Hannibal’s original.',
};

export default config;
