const board = document.getElementById("game-board");
const movesSpan = document.getElementById("moves");
const matchesSpan = document.getElementById("matches");
const timerSpan = document.getElementById("timer");
const difficultySelect = document.getElementById("difficulty");
const currentPlayerSpan = document.getElementById("current-player");
const modeSelect = document.getElementById("mode");
 
let firstCard, secondCard;
let lockBoard = false;
let moves = 0;
let matches = 0;
let timer = 0;
let timerInterval;
let currentPlayer = 1;
let isMultiplayer = false;
 
// Ícones literários
const icons = [
  "https://i.pinimg.com/736x/be/7a/d2/be7ad2d0df5aa944469e6a28ec1c144a.jpg",
  "https://i.pinimg.com/1200x/bc/7e/cb/bc7ecb2944d054287273829142b9e855.jpg",
  "https://i.pinimg.com/1200x/cf/ed/c7/cfedc7397f882510bb4211308535aafb.jpg",
  "https://i.pinimg.com/1200x/ed/74/9a/ed749a1a40ce9fecd156c5026b760d35.jpg",
  "https://i.pinimg.com/736x/29/3c/f4/293cf4c0f9cf5af7f8d040761f453764.jpg",
  "https://i.pinimg.com/736x/ac/f1/df/acf1df9855e20f33fbc10aad5f428973.jpg",
  "https://i.pinimg.com/736x/d0/db/2d/d0db2dc0fd39effce3d3d39fd73ffbdf.jpg",
  "https://i.pinimg.com/736x/aa/1e/1e/aa1e1e9b25f24e331aee3677aec5d86d.jpg"
];
 
// Função para mudar o modo
function switchMode() {
  isMultiplayer = modeSelect.value === "multi";
  restartGame();
}
 
// Criar cartas de acordo com a dificuldade
function generateCards() {
  const qtd = parseInt(difficultySelect.value);
  let selected = icons.slice(0, qtd);
  let cards = [...selected, ...selected];
  shuffle(cards);
  return cards;
}
 
// Embaralhar
function shuffle(array) {
  array.sort(() => Math.random() - 0.5);
}
 
// Criar tabuleiro
function createBoard() {
  board.innerHTML = "";
  let cards = generateCards();
  cards.forEach(img => {
    const card = document.createElement("div");
    card.classList.add("card");
    card.innerHTML = `
      <div class="front"><img src="${img}" alt="ícone"></div>
      <div class="back">?</div>
    `;
    card.addEventListener("click", flipCard);
    board.appendChild(card);
  });
}
 
// Virar carta
function flipCard() {
  if (lockBoard) return;
  if (this === firstCard) return;
  this.classList.add("flipped");
 
  if (!firstCard) {
    firstCard = this;
    return;
  }
 
  secondCard = this;
  moves++;
  movesSpan.textContent = moves;
  checkMatch();
}
 
// Verificar par
function checkMatch() {
  const isMatch = firstCard.querySelector(".front img").src === secondCard.querySelector(".front img").src;
  if (isMatch) {
    matches++;
    matchesSpan.textContent = matches;
    resetTurn();
    const totalPairs = parseInt(difficultySelect.value);
    if (matches === totalPairs) {
      clearInterval(timerInterval);
      setTimeout(() => alert(`🎉 Fim de jogo! Jogador ${currentPlayer} venceu em ${moves} movimentos e ${timer} segundos!`), 500);
    }
  } else {
    lockBoard = true;
    setTimeout(() => {
      firstCard.classList.remove("flipped");
      secondCard.classList.remove("flipped");
      resetTurn();
      switchPlayer();
    }, 1000);
  }
}
 
// Alternar jogador
function switchPlayer() {
  if (!isMultiplayer) return; // Se não for multiplayer, não alterna
  currentPlayer = currentPlayer === 1 ? 2 : 1;
  currentPlayerSpan.textContent = currentPlayer;
}
 
// Resetar turno
function resetTurn() {
  [firstCard, secondCard] = [null, null];
  lockBoard = false;
}
 
// Reiniciar jogo
function restartGame() {
  clearInterval(timerInterval);
  timer = 0;
  timerSpan.textContent = timer;
  moves = 0;
  matches = 0;
  currentPlayer = 1;
  movesSpan.textContent = moves;
  matchesSpan.textContent = matches;
  currentPlayerSpan.textContent = currentPlayer;
  createBoard();
 
  // Iniciar cronômetro
  timerInterval = setInterval(() => {
    timer++;
    timerSpan.textContent = timer;
  }, 1000);
}
 
// Início
restartGame();