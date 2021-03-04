export default function getGeoJson(params) {
  // console.log({ params });
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
}
