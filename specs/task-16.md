# Task 16: Learning Records Table

## Overview

This task introduces a new table component (`LearningRecordsTable`) that displays learning records from the `learning_records` table for all students of a loaded course. The table is integrated into the existing tabbed interface as a new "Learning Records" tab.

## Requirements

### 1. Learning Records Data Access

- Add a function to fetch all learning records for a given course (all students, all types).
- The function should query the `learning_records` table filtered by `course_id`.
- Records should be ordered by `date_last_accessed` (descending, most recent first).
- Handle errors gracefully, returning an empty array on failure.

### 2. Learning Records Table Component

- Create a new component `src/lib/ui/LearningRecordsTable.svelte` similar in structure to `CalendarTable.svelte`.
- Display the following columns:
  - **Student ID**: The `student_id` field from the learning record.
  - **Learning Object ID**: The `lo_id` field (display "N/A" if null).
  - **Type**: The `type` field (display "N/A" if null).
  - **Duration**: The `duration` field formatted as hours/minutes/seconds (display "N/A" if null).
  - **Count**: The `count` field (display "N/A" if null).
  - **Last Accessed**: The `date_last_accessed` field formatted as date and time (display "N/A" if null).
- Include loading, error, and empty states consistent with `CalendarTable`.
- Display a count message below the table showing the number of records.

### 3. Course Calendar Type Extension

- Extend the `CourseCalendar` type in `src/lib/types.ts` to include:
  - `learningRecords: LearningRecord[]`
  - `learningRecordsLoading: boolean`
  - `learningRecordsError: string | null`
- This allows each course to track its learning records state independently.

### 4. Data Loading Integration

- Update `loadCalendarDataForCourses` in `src/lib/services/calendar.ts` to:
  - Fetch learning records for each course when calendar data is loaded.
  - Populate the `learningRecords`, `learningRecordsLoading`, and `learningRecordsError` fields in each `CourseCalendar` object.
  - Handle errors gracefully, setting `learningRecordsError` if the fetch fails.

### 5. Tab Integration

- Add a new "Learning Records" tab to `CourseTabsView.svelte`.
- Update the `activeTab` type to include `"learning"` as a valid value.
- Display `LearningRecordsTable` in the new tab, passing the learning records data, loading state, and error state from the selected course.
- Update `+page.svelte` to support the new `"learning"` tab type.

### 6. TutorsStore Function (Optional Enhancement)

- Add `getAllLearningRecordsForCourse(courseId: string): Promise<LearningRecord[]>` to `TutorsStore.ts` for consistency with other data access patterns.
- Note: This function was added but the implementation in `calendar.ts` uses direct Supabase queries to avoid circular dependencies.

## Technical Details

### Data Formatting

- **Duration**: Format `duration` (in seconds) as:
  - `"Xh Ym Zs"` if hours > 0
  - `"Ym Zs"` if only minutes > 0
  - `"Zs"` if only seconds
  - `"N/A"` if null

- **Date/Time**: Format `date_last_accessed` as:
  - `"Month Day, Year HH:MM AM/PM"` (e.g., "Jan 15, 2025 02:30 PM")
  - `"N/A"` if null

### Error Handling

- If fetching learning records fails, set `learningRecordsError` with an appropriate error message.
- The table component should display the error in a consistent error card format.
- Calendar data loading should not fail if learning records fail to load (they are independent).

### Component Props

```typescript
interface Props {
  data: LearningRecord[];
  loading: boolean;
  error: string | null;
}
```

## Files Changed

1. **`src/lib/types.ts`**
   - Extended `CourseCalendar` type with learning records fields.

2. **`src/lib/services/calendar.ts`**
   - Updated `loadCalendarDataForCourses` to fetch learning records for each course.
   - Added direct Supabase query for learning records (to avoid circular dependency with `TutorsStore`).

3. **`src/lib/services/TutorsStore.ts`**
   - Added `getAllLearningRecordsForCourse` function (for consistency, though not used in the main implementation).

4. **`src/lib/ui/LearningRecordsTable.svelte`** (new file)
   - New component displaying learning records in a table format.

5. **`src/lib/ui/CourseTabsView.svelte`**
   - Added "Learning Records" tab.
   - Updated props to accept full `CourseCalendar` type.
   - Updated `activeTab` type to include `"learning"`.

6. **`src/routes/+page.svelte`**
   - Updated `activeTab` type to include `"learning"`.

## Success Criteria

- [ ] `LearningRecordsTable.svelte` component exists and displays learning records correctly.
- [ ] `CourseCalendar` type includes learning records fields.
- [ ] Learning records are automatically fetched when courses are loaded.
- [ ] "Learning Records" tab appears in `CourseTabsView` and displays the table.
- [ ] Loading, error, and empty states work correctly.
- [ ] Duration and date/time formatting is consistent and readable.
- [ ] No visual regressions in existing tabs.
- [ ] TypeScript and linter checks pass without new errors.

## Non-Goals

- Filtering learning records by student, type, or date range (future enhancement).
- Aggregating or summarizing learning records (future enhancement).
- Editing or deleting learning records (read-only view).
