let settings = {};
let rawData;
let presentationData;
let wrapper = document.getElementById("wrapper");

function rsElem(type, appendTo, classNames, innerHTML) {
  let elem = document.createElement(type);
  if (classNames) {
    elem.setAttribute("class", classNames);
  }
  if (innerHTML) {
    elem.textContent = innerHTML;
  }
  if (appendTo) {
    appendTo.appendChild(elem);
  }
}

fetch("../json/scrape.json")
  .then(function (response) {
    return response.json();
  })
  .then(function (j) {
    rawData = j.athletes;
    drawGrid();
    console.table(j.athletes);
  });

function drawGrid() {
  let presentationData = formatData(rawData);
  for (let athlete of presentationData) {
    rsElem("div", wrapper, "row", athlete.name);
  }
}

function formatData(raw) {
  return raw;
}
