<script>
  export let array;
  export let label;
  export let selection = [];
</script>

<div class="options">
  <p>
    {label} ({selection})
  </p>
  <div class="grid-check">
    {#each array as arrayItem}
      <label>
        <input type="checkbox" value={arrayItem.code} bind:group={selection} on:change/>
        {arrayItem.name}
      </label>
    {/each}
  </div>
</div>

<style>
  .options {
    padding-top: 2em;
    padding-left: 2em;
  }
  .grid-check {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
    gap: 0 1em;
  }
</style>
