// source data
var rawData = [];
// data with points, converted times etc.
var processedData = [];
// data with sorts, filters applied.
var presentationData = [];
var settings = {
    sortBy: "Overall",
    filter: "all",
};

const tdrMembers = [
    "Tom Millard",
    "Carnivore.Trucker.Ben",
    "Troy Frerichs",
    "jdmad7",
    "Starks",
    "Richard  Wood",
    "Matt Fuller",
    "Tony Maddocks",
    "Andrew Firth",
    "Sven Wittchen  TDR",
    "Samuel Fuller",
    "Alex Wright",
];

const divisions = [
    {
        title: "Open Male (over 80kg)",
        titleShort: "Open Hwt M",
        colour: "#D10046",
        id: "hmo",
    },
    {
        title: "40-49 Male (over 80kg)",
        titleShort: "40+ Hwt M",
        colour: "#428BCA",
        id: "hm40",
    },
    {
        title: "50+ Male (over 80kg)",
        titleShort: "50+ Hwt M",
        colour: "#F0AD4E",
        id: "hm50",
    },
    {
        title: "40-49 Male Lwt (80kg and under)",
        titleShort: "40+ Lwt M",
        colour: "#D695BE",
        id: "lm40",
    },
    {
        title: "Open Male Lwt (80kg and under)",
        titleShort: "Open Lwt M",
        colour: "#7F8C8D",
        id: "lmo",
    },
    {
        title: "50+ Male Lwt (80kg and under)",
        titleShort: "50+ Lwt M",
        colour: "#8E44AD",
        id: "lm50",
    },
    {
        title: "40-49 Female (over 65kg)",
        titleShort: "40+ Hwt F",
        colour: "#AD4363",
        id: "hf40",
    },
    {
        title: "50+ Female (over 65kg)",
        titleShort: "50+ Hwt F",
        colour: "#D1D100",
        id: "hf50",
    },
    {
        title: "Open Female (over 65kg)",
        titleShort: "Open Hwt F",
        colour: "#AD8D43",
        id: "hfo",
    },
    {
        title: "40-49 Female Lwt (65kg and under)",
        titleShort: "40+ Lwt F",
        colour: "#D10046",
        id: "lf40",
    },
    {
        title: "50+ Female Lwt (65kg and under)",
        titleShort: "50+ Lwt F",
        colour: "#D10046",
        id: "lf50",
    },
    {
        title: "Open Female Lwt (65kg and under)",
        titleShort: "Open Lwt F",
        colour: "#D10046",
        id: "lfo",
    },
];

var filterBar = rsElem("div", document.body, "filters");
let table = rsElem("div", document.body, "table");
drawFilters();
drawHeader();

table.addEventListener("click", function (e) {
    let sortProp = e.target.getAttribute("data-sort-prop");
    if (sortProp) {
        let activeSort = document.body.querySelector(".sort-Active");
        activeSort?.classList.remove("sort-Active");
        e.target.classList.add("sort-Active");
        settings.sortBy = sortProp;
        drawGrid();
    }
});

filterBar.addEventListener("click", function (e) {
    let filterProp = e.target.getAttribute("data-filter");
    if (filterProp) {
        let activeSort = document.body.querySelector(".filters .active");
        activeSort?.classList.remove("active");
        e.target.classList.add("active");
        settings.filter = filterProp;
        drawGrid();
    }
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
        rawData = addDivisions(j.athletes);
        drawGrid();
    });

function drawFilters() {
    let all = rsElem("a", filterBar, "all active", "All");
    all.setAttribute("data-filter", "all");

    let tdr = rsElem("a", filterBar, "tdr", "TDR");
    tdr.setAttribute("data-filter", "tdr");

    for (let division of divisions) {
        let filter = rsElem("a", filterBar, division.id, division.titleShort);
        filter.setAttribute("data-filter", division.id);
    }
}

function drawHeader() {
    var header = rsElem("div", table, "header row");
    let rankHeader = rsElem(
        "span",
        header,
        "cell cell-Overall sort sort-Active",
        "Rank"
    );
    rankHeader.setAttribute("data-sort-prop", "Overall");
    rsElem("span", header, "cell cell-Name", "Athlete");
    let a1Header = rsElem("span", header, "cell sort", "1A");
    a1Header.setAttribute("data-sort-prop", "1A");
    let b1Header = rsElem("span", header, "cell cell-Score sort", "1B");
    b1Header.setAttribute("data-sort-prop", "1B");
    let r1Header = rsElem("span", header, "cell cell-Score sort", "R1");
    r1Header.setAttribute("data-sort-prop", "1");
    let a2Header = rsElem("span", header, "cell cell-Score sort", "2A");
    a2Header.setAttribute("data-sort-prop", "2A");
    let b2Header = rsElem("span", header, "cell cell-Score sort", "2B");
    b2Header.setAttribute("data-sort-prop", "2B");
    let r2Header = rsElem("span", header, "cell cell-Score sort", "R2");
    r2Header.setAttribute("data-sort-prop", "2");
}

function cell(data1, data2, classList, appendTo) {
    let wrapper = rsElem("div", appendTo, classList + " cell");
    rsElem("p", wrapper, "", data1);
    rsElem("span", wrapper, "", data2);
    return wrapper;
}

function drawGrid() {
    var filteredData = filterData(rawData);
    var processedData = processData(filteredData);
    var presentationData = formatData(processedData);

    for (var j = table.children.length - 1; j > 0; j--) {
        table.removeChild(table.children[j]);
    }

    for (
        var _i = 0, presentationData_1 = presentationData;
        _i < presentationData_1.length;
        _i++
    ) {
        var athlete = presentationData_1[_i];
        var row = rsElem("div", table, "row");
        if (athlete.tdr) {
            row.classList.add("tdr");
        }
        cell(
            athlete.scoreOverall.position.display,
            `${athlete.scoreOverall.points}pts`,
            "cell-Overall",
            row
        );

        let nameCell = cell(
            athlete.name,
            athlete.category.titleShort,
            "name",
            row
        );
        nameCell.style.setProperty("--catColour", athlete.category.colour);

        cell(
            athlete.score1A.paceString,
            athlete.score1A.raw,
            "cell-Overall",
            row
        );

        cell(athlete.score1B.paceString, athlete.score1B.raw, "score", row);

        cell(
            athlete.score1.position.display,
            athlete.score1.points + "pts",
            "score",
            row
        );

        cell(athlete.score2A.paceString, athlete.score2A.raw, "score", row);

        cell(athlete.score2B.paceString, athlete.score2B.raw, "score", row);

        cell(
            athlete.score2.position.display,
            athlete.score2.points + "pts",
            "score",
            row
        );
    }
}

function addDivisions(raw) {
    var divisionedData = raw.map(function (athlete) {
        athlete.category = divisions.find(
            (division) => athlete.category === division.title
        );
        athlete.tdr = tdrMembers.indexOf(athlete.name) >= 0;
        return athlete;
    });

    return divisionedData;
}
function processData(raw) {
    var scoredData = raw.map(function (athlete) {
        return {
            name: athlete.name,
            category: athlete.category,
            tdr: athlete.tdr,
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
        return (
            a["score" + settings.sortBy].points -
            b["score" + settings.sortBy].points
        );
    });

    presentationData = presentationData.filter((athlete) => {});
    return presentedData;
}

function filterData(raw) {
    let filteredData = raw.filter((athlete) => {
        console.log(athlete);
        console.log(settings.filter);
        if (settings.filter === "all") {
            return true;
        }
        if (settings.filter === "tdr" && athlete.tdr) {
            return true;
        }
        return settings.filter === athlete.category.id;
    });
    return filteredData;
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
            thisScore.position.display = "T" + position;
            prevScore.position.display = "T" + position;
        } else {
            score = scoreToUse;
            position = i + 1;
            thisScore.position.display = position;
        }
        if (calcPoints) {
            thisScore.points = position;
        }
    }
    return data;
}
function genPositionString(num) {
    let splitNumString = num.toString().split("");
    console.log(num.toString().slice(-1));
    let end;
    switch (num.toString().slice(-1)) {
        case "1":
            end = "st";
            break;

        case "2":
            end = "nd";
            break;

        case "3":
            end = "rd";
            break;

        default:
            end = "th";
            break;
    }
    console.log(end);
    return num.toString() + end;
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
    console.log(timeString);
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
