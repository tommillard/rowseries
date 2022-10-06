var settings = {};
var rawData;
var processedData;
var presentationData;
var wrapper = document.getElementById("wrapper");
function rsElem(type, appendTo, classNames, innerHTML) {
    var elem = document.createElement(type);
    if (classNames) {
        elem.setAttribute("class", classNames);
    }
    if (innerHTML) {
        elem.textContent = innerHTML;
    }
    if (appendTo) {
        appendTo.appendChild(elem);
    }
    return elem;
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
    var processedData = processData(rawData);
    var presentationData = formatData(processedData);
    var count = 1;
    for (var _i = 0, presentationData_1 = presentationData; _i < presentationData_1.length; _i++) {
        var athlete = presentationData_1[_i];
        var row = rsElem("div", wrapper, "row");
        var rank = rsElem("span", wrapper, "col col-Rank", count.toString());
        var name_1 = rsElem("span", wrapper, "col col-Name", athlete.name);
        var score1A = rsElem("span", wrapper, "col col-Score", athlete.score1A);
        var score1B = rsElem("span", wrapper, "col col-Score", athlete.score1B);
        var score2A = rsElem("span", wrapper, "col col-Score", athlete.score2A);
        var score2B = rsElem("span", wrapper, "col col-Score", athlete.score2B);
        var division = rsElem("span", wrapper, "col col-Div", athlete.category);
        count++;
    }
}
function processData(raw) {
    return raw;
}
function formatData(raw) {
    return raw;
}
