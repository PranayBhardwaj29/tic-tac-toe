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
    const player1 = createPlayer("Player 1", "X");
    const player2 = createPlayer("Player 2", "O");
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
            getActivePlayer().addScore();
            gameOver = true;
            return getActivePlayer().name + " wins";
        }

        if (Gameboard.getBoard().every(cell => cell !== "")) {
            gameOver = true;
            return "Tie!";
        }

        switchPlayer();
    };

    const resetGame = () => {
        Gameboard.resetBoard();
        gameOver = false;
        activePlayer = player1;
    };

    const setPlayers = (name1, name2) => {
        player1.name = name1 || "Player 1";
        player2.name = name2 || "Player 2";
    };

    const isGameOver = () => gameOver;
    const getPlayers = () => [player1, player2];

    return { getActivePlayer, switchPlayer, playRound, checkWinner, resetGame, setPlayers, isGameOver, getPlayers };
})();

const displayController = (function () {
    const render = () => {
        const boardDiv = document.querySelector('#board');
        boardDiv.innerHTML = "";

        Gameboard.getBoard().forEach((cell, index) => {
            const btn = document.createElement("button");
            btn.dataset.index = index;
            btn.textContent = cell;
            btn.disabled = GameController.isGameOver() || cell !== "";
            btn.addEventListener("click", () => {
                const message = GameController.playRound(index);
                render();
                document.querySelector("#result").textContent = message || "";
            });
            boardDiv.appendChild(btn);
        });

        const [p1, p2] = GameController.getPlayers();
        document.querySelector("#turn").textContent = GameController.isGameOver()
            ? ""
            : GameController.getActivePlayer().name + "'s turn";
        document.querySelector("#scores").textContent =
            p1.name + ": " + p1.getScore() + " | " + p2.name + ": " + p2.getScore();
    };

    return { render };
})();

displayController.render();

document.querySelector("#restart").addEventListener("click", () => {
    GameController.resetGame();
    displayController.render();
    document.querySelector("#result").textContent = "";
});

document.querySelector("#start").addEventListener("click", () => {
    GameController.setPlayers(
        document.querySelector("#name1").value,
        document.querySelector("#name2").value
    );
    GameController.resetGame();
    displayController.render();
    document.querySelector("#result").textContent = "";
});