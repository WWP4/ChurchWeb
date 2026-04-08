
const dishes = [];
const courses = ["Appetizer", "Main Course", "Dessert"];
let currentCourseIndex = 0;

const chefName = document.getElementById("chefName");
const dishName = document.getElementById("dishName");
const courseSelect = document.getElementById("courseSelect");
const taste = document.getElementById("taste");
const presentation = document.getElementById("presentation");
const creativity = document.getElementById("creativity");
const energy = document.getElementById("energy");
const notes = document.getElementById("notes");

const presentDishBtn = document.getElementById("presentDishBtn");
const addDishBtn = document.getElementById("addDishBtn");
const clearBtn = document.getElementById("clearBtn");
const nextCourseBtn = document.getElementById("nextCourseBtn");
const revealWinnerBtn = document.getElementById("revealWinnerBtn");

const leaderboard = document.getElementById("leaderboard");
const judgedDishes = document.getElementById("judgedDishes");
const winnerPreview = document.getElementById("winnerPreview");

const currentCourseChip = document.getElementById("currentCourseChip");
const dishCountChip = document.getElementById("dishCountChip");

const revealOverlay = document.getElementById("revealOverlay");
const closeOverlayBtn = document.getElementById("closeOverlayBtn");
const scoreReveal = document.getElementById("scoreReveal");

const overlayCourse = document.getElementById("overlayCourse");
const overlayChef = document.getElementById("overlayChef");
const overlayDish = document.getElementById("overlayDish");
const overlayTaste = document.getElementById("overlayTaste");
const overlayPresentation = document.getElementById("overlayPresentation");
const overlayCreativity = document.getElementById("overlayCreativity");
const overlayEnergy = document.getElementById("overlayEnergy");
const overlayTotal = document.getElementById("overlayTotal");

const winnerOverlay = document.getElementById("winnerOverlay");
const winnerDishName = document.getElementById("winnerDishName");
const winnerChefName = document.getElementById("winnerChefName");
const winnerScore = document.getElementById("winnerScore");
const closeWinnerOverlayBtn = document.getElementById("closeWinnerOverlayBtn");

function getFormData() {
  const chef = chefName.value.trim();
  const dish = dishName.value.trim();
  const course = courseSelect.value;
  const t = Number(taste.value);
  const p = Number(presentation.value);
  const c = Number(creativity.value);
  const e = Number(energy.value);
  const comment = notes.value.trim();

  if (!chef || !dish) {
    alert("Add both the chef name and dish name.");
    return null;
  }

  const values = [t, p, c, e];
  const validScores = values.every(v => Number.isFinite(v) && v >= 1 && v <= 10);

  if (!validScores) {
    alert("All scores need to be between 1 and 10.");
    return null;
  }

  return {
    chef,
    dish,
    course,
    taste: t,
    presentation: p,
    creativity: c,
    energy: e,
    notes: comment,
    total: t + p + c + e,
    id: Date.now()
  };
}

function clearForm() {
  chefName.value = "";
  dishName.value = "";
  taste.value = 10;
  presentation.value = 10;
  creativity.value = 10;
  energy.value = 10;
  notes.value = "";
  chefName.focus();
}

function renderLeaderboard() {
  if (!dishes.length) {
    leaderboard.className = "leaderboard-list empty-state";
    leaderboard.innerHTML = `<div class="empty-card">No dishes judged yet.</div>`;
    return;
  }

  leaderboard.className = "leaderboard-list";

  const ranked = [...dishes].sort((a, b) => b.total - a.total);

  leaderboard.innerHTML = ranked.map((item, index) => {
    const isTop = index === 0 ? "top-rank" : "";
    return `
      <article class="leaderboard-item ${isTop}">
        <div class="item-top">
          <div class="rank-badge">${index + 1}</div>
          <div class="item-title-wrap">
            <h3 class="item-title">${escapeHtml(item.dish)}</h3>
            <div class="item-subtitle">${escapeHtml(item.chef)} • ${escapeHtml(item.course)}</div>
          </div>
          <div class="item-score">${item.total}/40</div>
        </div>
      </article>
    `;
  }).join("");
}

function renderJudgedDishes() {
  if (!dishes.length) {
    judgedDishes.className = "judged-list empty-state";
    judgedDishes.innerHTML = `<div class="empty-card">Every scored dish will appear here with notes and totals.</div>`;
    return;
  }

  judgedDishes.className = "judged-list";

  const ordered = [...dishes].reverse();

  judgedDishes.innerHTML = ordered.map(item => `
    <article class="judged-item">
      <div class="item-top">
        <div class="item-title-wrap">
          <h3 class="item-title">${escapeHtml(item.dish)}</h3>
          <div class="item-subtitle">${escapeHtml(item.chef)} • ${escapeHtml(item.course)}</div>
        </div>
        <div class="item-score">${item.total}/40</div>
      </div>

      <div class="item-meta">
        <div class="small-chip">Taste ${item.taste}</div>
        <div class="small-chip">Presentation ${item.presentation}</div>
        <div class="small-chip">Creativity ${item.creativity}</div>
        <div class="small-chip">Chef Energy ${item.energy}</div>
      </div>

      <div class="item-notes">
        ${item.notes ? escapeHtml(item.notes) : "No commentary added."}
      </div>
    </article>
  `).join("");
}

function updateHeaderStats() {
  currentCourseChip.textContent = `Current Round: ${courses[currentCourseIndex]}`;
  dishCountChip.textContent = `${dishes.length} ${dishes.length === 1 ? "Dish" : "Dishes"} Judged`;
}

function addDish(data) {
  dishes.push(data);
  renderLeaderboard();
  renderJudgedDishes();
  updateHeaderStats();
}

function showReveal(data) {
  overlayCourse.textContent = `${data.course} Round`;
  overlayChef.textContent = `CHEF ${data.chef.toUpperCase()}`;
  overlayDish.textContent = data.dish;
  overlayTaste.textContent = data.taste;
  overlayPresentation.textContent = data.presentation;
  overlayCreativity.textContent = data.creativity;
  overlayEnergy.textContent = data.energy;
  overlayTotal.textContent = `${data.total}/40`;

  scoreReveal.classList.remove("show");
  revealOverlay.classList.add("active");

  setTimeout(() => {
    scoreReveal.classList.add("show");
  }, 900);
}

function hideReveal() {
  revealOverlay.classList.remove("active");
  scoreReveal.classList.remove("show");
}

function revealWinner() {
  if (!dishes.length) {
    alert("Judge at least one dish first.");
    return;
  }

  const winner = [...dishes].sort((a, b) => b.total - a.total)[0];

  winnerDishName.textContent = winner.dish;
  winnerChefName.textContent = `Chef ${winner.chef}`;
  winnerScore.textContent = `${winner.total} / 40`;

  winnerPreview.innerHTML = `
    <strong>${escapeHtml(winner.dish)}</strong> by ${escapeHtml(winner.chef)} wins with ${winner.total}/40.
  `;

  winnerOverlay.classList.add("active");
}

function nextCourse() {
  currentCourseIndex = (currentCourseIndex + 1) % courses.length;
  courseSelect.value = courses[currentCourseIndex];
  updateHeaderStats();
}

function escapeHtml(str) {
  return String(str)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

presentDishBtn.addEventListener("click", () => {
  const data = getFormData();
  if (!data) return;

  addDish(data);
  showReveal(data);
  clearForm();
});

addDishBtn.addEventListener("click", () => {
  const data = getFormData();
  if (!data) return;

  addDish(data);
  clearForm();
});

clearBtn.addEventListener("click", clearForm);
nextCourseBtn.addEventListener("click", nextCourse);
revealWinnerBtn.addEventListener("click", revealWinner);
closeOverlayBtn.addEventListener("click", hideReveal);
closeWinnerOverlayBtn.addEventListener("click", () => {
  winnerOverlay.classList.remove("active");
});

courseSelect.value = courses[currentCourseIndex];
updateHeaderStats();
renderLeaderboard();
renderJudgedDishes();
