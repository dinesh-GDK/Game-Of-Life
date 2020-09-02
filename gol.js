const cellDim = 20;
const minRow = 25;
const minCol = 38;

var rows = Math.floor(window.innerHeight/cellDim) - 5;
var cols = Math.floor(window.innerWidth/cellDim) - 2;

rows = rows > minRow ? rows : minRow;
cols = cols > minCol ? cols : minCol;

var grid = [...Array(rows)].map(e => Array(cols).fill(0));
var nxtGrid = [...Array(rows)].map(e => Array(cols).fill(0));

const live_color = 'white';
const dead_color = 'black';

// options
const next = document.getElementById('next');
const play = document.getElementById('play');
const pause = document.getElementById('pause');
const clear = document.getElementById('clear');
const pattern = document.getElementById('pattern');
const pace = document.getElementById('pace');

const board = document.getElementById('board');
createBoard();

next.disabled = true;
play.disabled = true;
pause.disabled = true;

next.onclick = () => nextGen();
clear.onclick = () => clearBoard();

var timer;    
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
    var shift = 1;
    if(pattern.value === 'gun')     shift = 0;
    const fig = eval(pattern.value);
    for(var i=0; i<fig.length; ++i) {
        toggle(fig[i][0] + shift * Math.floor(rows/2), fig[i][1] + Math.floor(cols/2));
    }
}

function createBoard() {

    for(var i=0; i<rows; ++i) {
        const board_row = document.createElement('tr');
        for(var j=0; j<cols; ++j) {
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
    } else {
        grid[i][j] = 0;
        getCell(i, j).style.backgroundColor = dead_color;
    }

    next.disabled = false;
    play.disabled = false;
}

function nextGen(repeat=0) {

    for(var i=0; i<rows; ++i) {
        for(var j=0; j<cols; ++j) {

            const cellState = grid[i][j];
            var liveNeighbours = 0;

            for(var x=-1; x<=1; ++x) {
                for(var y=-1; y<=1; ++y) {
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
    for(var i=0; i<rows; ++i) {
        for(var j=0; j<cols; j++) {
            if(nxtGrid[i][j] === 1) {
                getCell(i, j).style.backgroundColor = live_color;
            } else {
                getCell(i, j).style.backgroundColor = dead_color;
            }
        }
    }

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

    for(var i=0; i<rows; ++i) {
        for(var j=0; j<cols; j++) {
            grid[i][j] = 0;
            getCell(i, j).style.backgroundColor = dead_color;
        }
    }

    next.disabled = true;
    play.disabled = true;
    pause.disabled = true;
}

function getCell(i, j) {
    return document.getElementById(String(i) + ' ' + String(j));
}


// tutorial
const tutorial = document.getElementById('tutorial').querySelectorAll('div');
var page_no = 1;

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
