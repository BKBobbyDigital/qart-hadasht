import type { BattleDiagramConfig, BattleUnit, BattleRiver } from '../../lib/battleDiagram';

/**
 * Cannae (2 August 216 BCE) — the double envelopment, told in six
 * steps in the style of a print battle-atlas plate.
 *
 * Romans at the top (navy; allied infantry outlined, cavalry
 * hatched), Carthaginians at the bottom (tyrian; heavy cavalry
 * hatched, Numidians dotted). The Aufidus runs across the top of
 * each frame. Polybius 3.107-117 and Livy 22.44-49 are the
 * principal sources.
 */

// Shared scenery: the Aufidus across the top, a rise with scrub at
// the left edge.
const AUFIDUS: BattleRiver = {
  path: 'M 0 30 Q 50 22 100 30 T 200 30 T 300 30 T 400 30',
  color: '#7dd3fc',
  width: 5,
  opacity: 0.55,
  label: 'Aufidus',
  labelX: 366,
  labelY: 19,
};

const TREES: BattleUnit = {
  path:
    'M 18 56 a 7 7 0 1 0 0.1 0 Z M 34 49 a 6 6 0 1 0 0.1 0 Z M 30 64 a 5 5 0 1 0 0.1 0 Z M 46 58 a 5.5 5.5 0 1 0 0.1 0 Z',
  fill: '#7d9a6a',
  stroke: '#55703f',
  strokeWidth: 0.75,
  opacity: 0.85,
};

// Palette: navy Rome, tyrian Carthage, brown Numidia.
const ROME = '#1e3a8a';
const ROME_DK = '#172554';
const PUNIC = '#5b0f31';
const PUNIC_DK = '#1a0410';
const NUMID = '#92400e';
const NUMID_DK = '#78350f';
const PAPER = '#fdfbf4';

const config: BattleDiagramConfig = {
  heading: 'Battlefield diagram: the double envelopment',
  phases: [
    {
      label: 'Initial deployment',
      title:
        'The Romans deploy in an unusually deep line; Hannibal answers with a forward crescent and cavalry massed on both wings',
      description:
        'The Romans deploy in an unusually deep formation, trading frontage for weight. Hannibal answers with a crescent bowed toward them: Iberians and Gauls in the center, veteran African infantry held back at the ends, cavalry massed on both wings.',
      rivers: [AUFIDUS],
      units: [
        TREES,
        // Roman cavalry, left wing
        { rect: { x: 52, y: 92, w: 38, h: 16, rx: 2 }, fill: ROME, stroke: ROME_DK, patternFill: 'hatch' },
        // Legions
        { rect: { x: 104, y: 92, w: 44, h: 16, rx: 2 }, fill: ROME, stroke: ROME_DK },
        { rect: { x: 154, y: 92, w: 44, h: 16, rx: 2 }, fill: ROME, stroke: ROME_DK },
        { rect: { x: 204, y: 92, w: 44, h: 16, rx: 2 }, fill: ROME, stroke: ROME_DK },
        { rect: { x: 254, y: 92, w: 44, h: 16, rx: 2 }, fill: ROME, stroke: ROME_DK },
        // Allied cavalry, right wing
        { rect: { x: 312, y: 92, w: 38, h: 16, rx: 2 }, fill: ROME, stroke: ROME_DK, patternFill: 'hatch' },
        // Allied infantry, second line (outlined)
        { rect: { x: 104, y: 114, w: 44, h: 14, rx: 2 }, fill: PAPER, stroke: ROME_DK },
        { rect: { x: 154, y: 114, w: 44, h: 14, rx: 2 }, fill: PAPER, stroke: ROME_DK },
        { rect: { x: 204, y: 114, w: 44, h: 14, rx: 2 }, fill: PAPER, stroke: ROME_DK },
        { rect: { x: 254, y: 114, w: 44, h: 14, rx: 2 }, fill: PAPER, stroke: ROME_DK },
        // Carthaginian crescent, convex toward the Romans
        {
          path: 'M 88 216 Q 200 166 312 216 L 312 230 Q 200 182 88 230 Z',
          fill: PUNIC,
          stroke: PUNIC_DK,
        },
        // Heavy cavalry (Hasdrubal), Carthaginian left
        { rect: { x: 40, y: 224, w: 40, h: 16, rx: 2 }, fill: PUNIC, stroke: PUNIC_DK, patternFill: 'hatch' },
        // Numidian cavalry, Carthaginian right
        { rect: { x: 320, y: 224, w: 40, h: 16, rx: 2 }, fill: NUMID, stroke: NUMID_DK, patternFill: 'dots' },
      ],
      annotations: [
        { x: 200, y: 290, text: '~80,000 Romans against ~50,000 under Hannibal', size: 8, color: '#57534e', italic: true },
      ],
    },
    {
      label: 'Roman advance',
      title:
        'The legions press into the crescent and begin driving the Carthaginian center back while the cavalry fights open on both wings',
      description:
        'The legions press forward into the bulge, confident in their depth, and begin driving the Carthaginian center back. On the wings, Hasdrubal’s heavy cavalry and the Numidians close with the Roman horse.',
      rivers: [AUFIDUS],
      units: [
        TREES,
        // Roman cavalry engaged on both wings
        { rect: { x: 54, y: 108, w: 38, h: 16, rx: 2 }, fill: ROME, stroke: ROME_DK, patternFill: 'hatch' },
        { rect: { x: 310, y: 108, w: 38, h: 16, rx: 2 }, fill: ROME, stroke: ROME_DK, patternFill: 'hatch' },
        // Legions advancing
        { rect: { x: 104, y: 108, w: 44, h: 16, rx: 2 }, fill: ROME, stroke: ROME_DK },
        { rect: { x: 154, y: 108, w: 44, h: 16, rx: 2 }, fill: ROME, stroke: ROME_DK },
        { rect: { x: 204, y: 108, w: 44, h: 16, rx: 2 }, fill: ROME, stroke: ROME_DK },
        { rect: { x: 254, y: 108, w: 44, h: 16, rx: 2 }, fill: ROME, stroke: ROME_DK },
        { rect: { x: 104, y: 130, w: 44, h: 14, rx: 2 }, fill: PAPER, stroke: ROME_DK },
        { rect: { x: 154, y: 130, w: 44, h: 14, rx: 2 }, fill: PAPER, stroke: ROME_DK },
        { rect: { x: 204, y: 130, w: 44, h: 14, rx: 2 }, fill: PAPER, stroke: ROME_DK },
        { rect: { x: 254, y: 130, w: 44, h: 14, rx: 2 }, fill: PAPER, stroke: ROME_DK },
        // Crescent flattening under pressure
        {
          path: 'M 88 212 Q 200 188 312 212 L 312 226 Q 200 202 88 226 Z',
          fill: PUNIC,
          stroke: PUNIC_DK,
        },
        // Carthaginian cavalry charging the wings
        { rect: { x: 42, y: 220, w: 40, h: 16, rx: 2 }, fill: PUNIC, stroke: PUNIC_DK, patternFill: 'hatch' },
        { rect: { x: 318, y: 220, w: 40, h: 16, rx: 2 }, fill: NUMID, stroke: NUMID_DK, patternFill: 'dots' },
      ],
      arrows: [
        // Legions pressing the center
        { from: [126, 150], to: [126, 188], color: ROME },
        { from: [176, 150], to: [176, 184], color: ROME },
        { from: [226, 150], to: [226, 184], color: ROME },
        { from: [276, 150], to: [276, 188], color: ROME },
        // Cavalry closing on the wings
        { from: [60, 218], to: [68, 132], color: PUNIC, via: [40, 174] },
        { from: [340, 218], to: [332, 132], color: NUMID, via: [362, 174] },
      ],
    },
    {
      label: 'The center yields',
      title:
        'The Carthaginian center gives ground in a controlled fighting retreat, inverting the crescent and drawing the Roman mass deeper in',
      description:
        'The center gives ground in a controlled fighting retreat. The crescent inverts from convex to concave, and the Roman mass, sensing a breakthrough, pushes deeper in and compresses itself into the pocket.',
      rivers: [AUFIDUS],
      units: [
        TREES,
        // Cavalry fights continuing on the wings
        { rect: { x: 54, y: 130, w: 36, h: 15, rx: 2 }, fill: ROME, stroke: ROME_DK, patternFill: 'hatch', opacity: 0.8 },
        { rect: { x: 44, y: 152, w: 38, h: 15, rx: 2 }, fill: PUNIC, stroke: PUNIC_DK, patternFill: 'hatch' },
        { rect: { x: 312, y: 130, w: 36, h: 15, rx: 2 }, fill: ROME, stroke: ROME_DK, patternFill: 'hatch', opacity: 0.8 },
        { rect: { x: 320, y: 152, w: 38, h: 15, rx: 2 }, fill: NUMID, stroke: NUMID_DK, patternFill: 'dots' },
        // Roman mass narrowing and deepening as it follows the center
        { rect: { x: 134, y: 110, w: 42, h: 15, rx: 2 }, fill: ROME, stroke: ROME_DK },
        { rect: { x: 182, y: 110, w: 42, h: 15, rx: 2 }, fill: ROME, stroke: ROME_DK },
        { rect: { x: 230, y: 110, w: 42, h: 15, rx: 2 }, fill: ROME, stroke: ROME_DK },
        { rect: { x: 134, y: 131, w: 42, h: 15, rx: 2 }, fill: ROME, stroke: ROME_DK },
        { rect: { x: 182, y: 131, w: 42, h: 15, rx: 2 }, fill: ROME, stroke: ROME_DK },
        { rect: { x: 230, y: 131, w: 42, h: 15, rx: 2 }, fill: ROME, stroke: ROME_DK },
        { rect: { x: 134, y: 152, w: 42, h: 14, rx: 2 }, fill: PAPER, stroke: ROME_DK },
        { rect: { x: 182, y: 152, w: 42, h: 14, rx: 2 }, fill: PAPER, stroke: ROME_DK },
        { rect: { x: 230, y: 152, w: 42, h: 14, rx: 2 }, fill: PAPER, stroke: ROME_DK },
        // Crescent inverted: ends anchored, center sagging away
        {
          path: 'M 88 196 Q 200 250 312 196 L 312 212 Q 200 266 88 212 Z',
          fill: PUNIC,
          stroke: PUNIC_DK,
        },
      ],
      arrows: [
        // Romans pressing into the pocket
        { from: [155, 172], to: [165, 204], color: ROME },
        { from: [203, 172], to: [203, 212], color: ROME },
        { from: [251, 172], to: [241, 204], color: ROME },
        // The center's controlled retreat
        { from: [200, 234], to: [200, 258], color: PUNIC, dasharray: '4,3' },
      ],
      annotations: [
        { x: 200, y: 296, text: 'the African infantry at the crescent’s ends has not yet engaged', size: 8, color: '#57534e', italic: true },
      ],
    },
    {
      label: 'The wings encircle',
      title:
        'The Carthaginian cavalry breaks both Roman cavalry wings and sweeps around the flanks toward the Roman rear',
      description:
        'Hasdrubal’s heavy cavalry breaks the Roman horse by the river, crosses behind the field to rout the allied cavalry alongside the Numidians, and sweeps around the flanks toward the Roman rear.',
      rivers: [AUFIDUS],
      units: [
        TREES,
        // Defeated Roman cavalry scattering
        { rect: { x: 48, y: 124, w: 36, h: 15, rx: 2 }, fill: ROME, stroke: ROME_DK, patternFill: 'hatch', strokeDasharray: '3,2', opacity: 0.45 },
        { rect: { x: 318, y: 124, w: 36, h: 15, rx: 2 }, fill: ROME, stroke: ROME_DK, patternFill: 'hatch', strokeDasharray: '3,2', opacity: 0.45 },
        // The Roman mass, now deep in the pocket
        { rect: { x: 144, y: 116, w: 36, h: 14, rx: 2 }, fill: ROME, stroke: ROME_DK },
        { rect: { x: 186, y: 116, w: 36, h: 14, rx: 2 }, fill: ROME, stroke: ROME_DK },
        { rect: { x: 228, y: 116, w: 36, h: 14, rx: 2 }, fill: ROME, stroke: ROME_DK },
        { rect: { x: 144, y: 136, w: 36, h: 14, rx: 2 }, fill: ROME, stroke: ROME_DK },
        { rect: { x: 186, y: 136, w: 36, h: 14, rx: 2 }, fill: ROME, stroke: ROME_DK },
        { rect: { x: 228, y: 136, w: 36, h: 14, rx: 2 }, fill: ROME, stroke: ROME_DK },
        { rect: { x: 144, y: 156, w: 36, h: 13, rx: 2 }, fill: PAPER, stroke: ROME_DK },
        { rect: { x: 186, y: 156, w: 36, h: 13, rx: 2 }, fill: PAPER, stroke: ROME_DK },
        { rect: { x: 228, y: 156, w: 36, h: 13, rx: 2 }, fill: PAPER, stroke: ROME_DK },
        // Crescent fully inverted, ends pressing the Roman flanks
        {
          path: 'M 92 192 Q 200 246 308 192 L 308 208 Q 200 262 92 208 Z',
          fill: PUNIC,
          stroke: PUNIC_DK,
        },
        // Cavalry blocks mid-sweep
        { rect: { x: 56, y: 212, w: 40, h: 15, rx: 2 }, fill: PUNIC, stroke: PUNIC_DK, patternFill: 'hatch' },
        { rect: { x: 306, y: 212, w: 40, h: 15, rx: 2 }, fill: NUMID, stroke: NUMID_DK, patternFill: 'dots' },
      ],
      arrows: [
        // The two great sweeps around the flanks
        { from: [66, 210], to: [150, 72], color: PUNIC, via: [16, 104], width: 3 },
        { from: [336, 210], to: [254, 72], color: NUMID, via: [386, 104], width: 3 },
        // Roman cavalry fleeing
        { from: [70, 120], to: [96, 92], color: ROME, dasharray: '3,3', width: 1.5 },
        { from: [332, 120], to: [308, 92], color: ROME, dasharray: '3,3', width: 1.5 },
      ],
    },
    {
      label: 'The trap closes',
      title:
        'The African infantry wheels inward against both Roman flanks while the returning cavalry seals the rear',
      description:
        'The African infantry at the crescent’s ends wheels inward against both Roman flanks, and the cavalry returns from its pursuit to seal the rear. The largest army Rome had ever fielded is surrounded.',
      rivers: [AUFIDUS],
      units: [
        TREES,
        // Cavalry sealing the rear (top, against the river)
        { rect: { x: 148, y: 76, w: 44, h: 14, rx: 2 }, fill: PUNIC, stroke: PUNIC_DK, patternFill: 'hatch' },
        { rect: { x: 210, y: 76, w: 44, h: 14, rx: 2 }, fill: NUMID, stroke: NUMID_DK, patternFill: 'dots' },
        // African infantry wheeled in on the flanks
        { rect: { x: 112, y: 102, w: 16, h: 44, rx: 2 }, fill: PUNIC, stroke: PUNIC_DK },
        { rect: { x: 112, y: 152, w: 16, h: 44, rx: 2 }, fill: PUNIC, stroke: PUNIC_DK },
        { rect: { x: 274, y: 102, w: 16, h: 44, rx: 2 }, fill: PUNIC, stroke: PUNIC_DK },
        { rect: { x: 274, y: 152, w: 16, h: 44, rx: 2 }, fill: PUNIC, stroke: PUNIC_DK },
        // Iberian and Gallic line holding the front (bottom)
        { rect: { x: 134, y: 208, w: 42, h: 15, rx: 2 }, fill: PUNIC, stroke: PUNIC_DK },
        { rect: { x: 182, y: 208, w: 42, h: 15, rx: 2 }, fill: PUNIC, stroke: PUNIC_DK },
        { rect: { x: 230, y: 208, w: 42, h: 15, rx: 2 }, fill: PUNIC, stroke: PUNIC_DK },
        // The Roman mass inside
        { rect: { x: 146, y: 110, w: 34, h: 14, rx: 2 }, fill: ROME, stroke: ROME_DK },
        { rect: { x: 186, y: 110, w: 34, h: 14, rx: 2 }, fill: ROME, stroke: ROME_DK },
        { rect: { x: 226, y: 110, w: 34, h: 14, rx: 2 }, fill: ROME, stroke: ROME_DK },
        { rect: { x: 146, y: 130, w: 34, h: 14, rx: 2 }, fill: ROME, stroke: ROME_DK },
        { rect: { x: 186, y: 130, w: 34, h: 14, rx: 2 }, fill: ROME, stroke: ROME_DK },
        { rect: { x: 226, y: 130, w: 34, h: 14, rx: 2 }, fill: ROME, stroke: ROME_DK },
        { rect: { x: 146, y: 150, w: 34, h: 14, rx: 2 }, fill: ROME, stroke: ROME_DK },
        { rect: { x: 186, y: 150, w: 34, h: 14, rx: 2 }, fill: ROME, stroke: ROME_DK },
        { rect: { x: 226, y: 150, w: 34, h: 14, rx: 2 }, fill: ROME, stroke: ROME_DK },
        { rect: { x: 146, y: 170, w: 34, h: 13, rx: 2 }, fill: PAPER, stroke: ROME_DK },
        { rect: { x: 186, y: 170, w: 34, h: 13, rx: 2 }, fill: PAPER, stroke: ROME_DK },
        { rect: { x: 226, y: 170, w: 34, h: 13, rx: 2 }, fill: PAPER, stroke: ROME_DK },
      ],
      arrows: [
        // Flanks pressing in
        { from: [104, 124], to: [140, 124], color: PUNIC },
        { from: [104, 174], to: [140, 174], color: PUNIC },
        { from: [298, 124], to: [262, 124], color: PUNIC },
        { from: [298, 174], to: [262, 174], color: PUNIC },
        // Rear sealed from above
        { from: [170, 96], to: [170, 106], color: PUNIC, width: 2 },
        { from: [232, 96], to: [232, 106], color: NUMID, width: 2 },
        // Front holding from below
        { from: [200, 204], to: [200, 190], color: PUNIC },
      ],
      annotations: [
        { x: 200, y: 296, text: 'surrounded on all four sides', size: 8, color: '#57534e', italic: true },
      ],
    },
    {
      label: 'The destruction',
      title:
        'Compressed too tightly to fight, with the river at their back, the encircled legions are destroyed across the afternoon',
      description:
        'Compressed too tightly to deploy or even swing a sword, with the river at their back, the encircled army is cut down where it stands across the afternoon. Of roughly 80,000 Romans, perhaps 50,000 to 70,000 die.',
      rivers: [AUFIDUS],
      units: [
        TREES,
        // The ring, tightened
        { rect: { x: 156, y: 86, w: 40, h: 13, rx: 2 }, fill: PUNIC, stroke: PUNIC_DK, patternFill: 'hatch' },
        { rect: { x: 208, y: 86, w: 40, h: 13, rx: 2 }, fill: NUMID, stroke: NUMID_DK, patternFill: 'dots' },
        { rect: { x: 124, y: 106, w: 15, h: 40, rx: 2 }, fill: PUNIC, stroke: PUNIC_DK },
        { rect: { x: 124, y: 152, w: 15, h: 40, rx: 2 }, fill: PUNIC, stroke: PUNIC_DK },
        { rect: { x: 264, y: 106, w: 15, h: 40, rx: 2 }, fill: PUNIC, stroke: PUNIC_DK },
        { rect: { x: 264, y: 152, w: 15, h: 40, rx: 2 }, fill: PUNIC, stroke: PUNIC_DK },
        { rect: { x: 146, y: 198, w: 40, h: 14, rx: 2 }, fill: PUNIC, stroke: PUNIC_DK },
        { rect: { x: 218, y: 198, w: 40, h: 14, rx: 2 }, fill: PUNIC, stroke: PUNIC_DK },
        // The dying army: fragmented, fading
        { rect: { x: 152, y: 112, w: 30, h: 13, rx: 2 }, fill: ROME, stroke: ROME_DK, strokeDasharray: '3,2', opacity: 0.7 },
        { rect: { x: 188, y: 112, w: 30, h: 13, rx: 2 }, fill: ROME, stroke: ROME_DK, strokeDasharray: '3,2', opacity: 0.7 },
        { rect: { x: 224, y: 112, w: 30, h: 13, rx: 2 }, fill: ROME, stroke: ROME_DK, strokeDasharray: '3,2', opacity: 0.7 },
        { rect: { x: 152, y: 131, w: 30, h: 13, rx: 2 }, fill: ROME, stroke: ROME_DK, strokeDasharray: '3,2', opacity: 0.55 },
        { rect: { x: 188, y: 131, w: 30, h: 13, rx: 2 }, fill: ROME, stroke: ROME_DK, strokeDasharray: '3,2', opacity: 0.55 },
        { rect: { x: 224, y: 131, w: 30, h: 13, rx: 2 }, fill: ROME, stroke: ROME_DK, strokeDasharray: '3,2', opacity: 0.55 },
        { rect: { x: 152, y: 150, w: 30, h: 13, rx: 2 }, fill: ROME, stroke: ROME_DK, strokeDasharray: '3,2', opacity: 0.4 },
        { rect: { x: 188, y: 150, w: 30, h: 13, rx: 2 }, fill: ROME, stroke: ROME_DK, strokeDasharray: '3,2', opacity: 0.4 },
        { rect: { x: 224, y: 150, w: 30, h: 13, rx: 2 }, fill: ROME, stroke: ROME_DK, strokeDasharray: '3,2', opacity: 0.4 },
        { rect: { x: 152, y: 169, w: 30, h: 12, rx: 2 }, fill: PAPER, stroke: ROME_DK, strokeDasharray: '3,2', opacity: 0.4 },
        { rect: { x: 188, y: 169, w: 30, h: 12, rx: 2 }, fill: PAPER, stroke: ROME_DK, strokeDasharray: '3,2', opacity: 0.4 },
        { rect: { x: 224, y: 169, w: 30, h: 12, rx: 2 }, fill: PAPER, stroke: ROME_DK, strokeDasharray: '3,2', opacity: 0.4 },
      ],
      arrows: [
        { from: [146, 92], to: [162, 104], color: PUNIC, width: 2 },
        { from: [258, 92], to: [244, 104], color: NUMID, width: 2 },
        { from: [110, 126], to: [122, 126], color: PUNIC, width: 2 },
        { from: [110, 172], to: [122, 172], color: PUNIC, width: 2 },
        { from: [294, 126], to: [282, 126], color: PUNIC, width: 2 },
        { from: [294, 172], to: [282, 172], color: PUNIC, width: 2 },
        { from: [166, 226], to: [166, 214], color: PUNIC, width: 2 },
        { from: [238, 226], to: [238, 214], color: PUNIC, width: 2 },
      ],
      annotations: [
        { x: 200, y: 60, text: 'the river closes the line of retreat', size: 8, color: '#0369a1', italic: true },
        { x: 200, y: 296, text: '~50,000–70,000 Roman dead in a single afternoon', size: 8, color: '#57534e', italic: true, weight: 600 },
      ],
    },
  ],
  legend: [
    { label: 'Roman infantry (legions)', fill: ROME, stroke: ROME_DK },
    { label: 'Allied Italian infantry', fill: PAPER, stroke: ROME_DK },
    { label: 'Roman cavalry', fill: ROME, stroke: ROME_DK, pattern: 'hatch' },
    { label: 'Carthaginian infantry', fill: PUNIC, stroke: PUNIC_DK },
    { label: 'Carthaginian heavy cavalry', fill: PUNIC, stroke: PUNIC_DK, pattern: 'hatch' },
    { label: 'Numidian cavalry', fill: NUMID, stroke: NUMID_DK, pattern: 'dots' },
  ],
  caption:
    'Schematic, not to scale. Hannibal placed his weakest troops (Iberians and Gauls) in a forward crescent that flexed back as Roman pressure built; his veteran African heavy infantry on the wings then wheeled inward to attack the Roman flanks while his cavalry, having broken both Roman cavalry wings, returned to strike the rear. The result was complete encirclement. Reconstruction follows Polybius 3.107-117 and Livy 22.44-49.',
};

export default config;
