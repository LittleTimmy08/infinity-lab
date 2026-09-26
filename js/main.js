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
 *      – gesteuert vom Router (js/core/router.js) über die Adresse
 *      hinter dem "#" (z.B. #/experiment/hilbert-hotel)
 *
 * main.js kennt selbst KEINE Mathematik – das ist Absicht.
 * Die Logik jedes Experiments steckt in js/modules/*.js.
 *
 * Seit Phase 5 erzeugt main.js außerdem GENAU EINE Store-Instanz
 * (js/core/store.js, rein flüchtiger Laufzeit-Zustand, kein Speichern,
 * kein window.store) und reicht sie an render() weiter. Der Router
 * bekommt und besitzt den Store nicht – main.js verbindet beides nur
 * lose über den zweiten Parameter von render().
 */

import { categories, experiments } from "./modules/registry.js";
import { createExperimentCard } from "./components/experiment-card.js";
import { setupDropdown } from "./components/nav-dropdown.js";
import { createRouter, buildPath } from "./core/router.js";
import { createStore } from "./core/store.js";

// Muster der Routen (die Platzhalter erklärt router.js)
const HOME_PATH = "/";
const EXPERIMENT_PATH = "/experiment/:id";

const homeNavButton = document.getElementById("nav-home");
const exploreTrigger = document.getElementById("nav-explore-trigger");
const exploreMenu = document.getElementById("nav-explore-menu");
const homeView = document.getElementById("home-view");
const stageElement = document.getElementById("experiment-stage");
const cardGrid = document.getElementById("experiment-cards");

// Öffnen/Schließen des Dropdowns übernimmt nav-dropdown.js
const exploreDropdown = setupDropdown(document.getElementById("nav-explore"));

// Genau eine Store-Instanz für den gesamten Seiten-/Runtime-Lauf (siehe
// js/core/store.js). Sie wird unten an render() weitergereicht, nicht an
// den Router – der Router kennt den Store nicht und erzeugt auch keinen.
const store = createStore();

// Merkt sich pro Experiment seinen Menü-Eintrag (Schlüssel = experiment.id),
// damit der aktive Eintrag markiert werden kann – egal ob man das Experiment
// über das Menü oder über eine Karte auf der Startseite geöffnet hat.
const menuItems = new Map();

/**
 * Blendet die Startseite ein und die Experiment-Ansicht aus.
 * Wird vom Router aufgerufen, wenn die Adresse "#/" ist.
 */
function showHome() {
  homeView.hidden = false;
  stageElement.hidden = true;
  setActiveNav(null);
  // Kein Experiment mehr offen: Der Store spiegelt nur den bekannten
  // Navigationszustand wider, er ist nicht die Quelle der Wahrheit dafür.
  store.setState({ experiment: { id: null, presentation: null } });
}

/**
 * Blendet ein einzelnes Experiment ein und die Startseite aus.
 * Wird vom Router aufgerufen, wenn die Adresse "#/experiment/<id>" ist.
 *
 * Lifecycle: render() darf eine Aufräum-Funktion zurückgeben (z.B. um Timer
 * zu stoppen). Wir geben sie an den Router weiter, der sie beim Verlassen
 * des Experiments aufruft. Gibt render() nichts zurück (wie alle heutigen
 * Experimente), passiert einfach nichts.
 */
function showExperiment(experiment) {
  homeView.hidden = true;
  stageElement.hidden = false;
  stageElement.innerHTML = "";
  // Welche Darstellung konkret aktiv ist, weiß erst render() (bei
  // Content/Presentation-Experimenten: content-experiment.js) – dort wird
  // experiment.presentation gleich noch einmal gesetzt, sobald es feststeht.
  store.setState({ experiment: { id: experiment.id, presentation: null } });
  const cleanup = experiment.render(stageElement, { store });
  setActiveNav(experiment.id);
  window.scrollTo({ top: 0 });

  return () => {
    if (typeof cleanup === "function") cleanup();
    stageElement.innerHTML = ""; // erst nach dem Aufräumen: das Experiment sieht sein DOM noch
  };
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
  homeNavButton.addEventListener("click", () => router.navigate(HOME_PATH));

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
        router.navigate(buildPath(EXPERIMENT_PATH, { id: experiment.id }));
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
 * ein Klick auf ihren Button öffnet das Experiment (über den Router).
 */
function buildCards() {
  experiments.forEach((experiment) => {
    const card = createExperimentCard(experiment, () =>
      router.navigate(buildPath(EXPERIMENT_PATH, { id: experiment.id }))
    );
    cardGrid.appendChild(card);
  });
}

// Die Routen. Der Router kennt nur diese Liste – was hinter einer Route steckt,
// entscheidet main.js. "guard" verhindert, dass eine unbekannte Experiment-ID
// eine leere Seite zeigt: Der Router führt sie stattdessen auf "#/" zurück.
//
// Später (Phase 6) kommt hier z.B. { path: "/lab/:id/:step", ... } dazu.
const router = createRouter({
  routes: [
    { path: HOME_PATH, enter: showHome },
    {
      path: EXPERIMENT_PATH,
      guard: ({ id }) => experiments.some((experiment) => experiment.id === id),
      enter: ({ id }) => showExperiment(experiments.find((experiment) => experiment.id === id)),
    },
  ],
});

buildNavigation();
buildCards();
router.start(); // wertet die Adresse beim Laden aus (ersetzt das frühere showHome())
