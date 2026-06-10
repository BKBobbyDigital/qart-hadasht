import type { BattleDiagramConfig } from '../../lib/battleDiagram';

/**
 * Zama (October 202 BCE) — the war-ending defeat.
 *
 * Hannibal deployed three infantry lines with 80 elephants in front
 * and weak cavalry on both wings; Scipio deployed the standard
 * triplex acies with maniples specifically staggered to leave
 * lateral channels that funneled the elephant charge through the
 * line. The Roman cavalry (Laelius's Italians and Masinissa's
 * Numidians, the latter formerly Carthaginian allies under Syphax)
 * routed the weak Punic cavalry on both wings; the infantry struggle
 * with Hannibal's first two lines was inconclusive, but the
 * returning Roman cavalry struck the third line of Italian veterans
 * in the rear and collapsed the Punic position.
 */

// Palette: navy Rome, tyrian Carthage, brown Numidia.
const ROME = '#1e3a8a';
const ROME_DK = '#172554';
const PUNIC = '#5b0f31';
const PUNIC_DK = '#1a0410';
const VETS = '#3d0a21';
const NUMID = '#92400e';
const NUMID_DK = '#451a03';

const config: BattleDiagramConfig = {
  heading: 'Battlefield diagram: the elephant channels and the cavalry return',
  phases: [
    {
      label: 'Initial deployment',
      title: 'Initial deployment at Zama',
      description:
        'Hannibal deploys three infantry lines with 80 elephants in front and weak cavalry on both wings, his Italian veterans held well back as a fresh reserve. Scipio answers with the triplex acies, its maniples staggered to leave lateral channels, with Laelius’s Italian horse on his left and Masinissa’s Numidians on his right.',
      northArrow: true,
      units: [
        // Roman (north side, facing south)
        { rect: { x: 35, y: 55, w: 55, h: 20, rx: 2 }, fill: ROME, stroke: ROME_DK, patternFill: 'hatch', label: 'Laelius (Italian cav.)', labelPosition: 'above', labelSize: 8, labelColor: ROME_DK },
        // Hastati (manipular gaps shown by three separated blocks)
        { rect: { x: 110, y: 60, w: 50, h: 14, rx: 2 }, fill: ROME, stroke: ROME_DK },
        { rect: { x: 175, y: 60, w: 50, h: 14, rx: 2 }, fill: ROME, stroke: ROME_DK },
        { rect: { x: 240, y: 60, w: 50, h: 14, rx: 2 }, fill: ROME, stroke: ROME_DK },
        // Principes
        { rect: { x: 110, y: 80, w: 50, h: 14, rx: 2 }, fill: ROME, stroke: ROME_DK },
        { rect: { x: 175, y: 80, w: 50, h: 14, rx: 2 }, fill: ROME, stroke: ROME_DK },
        { rect: { x: 240, y: 80, w: 50, h: 14, rx: 2 }, fill: ROME, stroke: ROME_DK },
        // Triarii
        { rect: { x: 110, y: 100, w: 50, h: 14, rx: 2 }, fill: ROME, stroke: ROME_DK },
        { rect: { x: 175, y: 100, w: 50, h: 14, rx: 2 }, fill: ROME, stroke: ROME_DK },
        { rect: { x: 240, y: 100, w: 50, h: 14, rx: 2 }, fill: ROME, stroke: ROME_DK },
        // Masinissa on Roman right (allied Numidians; navy stroke marks the Roman allegiance)
        { rect: { x: 310, y: 55, w: 55, h: 20, rx: 2 }, fill: NUMID, stroke: ROME_DK, patternFill: 'dots', label: 'Masinissa (Numidian cav.)', labelPosition: 'above', labelSize: 8, labelColor: NUMID },

        // Elephants (between armies)
        { rect: { x: 110, y: 155, w: 180, h: 18, rx: 2 }, fill: '#9ca3af', stroke: '#374151', label: '80 war elephants', labelPosition: 'inside', labelSize: 9, labelColor: '#fff', labelWeight: 600 },

        // Carthaginian (south side, facing north)
        // Left wing cavalry (weak); label above for symmetry with Tychaeus
        { rect: { x: 35, y: 195, w: 55, h: 20, rx: 2 }, fill: PUNIC, stroke: PUNIC_DK, patternFill: 'hatch', label: 'Punic cav. (weak)', labelPosition: 'above', labelSize: 8, labelColor: PUNIC_DK },
        // First line — Ligurian / Gallic mercenaries
        { rect: { x: 100, y: 200, w: 200, h: 16, rx: 2 }, fill: '#fbbf24', stroke: NUMID, label: 'Ligurian / Gallic mercenaries', labelPosition: 'inside', labelSize: 9, labelColor: NUMID_DK, labelWeight: 600 },
        // Second line — Libyan / Carthaginian levies
        { rect: { x: 100, y: 222, w: 200, h: 16, rx: 2 }, fill: '#d97706', stroke: '#7c2d12', label: 'Libyan / Carthaginian levies', labelPosition: 'inside', labelSize: 9, labelColor: '#fff', labelWeight: 600 },
        // Right wing cavalry — Tychaeus's Numidians (allied to Carthage); label above to clear the second-line rect below
        { rect: { x: 310, y: 195, w: 55, h: 20, rx: 2 }, fill: NUMID, stroke: NUMID_DK, patternFill: 'dots', label: 'Tychaeus (Numidian cav.)', labelPosition: 'above', labelSize: 8, labelColor: NUMID_DK },
        // Third line — Hannibal's Italian veterans (set well back)
        { rect: { x: 100, y: 270, w: 200, h: 20, rx: 2 }, fill: VETS, stroke: PUNIC_DK, label: "Hannibal's veterans (held back)", labelPosition: 'inside', labelSize: 9, labelColor: '#fff', labelWeight: 600 },
      ],
      annotations: [
        { x: 200, y: 145, text: 'no-man’s land', size: 8, color: '#6b5638', italic: true },
        { x: 200, y: 252, text: '(set well behind the first two lines)', size: 7, color: PUNIC_DK, italic: true },
      ],
    },
    {
      label: 'Elephant charge and cavalry rout',
      title: 'The elephant charge funnels through Roman channels and the Punic cavalry is routed',
      description:
        'The elephant charge funnels through the lateral channels Scipio left in his line rather than breaking it, and some panicked animals crash back into the Punic left. Laelius and Masinissa rout the weak Carthaginian cavalry on both wings and pursue it off the field.',
      units: [
        // Roman cavalry advancing (Laelius drives left)
        { rect: { x: 50, y: 70, w: 55, h: 20, rx: 2 }, fill: ROME, stroke: ROME_DK, patternFill: 'hatch', label: 'Laelius drives left', labelPosition: 'above', labelSize: 7, labelColor: ROME_DK },
        // Roman infantry holding lines (with channels)
        { rect: { x: 110, y: 60, w: 50, h: 14, rx: 2 }, fill: ROME, stroke: ROME_DK },
        { rect: { x: 175, y: 60, w: 50, h: 14, rx: 2 }, fill: ROME, stroke: ROME_DK },
        { rect: { x: 240, y: 60, w: 50, h: 14, rx: 2 }, fill: ROME, stroke: ROME_DK },
        { rect: { x: 110, y: 80, w: 50, h: 14, rx: 2 }, fill: ROME, stroke: ROME_DK },
        { rect: { x: 175, y: 80, w: 50, h: 14, rx: 2 }, fill: ROME, stroke: ROME_DK },
        { rect: { x: 240, y: 80, w: 50, h: 14, rx: 2 }, fill: ROME, stroke: ROME_DK },
        { rect: { x: 110, y: 100, w: 50, h: 14, rx: 2 }, fill: ROME, stroke: ROME_DK },
        { rect: { x: 175, y: 100, w: 50, h: 14, rx: 2 }, fill: ROME, stroke: ROME_DK },
        { rect: { x: 240, y: 100, w: 50, h: 14, rx: 2 }, fill: ROME, stroke: ROME_DK },
        // Masinissa driving right
        { rect: { x: 295, y: 70, w: 55, h: 20, rx: 2 }, fill: NUMID, stroke: ROME_DK, patternFill: 'dots', label: 'Masinissa drives right', labelPosition: 'above', labelSize: 7, labelColor: NUMID },

        // Elephants funneled through channels (three small dispersed groups)
        { rect: { x: 162, y: 130, w: 16, h: 14, rx: 2 }, fill: '#9ca3af', stroke: '#374151' },
        { rect: { x: 227, y: 130, w: 16, h: 14, rx: 2 }, fill: '#9ca3af', stroke: '#374151' },
        // Some panic back into Punic left
        { rect: { x: 95, y: 130, w: 14, h: 12, rx: 2 }, fill: '#9ca3af', stroke: '#374151', strokeDasharray: '2,2', opacity: 0.6 },

        // Punic cavalry being routed — faint dashed
        { rect: { x: 35, y: 195, w: 55, h: 20, rx: 2 }, fill: PUNIC, stroke: PUNIC_DK, patternFill: 'hatch', strokeDasharray: '3,2', opacity: 0.35, label: 'Punic cav. routed', labelPosition: 'below', labelSize: 7, labelColor: PUNIC_DK, labelItalic: true },
        { rect: { x: 310, y: 195, w: 55, h: 20, rx: 2 }, fill: NUMID, stroke: NUMID_DK, patternFill: 'dots', strokeDasharray: '3,2', opacity: 0.35, label: 'Tychaeus routed', labelPosition: 'below', labelSize: 7, labelColor: NUMID_DK, labelItalic: true },

        // Punic infantry lines — same positions as Phase 1 for visual continuity
        { rect: { x: 100, y: 200, w: 200, h: 16, rx: 2 }, fill: '#fbbf24', stroke: NUMID, label: 'Mercenaries', labelPosition: 'inside', labelSize: 8, labelColor: NUMID_DK },
        { rect: { x: 100, y: 222, w: 200, h: 16, rx: 2 }, fill: '#d97706', stroke: '#7c2d12', label: 'Libyan / Carthaginian', labelPosition: 'inside', labelSize: 8, labelColor: '#fff' },
        { rect: { x: 100, y: 270, w: 200, h: 20, rx: 2 }, fill: VETS, stroke: PUNIC_DK, label: "Hannibal's veterans (waiting)", labelPosition: 'inside', labelSize: 8, labelColor: '#fff' },
      ],
      arrows: [
        // Elephants funneling through channels
        { from: [200, 145], to: [170, 132], color: '#374151', width: 2 },
        { from: [200, 145], to: [235, 132], color: '#374151', width: 2 },
        // Roman cavalry pursuit off-field (dashed projection); start outside cav rects
        { from: [45, 80], to: [15, 60], color: ROME_DK, dasharray: '3,2', width: 2 },
        { from: [355, 80], to: [385, 60], color: NUMID, dasharray: '3,2', width: 2 },
      ],
      annotations: [
        { x: 200, y: 168, text: 'Elephants funneled through manipular channels', size: 8, color: '#374151', italic: true },
        { x: 20, y: 52, text: '(off-field)', size: 7, color: ROME_DK, italic: true, anchor: 'start' },
        { x: 380, y: 52, text: '(off-field)', size: 7, color: NUMID, italic: true, anchor: 'end' },
      ],
    },
    {
      label: 'Cavalry return and the rear strike',
      title: 'The Roman cavalry returns and strikes Hannibal’s veterans in the rear',
      description:
        'The infantry struggle wears down Hannibal’s first two lines, but his fresh veterans hold the re-formed Roman line to an even fight. Then Laelius and Masinissa return from their pursuit, wheel into the veterans’ rear, and the Punic position collapses.',
      units: [
        // First two Punic lines broken — faint dashed at edges; dark labels for readability on faded fills
        { rect: { x: 100, y: 60, w: 200, h: 22, rx: 2 }, fill: '#fbbf24', stroke: NUMID, strokeDasharray: '4,3', opacity: 0.35, label: 'Mercenaries broken', labelPosition: 'inside', labelSize: 8, labelColor: NUMID_DK, labelItalic: true, labelWeight: 600 },
        { rect: { x: 100, y: 85, w: 200, h: 22, rx: 2 }, fill: '#d97706', stroke: '#7c2d12', strokeDasharray: '4,3', opacity: 0.35, label: 'Libyan / Carthaginian broken', labelPosition: 'inside', labelSize: 8, labelColor: '#7c2d12', labelItalic: true, labelWeight: 600 },
        // Roman line re-formed, extended, facing the veterans
        { rect: { x: 80, y: 130, w: 240, h: 28, rx: 2 }, fill: ROME, stroke: ROME_DK, strokeWidth: 1.5, label: 'Roman line re-formed and extended', labelPosition: 'inside', labelSize: 10, labelColor: '#fff', labelWeight: 600 },
        // Hannibal's veterans still in front, third line
        { rect: { x: 100, y: 195, w: 200, h: 26, rx: 2 }, fill: VETS, stroke: PUNIC_DK, label: "Hannibal's veterans (fresh)", labelPosition: 'inside', labelSize: 9, labelColor: '#fff', labelWeight: 600 },
        // Returning Roman cavalry behind the veterans; dark labels read against the pattern grounds
        { rect: { x: 70, y: 255, w: 110, h: 22, rx: 2 }, fill: ROME, stroke: ROME_DK, patternFill: 'hatch', label: 'Laelius returns', labelPosition: 'inside', labelSize: 8, labelColor: '#1a0410' },
        { rect: { x: 220, y: 255, w: 110, h: 22, rx: 2 }, fill: NUMID, stroke: ROME_DK, patternFill: 'dots', label: 'Masinissa returns', labelPosition: 'inside', labelSize: 8, labelColor: NUMID_DK },
      ],
      arrows: [
        // Cavalry wheeling up into the rear of the veterans
        { from: [125, 252], to: [125, 218], color: ROME_DK, via: [105, 235] },
        { from: [275, 252], to: [275, 218], color: NUMID, via: [295, 235] },
      ],
      annotations: [
        { x: 200, y: 178, text: 'Frontal infantry struggle; even fight until…', size: 8, color: PUNIC_DK, italic: true },
        { x: 200, y: 295, text: '…the Roman and Numidian cavalry return from pursuit', size: 8, color: PUNIC, italic: true },
        { x: 200, y: 312, text: 'Hannibal’s veterans encircled and broken; Punic line collapses', size: 8, color: PUNIC, italic: true },
      ],
    },
  ],
  legend: [
    { label: 'Roman legions', fill: ROME, stroke: ROME_DK },
    { label: 'Italian cavalry (Laelius)', fill: ROME, stroke: ROME_DK, pattern: 'hatch' },
    { label: 'Numidian cav. allied to Rome (Masinissa)', fill: NUMID, stroke: ROME_DK, pattern: 'dots' },
    { label: 'Mercenary infantry', fill: '#fbbf24', stroke: NUMID },
    { label: 'Libyan / Carthaginian levies', fill: '#d97706', stroke: '#7c2d12' },
    { label: 'Punic veterans', fill: VETS, stroke: '#000' },
    { label: 'Punic cavalry', fill: PUNIC, stroke: PUNIC_DK, pattern: 'hatch' },
    { label: 'Numidian cav. allied to Carthage (Tychaeus)', fill: NUMID, stroke: NUMID_DK, pattern: 'dots' },
    { label: 'War elephants', fill: '#9ca3af', stroke: '#374151' },
  ],
  caption:
    'Schematic, not to scale. The two halves of Scipio’s plan worked together: the manipular channels funneled the elephant charge through the line rather than absorbing it head-on, and the Roman and allied Numidian cavalry routed both Punic cavalry wings and pursued off the field. The infantry struggle with the first two Punic lines was inconclusive until Laelius and Masinissa returned from the pursuit and struck Hannibal’s veteran third line in the rear, mirroring on the African plain the maneuver Hannibal himself had used at Cannae fourteen years earlier.',
};

export default config;
