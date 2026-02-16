<script lang="ts">
  import LabsComponent from "$lib/components/labs/LabsComponent.svelte";
  import type { CourseCalendar } from "$lib/types";

  interface Props {
    data: { course: CourseCalendar | null };
  }

  let { data }: Props = $props();
</script>

<LabsComponent course={data.course} mode="lab" />
