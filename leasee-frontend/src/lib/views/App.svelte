<script lang="ts">
  /**
   * Root for all layout or whatever
   */
	import { page } from '$app/stores';
  import { loaded, updateFromURL } from "$lib/client/stores"
  import LoadingSpinner from '$lib/components/LoadingSpinner.svelte';

  $: if ($loaded) updateFromURL($page.params);

  // Await all loaded

</script>


   
{#if !$loaded}
  <LoadingSpinner class="mt-[20%]" />
{:else}
  <slot/>
{/if}