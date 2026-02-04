<script lang="ts">
  import { createGrid, ModuleRegistry, AllCommunityModule } from "ag-grid-community";
  import type { ColDef, GridApi } from "ag-grid-community";
  import type { CalendarEntry } from "$lib/types";
  import {
    getDistinctSortedWeeks,
    getDistinctSortedDates,
    getMondayForDate,
    buildTotalSecondsColumn,
    buildPerWeekTimeColumnsMinutesOnly,
    buildPerDateTimeColumnsMinutesOnly
  } from "$lib/calendarUtils";

  ModuleRegistry.registerModules([AllCommunityModule]);

  interface Props {
    data: CalendarEntry[];
    loading: boolean;
    error: string | null;
  }

  type SummaryRow = {
    courseid: string;
    totalSeconds: number;
    [key: string]: string | number;
  };

  let { data, loading, error }: Props = $props();

  let gridContainer = $state<HTMLDivElement | null>(null);
  let gridApi = $state<GridApi<SummaryRow> | null>(null);
  let viewMode = $state<"week" | "day">("week");

  const weeks = $derived(getDistinctSortedWeeks(data));
  const dates = $derived(getDistinctSortedDates(data));

  const summaryRow = $derived(
    (() => {
      if (!data.length) return null;
      const courseid = data[0].courseid;
      let totalSeconds = 0;
      if (viewMode === "week") {
        const totalsByWeek = new Map<string, number>();
        for (const entry of data) {
          const secs = entry.timeactive ?? 0;
          totalSeconds += secs;
          const weekMonday = getMondayForDate(entry.id);
          totalsByWeek.set(weekMonday, (totalsByWeek.get(weekMonday) ?? 0) + secs);
        }
        const row: SummaryRow = { courseid, totalSeconds };
        for (const weekMonday of weeks) {
          row[weekMonday] = totalsByWeek.get(weekMonday) ?? 0;
        }
        return row;
      } else {
        const totalsByDate = new Map<string, number>();
        for (const entry of data) {
          const secs = entry.timeactive ?? 0;
          totalSeconds += secs;
          totalsByDate.set(entry.id, (totalsByDate.get(entry.id) ?? 0) + secs);
        }
        const row: SummaryRow = { courseid, totalSeconds };
        for (const date of dates) {
          row[date] = totalsByDate.get(date) ?? 0;
        }
        return row;
      }
    })()
  );

  const columnDefs = $derived.by((): ColDef<SummaryRow>[] => {
    const cols: ColDef<SummaryRow>[] = [
      {
        field: "courseid",
        headerName: "Course ID",
        pinned: "left",
        minWidth: 200,
        flex: 1
      },
      buildTotalSecondsColumn<SummaryRow>("totalSeconds", "Total"),
      ...(viewMode === "week" ? buildPerWeekTimeColumnsMinutesOnly<SummaryRow>(weeks) : buildPerDateTimeColumnsMinutesOnly<SummaryRow>(dates))
    ];

    return cols;
  });

  $effect(() => {
    const container = gridContainer;
    if (!container) return;
    const api = createGrid<SummaryRow>(container, {
      columnDefs,
      rowData: summaryRow ? [summaryRow] : [],
      loading,
      defaultColDef: { sortable: true, resizable: true },
      domLayout: "normal",
      suppressNoRowsOverlay: false,
      headerHeight: 72
    });
    gridApi = api;
    return () => {
      api.destroy();
      gridApi = null;
    };
  });

  $effect(() => {
    const api = gridApi;
    if (api) {
      api.setGridOption("columnDefs", columnDefs);
      api.setGridOption("rowData", summaryRow ? [summaryRow] : []);
      api.setGridOption("loading", loading);
    }
  });

  function toggleViewMode() {
    viewMode = viewMode === "week" ? "day" : "week";
  }
</script>

{#if loading && (!data || data.length === 0)}
  <div class="flex items-center justify-center p-8">
    <p class="text-lg">Loading course summary...</p>
  </div>
{:else if error}
  <div class="card preset-filled-error-500 p-4">
    <p class="font-bold">Error loading summary</p>
    <p class="text-sm">{error}</p>
  </div>
{:else if !summaryRow}
  <div class="flex items-center justify-center p-8">
    <p class="text-lg text-surface-600">No summary available for this course</p>
  </div>
{:else}
  <div class="flex h-full flex-col gap-2">
    <div class="flex shrink-0 justify-end">
      <button type="button" onclick={toggleViewMode} class="btn variant-filled-secondary" aria-label={viewMode === "week" ? "Switch to daily view" : "Switch to weekly view"}>
        {viewMode === "week" ? "Show by day" : "Show by week"}
      </button>
    </div>
    <div class="ag-theme-quartz grid-fill-container min-h-0 flex-1" role="grid" aria-label="Course summary">
      <div bind:this={gridContainer} class="grid-fill-container"></div>
    </div>
  </div>
{/if}
