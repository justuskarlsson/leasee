<script lang="ts">
  import Icon from "@iconify/svelte"
</script>



<div class="absolute w-32 h-32 m-auto left-0 right-0 top-0 bottom-0 z-[1000] {$$props.class || ""}"> 
  <Icon class="animate-spin text-8xl" icon="mdi:loading" />
</div>