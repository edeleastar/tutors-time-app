<script lang="ts">
  import LabsMedianGrid from "$lib/components/labs/LabsMedianGrid.svelte";
  import type { CourseCalendar } from "$lib/types";

  interface Props {
    data: { course: CourseCalendar | null };
  }

  let { data }: Props = $props();
</script>

<LabsMedianGrid course={data.course} mode="day" />
