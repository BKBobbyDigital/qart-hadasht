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
const config: BattleDiagramConfig = {
  heading: 'Battlefield diagram: the elephant channels and the cavalry return',
  phases: [
    {
      label: 'Phase 1 · Initial deployment',
      title: 'Initial deployment at Zama',
      northArrow: true,
      units: [
        // Roman (north side, facing south)
        { rect: { x: 35, y: 55, w: 55, h: 20 }, fill: '#dc2626', stroke: '#7f1d1d', label: 'Laelius (Italian cav.)', labelPosition: 'above', labelSize: 8, labelColor: '#7f1d1d' },
        // Hastati (manipular gaps shown by three separated blocks)
        { rect: { x: 110, y: 60, w: 50, h: 14 }, fill: '#dc2626', stroke: '#7f1d1d' },
        { rect: { x: 175, y: 60, w: 50, h: 14 }, fill: '#dc2626', stroke: '#7f1d1d' },
        { rect: { x: 240, y: 60, w: 50, h: 14 }, fill: '#dc2626', stroke: '#7f1d1d' },
        // Principes
        { rect: { x: 110, y: 80, w: 50, h: 14 }, fill: '#dc2626', stroke: '#7f1d1d' },
        { rect: { x: 175, y: 80, w: 50, h: 14 }, fill: '#dc2626', stroke: '#7f1d1d' },
        { rect: { x: 240, y: 80, w: 50, h: 14 }, fill: '#dc2626', stroke: '#7f1d1d' },
        // Triarii
        { rect: { x: 110, y: 100, w: 50, h: 14 }, fill: '#dc2626', stroke: '#7f1d1d' },
        { rect: { x: 175, y: 100, w: 50, h: 14 }, fill: '#dc2626', stroke: '#7f1d1d' },
        { rect: { x: 240, y: 100, w: 50, h: 14 }, fill: '#dc2626', stroke: '#7f1d1d' },
        // Masinissa on Roman right (allied Numidians)
        { rect: { x: 310, y: 55, w: 55, h: 20 }, fill: '#fde68a', stroke: '#92400e', label: 'Masinissa (Numidian cav.)', labelPosition: 'above', labelSize: 8, labelColor: '#92400e' },

        // Elephants (between armies)
        { rect: { x: 110, y: 155, w: 180, h: 18 }, fill: '#9ca3af', stroke: '#374151', label: '80 war elephants', labelPosition: 'inside', labelSize: 9, labelColor: '#fff', labelWeight: 600 },

        // Carthaginian (south side, facing north)
        // Left wing cavalry (weak)
        { rect: { x: 35, y: 195, w: 55, h: 20 }, fill: '#5b0f31', stroke: '#1a0410', label: 'Punic cav. (weak)', labelPosition: 'below', labelSize: 8, labelColor: '#1a0410' },
        // First line — Ligurian / Gallic mercenaries
        { rect: { x: 100, y: 200, w: 200, h: 16 }, fill: '#fbbf24', stroke: '#92400e', label: 'Ligurian / Gallic mercenaries', labelPosition: 'inside', labelSize: 9, labelColor: '#451a03', labelWeight: 600 },
        // Second line — Libyan / Carthaginian levies
        { rect: { x: 100, y: 222, w: 200, h: 16 }, fill: '#d97706', stroke: '#7c2d12', label: 'Libyan / Carthaginian levies', labelPosition: 'inside', labelSize: 9, labelColor: '#fff', labelWeight: 600 },
        // Right wing cavalry — Tychaeus's Numidians (allied to Carthage)
        { rect: { x: 310, y: 195, w: 55, h: 20 }, fill: '#92400e', stroke: '#451a03', label: 'Tychaeus (Numidian cav.)', labelPosition: 'below', labelSize: 8, labelColor: '#451a03' },
        // Third line — Hannibal's Italian veterans (set well back)
        { rect: { x: 100, y: 270, w: 200, h: 20 }, fill: '#3d0a21', stroke: '#1a0410', label: "Hannibal's veterans (held back)", labelPosition: 'inside', labelSize: 9, labelColor: '#fff', labelWeight: 600 },
      ],
      annotations: [
        { x: 200, y: 145, text: 'no-man’s land', size: 8, color: '#6b5638', italic: true },
        { x: 200, y: 252, text: '(set well behind the first two lines)', size: 7, color: '#1a0410', italic: true },
      ],
    },
    {
      label: 'Phase 2 · Elephant charge and cavalry rout',
      title: 'The elephant charge funnels through Roman channels and the Punic cavalry is routed',
      units: [
        // Roman cavalry advancing (Laelius drives left)
        { rect: { x: 50, y: 70, w: 55, h: 20 }, fill: '#dc2626', stroke: '#7f1d1d', label: 'Laelius drives left', labelPosition: 'above', labelSize: 7, labelColor: '#7f1d1d' },
        // Roman infantry holding lines (with channels)
        { rect: { x: 110, y: 60, w: 50, h: 14 }, fill: '#dc2626', stroke: '#7f1d1d' },
        { rect: { x: 175, y: 60, w: 50, h: 14 }, fill: '#dc2626', stroke: '#7f1d1d' },
        { rect: { x: 240, y: 60, w: 50, h: 14 }, fill: '#dc2626', stroke: '#7f1d1d' },
        { rect: { x: 110, y: 80, w: 50, h: 14 }, fill: '#dc2626', stroke: '#7f1d1d' },
        { rect: { x: 175, y: 80, w: 50, h: 14 }, fill: '#dc2626', stroke: '#7f1d1d' },
        { rect: { x: 240, y: 80, w: 50, h: 14 }, fill: '#dc2626', stroke: '#7f1d1d' },
        { rect: { x: 110, y: 100, w: 50, h: 14 }, fill: '#dc2626', stroke: '#7f1d1d' },
        { rect: { x: 175, y: 100, w: 50, h: 14 }, fill: '#dc2626', stroke: '#7f1d1d' },
        { rect: { x: 240, y: 100, w: 50, h: 14 }, fill: '#dc2626', stroke: '#7f1d1d' },
        // Masinissa driving right
        { rect: { x: 295, y: 70, w: 55, h: 20 }, fill: '#fde68a', stroke: '#92400e', label: 'Masinissa drives right', labelPosition: 'above', labelSize: 7, labelColor: '#92400e' },

        // Elephants funneled through channels (three small dispersed groups)
        { rect: { x: 162, y: 130, w: 16, h: 14 }, fill: '#9ca3af', stroke: '#374151' },
        { rect: { x: 227, y: 130, w: 16, h: 14 }, fill: '#9ca3af', stroke: '#374151' },
        // Some panic back into Punic left
        { rect: { x: 95, y: 130, w: 14, h: 12 }, fill: '#9ca3af', stroke: '#374151', strokeDasharray: '2,2', opacity: 0.6 },

        // Punic cavalry being routed — faint dashed
        { rect: { x: 35, y: 195, w: 55, h: 20 }, fill: '#5b0f31', stroke: '#1a0410', strokeDasharray: '3,2', opacity: 0.35, label: 'Punic cav. routed', labelPosition: 'below', labelSize: 7, labelColor: '#1a0410', labelItalic: true },
        { rect: { x: 310, y: 195, w: 55, h: 20 }, fill: '#92400e', stroke: '#451a03', strokeDasharray: '3,2', opacity: 0.35, label: 'Tychaeus routed', labelPosition: 'below', labelSize: 7, labelColor: '#451a03', labelItalic: true },

        // Punic infantry lines — same positions as Phase 1 for visual continuity
        { rect: { x: 100, y: 200, w: 200, h: 16 }, fill: '#fbbf24', stroke: '#92400e', label: 'Mercenaries', labelPosition: 'inside', labelSize: 8, labelColor: '#451a03' },
        { rect: { x: 100, y: 222, w: 200, h: 16 }, fill: '#d97706', stroke: '#7c2d12', label: 'Libyan / Carthaginian', labelPosition: 'inside', labelSize: 8, labelColor: '#fff' },
        { rect: { x: 100, y: 270, w: 200, h: 20 }, fill: '#3d0a21', stroke: '#1a0410', label: "Hannibal's veterans (waiting)", labelPosition: 'inside', labelSize: 8, labelColor: '#fff' },
      ],
      arrows: [
        // Elephants funneling through channels
        { from: [200, 145], to: [170, 132], color: '#374151', width: 2 },
        { from: [200, 145], to: [235, 132], color: '#374151', width: 2 },
        // Roman cavalry pursuit off-field (dashed projection); start outside cav rects
        { from: [45, 80], to: [15, 60], color: '#7f1d1d', dasharray: '3,2', width: 2 },
        { from: [355, 80], to: [385, 60], color: '#92400e', dasharray: '3,2', width: 2 },
      ],
      annotations: [
        { x: 200, y: 168, text: 'Elephants funneled through manipular channels', size: 8, color: '#374151', italic: true },
        { x: 20, y: 52, text: '(off-field)', size: 7, color: '#7f1d1d', italic: true, anchor: 'start' },
        { x: 380, y: 52, text: '(off-field)', size: 7, color: '#92400e', italic: true, anchor: 'end' },
      ],
    },
    {
      label: 'Phase 3 · Cavalry return and the rear strike',
      title: 'The Roman cavalry returns and strikes Hannibal’s veterans in the rear',
      units: [
        // First two Punic lines broken — faint dashed at edges; dark labels for readability on faded fills
        { rect: { x: 100, y: 60, w: 200, h: 22 }, fill: '#fbbf24', stroke: '#92400e', strokeDasharray: '4,3', opacity: 0.35, label: 'Mercenaries broken', labelPosition: 'inside', labelSize: 8, labelColor: '#451a03', labelItalic: true, labelWeight: 600 },
        { rect: { x: 100, y: 85, w: 200, h: 22 }, fill: '#d97706', stroke: '#7c2d12', strokeDasharray: '4,3', opacity: 0.35, label: 'Libyan / Carthaginian broken', labelPosition: 'inside', labelSize: 8, labelColor: '#7c2d12', labelItalic: true, labelWeight: 600 },
        // Roman line re-formed, extended, facing the veterans
        { rect: { x: 80, y: 130, w: 240, h: 28 }, fill: '#dc2626', stroke: '#7f1d1d', strokeWidth: 1.5, label: 'Roman line re-formed and extended', labelPosition: 'inside', labelSize: 10, labelColor: '#fff', labelWeight: 600 },
        // Hannibal's veterans still in front, third line
        { rect: { x: 100, y: 195, w: 200, h: 26 }, fill: '#3d0a21', stroke: '#1a0410', label: "Hannibal's veterans (fresh)", labelPosition: 'inside', labelSize: 9, labelColor: '#fff', labelWeight: 600 },
        // Returning Roman cavalry behind the veterans
        { rect: { x: 70, y: 255, w: 110, h: 22 }, fill: '#dc2626', stroke: '#7f1d1d', label: 'Laelius returns', labelPosition: 'inside', labelSize: 8, labelColor: '#fff' },
        { rect: { x: 220, y: 255, w: 110, h: 22 }, fill: '#fde68a', stroke: '#92400e', label: 'Masinissa returns', labelPosition: 'inside', labelSize: 8, labelColor: '#451a03' },
      ],
      arrows: [
        // Cavalry strike upward into the rear of the veterans
        { from: [125, 252], to: [125, 218], color: '#7f1d1d' },
        { from: [275, 252], to: [275, 218], color: '#92400e' },
      ],
      annotations: [
        { x: 200, y: 178, text: 'Frontal infantry struggle; even fight until…', size: 8, color: '#1a0410', italic: true },
        { x: 200, y: 245, text: '…the Roman and Numidian cavalry return from pursuit', size: 8, color: '#5b0f31', italic: true },
        { x: 200, y: 305, text: 'Hannibal’s veterans encircled and broken; Punic line collapses', size: 8, color: '#5b0f31', italic: true },
      ],
    },
  ],
  legend: [
    { label: 'Roman legions', fill: '#dc2626', stroke: '#7f1d1d' },
    { label: 'Italian cavalry (Laelius)', fill: '#dc2626', stroke: '#7f1d1d' },
    { label: 'Numidian cav. allied to Rome (Masinissa)', fill: '#fde68a', stroke: '#92400e' },
    { label: 'Mercenary infantry', fill: '#fbbf24', stroke: '#92400e' },
    { label: 'Libyan / Carthaginian levies', fill: '#d97706', stroke: '#7c2d12' },
    { label: 'Punic veterans', fill: '#3d0a21', stroke: '#000' },
    { label: 'Punic cavalry', fill: '#5b0f31', stroke: '#000' },
    { label: 'Numidian cav. allied to Carthage (Tychaeus)', fill: '#92400e', stroke: '#451a03' },
    { label: 'War elephants', fill: '#9ca3af', stroke: '#374151' },
  ],
  caption:
    'Schematic, not to scale. The two halves of Scipio’s plan worked together: the manipular channels funneled the elephant charge through the line rather than absorbing it head-on, and the Roman and allied Numidian cavalry routed both Punic cavalry wings and pursued off the field. The infantry struggle with the first two Punic lines was inconclusive until Laelius and Masinissa returned from the pursuit and struck Hannibal’s veteran third line in the rear, mirroring on the African plain the maneuver Hannibal himself had used at Cannae fourteen years earlier.',
};

export default config;
