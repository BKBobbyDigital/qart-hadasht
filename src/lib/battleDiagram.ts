/**
 * Type definitions for the data-driven battle diagram system.
 *
 * Each battle has a config exported from src/data/battles/<event-slug>.ts.
 * The BattleDiagram component reads the config and renders the SVG.
 * The events render route auto-detects whether a config exists for the
 * current event and embeds the diagram, no per-slug check.
 */

export type BattleUnit = {
  /** Box-style unit (most infantry, cavalry blocks). */
  rect?: { x: number; y: number; w: number; h: number; rx?: number };
  /** Free-form SVG path d (crescents, irregular formations). */
  path?: string;
  fill: string;
  /**
   * Optional pattern fill: 'hatch' renders diagonal stripes in the
   * unit's fill color on a paper-white ground (cavalry convention);
   * 'dots' renders a dot grid (light-cavalry convention). The fill
   * color becomes the pattern ink; set stroke for the border.
   */
  patternFill?: 'hatch' | 'dots';
  stroke?: string;
  strokeWidth?: number;
  strokeDasharray?: string;
  opacity?: number;
  /** Main label rendered with the unit. */
  label?: string;
  /** Where to position the label relative to the unit. */
  labelPosition?: 'inside' | 'above' | 'below' | 'center';
  /** Pixel offset from the unit edge for above/below positioning. Default 6. */
  labelOffset?: number;
  labelColor?: string;
  labelSize?: number;
  labelWeight?: number;
  labelItalic?: boolean;
  /** Optional smaller sub-label (e.g., "(held back)") below the main label. */
  sublabel?: string;
  sublabelColor?: string;
  sublabelSize?: number;
  sublabelItalic?: boolean;
};

export type BattleArrow = {
  from: [number, number];
  to: [number, number];
  /** Optional quadratic-bezier control point for curved sweep arrows. */
  via?: [number, number];
  color?: string;
  width?: number;
  /** Optional dasharray for movement-projection arrows. */
  dasharray?: string;
};

export type BattleAnnotation = {
  x: number;
  y: number;
  text: string;
  color?: string;
  size?: number;
  italic?: boolean;
  weight?: number;
  anchor?: 'start' | 'middle' | 'end';
};

export type BattleRiver = {
  /** Raw SVG path d for the river curve. */
  path: string;
  /** Stroke color; default sky blue. */
  color?: string;
  width?: number;
  opacity?: number;
  label?: string;
  labelX?: number;
  labelY?: number;
};

export type BattlePhase = {
  label: string;
  /** Accessibility title for the SVG. */
  title: string;
  /**
   * Optional one-to-three-sentence narrative for the phase, rendered
   * under the label above the SVG. Phases with a description also get
   * a numbered circle badge in the header.
   */
  description?: string;
  viewBox?: string;
  background?: string;
  northArrow?: boolean;
  rivers?: BattleRiver[];
  units: BattleUnit[];
  arrows?: BattleArrow[];
  annotations?: BattleAnnotation[];
};

export type BattleLegendItem = {
  label: string;
  fill: string;
  stroke?: string;
  /** Render the swatch with the hatch/dots pattern instead of solid fill. */
  pattern?: 'hatch' | 'dots';
};

export type BattleDiagramConfig = {
  /** Section heading rendered above the phases. */
  heading: string;
  phases: BattlePhase[];
  legend: BattleLegendItem[];
  /** Caption rendered below the phases. */
  caption: string;
};
