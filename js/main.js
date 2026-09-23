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

const navElement = document.getElementById("primary-nav");
const homeNavButton = document.getElementById("nav-home");
const homeView = document.getElementById("home-view");
const stageElement = document.getElementById("experiment-stage");
const cardGrid = document.getElementById("experiment-cards");

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
  });

  homeNavButton.addEventListener("click", showHome);
}

/**
 * Baut für jedes Experiment eine Karte auf der Startseite.
 * Die Karten sind aktuell reine Platzhalter ohne Klick-Funktion.
 */
function buildCards() {
  experiments.forEach((experiment) => {
    const card = document.createElement("article");
    card.className = "card";
    card.innerHTML = `
      <div class="card-visual" aria-hidden="true">∞</div>
      <h3 class="card-title">${experiment.title}</h3>
      <p class="card-description">${experiment.description}</p>
    `;
    cardGrid.appendChild(card);
  });
}

buildNavigation();
buildCards();
showHome();
