// source data
let rawData: IRawAthlete[] = [];

// data with points, converted times etc.
let processedData: IAthlete[] = [];

// data with sorts, filters applied.
let presentationData: IAthlete[] = [];

let wrapper = document.getElementById("wrapper");

let settings = {
    sortBy: "overall",
    filter: [],
};

function rsElem(
    type: string,
    appendTo: HTMLElement | null,
    classNames: string | false,
    innerHTML?: string
): HTMLElement {
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
    let processedData = processData(rawData);
    let presentationData = formatData(processedData);
    let count = 1;
    for (let athlete of presentationData) {
        let row = rsElem("div", wrapper, "row");
        let rank = rsElem("span", wrapper, "col col-Rank", count.toString());
        let name = rsElem("span", wrapper, "col col-Name", athlete.name);
        let score1A = rsElem("span", wrapper, "col col-Score", athlete.score1A);
        let score1B = rsElem("span", wrapper, "col col-Score", athlete.score1B);
        let score2A = rsElem("span", wrapper, "col col-Score", athlete.score2A);
        let score2B = rsElem("span", wrapper, "col col-Score", athlete.score2B);
        let division = rsElem("span", wrapper, "col col-Div", athlete.category);
        count++;
    }
}

function processData(raw: IRawAthlete[]): IAthlete[] {
    let scoredData = raw.map((athlete) => {
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

    for (let athlete of scoredData) {
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

function generateScore(scoreString: string, distanceOrTime: string): IScore {
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

function calculatePace(
    scoreString: string,
    distanceOrTime: string
): { string: string; seconds: number } {
    let duration, distance, paceSeconds;
    if (distanceOrTime.indexOf(":") >= 0) {
        duration = convertTimeStringToTenths(distanceOrTime);
        distance = parseInt(scoreString);
        paceSeconds = duration / (distance / 500);
        return {
            string: `${Math.floor(paceSeconds / 600)}:${
                Math.floor(paceSeconds / 10) % 60
            }.${Math.round(paceSeconds / 10) % 10}`,
            seconds: paceSeconds / 10,
        };
    } else {
        duration = convertTimeStringToTenths(scoreString);
        distance = parseInt(distanceOrTime);
        paceSeconds = duration / (distance / 500);
        return {
            string: `${Math.floor(paceSeconds / 600)}:${
                Math.floor(paceSeconds / 10) % 60
            }.${Math.round(paceSeconds / 10) % 10}`,
            seconds: paceSeconds / 10,
        };
    }
}

function formatData(raw) {
    return raw;
}

function calculatePositions(
    data: IAthlete[],
    orderingScore: keyof IAthlete
): IAthlete[] {
    data = data.sort((a, b) => {
        let aScore = a[orderingScore] as IScore;
        let bScore = a[orderingScore] as IScore;
        return (
            (aScore.paceSeconds || aScore.points) -
            (bScore.paceSeconds || bScore.points)
        );
    });

    let position = 0;
    let score = 0;

    for (let i = 0; i <= data.length; i++) {
        let thisScore = data[i][orderingScore] as IScore;
        thisScore.position.index = i;
        if (thisScore.paceSeconds === score) {
            let prevScore = data[i - 1][orderingScore] as IScore;
            thisScore.position.display = `T${position}`;
            prevScore.position.display = `T${position}`;
        } else {
            score = thisScore.paceSeconds;
            position = i + 1;
            thisScore.position.display = position.toString();
        }
        thisScore.points = score;
    }

    return data;
}
function convertTimeStringToTenths(
    timeString: string | undefined
): number | undefined {
    // 13:12.9
    // 1:13:12.9
    // 5
    // :30
    // 8.5
    if (!timeString) {
        return 0;
    }
    let splitString = timeString.split(":");

    splitString = splitString.filter((item) => item.length);

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

interface IRawAthlete {
    name: string;
    score1A: string;
    score1B: string;
    score2A: string;
    score2B: string;
    category: string;
}

interface IScore {
    raw: string;
    paceSeconds: number;
    points: number;
    paceString: string;
    position: {
        display: string;
        index: number;
    };
}

interface IAthlete {
    name: string;
    scoreOverall: IScore;
    pointsOverall: number;
    category: string;
    score1A: IScore;
    score1B: IScore;
    score1: IScore;
    score2A: IScore;
    score2B: IScore;
    score2: IScore;
    tdr?: boolean;
}

function newIScore(): IScore {
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
