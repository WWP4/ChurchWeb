const chefs = [
  {
    chef: "Ben",
    course: "Main Course",
    dish: "Creamy Mushroom Pappardelle with Roasted Chicken",
    chefImage: "assets/ben.jpg",
    dishImage: "assets/pappardelle.jpg"
  },
  {
    chef: "Sibling",
    course: "Appetizer",
    dish: "Ricotta Ravioli with Marinara",
    chefImage: "assets/sibling.jpg",
    dishImage: "assets/ravioli.jpg"
  },
  {
    chef: "Sibling 2",
    course: "Dessert",
    dish: "Vanilla Panna Cotta",
    chefImage: "assets/sibling2.jpg",
    dishImage: "assets/pannacotta.jpg"
  }
];

let currentChefIndex = 0;
let scores = [];
let currentSelections = {
  presentation: null,
  taste: null,
  creativity: null
};

/* -----------------------------
   ELEMENTS
----------------------------- */

const screens = {
  intro: document.getElementById("introScreen"),
  presentation: document.getElementById("presentationScreen"),
  judging: document.getElementById("judgingScreen"),
  result: document.getElementById("resultScreen"),
  winner: document.getElementById("winnerScreen")
};

const startExperienceBtn = document.getElementById("startExperienceBtn");
const beginJudgingBtn = document.getElementById("beginJudgingBtn");
const judgingForm = document.getElementById("judgingForm");
const nextChefBtn = document.getElementById("nextChefBtn");
const restartExperienceBtn = document.getElementById("restartExperienceBtn");

const roundStatusChip = document.getElementById("roundStatusChip");
const chefStatusChip = document.getElementById("chefStatusChip");

const presentationCourseLabel = document.getElementById("presentationCourseLabel");
const presentationChefName = document.getElementById("presentationChefName");
const presentationDishTitle = document.getElementById("presentationDishTitle");
const presentationChefImage = document.getElementById("presentationChefImage");
const presentationDishImage = document.getElementById("presentationDishImage");

const judgingChefLabel = document.getElementById("judgingChefLabel");
const judgingDishLabel = document.getElementById("judgingDishLabel");

const presentationScoreInput = document.getElementById("presentationScore");
const tasteScoreInput = document.getElementById("tasteScore");
const creativityScoreInput = document.getElementById("creativityScore");

const resultChefName = document.getElementById("resultChefName");
const resultDishName = document.getElementById("resultDishName");
const resultPresentationScore = document.getElementById("resultPresentationScore");
const resultTasteScore = document.getElementById("resultTasteScore");
const resultCreativityScore = document.getElementById("resultCreativityScore");
const resultTotalScore = document.getElementById("resultTotalScore");

const winnerChefName = document.getElementById("winnerChefName");
const winnerDishName = document.getElementById("winnerDishName");
const winnerDishImage = document.getElementById("winnerDishImage");
const winnerFinalScore = document.getElementById("winnerFinalScore");

/* -----------------------------
   HELPERS
----------------------------- */

function showScreen(screenKey) {
  Object.values(screens).forEach((screen) => {
    screen.classList.remove("is-active");
    screen.setAttribute("hidden", "");
  });

  screens[screenKey].classList.add("is-active");
  screens[screenKey].removeAttribute("hidden");

  if (window.AOS) {
    setTimeout(() => {
      AOS.refreshHard();
    }, 50);
  }
}

function getCurrentChef() {
  return chefs[currentChefIndex];
}

function updateTopbar() {
  const current = getCurrentChef();

  if (!current) return;

  const roundValue = roundStatusChip.querySelector(".status-chip__value");
  const chefValue = chefStatusChip.querySelector(".status-chip__value");

  if (roundValue) roundValue.textContent = current.course;
  if (chefValue) chefValue.textContent = current.chef;
}

function resetSelections() {
  currentSelections = {
    presentation: null,
    taste: null,
    creativity: null
  };

  presentationScoreInput.value = "";
  tasteScoreInput.value = "";
  creativityScoreInput.value = "";

  document.querySelectorAll(".score-group__buttons button").forEach((button) => {
    button.classList.remove("is-selected");
    button.setAttribute("aria-pressed", "false");
  });
}

function loadPresentationScreen() {
  const current = getCurrentChef();
  if (!current) return;

  updateTopbar();
  resetSelections();

  presentationCourseLabel.textContent = `${current.course} Round`;
  presentationChefName.textContent = current.chef;
  presentationDishTitle.textContent = current.dish;

  presentationChefImage.src = current.chefImage;
  presentationChefImage.alt = `${current.chef} portrait`;

  presentationDishImage.src = current.dishImage;
  presentationDishImage.alt = current.dish;

  judgingChefLabel.textContent = `Chef ${current.chef}`;
  judgingDishLabel.textContent = current.dish;

  showScreen("presentation");
}

function loadResultScreen(scoreEntry) {
  resultChefName.textContent = `Chef ${scoreEntry.chef}`;
  resultDishName.textContent = scoreEntry.dish;
  resultPresentationScore.textContent = scoreEntry.presentation;
  resultTasteScore.textContent = scoreEntry.taste;
  resultCreativityScore.textContent = scoreEntry.creativity;
  resultTotalScore.textContent = `${scoreEntry.total} / 15`;

  showScreen("result");
}

function showWinnerScreen() {
  if (!scores.length) return;

  const winner = [...scores].sort((a, b) => b.total - a.total)[0];

  winnerChefName.textContent = `Chef ${winner.chef}`;
  winnerDishName.textContent = winner.dish;
  winnerDishImage.src = winner.dishImage;
  winnerDishImage.alt = winner.dish;
  winnerFinalScore.textContent = `${winner.total} / 15`;

  showScreen("winner");
}

function saveCurrentScore() {
  const current = getCurrentChef();

  const presentation = Number(currentSelections.presentation);
  const taste = Number(currentSelections.taste);
  const creativity = Number(currentSelections.creativity);

  const total = presentation + taste + creativity;

  const entry = {
    chef: current.chef,
    course: current.course,
    dish: current.dish,
    chefImage: current.chefImage,
    dishImage: current.dishImage,
    presentation,
    taste,
    creativity,
    total
  };

  scores.push(entry);
  return entry;
}

function allScoresSelected() {
  return (
    currentSelections.presentation !== null &&
    currentSelections.taste !== null &&
    currentSelections.creativity !== null
  );
}

/* -----------------------------
   SCORE BUTTONS
----------------------------- */

function setupScoreButtons() {
  const scoreButtons = document.querySelectorAll(".score-group__buttons button");

  scoreButtons.forEach((button) => {
    button.setAttribute("aria-pressed", "false");

    button.addEventListener("click", () => {
      const category = button.dataset.category;
      const value = button.dataset.value;

      if (!category || !value) return;

      const group = button.closest(".score-group");
      if (!group) return;

      group.querySelectorAll("button").forEach((btn) => {
        btn.classList.remove("is-selected");
        btn.setAttribute("aria-pressed", "false");
      });

      button.classList.add("is-selected");
      button.setAttribute("aria-pressed", "true");

      currentSelections[category] = value;

      if (category === "presentation") {
        presentationScoreInput.value = value;
      }

      if (category === "taste") {
        tasteScoreInput.value = value;
      }

      if (category === "creativity") {
        creativityScoreInput.value = value;
      }
    });
  });
}

/* -----------------------------
   EVENT HANDLERS
----------------------------- */

if (startExperienceBtn) {
  startExperienceBtn.addEventListener("click", () => {
    currentChefIndex = 0;
    scores = [];
    loadPresentationScreen();
  });
}

if (beginJudgingBtn) {
  beginJudgingBtn.addEventListener("click", () => {
    showScreen("judging");
  });
}

if (judgingForm) {
  judgingForm.addEventListener("submit", (event) => {
    event.preventDefault();

    if (!allScoresSelected()) {
      alert("Please select a score for presentation, taste, and creativity.");
      return;
    }

    const entry = saveCurrentScore();
    loadResultScreen(entry);
  });
}

if (nextChefBtn) {
  nextChefBtn.addEventListener("click", () => {
    currentChefIndex += 1;

    if (currentChefIndex >= chefs.length) {
      showWinnerScreen();
      return;
    }

    loadPresentationScreen();
  });
}

if (restartExperienceBtn) {
  restartExperienceBtn.addEventListener("click", () => {
    currentChefIndex = 0;
    scores = [];
    resetSelections();
    updateTopbar();
    showScreen("intro");
  });
}

/* -----------------------------
   INIT
----------------------------- */

setupScoreButtons();
updateTopbar();
showScreen("intro");

if (window.AOS) {
  AOS.init({
    duration: 900,
    easing: "cubic-bezier(0.22, 1, 0.36, 1)",
    once: true,
    offset: 40
  });
}
