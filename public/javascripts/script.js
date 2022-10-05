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
  let count = 1;
  for (let athlete of presentationData) {
    let row = rsElem("div", wrapper, "row");
    let rank = rsElem("span", wrapper, "col col-Rank", count);
    let name = rsElem("span", wrapper, "col col-Name", athlete.name);
    let score1A = rsElem("span", wrapper, "col col-Score", athlete.score1A);
    let score1B = rsElem("span", wrapper, "col col-Score", athlete.score1B);
    let score2A = rsElem("span", wrapper, "col col-Score", athlete.score2A);
    let score2B = rsElem("span", wrapper, "col col-Score", athlete.score2B);
    let division = rsElem("span", wrapper, "col col-Div", athlete.category);
    count++;
  }
}

function formatData(raw) {
  return raw;
}
