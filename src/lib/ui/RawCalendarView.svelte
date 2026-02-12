<script lang="ts">
  import CalendarTable from "$lib/ui/CalendarTable.svelte";
  import { CourseTime } from "$lib/services/CourseTime";
  import type { CourseCalendar } from "$lib/types";
  import { onMount } from "svelte";

  let { courseId }: { courseId: string } = $props();

  let course = $state<CourseCalendar | null>(null);
  let loading = $state(true);
  let error = $state<string | null>(null);

  onMount(async () => {
    const id = courseId.trim();
    if (!id) {
      error = "Course ID is required.";
      loading = false;
      return;
    }
    try {
      course = await CourseTime.loadCalendar(id, null, null);
      error = course.error;
    } catch (e) {
      error = e instanceof Error ? e.message : "Failed to load calendar data";
    } finally {
      loading = false;
    }
  });
</script>

<CalendarTable
  data={course?.data ?? []}
  loading={loading}
  error={error}
/>
