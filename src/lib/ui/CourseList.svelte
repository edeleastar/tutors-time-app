<script lang="ts">
  import { createEventDispatcher } from 'svelte';

  interface Props {
    courses: Array<{
      id: string;
      loading: boolean;
      error: string | null;
    }>;
    selectedCourseId: string | null;
    onAddCourses?: () => void;
  }

  type Events = {
    remove: { courseId: string };
  };

  let { courses, selectedCourseId = $bindable(), onAddCourses }: Props = $props();
  const dispatch = createEventDispatcher<Events>();

  function handleRemove(courseId: string, event: Event) {
    event.stopPropagation(); // Prevent triggering the radio selection
    dispatch('remove', { courseId });
  }
</script>

<aside class="w-64 shrink-0 flex flex-col">
  <h2 class="text-lg font-semibold mb-2">Courses</h2>
  <div class="flex-1 min-h-0 border border-surface-300-600 rounded-lg overflow-y-auto bg-surface-50-900 mb-2">
    <div class="divide-y divide-surface-200-700">
      {#each courses as course}
        <label
          class="block p-3 cursor-pointer hover:bg-surface-100-800 transition-colors {selectedCourseId === course.id ? 'bg-primary-500/20 border-l-4 border-primary-500' : ''}"
        >
          <input type="radio" name="course-selection" value={course.id} bind:group={selectedCourseId} class="sr-only" />
          <div class="flex items-center justify-between gap-2">
            <div class="flex items-center gap-2 flex-1 min-w-0">
              <span class="text-sm font-medium truncate {selectedCourseId === course.id ? 'text-primary-500' : 'text-surface-900-50'}">
                {course.id}
              </span>
              {#if course.loading}
                <span class="text-xs text-surface-500 shrink-0">Loading...</span>
              {:else if course.error}
                <span class="text-xs text-error-500 shrink-0">Error</span>
              {/if}
            </div>
            <button
              type="button"
              onclick={(e) => handleRemove(course.id, e)}
              class="btn-icon variant-ghost-error shrink-0 ml-2"
              aria-label="Remove course"
              title="Remove course"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <path d="M3 6h18"></path>
                <path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"></path>
                <path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"></path>
              </svg>
            </button>
          </div>
        </label>
      {/each}
    </div>
  </div>
  {#if onAddCourses}
    <button
      type="button"
      onclick={onAddCourses}
      class="btn variant-filled-secondary w-full"
    >
      Add Courses
    </button>
  {/if}
</aside>
