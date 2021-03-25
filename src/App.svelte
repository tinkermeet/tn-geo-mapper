<script>
  import Map from "./lib/Map.svelte";
  import Select from "./lib/Select.svelte";
  import {
    selectedFeatures,
    selectedIds,
    union,
    panchayatSelection,
  } from "./lib/stores";
  import Modal from "./lib/Modal.svelte";
  import Toast from "./lib/Toast.svelte";

  let map;

  let options = {
    zoom: 7,
    center: [11, 78],
    mapID: "map1",
    doubleClickZoom: false,
    tileLayer:
      "https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png",
    attributionControl: false,
  };

  let districts = [];
  let blocks = [];
  let panchayats = [];
  $: filteredBlocks = "";
  $: filteredPanchayats = "";

  (async function getDistricts() {
    await fetch("./districts.json")
      .then((res) => res.json())
      .then((data) => {
        districts = data.districts;
      });
  })();

  (async function getBlocks() {
    await fetch("./blocks.json")
      .then((res) => res.json())
      .then((data) => {
        blocks = data.blocks;
      });
  })();
  (async function getBlocks() {
    await fetch("./panchayats.json")
      .then((res) => res.json())
      .then((data) => {
        panchayats = data.panchayats;
      });
  })();

  let districtSelection = 0;
  let blockSelection = 0;
  let panchayatSelectionLocal = [];

  function querySelectedDistrict(selectedDistrict) {
    blockSelection = 0;
    filteredBlocks = blocks.filter((e) => {
      return e.dtcode == selectedDistrict;
    });
  }
  function querySelectedBlock(selectedBlock) {
    let items = (filteredPanchayats = panchayats.filter((e) => {
      return e.bpcode == selectedBlock;
    }));
    getUnique(items);
  }

  function getUnique(items) {
    filteredPanchayats = items.filter(
      (thing, index, self) =>
        index === self.findIndex((t) => t.code === thing.code)
    );
  }
  let showModal = false;
  let foo;

  $: $panchayatSelection = [...panchayatSelectionLocal];
</script>

{#if showModal == true}
  <Modal bind:shown={showModal} />
{/if}
{#if $union.length != 0}
  <Toast />
{/if}
<main>
  <div class="d-grid">
    <Map bind:this={map} {options} bind:foo />

    <div>
      <div class="options">
        <button
          on:click={() => {
            $selectedIds = [];
            $selectedFeatures = [];
            $union = [];
            districtSelection = 0;
            blockSelection = 0;
            panchayatSelection.set([]);
            map.removeAllLayers();
          }}
        >
          Reset map
        </button>
        <button class="" on:click={() => (showModal = true)}>
          Show instructions
        </button>
      </div>
      <Select
        bind:selection={districtSelection}
        array={districts}
        label="Districts"
        type="select"
        on:change={() => querySelectedDistrict(districtSelection)}
      />
      {#if districtSelection}
        <Select
          bind:selection={blockSelection}
          array={filteredBlocks}
          label="Blocks"
          type="select"
          on:change={() => querySelectedBlock(blockSelection)}
        />
      {/if}
      {#if blockSelection}
        <Select
          type="checkbox"
          bind:selection={panchayatSelectionLocal}
          array={filteredPanchayats}
          label="Panchayats"
          on:change={map.getGeoJson({
            value: panchayatSelectionLocal[panchayatSelectionLocal.length - 1],
            tablename: "bp.panchayat",
            condition: "gpcode",
            type: "panchayat",
          })}
        />
      {/if}

      <div class="options">
        {#if blockSelection}
          {#if panchayatSelectionLocal.length > 0}
            <button
              disabled={panchayatSelectionLocal.length == 0}
              on:click={() => map.unitePolygons($selectedFeatures)}
              >Combine
            </button>
          {/if}
        {/if}
      </div>
    </div>
  </div>
</main>

{#if $union.length != 0}
  <textarea value={JSON.stringify($union)} rows="30" />
{/if}

<style>
  textarea {
    width: 100%;
    height: auto;
  }
  .d-grid {
    display: grid;
    grid-template-columns: 1fr 1fr;
  }
  .options {
    padding-top: 2em;
    padding-left: 2em;
  }
</style>
