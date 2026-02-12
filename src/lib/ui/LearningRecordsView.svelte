<script lang="ts">
  import LearningRecordsTable from "$lib/ui/LearningRecordsTable.svelte";
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
      error = course.learningRecordsError;
    } catch (e) {
      error = e instanceof Error ? e.message : "Failed to load learning records";
    } finally {
      loading = false;
    }
  });
</script>

<LearningRecordsTable
  data={course?.learningRecords ?? []}
  loading={loading}
  error={course ? course.learningRecordsError : error}
/>
