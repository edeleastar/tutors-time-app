# Milestone 12: UI Reorganization – Listbox Course Selection with Tab Views

## Overview

This milestone reorganizes the UI layout to use a **Listbox on the left** for course selection and a **tab view on the right** with three views (Table, Visual, Summary) that display data for the selected course.

Key changes:

- **Left sidebar**: Skeleton.dev Listbox displaying all loaded course IDs
- **Right content area**: Tab view with three tabs ("Table", "Visual", "Summary") showing data for the course selected in the listbox
- **Course selection**: Selecting a course ID in the listbox updates all three tabs to show that course's data
- **Simplified navigation**: Single set of tabs instead of per-course tabs

## Requirements

### Layout Structure

- **Two-column layout**: Left sidebar (Listbox) + Right content area (Tabs)
- **Left sidebar**:
  - Fixed width (e.g., 250-300px)
  - Contains Listbox component showing course IDs
  - "Add Courses" button to open the dialog
  - Full height (fills available viewport height)
- **Right content area**:
  - Flexible width (takes remaining space)
  - Contains Tabs component with three tabs: "Table", "Visual", "Summary"
  - Each tab shows the corresponding view component for the selected course
  - Full height (fills available viewport height)

### State Management

- **Keep existing**:
  - `courses: CourseViewState[]` — array of all loaded courses
  - `dialogOpen`, `dialogLoading`, `dialogError` — dialog state
- **Add new**:
  - `selectedCourseId: string | null` — the course ID selected in the listbox
  - `activeTab: 'table' | 'visual' | 'summary' | null` — which tab is active (replaces current tab value system)
- **Remove**:
  - `makeTabValue` function (no longer needed)
  - Per-course tab system

### Listbox Component

- **Import**: `Listbox` and `ListboxItem` from `@skeletonlabs/skeleton-svelte`
- **Data source**: `courses.map(c => c.id)` — list of course IDs
- **Selection**: Bind to `selectedCourseId` using `bind:group` pattern (Skeleton.dev Listbox uses radio inputs by default)
- **Display**: Show course ID as text in each list item
- **Initial selection**: After loading courses, set `selectedCourseId` to the first course ID
- **Empty state**: If no courses loaded, show message "No courses loaded" or disable listbox

### Tab Component Changes

- **Tab labels**: Change from `{course.id} (t)` to just `"Table"`, `"Visual"`, `"Summary"`
- **Tab values**: Use simple strings: `"table"`, `"visual"`, `"summary"`
- **Tab content**: Each tab shows the corresponding component (`CalendarTable`, `CalendarGrid`, `CourseSummaryGrid`) for the `selectedCourseId`
- **Data binding**: Pass `course.data` where `course.id === selectedCourseId` (or show loading/error state if course not found)

### Course Loading Flow

- **Dialog**: Keep `CourseIdDialog` for loading courses
- **After load**: 
  - Add courses to `courses` array (existing behavior)
  - Set `selectedCourseId` to first loaded course ID
  - Set `activeTab` to `'table'` (default view)
  - Close dialog
- **Add more courses**: "Add Courses" button in sidebar opens dialog; new courses are added to listbox

### Empty States

- **No courses loaded**: 
  - Listbox shows empty state or is disabled
  - Right side shows message "Please load courses to view data"
  - Dialog opens on page load (existing behavior)
- **Course selected but no data**: Show loading/error state in the active tab

### Header Changes

- Remove the course ID display from header (now shown in listbox)
- Keep "Add Courses" button in sidebar or header
- Simplify header to just show title

## Success Criteria

- [ ] Listbox component displays on the left showing all loaded course IDs
- [ ] Selecting a course in the listbox updates all three tabs to show that course's data
- [ ] Tab view on the right has three tabs: "Table", "Visual", "Summary"
- [ ] Each tab shows the correct component (CalendarTable, CalendarGrid, CourseSummaryGrid) for the selected course
- [ ] After loading courses, the first course is automatically selected
- [ ] Layout is two-column: Listbox left, Tabs right
- [ ] Both columns fill available viewport height
- [ ] Dialog still works for loading courses
- [ ] Empty states handled (no courses, no selection, loading, errors)
- [ ] CourseIdDialog can still be opened to add more courses
- [ ] Existing functionality preserved (date filtering, data loading, error handling)

## Implementation Notes

### Listbox Implementation Pattern

Based on Skeleton.dev documentation, Listbox uses `bind:group` pattern:

```svelte
<Listbox>
  {#each courses as course}
    <ListboxItem value={course.id} bind:group={selectedCourseId}>
      {course.id}
    </ListboxItem>
  {/each}
</Listbox>
```

### Tab Implementation

```svelte
<Tabs value={activeTab ?? 'table'} onValueChange={(d) => activeTab = d.value}>
  <Tabs.List>
    <Tabs.Trigger value="table">Table</Tabs.Trigger>
    <Tabs.Trigger value="visual">Visual</Tabs.Trigger>
    <Tabs.Trigger value="summary">Summary</Tabs.Trigger>
  </Tabs.List>
  <Tabs.Content value="table">
    {#if selectedCourse}
      <CalendarTable data={selectedCourse.data} loading={selectedCourse.loading} error={selectedCourse.error} />
    {:else}
      <div>No course selected</div>
    {/if}
  </Tabs.Content>
  <!-- Similar for visual and summary -->
</Tabs>
```

### Helper Derived State

Add a derived state to find the selected course:

```svelte
const selectedCourse = $derived(
  courses.find(c => c.id === selectedCourseId) ?? null
);
```

### Layout CSS

The two-column layout can use Tailwind flex classes:

```svelte
<div class="flex h-full gap-4">
  <aside class="w-64 shrink-0">...</aside>
  <main class="flex-1 min-w-0">...</main>
</div>
```
