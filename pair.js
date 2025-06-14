const gameData = [
  {
    algorithm: "Summation",
    algorithmCode: "s := 0\nt.First()\n¬t.End() → s := s + f(t.Current())\n        t.Next()",
    description: "Given an enumerator and a function, calculate the sum of the function's values over the enumerator's elements.",
    hint: "This algorithm calculates a single value based on multiple elements. The result is a number.",
  },
  {
    algorithm: "Counting",
    algorithmCode: "c := 0\nt.First()\n¬t.End() → P(t.Current()) → c := c + 1\n        SKIP\n        t.Next()",
    description: "Given an enumerator and a condition, determine how many elements satisfy the condition.",
    hint: "This algorithm counts the elements that meet a condition.",
  },
  {
    algorithm: "Maximum Selection",
    algorithmCode: "t.First()\nmax, elem := f(t.Current()), t.Current()\nt.Next()\n¬t.End() → f(t.Current()) > max → max, elem := f(t.Current()), t.Current()\n        SKIP\n        t.Next()",
    description: "Given a non-empty enumerator and a function, find the element for which the function takes its maximum value.",
    hint: "This algorithm finds the 'best' element according to some criteria.",
  },
  {
    algorithm: "Selection",
    algorithmCode: "t.First()\nP(t.Current()) → t.Next()\nelem := t.Current()",
    description: "Given an enumerator and a condition, find the first element that satisfies the condition, assuming one exists.",
    hint: "This algorithm finds the first matching element when we know one exists.",
  },
  {
    algorithm: "Linear Search",
    algorithmCode: "l := false\nt.First()\n¬l ∧ ¬t.End() → elem := t.Current()\n        l := P(elem)\n        t.Next()",
    description: "Given an enumerator and a condition, find the first element that satisfies the condition (if any).",
    hint: "This algorithm searches for an element but may not find one.",
  },
  {
    algorithm: "Conditional Maximum Search",
    algorithmCode: "l := false\nt.First()\n¬t.End() → P(t.Current()) ∧ ¬l → l, max, elem := true, f(t.Current()), t.Current()\n        P(t.Current()) ∧ l ∧ f(t.Current()) > max → max, elem := f(t.Current()), t.Current()\n        SKIP\n        t.Next()",
    description: "Given an enumerator, a condition, and a function, find the element among those satisfying the condition for which the function is maximal.",
    hint: "This combines searching and maximum selection - it finds the maximum among certain elements.",
  },
];

let gameState = {
  score: 0,
  matches: 0,
  attempts: 0,
  selectedAlgorithm: null,
  selectedDescription: null,
  matchedPairs: new Set(),
  currentData: [],
  showingSolutions: false,
};

function shuffleArray(array) {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
}

function initializeGame() {
  gameState.currentData = [...gameData];
  const algorithms = shuffleArray(
    gameState.currentData.map((item) => ({
      name: item.algorithm,
      code: item.algorithmCode,
    }))
  );
  const descriptions = shuffleArray(
    gameState.currentData.map((item) => item.description)
  );

  const algorithmsContainer = document.getElementById("algorithms");
  const descriptionsContainer = document.getElementById("descriptions");

  algorithmsContainer.innerHTML = "";
  descriptionsContainer.innerHTML = "";

  algorithms.forEach((algorithm) => {
    const div = document.createElement("div");
    div.className = "item algorithm-item";
    div.innerHTML = `
      <div>${algorithm.name}</div>
      <div class="algorithm-code">${algorithm.code.replace(/\n/g, "<br>")}</div>
    `;
    div.onclick = () => selectAlgorithm(algorithm.name, div);
    algorithmsContainer.appendChild(div);
  });

  descriptions.forEach((description) => {
    const div = document.createElement("div");
    div.className = "item description-item";
    div.textContent = description;
    div.onclick = () => selectDescription(description, div);
    descriptionsContainer.appendChild(div);
  });

  updateStats();
  gameState.showingSolutions = false;
}

function selectAlgorithm(algorithm, element) {
  if (gameState.matchedPairs.has(algorithm) || gameState.showingSolutions) return;

  // Deselect any previously selected algorithm
  document.querySelectorAll(".algorithm-item").forEach((el) => el.classList.remove("selected"));

  // Select the clicked algorithm
  element.classList.add("selected");
  gameState.selectedAlgorithm = algorithm;

  // Provide visual feedback for selection
  showFeedback(`Selected Algorithm: ${algorithm}`, "success");
}

function selectDescription(description, element) {
  if (gameState.matchedPairs.has(description) || gameState.showingSolutions) return;

  // Deselect any previously selected description
  document.querySelectorAll(".description-item").forEach((el) => el.classList.remove("selected"));

  // Select the clicked description
  element.classList.add("selected");
  gameState.selectedDescription = description;

  // Provide visual feedback for selection
  showFeedback(`Selected Description: ${description}`, "success");
}

function checkMatch() {
  if (gameState.showingSolutions) {
    showFeedback("You need to start a new game after viewing the solutions!", "error");
    return;
  }

  if (!gameState.selectedAlgorithm || !gameState.selectedDescription) {
    showFeedback("Please select both an algorithm and a description!", "error");
    return;
  }

  gameState.attempts++;

  // Check if the selected algorithm and description form a correct pair
  const correctPair = gameState.currentData.find(
    (item) => item.algorithm === gameState.selectedAlgorithm
  );

  if (correctPair && correctPair.description === gameState.selectedDescription) {
    // Correct match
    gameState.score += 15;
    gameState.matches++;
    gameState.matchedPairs.add(gameState.selectedAlgorithm);
    gameState.matchedPairs.add(gameState.selectedDescription);

    // Mark the matched items
    document.querySelectorAll(".item.selected").forEach((el) => {
      el.classList.add("matched", "pulse");
      el.classList.remove("selected");
    });

    showFeedback("🎉 Correct match! Great job!", "success");

    // Check if all matches are found
    if (gameState.matches === gameState.currentData.length) {
      setTimeout(() => {
        showGameComplete();
      }, 1500);
    }
  } else {
    // Incorrect match
    gameState.score = Math.max(0, gameState.score - 3);
    showFeedback("❌ Incorrect match. Try again!", "error");

    // Deselect the items
    document.querySelectorAll(".item.selected").forEach((el) => el.classList.remove("selected"));
  }

  // Reset the selected algorithm and description
  gameState.selectedAlgorithm = null;
  gameState.selectedDescription = null;
  updateStats();
}

function showFeedback(message, type) {
  const feedback = document.getElementById("feedback");
  feedback.textContent = message;
  feedback.className = `feedback ${type}`;

  setTimeout(() => {
    if (!gameState.showingSolutions) {
      feedback.textContent = "";
      feedback.className = "feedback";
    }
  }, 4000);
}

function updateStats() {
  document.getElementById("score").textContent = gameState.score;
  document.getElementById("matches").textContent = gameState.matches;
  document.getElementById("attempts").textContent = gameState.attempts;

  const accuracy =
    gameState.attempts === 0
      ? 100
      : Math.round((gameState.matches / gameState.attempts) * 100);
  document.getElementById("accuracy").textContent = accuracy;
}

function showGameComplete() {
  const accuracy = Math.round((gameState.matches / gameState.attempts) * 100);
  const bonus =
    accuracy >= 90 ? 25 : accuracy >= 80 ? 15 : accuracy >= 70 ? 10 : 0;
  gameState.score += bonus;

  const gameComplete = document.createElement("div");
  gameComplete.className = "game-complete";
  gameComplete.innerHTML = `
    <h2>🏆 Congratulations!</h2>
    <p>You successfully matched all the programming algorithms!</p>
    <p><strong>Final Score:</strong> ${gameState.score} points</p>
    <p><strong>Accuracy:</strong> ${accuracy}%</p>
    <p><strong>Attempts:</strong> ${gameState.attempts}</p>
    ${
      bonus > 0
        ? `<p><strong>Bonus:</strong> +${bonus} points for high accuracy!</p>`
        : ""
    }
    <p style="margin-top: 15px; font-style: italic;">Programming algorithms are the foundation of efficient solutions!</p>
  `;

  document.querySelector(".game-container").appendChild(gameComplete);
  updateStats();

  // Add a pop-up message
  setTimeout(() => {
    alert("Amazing job! You completed the matching game! Thank you for playing you did a good job ❤️");
  }, 1000);
}

function newGame() {
  gameState = {
    score: 0,
    matches: 0,
    attempts: 0,
    selectedAlgorithm: null,
    selectedDescription: null,
    matchedPairs: new Set(),
    currentData: [],
    showingSolutions: false,
  };

  const existingComplete = document.querySelector(".game-complete");
  if (existingComplete) {
    existingComplete.remove();
  }

  document.getElementById("feedback").textContent = "";
  document.getElementById("feedback").className = "feedback";

  initializeGame();
}

window.onload = initializeGame;
