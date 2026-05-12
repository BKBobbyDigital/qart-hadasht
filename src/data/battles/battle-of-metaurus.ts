import type { BattleDiagramConfig } from '../../lib/battleDiagram';

/**
 * Metaurus (22 June 207 BCE) — Nero's lateral march and the death of Hasdrubal.
 *
 * Hasdrubal Barca, having crossed the Alps with reinforcements
 * for Hannibal, was intercepted on the Metaurus by the combined
 * armies of the consuls Marcus Livius Salinator and Gaius Claudius
 * Nero. Nero had marched 7,000 picked men 250 miles north from
 * Canusium in seven days, leaving the bulk of his command facing
 * Hannibal to maintain the deception. Hasdrubal deployed with his
 * elite Hispanic veterans on his right, Ligurians in the center,
 * and his Gauls on the left where the broken ground prevented a
 * frontal engagement. Livius engaged Hasdrubal's right; the center
 * struggle was indecisive; Nero, finding he could not advance
 * against the Gauls across the ravine, peeled off elements of his
 * right wing and marched them across the rear of the Roman line
 * all the way to Livius's flank, then fell on the Hispanic
 * veterans' exposed flank and rear. The Carthaginian right
 * collapsed; Hasdrubal, seeing the battle lost, charged into the
 * Roman line and was killed. His head was carried south and
 * thrown into Hannibal's camp.
 */
const config: BattleDiagramConfig = {
  heading: "Battlefield diagram: Nero's lateral march and the rolling-up of the right",
  phases: [
    {
      label: 'Phase 1 · Initial deployment',
      title: 'Hasdrubal anchors his left on broken ground; the Romans deploy with Livius opposite the Hispanic veterans',
      northArrow: true,
      rivers: [
        {
          path: 'M 0 18 Q 100 26 200 18 T 400 18',
          label: 'Metaurus river',
          labelY: 40,
          width: 2.5,
        },
      ],
      units: [
        // Broken ground / hills protecting Hasdrubal's left (east side of canvas)
        { path: 'M 300 130 Q 340 150 360 175 Q 340 200 300 220 Q 320 175 300 130 Z', fill: '#a8a29e', stroke: '#57534e', opacity: 0.7 },

        // Roman (north side, facing south)
        { rect: { x: 35, y: 60, w: 40, h: 18 }, fill: '#dc2626', stroke: '#7f1d1d', label: 'Roman cav.', labelPosition: 'above', labelSize: 7, labelColor: '#7f1d1d' },
        // Livius — Roman left wing (faces Hispanic veterans)
        { rect: { x: 80, y: 60, w: 80, h: 28 }, fill: '#dc2626', stroke: '#7f1d1d', label: 'Livius (left)', labelPosition: 'inside', labelSize: 9, labelColor: '#fff', labelWeight: 600 },
        // Porcius — Roman center
        { rect: { x: 165, y: 60, w: 70, h: 28 }, fill: '#dc2626', stroke: '#7f1d1d', label: 'Porcius (center)', labelPosition: 'inside', labelSize: 9, labelColor: '#fff', labelWeight: 600 },
        // Nero — Roman right wing (faces Gauls on broken ground)
        { rect: { x: 240, y: 60, w: 80, h: 28 }, fill: '#dc2626', stroke: '#7f1d1d', label: 'Nero (right, stalled)', labelPosition: 'inside', labelSize: 9, labelColor: '#fff', labelWeight: 600 },
        { rect: { x: 325, y: 60, w: 40, h: 18 }, fill: '#dc2626', stroke: '#7f1d1d', label: 'Roman cav.', labelPosition: 'above', labelSize: 7, labelColor: '#7f1d1d' },

        // Elephants forward of the line
        { rect: { x: 100, y: 130, w: 30, h: 18 }, fill: '#9ca3af', stroke: '#374151' },
        { rect: { x: 165, y: 130, w: 30, h: 18 }, fill: '#9ca3af', stroke: '#374151', label: '15 elephants', labelPosition: 'below', labelSize: 7, labelColor: '#374151' },
        { rect: { x: 230, y: 130, w: 30, h: 18 }, fill: '#9ca3af', stroke: '#374151' },

        // Carthaginian (south, facing north)
        { rect: { x: 35, y: 235, w: 40, h: 18 }, fill: '#5b0f31', stroke: '#1a0410', label: 'Punic cav.', labelPosition: 'below', labelSize: 7, labelColor: '#1a0410' },
        // Hispanic veterans — Hasdrubal's RIGHT (canvas-left, opposite Livius)
        { rect: { x: 80, y: 207, w: 80, h: 28 }, fill: '#3d0a21', stroke: '#1a0410', label: 'Hispanic veterans', labelPosition: 'inside', labelSize: 9, labelColor: '#fff', labelWeight: 600 },
        // Ligurians — center
        { rect: { x: 165, y: 207, w: 70, h: 28 }, fill: '#fbbf24', stroke: '#92400e', label: 'Ligurians', labelPosition: 'inside', labelSize: 9, labelColor: '#451a03', labelWeight: 600 },
        // Gauls — Hasdrubal's LEFT (canvas-right, behind broken ground)
        { rect: { x: 240, y: 207, w: 80, h: 28 }, fill: '#92400e', stroke: '#451a03', label: 'Gauls (on broken ground)', labelPosition: 'inside', labelSize: 9, labelColor: '#fff', labelWeight: 600 },
        { rect: { x: 325, y: 235, w: 40, h: 18 }, fill: '#92400e', stroke: '#451a03', label: 'Numidian cav.', labelPosition: 'below', labelSize: 7, labelColor: '#451a03' },
      ],
      annotations: [
        { x: 335, y: 175, text: 'ravine / broken ground', size: 8, color: '#3d2f1a', italic: true, anchor: 'middle' },
        { x: 120, y: 105, text: 'Livius opposite Hasdrubal’s elite Hispanics', size: 8, color: '#7f1d1d', italic: true },
        { x: 280, y: 105, text: 'Nero cannot advance across the ravine', size: 8, color: '#7f1d1d', italic: true },
        { x: 200, y: 285, text: 'Hasdrubal Barca commanding · 7,000 of Nero’s men arrived overnight, undetected', size: 8, color: '#5b0f31', italic: true },
      ],
    },
    {
      label: 'Phase 2 · The frontal struggle',
      title: 'Livius engages the Hispanics; the center grinds; Nero stalled on the right',
      rivers: [
        { path: 'M 0 18 Q 100 26 200 18 T 400 18', width: 2.5 },
      ],
      units: [
        // Broken ground
        { path: 'M 300 130 Q 340 150 360 175 Q 340 200 300 220 Q 320 175 300 130 Z', fill: '#a8a29e', stroke: '#57534e', opacity: 0.7 },

        // Roman wings
        { rect: { x: 35, y: 60, w: 40, h: 18 }, fill: '#dc2626', stroke: '#7f1d1d' },
        { rect: { x: 80, y: 90, w: 80, h: 32 }, fill: '#dc2626', stroke: '#7f1d1d', strokeWidth: 1.5, label: 'Livius (engaged)', labelPosition: 'inside', labelSize: 9, labelColor: '#fff', labelWeight: 600 },
        { rect: { x: 165, y: 90, w: 70, h: 32 }, fill: '#dc2626', stroke: '#7f1d1d', strokeWidth: 1.5, label: 'Porcius (engaged)', labelPosition: 'inside', labelSize: 9, labelColor: '#fff', labelWeight: 600 },
        { rect: { x: 240, y: 60, w: 80, h: 28 }, fill: '#dc2626', stroke: '#7f1d1d', label: 'Nero (stalled at ravine)', labelPosition: 'inside', labelSize: 8, labelColor: '#fff', labelWeight: 600 },
        { rect: { x: 325, y: 60, w: 40, h: 18 }, fill: '#dc2626', stroke: '#7f1d1d' },

        // Elephants running amok (some have turned on the Punic line; one dashed)
        { rect: { x: 105, y: 155, w: 30, h: 18 }, fill: '#9ca3af', stroke: '#374151', strokeDasharray: '2,2', opacity: 0.55 },
        { rect: { x: 180, y: 165, w: 30, h: 18 }, fill: '#9ca3af', stroke: '#374151', strokeDasharray: '2,2', opacity: 0.55 },

        // Punic line — Hispanics and Ligurians engaged; Gauls still in place
        { rect: { x: 80, y: 195, w: 80, h: 32 }, fill: '#3d0a21', stroke: '#1a0410', strokeWidth: 1.5, label: 'Hispanic veterans (engaged)', labelPosition: 'inside', labelSize: 8, labelColor: '#fff', labelWeight: 600 },
        { rect: { x: 165, y: 195, w: 70, h: 32 }, fill: '#fbbf24', stroke: '#92400e', strokeWidth: 1.5, label: 'Ligurians (engaged)', labelPosition: 'inside', labelSize: 8, labelColor: '#451a03', labelWeight: 600 },
        { rect: { x: 240, y: 207, w: 80, h: 28 }, fill: '#92400e', stroke: '#451a03', label: 'Gauls (uncommitted)', labelPosition: 'inside', labelSize: 9, labelColor: '#fff', labelWeight: 600 },
      ],
      annotations: [
        { x: 335, y: 175, text: 'ravine', size: 8, color: '#3d2f1a', italic: true, anchor: 'middle' },
        { x: 200, y: 285, text: 'Hispanic veterans hold; the engagement grinds; Nero’s 7,000 still unused', size: 8, color: '#5b0f31', italic: true },
        { x: 200, y: 302, text: 'Elephants run amok between the lines; eventually killed by their own mahouts', size: 8, color: '#374151', italic: true },
      ],
    },
    {
      label: 'Phase 3 · The lateral march and the right collapses',
      title: "Nero detaches part of his right wing and marches it across the rear of the Roman line to fall on the Hispanic flank",
      rivers: [
        { path: 'M 0 18 Q 100 26 200 18 T 400 18', width: 2.5 },
      ],
      units: [
        // Broken ground
        { path: 'M 300 130 Q 340 150 360 175 Q 340 200 300 220 Q 320 175 300 130 Z', fill: '#a8a29e', stroke: '#57534e', opacity: 0.7 },

        // Roman line still engaged
        { rect: { x: 35, y: 60, w: 40, h: 18 }, fill: '#dc2626', stroke: '#7f1d1d' },
        { rect: { x: 80, y: 90, w: 80, h: 32 }, fill: '#dc2626', stroke: '#7f1d1d', strokeWidth: 1.5, label: 'Livius (holding)', labelPosition: 'inside', labelSize: 9, labelColor: '#fff', labelWeight: 600 },
        { rect: { x: 165, y: 90, w: 70, h: 32 }, fill: '#dc2626', stroke: '#7f1d1d', strokeWidth: 1.5, label: 'Porcius', labelPosition: 'inside', labelSize: 9, labelColor: '#fff', labelWeight: 600 },
        // Nero now smaller (he detached part of his force)
        { rect: { x: 270, y: 60, w: 50, h: 24 }, fill: '#dc2626', stroke: '#7f1d1d', opacity: 0.65, label: 'Nero (remnant)', labelPosition: 'inside', labelSize: 8, labelColor: '#fff', labelItalic: true },

        // The detached column — drawn behind the Roman line as a long thin rect
        { rect: { x: 40, y: 50, w: 220, h: 8 }, fill: '#7f1d1d', stroke: '#7f1d1d', opacity: 0.8 },

        // Nero falling on Hispanic flank — striking south
        { rect: { x: 30, y: 125, w: 50, h: 24 }, fill: '#dc2626', stroke: '#7f1d1d', strokeWidth: 1.5, label: 'Nero strikes flank', labelPosition: 'inside', labelSize: 8, labelColor: '#fff', labelWeight: 600 },

        // Hispanic veterans collapsing
        { rect: { x: 80, y: 195, w: 80, h: 32 }, fill: '#3d0a21', stroke: '#1a0410', strokeDasharray: '4,3', opacity: 0.45, label: 'Hispanics rolling up', labelPosition: 'inside', labelSize: 8, labelColor: '#fff', labelWeight: 600, labelItalic: true },
        { rect: { x: 165, y: 195, w: 70, h: 32 }, fill: '#fbbf24', stroke: '#92400e', strokeWidth: 1.5, label: 'Ligurians', labelPosition: 'inside', labelSize: 8, labelColor: '#451a03', labelWeight: 600 },
        { rect: { x: 240, y: 207, w: 80, h: 28 }, fill: '#92400e', stroke: '#451a03', label: 'Gauls', labelPosition: 'inside', labelSize: 9, labelColor: '#fff', labelWeight: 600 },
      ],
      arrows: [
        // The long lateral march arrow — east to west, behind the Roman line
        { from: [275, 54], to: [50, 54], color: '#7f1d1d', width: 3 },
        // The flank strike south
        { from: [55, 150], to: [85, 195], color: '#7f1d1d', width: 2.5 },
      ],
      annotations: [
        { x: 200, y: 285, text: "Hasdrubal sees the battle lost; charges into the Roman line and is killed", size: 8, color: '#5b0f31', italic: true, weight: 600 },
        { x: 200, y: 302, text: 'His head is carried south and thrown into Hannibal’s camp at Canusium', size: 8, color: '#5b0f31', italic: true },
      ],
    },
  ],
  legend: [
    { label: 'Roman legions', fill: '#dc2626', stroke: '#7f1d1d' },
    { label: 'Hispanic veterans', fill: '#3d0a21', stroke: '#000' },
    { label: 'Ligurians', fill: '#fbbf24', stroke: '#92400e' },
    { label: 'Gauls', fill: '#92400e', stroke: '#451a03' },
    { label: 'Punic cavalry', fill: '#5b0f31', stroke: '#000' },
    { label: 'War elephants', fill: '#9ca3af', stroke: '#374151' },
    { label: 'Broken ground', fill: '#a8a29e', stroke: '#57534e' },
  ],
  caption:
    'Schematic, not to scale. The Metaurus turns on two operational facts not visible at the moment of contact: that Nero’s 7,000 picked men had marched 250 miles in seven days from Canusium and slipped into Livius’s camp the night before, and that Nero, finding his right wing stalled at the ravine, was able to detach part of his force, march it across the rear of the Roman line, and bring it down on the exposed flank of the Hispanic veterans without Hasdrubal observing the maneuver. The death of Hasdrubal Barca and the destruction of his army ended Carthage’s last realistic chance of reinforcing the Italian campaign, fourteen years after his brother had crossed the Alps.',
};

export default config;
