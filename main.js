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
    return {getBoard}
}

// Will control the flow or logic of the game
function gameController () {
    const board = gameBoard();
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
    let winningPlayer;
    let currentBoard;
    let invalid = false;
    function playRound(row, column) {
        currentBoard = board.getBoard();
        // Check the available Cells in the gameboard
        if (currentBoard[row][column] === 0) {
            currentBoard[row][column] = playerTurn.marker;
            checkWinner(row, column);
            switchPlayer();
            invalid = false;
        } else if (currentBoard[row][column] === "X" || currentBoard[row][column] === "O" ) {
            invalid = true;
        }
        function checkWinner(row, column) {
            // Check for rows
            if (currentBoard[row][0] === playerTurn.marker && currentBoard[row][1] === playerTurn.marker && currentBoard[row][2] === playerTurn.marker) {
                winningPlayer = playerTurn.name;
            }
            // Check for columns
            if (currentBoard[0][column] === playerTurn.marker && currentBoard[1][column] === playerTurn.marker && currentBoard[2][column] === playerTurn.marker ) {
                winningPlayer = playerTurn.name;
            }
            // Check for diagonals
            if (currentBoard[0][0] === playerTurn.marker && currentBoard[1][1] === playerTurn.marker && currentBoard[2][2] === playerTurn.marker) {
                winningPlayer = playerTurn.name;
            }

        }
    }
    const getWinner = () => winningPlayer;
    const getPlayerTurn = () => playerTurn;
    const getCurrentBoard = () => currentBoard;
    const getValidation = () => invalid;
    return {playRound, getPlayerTurn, getWinner, getCurrentBoard, players, getValidation}
}

function displayController () {
    // game instance of gameController() moved within dislayController() since user will play through DOM
    let game = gameController();
    let playerTurn;
    function updateGameboard () {
        // Grab all divs/cells and give them a data attribute to associate rows and columns, which will later be passed to playRound()
        const divs = document.querySelectorAll(".gameboard > div");
        const textDisplay = document.querySelector(".text-display > div");
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
                playerTurn = game.getPlayerTurn();
                // Get row and column data attribute
                let getRow = Number(divs[i].getAttribute("data-row"));
                let getColumn = Number(divs[i].getAttribute("data-column"));
                game.playRound(getRow, getColumn);
                let invalid = game.getValidation();
                let winningPlayer = game.getWinner();
                if (invalid === false) {
                    divs[i].innerHTML = playerTurn.marker;
                    if (playerTurn.marker === "X") {
                        divs[i].style.color = "blue";
                    } else {
                        divs[i].style.color = "red";
                    }
                    if (winningPlayer === undefined) {
                        textDisplay.innerHTML = "";
                    } else {
                        textDisplay.innerHTML = `${winningPlayer} is the Champ!`;
                    }
                } else if (invalid === true) {
                    textDisplay.innerHTML = "Invalid Move. Please try again."
                }
            })
        }
        const startBtn = document.querySelector("button:first-child");
        const p1Input = document.querySelector(".playerOneInput");
        const p2Input = document.querySelector(".playerTwoInput");
        function setStartBtn () {
            startBtn.addEventListener("click", () => {
                let playerOneName = p1Input.value;
                let playerTwoName = p2Input.value;
                game.players[0].name = playerOneName;
                game.players[1].name = playerTwoName;
                p1Input.value = "";
                p2Input.value = "";
                
            })
        }
        const restartBtn = document.querySelector("button:nth-child(2)");
        function setRestartBtn () {
            restartBtn.addEventListener("click", () => {
                // Clear gameboard
                const currentBoard = game.getCurrentBoard();
                for (let i = 0; i < currentBoard.length; i++) {
                    currentBoard[i][0] = "0";
                    currentBoard[i][1] = "0";
                    currentBoard[i][2] = "0";
                }
                // Clear divs of gameboard
                for (let i = 0; i < divs.length; i++) { 
                    divs[i].innerHTML = "";
                }
                // Clear textDisplay
                textDisplay.innerHTML = "";
                // restart game by reassigning game to new instance of game logic 
                game = gameController();
            })
        }
        setStartBtn();
        setRestartBtn();
     }
    updateGameboard();
};

displayController();

// Edit font style and color of markers(blue for player with "X" and red for player with "O")