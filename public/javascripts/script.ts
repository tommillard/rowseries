// source data
let rawData: string[] = [];

// data with points, converted times etc.
let processedData: IAthlete[] = [];

// data with sorts, filters applied.
let presentationData: IAthlete[] = [];
let wrapper = document.getElementById("wrapper");

let settings = {
    sortBy: "overall",
    filter: [],
};

interface IPosition {
    display: string;
    index: number;
}

interface IScore {
    raw: string;
    paceSeconds: number;
    paceString: string;
    position: IPosition;
}

interface IAthlete {
    name: string;
    posOverall: IPosition;
    pointsOverall: number;
    score1A: IScore;
    score1B: IScore;
    score1: IScore;
    score2a: IScore;
    score2b: IScore;
    score2: IScore;
    tdr?: boolean;
}

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

function processData(raw) {
    return raw;
}

function formatData(raw) {
    return raw;
}
