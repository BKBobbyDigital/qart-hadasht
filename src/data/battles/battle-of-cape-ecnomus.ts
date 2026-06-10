import type { BattleDiagramConfig } from '../../lib/battleDiagram';

/**
 * Cape Ecnomus (256 BCE) — the largest naval engagement of
 * classical antiquity by claimed combatant count.
 *
 * The Roman invasion fleet (~330 quinqueremes plus horse
 * transports under tow) sailed east along Sicily's south coast in
 * a triangular wedge: squadrons I and II forming the two leading
 * edges, squadron III towing the transports as the base, and
 * squadron IV (the triarii) as a rearguard line astern. The
 * Carthaginian fleet (~350) met it in an extended line with
 * orders to envelop: the center under Hamilcar would give way and
 * draw the Roman apex forward, while the inshore wing fell on the
 * transports and Hanno's seaward wing swung onto the triarii. The
 * envelopment achieved its geometry; the corvus then turned each
 * of the three resulting fights into boarding actions the Romans
 * won in detail. Polybius 1.25-28 is the principal source.
 */
const config: BattleDiagramConfig = {
  heading: 'Battle diagram: the wedge against the envelopment',
  phases: [
    {
      label: 'The dispositions',
      title:
        'The Roman wedge with transports inside meets the extended Carthaginian line off Cape Ecnomus',
      description:
        'The Roman invasion fleet of roughly 330 ships sails east along the Sicilian coast in a triangular wedge, the horse transports under tow inside the base and the triarii squadron as a rearguard line astern. The Carthaginian fleet of about 350 meets it in an extended line, one wing angled inshore toward the coast and the other out to sea under Hanno.',
      background: '#eaf4fb',
      northArrow: true,
      units: [
        // Sicilian south coast along the top
        {
          path: 'M 0 0 L 400 0 L 400 42 Q 300 34 200 44 Q 100 32 0 44 Z',
          fill: '#ecdcb0',
          stroke: '#a16207',
        },
        // Roman wedge outline (squadrons I-II), apex pointing east
        {
          path: 'M 210 150 L 92 102 L 92 198 Z',
          fill: '#93c5fd',
          stroke: '#172554',
          opacity: 0.5,
        },
        // Ship ticks along the wedge's two leading edges
        { rect: { x: 110, y: 112, w: 12, h: 5, rx: 1.5 }, fill: '#1e3a8a', stroke: '#172554' },
        { rect: { x: 140, y: 124, w: 12, h: 5, rx: 1.5 }, fill: '#1e3a8a', stroke: '#172554' },
        { rect: { x: 170, y: 136, w: 12, h: 5, rx: 1.5 }, fill: '#1e3a8a', stroke: '#172554' },
        { rect: { x: 110, y: 183, w: 12, h: 5, rx: 1.5 }, fill: '#1e3a8a', stroke: '#172554' },
        { rect: { x: 140, y: 171, w: 12, h: 5, rx: 1.5 }, fill: '#1e3a8a', stroke: '#172554' },
        { rect: { x: 170, y: 159, w: 12, h: 5, rx: 1.5 }, fill: '#1e3a8a', stroke: '#172554' },
        // Squadron III: the base of the wedge, towing the transports
        { rect: { x: 88, y: 104, w: 6, h: 92, rx: 1.5 }, fill: '#1e3a8a', stroke: '#172554' },
        // Transports inside the base
        { rect: { x: 62, y: 122, w: 16, h: 7, rx: 1.5 }, fill: '#f59e0b', stroke: '#92400e' },
        { rect: { x: 62, y: 146, w: 16, h: 7, rx: 1.5 }, fill: '#f59e0b', stroke: '#92400e' },
        { rect: { x: 62, y: 170, w: 16, h: 7, rx: 1.5 }, fill: '#f59e0b', stroke: '#92400e' },
        // Squadron IV (triarii) rearguard line astern
        {
          rect: { x: 34, y: 112, w: 6, h: 76, rx: 1.5 },
          fill: '#1e3a8a',
          stroke: '#172554',
          strokeDasharray: '3,2',
        },
        // Carthaginian center: thin extended line ahead of the wedge
        { rect: { x: 288, y: 108, w: 9, h: 84, rx: 1.5 }, fill: '#5b0f31', stroke: '#1a0410' },
        // Carthaginian inshore wing, angled up toward the coast
        {
          path: 'M 296 104 L 348 58 L 358 68 L 306 114 Z',
          fill: '#5b0f31',
          stroke: '#1a0410',
        },
        // Carthaginian seaward wing (Hanno), angled out to sea
        {
          path: 'M 296 196 L 348 242 L 358 232 L 306 186 Z',
          fill: '#5b0f31',
          stroke: '#1a0410',
        },
      ],
      annotations: [
        { x: 200, y: 22, text: 'Sicily: south coast off Cape Ecnomus', size: 9, color: '#7c5b1e', italic: true },
        { x: 135, y: 152, text: 'Squadrons I-II', size: 8, color: '#172554', weight: 600 },
        { x: 66, y: 189, text: 'transports', size: 7, color: '#92400e', italic: true },
        { x: 37, y: 102, text: 'Squadron IV (triarii)', size: 7, color: '#172554', anchor: 'start' },
        { x: 292, y: 99, text: 'center (Hamilcar)', size: 8, color: '#1a0410', weight: 600 },
        { x: 332, y: 50, text: 'inshore wing', size: 8, color: '#1a0410' },
        { x: 330, y: 258, text: 'seaward wing (Hanno)', size: 8, color: '#1a0410' },
        { x: 200, y: 300, text: 'Roman fleet ~330 ships; Carthaginian fleet ~350', size: 8, color: '#57534e', italic: true },
      ],
    },
    {
      label: 'The center gives way; three battles open',
      title:
        'The Carthaginian center feigns retreat and draws the Roman apex forward while both wings swing onto the transports and the rearguard',
      description:
        'Hamilcar’s center falls back as planned, drawing the leading Roman squadrons forward and away from the rest of the wedge. The inshore wing sweeps down onto the uncovered transports while Hanno’s seaward wing curls in from open water onto the triarii, and three separate fights open.',
      background: '#eaf4fb',
      units: [
        // Coast
        {
          path: 'M 0 0 L 400 0 L 400 42 Q 300 34 200 44 Q 100 32 0 44 Z',
          fill: '#ecdcb0',
          stroke: '#a16207',
        },
        // Squadrons I-II surging forward after the retreating center
        {
          path: 'M 300 150 L 196 110 L 196 190 Z',
          fill: '#93c5fd',
          stroke: '#172554',
          opacity: 0.5,
        },
        // Carthaginian center falling back eastward, still formed
        { rect: { x: 344, y: 112, w: 9, h: 76, rx: 1.5 }, fill: '#5b0f31', stroke: '#1a0410' },
        // Squadron III + transports, now uncovered
        { rect: { x: 88, y: 104, w: 6, h: 92, rx: 1.5 }, fill: '#1e3a8a', stroke: '#172554' },
        { rect: { x: 62, y: 122, w: 16, h: 7, rx: 1.5 }, fill: '#f59e0b', stroke: '#92400e' },
        { rect: { x: 62, y: 146, w: 16, h: 7, rx: 1.5 }, fill: '#f59e0b', stroke: '#92400e' },
        { rect: { x: 62, y: 170, w: 16, h: 7, rx: 1.5 }, fill: '#f59e0b', stroke: '#92400e' },
        // Triarii line
        {
          rect: { x: 34, y: 112, w: 6, h: 76, rx: 1.5 },
          fill: '#1e3a8a',
          stroke: '#172554',
          strokeDasharray: '3,2',
        },
        // Inshore wing descending on the transports along the coast
        {
          path: 'M 180 62 L 232 50 L 236 62 L 184 74 Z',
          fill: '#5b0f31',
          stroke: '#1a0410',
        },
        // Seaward wing curling onto the triarii from open water
        {
          path: 'M 200 262 L 252 250 L 256 262 L 204 274 Z',
          fill: '#5b0f31',
          stroke: '#1a0410',
        },
      ],
      arrows: [
        // Center's feigned retreat
        { from: [300, 150], to: [340, 150], color: '#5b0f31', dasharray: '4,3' },
        // Roman apex pursuing
        { from: [225, 150], to: [288, 150], color: '#172554' },
        // Inshore wing sweeping along the coast onto the transports
        { from: [190, 72], to: [104, 118], via: [134, 70], color: '#1a0410' },
        // Seaward wing curling in from open water onto the triarii
        { from: [212, 258], to: [62, 200], via: [116, 262], color: '#1a0410' },
      ],
      annotations: [
        { x: 392, y: 102, text: 'center falls back as planned', size: 8, color: '#1a0410', italic: true, anchor: 'end' },
        { x: 246, y: 132, text: 'apex drawn forward', size: 8, color: '#172554', italic: true },
        { x: 262, y: 46, text: 'inshore wing attacks', size: 8, color: '#1a0410', anchor: 'start' },
        { x: 268, y: 270, text: 'Hanno attacks the triarii', size: 8, color: '#1a0410', anchor: 'start' },
        { x: 120, y: 300, text: 'three separate fights develop', size: 9, color: '#57534e', italic: true, weight: 600 },
      ],
    },
    {
      label: 'Defeat in detail',
      title:
        'The Roman apex squadrons beat the center, return, and relieve each wing fight in turn; the corvus converts every action into boarding',
      description:
        'The Roman apex squadrons beat the center first, then turn back to relieve the transport fight and the rearguard fight in turn. The corvus converts each separated action into a boarding battle the Romans win, and the envelopment is defeated in detail.',
      background: '#eaf4fb',
      units: [
        // Coast
        {
          path: 'M 0 0 L 400 0 L 400 42 Q 300 34 200 44 Q 100 32 0 44 Z',
          fill: '#ecdcb0',
          stroke: '#a16207',
        },
        // Beaten Carthaginian center scattering offshore
        {
          rect: { x: 358, y: 116, w: 9, h: 64, rx: 1.5 },
          fill: '#5b0f31',
          stroke: '#1a0410',
          strokeDasharray: '3,2',
          opacity: 0.55,
        },
        // Returning Roman squadrons
        {
          path: 'M 250 150 L 168 118 L 168 182 Z',
          fill: '#93c5fd',
          stroke: '#172554',
          opacity: 0.5,
        },
        // Transport fight: wing now locked against squadron III, fading
        {
          path: 'M 112 92 L 160 80 L 164 92 L 116 104 Z',
          fill: '#5b0f31',
          stroke: '#1a0410',
          strokeDasharray: '3,2',
          opacity: 0.6,
        },
        { rect: { x: 88, y: 104, w: 6, h: 92, rx: 1.5 }, fill: '#1e3a8a', stroke: '#172554' },
        { rect: { x: 62, y: 146, w: 16, h: 7, rx: 1.5 }, fill: '#f59e0b', stroke: '#92400e' },
        // Triarii fight: Hanno's wing locked and fading
        {
          path: 'M 88 232 L 136 220 L 140 232 L 92 244 Z',
          fill: '#5b0f31',
          stroke: '#1a0410',
          strokeDasharray: '3,2',
          opacity: 0.6,
        },
        {
          rect: { x: 34, y: 180, w: 6, h: 64, rx: 1.5 },
          fill: '#1e3a8a',
          stroke: '#172554',
          strokeDasharray: '3,2',
        },
      ],
      arrows: [
        // Center driven off
        { from: [352, 148], to: [392, 148], color: '#5b0f31', dasharray: '4,3' },
        // Squadrons turning back to the two wing fights
        { from: [200, 132], to: [130, 100], via: [172, 106], color: '#172554' },
        { from: [200, 168], to: [110, 226], via: [168, 216], color: '#172554' },
      ],
      annotations: [
        { x: 330, y: 104, text: 'center driven off', size: 8, color: '#1a0410', italic: true },
        { x: 226, y: 110, text: 'squadrons I-II return', size: 8, color: '#172554', italic: true },
        { x: 130, y: 72, text: 'corvus boarding fight', size: 7, color: '#57534e', italic: true },
        { x: 110, y: 260, text: 'corvus boarding fight', size: 7, color: '#57534e', italic: true },
        { x: 200, y: 300, text: 'Carthaginian losses ~30 sunk, ~64 captured; Roman losses ~24 sunk', size: 8, color: '#57534e', italic: true, weight: 600 },
      ],
    },
  ],
  legend: [
    { label: 'Roman squadrons', fill: '#1e3a8a', stroke: '#172554' },
    { label: 'Transports under tow', fill: '#f59e0b', stroke: '#92400e' },
    { label: 'Carthaginian fleet', fill: '#5b0f31', stroke: '#1a0410' },
    { label: 'Sicilian coast', fill: '#ecdcb0', stroke: '#a16207' },
  ],
  caption:
    'Cape Ecnomus, summer 256 BCE. The Carthaginian envelopment achieved its geometry: the feigned retreat of the center drew the Roman apex squadrons forward, and the two wings fell on the transports and the rearguard exactly as planned. What the plan could not absorb was the corvus. Each of the three separated fights became a boarding action, and the Roman apex squadrons, having beaten the center first, returned to relieve the other two in sequence. Polybius (1.25-28) gives the engagement its scale: roughly 680 ships and a combined complement conventionally reckoned near 290,000 men, the largest naval battle of classical antiquity by claimed numbers. The victory opened the sea road to Africa for the Regulus expedition. Positions and movements are schematic reconstructions from Polybius; ship counts are his figures.',
};

export default config;
