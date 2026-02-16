<script lang="ts">
  import LabsMedianComponent from "$lib/components/labs/LabsMedianComponent.svelte";
  import type { CourseCalendar } from "$lib/types";

  interface Props {
    data: { course: CourseCalendar | null };
  }

  let { data }: Props = $props();
</script>

<LabsMedianComponent course={data.course} mode="week" />
