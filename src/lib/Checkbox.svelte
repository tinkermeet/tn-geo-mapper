<script>
  export let array;
  export let label;
  export let selection = [];
  console.log({ array });
  import { panchayatSelection } from "./stores";
</script>

<div class="options">
  <p>
    {label}
  </p>
  <div class="grid-check">
    <p>
    {$panchayatSelection}

    </p>
    {#each array as arrayItem}
      {#if !$panchayatSelection.includes(arrayItem.code)}
        <label>
          <input
            type="checkbox"
            value={arrayItem.code}
            bind:group={selection}  
            on:change
          />
          {arrayItem.name}
        </label>
      {/if}
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
