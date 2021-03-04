<script>
  export let array;
  export let label;
  export let selection = 0;
  
</script>

<div class="options">
  <span>{label} (code: {selection})</span>
  <select bind:value={selection} on:change on:blur>
    <option value="0">Select </option>
    {#each array as arrayItem}
      <option value={arrayItem.code} selected={selection}>{arrayItem.name}</option>
    {/each}
  </select>
</div>

<style>
  .options {
    padding-top: 2em;
    padding-left: 2em;
  }
</style>
