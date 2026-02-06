# Task 17: Labs Grid

## Overview

This task introduces a new AG Grid component (`LabsGrid`) that displays lab learning records in a pivoted format similar to `CalendarGrid`. The grid shows each student as a row and each lab (learning object ID) as a column, with duration values aggregated and displayed in minutes.

## Requirements

### 1. Data Structure and Aggregation

- Use existing `learningRecords` from `CourseCalendar` (already filtered by `type="lab"`).
- Aggregate duration by `student_id` and `lo_id`:
  - Sum all `duration` values for each unique `(student_id, lo_id)` combination.
  - Handle null `lo_id` values by filtering them out (exclude from grid).
- Convert duration from 30-second blocks to minutes for display (same conversion as `LearningRecordsTable`).

### 2. Labs Grid Component

- Create new component `src/lib/ui/LabsGrid.svelte` similar in structure to `CalendarGrid.svelte`.
- Use AG Grid Community Edition with the same module registration pattern.
- Grid structure:
  - **Rows**: One row per unique `student_id`.
  - **Columns**:
    - **Student ID** (pinned left, similar to CalendarGrid).
    - **Total** column showing sum of all lab durations for that student.
    - **One column per unique `lo_id`** (lab), showing aggregated duration in minutes.
- Column styling:
  - Use similar styling to `CalendarGrid` (right-aligned, reduced padding, color coding).
  - Apply color coding based on duration minutes (reuse `cellColorForMinutes` from `calendarUtils.ts`).
  - Column width: 48px for lab columns, 60px for Total column (matching time columns in CalendarGrid).
- Display duration values as integers (minutes only, no "m" suffix).

### 3. Utility Functions

- Add to `src/lib/services/calendarUtils.ts`:
  - `getDistinctLabs(records: LearningRecord[]): string[]` - Extract unique `lo_id` values, sorted, excluding null values.
  - `buildLabsPivotedRows(records: LearningRecord[]): LabsPivotedRow[]` - Build pivoted data structure:
    ```typescript
    type LabsPivotedRow = {
      studentid: string;
      totalMinutes: number;
      [lo_id: string]: string | number; // Dynamic columns for each lab
    };
    ```
  - `buildLabColumns<T>(labIds: string[]): ColDef<T>[]` - Build column definitions for lab columns.
  - `buildTotalMinutesColumn<T>(field?: string, headerName?: string): ColDef<T>` - Build Total column definition.

### 4. Tab Integration

- Add new "Labs" tab to `CourseTabsView.svelte`.
- Update the `activeTab` type to include `"labs"` as a valid value.
- Display `LabsGrid` in the new tab, passing `learningRecords` data, loading state, and error state from the selected course.
- Update `+page.svelte` to support the new `"labs"` tab type.

### 5. Data Handling

- Filter `learningRecords` to only include records where `type === "lab"` (already done in data loading).
- Handle null `lo_id` values gracefully by excluding them from the grid (filtered out in `buildLabsPivotedRows`).
- Aggregate multiple records for the same `(student_id, lo_id)` by summing `duration` values.
- Convert aggregated duration (30-second blocks) to minutes: `Math.round((blocks * 30) / 60)`.

## Technical Details

### Data Aggregation Logic

The `buildLabsPivotedRows` function:
1. Filters out records with null `lo_id` values.
2. Extracts unique `student_id` and `lo_id` values from valid records.
3. Creates a Map to aggregate duration by `(student_id, lo_id)` key.
4. Sums duration values for each `(student_id, lo_id)` pair.
5. Builds rows: one per `student_id`.
6. For each row, populates columns: `studentid`, `totalMinutes`, and one column per `lo_id`.
7. Calculates `totalMinutes` as sum of all lab durations for that student.

### Column Definitions

- **Student ID column**: Similar to CalendarGrid, pinned left, with reduced padding (4px).
- **Total column**: Uses `buildTotalMinutesColumn` helper with:
  - `valueFormatter` to convert 30-second blocks to minutes.
  - `cellStyle` with color coding via `cellColorForMinutes`.
  - Right-aligned, reduced padding.
  - Width: 60px, maxWidth: 72px.
- **Lab columns**: Uses `buildLabColumns` helper with:
  - `valueFormatter` to convert 30-second blocks to minutes.
  - `cellStyle` with color coding via `cellColorForMinutes`.
  - Right-aligned, center text-align, reduced padding (4px).
  - Width: 48px, maxWidth: 72px.

### Component Props

```typescript
interface Props {
  data: LearningRecord[];
  loading: boolean;
  error: string | null;
}
```

### Duration Conversion

- Duration values in `learning_records` table are stored as counts of 30-second blocks.
- Conversion formula: `minutes = Math.round((blocks * 30) / 60)`.
- Displayed as integer minutes (e.g., "45", "120").

## Files Changed

1. **`src/lib/services/calendarUtils.ts`**
   - Added `LabsPivotedRow` type export.
   - Added `getDistinctLabs` function.
   - Added `buildLabsPivotedRows` function.
   - Added `buildLabColumns` function.
   - Added `buildTotalMinutesColumn` function.
   - Imported `LearningRecord` type.

2. **`src/lib/ui/LabsGrid.svelte`** (new file)
   - New AG Grid component displaying lab duration data in pivoted format.
   - Uses AG Grid Community Edition with module registration.
   - Implements loading, error, and empty states.
   - Displays students as rows and labs as columns.

3. **`src/lib/ui/CourseTabsView.svelte`**
   - Added "Labs" tab trigger.
   - Added `Tabs.Content` for labs tab.
   - Updated `activeTab` type to include `"labs"`.
   - Imported `LabsGrid` component.

4. **`src/routes/+page.svelte`**
   - Updated `activeTab` type to include `"labs"`.

## Success Criteria

- [x] `LabsGrid.svelte` component exists and displays lab data correctly.
- [x] Grid shows one row per student with columns for each lab.
- [x] Duration values are aggregated correctly (summed for same student+lab).
- [x] Duration is displayed in minutes (converted from 30-second blocks).
- [x] Total column shows sum of all lab durations per student.
- [x] Color coding is applied based on duration minutes.
- [x] "Labs" tab appears in `CourseTabsView` and displays the grid.
- [x] Loading, error, and empty states work correctly.
- [x] Grid styling matches CalendarGrid (padding, alignment, column widths).
- [x] No visual regressions in existing tabs.
- [x] TypeScript and linter checks pass without new errors.

## Non-Goals

- View mode toggle (week/day) - not applicable to labs.
- Date-based filtering - labs grid shows all-time totals.
- Sorting by lab name or other metadata - basic sorting only.
- Lab name lookup/display - show `lo_id` as-is.
- Handling records with null `lo_id` - these are excluded from the grid.
