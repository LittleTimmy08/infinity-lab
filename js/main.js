/**
 * main.js
 * ------------------------------------------------------------
 * Einstiegspunkt der Anwendung. Aufgaben von main.js:
 *   1. Die Liste der Experimente aus registry.js holen
 *   2. Für jedes Experiment einen Button in der Navigation anlegen
 *   3. Beim Klick auf einen Button das passende Experiment
 *      in den Anzeigebereich (#experiment-stage) rendern
 *
 * main.js kennt selbst KEINE Mathematik – das ist Absicht.
 * Die Logik jedes Experiments steckt in js/modules/*.js.
 */

import { experiments } from "./modules/registry.js";

const navElement = document.getElementById("experiment-nav");
const stageElement = document.getElementById("experiment-stage");

function renderExperiment(experiment) {
  stageElement.innerHTML = "";
  experiment.render(stageElement);
}

function buildNavigation() {
  if (experiments.length === 0) {
    // Solange keine Experimente registriert sind, bleibt die Nav leer.
    // Das ist kein Fehler, sondern der aktuelle Entwicklungsstand.
    return;
  }

  experiments.forEach((experiment) => {
    const button = document.createElement("button");
    button.textContent = experiment.title;
    button.addEventListener("click", () => renderExperiment(experiment));
    navElement.appendChild(button);
  });
}

buildNavigation();
