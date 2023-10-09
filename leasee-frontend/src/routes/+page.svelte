<script lang="ts">
	import { allOffers } from '$lib/client/stores';
  import {  setSidebar } from "$lib/dd/Main.svelte";
  import { onMount } from 'svelte';

  $: {
    setSidebar([
    ])
  }

  onMount(() => {
  })


  onMount(() => {
  })

</script>

<div class="p-4 max-w-screen-lg m-auto  overflow-x-auto">
  <ul>
  {#each $allOffers as offer}
    <li>
      {offer.manufacturer + " " + offer.model}
      : {offer.price} kr
      <p class="text-sm">{offer.link}</p>
    </li>
  {/each}
  </ul>
</div>