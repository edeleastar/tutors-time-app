<script lang="ts">
  import { AppBar, Tabs } from "@skeletonlabs/skeleton-svelte";
  import CourseIdDialog from "$lib/ui/CourseIdDialog.svelte";
  import CalendarTable from "$lib/ui/CalendarTable.svelte";
  import CalendarGrid from "$lib/ui/CalendarGrid.svelte";
  import CourseSummaryGrid from "$lib/ui/CourseSummaryGrid.svelte";
  import { getCalendarData } from "$lib/services/calendar";
  import type { PageData } from "./$types";
  import type { CalendarEntry } from "$lib/types";

  let { data }: { data: PageData } = $props();

  type CourseViewState = {
    id: string;
    data: CalendarEntry[];
    loading: boolean;
    error: string | null;
  };

  // Selected courses and dialog state
  let courses = $state<CourseViewState[]>([]);
  let primaryCourseId = $state<string | null>(null); // used to seed dialog when single-course
  let dialogOpen = $state(true); // Open dialog on page load

  // Dialog-level state (validation + "any loading" flag)
  let dialogLoading = $state(false);
  let dialogError = $state<string | null>(null);

  // Course selection and tab state
  let selectedCourseId = $state<string | null>(null);
  let activeTab = $state<"table" | "visual" | "summary" | null>(null);

  // Derived: find the selected course
  const selectedCourse = $derived(courses.find((c) => c.id === selectedCourseId) ?? null);

  function filterByDateRange(entries: CalendarEntry[], startDate: string | null, endDate: string | null): CalendarEntry[] {
    if (!startDate && !endDate) {
      return entries;
    }

    return entries.filter((entry) => {
      const entryDate = entry.id;
      if (startDate && entryDate < startDate) {
        return false;
      }
      if (endDate && entryDate > endDate) {
        return false;
      }
      return true;
    });
  }

  async function loadCalendarDataForCourses(courseIds: string[], startDate: string | null, endDate: string | null) {
    const uniqueIds = Array.from(new Set(courseIds.map((id) => id.trim()).filter(Boolean)));

    if (uniqueIds.length === 0) {
      dialogError = "At least one course ID is required";
      return;
    }

    dialogError = null;
    dialogLoading = true;

    // Initialise per-course state
    courses = uniqueIds.map((id) => ({
      id,
      data: [],
      loading: true,
      error: null
    }));

    // Track "primary" course only when a single course is selected
    primaryCourseId = uniqueIds.length === 1 ? uniqueIds[0] : null;

    // Set initial selected course and tab
    selectedCourseId = uniqueIds[0];
    activeTab = "table";

    dialogOpen = false;

    for (const id of uniqueIds) {
      try {
        const rawData = await getCalendarData(id);
        const filteredData = filterByDateRange(rawData, startDate, endDate);
        courses = courses.map((c) => (c.id === id ? { ...c, data: filteredData, loading: false, error: null } : c));
      } catch (e) {
        const msg = e instanceof Error ? e.message : "Failed to load calendar data";
        courses = courses.map((c) => (c.id === id ? { ...c, data: [], loading: false, error: msg } : c));
      }
    }

    dialogLoading = false;
  }

  function handleCourseIdSubmit(
    event: CustomEvent<{
      courseIds: string[];
      startDate: string | null;
      endDate: string | null;
    }>
  ) {
    loadCalendarDataForCourses(event.detail.courseIds, event.detail.startDate, event.detail.endDate);
  }

  function openChangeCourseDialog() {
    dialogOpen = true;
  }

  function handleDialogClose() {
    // Dialog close is handled by the component - prevent closing if no courses selected
    if (!courses.length) {
      dialogOpen = true;
    }
  }

  function handleDialogOpen(event: CustomEvent<{ open: boolean }>) {
    dialogOpen = event.detail.open;
  }
</script>

<svelte:head>
  <title>Tutors Time</title>
  <meta name="description" content="Calendar visualization for student course time tracking" />
</svelte:head>

<CourseIdDialog
  open={dialogOpen}
  courseId={primaryCourseId}
  loading={dialogLoading}
  error={dialogError}
  on:submit={handleCourseIdSubmit}
  on:close={handleDialogClose}
  on:open={handleDialogOpen}
/>

<section class="p-2 h-[calc(100vh-4rem)]">
  <div class="card p-4 h-full flex flex-col">
    <div class="flex justify-between items-center mb-4 shrink-0">
      <h1 class="text-3xl font-bold">Calendar Data</h1>
      <button type="button" onclick={openChangeCourseDialog} class="btn variant-filled-secondary"> Add Courses </button>
    </div>

    {#if courses.length === 0}
      <div class="flex items-center justify-center flex-1">
        <p class="text-lg text-surface-600">Please select one or more course IDs to view calendar data</p>
      </div>
    {:else}
      <div class="flex gap-4 flex-1 min-h-0">
        <!-- Left sidebar: Course List -->
        <aside class="w-64 shrink-0 flex flex-col">
          <h2 class="text-lg font-semibold mb-2">Courses</h2>
          <div class="flex-1 min-h-0 border border-surface-300-600 rounded-lg overflow-y-auto bg-surface-50-900">
            <div class="divide-y divide-surface-200-700">
              {#each courses as course}
                <label
                  class="block p-3 cursor-pointer hover:bg-surface-100-800 transition-colors {selectedCourseId === course.id
                    ? 'bg-primary-500/20 border-l-4 border-primary-500'
                    : ''}"
                >
                  <input type="radio" name="course-selection" value={course.id} bind:group={selectedCourseId} class="sr-only" />
                  <div class="flex items-center gap-2">
                    <span class="text-sm font-medium {selectedCourseId === course.id ? 'text-primary-500' : 'text-surface-900-50'}">
                      {course.id}
                    </span>
                    {#if course.loading}
                      <span class="text-xs text-surface-500">Loading...</span>
                    {:else if course.error}
                      <span class="text-xs text-error-500">Error</span>
                    {/if}
                  </div>
                </label>
              {/each}
            </div>
          </div>
        </aside>

        <!-- Right content: Tabs -->
        <main class="flex-1 min-w-0 flex flex-col">
          {#if selectedCourseId}
            <Tabs value={activeTab ?? "table"} onValueChange={(details) => (activeTab = details.value as "table" | "visual" | "summary")} class="flex-1 flex flex-col min-h-0">
              <Tabs.List class="shrink-0">
                <Tabs.Trigger value="table">Table</Tabs.Trigger>
                <Tabs.Trigger value="visual">Visual</Tabs.Trigger>
                <Tabs.Trigger value="summary">Summary</Tabs.Trigger>
                <Tabs.Indicator />
              </Tabs.List>
              <Tabs.Content value="table" class="flex-1 min-h-0">
                {#if selectedCourse}
                  <CalendarTable data={selectedCourse.data} loading={selectedCourse.loading} error={selectedCourse.error} />
                {:else}
                  <div class="flex items-center justify-center p-8">
                    <p class="text-lg text-surface-600">No course selected</p>
                  </div>
                {/if}
              </Tabs.Content>
              <Tabs.Content value="visual" class="flex-1 min-h-0">
                {#if selectedCourse}
                  <div class="visual-tab-viewport h-full">
                    <CalendarGrid data={selectedCourse.data} loading={selectedCourse.loading} error={selectedCourse.error} />
                  </div>
                {:else}
                  <div class="flex items-center justify-center p-8">
                    <p class="text-lg text-surface-600">No course selected</p>
                  </div>
                {/if}
              </Tabs.Content>
              <Tabs.Content value="summary" class="flex-1 min-h-0">
                {#if selectedCourse}
                  <div class="summary-tab-viewport h-full">
                    <CourseSummaryGrid data={selectedCourse.data} loading={selectedCourse.loading} error={selectedCourse.error} />
                  </div>
                {:else}
                  <div class="flex items-center justify-center p-8">
                    <p class="text-lg text-surface-600">No course selected</p>
                  </div>
                {/if}
              </Tabs.Content>
            </Tabs>
          {:else}
            <div class="flex items-center justify-center flex-1">
              <p class="text-lg text-surface-600">Please select a course from the list</p>
            </div>
          {/if}
        </main>
      </div>
    {/if}
  </div>
</section>
