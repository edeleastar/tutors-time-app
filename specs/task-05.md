# Milestone 5: Visual View – Course Usage Grid (AG Grid Community)

## Overview

This document describes the implementation of the Visual tab as a course usage view using AG Grid Community edition. The grid displays course usage data with student IDs in the first column and time active per date in subsequent columns, using a compressed date format in column headings to minimize column width. The grid uses the full viewport width and height.

**Milestone Goal**: Display course usage data on the Visual tab using AG Grid Community. First column lists each student ID; every other column is a date with time active value only. Compressed date format in column headings. Grid fills the full viewport width and height.

## Requirements

### Grid layout
- **First column**: Student ID (one row per student), pinned to the left so it does not scroll horizontally.
- **Second column**: **Total** time for the student across all dates, shown in **total minutes only** (integer, no suffix).
- **Other columns**: One column per date; cell value = time active on that date, formatted to the nearest minute (e.g. "1h 30", "45").
- **Column headers**:
  - Date columns use a **compressed date format** (e.g. `"d/M"` such as `"3/2"`) to minimize column width.
  - Total + date headers are rendered **vertically** to save horizontal space.
- **No other fields**: Course ID, page loads, etc. are not shown in this grid.

### Sizing
- Grid must use **full viewport width and height** (or the full Visual tab content area so it effectively fills the viewport).
- Grid container and AG Grid theme wrapper should be 100% width and 100% height of their parent; parent chain should provide viewport-sized area (Visual tab wrapper sized using viewport height).

### Technology
- AG Grid Community edition only (no enterprise), using the `ag-theme-quartz` theme.
- Register `AllCommunityModule` before use (AG Grid v31+).
- Use existing calendar data source (same `data`, `loading`, `error` as Table tab).

### States
- Loading: show loading message when `loading` and no data.
- Error: show error message when `error` is set.
- Empty: show empty state when `data.length === 0`.

## Data transformation

- **Rows**: One row per distinct `studentid` (sorted).
- **Columns**:
  - Column 1 = `studentid` (header "Student" or "Student ID").
  - Column 2 = `totalSeconds` (header "Total"): sum of `timeactive` over all dates for that student.
  - Columns 3..N = one per distinct date (sorted), header = compressed date, value = time active (seconds) for that student on that date.
- If multiple entries exist for the same student+date, **sum** `timeactive` before populating the pivoted row.
- **Compressed date format**: Short form for headers, e.g. `day/month` as `"d/M"` such as `"3/2"` – keep header text short to minimize column width and work well with vertical orientation.

## Component

- Implementation lives in `CalendarGrid.svelte`, used by the page for the Visual tab.
- Same props as current Visual tab: `data: CalendarEntry[]`, `loading: boolean`, `error: string | null`.
- Uses Svelte 5 runes (`$props()`, `$state()`, `$derived()`) and AG Grid’s vanilla JS API (`createGrid`).

## Success criteria

- [ ] Visual tab shows an AG Grid with course usage data.
- [ ] First column is Student ID (pinned left); second column is Total minutes; remaining columns are dates with time active only.
- [ ] Date/Total column headers use a compressed format and vertical orientation with a slightly reduced font size.
- [ ] Time cells (Total + per-date) use a compact font size and:
  - [ ] Are **colour-scaled by minutes**: 0 = white, 1 ≈ light green, 1–30 minutes deepening to dark green.
- [ ] Grid is full viewport width and height (or fills the Visual tab area).
- [ ] Loading, error, and empty states are handled.
- [ ] Grid initially sorts rows by Total minutes (descending) so the most active students appear first.
- [ ] No duplicate data fetching; uses same data as Table tab.
