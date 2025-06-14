// Romantic word list
const WORDS = [
  "HEART",
  "LOVER",
  "BLISS",
  "SWEET",
  "CHARM",
  "DREAM",
  "HONEY",
  "ANGEL",
];

const ROMANTIC_MESSAGES = [
  //   "My heart skips a beat! 💓",
  //   "You make my world brighter! ✨",
  //   "You're simply magical! 🌟",
  "I can't really explain it, I haven't got the words.",
];

const PUZZLES = [
  {
    groups: [
      {
        category: "Danish stuff ???? ig",
        words: ["HYGGE", "JYSK", "PASTRY", "STREETFOOD"],
        difficulty: "yellow",
        explanation: "ahaha im sorry 🇩🇰",
      },
      {
        category: "Food we had in Budapest",
        words: ["LANGOS", "CHIMNEY CAKE", "BOLOGNESE", "BALATON SZELET"],
        difficulty: "green",
        explanation: "Delicious memories from your Budapest trip! 🇭🇺",
      },
      {
        category: "Hungarian words you know",
        words: ["SZIA", "KÖSZI", "VISZLÁT", "IGEN"],
        difficulty: "blue",
        explanation: "Or not XD 🇭🇺",
      },
      {
        category: "What do you mean, what do you mean by shaking it",
        words: ["WHAT", "DO", "YOU", "MEAN"],
        difficulty: "purple",
        explanation: "What do you mean by shaking it 😂",
      },
    ],
  },
];

let currentWord = "";
let currentGuess = "";
let currentRow = 0;
let gameOver = false;
let keyboardState = {};
let currentPuzzle = 0;
let selectedWords = [];
let foundGroups = [];
let mistakes = 0;
let availableWords = [];

// Initialize game
function init() {
  createFloatingHearts();
  newWordleGame();
  addEventListeners();
}

function createFloatingHearts() {
  const heartsContainer = document.querySelector(".hearts-bg");
  for (let i = 0; i < 15; i++) {
    const heart = document.createElement("div");
    heart.className = "heart";
    heart.innerHTML = "💖";
    heart.style.left = Math.random() * 100 + "%";
    heart.style.top = Math.random() * 100 + "%";
    heart.style.animationDelay = Math.random() * 6 + "s";
    heart.style.animationDuration = 6 + Math.random() * 4 + "s";
    heartsContainer.appendChild(heart);
  }
}

function newWordleGame() {
  currentWord = WORDS[Math.floor(Math.random() * WORDS.length)];
  currentGuess = "";
  currentRow = 0;
  gameOver = false;
  keyboardState = {};

  // Reset board
  document.querySelectorAll(".tile").forEach((tile) => {
    tile.textContent = "";
    tile.className = "tile";
  });

  // Reset keyboard
  document.querySelectorAll(".key").forEach((key) => {
    key.className = key.classList.contains("wide") ? "key wide" : "key";
  });

  // Hide message
  document.getElementById("message").style.display = "none";

  console.log("New word:", currentWord); // For testing
}

function addEventListeners() {
  // Keyboard clicks
  document.querySelectorAll(".key").forEach((key) => {
    key.addEventListener("click", () => {
      handleKeyPress(key.dataset.key);
    });
  });

  // Physical keyboard
  document.addEventListener("keydown", (e) => {
    if (e.key === "Enter") {
      handleKeyPress("ENTER");
    } else if (e.key === "Backspace") {
      handleKeyPress("BACKSPACE");
    } else if (e.key.match(/[a-zA-Z]/)) {
      handleKeyPress(e.key.toUpperCase());
    }
  });
}

function handleKeyPress(key) {
  if (gameOver) return;

  if (key === "ENTER") {
    if (currentGuess.length === 5) {
      submitGuess();
    }
  } else if (key === "BACKSPACE") {
    if (currentGuess.length > 0) {
      currentGuess = currentGuess.slice(0, -1);
      updateDisplay();
    }
  } else if (key.match(/[A-Z]/) && currentGuess.length < 5) {
    currentGuess += key;
    updateDisplay();
  }
}

function updateDisplay() {
  const row = document.querySelectorAll(".row")[currentRow];
  const tiles = row.querySelectorAll(".tile");

  tiles.forEach((tile, index) => {
    if (index < currentGuess.length) {
      tile.textContent = currentGuess[index];
      tile.classList.add("filled");
    } else {
      tile.textContent = "";
      tile.classList.remove("filled");
    }
  });
}

function submitGuess() {
  const row = document.querySelectorAll(".row")[currentRow];
  const tiles = row.querySelectorAll(".tile");

  // Check each letter
  for (let i = 0; i < 5; i++) {
    const letter = currentGuess[i];
    const tile = tiles[i];

    setTimeout(() => {
      if (letter === currentWord[i]) {
        tile.classList.add("correct");
        keyboardState[letter] = "correct";
      } else if (currentWord.includes(letter)) {
        tile.classList.add("present");
        if (keyboardState[letter] !== "correct") {
          keyboardState[letter] = "present";
        }
      } else {
        tile.classList.add("absent");
        keyboardState[letter] = "absent";
      }

      updateKeyboard();
    }, i * 100);
  }

  // Check win/lose condition
  setTimeout(() => {
    if (currentGuess === currentWord) {
      showMessage(
        ROMANTIC_MESSAGES[Math.floor(Math.random() * ROMANTIC_MESSAGES.length)],
        "win"
      );
      gameOver = true;
    } else if (currentRow === 5) {
      showMessage(
        `The word was ${currentWord}. Better luck next time, sweetheart! 💕`,
        "lose"
      );
      gameOver = true;
    } else {
      currentRow++;
      currentGuess = "";
    }
  }, 500);
}

function updateKeyboard() {
  Object.keys(keyboardState).forEach((letter) => {
    const key = document.querySelector(`[data-key="${letter}"]`);
    if (key) {
      key.classList.remove("correct", "present", "absent");
      key.classList.add(keyboardState[letter]);
    }
  });
}

function showMessage(text, type) {
  const messageEl = document.getElementById("message");
  messageEl.textContent = text;
  messageEl.className = `message ${type}`;
  messageEl.style.display = "block";

  if (type === "win") {
    setTimeout(() => {
      alert("Congratulations! You completed the Wordle game! 🎉");
      startConnectionsGame();
    }, 2000); // Delay before launching the connections game
  } else if (type === "lose") {
    setTimeout(() => {
      alert("Game over! Better luck next time! 💔");
    }, 2000);
  }
}

function startConnectionsGame() {
  // Hide Wordle game elements
  document.querySelector(".game-board").style.display = "none";
  document.querySelector(".keyboard").style.display = "none";
  document.querySelector(".stats").style.display = "none";
  document.getElementById("message").style.display = "none";

  // Hide the subtitle
  document.querySelector(".subtitle").style.display = "none";

  // Show connections game
  const connectionsGame = document.getElementById("connections-game");
  connectionsGame.style.display = "block";

  initConnectionsGame();
}

function initConnectionsGame() {
  currentPuzzle = Math.floor(Math.random() * PUZZLES.length);
  selectedWords = [];
  foundGroups = [];
  mistakes = 0;
  gameOver = false;

  // Flatten all words from the current puzzle
  availableWords = [];
  PUZZLES[currentPuzzle].groups.forEach((group) => {
    availableWords.push(...group.words);
  });

  // Shuffle the words using Fisher-Yates algorithm
  for (let i = availableWords.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [availableWords[i], availableWords[j]] = [
      availableWords[j],
      availableWords[i],
    ];
  }

  renderConnectionsBoard();
  updateMistakes();
  document.getElementById("results").innerHTML = "";
  document.getElementById("status").innerHTML = "";
  updateSubmitButton();
}

function renderConnectionsBoard() {
  const board = document.getElementById("connections-board");
  board.innerHTML = "";

  availableWords.forEach((word) => {
    const tile = document.createElement("div");
    tile.className = "connection-tile";
    tile.textContent = word;

    // Check if this word is in a found group
    const foundGroup = foundGroups.find((group) => group.words.includes(word));
    if (foundGroup) {
      tile.classList.add("guessed");
      tile.style.background = getCategoryColor(foundGroup.difficulty);
      tile.style.color = getCategoryTextColor(foundGroup.difficulty);
      tile.onclick = null; // Disable clicking for guessed words
    } else {
      tile.onclick = () => toggleWord(word, tile); // Enable clicking for unguessed words
    }

    board.appendChild(tile);
  });
}

function getCategoryColor(difficulty) {
  switch (difficulty) {
    case "yellow":
      return "#fff3cd";
    case "green":
      return "#d4edda";
    case "blue":
      return "#d1ecf1";
    case "purple":
      return "#e2d4f0";
    default:
      return "#e9ecef"; // Default grey
  }
}

function getCategoryTextColor(difficulty) {
  switch (difficulty) {
    case "yellow":
      return "#856404";
    case "green":
      return "#155724";
    case "blue":
      return "#0c5460";
    case "purple":
      return "#4b0082";
    default:
      return "#6c757d"; // Default grey
  }
}

function toggleWord(word, tile) {
  if (gameOver) return;

  const index = selectedWords.indexOf(word);
  if (index > -1) {
    selectedWords.splice(index, 1);
    tile.classList.remove("selected");
  } else if (selectedWords.length < 4) {
    selectedWords.push(word);
    tile.classList.add("selected");
  }

  updateSubmitButton();
}

function updateSubmitButton() {
  const submitBtn = document.getElementById("submitBtn");
  submitBtn.disabled = selectedWords.length !== 4;
  submitBtn.onclick = submitConnectionsGuess; // Ensure it calls the correct function
}

function submitConnectionsGuess() {
  if (selectedWords.length !== 4 || gameOver) return;

  const correctGroup = PUZZLES[currentPuzzle].groups.find(
    (group) =>
      selectedWords.every((word) => group.words.includes(word)) &&
      selectedWords.length === 4
  );

  if (correctGroup) {
    // Correct guess!
    foundGroups.push(correctGroup);
    showResult(correctGroup);
    selectedWords = [];

    if (foundGroups.length === 4) {
      // Won the connections game!
      document.getElementById("status").innerHTML = "🎉 Perfect! ";
      document.getElementById("status").className = "status win";
      gameOver = true;

      // Redirect to pair.html after a short delay
      setTimeout(() => {
        window.location.href = "pair.html";
      }, 2000);
    }
  } else {
    // Wrong guess
    mistakes++;
    updateMistakes();
    shakeSelectedTiles();
    selectedWords = [];

    if (mistakes >= 4) {
      // Lost the connections game
      document.getElementById("status").innerHTML =
        "💔 Game over! Better luck next time, lovebirds!";
      document.getElementById("status").className = "status lose";
      gameOver = true;
      revealAnswers();
    }
  }

  renderConnectionsBoard();
  updateSubmitButton();
}

function shakeSelectedTiles() {
  const tiles = document.querySelectorAll(".connection-tile.selected");
  tiles.forEach((tile) => {
    tile.classList.add("shake");
    setTimeout(() => tile.classList.remove("shake"), 500);
  });
}

function updateMistakes() {
  const mistakeCountEl = document.getElementById("mistakeCount");
  if (mistakeCountEl) {
    mistakeCountEl.querySelector("span").textContent = 4 - mistakes;
  }

  for (let i = 1; i <= 4; i++) {
    const dot = document.getElementById(`dot${i}`);
    if (dot) {
      if (i <= mistakes) {
        dot.classList.add("filled");
      } else {
        dot.classList.remove("filled");
      }
    }
  }
}

function showResult(group) {
  const results = document.getElementById("results");
  const resultDiv = document.createElement("div");
  resultDiv.className = `result-group styled-result ${group.difficulty}`;
  resultDiv.innerHTML = `
      <div class="result-title">${group.category}</div>
      <div class="result-words">${group.words.join(", ")}</div>
      <div class="result-explanation">${group.explanation}</div>
    `;
  results.appendChild(resultDiv);
}

function revealAnswers() {
  const remainingGroups = PUZZLES[currentPuzzle].groups.filter(
    (group) => !foundGroups.includes(group)
  );
  remainingGroups.forEach((group) => showResult(group));
}

function shuffleBoard() {
  if (gameOver) return;

  // Get all words from current puzzle
  const allWords = [];
  PUZZLES[currentPuzzle].groups.forEach((group) => {
    allWords.push(...group.words);
  });

  // Filter out words that are already found
  const wordsToShuffle = allWords.filter(
    (word) => !foundGroups.some((group) => group.words.includes(word))
  );

  // Simple Fisher-Yates shuffle - this actually randomizes!
  for (let i = wordsToShuffle.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [wordsToShuffle[i], wordsToShuffle[j]] = [
      wordsToShuffle[j],
      wordsToShuffle[i],
    ];
  }

  // Update availableWords with shuffled order
  availableWords = wordsToShuffle;

  selectedWords = [];
  renderBoard();
  updateSubmitButton();
}

function restartConnectionsGame() {
  startConnectionsGame();
}

// Start the game
init();
