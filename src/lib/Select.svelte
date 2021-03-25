<script>
  export let array;
  export let label;
  export let selection = 0;
  export let type = "select";
  import { panchayatSelection } from "./stores";
</script>

<div class="options">
  {#if type === "select"}
    <span>{label} (code: {selection})</span>
    <select bind:value={selection} on:change on:blur>
      <option value="0">Select </option>
      {#each array as arrayItem}
        <option value={arrayItem.code} selected={selection}
          >{arrayItem.name}</option
        >
      {/each}
    </select>
  {/if}
  {#if type === "checkbox"}
    <p>
      {label}
    </p>

    <div class="grid-check">
      {#each array as arrayItem}
        <label class:hidden={$panchayatSelection.includes(arrayItem.code)}>
          <input
            type="checkbox"
            value={arrayItem.code}
            bind:group={selection}
            on:change
          />
          {arrayItem.name}
        </label>
      {/each}
    </div>

    <div class="selected">
      {#if $panchayatSelection.length != 0}
        <p>Selected Panchayats</p>
      {/if}
      <ul>
        {#each array as arrayItem}
          {#if $panchayatSelection.includes(arrayItem.code)}
            <li>{arrayItem.name}</li>
          {/if}
        {/each}
      </ul>
    </div>
  {/if}
</div>

<style>
  .options {
    padding-top: 2em;
    padding-left: 2em;
  }

  .hidden {
    display: none;
    visibility: hidden;
  }
  .selected {
    display: grid;
  }
  .grid-check {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
    gap: 0 1em;
  }
</style>
