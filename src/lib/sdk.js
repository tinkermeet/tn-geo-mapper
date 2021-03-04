import * as L from "leaflet";
import "leaflet/dist/leaflet.css";
let map;
let layerJSONs;
export default function Map(node, options) {
  map = L.map(node, options).setView(options.center, options.zoom);
  L.tileLayer(options.tileLayer, {
    maxZoom: 14,
  }).addTo(map);
  layerJSONs = L.geoJSON([]);
}


