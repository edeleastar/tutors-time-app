<script lang="ts">
  interface Props {
    courses: Array<{
      id: string;
      loading: boolean;
      error: string | null;
    }>;
    selectedCourseId: string | null;
  }

  let { courses, selectedCourseId = $bindable() }: Props = $props();
</script>

<aside class="w-64 shrink-0 flex flex-col">
  <h2 class="text-lg font-semibold mb-2">Courses</h2>
  <div class="flex-1 min-h-0 border border-surface-300-600 rounded-lg overflow-y-auto bg-surface-50-900">
    <div class="divide-y divide-surface-200-700">
      {#each courses as course}
        <label
          class="block p-3 cursor-pointer hover:bg-surface-100-800 transition-colors {selectedCourseId === course.id ? 'bg-primary-500/20 border-l-4 border-primary-500' : ''}"
        >
          <input type="radio" name="course-selection" value={course.id} bind:group={selectedCourseId} class="sr-only" />
          <div class="flex items-center gap-2">
            <span class="text-sm font-medium {selectedCourseId === course.id ? 'text-primary-500' : 'text-surface-900-50'}">
              {course.id}
            </span>
            {#if course.loading}
              <span class="text-xs text-surface-500">Loading...</span>
            {:else if course.error}
              <span class="text-xs text-error-500">Error</span>
            {/if}
          </div>
        </label>
      {/each}
    </div>
  </div>
</aside>
