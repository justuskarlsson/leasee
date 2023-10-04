<script lang="ts">
  /**
   * Root for all layout or whatever
   */
  import { loadingAuthState } from '$lib/client/firebase';
	import { page } from '$app/stores';
  import { loaded, updateFromURL } from "$lib/client/stores"
  import { userStore } from '$lib/client/firebase'
	import Login from '$lib/views/Login.svelte';
  import LoadingSpinner from '$lib/components/LoadingSpinner.svelte';

  $: if ($loaded) updateFromURL($page.params);

  // Await all loaded

</script>


   
{#if !$loadingAuthState && !$userStore}
  <Login />
{:else if !$loaded}
  <LoadingSpinner class="mt-[20%]" />
{:else}
  <slot/>
{/if}