<script lang="ts">
  import type { ViewMode } from '$lib/services/calendarUtils';

  interface Props {
    viewMode: ViewMode;
    onToggle: () => void;
  }

  let { viewMode, onToggle }: Props = $props();
</script>

<div class="flex shrink-0 justify-end">
  <button
    type="button"
    onclick={onToggle}
    class="btn variant-filled-secondary"
    aria-label={viewMode === 'week' ? 'Switch to daily view' : 'Switch to weekly view'}
  >
    {viewMode === 'week' ? 'Show by day' : 'Show by week'}
  </button>
</div>

