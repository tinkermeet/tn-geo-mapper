<script>
  // import sdk from "./sdk";
  import { onMount } from "svelte";
  import { get_current_component } from "svelte/internal";
  import * as L from "leaflet";
  import "leaflet/dist/leaflet.css";
  import { selectedFeatures, selectedIds, union } from "./stores";

  import { writable } from "svelte/store";

  export const foo = writable(["1", "2", "3"]);

  export let options;
  let map = null; // leaflet map
  let node; // container DOM node
  let that = get_current_component();

  // map.addPolygons = () => {

  // };

  let content = L.DomUtil.create("div", "content");

  that.addPolygons = function (layers) {
    return layers.forEach((e) => L.geoJSON(e, { onEachFeature }).addTo(map));
  };

  that.getLayerMeta = function () {
    $selectedFeatures.forEach((feature) => {
    });
  };

  function removePolygons(layerid) {
    map.eachLayer(function (layer) {
      if (layer._leaflet_id == layerid && layer["isSelected"]) {
        map.removeLayer(layer);
      }
    });
  }

  function removeLayers() {
    map.eachLayer(function (layer) {
      if (layer["isSelected"]) {
        map.removeLayer(layer);
      }
    });
    $selectedIds = [];
    $selectedFeatures = [];
  }

  that.removeAllLayers = function () {
    map.eachLayer(function (layer) {
      if (!layer._container) map.removeLayer(layer);
    });
  };

  function onEachFeature(feature, layer) {
    layer.on("click", (e) => {

      layer.isSelected = true;
      layer.setStyle({ fillColor: "yellow", opacity: 1, width: 3 });

      if ($selectedIds.includes(e.target._leaflet_id)) {
        $selectedIds = [...$selectedIds.slice(0, selectedIds.length - 1)];
        layer.setStyle({ fillColor: "green", opacity: 1, width: 3 });
      } else {
        $selectedIds = [...$selectedIds, e.target._leaflet_id];

        $selectedFeatures = [
          ...$selectedFeatures,
          feature.geometry ? feature.geometry : feature,
        ];
      }
    });
    layer.on("add", (e) => {
      $selectedIds = [...$selectedIds, e.target._leaflet_id];
      $selectedFeatures = [
        ...$selectedFeatures,
        e.target.feature.geometry
          ? e.target.feature.geometry
          : e.target.feature,
      ];
    });
  }

  onMount(() => {
    // leaflet map
    map = L.map(node, options).setView(options.center, options.zoom);
    L.tileLayer(options.tileLayer, {
      maxZoom: 14,
    }).addTo(map);
    L.geoJSON([]);
  });

  // polygon methods

  function getPolygonType(geometry) {
    return geometry.type == "Polygon"
      ? turf.polygon(geometry.coordinates)
      : turf.multiPolygon(geometry.coordinates);
  }
  let isCombined = false;

  that.unitePolygons = function (polygons) {
    isCombined = false;
    let result = polygons.map((a) => {
      isCombined = true;
      return getPolygonType(a);
    });

    $union = result[0];

    for (let i = 1; i < result.length; i++) {
      $union = turf.union(result[i], $union);
    }
    L.geoJSON($union, {
      style: { fillColor: "red" },
      onEachFeature,
    })

      .eachLayer((layer) => {
        layer.setStyle({
          fillColor: "lime",
          color: "green",
          opacity: 1,
          width: 1,
        });
        layer
          .bindPopup(
            `
            <p>New Layer ${layer._leaflet_id}</p>
            <hr>
            <button class="delete-btn">Delete layer</button>
            `,
            {
              direction: "top",
              sticky: "true",
            }
          )
          .on("popupopen", function (e) {
            let origin = e.target._leaflet_id;

            document
              .querySelector(".delete-btn")
              .addEventListener("click", (e) => {
                removePolygons(origin);
              });
          });
      })

      .addTo(map);
    removeLayers();

    isCombined = true;
    navigator.clipboard.writeText(JSON.stringify($union));
  };
  // function findDifference(polygons) {}
  // function findIntersection(polygons) {}
  var myHeaders = new Headers();
  myHeaders.append("Content-Type", "application/json");
  that.getGeoJson = function (params) {
    let { value, tablename, condition, type } = params;
    let query = `
    query district($stcode: Int,$value: Int, $condition: String,$tablename: String){  geomvaluesbp(stcode:$stcode,conditionvalue:$value,tablename:$tablename,condition:$condition){geojson,centroid}}`;
    let variables = {
      value: value,
      stcode: 33,
      condition: condition,
      tablename: tablename,
    };
    var graphql = JSON.stringify({
      query,
      variables,
    });
    var requestOptions = {
      method: "POST",
      headers: myHeaders,
      body: graphql,
    };

    fetch("https://bhuvan-panchayat3.nrsc.gov.in/graphql", requestOptions)
      .then((response) => response.json())
      .then((result) => {
        that.addPolygons([JSON.parse(result.data.geomvaluesbp.geojson)]);

        // addLayer(
        //   JSON.parse(result.data.geomvaluesbp.geojson),
        //   JSON.parse(result.data.geomvaluesbp.centroid),
        //   type,
        //   [value]
        // );
      })
      .catch((error) => console.log("error", error));
  };
  function addLayer(layer, centroid, type, value) {
    L.geoJSON(layer, { onEachFeature })
      .eachLayer((layer) => {
        layer.setStyle({
          fillColor: "orange",
          color: "red",
          opacity: 1,
          width: 1,
        });
        layer.bindTooltip(`leafletID: ${layer._leaflet_id}`, {
          direction: "top",
          sticky: "true",
        });
      })

      .addTo(map);
  }
</script>

<div class="map" bind:this={node} />

<style>
  .map {
    height: 600px;
  }
</style>
