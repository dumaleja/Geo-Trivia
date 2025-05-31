const TOTAL_COUNTRIES = 199;
let consecutiveMisses = 0;
let targetCountry = "";
let attempts = 0;
const maxAttempts = 3;
let score = 0;
let attemptedCountries = new Set();
let incorrectCountriesThisRound = new Set();

function showModal(title, message) {
  document.getElementById("modal-title").textContent = title;
  document.getElementById("modal-message").textContent = message;
  document.getElementById("end-modal").style.display = "block";
}

function resetGame() {
  attemptedCountries.clear();
  score = 0;
  consecutiveMisses = 0;

  document.querySelectorAll(".correct").forEach(el => el.classList.remove("correct"));
  document.querySelectorAll(".incorrect").forEach(el => el.classList.remove("incorrect"));

  updateScore();
  document.getElementById("end-modal").style.display = "none";
  startGame();
}

function startGame() {
  resetIncorrects();
  const all = Array.from(document.querySelectorAll("svg *[country-data]"));
  const validCountries = [...new Set(
    all.map(el => el.getAttribute("country-data"))
      .filter(name => name && name.length > 2 && !attemptedCountries.has(name))
  )];

  if (score >= TOTAL_COUNTRIES || validCountries.length === 0) {
    showModal("🎉 Perfect Score!", "You identified all 199 countries correctly!");
    return;
  }

  targetCountry = validCountries[Math.floor(Math.random() * validCountries.length)];
  document.getElementById("target-country").textContent = `Click on: ${targetCountry}`;
  document.getElementById("feedback").textContent = "";
  if (targetCountry === "" || attempts >= maxAttempts) {
  attempts = 0;
}
  updateAttempts();
  incorrectCountriesThisRound.clear();
}

function resetIncorrects() {
  incorrectCountriesThisRound.forEach(country => {
    const elems = document.querySelectorAll(`[country-data='${country}']`);
    elems.forEach(el => {
      el.classList.remove("incorrect");
      el.querySelectorAll("*").forEach(child => child.classList.remove("incorrect"));
    });
  });
  incorrectCountriesThisRound.clear();
}

function updateScore() {
  document.getElementById("score").textContent = `Correct: ${score} / ${TOTAL_COUNTRIES}`;
}

function flashFeedback(message, color = "#4CAF50") {
  const fb = document.getElementById("flash-feedback");
  fb.textContent = message;
  fb.style.backgroundColor = color;
  fb.style.display = "block";
  fb.style.opacity = "1";

  setTimeout(() => {
    fb.style.opacity = "0";
    setTimeout(() => {
      fb.style.display = "none";
    }, 1000);
  }, 300);
}

function highlightCountry(countryName, className) {
  const countryElems = document.querySelectorAll(`[country-data='${countryName}']`);
  countryElems.forEach(parent => {
    parent.classList.add(className);
    parent.querySelectorAll("*").forEach(child => child.classList.add(className));
  });
}

function updateAttempts() {
  const indicator = document.getElementById("attempts-indicator");
  if (!targetCountry) {
    indicator.textContent = ""; // Clear when no active question
    return;
  }

  const left = maxAttempts - attempts;
  const colors = ["🔴", "🟡", "🟢"];
  indicator.textContent = colors.slice(0, left).join("");
}

document.addEventListener("DOMContentLoaded", () => {
  document.getElementById("close-modal").addEventListener("click", () => {
    document.getElementById("end-modal").style.display = "none";
  });

  document.getElementById("skip-btn").addEventListener("click", () => {
    if (targetCountry) {
      targetCountry = "";
      setTimeout(startGame, 500);
    }
  });

  document.addEventListener("click", function (e) {
    const el = e.target.closest("[country-data]");
    if (!el || !targetCountry || attempts >= maxAttempts) return;

    const clicked = el.getAttribute("country-data");
    if (!clicked || attemptedCountries.has(clicked) || incorrectCountriesThisRound.has(clicked)) return;

    if (clicked === targetCountry) {
  highlightCountry(targetCountry, "correct");
  flashFeedback("Okay!", "#229954");
  attemptedCountries.add(targetCountry);
  score++;
  consecutiveMisses = 0;
  attempts = 0; // ✅ Reset attempts here
  updateScore();
  updateAttempts(); // ✅ Refresh visual display too
  targetCountry = "";
  setTimeout(startGame, 1000);

    } else {
      highlightCountry(clicked, "incorrect");
      incorrectCountriesThisRound.add(clicked);
      attempts++;
      consecutiveMisses++;
      updateAttempts();

      if (consecutiveMisses >= 3) {
        showModal("🛑 Game Over", `You missed 3 in a row. Final score: ${score} / ${TOTAL_COUNTRIES}`);
        targetCountry = "";
        return;
      }

      if (attempts >= maxAttempts) {
        attemptedCountries.add(targetCountry);
        targetCountry = "";
        setTimeout(startGame, 1000);
      } else {
        flashFeedback("Wrong!", "#e74c3c");
      }
    }
  });

  updateScore();
  startGame();
});
