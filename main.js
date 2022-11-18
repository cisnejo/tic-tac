import "./style.css";
import javascriptLogo from "./javascript.svg";
import { setupCounter } from "./counter.js";

const Board = () => {
  let players = { player1: null, player2: null };
  let playerTurn;
  let inPlay = true;
  let currentTurn = "X";
  // The board state that contains player moves and updates on turns
  let boardState = [null, null, null, null, null, null, null, null, null];
  //Start the game
  const StartGame = (player1, player2) => {
    players = { player1, player2 };
    playerTurn = players.player1;
    createBoard();
    displayTurn();
  };

  const displayTurn = () => {
    const turnDisplay = document.querySelector(".turn_display");
    if (inPlay) {
      turnDisplay.textContent = `Player Turn : ${playerTurn.name}`;
    } else {
      turnDisplay.textContent = `Player Turn : -`;
    }
  };

  //Change from "X" to "O" (Player 1 to Player 2)
  const changeTurn = () => {
    playerTurn =
      playerTurn == players.player1 ? players.player2 : players.player1;
    currentTurn = currentTurn == "X" ? "O" : "X";
    displayTurn();
  };

  const CheckGameOver = () => {
    //Transform boardState into 3x3 matrix, each array represents a row
    const rows = boardState.reduce(
      (acc, curr, index) => {
        acc[Math.floor(index / 3)].push(curr);
        return acc;
      },
      [[], [], []]
    );
    //Transform boardState into 3x3 matrix, each array represents a column
    const columns = boardState.reduce(
      (acc, curr, index) => {
        acc[index % 3].push(curr);
        return acc;
      },
      [[], [], []]
    );

    const diagonals = [
      [boardState[0], boardState[4], boardState[8]],
      [boardState[2], boardState[4], boardState[6]],
    ];

    // Checks to see if any arrays contain either "X" or "O"
    const TestForWin = (transposedBoard) => {
      return transposedBoard.map((board_array) => {
        if (board_array.includes(null)) return false;
        return board_array.every((val, i, arr) => val === arr[0]);
      });
    };

    const gameEndHeading = document.querySelector(".winner-heading");
    // If there is any row/column/diagonal that is "true" (contains 3 "X"s or "O"s) then declare a winner
    if (
      TestForWin(rows).includes(true) ||
      TestForWin(columns).includes(true) ||
      TestForWin(diagonals).includes(true)
    ) {
      gameEndHeading.innerText = `WINNER:${playerTurn.name}`;
      inPlay = false;
      return;
    }
    //cat's game
    if (!boardState.includes(null)) {
      inPlay = false;
      gameEndHeading.innerText = "TIE";
    }
  };
  //Create the board
  const createBoard = () => {
    //Instantiate board element
    const dom_board = document.querySelector(".board");
    //Add boxes to the board and give them classes
    boardState.forEach((state, index) => {
      const box_div = document.createElement("div");
      box_div.classList = `box box-${(index % 2) + 1}`;
      dom_board.appendChild(box_div);
      // On click, update game state and check for winner
      box_div.addEventListener("click", (e) => {
        if (!boardState[index] && inPlay) {
          boardState[index] = currentTurn;
          box_div.innerText = currentTurn;
          CheckGameOver();
          changeTurn();
        }
      });
    });
  };

  const ResetGame = () => {
    const gameEndHeading = document.querySelector(".winner-heading");
    const boxes = document.querySelectorAll(".box");
    boardState = [null, null, null, null, null, null, null, null, null];
    currentTurn = "X";
    inPlay = true;
    boxes.forEach((box) => (box.innerText = ""));
    gameEndHeading.innerText = "";
    playerTurn = players.player1;
    displayTurn();
  };

  document.querySelector(".reset-btn").addEventListener("click", (e) => {
    ResetGame();
  });

  return {
    get currentTurn() {
      return currentTurn;
    },
    changeTurn,
    get boardState() {
      return boardState;
    },
    get inPlay() {
      return inPlay;
    },
    displayTurn,
    createBoard,
    StartGame,
    get playerTurn() {
      return playerTurn;
    },
  };
};

const Player = (name) => {
  const change = () => {
    board.playerTurn = name;
  };

  return { name, change };
};

let player_1 = Player("");
let player_2 = Player("");

let board = Board();

document.querySelector("form").addEventListener("submit", (e) => {
  e.preventDefault();
  player_1.name = document.getElementById("player_1").value;
  player_2.name = document.getElementById("player_2").value;
  board.StartGame(player_1, player_2);
});
