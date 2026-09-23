/**
 * main.js
 * ------------------------------------------------------------
 * Einstiegspunkt der Anwendung. Aufgaben von main.js:
 *   1. Die Liste der Experimente aus registry.js holen
 *   2. Daraus die Navigation im Header aufbauen (ein Button pro Experiment)
 *   3. Daraus die Experiment-Karten auf der Startseite aufbauen
 *   4. Zwischen Startseite (#home-view) und Experiment-Ansicht
 *      (#experiment-stage) umschalten
 *
 * main.js kennt selbst KEINE Mathematik – das ist Absicht.
 * Die Logik jedes Experiments steckt in js/modules/*.js.
 */

import { experiments } from "./modules/registry.js";
import { createExperimentCard } from "./components/experiment-card.js";

const navElement = document.getElementById("primary-nav");
const homeNavButton = document.getElementById("nav-home");
const homeView = document.getElementById("home-view");
const stageElement = document.getElementById("experiment-stage");
const cardGrid = document.getElementById("experiment-cards");

// Merkt sich pro Experiment seinen Nav-Button (Schlüssel = experiment.id),
// damit auch ein Klick auf eine Karte den richtigen Nav-Button markieren kann.
const navButtons = new Map();

/**
 * Blendet die Startseite ein und die Experiment-Ansicht aus.
 * Setzt außerdem, welcher Nav-Button gerade als "aktiv" markiert ist.
 */
function showHome() {
  homeView.hidden = false;
  stageElement.hidden = true;
  setActiveNavButton(homeNavButton);
}

/**
 * Blendet ein einzelnes Experiment ein und die Startseite aus.
 */
function showExperiment(experiment, navButton) {
  homeView.hidden = true;
  stageElement.hidden = false;
  stageElement.innerHTML = "";
  experiment.render(stageElement);
  setActiveNavButton(navButton);
  window.scrollTo({ top: 0 });
}

function setActiveNavButton(activeButton) {
  const allButtons = navElement.querySelectorAll(".nav-link");
  allButtons.forEach((button) => button.classList.remove("is-active"));
  activeButton.classList.add("is-active");
}

/**
 * Baut für jedes Experiment einen Button in der Header-Navigation.
 * Ein Klick zeigt das jeweilige Experiment an.
 */
function buildNavigation() {
  experiments.forEach((experiment) => {
    const button = document.createElement("button");
    button.type = "button";
    button.className = "nav-link";
    button.textContent = experiment.title;
    button.addEventListener("click", () => showExperiment(experiment, button));
    navElement.appendChild(button);
    navButtons.set(experiment.id, button);
  });

  homeNavButton.addEventListener("click", showHome);
}

/**
 * Baut für jedes Experiment eine Karte auf der Startseite.
 * Das Aussehen der Karte steckt in components/experiment-card.js,
 * ein Klick auf ihren Button öffnet das Experiment.
 */
function buildCards() {
  experiments.forEach((experiment) => {
    const card = createExperimentCard(experiment, () =>
      showExperiment(experiment, navButtons.get(experiment.id))
    );
    cardGrid.appendChild(card);
  });
}

buildNavigation();
buildCards();
showHome();
