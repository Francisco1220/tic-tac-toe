// Represents the current state of the board
function gameBoard () {
    const board = [];
    const rows = 3;
    const columns = 3;
    
    // create the rows and columns of the board (3 rows and 3 columns)
    for (let i = 0; i < rows; i++) {
        board[i] = [];
        for (let b = 0; b < columns; b++) {
        board[i][b] = 0;
        }
    }
    const getBoard = () => board;
    const printBoard = () => console.log(board);
    printBoard();
    return {getBoard, printBoard}
}

// Will control the flow or logic of the game
function gameController () {
    const board = gameBoard();
    const {getBoard} = gameBoard();
    const players = [{
        name: "Player One",
        marker: "X",
    },
    {
        name: "Player Two",
        marker: "O",
    }
    ]
    // Set activePlayer to be playerOne by default
    let playerTurn = players[0];
    // Check the currently active player and switch player accordingly
    const switchPlayer = () => {
        playerTurn = playerTurn === players[0] ? players[1] : players[0];
      };
    // Users call playRound and enter row and column to make play
    function playRound(row, column) {
        let currentBoard = board.getBoard();
        // Check the available Cells in the gameboard
        if (currentBoard[row][column] === 0) {
            currentBoard[row][column] = playerTurn.marker;
            board.printBoard();
            checkWinner(row, column);
            switchPlayer();
        } else if (currentBoard[row][column] === "X" || currentBoard[row][column] === "O" ) {
            return console.log("Invalid Move. Please try again");
        }
        function checkWinner(row, column) {
            // Check for rows
            let winningPlayer;
            if (currentBoard[row][0] === playerTurn.marker && currentBoard[row][1] === playerTurn.marker && currentBoard[row][2] === playerTurn.marker) {
                console.log(`${playerTurn.name} is the Winner!`);
                winningPlayer = playerTurn.name;
            }
            // Check for columns
            if (currentBoard[0][column] === playerTurn.marker && currentBoard[1][column] === playerTurn.marker && currentBoard[2][column] === playerTurn.marker ) {
                console.log(`${playerTurn.name} is the Winner!`);
                winningPlayer = playerTurn.name;
            }
            // Check for diagonals
            if (currentBoard[0][0] === playerTurn.marker && currentBoard[1][1] === playerTurn.marker && currentBoard[2][2] === playerTurn.marker) {
                console.log(`${playerTurn.name} is the Winner!`);
                winningPlayer = playerTurn.name;
            }

        }
    }
    const getWinner = () => playerTurn.name;
    const getPlayerTurn = () => playerTurn;
    return {playRound, getPlayerTurn, getWinner, getBoard}
}

function displayController () {
    // game instance of gameController() moved within dislayController() since user will play through DOM
    const game = gameController();
    console.log(game);
    function updateGameboard () {
        // Grab all divs/cells and give them a data attribute to associate rows and columns, which will later be passed to playRound()
        const divs = document.querySelectorAll(".container > div");
        for (let i = 0; i < divs.length; i++) {
            // set data-row and data-column attributes
            if (i < 3) {
                divs[i].setAttribute("data-row", "0");
                divs[i].setAttribute("data-column", `${i}`);
            } else if (i === 3 || i < 6) {
                divs[i].setAttribute("data-row", "1");
                divs[i].setAttribute("data-column", `${i-3}`);
            } else if (i === 6 || i < 9) {
                divs[i].setAttribute("data-row", "2");
                divs[i].setAttribute("data-column", `${i-6}`);
            }
            divs[i].addEventListener("click", () => {
                // Get current board and the player's turn
                const board = game.getBoard();
                const playerTurn = game.getPlayerTurn();
                console.log(playerTurn.name);
                divs[i].innerHTML = playerTurn.marker;
                // Get row and column data attribute
                let getRow = Number(divs[i].getAttribute("data-row"));
                let getColumn = Number(divs[i].getAttribute("data-column"));
                game.playRound(getRow, getColumn);
            })
        }
     }
    updateGameboard();
};

displayController();





