<script lang="ts">
  import "../app.css";
  import App from "$lib/views/App.svelte";

  import Main from "$lib/dd/Main.svelte";

</script>

<App>
  <Main>
    <slot/>
  </Main>
</App>

<style>
</style>
