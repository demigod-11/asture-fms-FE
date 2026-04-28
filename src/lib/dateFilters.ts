/**
 * Shared date filter presets and helpers.
 * Use one set everywhere: Last 7 / 30 / 90 days + Custom.
 * Custom range is displayed as "May 1 – May 2, 2026" in toolbars/columns.
 */

export const DATE_FILTER_PRESETS = [
  { value: 'last-7', label: 'Last 7 days' },
  { value: 'last-30', label: 'Last 30 days' },
  { value: 'last-90', label: 'Last 90 days' },
  { value: 'custom', label: 'Custom' },
] as const;

export type DateFilterPresetKey = (typeof DATE_FILTER_PRESETS)[number]['value'];

const DATE_OPTS: Intl.DateTimeFormatOptions = {
  day: 'numeric',
  month: 'short',
  year: 'numeric',
};

/** Format custom range for display in toolbar/column: e.g. "May 1 – May 2, 2026" */
export function formatCustomRangeDisplay(from: string, to: string): string {
  if (!from || !to) return 'Select dates';
  const f = new Date(from);
  const t = new Date(to);
  return `${f.toLocaleDateString('en-GB', DATE_OPTS)} – ${t.toLocaleDateString('en-GB', DATE_OPTS)}`;
}

function toYMD(d: Date): string {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${y}-${m}-${day}`;
}

/**
 * Return { date_from, date_to } in ISO date format (YYYY-MM-DD) for the given preset.
 * For 'custom', pass customFrom and customTo; otherwise they are ignored.
 */
export function getDateRangeForPreset(
  preset: DateFilterPresetKey,
  customFrom?: string,
  customTo?: string
): { date_from: string; date_to: string } {
  const today = new Date();
  const todayStr = toYMD(today);

  if (preset === 'custom' && customFrom && customTo) {
    return { date_from: customFrom, date_to: customTo };
  }

  let start: Date;

  switch (preset) {
    case 'last-7':
      start = new Date(today);
      start.setDate(start.getDate() - 6);
      break;
    case 'last-30':
      start = new Date(today);
      start.setDate(start.getDate() - 29);
      break;
    case 'last-90':
      start = new Date(today);
      start.setDate(start.getDate() - 89);
      break;
    default:
      start = new Date(today);
      start.setDate(start.getDate() - 89);
  }

  return {
    date_from: toYMD(start),
    date_to: todayStr,
  };
}

/** Default preset for list pages */
export const DEFAULT_LIST_DATE_PRESET: DateFilterPresetKey = 'last-90';

/** Default custom range when preset is custom (start of current year to today) */
export function getDefaultCustomRange(): { from: string; to: string } {
  const t = new Date();
  const y = t.getFullYear();
  return {
    from: `${y}-01-01`,
    to: toYMD(t),
  };
}
