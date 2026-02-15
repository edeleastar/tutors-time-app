<script lang="ts">
  import "../app.css";
  import { AppBar } from "@skeletonlabs/skeleton-svelte";
  import Icon from "@iconify/svelte";
  import { goto } from "$app/navigation";
  import StudentCard from "$lib/components/StudentCard.svelte";

  let { children, data } = $props();

  const title = $derived(data.courseTitle ?? "Tutors Time");
  const subtitle = $derived(data.viewType ?? "");
</script>

<AppBar>
  <AppBar.Toolbar class="grid-cols-[1fr_2fr_1fr]">
    <AppBar.Lead class="justify-start">
      {#if data.courseId}
        <button
          type="button"
          class="btn preset-outlined"
          onclick={() => goto("/")}
          aria-label="Change course"
        >
          Change course
        </button>
      {/if}
    </AppBar.Lead>
    <AppBar.Headline class="grid grid-cols-[auto_1fr] grid-rows-[auto_auto] items-center gap-x-2 gap-y-0 text-left h-full min-w-0">
      {#if data.courseIcon}
        <Icon
          icon={data.courseIcon.type}
          class="h-full w-auto shrink-0 row-span-2 self-center"
          style={data.courseIcon.color ? `color: ${data.courseIcon.color}` : undefined}
        />
      {:else if data.courseImg}
        <img
          src={data.courseImg}
          alt=""
          class="size-14 rounded object-contain shrink-0 row-span-2 self-center"
        />
      {/if}
      <p class="font-semibold truncate max-w-full">{title}</p>
      {#if subtitle}
        <p class="text-sm text-surface-600 truncate max-w-full">{subtitle}</p>
      {/if}
    </AppBar.Headline>
    <AppBar.Trail class="justify-end">
      {#if data.studentName}
        <StudentCard fullName={data.studentName} avatarUrl={data.avatarUrl} compact />
      {/if}
    </AppBar.Trail>
  </AppBar.Toolbar>
</AppBar>

<main>
  {@render children()}
</main>
