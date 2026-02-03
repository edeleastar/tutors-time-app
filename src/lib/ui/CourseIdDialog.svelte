<script lang="ts">
  import { createEventDispatcher } from 'svelte';

  interface Props {
    open: boolean;
    courseId: string | null;
    loading: boolean;
    error: string | null;
  }

  type Events = {
    submit: { courseId: string };
    close: void;
    open: { open: boolean };
  };

  let { open, courseId, loading, error }: Props = $props();

  const dispatch = createEventDispatcher<Events>();

  let courseidInput = $state('');
  let dialogElement: HTMLDialogElement | undefined;

  // Update input when courseId prop changes
  $effect(() => {
    if (courseId) {
      courseidInput = courseId;
    }
  });

  // Handle dialog open/close
  $effect(() => {
    if (open && dialogElement) {
      dialogElement.showModal();
    } else if (!open && dialogElement) {
      dialogElement.close();
    }
  });

  function handleSubmit() {
    const trimmedCourseId = courseidInput.trim();
    if (!trimmedCourseId) {
      return;
    }
    dispatch('submit', { courseId: trimmedCourseId });
  }

  function handleClose() {
    // Prevent closing if no courseId is set
    if (!courseId) {
      dispatch('open', { open: true });
    } else {
      dispatch('close');
    }
  }
</script>

<dialog
  bind:this={dialogElement}
  class="backdrop:bg-surface-50-950/50 backdrop:backdrop-blur-sm bg-transparent border-none p-0"
  onclose={handleClose}
>
  <div class="card bg-surface-100-900 w-full max-w-md p-6 space-y-4 shadow-xl m-auto">
    <h2 class="text-2xl font-bold">Select Course ID</h2>
    <p class="text-surface-600">
      Please enter a course ID to view calendar data for that course.
    </p>
    <div class="space-y-4">
      <div>
        <label for="courseid-input" class="label">Course ID</label>
        <input
          id="courseid-input"
          type="text"
          bind:value={courseidInput}
          placeholder="Enter course ID"
          class="input"
          onkeydown={(e) => {
            if (e.key === 'Enter') {
              handleSubmit();
            }
          }}
        />
        {#if error && open}
          <p class="text-sm text-error-500 mt-1">{error}</p>
        {/if}
      </div>
      <div class="flex justify-end gap-2">
        <button
          type="button"
          onclick={handleSubmit}
          class="btn preset-filled"
          disabled={loading}
        >
          {loading ? 'Loading...' : 'Load Data'}
        </button>
      </div>
    </div>
  </div>
</dialog>

<style>
  dialog {
    position: fixed;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    margin: 0;
  }

  dialog::backdrop {
    background-color: rgba(0, 0, 0, 0.5);
    backdrop-filter: blur(4px);
  }
</style>
