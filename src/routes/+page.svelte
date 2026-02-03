<script lang="ts">
  import { AppBar } from '@skeletonlabs/skeleton';
</script>

<svelte:head>
  <title>Tutors Time</title>
  <meta name="description" content="Calendar visualization for student course time tracking" />
</svelte:head>

<AppBar>
  <svelte:fragment slot="lead">
    <span class="text-xl font-bold">Tutors Time</span>
  </svelte:fragment>
</AppBar>

<section class="container mx-auto p-4">
  <div class="card p-6">
    <h1 class="text-3xl font-bold mb-4">Welcome to Tutors Time</h1>
    <p class="text-lg">Calendar visualization application</p>
    <p class="mt-4 text-sm text-surface-600">
      This is a basic application shell with Skeleton.dev components.
    </p>
  </div>
</section>

<style>
  section {
    margin-top: 2rem;
  }
</style>
