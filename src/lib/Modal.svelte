<script>
  export let shown = false;

  let keyCode;

  function handleKeydown(event) {
    event.preventDefault();
    keyCode = event.keyCode;
    if (keyCode === 27) {
      shown = false;
    }
  }
</script>

<svelte:window on:keydown={handleKeydown} />

<div class="modal">
  <div class="modal-text">
    <span
      class="close"
      class:hidden={shown == false}
      on:click={() => (shown = false)}
    >
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
      This tool allows you to drill down districts to individual Panchayats and
      recombine them to create new polygons indicating new larger regions.
    </p>
    <ul>
      <li>
        Select a district from the dropdown menu. Then select a block from the blocks dropdown menu and choose one or more panchayats.
      </li>
      <li>
        The chosen panchayats will be plotted on the map.
      </li>
      <li>
        On clicking "Combine", the selected panchayats will be combined to make
        a new larger region.
      </li>
      <li>The combined layers will be copied to clipboard.</li>
      <li>
        The combination can be verified by pasting in to <a href="http://geojson.io/">http://geojson.io/</a>
        where it will be highlighted as one unit.
      </li>
      <li>
        The state of the map and the selections can be reset using "Reset Map".
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
