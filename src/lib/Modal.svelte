<script>
  export let shown = false;

  let keyCode;

  function handleKeydown(event) {
    keyCode = event.keyCode;
  }
  $: {
    if (keyCode == 27) {
      shown = false;
    }
  }
</script>

<svelte:window on:keydown={handleKeydown} />

<div
  class="modal"
  class:hidden={shown == false}
  on:click={() => (shown = false)}
>
  <div class="modal-text">
    <span class="close">
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="24"
        height="24"
        viewBox="0 0 24 24"
        ><path
          d="M24 20.188l-8.315-8.209 8.2-8.282-3.697-3.697-8.212 8.318-8.31-8.203-3.666 3.666 8.321 8.24-8.206 8.313 3.666 3.666 8.237-8.318 8.285 8.203z"
        /></svg
      >
    </span>
    <h2>Instructions</h2>
    <p>
      Districts can be drilled down to it's Panchayats and combined to create a
      new greater region (Polygon)
    </p>
    <ul>
      <li>
        After checking a selected panchayat(s) to show on the map click "Add to
        map"
      </li>
      <li>
        The added panchayats can be selected on the map, the selected panchayats
        can be combined to make a new region
      </li>
      <li>
        Combined layers will be copied to clipboard and can be verified using <a
          href="http://geojson.io/">http://geojson.io/</a
        >
      </li>
    </ul>
  </div>
</div>

<style>
  .modal {
    position: absolute;
    z-index: 9999;
    height: 100vh;
    width: 100vw;
    display: flex;
    justify-content: center;
    background: #0000007d;
  }
  .modal-text {
    padding: 2em;
    background-color: white;
    width: 600px;
    height: 600px;
    margin: auto;
    border-radius: 4px;
  }
  .close {
    float: right;
    cursor: pointer;
  }
  svg {
    height: 15px;
    width: 15px;
    transition: 0.4s;
  }
  svg:hover {
    fill: rgb(255, 115, 0);
  }
  .hidden {
    display: none;
    visibility: hidden;
  }
</style>
