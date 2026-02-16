<script lang="ts">
  import LabsGrid from "$lib/components/labs/LabsGrid.svelte";
  import type { CourseCalendar } from "$lib/types";

  type Mode = "step" | "lab";

  interface Props {
    course: CourseCalendar | null;
    mode: Mode;
  }

  let { course, mode }: Props = $props();

  const title = $derived(mode === "lab" ? "Labs by lab" : "Labs by step");
  const error = $derived(course?.error ?? null);
</script>

<svelte:head>
  <title>{title}</title>
  <meta name="description" content="Course {title.toLowerCase()}" />
</svelte:head>

<section class="p-2 h-[calc(100vh-4rem)]">
  <div class="card p-4 h-full flex flex-col">
    <div class="flex flex-col flex-1 min-h-0">
      {#if !course}
        <div class="flex items-center justify-center flex-1">
          <p class="text-lg">Loading lab data...</p>
        </div>
      {:else if error}
        <div class="card preset-filled-error-500 p-4">
          <p class="font-bold">Error loading lab data</p>
          <p class="text-sm">{error}</p>
        </div>
      {:else if !course.labsModel.hasData}
        <div class="flex items-center justify-center flex-1">
          <p class="text-lg text-surface-600">No lab data found for this course.</p>
        </div>
      {:else}
        <div class="flex-1 min-h-0 flex flex-col">
          <div class="flex-1 min-h-0">
            <LabsGrid model={course.labsModel} {mode} />
          </div>
        </div>
      {/if}
    </div>
  </div>
</section>
