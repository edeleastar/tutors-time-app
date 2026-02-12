<script lang="ts">
  import "../app.css";
  import { AppBar } from "@skeletonlabs/skeleton-svelte";

  let { children, data } = $props();

  const headline = $derived(
    data.courseTitle && data.viewType
      ? `${data.courseTitle} · ${data.viewType}`
      : data.courseTitle ?? "Tutors Time"
  );
</script>

<AppBar>
  <AppBar.Toolbar class="grid-cols-[1fr_2fr_1fr]">
    <AppBar.Lead />
    <AppBar.Headline class="flex justify-center">
      <p class="font-semibold truncate max-w-full">{headline}</p>
    </AppBar.Headline>
    <AppBar.Trail class="justify-end" />
  </AppBar.Toolbar>
</AppBar>

<main>
  {@render children()}
</main>
