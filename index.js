// debugger;
const gridContainer = document.querySelector(".grid-container");
let cards = [];
let firstCard, secondCard;
let lockBoard = false;
let score = 0;
let timer;
let seconds = 45;

document.querySelector(".score").textContent = score;

fetch("./cards.json")
  .then((res) => res.json())
  .then((data) => {
    cards = [...data, ...data];
    console.log(cards.length);
    shuffleCards();
    generateCards();
    startTimer();
  });

  function startTimer() {
    timer = setInterval(() => {
      updateTimer();
      if (seconds <= 0) {
        clearInterval(timer);
        displayGameOver();
      }
    }, 1000);
  }

  function updateTimer() {
    seconds--;
    document.querySelector(".timer").textContent = seconds;
  }

  function displayGameOver() {
    alert("Game over! Your time is up. Restarting the game.");
    restart();
  }

function shuffleCards() {
  let currentIndex = cards.length,
    randomIndex,
    temporaryValue;
  while (currentIndex !== 0) {
    randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex -= 1;
    temporaryValue = cards[currentIndex];
    cards[currentIndex] = cards[randomIndex];
    cards[randomIndex] = temporaryValue;
  }
}

function generateCards() {
  for (let card of cards) {
    const cardElement = document.createElement("div");
    cardElement.classList.add("card");
    cardElement.setAttribute("data-name", card.name);
    cardElement.innerHTML = `
      <div class="front">
        <img class="front-image" src=${card.image} />
      </div>
      <div class="back"></div>
    `;
    gridContainer.appendChild(cardElement);
    cardElement.addEventListener("click", flipCard);
  }
}

function flipCard() {
  if (lockBoard) return;
  if (this === firstCard) return;

  this.classList.add("flipped");

  if (!firstCard) {
    firstCard = this;
    return;
  }

  secondCard = this;
  lockBoard = true;

  checkForMatch();
}


let remainingPairs = cards.length / 2;

function checkForMatch() {
  let isMatch = firstCard.dataset.name === secondCard.dataset.name;

  if (isMatch) {
    score++;
    document.querySelector(".score").textContent = score;
    disableCards();
    playSuccessSound();
    remainingPairs--;
    if (score === 6) {
        alert("Congratulations! You've successfully completed the game! please restart the game");
    }
  } else {
    unflipCards();
    playFailSound();
  }
}


function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

function disableCards() {
  firstCard.removeEventListener("click", flipCard);
  secondCard.removeEventListener("click", flipCard);

  resetBoard();
}

function unflipCards() {
  setTimeout(() => {
    firstCard.classList.remove("flipped");
    secondCard.classList.remove("flipped");
    resetBoard();
  }, 1000);
}

function resetBoard() {
  firstCard = null;
  secondCard = null;
  lockBoard = false;
}

function restart() {
  clearInterval(timer);
  resetBoard();
  shuffleCards();
  score = 0;
  seconds = 45; // Reset the timer to the initial value
  document.querySelector(".score").textContent = score;
  document.querySelector(".timer").textContent = seconds;
  gridContainer.innerHTML = "";
  generateCards();
  startTimer(); // Start the timer again
}


// sound
function playSuccessSound() {
  const successSound = document.getElementById("successSound");
  successSound.play();
}

function playFailSound() {
  const failSound = document.getElementById("failSound");
  failSound.play();
}
