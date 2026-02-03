# Milestone 4: Component Refactoring

## Overview

This document contains the detailed task breakdown for Milestone 4 of the Tutors Time application. This milestone focuses on refactoring the application to improve code organization and reusability by extracting UI components into separate, reusable modules.

**Milestone Goal**: Refactor the main page component by extracting the Dialog and Table components (including filters) into separate, reusable components located in `lib/ui`.

## Tasks

### Refactoring

#### REFACT-001: Extract Course ID Dialog Component
- **Status**: [ ] Not Started / [ ] In Progress / [ ] Completed
- **Priority**: High
- **Assignee**: [Name]
- **Description**: Extract the Course ID selection dialog from `+page.svelte` into a separate, reusable component located in `lib/ui/CourseIdDialog.svelte`. This component should handle all dialog-related logic including opening/closing, input handling, validation, and submission.
- **Acceptance Criteria**:
  - [ ] New component file created at `src/lib/ui/CourseIdDialog.svelte`
  - [ ] Dialog markup and styling extracted from `+page.svelte`
  - [ ] Component accepts props for:
    - [ ] `open` (boolean) - controls dialog visibility
    - [ ] `courseId` (string | null) - current course ID value for pre-filling input
    - [ ] `loading` (boolean) - loading state
    - [ ] `error` (string | null) - error message to display
  - [ ] Component emits events:
    - [ ] `submit` - when user submits course ID with the entered value
    - [ ] `close` - when dialog is closed (with validation to prevent closing if no course ID)
  - [ ] Component handles:
    - [ ] Input binding and validation
    - [ ] Enter key submission
    - [ ] Dialog show/hide logic via `showModal()` and `close()`
    - [ ] Centered and middle-aligned positioning
  - [ ] Component uses Svelte 5 runes (`$props()`, `$state()`, `$effect()`)
  - [ ] All existing functionality preserved after refactoring
  - [ ] `+page.svelte` updated to use the new component
  - [ ] No visual or functional regressions
- **Dependencies**: FEAT-001 (from Milestone 3)
- **Estimated Effort**: [Hours/Days]

#### REFACT-002: Extract Calendar Table Component with Filters
- **Status**: [ ] Not Started / [ ] In Progress / [ ] Completed
- **Priority**: High
- **Assignee**: [Name]
- **Description**: Extract the calendar data table and filtering UI from `+page.svelte` into a separate, reusable component located in `lib/ui/CalendarTable.svelte`. This component should handle table rendering, filtering logic, formatting, and empty state display.
- **Acceptance Criteria**:
  - [ ] New component file created at `src/lib/ui/CalendarTable.svelte`
  - [ ] Table markup and styling extracted from `+page.svelte`
  - [ ] Filter UI (Student ID dropdown, Start Date, End Date, Clear button) extracted from `+page.svelte`
  - [ ] Filter logic (filtering state and `filteredData` derivation) moved into component
  - [ ] Component accepts props for:
    - [ ] `data` (CalendarEntry[]) - array of calendar entries to display and filter
    - [ ] `loading` (boolean) - loading state
    - [ ] `error` (string | null) - error message to display
  - [ ] Component includes:
    - [ ] Filter UI with Student ID dropdown, Start Date, End Date inputs, and Clear button
    - [ ] Filter state management (`selectedStudentId`, `startDate`, `endDate`)
    - [ ] Derived `distinctStudentIds` from data
    - [ ] Derived `filteredData` based on active filters
    - [ ] `clearFilters()` function to reset all filters
    - [ ] Table headers: Date, Student ID, Course ID, Time Active, Page Loads
    - [ ] Date formatting function (`formatDate`)
    - [ ] Time formatting function (`formatTime`)
    - [ ] Empty state message when `filteredData.length === 0`
    - [ ] Entry count display: "Showing X of Y calendar entries"
    - [ ] Responsive table wrapper with `overflow-x-auto`
    - [ ] Responsive filter grid layout (`grid-cols-1 md:grid-cols-3`)
  - [ ] Component uses Svelte 5 runes (`$props()`, `$state()`, `$derived()`)
  - [ ] Formatting functions are internal to the component or imported from a utility module
  - [ ] All existing functionality preserved after refactoring
  - [ ] `+page.svelte` updated to use the new component (simplified, no filter logic)
  - [ ] No visual or functional regressions
- **Dependencies**: FEAT-001 (from Milestone 2), FEAT-002 (from Milestone 3)
- **Estimated Effort**: [Hours/Days]

### Testing

#### TEST-004: E2E Tests for Refactored Components
- **Status**: [ ] Not Started / [ ] In Progress / [ ] Completed
- **Priority**: Medium
- **Assignee**: [Name]
- **Description**: Verify that all existing E2E tests continue to pass after component refactoring. Ensure component extraction doesn't break any existing functionality.
- **Acceptance Criteria**:
  - [ ] All existing E2E tests pass without modification
  - [ ] Dialog component works correctly in E2E tests
  - [ ] Table component displays data correctly in E2E tests
  - [ ] No test selectors need to be updated (components maintain same DOM structure)
  - [ ] All filtering functionality continues to work
  - [ ] Course ID selection dialog continues to work
- **Dependencies**: REFACT-001, REFACT-002, TEST-003 (from Milestone 3)
- **Estimated Effort**: [Hours/Days]

## Task Summary

### By Status
- **Not Started**: [Count]
- **In Progress**: [Count]
- **Completed**: [Count]

### By Priority
- **High**: [Count]
- **Medium**: [Count]
- **Low**: [Count]

### Estimated Total Effort
- **Total**: [Hours/Days]

## Success Criteria

- [ ] Course ID Dialog component extracted to `lib/ui/CourseIdDialog.svelte`
- [ ] Calendar Table component extracted to `lib/ui/CalendarTable.svelte` with filters included
- [ ] Filter UI and logic moved into CalendarTable component
- [ ] Both components use Svelte 5 runes
- [ ] Components are properly typed with TypeScript
- [ ] Components accept props and emit events as specified
- [ ] `+page.svelte` is simplified and uses the extracted components (no filter logic)
- [ ] All existing functionality preserved
- [ ] All E2E tests pass without modification
- [ ] Code is more maintainable and reusable
- [ ] No visual or functional regressions

## Component Structure

After refactoring, the component structure should be:

```
src/
├── lib/
│   ├── ui/
│   │   ├── CourseIdDialog.svelte    # Course ID selection dialog component
│   │   └── CalendarTable.svelte     # Calendar data table component
│   ├── services/
│   │   └── calendar.ts              # Calendar data service
│   ├── supabase.ts                  # Supabase client
│   └── types.ts                     # TypeScript types
└── routes/
    └── +page.svelte                 # Main page (simplified after refactoring)
```

## Notes

- Components should follow Svelte 5 conventions (runes, `$props()`, `$state()`, `$derived()`, `$effect()`)
- Components should be properly typed with TypeScript
- Components should maintain the same styling and behavior as before refactoring
- Consider extracting formatting functions (`formatDate`, `formatTime`) to a utility module if they're used elsewhere
- Ensure components are self-contained and don't create unnecessary dependencies
