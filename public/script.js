const cells = document.querySelectorAll('.cell');
const statusText = document.getElementById('status');
const restartButton = document.getElementById('restart');

let board = ['', '', '', '', '', '', '', '', ''];
let currentPlayer = 'X';
let gameActive = true;

const winPatterns = [
  [0,1,2], [3,4,5], [6,7,8], // rows
  [0,3,6], [1,4,7], [2,5,8], // cols
  [0,4,8], [2,4,6]           // diagonals
];

function handleCellClick(e) {
  const index = e.target.getAttribute('data-index');
  if (board[index] !== '' || !gameActive) return;

  board[index] = currentPlayer;
  e.target.textContent = currentPlayer;
  checkWinner();
}

function checkWinner() {
  for (let pattern of winPatterns) {
    const [a, b, c] = pattern;
    if (board[a] && board[a] === board[b] && board[a] === board[c]) {
      statusText.textContent = `${currentPlayer} wins! 🎉`;
      gameActive = false;
      return;
    }
  }

  if (!board.includes('')) {
    statusText.textContent = "It's a draw!";
    gameActive = false;
    return;
  }

  currentPlayer = currentPlayer === 'X' ? 'O' : 'X';
  statusText.textContent = `${currentPlayer}'s Turn`;
}

function restartGame() {
  board = ['', '', '', '', '', '', '', '', ''];
  cells.forEach(cell => cell.textContent = '');
  currentPlayer = 'X';
  gameActive = true;
  statusText.textContent = `${currentPlayer}'s Turn`;
}

cells.forEach(cell => cell.addEventListener('click', handleCellClick));
restartButton.addEventListener('click', restartGame);

statusText.textContent = `${currentPlayer}'s Turn`;
