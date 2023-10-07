<script lang="ts" context="module">
  import { get, writable } from "svelte/store";
  import { PayloadStack, ProgressStack } from "./classes"
  import FormInput, { InputBase } from "$lib/components/FormInput.svelte";
  import type { FormData } from "$lib/components/Form.svelte";
  import Icon from "@iconify/svelte"
  let alerts = new PayloadStack<string>();
  let alerts$ = alerts.store;
  export const addAlert = alerts.addItemTimed.bind(alerts)


  let forms = new PayloadStack<FormData>();
  let forms$ = forms.store;
  export const addForm = forms.addItem.bind(forms)



  let loadings = new ProgressStack();
  let loadings$ = loadings.store;
  export const addLoading = loadings.addItem.bind(loadings)
  
  
  const sidebarItems = writable<InputBase []>([]);
  export function setSidebar(items: InputBase[]) {
    let cur = get(sidebarItems);
    sidebarItems.set(items);
    return cur;
  }

  let bottomActions = writable<InputBase []>([]);
  export function setBottomActions(items: InputBase[]) {
    let cur = get(bottomActions);
    bottomActions.set(items);
    return cur;
  }

  interface HeaderItem {
    text: string;
    cb?: Function;
  };

  const headerItems = writable<HeaderItem []>([]);
  export function setHeader(items: HeaderItem[]) {
    headerItems.set(items);
  }
  let pageTitle = writable<string>("leasely");
  export const setPageTitle = (title: string) => pageTitle.set(title)
</script>

<script lang="ts">
  import Form from "$lib/components/Form.svelte";
  import { onDestroy, onMount } from "svelte";
  import { onClick, onMouseUp, tryParseSelection } from "$lib/client/control";

  onMount(async () => {
    document.addEventListener("click", onClick);
    document.addEventListener("mouseup", tryParseSelection);
    document.addEventListener("touchend", tryParseSelection);
  })

  onDestroy(() => {
    document.removeEventListener("click", onClick);
    document.removeEventListener("mouseup", tryParseSelection);
    document.removeEventListener("touchend", tryParseSelection);

  })
</script>

<svelte:head>
  <title>{$pageTitle}</title>
</svelte:head>

{#if loadings.show($loadings$)}
<div class="absolute z-10 top-0 right-0 w-[25vw]">
  {#each loadings.getSorted($loadings$) as loading}
    <div class="w-full bg-yellow-200">
      {loading.message}
    </div>
  {/each}
</div>
{/if}

{#if alerts.show($alerts$)}
<div class="absolute z-10 top-0 left-0 right-0 mx-auto w-[25vw]">
  {#each alerts.getSorted($alerts$) as message}
    <div class="w-full bg-red-400">
      {message}
    </div>
  {/each}
</div>
{/if}

{#if $bottomActions.length}
<div class="absolute z-10 bottom-0 left-0 right-0 
            w-64 m-auto flex flex-row space-x-1">
  {#each $bottomActions as item}
    <FormInput input={item} />
  {/each}
</div>
{/if}

<!-- LAYOUT -->
<div class="bg-primary text-main h-screen w-screen overflow-hidden flex flex-row">
  {#if $headerItems.length}
  <!-- HEADER -->
  <div class="h-12">

  </div>
  {/if}
  <div class="flex flex-row h-full w-full">
    {#if $sidebarItems.length}
    <!-- SIDEBAR -->
    <div class="w-[240px] p-4 h-full flex flex-col space-y-1">
      {#each $sidebarItems as item}
        <FormInput input={item} />
      {/each}
    </div>
    {/if}

    <div class="bg-secondary w-full h-full overflow-y-scroll">
      <slot/>
    </div>
  </div>
</div>

{#if forms.show($forms$)}
{#each forms.getSortedKv($forms$) as [uid, form]}
  <div
    class="absolute top-0 left-0 w-screen h-screen
    flex justify-center cursor-pointer bg-gray-300/30"
    on:mousedown={() => forms.remove(uid)}
  >
    <div class="bg-white rounded-lg mx-auto my-auto cursor-auto" 
        on:mousedown|stopPropagation>
      <Form data={form}/>
    </div>
  </div>
{/each}
{/if}

