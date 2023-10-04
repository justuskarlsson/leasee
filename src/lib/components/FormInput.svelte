<script lang="ts" context="module">

  export abstract class InputBase {

  };

  type ChangeCb = (Event) => void
  export class Input<T> extends InputBase {
    label: string;
    value: T;
    initialValue: T;
    onChangeCb: ChangeCb = (e: Event) => {}
    constructor(label: string, value: T) {
      super();
      this.label = label;
      this.value = value;
      this.initialValue = value;
    }
    onChange(cb: ChangeCb) {
      this.onChangeCb = cb;
      return this;
    }
  };

  type ClickableVariant = "button" | "link";

  export class ClickableInput extends Input<string> {
    variant: ClickableVariant = "button";
    constructor(label: string, cb: ChangeCb = () => {}) {
      super(label, "");
      this.onChange(cb);
    }

    setVariant(variant: ClickableVariant){
      this.variant = variant;
      return this;
    }
  }

  export class FileInput extends Input<FileList | null> {
    multiple: boolean;
    accept: string;
    constructor(label: string, accept: string = ".pdf", multiple: boolean = false) {
      super(label, null);
      this.accept = accept;
      this.multiple = multiple;
    }
  };

  export class TextInput extends Input<string> {
    multiline: boolean = false;
    constructor(label: string, value: string = "", multiline: boolean = false) {
      super(label, value);
      this.multiline = multiline;
    }
  };

  export type Option = {value: string, label: string};
  export class SelectInput extends Input<string> {
    options: Option[];
    constructor(label: string, options: Option[], value: string = "") {
      super(label, (value === "" && options.length) ? options[0].value : value);
      this.options = options;
    }

  };

  export class CheckboxInput extends Input<string> {
    options: Option[];
    selection: string [] = [];
    constructor(label: string, options: Option[]) {
      super(label, "");
      this.options = options;
    }
  };
</script>

<script lang="ts">
  import TextArea from "$lib/components/TextArea.svelte";
  import Button from "$lib/elements/Button.svelte";

  export let input: InputBase;
</script>

<div class="w-full max-w-xs">
  {#if input instanceof SelectInput}
    {#if input.label}
      <label class="label">
        <span class="label-text">{input.label}</span>
      </label>
    {/if}
    <select class="select select-bordered w-full"
            on:change={input.onChangeCb}
            bind:value={input.value}
      >
      {#each input.options as option}
        <option value={option.value}>
          {option.label}
        </option>
      {/each}
    </select>
  {:else if input instanceof CheckboxInput}
    {#if input.label}
      <label class="label font-bold">
        <span class="label-text">{input.label}</span>
      </label>
      <br />
    {/if}
    {#each input.options as option}
      <label class="label">
        <span class="label-text">{option.label}</span>
      </label>
      <input type="checkbox" bind:group={input.selection} value={option.value} />
    {/each}
  {:else if input instanceof ClickableInput}
    <Button class="w-full" on:click={input.onChangeCb}>
      {input.label}
    </Button>
  {:else if input instanceof FileInput}
    <label class="label">
      <span class="label-text">{input.label}</span>
    </label>
    <input type="file" multiple={input.multiple}
      accept={input.accept}
      bind:files={input.value} />
  {:else if input instanceof TextInput}
     <label class="label">
       <span class="label-text">{input.label}</span>
     </label>
     {#if input.multiline}
      <TextArea bind:value={input.value} on:change={input.onChangeCb}/>
     {:else}
       <input type="text" placeholder="Type here" 
              class="input input-bordered"
              bind:value={input.value}
              on:change={input.onChangeCb}
              />
     {/if}
  {/if}
</div>