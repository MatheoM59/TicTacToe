const GameBoard = (() => {
  // case du table
  const gameBoard = [1, 2, 3, 4, 5, 6, 7, 8, 9];
  // renvoie le tableau
  const getGameBoard = () => gameBoard;
  // modifie le tableau
  const editGameBoard = (index, marker) => {
    gameBoard[index] = marker;
  };

  return { getGameBoard, editGameBoard };
})();

const createPlayer = (name, marker) => {
  const getPlayerName = () => name;
  const getMarker = () => marker;
  return { getPlayerName, getMarker };
};

const Game = (() => {
  const player1 = createPlayer('Mathéo', 'X');
  const player2 = createPlayer('Matyas', 'O');
  let activePlayer = player1;
  let gameOver = false;

  const switchplayer = () => {
    activePlayer = activePlayer === player1 ? player2 : player1;
  };
  const endGame = () => {
    let board = GameBoard.getGameBoard();
    let gameStatus;

    if (
      (board[0] === board[1] && board[1] === board[2]) ||
      (board[3] === board[4] && board[4] === board[5]) ||
      (board[6] === board[7] && board[7] === board[8]) ||
      (board[0] === board[3] && board[3] === board[6]) ||
      (board[1] === board[4] && board[4] === board[7]) ||
      (board[2] === board[5] && board[5] === board[8]) ||
      (board[0] === board[4] && board[4] === board[8]) ||
      (board[2] === board[4] && board[4] === board[6])
    ) {
      gameStatus = 'end';
    } else {
      if (board.every((celle) => celle === 'X' || celle === 'O')) {
        gameStatus = 'draw';
      } else {
        gameStatus = 'continue';
      }
    }
    return gameStatus;
  };

  const playTurn = (index) => {
    if (gameOver) return;
    let result;
    GameBoard.editGameBoard(index, activePlayer.getMarker());
    if (endGame() === 'draw') {
      result = " It's a draw";
      gameOver = true;
    } else {
      if (endGame() === 'end') {
        result = activePlayer.getPlayerName() + ' Win';
        gameOver = true;
      } else {
        result = 'continue';
        switchplayer();
      }
    }
    return result;
  };

  return { playTurn };
})();
