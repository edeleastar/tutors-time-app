# Refactoring Proposal: Extract Shared ViewMode Logic

## Analysis of Commonalities

### Identical Code (100% duplicate)

1. **ViewMode state and toggle function**:
   ```ts
   let viewMode = $state<"week" | "day">("week");
   function toggleViewMode() {
     viewMode = viewMode === "week" ? "day" : "week";
   }
   ```

2. **Toggle button UI** (lines 125-128 in CalendarGrid, 135-138 in CourseSummaryGrid):
   ```svelte
   <div class="flex shrink-0 justify-end">
     <button type="button" onclick={toggleViewMode} class="btn variant-filled-secondary" 
             aria-label={viewMode === "week" ? "Switch to daily view" : "Switch to weekly view"}>
       {viewMode === "week" ? "Show by day" : "Show by week"}
     </button>
   </div>
   ```

3. **Derived weeks/dates**:
   ```ts
   const weeks = $derived(getDistinctSortedWeeks(data));
   const dates = $derived(getDistinctSortedDates(data));
   ```

### Similar Patterns (different implementations)

1. **Column selection logic**:
   - CalendarGrid: `viewMode === "week" ? buildPerWeekTimeColumns(...) : buildPerDateTimeColumns(...)`
   - CourseSummaryGrid: `viewMode === "week" ? buildPerWeekTimeColumnsMinutesOnly(...) : buildPerDateTimeColumnsMinutesOnly(...)`

2. **Data aggregation by viewMode**:
   - Both check `if (viewMode === "week")` vs `else` to aggregate differently
   - CalendarGrid: pivots by studentid
   - CourseSummaryGrid: aggregates all entries into single row

## Proposed Refactoring

### 1. Add ViewMode Utilities to `calendarUtils.ts`

```ts
// ViewMode type
export type ViewMode = "week" | "day";

// Helper to create viewMode state and toggle function
export function createViewMode(initial: ViewMode = "week") {
  const viewMode = $state<ViewMode>(initial);
  const toggleViewMode = () => {
    viewMode = viewMode === "week" ? "day" : "week";
  };
  return { viewMode, toggleViewMode };
}
```

**Note**: The `createViewMode` function won't work as written because Svelte 5 runes can't be used in regular functions. Instead, we should:

**Alternative approach**: Create a helper that returns the toggle function and accepts a state variable:

```ts
export type ViewMode = "week" | "day";

export function createToggleViewMode(viewMode: { value: ViewMode }) {
  return () => {
    viewMode.value = viewMode.value === "week" ? "day" : "week";
  };
}
```

But this is awkward. Better approach:

**Better approach**: Just export the toggle logic as a function that takes a setter:

```ts
export type ViewMode = "week" | "day";

export function toggleViewMode(current: ViewMode): ViewMode {
  return current === "week" ? "day" : "week";
}
```

Then components use: `viewMode = toggleViewMode(viewMode)`

### 2. Helper to Select Time Columns

```ts
// Helper to select time columns based on viewMode
export function selectTimeColumns<T>(
  viewMode: ViewMode,
  weeks: string[],
  dates: string[],
  useMinutesOnly: boolean = false
): ColDef<T>[] {
  if (viewMode === "week") {
    return useMinutesOnly 
      ? buildPerWeekTimeColumnsMinutesOnly<T>(weeks)
      : buildPerWeekTimeColumns<T>(weeks);
  } else {
    return useMinutesOnly
      ? buildPerDateTimeColumnsMinutesOnly<T>(dates)
      : buildPerDateTimeColumns<T>(dates);
  }
}
```

### 3. Extract Toggle Button Component

Create `src/lib/ui/ViewModeToggle.svelte`:

```svelte
<script lang="ts">
  import type { ViewMode } from "$lib/services/calendarUtils";

  interface Props {
    viewMode: ViewMode;
    onToggle: () => void;
  }

  let { viewMode, onToggle }: Props = $props();
</script>

<div class="flex shrink-0 justify-end">
  <button 
    type="button" 
    onclick={onToggle} 
    class="btn variant-filled-secondary" 
    aria-label={viewMode === "week" ? "Switch to daily view" : "Switch to weekly view"}
  >
    {viewMode === "week" ? "Show by day" : "Show by week"}
  </button>
</div>
```

### 4. Update Components to Use Shared Logic

**CalendarGrid.svelte**:
- Import `ViewMode` type and `toggleViewMode` helper
- Import `selectTimeColumns` helper
- Import `ViewModeToggle` component
- Replace local `toggleViewMode` with helper call
- Replace column selection logic with `selectTimeColumns`

**CourseSummaryGrid.svelte**:
- Same changes as CalendarGrid
- Pass `useMinutesOnly: true` to `selectTimeColumns`

## Benefits

1. **DRY**: Eliminates duplicate viewMode state and toggle logic
2. **Consistency**: Ensures both grids behave identically for viewMode switching
3. **Maintainability**: Changes to viewMode logic only need to be made in one place
4. **Testability**: Shared logic can be unit tested independently

## Implementation Steps

1. Add `ViewMode` type and `toggleViewMode` helper to `calendarUtils.ts`
2. Add `selectTimeColumns` helper to `calendarUtils.ts`
3. Create `ViewModeToggle.svelte` component
4. Refactor `CalendarGrid.svelte` to use shared utilities
5. Refactor `CourseSummaryGrid.svelte` to use shared utilities
6. Verify both grids still work correctly
