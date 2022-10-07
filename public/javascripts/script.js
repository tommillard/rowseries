// source data
var rawData = [];
// data with points, converted times etc.
var processedData = [];
// data with sorts, filters applied.
var presentationData = [];
var wrapper = document.getElementById("wrapper");
var settings = {
    sortBy: "overall",
    filter: [],
};
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
    for (
        var _i = 0, presentationData_1 = presentationData;
        _i < presentationData_1.length;
        _i++
    ) {
        var athlete = presentationData_1[_i];
        var row = rsElem("div", wrapper, "row");
        var rank = rsElem("span", wrapper, "col col-Rank", count.toString());
        var name_1 = rsElem("span", wrapper, "col col-Name", athlete.name);
        var score1A = rsElem(
            "span",
            wrapper,
            "col col-Score",
            athlete.score1A.paceString
        );
        var score1B = rsElem(
            "span",
            wrapper,
            "col col-Score",
            athlete.score1B.paceString
        );
        var score2A = rsElem(
            "span",
            wrapper,
            "col col-Score",
            athlete.score2A.paceString
        );
        var score2B = rsElem(
            "span",
            wrapper,
            "col col-Score",
            athlete.score2B.paceString
        );
        var division = rsElem("span", wrapper, "col col-Div", athlete.category);
        count++;
    }
}
function processData(raw) {
    var scoredData = raw.map(function (athlete) {
        return {
            name: athlete.name,
            category: athlete.category,
            tdr: false,
            pointsOverall: 0,
            scoreOverall: newIScore(),
            score1: newIScore(),
            score2: newIScore(),
            score1A: generateScore(athlete.score1A, "400m"),
            score1B: generateScore(athlete.score1B, "400m"),
            score2A: generateScore(athlete.score2A, "30:00"),
            score2B: generateScore(athlete.score2B, "6:00"),
        };
    });
    calculatePositions(scoredData, "score1A");
    calculatePositions(scoredData, "score1B");
    calculatePositions(scoredData, "score2A");
    calculatePositions(scoredData, "score2B");
    for (
        var _i = 0, scoredData_1 = scoredData;
        _i < scoredData_1.length;
        _i++
    ) {
        var athlete = scoredData_1[_i];
        athlete.score1.points = athlete.score1A.points + athlete.score1B.points;
        athlete.score2.points = athlete.score2A.points + athlete.score2B.points;
        athlete.scoreOverall.paceSeconds =
            athlete.score1.points + athlete.score2.points;
    }
    calculatePositions(scoredData, "score1");
    calculatePositions(scoredData, "score2");
    calculatePositions(scoredData, "scoreOverall");
    return scoredData;
    // loop through data, adding positions for each score...
}
function generateScore(scoreString, distanceOrTime) {
    return {
        raw: scoreString,
        paceString: calculatePace(scoreString, distanceOrTime).string,
        paceSeconds: calculatePace(scoreString, distanceOrTime).seconds,
        points: 0,
        position: {
            display: "",
            index: 0,
        },
    };
}
function calculatePace(scoreString, distanceOrTime) {
    var duration, distance, paceSeconds;
    if (distanceOrTime.indexOf(":") >= 0) {
        duration = convertTimeStringToTenths(distanceOrTime);
        distance = parseInt(scoreString);
        paceSeconds = duration / (distance / 500);
        return {
            string: ""
                .concat(Math.floor(paceSeconds / 600), ":")
                .concat(Math.floor(paceSeconds / 10) % 60, ".")
                .concat(Math.round(paceSeconds / 10) % 10),
            seconds: paceSeconds / 10,
        };
    } else {
        duration = convertTimeStringToTenths(scoreString);
        distance = parseInt(distanceOrTime);
        paceSeconds = duration / (distance / 500);
        return {
            string: ""
                .concat(Math.floor(paceSeconds / 600), ":")
                .concat(Math.floor(paceSeconds / 10) % 60, ".")
                .concat(Math.round(paceSeconds / 10) % 10),
            seconds: paceSeconds / 10,
        };
    }
}
function formatData(raw) {
    return raw;
}
function calculatePositions(data, orderingScore) {
    console.log(data);
    data = data.sort(function (a, b) {
        var aScore = a[orderingScore];
        var bScore = b[orderingScore];
        return (
            (aScore.paceSeconds || aScore.points) -
            (bScore.paceSeconds || bScore.points)
        );
    });
    var position = 0;
    var score = -1;
    for (var i = 0; i <= data.length; i++) {
        if (!data[i]) {
            console.log("no data");
            continue;
        }
        console.log("good");
        var thisScore = data[i][orderingScore];
        if (!thisScore) {
            console.log(data[i]);
            continue;
        }
        thisScore.position.index = i;
        if (thisScore.paceSeconds === score) {
            if (!data[i - 1]) {
                console.log(data[i - 1]);
                console.log(i);
                continue;
            }
            var prevScore = data[i - 1][orderingScore];
            thisScore.position.display = "T".concat(position);
            prevScore.position.display = "T".concat(position);
        } else {
            score = thisScore.paceSeconds;
            position = i + 1;
            thisScore.position.display = position.toString();
        }
        thisScore.points = score;
    }
    return data;
}
function convertTimeStringToTenths(timeString) {
    // 13:12.9
    // 1:13:12.9
    // 5
    // :30
    // 8.5
    if (!timeString) {
        return 0;
    }
    var splitString = timeString.split(":");
    splitString = splitString.filter(function (item) {
        return item.length;
    });
    if (splitString.length === 3) {
        return (
            parseInt(splitString[0]) * 60 * 60 * 10 +
            parseInt(splitString[1]) * 60 * 10 +
            parseFloat(splitString[2]) * 10
        );
    } else if (splitString.length === 2) {
        return (
            parseInt(splitString[0]) * 60 * 10 +
            parseFloat(splitString[1].slice(0, 2)) * 10
        );
    } else if (splitString.length === 1) {
        return parseFloat(splitString[0]) * 60 * 10;
    }
    return undefined;
}
function newIScore() {
    return {
        raw: "",
        points: 0,
        paceSeconds: 0,
        paceString: "",
        position: {
            display: "",
            index: 0,
        },
    };
}
