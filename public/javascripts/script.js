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

wrapper.addEventListener("click", function (e) {
    let sortProp = e.target.getAttribute("data-sort-prop");
    if (sortProp) {
        settings.sortBy = sortProp;
    }
    drawGrid();
});

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
    });

function drawGrid() {
    var processedData = processData(rawData);
    var presentationData = formatData(processedData);

    var header = rsElem("div", wrapper, "header row");
    let rankHeader = rsElem(
        "span",
        header,
        "cell cell-Rank sort sort-Overall",
        "Rank"
    );
    rankHeader.setAttribute("data-sort-prop", "Overall");
    rsElem("span", header, "cell cell-Name", "Athlete");
    let a1Header = rsElem("span", header, "cell cell-Score sort sort-1A", "1A");
    a1Header.setAttribute("data-sort-prop", "1A");
    let b1Header = rsElem("span", header, "cell cell-Score sort sort-1B", "1B");
    b1Header.setAttribute("data-sort-prop", "1B");
    let r1Header = rsElem("span", header, "cell cell-Score sort sort-1", "R1");
    r1Header.setAttribute("data-sort-prop", "1");
    let a2Header = rsElem("span", header, "cell cell-Score sort sort-2A", "2A");
    a2Header.setAttribute("data-sort-prop", "2A");
    let b2Header = rsElem("span", header, "cell cell-Score sort sort-2B", "2B");
    b2Header.setAttribute("data-sort-prop", "2B");
    let r2Header = rsElem("span", header, "cell cell-Score sort sort-2", "R2");
    r2Header.setAttribute("data-sort-prop", "2");
    rsElem("span", header, "cell cell-Div", "Division");

    for (
        var _i = 0, presentationData_1 = presentationData;
        _i < presentationData_1.length;
        _i++
    ) {
        var athlete = presentationData_1[_i];
        var row = rsElem("div", wrapper, "row");
        var rank = rsElem(
            "span",
            row,
            "cell cell-Rank",
            athlete.scoreOverall.position.display +
                " (" +
                athlete.scoreOverall.points +
                ")"
        );
        var name_1 = rsElem("span", row, "cell cell-Name", athlete.name);
        var score1A = rsElem(
            "span",
            row,
            "cell cell-Score",
            athlete.score1A.paceString
        );
        var score1B = rsElem(
            "span",
            row,
            "cell cell-Score",
            athlete.score1B.paceString
        );
        var score1 = rsElem(
            "span",
            row,
            "cell cell-Score",
            athlete.score1.points
        );
        var score2A = rsElem(
            "span",
            row,
            "cell cell-Score",
            athlete.score2A.paceString
        );
        var score2B = rsElem(
            "span",
            row,
            "cell cell-Score",
            athlete.score2B.paceString
        );
        var score2 = rsElem(
            "span",
            row,
            "cell cell-Score",
            athlete.score2.points
        );
        var division = rsElem("span", row, "cell cell-Div", athlete.category);
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
    calculatePositions(scoredData, "score1A", true);
    calculatePositions(scoredData, "score1B", true);
    calculatePositions(scoredData, "score2A", true);
    calculatePositions(scoredData, "score2B", true);
    for (
        var _i = 0, scoredData_1 = scoredData;
        _i < scoredData_1.length;
        _i++
    ) {
        var athlete = scoredData_1[_i];
        athlete.score1.points = athlete.score1A.points + athlete.score1B.points;
        athlete.score2.points = athlete.score2A.points + athlete.score2B.points;
        athlete.scoreOverall.points =
            athlete.score1.points + athlete.score2.points;
    }
    calculatePositions(scoredData, "score1");
    calculatePositions(scoredData, "score2");
    calculatePositions(scoredData, "scoreOverall");
    console.table(scoredData);
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
    if (scoreString === "--") {
        return {
            string: "--",
            seconds: Infinity,
        };
    }
    if (distanceOrTime.indexOf(":") >= 0) {
        duration = convertTimeStringToTenths(distanceOrTime);
        distance = parseInt(scoreString);
        paceSeconds = duration / (distance / 500);
        return {
            string: paceToString(paceSeconds),
            seconds: paceSeconds / 10,
        };
    } else {
        duration = convertTimeStringToTenths(scoreString);
        distance = parseInt(distanceOrTime);
        paceSeconds = duration / (distance / 500);
        return {
            string: paceToString(paceSeconds),
            seconds: paceSeconds / 10,
        };
    }
}
function paceToString(pace) {
    let mins = Math.floor(pace / 600);
    let secs = Math.floor((pace / 10) % 60);
    let tenths = Math.floor(pace) - mins * 600 - secs * 10;

    return mins + ":" + secs.toString().padStart(2, "0") + "." + tenths;
}

function formatData(raw) {
    let presentedData = raw.sort((a, b) => {
        return a[settings.sortBy].points - b[settings.sortBy].points;
    });
    return presentedData;
}
function calculatePositions(data, orderingScore, calcPoints) {
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
    for (var i = 0; i <= data.length - 1; i++) {
        if (!data[i]) {
            console.log("no data");
            continue;
        }
        var thisScore = data[i][orderingScore];
        if (!thisScore) {
            continue;
        }
        thisScore.position.index = i;
        let scoreToUse = thisScore.paceSeconds || thisScore.points;
        if (scoreToUse === score) {
            if (!data[i - 1]) {
                continue;
            }
            var prevScore = data[i - 1][orderingScore];
            thisScore.position.display = "T".concat(position);
            prevScore.position.display = "T".concat(position);
        } else {
            score = scoreToUse;
            position = i + 1;
            thisScore.position.display = position.toString();
        }
        if (calcPoints) {
            thisScore.points = position;
        }
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
            parseInt(splitString[0]) * 60 * 10 + parseFloat(splitString[1]) * 10
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
