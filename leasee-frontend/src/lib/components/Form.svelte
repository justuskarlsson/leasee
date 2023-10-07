<script lang="ts" context="module">
  type SubmitFunction = (values: Record<string, any>) => Promise<any>;

  export class FormData {
    inputs: Record<string, Input<any>>;
    onSubmitCb: SubmitFunction;
    constructor(inputs: Record<string, Input<any>>, onSubmitCb: SubmitFunction = async (v)=>{ }) {
      this.inputs = inputs;
      this.onSubmitCb = onSubmitCb;
    }

    onSubmit(onSubmitCb: SubmitFunction){
      this.onSubmitCb = onSubmitCb;
    }

    reset(){
      Object.values(this.inputs).map((inp) => {
        inp.value = inp.initialValue;
      })
    }
  }
</script>

<script lang="ts">
  import { addLoading } from "$lib/dd/Main.svelte";

  import FormInput, { CheckboxInput, Input } from "./FormInput.svelte";
  import LoadingSpinner from "./LoadingSpinner.svelte";

  export let data: FormData;
  let submitting = false;
  async function onSubmit(){
    submitting = true;
    const setProgress = addLoading("Submitting form..");
    let values: Record<string, any> = {};
    Object.entries(data.inputs).map(([key, input]) => {
      if (input instanceof CheckboxInput) {
        values[key] = input.selection;
      } else {
        values[key] = input.value;
      }
    })
    setProgress(0.5);
    let keepState = await data.onSubmitCb(values);
    setProgress(1.0);
    if (!keepState) {
      data.reset();
    }
    submitting = false;
  }
</script>


<div class="w-full h-full bg-white flex flex-col p-4 space-y-2 items-center">
  {#if submitting}
    <LoadingSpinner />
  {/if}
  {#each Object.values(data.inputs) as input}
    <FormInput {input} />
  {/each}
  <button class="btn w-full max-w-xs" on:click={onSubmit}>
    Submit
  </button>

</div>
