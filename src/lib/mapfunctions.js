
function addPolygons(layers) {
  console.log(layers);
  return layers.forEach((e) => {
    return L.geoJSON(e);
  });
}

export { addPolygons };
