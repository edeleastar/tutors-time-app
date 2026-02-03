# Milestone 3: Filtering Functionality

## Overview

This document contains the detailed task breakdown for Milestone 3 of the Tutors Time application. **Note: This is a read-only application for visualizing calendar data - no data modification capabilities are required.**

**Milestone Goal**: Be able to filter the table by studentid, courseid and date.

## Tasks

### Features

#### FEAT-002: Student ID Filter
- **Status**: [ ] Not Started / [ ] In Progress / [ ] Completed
- **Priority**: High
- **Assignee**: [Name]
- **Description**: Implement filter by studentid using Skeleton.dev Listbox/Combobox component
- **Acceptance Criteria**:
  - [ ] Student filter component implemented using Skeleton.dev
  - [ ] Filter dropdown populates with distinct studentids from data
  - [ ] Selecting a studentid filters the table
  - [ ] "All students" option available
  - [ ] Table updates reactively when filter changes
- **Dependencies**: FEAT-001 (from Milestone 2), API-001 (from Milestone 2)
- **Estimated Effort**: [Hours/Days]

#### FEAT-003: Course ID Filter
- **Status**: [ ] Not Started / [ ] In Progress / [ ] Completed
- **Priority**: High
- **Assignee**: [Name]
- **Description**: Implement filter by courseid using Skeleton.dev Listbox/Combobox component
- **Acceptance Criteria**:
  - [ ] Course filter component implemented using Skeleton.dev
  - [ ] Filter dropdown populates with distinct courseids from data
  - [ ] Selecting courseid(s) filters the table
  - [ ] Multi-select course filtering supported (if applicable)
  - [ ] Table updates reactively when filter changes
- **Dependencies**: FEAT-001 (from Milestone 2), API-001 (from Milestone 2)
- **Estimated Effort**: [Hours/Days]

#### FEAT-004: Date Filter
- **Status**: [ ] Not Started / [ ] In Progress / [ ] Completed
- **Priority**: High
- **Assignee**: [Name]
- **Description**: Implement filter by date (date range) using Skeleton.dev Date Picker component
- **Acceptance Criteria**:
  - [ ] Date filter component implemented using Skeleton.dev Date Picker
  - [ ] Date range selection works (start date and end date)
  - [ ] Filtering by date range filters the table
  - [ ] Table updates reactively when date range changes
  - [ ] Invalid date ranges handled gracefully
- **Dependencies**: FEAT-001 (from Milestone 2), API-001 (from Milestone 2)
- **Estimated Effort**: [Hours/Days]

#### FEAT-005: Combined Filtering
- **Status**: [ ] Not Started / [ ] In Progress / [ ] Completed
- **Priority**: High
- **Assignee**: [Name]
- **Description**: Ensure all filters work together (studentid + courseid + date)
- **Acceptance Criteria**:
  - [ ] All three filters work independently
  - [ ] All three filters work in combination
  - [ ] Table updates correctly when any filter changes
  - [ ] Filter state persists during navigation
  - [ ] Clearing filters resets to show all data
- **Dependencies**: FEAT-002, FEAT-003, FEAT-004
- **Estimated Effort**: [Hours/Days]

### Testing

#### TEST-003: E2E Tests for Filtering
- **Status**: [ ] Not Started / [ ] In Progress / [ ] Completed
- **Priority**: High
- **Assignee**: [Name]
- **Description**: Create Playwright e2e tests for filtering functionality
- **Acceptance Criteria**:
  - [ ] Test: Student filter filters table correctly
  - [ ] Test: Course filter filters table correctly
  - [ ] Test: Date filter filters table correctly
  - [ ] Test: Combined filters work together
  - [ ] Test: Filter state persists
  - [ ] Test: Clearing filters resets table
- **Dependencies**: FEAT-005, TEST-002 (from Milestone 2)
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

- [ ] All three filters (studentid, courseid, date) functional
- [ ] Filters work independently
- [ ] Filters work in combination
- [ ] Table updates correctly when filters change
- [ ] E2E tests verify filtering works correctly
