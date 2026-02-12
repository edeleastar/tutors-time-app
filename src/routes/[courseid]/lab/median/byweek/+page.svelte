<script lang="ts">
  import LabsMedianComponent from "$lib/components/labs/LabsMedianComponent.svelte";
  import { page } from "$app/stores";

  const courseId = $derived(($page.params.courseid as string) ?? "");
</script>

{#key courseId}
  <LabsMedianComponent courseId={courseId} mode="week" />
{/key}
