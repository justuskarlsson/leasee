<script lang="ts">
    import { allCars } from "$lib/client/stores";
  import { ClickableInput, SelectInput } from "$lib/components/FormInput.svelte";
  import { addAlert, addLoading, setPageTitle, setSidebar } from "$lib/dd/Main.svelte";
  import { onMount } from 'svelte';

  let selectedTagId = "";
  $: {
    setSidebar([
    ])
  }

  onMount(() => {
  })

  let columns = [
    "manufacturer",
    "model",
    "range",
    "price",
    "chassis",
  ]

  function sorted(array: any[], key=columns[0]) {
    return array.sort((a, b) => (a[key] > b[key]) ? 1 : -1);
  }

  onMount(() => {
  })

</script>

<div class="p-4 max-w-screen-lg m-auto  overflow-x-auto">
  <table class="table">
    <!-- head -->
    <thead>
      <tr>
        {#each columns as key}
           <th>{key[0].toUpperCase() + key.substring(1)}</th>
        {/each}
      </tr>
    </thead>
    <tbody>
      {#each sorted($allCars) as car}
        <tr>
          {#each columns as key}
            <td>{car[key]}</td>  
          {/each}
        </tr>
      {/each}
    </tbody>
  </table>
</div>