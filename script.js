const GameBoard = (() => {
  const gameBoard = [1, 2, 3, 4, 5, 6, 7, 8, 9];

  const getGameBoard = () => gameBoard;

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

  const getActivePlayer = () => activePlayer;

  const switchplayer = () => {
    activePlayer = activePlayer === player1 ? player2 : player1;
  };

  const endGame = () => {
    const board = GameBoard.getGameBoard();
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
      return 'end';
    }
    if (board.every((cell) => cell === 'X' || cell === 'O')) {
      return 'draw';
    }
    return 'continue';
  };

  const playTurn = (index) => {
    if (gameOver) return;
    let result;
    GameBoard.editGameBoard(index, activePlayer.getMarker());
    if (endGame() === 'draw') {
      result = 'draw';
      gameOver = true;
    } else if (endGame() === 'end') {
      result = 'Win';
      gameOver = true;
    } else {
      result = 'continue';
      switchplayer();
    }
    return result;
  };

  return { playTurn, getActivePlayer };
})();

const displayController = (() => {
  const container = document.querySelector('.game');
  const resultContainer = document.querySelector('.result');

  const display = () => {
    GameBoard.getGameBoard().forEach((cell, i) => {
      const displayBoard = document.createElement('div');
      displayBoard.setAttribute('id', i);
      displayBoard.innerHTML = `<p>${cell}</p>`;
      displayBoard.addEventListener('click', () => {
        if (
          GameBoard.getGameBoard()[i] === 'X' ||
          GameBoard.getGameBoard()[i] === 'O'
        )
          return;

        const result = Game.playTurn(i);
        if (!result) return;

        container.innerHTML = '';
        displayController.display();

        if (result.includes('Win')) {
          const displayResult = document.createElement('div');
          displayResult.innerHTML = `<h2>Resultat : ${Game.getActivePlayer().getPlayerName()} ${result}</h2>`;
          resultContainer.appendChild(displayResult);
        }
        if (result.includes('draw')) {
          const displayResult = document.createElement('div');
          displayResult.innerHTML = `<h2>Resultat : ${result}</h2>`;
          resultContainer.appendChild(displayResult);
        }
      });
      container.appendChild(displayBoard);
    });
  };

  const displayDialog = () => {
    const popUp = document.getElementById('dialog');
    // const input1 = document.getElementById('name1');
    // const input2 = document.getElementById('name2');
    // const btn = document.getElementsById('submit');
    popUp.showModal();
    // btn.addEventListener('click', () => {
    //   popUp.close();
    // });
  };

  return { display, displayDialog };
})();

displayController.display();
displayController.displayDialog();
