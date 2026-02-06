<script lang="ts">
  import { createGrid, ModuleRegistry, AllCommunityModule } from "ag-grid-community";
  import type { ColDef, GridApi } from "ag-grid-community";
  import type { CalendarEntry } from "$lib/types";
  import ViewModeToggle from "$lib/ui/ViewModeToggle.svelte";
  import {
    getDistinctSortedWeeks,
    getDistinctSortedDates,
    buildTotalSecondsColumn,
    selectTimeColumns,
    buildPivotedRows,
    type ViewMode,
    type PivotedRow
  } from "$lib/services/calendarUtils";

  ModuleRegistry.registerModules([AllCommunityModule]);

  interface Props {
    data: CalendarEntry[];
    loading: boolean;
    error: string | null;
  }

  let { data, loading, error }: Props = $props();

  let gridContainer = $state<HTMLDivElement | null>(null);
  let gridApi = $state<GridApi<PivotedRow> | null>(null);
  let viewMode = $state<ViewMode>("week");

  const weeks = $derived(getDistinctSortedWeeks(data));
  const dates = $derived(getDistinctSortedDates(data));

  const pivotedRowData = $derived(buildPivotedRows(data, weeks, dates, viewMode));

  const columnDefs = $derived.by((): ColDef<PivotedRow>[] => {
    // Use minutes-only formatting for all time columns in the calendar grid.
    const timeColumns = selectTimeColumns<PivotedRow>(viewMode, weeks, dates, true);
    const cols: ColDef<PivotedRow>[] = [
      { field: "studentid", headerName: "Student ID", minWidth: 120, flex: 1, pinned: "left" },
      buildTotalSecondsColumn<PivotedRow>("totalSeconds", "Total"),
      ...timeColumns
    ];
    return cols;
  });

  $effect(() => {
    const container = gridContainer;
    if (!container) return;
    const api = createGrid<PivotedRow>(container, {
      columnDefs,
      rowData: pivotedRowData,
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
      api.setGridOption("rowData", pivotedRowData);
      api.setGridOption("loading", loading);
    }
  });

  function handleToggleViewMode() {
    viewMode = viewMode === "week" ? "day" : "week";
  }
</script>

{#if loading && data.length === 0}
  <div class="flex items-center justify-center p-8">
    <p class="text-lg">Loading calendar data...</p>
  </div>
{:else if error}
  <div class="card preset-filled-error-500 p-4">
    <p class="font-bold">Error loading data</p>
    <p class="text-sm">{error}</p>
  </div>
{:else if data.length === 0}
  <div class="flex items-center justify-center p-8">
    <p class="text-lg text-surface-600">No calendar data available</p>
  </div>
{:else}
  <div class="flex h-full flex-col gap-2">
    <ViewModeToggle viewMode={viewMode} onToggle={handleToggleViewMode} />
    <div class="ag-theme-quartz grid-fill-container min-h-0 flex-1" role="grid" aria-label="Course usage by student and week">
      <div bind:this={gridContainer} class="grid-fill-container"></div>
    </div>
  </div>
{/if}
