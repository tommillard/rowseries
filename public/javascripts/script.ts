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

interface IPosition {
    display: string;
    index: number;
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
    paceString: string;
    position: IPosition;
}

interface IAthlete {
    name: string;
    posOverall: IPosition;
    pointsOverall: number;
    category: string;
    score1A: IScore;
    score1B: IScore;
    score1: IPosition;
    score2A: IScore;
    score2B: IScore;
    score2: IPosition;
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

function processData(raw: IRawAthlete[]): IAthlete[] {
    let scoredData = raw.map((athlete) => {
        return {
            name: athlete.name,
            category: athlete.category,
            tdr: false,
            score1: {
                display: "",
                index: 0
            },
            score2: {
                display: "",
                index: 0
            },
            score1A: generateScore(athlete.score1A, "400m"), 
            score1B: generateScore(athlete.score1B, "400m"),
            score2A: generateScore(athlete.score2A, "30:00"),
            score2B: generateScore(athlete.score2B, "6:00")
        };
    });
    
    // loop through data, adding positions for each score...
}

function generateScore(scoreString: string, distanceOrTime: string):IScore {
    return {
        raw: scoreString,
        paceString: calculatePace(scoreString, distanceOrTime).string,
        paceSeconds: calculatePace(scoreString, distanceOrTime).seconds,
        position:0
    }
}

function calculatePace(scoreString: string, distanceOrTime: string): {scoreString: string, seconds:number} {
    if(distanceOrTime.contains(":")) {
        return {
            paceString: "",
            paceSeconds: ""
        }
    } else {
        return {
            paceString: "",
            paceSeconds: ""
        }
    }
}

function formatData(raw) {
    return raw;
}

function calculateOverallPositions(data:IAthlete[], orderingProp: string):IAthelete[] {
        data = data.sort((a, b) => {
            return a[orderingProp] - b[orderingProp];
        });

        let scoreSplit = data.reduce(
            (accumulator: any[], current: IAthlete) => {
                let matchingScore = accumulator.find(
                    (scoreSet) =>
                        scoreSet.TotalScore === parseInt(current.toPar)
                );

                if (!matchingScore) {
                    matchingScore = {
                        TotalScore: parseInt(current.toPar),
                        pros: [],
                    };
                    accumulator.push(matchingScore);
                }

                matchingScore.users.push(current);
                return accumulator;
            },
            []
        );

        scoreSplit.sort((a, b) => {
            return a.toPar - b.toPar;
        });

        let prosSoFar = 0;
        scoreSplit.forEach((scoreBracket) => {
            scoreBracket.pros.forEach((pro: IPro) => {
                pro.Position = (prosSoFar + 1).toString();
                if (scoreBracket.pros.length > 1) {
                    pro.Position = "T" + pro.Position;
                }
            });
            prosSoFar += scoreBracket.pros.length;
        });
    }
