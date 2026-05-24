/**
 * Type definitions for the dynasty / family-tree system.
 *
 * Each dynasty has a config at src/data/dynasties/<slug>.ts that
 * describes the tree's nodes (people, with hand-placed positions for
 * the POC) and the relationships (parent-child, marriage, sibling).
 * The FamilyTree component reads the config and renders an SVG tree.
 *
 * Hand-placement is intentional for the POC. Algorithmic layout can
 * be added later if the dynasty count scales; for the four-or-so
 * dynasties the site needs, hand-placement gives better control over
 * the visual reading order and dramatic relationships.
 */

export type FamilyNode = {
  /** Display name; usually shorter than the full person page name. */
  label: string;
  /**
   * Optional ref into the people collection. If present, the node
   * renders as a clickable link to /people/<personSlug>.
   */
  personSlug?: string;
  /** Optional short role/title (e.g., "FPW commander"). */
  role?: string;
  /** Optional life dates as display text (e.g., "275–228 BCE"). */
  dates?: string;
  /** Pixel position in the SVG viewBox. */
  x: number;
  y: number;
  /** Optional category for color coding (Carthaginian, Numidian, Iberian, Roman, etc.). */
  category?: 'carthaginian' | 'numidian' | 'iberian' | 'roman' | 'other';
  /** If true, the node is rendered with a dashed border (indicating uncertain or partially-attested). */
  uncertain?: boolean;
  /** If true, the node is rendered with reduced opacity (indicating off-tree context). */
  context?: boolean;
};

export type FamilyEdge = {
  /** Source node id (the index in the nodes array, or a string id if nodes have ids). */
  from: string;
  to: string;
  /** Edge type — parent-child (solid), marriage (dashed), sibling (dotted). */
  kind: 'parent' | 'marriage' | 'sibling';
  /** Optional waypoint for routing the line (forces a right-angle bend at this point). */
  waypoint?: { x: number; y: number };
};

export type FamilyTreeConfig = {
  /** Dynasty / family display name. */
  title: string;
  /** Short subtitle (e.g., "The Carthaginian aristocratic house that produced Hannibal"). */
  subtitle: string;
  /** Period the tree covers, as display text (e.g., "c. 290–200 BCE"). */
  period?: string;
  /** SVG viewBox dimensions. Defaults to "0 0 800 500". */
  viewBox?: string;
  /** Nodes, keyed by id. */
  nodes: Record<string, FamilyNode>;
  /** Edges between nodes. */
  edges: FamilyEdge[];
  /** Caption rendered below the tree explaining sources and assumptions. */
  caption: string;
  /** Optional legend entries (category + label + color). */
  legend?: { category: string; label: string }[];
};

/** Color palette by category. */
export const CATEGORY_COLORS: Record<string, { fill: string; stroke: string; text: string }> = {
  carthaginian: { fill: '#fef5e7', stroke: '#5b0f31', text: '#1a0410' },
  numidian: { fill: '#fef3c7', stroke: '#92400e', text: '#451a03' },
  iberian: { fill: '#e0f2fe', stroke: '#0369a1', text: '#0c4a6e' },
  roman: { fill: '#fee2e2', stroke: '#7f1d1d', text: '#7f1d1d' },
  other: { fill: '#f5f5f4', stroke: '#57534e', text: '#1a0410' },
};
