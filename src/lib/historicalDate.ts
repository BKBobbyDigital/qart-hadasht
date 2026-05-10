/**
 * Formatting helpers for historicalDate values from the content schema.
 *
 * historicalDate has shape:
 *   { value: number, precision: 'exact'|'year'|'decade'|'century'|'legendary',
 *     circa: boolean, range_end: number|null, notes?: string }
 *
 * Negative values are BCE.
 */

export type HistoricalDate = {
  value: number;
  precision: 'exact' | 'year' | 'decade' | 'century' | 'legendary';
  circa: boolean;
  range_end: number | null;
  notes?: string;
};

const era = (n: number) => (n < 0 ? 'BCE' : 'CE');

/** "216 BCE", "c. 814 BCE", "270s BCE", "5th century BCE", "264–241 BCE". */
export function formatHistoricalDate(d: HistoricalDate | undefined): string | undefined {
  if (!d) return undefined;
  const v = Math.abs(d.value);
  const e = era(d.value);
  const prefix = d.circa ? 'c. ' : '';

  let core: string;
  switch (d.precision) {
    case 'decade':
      core = `${v}s`;
      break;
    case 'century': {
      // d.value is the representative year; convert to century ordinal.
      // -500 → 5th century BCE. 500 → 6th century CE.
      const cent = Math.ceil(v / 100);
      const suffix = ordinalSuffix(cent);
      core = `${cent}${suffix} century`;
      break;
    }
    case 'legendary':
    case 'year':
    case 'exact':
    default:
      core = `${v}`;
      break;
  }

  if (d.range_end !== null && d.range_end !== undefined) {
    const endVal = Math.abs(d.range_end);
    const endEra = era(d.range_end);
    if (endEra === e) {
      return `${prefix}${core}–${endVal} ${e}`;
    }
    return `${prefix}${core} ${e}–${endVal} ${endEra}`;
  }

  return `${prefix}${core} ${e}`;
}

/** "approximate" / "legendary" / "decade" — italicized qualifier suffix for infobox. */
export function dateQualifier(d: HistoricalDate | undefined): string | undefined {
  if (!d) return undefined;
  if (d.precision === 'legendary') return 'legendary';
  if (d.precision === 'century' || d.precision === 'decade') return 'approximate';
  if (d.circa) return 'approximate';
  return undefined;
}

function ordinalSuffix(n: number): string {
  const v = n % 100;
  if (v >= 11 && v <= 13) return 'th';
  switch (n % 10) {
    case 1:
      return 'st';
    case 2:
      return 'nd';
    case 3:
      return 'rd';
    default:
      return 'th';
  }
}

/** Format a year-range from two HistoricalDates. */
export function formatDateRange(
  start: HistoricalDate | undefined,
  end: HistoricalDate | undefined
): string | undefined {
  if (!start) return undefined;
  if (!end) return formatHistoricalDate(start);
  // Synthesize a range-style date for display.
  const synthetic: HistoricalDate = {
    ...start,
    range_end: end.value,
  };
  return formatHistoricalDate(synthetic);
}
