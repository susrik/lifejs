const DIMENSIONS = {
    col_width: 5,
    row_height: 5,
    columns: 70,
    rows: 70
};

initValueArray = () => {
    return Array(DIMENSIONS.columns).fill().map(() => Array(DIMENSIONS.rows).fill(false));
}

const generations = [initValueArray(), initValueArray()];
let generation = 0;

const getCurrent = () => generations[generation % generations.length];
const getNext = () => generations[(generation + 1) % generations.length];


for(let x=0; x< DIMENSIONS.columns; x++) {
    for(let y=0; y<DIMENSIONS.rows; y++) {
        getCurrent()[x][y] = Math.random() < 0.5;
    }
}

document.getElementById('canvas').innerHTML
    = `<canvas id="life" width="${DIMENSIONS.columns * DIMENSIONS.col_width}" height="${DIMENSIONS.rows * DIMENSIONS.row_height}" />`;
var canvas = document.getElementById("life");
var ctx = canvas.getContext("2d");

const setPixel = (dataVector, offset, alive) => {
    dataVector[offset] = alive ? 255 : 255;
    dataVector[offset+1] = alive ? 0 : 255;
    dataVector[offset+2] = alive ? 0 : 255;
    dataVector[offset+3] = 255;
};

const drawCurrent = () => {
    const current = getCurrent();
    for(let x=0; x<DIMENSIONS.rows; x++) {
        for(let y=0; y<DIMENSIONS.columns; y++) {
            const imgData = ctx.createImageData(DIMENSIONS.col_width, DIMENSIONS.row_height);
            for(let i=0; i<imgData.data.length; i+=4) {
                setPixel(imgData.data, i, current[x][y]);
            }
            const canvas_x = x * DIMENSIONS.col_width;
            const canvas_y = y * DIMENSIONS.row_height;
            ctx.putImageData(imgData, canvas_x, canvas_y);          
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

        let total = 0;
        for(let i=0; i<_neighbor_states.length; i++) {
            if(_neighbor_states[i]) { total++; }
        }
        return total;
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
    for(let x=0; x<DIMENSIONS.rows; x++) {
        for(let y=0; y<DIMENSIONS.columns; y++) {
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
    setTimeout(cycle, 100);
}

cycle();
