const countries = ["France", "Germany"];
let targetCountry = "";
let attempts = 0;
const maxAttempts = 3;

function startGame() {
  resetMap();
  targetCountry = countries[Math.floor(Math.random() * countries.length)];
  document.getElementById("target-country").textContent = `Click on: ${targetCountry}`;
  document.getElementById("feedback").textContent = "";
  attempts = 0;
}

function resetMap() {
  document.querySelectorAll("svg path").forEach(path => {
    path.classList.remove("correct", "incorrect");
  });
}

document.querySelectorAll("svg path").forEach(path => {
  path.addEventListener("click", function () {
    if (!targetCountry || attempts >= maxAttempts) return;

    attempts++;
    if (this.id === targetCountry) {
      this.classList.add("correct");
      document.getElementById("feedback").textContent = `Correct! You found ${targetCountry}.`;
      targetCountry = ""; // End game
    } else {
      this.classList.add("incorrect");
      if (attempts >= maxAttempts) {
        document.getElementById("feedback").textContent = `Out of attempts! The correct answer was ${targetCountry}.`;
      } else {
        document.getElementById("feedback").textContent = `Try again! Attempts left: ${maxAttempts - attempts}`;
      }
    }
  });
});

startGame();
