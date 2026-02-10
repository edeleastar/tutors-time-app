import type { ColDef } from "ag-grid-community";
import type { CalendarEntry } from "$lib/types";
import {
  getDistinctSortedWeeks,
  getDistinctSortedDates,
  buildTotalSecondsColumn,
  selectTimeColumns,
  buildPivotedRows,
  buildMedianByDay,
  buildMedianByWeek,
  type PivotedRow,
  type SummaryRow
} from "./calendarUtils";

/** Prepared data for the day-view calendar grid. */
export type CalendarDayView = {
  rows: PivotedRow[];
  columnDefs: ColDef<PivotedRow>[];
};

/** Prepared data for the week-view calendar grid. */
export type CalendarWeekView = {
  rows: PivotedRow[];
  columnDefs: ColDef<PivotedRow>[];
};

/** Prepared data for the median-by-day grid (one row with medians per date). */
export type CalendarMedianByDayView = {
  row: SummaryRow | null;
  columnDefs: ColDef<SummaryRow>[];
};

/** Prepared data for the median-by-week grid (one row with sums of medians per week). */
export type CalendarMedianByWeekView = {
  row: SummaryRow | null;
  columnDefs: ColDef<SummaryRow>[];
};

/**
 * Calendar data prepared for CalendarGrid and CalendarMedianGrid.
 * Create an instance from raw entries and pass it to the grids.
 */
export class CalendarModel {
  readonly day: CalendarDayView;
  readonly week: CalendarWeekView;
  readonly medianByDay: CalendarMedianByDayView;
  readonly medianByWeek: CalendarMedianByWeekView;
  readonly loading: boolean;
  readonly error: string | null;

  constructor(entries: CalendarEntry[], loading: boolean, error: string | null) {
    this.loading = loading;
    this.error = error;

    const weeks = getDistinctSortedWeeks(entries);
    const dates = getDistinctSortedDates(entries);

    this.day = this.buildDayView(entries, weeks, dates);
    this.week = this.buildWeekView(entries, weeks, dates);
    this.medianByDay = this.buildMedianByDayView(entries, dates);
    this.medianByWeek = this.buildMedianByWeekView(entries, weeks, dates);
  }

  private buildDayView(entries: CalendarEntry[], weeks: string[], dates: string[]): CalendarDayView {
    const rows = buildPivotedRows(entries, weeks, dates, "day");
    const timeColumns = selectTimeColumns<PivotedRow>("day", weeks, dates, true);
    const columnDefs: ColDef<PivotedRow>[] = [
      {
        field: "full_name",
        headerName: "Student",
        minWidth: 160,
        flex: 1,
        pinned: "left",
        cellStyle: { paddingLeft: "4px" }
      },
      {
        field: "studentid",
        headerName: "Student ID",
        minWidth: 120,
        pinned: "left",
        cellStyle: { paddingLeft: "4px" },
        cellRenderer: (params) => {
          const studentId = String(params.value ?? "");
          const courseId = String((params.data as any)?.courseid ?? "");
          if (!studentId || !courseId) return studentId;
          const href = `/${courseId}/${studentId}`;
          return `<a href="${href}" class="underline text-primary-600">${studentId}</a>`;
        }
      },
      buildTotalSecondsColumn<PivotedRow>("totalSeconds", "Total"),
      ...timeColumns
    ];
    return { rows, columnDefs };
  }

  private buildWeekView(entries: CalendarEntry[], weeks: string[], dates: string[]): CalendarWeekView {
    const rows = buildPivotedRows(entries, weeks, dates, "week");
    const timeColumns = selectTimeColumns<PivotedRow>("week", weeks, dates, true);
    const columnDefs: ColDef<PivotedRow>[] = [
      {
        field: "full_name",
        headerName: "Student",
        minWidth: 160,
        flex: 1,
        pinned: "left",
        cellStyle: { paddingLeft: "4px" }
      },
      {
        field: "studentid",
        headerName: "Student ID",
        minWidth: 120,
        pinned: "left",
        cellStyle: { paddingLeft: "4px" },
        cellRenderer: (params) => {
          const studentId = String(params.value ?? "");
          const courseId = String((params.data as any)?.courseid ?? "");
          if (!studentId || !courseId) return studentId;
          const href = `/${courseId}/${studentId}`;
          return `<a href="${href}" class="underline text-primary-600">${studentId}</a>`;
        }
      },
      buildTotalSecondsColumn<PivotedRow>("totalSeconds", "Total"),
      ...timeColumns
    ];
    return { rows, columnDefs };
  }

  get hasData(): boolean {
    return this.day.rows.length > 0;
  }

  get hasMedianByDay(): boolean {
    return this.medianByDay.row != null;
  }

  get hasMedianByWeek(): boolean {
    return this.medianByWeek.row != null;
  }

  private buildMedianByDayView(entries: CalendarEntry[], dates: string[]): CalendarMedianByDayView {
    const courseid = entries.length > 0 ? entries[0].courseid : "";
    const row = buildMedianByDay(entries, courseid, dates);
    const timeColumnsDay = selectTimeColumns<SummaryRow>("day", [], dates, true);
    const columnDefs: ColDef<SummaryRow>[] = [
      buildTotalSecondsColumn<SummaryRow>("totalSeconds", "Total"),
      ...timeColumnsDay
    ];
    return { row, columnDefs };
  }

  private buildMedianByWeekView(
    entries: CalendarEntry[],
    weeks: string[],
    dates: string[]
  ): CalendarMedianByWeekView {
    const courseid = entries.length > 0 ? entries[0].courseid : "";
    const medianByDayRow = this.medianByDay.row;
    const row = buildMedianByWeek(medianByDayRow, courseid, weeks, dates);
    const timeColumnsWeek = selectTimeColumns<SummaryRow>("week", weeks, dates, true);
    const columnDefs: ColDef<SummaryRow>[] = [
      buildTotalSecondsColumn<SummaryRow>("totalSeconds", "Total"),
      ...timeColumnsWeek
    ];
    return { row, columnDefs };
  }
}
