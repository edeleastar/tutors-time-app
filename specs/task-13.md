# Milestone 13: Course List Enhancements – Button Repositioning, URL Parsing, and Course Removal

## Overview

This milestone enhances the course list functionality with three improvements:

1. **Button Repositioning**: Move the "Add Courses" button from the header to below the Courses Listbox
2. **URL Parsing**: When adding a course, if the input is a URL, extract the last segment (path component) as the course ID
3. **Course Removal**: Add the ability to remove individual courses from the listbox

> **Note:** This document specifies behaviour only. **Do not implement code for this milestone yet.**

## Requirements

### 1. Button Repositioning

- **Current State**: The "Add Courses" button is located in the header (`+page.svelte` line 96), positioned next to the "Calendar Data" title
- **New State**: Move the "Add Courses" button to appear **below** the Courses Listbox component
- **Implementation**:
  - Remove the button from the header section in `+page.svelte`
  - Add the button to `CourseList.svelte` component, positioned below the listbox
  - The button should trigger the same `openChangeCourseDialog()` function (passed as a prop or event)
  - Maintain the same button styling and behavior

### 2. URL Parsing for Course IDs

- **Current Behavior**: `CourseIdDialog` accepts course IDs directly from textarea input
- **New Behavior**: When processing course IDs from the dialog input:
  - **Check if input is a URL**: Detect if a line contains a URL pattern (e.g., starts with `http://`, `https://`, or contains `/`)
  - **Extract last segment**: If URL detected, extract the last path segment after the final `/`
    - Example: `https://example.com/courses/setu-hdip-comp-sci-2025-full-stack-1` → `setu-hdip-comp-sci-2025-full-stack-1`
    - Example: `https://example.com/courses/course-123/` → `course-123` (handle trailing slash)
    - Example: `https://example.com/courses/course-123` → `course-123`
  - **Fallback**: If not a URL, use the input as-is (existing behavior)
- **Implementation**:
  - Add a helper function `extractCourseIdFromInput(input: string): string` in `CourseIdDialog.svelte` or a utility file
  - Apply this function to each line in `handleSubmit()` before processing
  - Handle edge cases:
    - URLs with query parameters: `https://example.com/course?id=123` → extract `course` (last segment before `?`)
    - URLs with fragments: `https://example.com/course#section` → extract `course` (last segment before `#`)
    - Empty segments: `https://example.com/` → use the domain or handle gracefully
    - Multiple slashes: `https://example.com//course` → normalize and extract last segment

### 3. Course Removal Functionality

- **Current State**: Courses can only be added, not removed individually
- **New State**: Each course in the listbox should have a remove/delete button or icon
- **Implementation**:
  - **UI**: Add a remove button/icon next to each course item in `CourseList.svelte`
    - Consider using a trash/delete icon (Skeleton.dev icon or similar)
    - Position: Right side of each course item, or as an icon button
    - Visual: Small icon button that appears on hover or is always visible
  - **Event Handling**: 
    - Emit a `remove` event from `CourseList` with the course ID to remove
    - Handle the event in `+page.svelte` to remove the course from the `courses` array
  - **State Management**:
    - Remove the course from `courses` array
    - If the removed course was selected (`selectedCourseId`), update selection:
      - If other courses remain, select the first course (or maintain selection if possible)
      - If no courses remain, set `selectedCourseId` to `null` and show empty state
  - **Edge Cases**:
    - Prevent removing the last course if it would leave the list empty (optional: show message or disable button)
    - Or allow removing the last course and show the empty state message

## Component Changes

### `CourseList.svelte`

- **Add Props**:
  - `onRemoveCourse?: (courseId: string) => void` or emit `remove` event with course ID
- **Add UI**:
  - "Add Courses" button below the listbox
  - Remove button/icon for each course item
- **Layout**:
  - Ensure button is positioned below the scrollable listbox
  - Maintain flex layout for proper spacing

### `CourseIdDialog.svelte`

- **Add Function**:
  - `extractCourseIdFromInput(input: string): string` — parses URL or returns input as-is
- **Update `handleSubmit()`**:
  - Apply `extractCourseIdFromInput()` to each line before processing
  - Ensure URL parsing works correctly with the existing deduplication logic

### `+page.svelte`

- **Remove**:
  - "Add Courses" button from header (line 96)
- **Add**:
  - Pass `openChangeCourseDialog` function to `CourseList` component (as prop or via event)
  - Handle `remove` event from `CourseList` to remove courses from array
  - Update `selectedCourseId` logic when courses are removed

## Success Criteria

- [ ] "Add Courses" button is positioned below the Courses Listbox (not in header)
- [ ] Button functionality remains the same (opens dialog)
- [ ] URL inputs are correctly parsed to extract course ID from last segment
- [ ] Non-URL inputs continue to work as before
- [ ] Each course in the listbox has a remove button/icon
- [ ] Clicking remove removes the course from the list
- [ ] Selection state is updated correctly when a selected course is removed
- [ ] Empty state is shown when all courses are removed
- [ ] Edge cases (URLs with query params, fragments, trailing slashes) are handled correctly
- [ ] This task remains **specification only**; implementation is deferred to a later milestone.

## Implementation Notes

### URL Parsing Algorithm

```typescript
function extractCourseIdFromInput(input: string): string {
  const trimmed = input.trim();
  
  // Check if it looks like a URL
  if (trimmed.startsWith('http://') || trimmed.startsWith('https://') || trimmed.includes('/')) {
    try {
      // Handle URLs with protocol
      let urlString = trimmed;
      if (!trimmed.startsWith('http://') && !trimmed.startsWith('https://')) {
        urlString = 'https://' + trimmed; // Assume https for relative URLs
      }
      
      const url = new URL(urlString);
      const pathSegments = url.pathname.split('/').filter(segment => segment.length > 0);
      
      if (pathSegments.length > 0) {
        return pathSegments[pathSegments.length - 1];
      }
      
      // Fallback: if no path segments, return hostname or original input
      return url.hostname || trimmed;
    } catch {
      // If URL parsing fails, try simple string split
      const segments = trimmed.split('/').filter(s => s.length > 0);
      if (segments.length > 0) {
        return segments[segments.length - 1].split('?')[0].split('#')[0];
      }
    }
  }
  
  // Not a URL, return as-is
  return trimmed;
}
```

### Remove Button UI Pattern

Consider using Skeleton.dev's icon button pattern:
```svelte
<button 
  type="button" 
  onclick={() => handleRemove(course.id)}
  class="btn-icon variant-ghost-error"
  aria-label="Remove course"
>
  <!-- Trash icon -->
</button>
```

Or a simple text button:
```svelte
<button 
  type="button" 
  onclick={() => handleRemove(course.id)}
  class="text-xs text-error-500 hover:text-error-600"
>
  Remove
</button>
```
