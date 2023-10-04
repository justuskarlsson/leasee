<script lang="ts">
  import { ClickableInput, SelectInput, TextInput } from "$lib/components/FormInput.svelte";
  import { addAlert, addForm, addLoading } from "$lib/dd/Main.svelte";
  import { FormData } from "$lib/components/Form.svelte";
  import { setSidebar } from "$lib/dd/Main.svelte";
  import { onMount } from 'svelte';
    import { allCars } from "$lib/client/stores";
    import { Car } from "$lib/client/models/car";

  
  function addCars(){
    let form = new FormData({
      json: new TextInput("JSON", "", true),
    })
  let removeForm = addForm(form);
  form.onSubmit(async (values) => {
    try {
      const setProgress = addLoading("Creating resource");

      setProgress(0.1);
      try {
        let json = JSON.parse(values.json);
        Car.collection.addMany(json);
      } finally {
        setProgress(1.0);
      }
    } catch (e: any) {
      addAlert(e.message, 2000);
    }
    removeForm();

  })
}

  $: {
    setSidebar([
      new ClickableInput("Add Cars", addCars),
    ])
  }
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

<div class="overflow-x-auto">
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