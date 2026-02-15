<script lang="ts">
  interface Props {
    /** Display name (e.g. full name from tutors-connect-users) */
    fullName: string;
    /** Optional avatar image URL; if missing, shows initial letter */
    avatarUrl?: string | null;
  }

  let { fullName, avatarUrl = null }: Props = $props();
</script>

<div class="card p-4 shrink-0 flex flex-row sm:flex-col items-center gap-3 min-w-0">
  {#if avatarUrl}
    <img
      src={avatarUrl}
      alt=""
      class="rounded-full size-16 sm:size-20 object-cover bg-surface-200"
    />
  {:else}
    <div
      class="rounded-full size-16 sm:size-20 bg-surface-300 flex items-center justify-center text-surface-600 text-2xl font-semibold shrink-0"
      aria-hidden="true"
    >
      {fullName.slice(0, 1).toUpperCase()}
    </div>
  {/if}
  <p class="text-lg font-semibold text-surface-800 truncate max-w-full">
    {fullName}
  </p>
</div>
