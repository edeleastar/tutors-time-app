import type { CalendarEntry } from '$lib/types';
import type { ColDef } from 'ag-grid-community';

/** Return distinct sorted dates (ids) from calendar entries. */
export function getDistinctSortedDates(entries: CalendarEntry[]): string[] {
  return Array.from(new Set(entries.map((e) => e.id))).sort();
}

/** Compressed date for column headers to minimize width (e.g. "3/2" for 3 Feb). */
export function formatDateShort(dateString: string): string {
  try {
    const date = new Date(dateString + 'T12:00:00');
    const day = date.getDate();
    const month = date.getMonth() + 1;
    return `${day}/${month}`;
  } catch {
    return dateString;
  }
}

/** Time to nearest minute only (e.g. "1h 30", "45"). */
export function formatTimeNearestMinute(seconds: number): string {
  const totalMinutes = Math.round(seconds / 60);
  const hours = Math.floor(totalMinutes / 60);
  const minutes = totalMinutes % 60;
  if (hours > 0) {
    return `${hours}h ${minutes}`;
  }
  return `${minutes}`;
}

/** Background colour by minutes: 0 = white, 1 = light green, 1–30 = deeper green. */
export function cellColorForMinutes(seconds: number | null | undefined): string {
  const minutes = seconds != null ? Number(seconds) / 60 : 0;
  const white = { r: 255, g: 255, b: 255 };
  const lightGreen = { r: 200, g: 255, b: 200 };
  const deepGreen = { r: 0, g: 120, b: 0 };
  let r: number;
  let g: number;
  let b: number;
  if (minutes <= 0) {
    r = white.r;
    g = white.g;
    b = white.b;
  } else if (minutes <= 1) {
    const t = minutes;
    r = Math.round(white.r + t * (lightGreen.r - white.r));
    g = Math.round(white.g + t * (lightGreen.g - white.g));
    b = Math.round(white.b + t * (lightGreen.b - white.b));
  } else {
    const t = Math.min(1, (minutes - 1) / 29);
    r = Math.round(lightGreen.r + t * (deepGreen.r - lightGreen.r));
    g = Math.round(lightGreen.g + t * (deepGreen.g - lightGreen.g));
    b = Math.round(lightGreen.b + t * (deepGreen.b - lightGreen.b));
  }
  return `rgb(${r}, ${g}, ${b})`;
}

/** Column definition for a totalSeconds column with common styling and colouring. */
export function buildTotalSecondsColumn<T = any>(
  field: keyof T & string = 'totalSeconds',
  headerName = 'Total'
): ColDef<T> {
  return {
    field,
    headerName,
    headerClass: 'ag-header-vertical',
    sort: 'desc',
    valueFormatter: (p) =>
      p.value != null && Number(p.value) > 0
        ? String(Math.round(Number(p.value) / 60))
        : '',
    cellClass: 'ag-right-aligned-cell',
    cellStyle: (p) => ({ backgroundColor: cellColorForMinutes(p.value as number) }),
    width: 52,
    maxWidth: 64,
  };
}

/** Column definitions for per‑date time columns with shared styling/formatting. */
export function buildPerDateTimeColumns<T = any>(dates: string[]): ColDef<T>[] {
  return dates.map((d) => ({
    field: d,
    headerName: formatDateShort(d),
    headerClass: 'ag-header-vertical',
    valueFormatter: (p) =>
      p.value != null && Number(p.value) > 0
        ? formatTimeNearestMinute(Number(p.value))
        : '',
    cellClass: 'ag-right-aligned-cell',
    cellStyle: (p) => ({
      backgroundColor: cellColorForMinutes(p.value as number),
      textAlign: 'center',
    }),
    width: 40,
    maxWidth: 64,
  }));
}


