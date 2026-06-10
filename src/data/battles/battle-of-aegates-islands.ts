import type { BattleDiagramConfig } from '../../lib/battleDiagram';

/**
 * Aegates Islands (10 March 241 BCE) — the engagement that ended
 * the First Punic War.
 *
 * Hanno's relief fleet, loaded with supplies for Hamilcar Barca's
 * army at Mount Eryx and crewed by inexperienced rowers, waited at
 * Hiera for a strong westerly and ran east before it, intending to
 * unload, embark Hamilcar's veterans as marines, and only then
 * fight. Lutatius, who had spent the winter drilling his
 * privately-financed fleet in these same waters, put his line
 * across the channel off Aegusa and accepted battle in a rough
 * sea rather than let the supplies through. The laden, undermanned
 * Carthaginian ships were outsailed and outfought: about 50 sunk
 * and 70 captured. Carthage, unable to build or man another fleet,
 * authorized Hamilcar to negotiate. Polybius 1.59-61 is the
 * principal source.
 */
const config: BattleDiagramConfig = {
  heading: 'Battle diagram: the interception that ended the war',
  phases: [
    {
      label: 'Phase 1 · Hanno runs east before the wind',
      title:
        'The laden Carthaginian relief fleet runs from Hiera toward Mount Eryx on a strong westerly while Lutatius waits off Aegusa',
      background: '#eaf4fb',
      northArrow: true,
      units: [
        // Western Sicily along the right edge, Mt Eryx behind Drepana
        {
          path: 'M 330 0 L 400 0 L 400 320 L 340 320 Q 318 220 332 120 Q 340 60 330 0 Z',
          fill: '#ecdcb0',
          stroke: '#a16207',
        },
        // Hiera, the westernmost island
        { path: 'M 18 150 Q 30 138 46 148 Q 52 160 40 168 Q 24 170 18 150 Z', fill: '#ecdcb0', stroke: '#a16207' },
        // Aegusa, the island nearest the coast
        { path: 'M 178 218 Q 196 206 216 216 Q 224 230 208 240 Q 186 242 178 218 Z', fill: '#ecdcb0', stroke: '#a16207' },
        // Carthaginian fleet running east in sailing order, laden
        { rect: { x: 62, y: 128, w: 15, h: 6 }, fill: '#5b0f31', stroke: '#1a0410' },
        { rect: { x: 84, y: 142, w: 15, h: 6 }, fill: '#5b0f31', stroke: '#1a0410' },
        { rect: { x: 64, y: 156, w: 15, h: 6 }, fill: '#5b0f31', stroke: '#1a0410' },
        { rect: { x: 86, y: 170, w: 15, h: 6 }, fill: '#5b0f31', stroke: '#1a0410' },
        { rect: { x: 66, y: 184, w: 15, h: 6 }, fill: '#5b0f31', stroke: '#1a0410' },
        // Roman fleet waiting off Aegusa
        { rect: { x: 222, y: 150, w: 7, h: 14 }, fill: '#dc2626', stroke: '#7f1d1d' },
        { rect: { x: 234, y: 172, w: 7, h: 14 }, fill: '#dc2626', stroke: '#7f1d1d' },
        { rect: { x: 226, y: 194, w: 7, h: 14 }, fill: '#dc2626', stroke: '#7f1d1d' },
      ],
      arrows: [
        // The westerly wind
        { from: [20, 60], to: [90, 60], color: '#0369a1', dasharray: '5,4', width: 2 },
        // Hanno's course for Eryx
        { from: [108, 158], to: [200, 140], color: '#1a0410', dasharray: '4,3' },
      ],
      annotations: [
        { x: 55, y: 48, text: 'strong westerly', size: 8, color: '#0369a1', italic: true },
        { x: 30, y: 186, text: 'Hiera', size: 8, color: '#7c5b1e', italic: true },
        { x: 198, y: 256, text: 'Aegusa', size: 8, color: '#7c5b1e', italic: true },
        { x: 84, y: 116, text: 'Hanno: ~250 ships, laden', size: 8, color: '#1a0410', weight: 600 },
        { x: 84, y: 204, text: 'supplies for Eryx aboard', size: 7, color: '#1a0410', italic: true },
        { x: 262, y: 140, text: 'Lutatius (~200,', size: 8, color: '#7f1d1d', anchor: 'start' },
        { x: 262, y: 152, text: 'drilled all winter)', size: 8, color: '#7f1d1d', italic: true, anchor: 'start' },
        { x: 374, y: 80, text: 'Mt Eryx:', size: 8, color: '#7c5b1e', weight: 600 },
        { x: 374, y: 92, text: 'Hamilcar', size: 8, color: '#7c5b1e', italic: true },
        { x: 374, y: 220, text: 'Drepana', size: 8, color: '#7c5b1e', italic: true },
      ],
    },
    {
      label: 'Phase 2 · Lutatius puts his line across the channel',
      title:
        'The Roman fleet forms line of battle across the Carthaginian course in a rough sea, and the laden ships must fight as they are',
      background: '#eaf4fb',
      units: [
        // Sicily
        {
          path: 'M 330 0 L 400 0 L 400 320 L 340 320 Q 318 220 332 120 Q 340 60 330 0 Z',
          fill: '#ecdcb0',
          stroke: '#a16207',
        },
        // Hiera
        { path: 'M 18 150 Q 30 138 46 148 Q 52 160 40 168 Q 24 170 18 150 Z', fill: '#ecdcb0', stroke: '#a16207' },
        // Aegusa
        { path: 'M 178 218 Q 196 206 216 216 Q 224 230 208 240 Q 186 242 178 218 Z', fill: '#ecdcb0', stroke: '#a16207' },
        // Roman line of battle across the channel
        { rect: { x: 210, y: 84, w: 7, h: 14 }, fill: '#dc2626', stroke: '#7f1d1d' },
        { rect: { x: 212, y: 108, w: 7, h: 14 }, fill: '#dc2626', stroke: '#7f1d1d' },
        { rect: { x: 214, y: 132, w: 7, h: 14 }, fill: '#dc2626', stroke: '#7f1d1d' },
        { rect: { x: 214, y: 156, w: 7, h: 14 }, fill: '#dc2626', stroke: '#7f1d1d' },
        { rect: { x: 212, y: 180, w: 7, h: 14 }, fill: '#dc2626', stroke: '#7f1d1d' },
        // Carthaginian fleet committed, closing under sail
        { rect: { x: 122, y: 110, w: 15, h: 6 }, fill: '#5b0f31', stroke: '#1a0410' },
        { rect: { x: 140, y: 130, w: 15, h: 6 }, fill: '#5b0f31', stroke: '#1a0410' },
        { rect: { x: 124, y: 150, w: 15, h: 6 }, fill: '#5b0f31', stroke: '#1a0410' },
        { rect: { x: 142, y: 170, w: 15, h: 6 }, fill: '#5b0f31', stroke: '#1a0410' },
      ],
      arrows: [
        // Wind still driving east
        { from: [20, 60], to: [90, 60], color: '#0369a1', dasharray: '5,4', width: 2 },
        // Roman line closing from its station off Aegusa
        { from: [222, 196], to: [218, 150], color: '#7f1d1d' },
        // Carthaginian fleet pressing at the line
        { from: [162, 140], to: [204, 132], color: '#1a0410' },
      ],
      annotations: [
        { x: 55, y: 48, text: 'rough sea', size: 8, color: '#0369a1', italic: true },
        { x: 150, y: 96, text: 'no room to refuse battle', size: 8, color: '#1a0410', italic: true },
        { x: 282, y: 120, text: 'the line blocks', size: 8, color: '#7f1d1d', anchor: 'start' },
        { x: 282, y: 132, text: 'the channel', size: 8, color: '#7f1d1d', italic: true, anchor: 'start' },
        { x: 200, y: 290, text: 'Lutatius accepts battle in a heavy swell rather than let the supplies through', size: 8, color: '#57534e', italic: true },
      ],
    },
    {
      label: 'Phase 3 · The decision',
      title:
        'The drilled Roman crews outfight the laden Carthaginian ships; the survivors run back west on the shifting wind, and Carthage sues for peace',
      background: '#eaf4fb',
      units: [
        // Sicily
        {
          path: 'M 330 0 L 400 0 L 400 320 L 340 320 Q 318 220 332 120 Q 340 60 332 0 Z',
          fill: '#ecdcb0',
          stroke: '#a16207',
        },
        // Hiera
        { path: 'M 18 150 Q 30 138 46 148 Q 52 160 40 168 Q 24 170 18 150 Z', fill: '#ecdcb0', stroke: '#a16207' },
        // Aegusa
        { path: 'M 178 218 Q 196 206 216 216 Q 224 230 208 240 Q 186 242 178 218 Z', fill: '#ecdcb0', stroke: '#a16207' },
        // Roman line holding
        { rect: { x: 206, y: 96, w: 7, h: 14 }, fill: '#dc2626', stroke: '#7f1d1d' },
        { rect: { x: 208, y: 122, w: 7, h: 14 }, fill: '#dc2626', stroke: '#7f1d1d' },
        { rect: { x: 210, y: 148, w: 7, h: 14 }, fill: '#dc2626', stroke: '#7f1d1d' },
        { rect: { x: 208, y: 174, w: 7, h: 14 }, fill: '#dc2626', stroke: '#7f1d1d' },
        // Carthaginian wrecks and prizes at the line
        { rect: { x: 168, y: 110, w: 15, h: 6 }, fill: '#5b0f31', stroke: '#1a0410', strokeDasharray: '3,2', opacity: 0.55 },
        { rect: { x: 172, y: 140, w: 15, h: 6 }, fill: '#5b0f31', stroke: '#1a0410', strokeDasharray: '3,2', opacity: 0.55 },
        { rect: { x: 170, y: 170, w: 15, h: 6 }, fill: '#5b0f31', stroke: '#1a0410', strokeDasharray: '3,2', opacity: 0.55 },
        // Survivors running west
        { rect: { x: 84, y: 130, w: 15, h: 6 }, fill: '#5b0f31', stroke: '#1a0410' },
        { rect: { x: 88, y: 156, w: 15, h: 6 }, fill: '#5b0f31', stroke: '#1a0410' },
      ],
      arrows: [
        // Survivors escaping west to Hiera on the shifted wind
        { from: [80, 144], to: [48, 152], color: '#1a0410', dasharray: '4,3' },
      ],
      annotations: [
        { x: 130, y: 92, text: '~50 sunk, ~70 captured', size: 9, color: '#1a0410', weight: 600 },
        { x: 96, y: 188, text: 'survivors run west', size: 8, color: '#1a0410', italic: true },
        { x: 96, y: 200, text: 'on the shifting wind', size: 8, color: '#1a0410', italic: true },
        { x: 396, y: 80, text: 'Eryx: Hamilcar,', size: 8, color: '#7c5b1e', anchor: 'end' },
        { x: 396, y: 92, text: 'now cut off', size: 8, color: '#7c5b1e', italic: true, anchor: 'end' },
        { x: 200, y: 290, text: 'Carthage cannot man another fleet: the war ends in the Treaty of Lutatius', size: 8, color: '#57534e', italic: true, weight: 600 },
      ],
    },
  ],
  legend: [
    { label: 'Roman fleet (Lutatius)', fill: '#dc2626', stroke: '#7f1d1d' },
    { label: 'Carthaginian relief fleet (Hanno)', fill: '#5b0f31', stroke: '#1a0410' },
    { label: 'The Aegates and the Sicilian coast', fill: '#ecdcb0', stroke: '#a16207' },
  ],
  caption:
    'Aegates Islands, 10 March 241 BCE. Hanno’s plan required reaching Mount Eryx before fighting: unload the supplies, embark Hamilcar Barca’s veterans as marines, and engage with experienced crews. Lutatius’s winter of blockade and drill existed to prevent exactly that, and on the morning the westerly rose he put his line across the channel and accepted battle in a heavy sea. The asymmetry decided it: cleared, light Roman ships with drilled crews against laden hulls rowed by men assembled over a winter. Polybius (1.59-61) reports about 50 Carthaginian ships sunk and 70 captured. The Egadi bronze rams recovered from this seabed since 2004 make it the best archaeologically documented naval battle of antiquity. Positions are schematic reconstructions; the islands are simplified.',
};

export default config;
