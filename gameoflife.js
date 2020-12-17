function drawGrid(CELL_SIZE, CELL_BORDER, table) {
    // Draws an grid of cells of CELL_SIZE, separated by CELL_BORDER.
    // The grid contains an equal amount of rows and columns of table.length
    const canvas = document.getElementById("canvas");
    const canvasContext = canvas.getContext("2d");
    canvas.width = (CELL_SIZE + CELL_BORDER) * table.length;
    canvas.height = (CELL_SIZE + CELL_BORDER) * table.length;

    for (let col = 0; col < table.length; col++) {
        for (let row = 0; row < table.length; row++) {
            canvasContext.fillStyle = table[row][col] ? "green" : "lightgray";
            canvasContext.fillRect((col * (CELL_SIZE + CELL_BORDER)), (row * (CELL_SIZE + CELL_BORDER)), CELL_SIZE, CELL_SIZE);
        }
    }  
}

function updateGenNumber(offset) {
    const genSpan = document.getElementById("gen_number");
    const currentGen = parseInt(genSpan.innerHTML, 10);
    genSpan.innerHTML = currentGen + offset;
}

function updateCellNumber(offset) {
    const cellSpan = document.getElementById("cell_number");
    const currentCells = parseInt(cellSpan.innerHTML, 10);
    cellSpan.innerHTML = currentCells + offset;
}

function getTable(size) {
    // Returns a table(in this case an array of arrays) of size "size"
    const table = [];
    for (let i = 0; i < size; i++) {
    table[i] = Array(size);
    }

    return table;
}

function changeCellState(CELL_SIZE, CELL_BORDER) {
    return (x, y, table) => {
        // Enables or disables cell on coordinates (y, x)
        const cellCol = Math.floor(x / (CELL_SIZE + CELL_BORDER));
        const cellRow = Math.floor(y / (CELL_SIZE + CELL_BORDER));

        table[cellRow][cellCol] = !Boolean(table[cellRow][cellCol]);
        
        // Update cell count text
        updateCellNumber(table[cellRow][cellCol] ? 1 : -1);
    }
}

function changeGeneration(table) {
    // Table needs to be copied because the original one is modified during analysis.
    const tableCopy = [];
    
    for (let i = 0; i < table.length; i++) {
        tableCopy.push(table[i].slice());
    }
    
    const getCountNeighbors = (row, col) => {
        // rowLevels and colLevels contain, respectively, the possible adjacent rows and columns.
        // adjacentCells stores all values from the possible adjacent cells, true or false.
        // Finally, the return value is the amount of "true" values, equivalent to one neighbor for each "true".
        const rowLevels = [row - 1, row, row + 1].filter((val) => val >= 0 && val < tableCopy.length);
        const colLevels = [col - 1, col, col + 1].filter((val) => val >= 0 && val < tableCopy.length);
        const adjacentCells = [];
        
        for (let i = 0; i < rowLevels.length; i++) {
            for (let j = 0; j < colLevels.length; j++) {
                adjacentCells.push(tableCopy[rowLevels[i]][colLevels[j]]);
            }
        }
        
        const result = adjacentCells.reduce((count = 0, hasNeighbor) => count += hasNeighbor ? 1 : 0);
        
        // Removing one from the count result if it's alive, otherwise it will count itself as a neighbor
        return tableCopy[row][col] ? result - 1 : result;
    }
    
    let neighbors = 0;
    
    for (let row = 0; row < table.length; row++) {
        for (let col = 0; col < table.length; col++) {
            neighbors = getCountNeighbors(row, col);

            // If the current cell is dead, reproduction may occur if there are exactly 3 neighbors
            if (!table[row][col]) {
                if (neighbors == 3) {
                    table[row][col] = true;
                    updateCellNumber(1); // adds one to cell count text
                }
                continue;
            }
            
            // If the current cell is alive, it will die unless it has exactly 2 or 3 neighbors
            if (neighbors < 2 || neighbors > 3) {
                table[row][col] = false;
                updateCellNumber(-1); // removes one from cell count text
            }
        }
    }
    
    // Change generation text
    updateGenNumber(1);
}

window.onload = () => {
    const CELL_SIZE = 30;
    const CELL_BORDER = 2;
    const TABLE_SIZE = 12;
    
    let table = getTable(TABLE_SIZE);
    
    const canvas = document.getElementById("canvas");
    const nextGenButton = document.getElementById("next-btn");
    const skipGenButton = document.getElementById("skip-btn");
    const clearButton = document.getElementById("clear-btn");
    
    canvas.addEventListener("mousedown", (e) => {
        // offsetX and offsetY return the position of the mouse click relative to the canvas
        changeCellState(CELL_SIZE, CELL_BORDER)(e.offsetX, e.offsetY, table);
        drawGrid(CELL_SIZE, CELL_BORDER, table);
    })
    
    nextGenButton.addEventListener("click", () => {
        changeGeneration(table);
        drawGrid(CELL_SIZE, CELL_BORDER, table);
    })
    
    skipGenButton.addEventListener("click", () => {
        for (let i = 0; i < 10; i++) {
            changeGeneration(table);
        }
        drawGrid(CELL_SIZE, CELL_BORDER, table);
    })
    
    clearButton.addEventListener("click", () => {
        table = table.map((row) => row.map(() => false));
        drawGrid(CELL_SIZE, CELL_BORDER, table);
        
        // Also reset cell and gen count
        const cellSpan = document.getElementById("cell_number");
        const genSpan = document.getElementById("gen_number");
        cellSpan.innerHTML = 0;
        genSpan.innerHTML = 0;
    })
    drawGrid(CELL_SIZE, CELL_BORDER, table);
}