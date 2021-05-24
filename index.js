const DIMENSIONS = {
    col_width: 2,
    row_height: 2,
    columns: 500,
    rows: 300
};

const ALIVE_COLOR = 'blue'
const DEAD_COLOR = 'white'

initValueArray = () => {
    return Array(DIMENSIONS.columns).fill().map(() => Array(DIMENSIONS.rows).fill(false));
}

const generations = [initValueArray(), initValueArray()];
let generation = 0;

const getCurrent = () => generations[generation % generations.length];
const getNext = () => generations[(generation + 1) % generations.length];
const getPrevious = () => generations[(generation + generations.length - 1) % generations.length];

for(let x=0; x< DIMENSIONS.columns; x++) {
    for(let y=0; y<DIMENSIONS.rows; y++) {
        getCurrent()[x][y] = Math.random() < 0.5;
    }
}

// getCurrent()[0][0] = true
// getCurrent()[0][1] = true
// getCurrent()[1][0] = true
// getCurrent()[1][1] = true
// getCurrent()[2][2] = true

document.getElementById('canvas').innerHTML
    = `<canvas id="life" width="${DIMENSIONS.columns * DIMENSIONS.col_width}" height="${DIMENSIONS.rows * DIMENSIONS.row_height}" />`;
var canvas = document.getElementById("life");
var ctx = canvas.getContext("2d");

const drawCurrent = (ignore_previous = false) => {
    const current = getCurrent();
    const previous = getNext();
    for(let x=0; x<DIMENSIONS.columns; x++) {
        for(let y=0; y<DIMENSIONS.rows; y++) {
            if (!ignore_previous && current[x][y] == previous[x][y]) {
                continue;
            }
            ctx.fillStyle = current[x][y] ? ALIVE_COLOR : DEAD_COLOR;
            const canvas_x = x * DIMENSIONS.col_width;
            const canvas_y = y * DIMENSIONS.row_height;
            ctx.fillRect(canvas_x, canvas_y, DIMENSIONS.col_width, DIMENSIONS.row_height);
        }
    }
};

const computeNext = (x, y) => {

    const current = getCurrent();

    const _norm_x = (_x) => {
        if (_x < 0) { return DIMENSIONS.columns - 1; }
        if (_x >= DIMENSIONS.columns) { return 0; }
        return _x;
    };

    const _norm_y = (_y) => {
        if (_y < 0) { return DIMENSIONS.rows - 1; }
        if (_y >= DIMENSIONS.rows) { return 0; }
        return _y;
    };
    
    const _count_neighbors = () => {
        const _neighbor_states = [
            current[_norm_x(x-1)][_norm_y(y-1)], // ul
            current[x][_norm_y(y-1)], // above
            current[_norm_x(x+1)][_norm_y(y-1)], // ur
            current[_norm_x(x-1)][y], // left
            current[_norm_x(x+1)][y], // right
            current[_norm_x(x-1)][_norm_y(y+1)], // ll
            current[x][_norm_y(y+1)], // below
            current[_norm_x(x+1)][_norm_y(y+1)], //lr
        ];

        return _neighbor_states.map((x) => x ? 1 : 0).reduce((x,y) => x+y);
    };

    const num_neighbors = _count_neighbors();
    if (current[x][y]) {
        // alive
        return (num_neighbors == 2 || num_neighbors == 3);
    } else {
        // dead
        return num_neighbors == 3;
    }
};

const updateNext = () => {
    const next = getNext();
    for(let x=0; x<DIMENSIONS.columns; x++) {
        for(let y=0; y<DIMENSIONS.rows; y++) {
            next[x][y] = computeNext(x, y);
        }
    }
};

const latch = () => {
    generation++;
    document.getElementById('caption').innerHTML = `generation: ${generation}`;
};


async function cycle() {
    drawCurrent();
    updateNext();
    latch();
    setTimeout(cycle, 20);
}

// compute next generation, without previous optimization
drawCurrent(true);
updateNext();
latch();

cycle();
