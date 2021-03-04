<script>
  // import sdk from "./sdk";
  import { onMount } from "svelte";
  import { get_current_component } from "svelte/internal";
  import * as L from "leaflet";
  import "leaflet/dist/leaflet.css";
  import { selectedFeatures, selectedIds, union } from "./stores";

  export let options;
  let map = null; // leaflet map
  let node; // container DOM node
  let that = get_current_component();

  // map.addPolygons = () => {

  // };
  that.addPolygons = function addPolygons(layers) {
    return layers.forEach((e) => L.geoJSON(e, { onEachFeature }).addTo(map));
  };

  that.getLayerMeta = function () {
    $selectedFeatures.forEach((feature) => {
      console.log({ feature });
    });
  };

  that.removePolygons = function (layerid) {
    map.eachLayer(function (layer) {
      if (layer._leaflet_id == layerid && layer["isSelected"]) {
        map.removeLayer(layer);
      }
    });
  };

  function removeLayers() {
    map.eachLayer(function (layer) {
      if (layer["isSelected"]) {
        map.removeLayer(layer);
      }
    });
    $selectedIds = [];
    $selectedFeatures = [];
  }

  function onEachFeature(feature, layer) {
    layer.on("click", (e) => {
      layer.isSelected = true;
      layer.setStyle({ fillColor: "yellow", opacity: 1, width: 3 });
      console.log(e.target._leaflet_id);

      if ($selectedIds.includes(e.target._leaflet_id)) {
        console.log({ selectedIds: $selectedIds });
        $selectedIds = [...$selectedIds.slice(0, selectedIds.length - 1)];
        layer.setStyle({ fillColor: "green", opacity: 1, width: 3 });
      } else {
        console.log({ feature });
        $selectedIds = [...$selectedIds, e.target._leaflet_id];

        $selectedFeatures = [
          ...$selectedFeatures,
          feature.geometry ? feature.geometry : feature,
        ];
      }
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
    console.log({ geometry });
    return geometry.type == "Polygon"
      ? turf.polygon(geometry.coordinates)
      : turf.multiPolygon(geometry.coordinates);
  }
  let isCombined = false;

  that.unitePolygons = function (polygons) {
    isCombined = false;
    console.log(polygons);
    let result = polygons.map((a) => {
      isCombined = true;
      return getPolygonType(a);
    });

    console.log({ result });
    $union = result[0];

    for (let i = 1; i < result.length; i++) {
      $union = turf.union(result[i], $union);
    }
    console.log({ union: $union });
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
        layer.bindPopup(`Combined Layer`, {
          direction: "top",
          sticky: "true",
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
    console.log({ params });
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
    if (typeof value === "object") {
      // console.log(value);
      value.forEach((element) => {
        let variables = {
          value: element,
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
            addLayer(
              JSON.parse(result.data.geomvaluesbp.geojson),
              JSON.parse(result.data.geomvaluesbp.centroid),
              type,
              value
            );
          })
          .catch((error) => console.log("error", error));
      });
    } else {
      fetch("https://bhuvan-panchayat3.nrsc.gov.in/graphql", requestOptions)
        .then((response) => response.json())
        .then((result) => {
          addLayer(
            JSON.parse(result.data.geomvaluesbp.geojson),
            JSON.parse(result.data.geomvaluesbp.centroid),
            type,
            [value]
          );
        })
        .catch((error) => console.log("error", error));
    }
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
