<script lang="ts">
  import { Tabs } from "@skeletonlabs/skeleton-svelte";
  import CalendarTable from "$lib/ui/CalendarTable.svelte";
  import CalendarGrid from "$lib/ui/CalendarGrid.svelte";
  import CourseSummaryGrid from "$lib/ui/CourseSummaryGrid.svelte";
  import type { CalendarEntry } from "$lib/types";

  interface Props {
    selectedCourse: {
      data: CalendarEntry[];
      loading: boolean;
      error: string | null;
    } | null;
    activeTab: "raw" | "calendar" | "summary" | null;
  }

  let { selectedCourse, activeTab = $bindable() }: Props = $props();
</script>

<main class="flex-1 min-w-0 flex flex-col">
  {#if selectedCourse}
    <Tabs value={activeTab ?? "calendar"} onValueChange={(details) => (activeTab = details.value as "raw" | "calendar" | "summary")} class="flex-1 flex flex-col min-h-0">
      <Tabs.List class="shrink-0">
        <Tabs.Trigger value="calendar">Calendar</Tabs.Trigger>
        <Tabs.Trigger value="summary">Summary</Tabs.Trigger>
        <Tabs.Trigger value="raw">Raw</Tabs.Trigger>
        <Tabs.Indicator />
      </Tabs.List>
      <Tabs.Content value="calendar" class="flex-1 min-h-0">
        <div class="visual-tab-viewport h-full">
          <CalendarGrid data={selectedCourse.data} loading={selectedCourse.loading} error={selectedCourse.error} />
        </div>
      </Tabs.Content>
      <Tabs.Content value="summary" class="flex-1 min-h-0">
        <div class="summary-tab-viewport h-full">
          <CourseSummaryGrid data={selectedCourse.data} loading={selectedCourse.loading} error={selectedCourse.error} />
        </div>
      </Tabs.Content>
      <Tabs.Content value="raw" class="flex-1 min-h-0">
        <CalendarTable data={selectedCourse.data} loading={selectedCourse.loading} error={selectedCourse.error} />
      </Tabs.Content>
    </Tabs>
  {:else}
    <div class="flex items-center justify-center flex-1">
      <p class="text-lg text-surface-600">Please select a course from the list</p>
    </div>
  {/if}
</main>
