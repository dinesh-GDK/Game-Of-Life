const cellDim = 20;
const minRow = 25;
const minCol = 38;

let rows = Math.floor(window.innerHeight/cellDim) - 5;
let cols = Math.floor(window.innerWidth/cellDim) - 2;
let popCount = 0;

rows = rows > minRow ? rows : minRow;
cols = cols > minCol ? cols : minCol;

let grid = [...Array(rows)].map(e => Array(cols).fill(0));
let nxtGrid = [...Array(rows)].map(e => Array(cols).fill(0));

const live_color = 'white';
const dead_color = 'black';

// options
const next = document.getElementById('next');
const play = document.getElementById('play');
const pause = document.getElementById('pause');
const clear = document.getElementById('clear');
const pattern = document.getElementById('pattern');
const pace = document.getElementById('pace');
const popDisp = document.getElementById('popCount');

const board = document.getElementById('board');
createBoard();

next.disabled = true;
play.disabled = true;
pause.disabled = true;

next.onclick = () => nextGen();
clear.onclick = () => clearBoard();

let timer;    
play.onclick = () => {
    next.disabled = true;
    play.disabled = true;
    pause.disabled = false;
    clear.disabled = true;
    pattern.disabled = true;
    
    timer = setInterval(() => nextGen(1),
        (Number(pace.max) - Number(pace.value) + Number(pace.min))); 
} 
        
pause.onclick = () => {
    next.disabled = false;
    play.disabled = false;
    pause.disabled = true;
    clear.disabled = false;
    pattern.disabled = false;

    clearInterval(timer);
}

pattern.onchange = () => {
    clearBoard();
    let shift = 1;
    if(pattern.value === 'gun')     shift = 0;
    const fig = eval(pattern.value);
    for(let i=0; i<fig.length; ++i) {
        toggle(fig[i][0] + shift * Math.floor(rows/2), fig[i][1] + Math.floor(cols/2));
    }
}

function createBoard() {

    for(let i=0; i<rows; ++i) {
        const board_row = document.createElement('tr');
        for(let j=0; j<cols; ++j) {
            board_row.appendChild(createCell(i, j));
        } 
        board.appendChild(board_row);
    }

    function createCell(i, j) {

        const cell = document.createElement('td');
        cell.className = 'cell';
        cell.id = String(i) + ' ' + String(j);

        cell.style.height = String(cellDim) + 'px';
        cell.style.width = String(cellDim) + 'px';
    
        cell.onmousedown  = () => toggle(i, j);
        cell.onmouseenter = (ev) => { if(ev.buttons == 1)  toggle(i, j); }

        return cell;
    }
}

function toggle(i, j) {

    if(grid[i][j] === 0) {
        grid[i][j] = 1;
        getCell(i, j).style.backgroundColor = live_color;
        popCount++;
    } else {
        grid[i][j] = 0;
        getCell(i, j).style.backgroundColor = dead_color;
        popCount--;
    }

    next.disabled = false;
    play.disabled = false;
    popDisp.innerHTML = popCount;
}

function nextGen(repeat=0) {
    popCount = 0;

    for(let i=0; i<rows; ++i) {
        for(let j=0; j<cols; ++j) {

            const cellState = grid[i][j];
            let liveNeighbours = 0;

            for(let x=-1; x<=1; ++x) {
                for(let y=-1; y<=1; ++y) {
                    if(i+x > 0 && j+y > 0 && i+x < rows && j+y < cols) {
                        liveNeighbours += grid[i+x][j+y];
                    }
                }
            }
            liveNeighbours -= cellState;

            if(cellState === 1 && liveNeighbours < 2) {
                nxtGrid[i][j] = 0;
            } else if(cellState === 1 && liveNeighbours > 3) {
                nxtGrid[i][j] = 0;
            } else if(cellState === 0 && liveNeighbours === 3) {
                nxtGrid[i][j] = 1;
            } else {
                nxtGrid[i][j] = cellState;
            }
        }
    }

    // update start
    for(let i=0; i<rows; ++i) {
        for(let j=0; j<cols; j++) {
            if(nxtGrid[i][j] === 1) {
                getCell(i, j).style.backgroundColor = live_color;
                popCount++;
            } else {
                getCell(i, j).style.backgroundColor = dead_color;
            }
        }
    }

    popDisp.innerHTML = popCount;

    grid = nxtGrid;
    nxtGrid = [...Array(rows)].map(e => Array(cols).fill(0));
    // update end

    if(repeat === 1) {
        clearInterval(timer);
        timer = setInterval(() => nextGen(1),
            (Number(pace.max) - Number(pace.value) + Number(pace.min)));
    }
    
}

function clearBoard() {

    for(let i=0; i<rows; ++i) {
        for(let j=0; j<cols; j++) {
            grid[i][j] = 0;
            getCell(i, j).style.backgroundColor = dead_color;
        }
    }

    popCount = 0;

    next.disabled = true;
    play.disabled = true;
    pause.disabled = true;
    popDisp.innerHTML = 0;
}

function getCell(i, j) {
    return document.getElementById(String(i) + ' ' + String(j));
}


// tutorial
const tutorial = document.getElementById('tutorial').querySelectorAll('div');
let page_no = 1;

info.onclick = () => changePage(0);
document.getElementById('nxt').onclick = () => changePage(1);
document.getElementById('pre').onclick = () => changePage(-1);
document.getElementsByClassName('close')[0].onclick = () => { page_no = 1; }

function changePage(direction) {

    if(page_no + direction >= 1 && page_no + direction <= tutorial.length) {
        page_no += direction;
        tutorial.forEach(item => item.style.display = 'none');
        tutorial[page_no-1].style.display = 'block';
        document.getElementById('page_no').innerHTML = `${page_no}/${tutorial.length}`;
    }
}

document.getElementById('info').click();
