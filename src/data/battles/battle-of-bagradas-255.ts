import type { BattleDiagramConfig } from '../../lib/battleDiagram';

/**
 * Bagradas / Tunis (Spring 255 BCE) — Xanthippus crushes Regulus.
 *
 * After Carthaginian field disasters in 256 and the consul Marcus
 * Atilius Regulus's advance to Tunis with harsh peace terms,
 * Carthage hired the Spartan mercenary captain Xanthippus, who
 * reorganized the Carthaginian army around three combined-arms
 * principles: 100 war elephants in a single line forward, a deep
 * Carthaginian and Libyan phalanx behind them, and ~4,000 cavalry
 * on the wings outnumbering the ~500-man Roman mounted force
 * eight to one. Regulus deepened his infantry to absorb the
 * elephant charge, which only gave the elephants more depth to
 * crush. The phalanx behind the elephants advanced into the
 * disordered Roman line; the cavalry routed the Roman wings and
 * wheeled inward to complete the envelopment. ~12,000 Romans
 * killed, ~500 captured (including Regulus); ~2,000 of the right
 * wing escaped to Aspis.
 */
const config: BattleDiagramConfig = {
  heading: 'Battlefield diagram: elephants, phalanx, and the cavalry envelopment',
  phases: [
    {
      label: 'Initial deployment',
      title: 'Initial deployment at Bagradas; Xanthippus places 100 elephants in a single line forward',
      description:
        'Xanthippus draws up the Carthaginian army on open ground suited to elephants and horse: 100 war elephants in a single line forward, a deep Carthaginian and Libyan phalanx behind them, and roughly 4,000 cavalry split between the wings. Regulus answers by deepening his infantry to absorb the elephant charge, while his 500 cavalry face odds of about eight to one.',
      northArrow: true,
      units: [
        // Roman (north side, facing south)
        { rect: { x: 60, y: 55, w: 40, h: 18, rx: 2 }, fill: '#1e3a8a', stroke: '#172554', patternFill: 'hatch', label: 'Roman cav. (~250)', labelPosition: 'above', labelSize: 7, labelColor: '#172554' },
        // Deepened Roman infantry — drawn as four stacked lines
        { rect: { x: 110, y: 55, w: 180, h: 14, rx: 2 }, fill: '#1e3a8a', stroke: '#172554' },
        { rect: { x: 110, y: 73, w: 180, h: 14, rx: 2 }, fill: '#1e3a8a', stroke: '#172554' },
        { rect: { x: 110, y: 91, w: 180, h: 14, rx: 2 }, fill: '#1e3a8a', stroke: '#172554', label: 'Roman legions (deepened)', labelPosition: 'inside', labelSize: 10, labelColor: '#fff', labelWeight: 600 },
        { rect: { x: 110, y: 109, w: 180, h: 14, rx: 2 }, fill: '#1e3a8a', stroke: '#172554' },
        { rect: { x: 300, y: 55, w: 40, h: 18, rx: 2 }, fill: '#1e3a8a', stroke: '#172554', patternFill: 'hatch', label: 'Italian cav. (~250)', labelPosition: 'above', labelSize: 7, labelColor: '#172554' },

        // Elephants in a single line forward
        { rect: { x: 80, y: 145, w: 240, h: 18, rx: 2 }, fill: '#9ca3af', stroke: '#374151', label: '100 war elephants in a single line forward', labelPosition: 'inside', labelSize: 9, labelColor: '#fff', labelWeight: 600 },

        // Carthaginian / Libyan phalanx — deep, behind elephants
        { rect: { x: 110, y: 195, w: 180, h: 18, rx: 2 }, fill: '#3d0a21', stroke: '#1a0410' },
        { rect: { x: 110, y: 215, w: 180, h: 18, rx: 2 }, fill: '#3d0a21', stroke: '#1a0410', label: 'Carthaginian / Libyan phalanx (deep)', labelPosition: 'inside', labelSize: 9, labelColor: '#fff', labelWeight: 600 },
        { rect: { x: 110, y: 235, w: 180, h: 18, rx: 2 }, fill: '#3d0a21', stroke: '#1a0410' },

        // Cavalry wings — large
        { rect: { x: 30, y: 215, w: 60, h: 22, rx: 2 }, fill: '#92400e', stroke: '#451a03', patternFill: 'dots', label: 'Numidian + mercenary cav. (~2,000)', labelPosition: 'above', labelSize: 7, labelColor: '#451a03' },
        { rect: { x: 310, y: 215, w: 60, h: 22, rx: 2 }, fill: '#5b0f31', stroke: '#1a0410', patternFill: 'hatch', label: 'Carthaginian heavy cav. (~2,000)', labelPosition: 'above', labelSize: 7, labelColor: '#1a0410' },
      ],
      annotations: [
        { x: 200, y: 280, text: 'Xanthippus commanding · combined-arms doctrine', size: 9, color: '#5b0f31', italic: true, weight: 600 },
        { x: 200, y: 300, text: 'Roman cavalry outnumbered roughly eight to one on the wings', size: 8, color: '#172554', italic: true },
      ],
    },
    {
      label: 'The elephant charge and the cavalry rout',
      title: 'Elephants smash into the deepened Roman center; Punic cavalry routs the outnumbered Roman wings',
      description:
        'The elephants charge into the deepened Roman ranks, which gives them more men to crush rather than less penetration. On both wings the outnumbered Roman cavalry breaks within minutes, freeing the Punic horse to circle toward the Roman rear.',
      units: [
        // Roman cavalry being routed — dashed, faint
        { rect: { x: 60, y: 55, w: 40, h: 18, rx: 2 }, fill: '#1e3a8a', stroke: '#172554', patternFill: 'hatch', strokeDasharray: '3,2', opacity: 0.35, label: 'Roman cav. routed', labelPosition: 'above', labelSize: 7, labelColor: '#172554', labelItalic: true },
        { rect: { x: 300, y: 55, w: 40, h: 18, rx: 2 }, fill: '#1e3a8a', stroke: '#172554', patternFill: 'hatch', strokeDasharray: '3,2', opacity: 0.35, label: 'Italian cav. routed', labelPosition: 'above', labelSize: 7, labelColor: '#172554', labelItalic: true },

        // Roman infantry being crushed by elephants — front lines disordered
        { rect: { x: 110, y: 78, w: 180, h: 14, rx: 2 }, fill: '#1e3a8a', stroke: '#172554', strokeDasharray: '3,2', opacity: 0.55 },
        { rect: { x: 110, y: 95, w: 180, h: 14, rx: 2 }, fill: '#1e3a8a', stroke: '#172554', strokeDasharray: '3,2', opacity: 0.55, label: 'Roman line breaking', labelPosition: 'inside', labelSize: 10, labelColor: '#172554', labelWeight: 600 },
        { rect: { x: 110, y: 112, w: 180, h: 14, rx: 2 }, fill: '#1e3a8a', stroke: '#172554', strokeDasharray: '3,2', opacity: 0.55 },

        // Elephants advancing into the line
        { rect: { x: 80, y: 130, w: 240, h: 18, rx: 2 }, fill: '#9ca3af', stroke: '#374151', label: 'Elephants smashing into deepened ranks', labelPosition: 'inside', labelSize: 9, labelColor: '#fff', labelWeight: 600 },

        // Phalanx advancing behind elephants
        { rect: { x: 110, y: 195, w: 180, h: 18, rx: 2 }, fill: '#3d0a21', stroke: '#1a0410' },
        { rect: { x: 110, y: 215, w: 180, h: 18, rx: 2 }, fill: '#3d0a21', stroke: '#1a0410', label: 'Phalanx advancing', labelPosition: 'inside', labelSize: 9, labelColor: '#fff', labelWeight: 600 },
        { rect: { x: 110, y: 235, w: 180, h: 18, rx: 2 }, fill: '#3d0a21', stroke: '#1a0410' },

        // Cavalry sweeping around the wings (now near Roman position)
        { rect: { x: 30, y: 100, w: 50, h: 22, rx: 2 }, fill: '#92400e', stroke: '#451a03', patternFill: 'dots', label: 'Numidian + mercenary cav.', labelPosition: 'inside', labelSize: 7, labelColor: '#1a0410', labelWeight: 600 },
        { rect: { x: 320, y: 100, w: 50, h: 22, rx: 2 }, fill: '#5b0f31', stroke: '#1a0410', patternFill: 'hatch', label: 'Carthaginian cav.', labelPosition: 'inside', labelSize: 7, labelColor: '#1a0410', labelWeight: 600 },
      ],
      arrows: [
        // Elephants charging into Roman line
        { from: [200, 130], to: [200, 105], color: '#374151', width: 2 },
        // Cavalry sweeping inward around the broken wings
        { from: [80, 122], to: [115, 95], color: '#451a03', width: 2, via: [85, 98] },
        { from: [320, 122], to: [285, 95], color: '#1a0410', width: 2, via: [315, 98] },
        // Phalanx advancing
        { from: [200, 195], to: [200, 170], color: '#1a0410', width: 2 },
      ],
      annotations: [
        { x: 200, y: 280, text: 'Roman cavalry routed in minutes; cavalry now circling toward the Roman rear', size: 8, color: '#5b0f31', italic: true },
        { x: 200, y: 297, text: 'Deepened infantry gave the elephants more men to crush, not less penetration', size: 8, color: '#172554', italic: true },
      ],
    },
    {
      label: 'The envelopment',
      title: 'The phalanx engages the broken Roman line from the south as the cavalry closes the trap from the rear',
      description:
        'The phalanx advances into the disordered Roman line from the south while the returning cavalry falls on its rear. About 12,000 Romans are killed and Regulus is captured with some 500 men; only around 2,000 from the right wing cut their way out to Aspis.',
      units: [
        // Roman line collapsing
        { rect: { x: 110, y: 100, w: 180, h: 80, rx: 2 }, fill: '#1e3a8a', stroke: '#172554', strokeDasharray: '4,3', opacity: 0.4, label: 'Roman line collapses', labelPosition: 'inside', labelSize: 11, labelColor: '#172554', labelWeight: 600, labelItalic: true },

        // ~2,000 escapees from the right wing fleeing to Aspis
        { rect: { x: 310, y: 200, w: 70, h: 18, rx: 2 }, fill: '#1e3a8a', stroke: '#172554', opacity: 0.5, label: '~2,000 flee to Aspis', labelPosition: 'inside', labelSize: 8, labelColor: '#fff', labelItalic: true },

        // Cavalry now striking Roman rear from the north
        { rect: { x: 50, y: 50, w: 100, h: 22, rx: 2 }, fill: '#92400e', stroke: '#451a03', patternFill: 'dots', label: 'Numidian + mercenary cav.', labelPosition: 'inside', labelSize: 8, labelColor: '#1a0410', labelWeight: 600 },
        { rect: { x: 250, y: 50, w: 100, h: 22, rx: 2 }, fill: '#5b0f31', stroke: '#1a0410', patternFill: 'hatch', label: 'Carthaginian cav.', labelPosition: 'inside', labelSize: 8, labelColor: '#1a0410', labelWeight: 600 },

        // Phalanx pressing from south
        { rect: { x: 110, y: 215, w: 180, h: 22, rx: 2 }, fill: '#3d0a21', stroke: '#1a0410', label: 'Phalanx closing from the south', labelPosition: 'inside', labelSize: 9, labelColor: '#fff', labelWeight: 600 },
      ],
      arrows: [
        // Cavalry sweeping down into the Roman rear
        { from: [100, 75], to: [150, 100], color: '#451a03', width: 2.5, via: [130, 78] },
        { from: [300, 75], to: [250, 100], color: '#1a0410', width: 2.5, via: [270, 78] },
        // Phalanx pressing north
        { from: [200, 215], to: [200, 185], color: '#1a0410', width: 2.5 },
      ],
      annotations: [
        { x: 200, y: 275, text: '~12,000 Romans killed; Regulus captured with ~500 of his command', size: 8, color: '#5b0f31', italic: true },
        { x: 200, y: 293, text: 'Carthage refuses peace; Xanthippus departs Africa shortly after the victory', size: 8, color: '#5b0f31', italic: true },
      ],
    },
  ],
  legend: [
    { label: 'Roman legions', fill: '#1e3a8a', stroke: '#172554' },
    { label: 'Roman cavalry', fill: '#1e3a8a', stroke: '#172554', pattern: 'hatch' },
    { label: 'Carthaginian / Libyan phalanx', fill: '#3d0a21', stroke: '#1a0410' },
    { label: 'War elephants', fill: '#9ca3af', stroke: '#374151' },
    { label: 'Carthaginian cavalry', fill: '#5b0f31', stroke: '#1a0410', pattern: 'hatch' },
    { label: 'Numidian / mercenary cavalry', fill: '#92400e', stroke: '#451a03', pattern: 'dots' },
  ],
  caption:
    'Schematic, not to scale. Xanthippus’s reorganization combined three weapons that the Romans had no answer to in 255: elephants in a single line forward (Regulus had not encountered them in mass before), a deep Carthaginian phalanx behind them ready to exploit the disorder, and overwhelming cavalry superiority on both wings. Regulus’s deepening of his infantry to absorb the elephant charge gave the elephants more men to crush rather than fewer; the small Roman cavalry collapsed in minutes against four times its number; the trap closed from front and rear at once. The defeat ended the Roman African expedition and reset the strategic balance of the war for a decade.',
};

export default config;
