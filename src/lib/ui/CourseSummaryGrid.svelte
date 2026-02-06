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
    buildSummaryRow,
    type ViewMode,
    type SummaryRow
  } from "$lib/services/calendarUtils";

  ModuleRegistry.registerModules([AllCommunityModule]);

  interface Props {
    data: CalendarEntry[];
    loading: boolean;
    error: string | null;
  }

  let { data, loading, error }: Props = $props();

  let gridContainer = $state<HTMLDivElement | null>(null);
  let gridApi = $state<GridApi<SummaryRow> | null>(null);
  let viewMode = $state<ViewMode>("week");

  const weeks = $derived(getDistinctSortedWeeks(data));
  const dates = $derived(getDistinctSortedDates(data));

  const summaryRow = $derived(buildSummaryRow(data, weeks, dates, viewMode));

  const columnDefs = $derived.by((): ColDef<SummaryRow>[] => {
    const timeColumns = selectTimeColumns<SummaryRow>(viewMode, weeks, dates, true);
    const cols: ColDef<SummaryRow>[] = [
      {
        field: "courseid",
        headerName: "Course ID",
        pinned: "left",
        minWidth: 200,
        flex: 1
      },
      buildTotalSecondsColumn<SummaryRow>("totalSeconds", "Total"),
      ...timeColumns
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

  function handleToggleViewMode() {
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
    <ViewModeToggle viewMode={viewMode} onToggle={handleToggleViewMode} />
    <div class="ag-theme-quartz grid-fill-container min-h-0 flex-1" role="grid" aria-label="Course summary">
      <div bind:this={gridContainer} class="grid-fill-container"></div>
    </div>
  </div>
{/if}
