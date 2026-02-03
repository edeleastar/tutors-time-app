<script lang="ts">
  import type { CalendarEntry } from '$lib/types';

  interface Props {
    data: CalendarEntry[];
    loading: boolean;
    error: string | null;
  }

  let { data, loading, error }: Props = $props();

  // Extract distinct values for filters
  let distinctStudentIds = $derived(
    Array.from(new Set(data.map((e) => e.studentid))).sort()
  );

  // Filter state
  let selectedStudentId = $state<string | null>(null);
  let startDate = $state('');
  let endDate = $state('');

  // Filtered data
  let filteredData = $derived(
    data.filter((entry) => {
      // Student filter
      if (selectedStudentId && entry.studentid !== selectedStudentId) {
        return false;
      }
      // Date range filter
      if (startDate || endDate) {
        const entryDate = entry.id;
        if (startDate && entryDate < startDate) {
          return false;
        }
        if (endDate && entryDate > endDate) {
          return false;
        }
      }
      return true;
    })
  );

  function clearFilters() {
    selectedStudentId = null;
    startDate = '';
    endDate = '';
  }

  function formatDate(dateString: string): string {
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });
    } catch {
      return dateString;
    }
  }

  function formatTime(seconds: number): string {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    if (hours > 0) {
      return `${hours}h ${minutes}m ${secs}s`;
    } else if (minutes > 0) {
      return `${minutes}m ${secs}s`;
    } else {
      return `${secs}s`;
    }
  }
</script>

{#if loading}
  <div class="flex items-center justify-center p-8">
    <p class="text-lg">Loading calendar data...</p>
  </div>
{:else if error}
  <div class="card preset-filled-error-500 p-4">
    <p class="font-bold">Error loading data</p>
    <p class="text-sm">{error}</p>
  </div>
{:else if data.length === 0}
  <div class="flex items-center justify-center p-8">
    <p class="text-lg text-surface-600">No calendar data available</p>
  </div>
{:else}
  <!-- Filters -->
  <div class="mb-6 grid grid-cols-1 gap-4 md:grid-cols-3">
    <div>
      <label for="student-filter" class="label">Student ID</label>
      <select
        id="student-filter"
        bind:value={selectedStudentId}
        class="select"
      >
        <option value={null}>All Students</option>
        {#each distinctStudentIds as studentId}
          <option value={studentId}>{studentId}</option>
        {/each}
      </select>
    </div>

    <div>
      <label for="start-date" class="label">Start Date</label>
      <input
        id="start-date"
        type="date"
        bind:value={startDate}
        class="input"
      />
    </div>

    <div>
      <label for="end-date" class="label">End Date</label>
      <div class="flex gap-2">
        <input
          id="end-date"
          type="date"
          bind:value={endDate}
          class="input flex-1"
        />
        <button
          type="button"
          onclick={clearFilters}
          class="btn variant-filled-secondary"
        >
          Clear
        </button>
      </div>
    </div>
  </div>

  <!-- Table -->
  {#if filteredData.length === 0}
    <div class="flex items-center justify-center p-8">
      <p class="text-lg text-surface-600">No entries match the selected filters</p>
    </div>
  {:else}
    <div class="table-wrap overflow-x-auto">
      <table class="table">
        <thead>
          <tr>
            <th>Date</th>
            <th>Student ID</th>
            <th>Course ID</th>
            <th class="text-right">Time Active</th>
            <th class="text-right">Page Loads</th>
          </tr>
        </thead>
        <tbody>
          {#each filteredData as entry (entry.id + entry.studentid + entry.courseid)}
            <tr>
              <td>{formatDate(entry.id)}</td>
              <td>{entry.studentid}</td>
              <td>{entry.courseid}</td>
              <td class="text-right">{formatTime(entry.timeactive)}</td>
              <td class="text-right">{entry.pageloads}</td>
            </tr>
          {/each}
        </tbody>
      </table>
    </div>
    <p class="mt-4 text-sm text-surface-600">
      Showing {filteredData.length} of {data.length} calendar entries
    </p>
  {/if}
{/if}
