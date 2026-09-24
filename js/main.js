/**
 * main.js
 * ------------------------------------------------------------
 * Einstiegspunkt der Anwendung. Aufgaben von main.js:
 *   1. Kategorien und Experimente aus registry.js holen
 *   2. Daraus das Experimente-Dropdown im Header aufbauen
 *      (pro Kategorie eine Gruppe, pro Experiment ein Eintrag)
 *   3. Daraus die Experiment-Karten auf der Startseite aufbauen
 *   4. Zwischen Startseite (#home-view) und Experiment-Ansicht
 *      (#experiment-stage) umschalten und die Navigation markieren
 *
 * main.js kennt selbst KEINE Mathematik – das ist Absicht.
 * Die Logik jedes Experiments steckt in js/modules/*.js.
 */

import { categories, experiments } from "./modules/registry.js";
import { createExperimentCard } from "./components/experiment-card.js";
import { setupDropdown } from "./components/nav-dropdown.js";

const homeNavButton = document.getElementById("nav-home");
const exploreTrigger = document.getElementById("nav-explore-trigger");
const exploreMenu = document.getElementById("nav-explore-menu");
const homeView = document.getElementById("home-view");
const stageElement = document.getElementById("experiment-stage");
const cardGrid = document.getElementById("experiment-cards");

// Öffnen/Schließen des Dropdowns übernimmt nav-dropdown.js
const exploreDropdown = setupDropdown(document.getElementById("nav-explore"));

// Merkt sich pro Experiment seinen Menü-Eintrag (Schlüssel = experiment.id),
// damit der aktive Eintrag markiert werden kann – egal ob man das Experiment
// über das Menü oder über eine Karte auf der Startseite geöffnet hat.
const menuItems = new Map();

/**
 * Blendet die Startseite ein und die Experiment-Ansicht aus.
 */
function showHome() {
  homeView.hidden = false;
  stageElement.hidden = true;
  setActiveNav(null);
}

/**
 * Blendet ein einzelnes Experiment ein und die Startseite aus.
 */
function showExperiment(experiment) {
  homeView.hidden = true;
  stageElement.hidden = false;
  stageElement.innerHTML = "";
  experiment.render(stageElement);
  setActiveNav(experiment.id);
  window.scrollTo({ top: 0 });
}

/**
 * Markiert den aktiven Navigationsbereich.
 *   activeExperimentId === null  -> "Startseite" ist aktiv
 *   sonst                        -> "Experimente" ist aktiv, und im Menü
 *                                   ist der passende Eintrag markiert
 */
function setActiveNav(activeExperimentId) {
  const onHome = activeExperimentId === null;

  homeNavButton.classList.toggle("is-active", onHome);
  exploreTrigger.classList.toggle("is-active", !onHome);

  if (onHome) {
    homeNavButton.setAttribute("aria-current", "page");
  } else {
    homeNavButton.removeAttribute("aria-current");
  }

  menuItems.forEach((item, id) => {
    if (id === activeExperimentId) {
      item.setAttribute("aria-current", "page");
    } else {
      item.removeAttribute("aria-current");
    }
  });
}

/**
 * Baut das Experimente-Dropdown auf:
 * Für jede Kategorie eine Gruppe (Überschrift + ein Button pro Experiment).
 * Die Experimente einer Kategorie werden über experiment.category === category.id gefunden.
 */
function buildNavigation() {
  homeNavButton.addEventListener("click", showHome);

  categories.forEach((category) => {
    const experimentsInCategory = experiments.filter(
      (experiment) => experiment.category === category.id
    );

    // Kategorien ohne Experimente zeigen wir nicht an.
    if (experimentsInCategory.length === 0) return;

    const group = document.createElement("div");
    group.className = "nav-dropdown__group";

    const label = document.createElement("p");
    label.className = "nav-dropdown__label";
    label.textContent = category.title;
    group.appendChild(label);

    experimentsInCategory.forEach((experiment) => {
      const item = document.createElement("button");
      item.type = "button";
      item.className = "nav-dropdown__item";
      item.textContent = experiment.title;
      item.addEventListener("click", () => {
        showExperiment(experiment);
        exploreDropdown.close();
      });
      group.appendChild(item);
      menuItems.set(experiment.id, item);
    });

    exploreMenu.appendChild(group);
  });

  // Hilfe bei Tippfehlern: Ein Experiment mit unbekannter Kategorie
  // würde sonst still im Dropdown fehlen.
  const knownCategoryIds = categories.map((category) => category.id);
  experiments.forEach((experiment) => {
    if (!knownCategoryIds.includes(experiment.category)) {
      console.warn(
        `Experiment "${experiment.id}" hat die unbekannte Kategorie "${experiment.category}" ` +
          `und erscheint nicht im Dropdown. Kategorie in registry.js ergänzen oder korrigieren.`
      );
    }
  });
}

/**
 * Baut für jedes Experiment eine Karte auf der Startseite.
 * Das Aussehen der Karte steckt in components/experiment-card.js,
 * ein Klick auf ihren Button öffnet das Experiment.
 */
function buildCards() {
  experiments.forEach((experiment) => {
    const card = createExperimentCard(experiment, () => showExperiment(experiment));
    cardGrid.appendChild(card);
  });
}

buildNavigation();
buildCards();
showHome();
