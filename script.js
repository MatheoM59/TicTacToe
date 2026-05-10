const GameBoard = (() => {
  const gameBoard = [1, 2, 3, 4, 5, 6, 7, 8, 9];

  const getGameBoard = () => gameBoard;

  const editGameBoard = (index, marker) => {
    gameBoard[index] = marker;
  };

  const resetGameBoard = () => {
    gameBoard.forEach((_, i) => editGameBoard(i, i + 1));
  };

  return { getGameBoard, editGameBoard, resetGameBoard };
})();

const Game = (() => {
  let player1, player2, activePlayer;
  let gameOver = false;
  let gameActive = false;

  const createPlayer = (name, marker) => {
    const getPlayerName = () => name;
    const getMarker = () => marker;
    return { getPlayerName, getMarker };
  };
  const init = (nom1, nom2) => {
    player1 = createPlayer(nom1, 'X');
    player2 = createPlayer(nom2, 'O');
    activePlayer = player1;
  };

  const reset = () => {
    gameOver = false;
    activePlayer = player1;
  };

  const getPlayer1 = () => player1.getPlayerName();
  const getPlayer2 = () => player2.getPlayerName();
  const getActivePlayer = () => activePlayer;
  const getGameActive = () => gameActive;

  const setGameActive = (value) => {
    gameActive = value;
  };

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
    if (!gameActive) return;
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

  return {
    init,
    reset,
    playTurn,
    getActivePlayer,
    getGameActive,
    setGameActive,
    getPlayer1,
    getPlayer2,
  };
})();

const displayController = (() => {
  const nameSlot1 = document.querySelector('.nameSlot1');
  const nameSlot2 = document.querySelector('.nameSlot2');
  const playerTurnContainer = document.querySelector('.playerTurn');
  const container = document.querySelector('.game');
  const resultContainer = document.querySelector('.result');
  const startBtn = document.getElementById('start');
  let gameStatus = Game.getGameActive();

  const display = () => {
    playerTurnContainer.innerHTML = '';
    const playerTurnSlot = document.createElement('div');
    playerTurnSlot.innerHTML = `<p>${Game.getActivePlayer().getPlayerName()}'s turn</p>`;
    playerTurnContainer.appendChild(playerTurnSlot);

    nameSlot1.innerHTML = '';
    nameSlot2.innerHTML = '';
    const name1 = document.createElement('div');
    name1.innerHTML = `<p>${Game.getPlayer1()}</p>`;
    const name2 = document.createElement('div');
    name2.innerHTML = `<p>${Game.getPlayer2()}</p>`;
    nameSlot1.appendChild(name1);
    nameSlot2.appendChild(name2);

    GameBoard.getGameBoard().forEach((cell, i) => {
      const displayBoard = document.createElement('div');
      displayBoard.setAttribute('id', i);
      displayBoard.innerHTML = `<p>${typeof cell === 'number' ? '' : cell}</p>`;

      displayBoard.addEventListener('click', () => {
        if (
          GameBoard.getGameBoard()[i] === 'X' ||
          GameBoard.getGameBoard()[i] === 'O'
        )
          return;

        const result = Game.playTurn(i);
        if (!result) return;

        container.innerHTML = '';
        display();

        if (result.includes('Win')) {
          const displayResult = document.createElement('div');
          displayResult.innerHTML = `<h2>Result: ${Game.getActivePlayer().getPlayerName()} ${result}</h2>`;
          resultContainer.appendChild(displayResult);
        }
        if (result.includes('draw')) {
          const displayResult = document.createElement('div');
          displayResult.innerHTML = `<h2>Result: ${result}</h2>`;
          resultContainer.appendChild(displayResult);
        }
      });

      container.appendChild(displayBoard);
    });
  };

  const displayDialog = () => {
    const popUp = document.getElementById('dialog');
    popUp.addEventListener('keydown', (event) => {
      if (event.key === 'Escape') event.preventDefault();
    });
    popUp.showModal();
  };

  const playerCreation = () => {
    const btn = document.getElementById('submit');
    btn.addEventListener('click', (event) => {
      event.preventDefault();
      const nom1 = document.getElementById('name1').value.trim();
      const nom2 = document.getElementById('name2').value.trim();

      if (!nom1 || !nom2) return;

      Game.init(nom1, nom2);

      document.getElementById('dialog').close();
      display();
    });
  };

  startBtn.addEventListener('click', () => {
    if (gameStatus === false) {
      Game.setGameActive(true);
      gameStatus = true;
      startBtn.innerHTML = 'Restart';
    } else if (gameStatus === true) {
      resultContainer.innerHTML = '';
      GameBoard.resetGameBoard();
      Game.reset();
      container.innerHTML = '';
      display();
    }
  });

  return { display, displayDialog, playerCreation };
})();

displayController.playerCreation();
displayController.displayDialog();
