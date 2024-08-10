// Store board in array
function Gameboard() {
    const sideLen = 3
    const board = [];

    // Build 2D array representing game board
    for (let i = 0; i < sideLen; i++) {
        board[i] = [];
        for (let j = 0; j < sideLen; j++) {
            board[i].push(Cell());
        }
    }

    // Getter for gameBoard
    const getBoard = () => board;

    const getSideLen = () => sideLen;

    // Add function to edit cell
    const SetMarker = (row, column, player) => {
        const targetCell = board[row][column];

        // Check if cell is not taken
        if (targetCell.getValue() !== 0) return false;

        board[row][column].addMarker(player);
        return true;
    }


    // Prints board for console testing
    const printBoard = () => {
        const boardWithCellValues = board.map((row) => row.map((cell) => cell.getValue()))
        console.log(boardWithCellValues);
    };

    return {getSideLen, getBoard, SetMarker, printBoard};
}


// Individual cell in game
function Cell() {
    let value = 0;

    // Changes value of cell to player's
    const addMarker = (player) => {
        value = player;
    }

    const getValue = () => value;

    return {addMarker, getValue};
}


// Controls the Gameplay
function GameController(playerOneName = "Player One", playerTwoName = "PLayer Two") {
    const board = Gameboard();

    const players = [
        {
            name: playerOneName,
            marker: 1
        },
        {
            name: playerTwoName,
            marker: 2
        }
    ];

    let activePlayer = players[0];

    const switchPlayerTurn = () => {
        activePlayer = activePlayer === players[0] ? players[1] : players[0];
    }

    const getActivePlayer = () => activePlayer;

    const printNewRound = () => {
        board.printBoard();
        console.log(`${getActivePlayer().name}'s turn.`);
    };

    const playRound = (row, column) => {
        // If cell is taken, do nothing
        if (!board.SetMarker(row, column, getActivePlayer().marker)) return;

        console.log(`Placing ${getActivePlayer().name}'s marker on 
        row ${row}, column ${column}...`);

        // Checks if current player has won
        if (winCheck() === true) {
            console.log(`${getActivePlayer().name} Wins!!`)
        } else {
            // Check Full
            if (fullCheck()) {
                console.log(`Tie Game`);
            } else {
                switchPlayerTurn();
                printNewRound();
            }
        }
    }

    const winCheck = () => {
        const sideLen = board.getSideLen();
        const grid = board.getBoard(); 

        // Horizontal Win Condition
        for (let i = 0; i < sideLen; i++) {
            if (grid[i][0].getValue() === 0) continue;
            if (grid[i].every((col) => col.getValue() === grid[i][0].getValue())) {
                return true;
            }
        }

        // Vertical Win Condition
        for (let j = 0; j < sideLen; j++) {
            if (grid[0][j].getValue() === 0) continue;
            if (grid.every((row) => row[j].getValue() === grid[0][j].getValue())) {
                return true;
            }
        }

        // Diagonal Win Condition
        if (grid[0][0].getValue() !== 0) {
            if (grid.every((row) => row[grid.indexOf(row)].getValue() === grid[0][0].getValue())) {
                return true;
            }
        }
        if (grid[sideLen-1][0].getValue() !== 0) {
            if (grid.every((row) => row[Math.abs(grid.indexOf(row) - (sideLen-1))].getValue() 
                                    === grid[sideLen-1][0].getValue())) {
                return true;
            }
        }
            
        // No win found
        return false;
    }

    const fullCheck = () => {
        const grid = board.getBoard();
        return grid.every((row) => row.every((cell) => cell.getValue() !== 0));
    }

    // Initial play game message
    printNewRound();

    return {playRound, getActivePlayer};
}


const game = GameController();






