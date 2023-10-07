<script lang="ts">
  export let onSubmit: Function | null = null;
  export let maxHeight: number = 210;
  export let value: string = "";

  async function maybeSubmit(event: KeyboardEvent){


    if (event.key === "Enter" && !event.shiftKey && onSubmit) {
      event.preventDefault();
      onSubmit(value);
      value = "";
    }

  }

  function resizable(node: HTMLTextAreaElement) {
    const updateHeight = () => {
      node.style.height = 'auto'; // reset the height
      if (node.scrollHeight > maxHeight) {
        node.style.height = maxHeight + 'px'; // set the height to the maximum
        node.scrollTop = node.scrollHeight; 
      } else {
        node.style.height = node.scrollHeight + 'px'; // set the height to the scroll height
      }
    };
    node.addEventListener('input', updateHeight);

    return {
      destroy() {
        node.removeEventListener('input', updateHeight);
      },
    };
  }

</script>

<svelte:options accessors={true} />

<div class="relative mt-2">
  <textarea class="w-full p-2 min-h-[70px] resize-none pr-16
    shadow-lg rounded-xl border-slate-200 border-2" 
            style="max-height: {maxHeight}px;" 
            placeholder="Send a message..." 
            on:keydown={maybeSubmit}
            on:change
            bind:value={value} use:resizable />

 
</div>

<style>
</style>