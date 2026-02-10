# Task 18: Single-Student Calendar Route

## Overview

This task introduces a new route that displays the **calendar for a single student within a specific course**.  
The route will be:

- **Path**: `/time/calendar/{courseid}/{studentid}`
- **Purpose**: Show the existing calendar visualisations (starting with the AG Grid calendar) filtered down to a **single student** instead of all students in the course.

The initial implementation focuses on **read-only calendar views** for one student; additional features (navigation, deep links from other UIs, lab summaries, etc.) can be added in later tasks.

## Requirements

### 1. Route and URL Structure

- Add a new **SvelteKit page route** for a single-student calendar:
  - App-level path: `/time/calendar/{courseid}/{studentid}`
  - SvelteKit file (within this app): `src/routes/[courseid]/[studentid]/+page.svelte`
- URL parameters:
  - `courseid`: string course identifier (same semantics as the existing root calendar view).
  - `studentid`: string student identifier (matches the `studentid` field in calendar data).
- Optional (MVP-friendly) query parameters:
  - `startDate?: string | null`
  - `endDate?: string | null`
  - Format: ISO date (`YYYY-MM-DD`), same semantics as the root calendar page.
- The page must be **directly navigable** via URL (no dependency on prior navigation from the main course view).

### 2. Data Loading: Single-Student Calendar

- Introduce a **new loader** that builds a calendar model for a single student:
  - Add a new method to `CourseTime` in `src/lib/services/CourseTime.ts`:
    - `loadStudentCalendar(courseId: string, studentId: string, startDate: string | null, endDate: string | null)`
  - **MVP behaviour**:
    - Reuse the existing `CourseTime.loadCalendar` logic to fetch the full course calendar.
    - Filter the **raw calendar events** to only those matching the given `studentid`.
    - Build a **student-scoped calendar model** from the filtered data.
- Add a new type to `src/lib/types.ts`:
  - `StudentCalendar` (or similar) capturing:
    - `id: string` – course id.
    - `studentId: string`.
    - `calendarModel: CalendarModel` – built from filtered data (single-student).
    - `data`, `loading`, `error` – consistent with `CourseCalendar` where appropriate.
- Error handling:
  - If the course cannot be loaded: show an error message and do not render the calendar.
  - If the student has **no matching events** in the course:
    - Show an explicit empty state: “No calendar data found for this student in this course.”
  - If `studentid` is invalid (no records at all), treat this as the same “no data” state (MVP).

### 3. Page Layout and UI

- Create `src/routes/[courseid]/[studentid]/+page.svelte` to render the single-student calendar.
- Page layout:
  - Header area containing:
    - Title: e.g. **“Student Calendar”**.
    - Subheading showing `courseid` and `studentid` (and later, when available, human-readable names).
    - A “Back to course calendar” button/link that navigates back to the main course-level calendar route (root `+page.svelte`).
  - Main content area:
    - For MVP, display the **visual calendar grid** for the single student:
      - Use `CalendarGrid` with a `CalendarModel` built from **only that student’s data**.
      - Default mode: `"week"` (matching the main course view).
    - Optional (nice-to-have for this task, but not required):
      - Add a simple **mode toggle** (week/day) local to this page, similar to the existing calendar behaviour.
- Loading & error states:
  - While data is loading: show a centered loading message/spinner.
  - On error: show an error card with the error message.
  - On empty data: show the “no data for this student” message described above.

### 4. Reuse of Existing Components and Models

- **CalendarModel**:
  - Reuse `CalendarModel` to build the grid for a single student; the only difference is that the underlying data set is filtered to a single `studentid` before constructing the model.
  - No behavioural changes to `CalendarModel` are required; this task only changes **how data is selected** before the model is constructed.
- **CalendarGrid**:
  - Reuse `CalendarGrid.svelte` to render the student’s calendar:
    - Pass the student-specific `CalendarModel`.
    - Use `mode="week"` for the initial implementation; allow `"day"` if a local toggle is added.
  - Do not modify `CourseTabsView.svelte` in this task; the single-student view is a **separate route**, not a new tab.

### 5. Navigation and Linking (MVP)

- This task does **not** require wiring up links from existing grids to the new route (that can be a follow-up task), but:
  - The route must be functional if the user manually navigates to `/time/calendar/{courseid}/{studentid}`.
  - The route should be designed so that future tasks can add links from:
    - Rows in `CalendarGrid` (e.g. clicking a student row).
    - Rows in `LabsGrid` or `LearningRecordsTable`.
- Out of scope for this task:
  - Bookmarkable state beyond the base URL (no need to encode active tab or date range in the URL yet).
  - Any write/edit actions.

## Technical Details

### Data Filtering Strategy

- When implementing `loadStudentCalendar`:
  1. Call the existing course-level loader (or equivalent Supabase query) to obtain the raw calendar events.
  2. Filter events where `record.studentid === studentId`.
  3. Pass the filtered collection into the existing calendar utilities / `CalendarModel` constructor.
  4. Ensure that median/summary calculations (if used on this page) are computed from **only this student’s events**.

### Route Parameters and Types

- Use SvelteKit `PageLoad` (or `load`) in `+page.ts` / `+page.svelte` to read `params.courseid` and `params.studentid`.
- Validate that both parameters are non-empty strings before attempting to load data.
- Propagate types so that `studentId` is strongly typed as `string` in:
  - `StudentCalendar`.
  - `CourseTime.loadStudentCalendar`.

### Accessibility and UX

- Ensure headings follow a logical order (H1 for page title, H2+ for subsections if needed).
- The “Back to course calendar” button must be keyboard-focusable and have an accessible label.
- Loading and error states should be announced clearly with text (screen readers can pick it up).

## Files Changed

1. **`src/lib/services/CourseTime.ts`**
   - Add `loadStudentCalendar(courseId, studentId, startDate, endDate)` implementation.
2. **`src/lib/types.ts`**
   - Add `StudentCalendar` (or similarly named) type.
3. **`src/routes/[courseid]/[studentid]/+page.svelte`**
   - New page implementing the single-student calendar UI.
4. **(Optional) `src/routes/[courseid]/[studentid]/+page.ts`**
   - If using a separate load function instead of in-component `load` logic.

## Acceptance Criteria

- Navigating to `/time/calendar/{courseid}/{studentid}` renders a page with:
  - A clear title indicating this is a single-student calendar view.
  - Visible `courseid` and `studentid` identifiers.
  - A working “Back to course calendar” action.
- For a valid `(courseid, studentid)` pair with data:
  - The grid shows only that student’s activity (no other students’ rows).
  - The weekly calendar matches what would be shown for that student in the course-level view.
- For a valid course but a student with **no data**:
  - The page shows an empty-state message instead of a broken UI.
- For an invalid course or a load failure:
  - An error state is shown with a helpful message.
- The new route uses existing calendar utilities and `CalendarModel` rather than duplicating calendar logic.

