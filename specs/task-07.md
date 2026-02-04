# Milestone 7: Calendar Grid Refactoring – Shared Utilities for CalendarGrid & CourseSummaryGrid

## Overview

This milestone focuses on **refactoring** the calendar visualisation components to remove duplication between:

- `src/lib/ui/CalendarGrid.svelte` (per‑student, per‑date visual view), and
- `src/lib/ui/CourseSummaryGrid.svelte` (per‑course summary view).

Both components currently implement similar logic for:

- Date formatting and compressed date headers.
- Time formatting (seconds → nearest minute, `1h 30` / `45`).
- Colour scaling by minutes (0 → white, 1 → light green, 1–30 → deep green).
- Deriving the ordered set of distinct dates from the raw `CalendarEntry[]`.

**Milestone Goal**: Extract shared calendar/grid utilities from `CalendarGrid` and `CourseSummaryGrid` into a common `calendarUtils.ts` module, and update both components to use these shared utilities without changing behaviour.

## Requirements

### Target components

Refactor code in:

- `src/lib/ui/CalendarGrid.svelte`
- `src/lib/ui/CourseSummaryGrid.svelte`

so that:

- Common logic lives in a new shared module:
  - `src/lib/ui/calendarUtils.ts` (or `src/lib/calendarUtils.ts` – choose the most appropriate location and keep it consistent).
- Components import and use the shared functions/types instead of duplicating logic.

### Shared utilities (initial candidates)

At minimum, the following should be extracted and shared:

- **Date utilities**
  - `formatDateShort(dateString: string): string`
    - Compressed date header format used by both grids (e.g. `"d/M"` like `"3/2"`).
  - `getDistinctSortedDates(entries: CalendarEntry[]): string[]`
    - Returns sorted array of distinct `id` (date) values from `CalendarEntry[]`.

- **Time utilities**
  - `formatTimeNearestMinute(seconds: number): string`
    - Converts seconds to nearest minute and formats as `"Xh Y"` or `"Y"`, matching current visual grids.

- **Colour scaling**
  - `cellColorForMinutes(seconds: number | null | undefined): string`
    - Shared colour scale for both grids:
      - 0 minutes → white.
      - ~1 minute → light green.
      - 1–30 minutes → progressively deeper green (saturating at deep green by 30+).

Optionally (if it simplifies code and improves clarity), consider:

- Helper(s) for pivoting/aggregating `CalendarEntry[]`:
  - E.g. `buildStudentPivotRows(entries: CalendarEntry[]): PivotedRow[]`
  - E.g. `buildCourseSummaryRow(entries: CalendarEntry[]): SummaryRow`

These helpers should be **typed** and live in `calendarUtils.ts`, but avoid over‑abstraction if it makes usage unclear.

### Behaviour preservation

- No user‑visible behaviour should change in this refactor:
  - CalendarGrid should render exactly as before.
  - CourseSummaryGrid should render exactly as before.
  - Column headers, colours, formats, pinned columns, and sizes must remain the same.
- Any change in behaviour is **out of scope** for this refactor.

### Testing / safety

- After refactoring:
  - Existing build (`npm run build`) must succeed.
  - Existing E2E / other tests (if any) must still pass.
- Prefer small, clearly‑named functions in `calendarUtils.ts` with JSDoc or brief comments documenting intent.

## Success criteria

- [ ] New shared module `calendarUtils.ts` exists and is imported by both `CalendarGrid.svelte` and `CourseSummaryGrid.svelte`.
- [ ] Duplicate logic for:
  - compressed date formatting,
  - time formatting (seconds → nearest minute),
  - colour scaling by minutes,
  - and distinct date extraction
  is removed from individual components and provided via shared utilities.
- [ ] Optionally, aggregation helpers are shared where it makes sense, without over‑complicating the components.
- [ ] Visual and Summary views behave exactly as before (no regressions in layout, colours, or values).
- [ ] Build and tests pass after the refactor.

