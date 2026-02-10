# Task 19: Single-Student Weekly & Median View

## Overview

This task enhances the existing **single-student route**:

- **Path**: `/time/calendar/{courseid}/{studentid}`

The goal is to show **both**:

1. A **weekly calendar grid** for the selected student (as today).
2. A **median-by-week summary grid** based on that same student’s data.

This builds on the `StudentCalendar` and `CalendarModel` introduced in Task 18 and the single-student padding logic added to keep week/date columns aligned with the course-level view.

## Requirements

### 1. Route Responsibility (unchanged)

- Continue to use the existing route file:
  - `src/routes/[courseid]/[studentid]/+page.svelte`
- URL parameters remain:
  - `courseid` – course identifier.
  - `studentid` – student identifier.
- Data loading:
  - Reuse `CourseTime.loadStudentCalendar(courseId, studentId, startDate, endDate)` (already implemented).
  - Continue to rely on `StudentCalendar.calendarModel: CalendarModel` for all grid data:
    - `day`, `week`, `medianByDay`, `medianByWeek`.
    - With the padded entries so that columns match the course-level views.

### 2. Page Layout and Sections

- Keep the existing **header** from Task 18:
  - Title: **“Student Calendar”**.
  - Subheading: shows course title/ID and student ID.
  - “Back to course calendar” button linking back to the course-level view.

- Rework the **main content** area to have two stacked sections when data is available:

1. **Section A: Weekly Calendar Grid**
   - Heading: e.g. **“By week”**.
   - Content:
     - Use `CalendarGrid` with:
       - `model={studentCalendar.calendarModel}`
       - `mode="week"`
       - `variant="detail"` (default).
   - Behaviour:
     - Shows a single row for the student.
     - Week/date columns should match the course-level `CalendarGrid` (including zero-only weeks/dates padded by `loadStudentCalendar`).

2. **Section B: Median-by-Week Grid**
   - Heading: e.g. **“Median by week”**.
   - Content (either option is acceptable, pick one and keep it consistent):
     - **Option 1 (preferred)**: reuse `CalendarGrid` in summary mode:
       - `CalendarGrid model={studentCalendar.calendarModel} mode="week" variant="summary"`.
     - **Option 2**: reuse `CalendarMedianGrid`:
       - `CalendarMedianGrid model={studentCalendar.calendarModel} mode="week"`.
   - Behaviour:
     - Shows a single summary row derived from `CalendarModel.medianByWeek`.
     - Uses the same week columns as Section A.
     - No `courseid` column (only `Total` + week columns, as recently refactored).

### 3. Loading, Error, and Empty States

- Keep the existing states from Task 18:
  - **Loading**:
    - While `studentCalendar` is being fetched, show “Loading student calendar...” centered.
  - **Error**:
    - On load error, show an error card with the message and do **not** render the grids.
  - **Empty**:
    - If `studentCalendar` exists but `studentCalendar.calendarModel.hasData` is false:
      - Show “No calendar data found for this student in this course.”
      - Do **not** render the two grid sections.

- Only show Sections A and B when:
  - `!loading`
  - `!error`
  - `studentCalendar` is non-null
  - `studentCalendar.calendarModel.hasData` is true

### 4. Reuse and Consistency

- Do **not** introduce new models or services for this task.
  - Reuse:
    - `StudentCalendar` type (from `src/lib/types.ts`).
    - `CourseTime.loadStudentCalendar` (from `src/lib/services/CourseTime.ts`).
    - `CalendarModel` and its `medianByWeek` view.
    - `CalendarGrid` / `CalendarMedianGrid` components.

- Ensure:
  - Week/date columns in both grids match the course-level view for the same `(courseid, studentid)` pair.
  - Styling is consistent with existing grids (fonts, spacing, colour coding, pinned columns).

## Files Changed

1. **`src/routes/[courseid]/[studentid]/+page.svelte`**
   - Update the main content to render:
     - Section A: weekly `CalendarGrid` for the student.
     - Section B: median-by-week summary grid (using either `CalendarGrid` in summary mode or `CalendarMedianGrid`).
   - Preserve existing header, loading, error, and empty states logic.

2. **(Optional) `specs/task-18.md`**
   - Optionally add a short note that Task 19 extends the single-student route with weekly + median views, keeping Task 18’s scope as the initial single-student route implementation.

## Acceptance Criteria

- Navigating to `/time/calendar/{courseid}/{studentid}` for a student with data shows:
  - Header with course and student info.
  - A **“By week”** grid for that student.
  - A **“Median by week”** grid using the same week columns.
- For a student with no data:
  - The “No calendar data found for this student in this course.” message appears.
  - Neither grid is rendered.
- No regressions to:
  - The root calendar page.
  - The `/time/calendar/{courseid}` course-only route.
  - Course-level median and weekly grids.

