import { Grid, html } from "https://unpkg.com/gridjs?module";

let settings = {};
let grid = new Grid({
  columns: ["Name", "1A", "1B", "2A", "2B", "Division"],
  data: [],
}).render(document.getElementById("wrapper"));
let data;

setTimeout(() => {
  // lets update the config
  grid
    .updateConfig({
      data: data.slice(0, 10),
    })
    .forceRender();
}, 10000);

fetch("../json/scrape.json")
  .then(function (response) {
    return response.json();
  })
  .then(function (j) {
    data = j.athletes;
    drawGrid();
    console.table(j.athletes);
  });

function drawGrid() {
  grid
    .updateConfig({
      columns: ["Name", "1A", "1B", "2A", "2B", "Division"],
      data: data,
    })
    .forceRender();
}
