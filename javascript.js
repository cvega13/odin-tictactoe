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
        if (targetCell.getValue() !== "") return false;

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
    let value = "";

    // Changes value of cell to player's
    const addMarker = (player) => {
        value = player;
    }

    const getValue = () => value;

    return {addMarker, getValue};
}


// Controls the Gameplay
function GameController(playerOneName = "Player One", playerTwoName = "Player Two") {
    const board = Gameboard();

    const players = [
        {
            name: playerOneName,
            marker: "X"
        },
        {
            name: playerTwoName,
            marker: "O"
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
            return "Win";
        } else {
            // Check Full
            if (fullCheck()) {
                console.log(`Tie Game`);
                return "Tie";
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
            if (grid[i][0].getValue() === "") continue;
            if (grid[i].every((col) => col.getValue() === grid[i][0].getValue())) {
                return true;
            }
        }

        // Vertical Win Condition
        for (let j = 0; j < sideLen; j++) {
            if (grid[0][j].getValue() === "") continue;
            if (grid.every((row) => row[j].getValue() === grid[0][j].getValue())) {
                return true;
            }
        }

        // Diagonal Win Condition
        if (grid[0][0].getValue() !== "") {
            if (grid.every((row) => row[grid.indexOf(row)].getValue() === grid[0][0].getValue())) {
                return true;
            }
        }
        if (grid[sideLen-1][0].getValue() !== "") {
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
        return grid.every((row) => row.every((cell) => cell.getValue() !== ""));
    }

    // Initial play game message
    printNewRound();

    return {playRound, getActivePlayer, getBoard: board.getBoard};
}

function ScreenController() {
    let playerOneName = "";
    let playerTwoName = "";
    let game = null;
    const playerTurnDiv = document.querySelector('.turn');
    const boardDiv =  document.querySelector('.board');
    const outcomeDiv = document.querySelector('.outcome');
    const startButton = document.querySelector('.start');
    const resetButton = document.querySelector('.reset');
    let gameEnd = false;

    const updateScreen = () => {
        // clear the board
        boardDiv.textContent = "";

        // get current status of game
        const board = game.getBoard();
        const activePlayer = game.getActivePlayer();

        playerTurnDiv.textContent = `${activePlayer.name}'s turn...`

        board.forEach((row, rowIndex) => {
            row.forEach((cell, cellIndex) => {
                const cellButton = document.createElement("button");
                cellButton.classList.add('cell');

                cellButton.dataset.row = rowIndex;
                cellButton.dataset.column = cellIndex;
                cellButton.textContent = cell.getValue();
                boardDiv.appendChild(cellButton);
            })
        })
    }

    function clickHandlerBoard(e) {
        if (gameEnd === true) return;

        const selectedRow = e.target.dataset.row;
        const selectedColumn = e.target.dataset.column;
        
        if (!selectedRow || !selectedColumn) return;
    
        const outcome = game.playRound(selectedRow, selectedColumn);
        updateScreen();
        if (outcome === "Win") {
            gameEnd = true;
            outcomeDiv.textContent = `${game.getActivePlayer().name} Wins!`;
        } else if (outcome === "Tie") {
            gameEnd = true;
            outcomeDiv.textContent = `Tie Game!`;
        }
        
    }
    boardDiv.addEventListener("click", clickHandlerBoard);

    function startHandlerButton() {
        playerOneName = document.querySelector("#playerOne").value;
        playerTwoName = document.querySelector("#playerTwo").value;

        if (playerOneName.length == 0 || playerOneName.length == 0) return;

        game = GameController(playerOneName, playerTwoName);
        updateScreen();
    }
    startButton.addEventListener("click", startHandlerButton);

    function resetHandlerButton() {
        if (playerOneName.length == 0 || playerOneName.length == 0) return;

        game = GameController(playerOneName, playerTwoName);
        updateScreen();
    }
    resetButton.addEventListener("click", resetHandlerButton);
}

ScreenController();




