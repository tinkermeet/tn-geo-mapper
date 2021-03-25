
function addPolygons(layers) {
  return layers.forEach((e) => {
    return L.geoJSON(e);
  });
}

export { addPolygons };
