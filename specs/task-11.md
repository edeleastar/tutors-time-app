# Milestone 11: Grid View Toggle – 7-Day Summary vs Daily Itemisation

## Overview

This milestone adds a **toggle button with each grid** (Visual and Summary) that switches between:

- **7-day summary**: Current behaviour — one column per week (Monday date), aggregated time per week.
- **Full itemisation of each day**: One column per calendar date, showing time per day.

Key changes:

- **Button placement**: One toggle button per grid, above the grid in the same tab content. Label indicates the other view (e.g. "Show by day" when viewing by week, "Show by week" when viewing by day).
- **CalendarGrid**: Supports both weekly columns (current) and daily columns; pivoted by student and week or by student and date.
- **CourseSummaryGrid**: Supports both weekly columns (current) and daily columns; aggregated by week or by date.
- **Table View**: `CalendarTable` remains unchanged (still shows daily entries).

## Requirements

### View Mode State

- **State**: Each grid holds a view mode: `'week' | 'day'`.
- **Default**: View mode defaults to `'week'` (7-day summary) so current behaviour is preserved on load.
- **Independence**: Each grid toggles independently (state is local to the component).

### Button Behaviour

- **Placement**: One button above the AG Grid, within the same card/tab content area (e.g. in a toolbar row above the grid).
- **Label**: When viewing by week, button label is "Show by day". When viewing by day, button label is "Show by week".
- **Action**: Clicking the button toggles the view mode and updates the grid columns and data accordingly.

### CalendarGrid (Visual View)

- **By week** (current):
  - Use `getDistinctSortedWeeks(data)` for column keys.
  - Pivot by `studentid` + week (Monday date); sum `timeactive` per student per week.
  - Columns: Student ID, Total, then `buildPerWeekTimeColumns(weeks)`.
- **By day**:
  - Use `getDistinctSortedDates(data)` for column keys.
  - Pivot by `studentid` + `id` (date); sum `timeactive` per student per date.
  - Columns: Student ID, Total, then `buildPerDateTimeColumns(dates)`.

### CourseSummaryGrid (Summary View)

- **By week** (current):
  - Use `getDistinctSortedWeeks(data)` for column keys.
  - Aggregate by week (Monday date); sum `timeactive` per week for the course.
  - Columns: Course ID, Total, then `buildPerWeekTimeColumnsMinutesOnly(weeks)`.
- **By day**:
  - Use `getDistinctSortedDates(data)` for column keys.
  - Aggregate by date (`entry.id`); sum `timeactive` per date for the course.
  - Columns: Course ID, Total, then `buildPerDateTimeColumnsMinutesOnly(dates)` (minutes-only for consistency with summary week view).

### Utility Functions

- **Existing**: `getDistinctSortedDates`, `getMondayForDate`, `buildPerDateTimeColumns`, `buildPerWeekTimeColumns`, `buildPerWeekTimeColumnsMinutesOnly` in `calendarUtils.ts`.
- **New (optional)**: `buildPerDateTimeColumnsMinutesOnly(dates: string[]): ColDef<T>[]` — same structure as `buildPerDateTimeColumns` but uses `formatTimeMinutesOnly` for cell values, for Summary grid day view consistency.

### Table View (CalendarTable)

- **No Changes**: `CalendarTable` continues to display daily entries as before. No toggle and no code changes.

## Success Criteria

- [ ] Each grid (CalendarGrid and CourseSummaryGrid) has a toggle button visible above the grid when the grid has data.
- [ ] Button label is "Show by day" when the grid is in week view, and "Show by week" when the grid is in day view.
- [ ] Clicking the button toggles the view and updates columns and row data immediately.
- [ ] CalendarGrid in week view shows one column per week (Monday date), pivoted by student and week; in day view shows one column per date, pivoted by student and date.
- [ ] CourseSummaryGrid in week view shows one column per week, aggregated by week; in day view shows one column per date, aggregated by date.
- [ ] Day view column headers use the same compressed date format (e.g. "3/2/25") as week view (Monday date format).
- [ ] CalendarTable is unchanged (no new button, same daily table behaviour).
- [ ] View mode is independent per grid (toggling one does not affect the other).

## Implementation Notes

### calendarUtils.ts

- `getDistinctSortedDates(entries)` and `buildPerDateTimeColumns(dates)` already exist for daily columns.
- Add `buildPerDateTimeColumnsMinutesOnly(dates: string[])` mirroring `buildPerWeekTimeColumnsMinutesOnly`: same styling and column structure, but `valueFormatter` uses `formatTimeMinutesOnly` instead of `formatTimeNearestMinute`.

### CalendarGrid data transformation

- **Week mode**: Existing logic — group by `studentid` + `getMondayForDate(e.id)`, sum `timeactive`.
- **Day mode**: Group by `studentid` + `e.id` (date), sum `timeactive`. Build row with one field per date from `getDistinctSortedDates(data)`.

### CourseSummaryGrid data transformation

- **Week mode**: Existing logic — group by `getMondayForDate(entry.id)`, sum `timeactive` per week.
- **Day mode**: Group by `entry.id` (date), sum `timeactive` per date. Single summary row with one field per date from `getDistinctSortedDates(data)`.

### Layout

- Add a small toolbar or flex row above the grid container containing only the toggle button. Use Skeleton button classes (e.g. `btn variant-filled-secondary`) for consistency.
