const Gameboard = (function () {
    const board = ["", "", "", "", "", "", "", "", ""];

    function getBoard() {
        return board;
    }

    function placeMarker(index, marker) {
        board[index] = marker;
    }

    function resetBoard() {
        for (let i = 0; i < board.length; i++) {
            board[i] = "";
        }
    }

    return { getBoard, placeMarker, resetBoard };
})();

function createPlayer(name, marker) {
    let score = 0;
    const getScore = () => score;
    const addScore = () => score++;
    return { name, marker, getScore, addScore };
}

const GameController = (function () {
    const player1 = createPlayer("A", "X");
    const player2 = createPlayer("B", "O");
    let activePlayer = player1;
    let gameOver = false;


    const winPatterns = [
        [0, 1, 2], [3, 4, 5], [6, 7, 8],
        [0, 3, 6], [1, 4, 7], [2, 5, 8],
        [0, 4, 8], [2, 4, 6]
    ];

    const getActivePlayer = () => activePlayer;

    const switchPlayer = () => {
        activePlayer = activePlayer === player1 ? player2 : player1;
    };

    const checkWinner = () => {
        const board = Gameboard.getBoard();
        for (const [a, b, c] of winPatterns) {
            if (board[a] !== "" && board[a] === board[b] && board[a] === board[c]) {
                return true;
            }
        }
        return false;
    };

    const playRound = (index) => {
        if (gameOver) {
            return;
        }

        if (Gameboard.getBoard()[index] !== "") {
            console.log("Cell taken");
            return;
        }

        Gameboard.placeMarker(index, getActivePlayer().marker);

        if (checkWinner()) {
            console.log(getActivePlayer().name + " wins");
            gameOver = true;
            return;
        }

        if (Gameboard.getBoard().every(cell => cell !== "")) {
            console.log("Tie");
            gameOver = true;
            return;
        }

        switchPlayer();
    };

    const resetGame = () => {
        Gameboard.resetBoard();
        gameOver = false;
        activePlayer = player1;
    };

    return { getActivePlayer, switchPlayer, playRound, checkWinner, resetGame };
})();

const displayController = (function () {
    const render = () => {
        const boardDiv = document.querySelector('#board');
        boardDiv.innerHTML = "";
        Gameboard.getBoard().forEach((cell) => {
            const btn = document.createElement("button");
            btn.textContent = cell;
            boardDiv.appendChild(btn);
        })
    };

    return { render };
})();

displayController.render();