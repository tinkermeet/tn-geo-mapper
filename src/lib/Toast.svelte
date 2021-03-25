<script>
  import { fade } from "svelte/transition";
  let visible = true;

  setInterval(() => {
    visible = false;
  }, 1000);
</script>

{#if visible}
  <p transition:fade>Copied to clipboard</p>
{/if}

<style>
  p {
    position: absolute;
    top: 1em;
    right: 1em;
    background-color: #ffffff;
    padding: 0.5em;
    border-radius: 4px;
    color: black;
    border: 1px solid black;
  }
</style>
