<script lang="ts">
  import LabsComponent from "$lib/components/labs/LabsComponent.svelte";
  import { page } from "$app/stores";

  const courseId = $derived(($page.params.courseid as string) ?? "");
</script>

{#key courseId}
  <LabsComponent courseId={courseId} mode="step" />
{/key}
