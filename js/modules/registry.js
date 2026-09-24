/**
 * registry.js
 * ------------------------------------------------------------
 * Hier werden alle Kategorien und Experimente eingetragen, die im
 * Infinity Lab auftauchen sollen. main.js liest NUR diese Listen
 * aus – sowohl für das Experimente-Dropdown im Header als auch für
 * die Experiment-Karten auf der Startseite. So steht Titel/Beschreibung
 * jedes Experiments an genau einer Stelle im Code.
 *
 * Eine Kategorie gruppiert Experimente im Dropdown:
 *
 *   { id: "mathematik", title: "Mathematik" }
 *
 * Die Reihenfolge in `categories` bestimmt die Reihenfolge der Gruppen.
 * Kategorien ohne Experimente werden im Dropdown nicht angezeigt.
 *
 * Ein Experiment ist ein Objekt mit diesen Eigenschaften:
 *
 *   {
 *     id:          "eindeutiger-name",   // z.B. "hilbert-hotel"
 *     category:    "mathematik",         // muss zu einer id in `categories` passen
 *     title:       "Anzeigename",
 *     description: "Kurzer Text für die Karte auf der Startseite",
 *     symbol:      "∞",                  // großes Zeichen im Bildbereich der Karte
 *     badge:       "Abzählbarkeit",      // Typ des Experiments (Badge auf der Karte)
 *     status:      "Platzhalter",        // Bearbeitungsstand (graues Badge)
 *     render: function(container) {
 *       // container ist das <section id="experiment-stage">-Element.
 *       // Hier entsteht später der eigentliche Inhalt/die Simulation.
 *       // OPTIONAL: eine Funktion zurückgeben, die beim Verlassen des
 *       // Experiments aufgerufen wird (Timer stoppen, Listener entfernen,
 *       // requestAnimationFrame beenden). Ohne Rückgabe passiert nichts.
 *     }
 *   }
 *
 * Statt render() kann ein Experiment auf CONTENT und PRESENTATION verweisen:
 *
 *     contentId:     "hilbert-hotel",                       // js/content/
 *     presentations: ["narrative", "visual", "interactive"] // js/presentations/
 *
 * Dann baut js/modules/content-experiment.js das render() automatisch:
 * derselbe Inhalt, mehrere Darstellungen. Die erste Darstellung der Liste
 * wird zuerst gezeigt. Hat ein Eintrag ein eigenes render(), bleibt es unverändert.
 *
 * Aktuell nutzt nur das Hilbert-Hotel die Content/Presentation-Struktur.
 * Die beiden anderen haben noch eine Platzhalter-render()-Funktion.
 */

import { createExperimentFrame } from "../components/experiment-frame.js";
import { createContentRender } from "./content-experiment.js";

/**
 * Platzhalter: zeigt den Experiment-Rahmen mit Beispiel-Bedienelementen.
 * Die Elemente sind absichtlich "disabled", weil sie noch nichts steuern.
 * (Zum Testen von Hover/Fokus: `disabled` im Browser-Inspektor entfernen.)
 */
function placeholderRender(title) {
  return function (container) {
    const { visualization, controls } = createExperimentFrame(container, {
      title,
      description: "Platzhalter – dieses Experiment ist noch nicht implementiert.",
    });

    visualization.innerHTML = `
      <p class="placeholder-text">Hier erscheint später die Visualisierung.</p>
    `;

    controls.innerHTML = `
      <button type="button" class="btn" disabled>Starten</button>
      <button type="button" class="btn btn--secondary" disabled>Zurücksetzen</button>

      <div class="field">
        <div class="field-header">
          <label class="field-label" for="demo-slider">Anzahl</label>
          <output class="field-value" for="demo-slider">5</output>
        </div>
        <input class="slider" id="demo-slider" type="range" min="1" max="10" value="5" disabled>
      </div>

      <div class="field">
        <label class="field-label" for="demo-input">Eingabe</label>
        <input class="input" id="demo-input" type="text" placeholder="z. B. 42" disabled>
      </div>
    `;
  };
}

export const categories = [
  { id: "mathematik", title: "Mathematik" },
  // Später z. B.: { id: "informatik", title: "Informatik" },
];

const experimentDefinitions = [
  {
    id: "hilbert-hotel",
    category: "mathematik",
    title: "Hilbert-Hotel",
    description: "Ein Hotel mit unendlich vielen Zimmern hat trotzdem immer noch Platz für neue Gäste.",
    symbol: "∞",
    badge: "Paradoxon",
    status: "Platzhalter",
    contentId: "hilbert-hotel",
    presentations: ["narrative", "visual", "interactive"], // technische Platzhalter
  },
  {
    id: "countable-nz",
    category: "mathematik",
    title: "Abzählbarkeit: ℕ ↔ ℤ",
    description: "Wie sich jeder ganzen Zahl eindeutig eine natürliche Zahl zuordnen lässt.",
    symbol: "ℕ ↔ ℤ",
    badge: "Abzählbarkeit",
    status: "Platzhalter",
    render: placeholderRender("Abzählbarkeit: ℕ ↔ ℤ"),
  },
  {
    id: "diagonal-argument",
    category: "mathematik",
    title: "Cantors Diagonalargument",
    description: "Warum es unmöglich ist, alle reellen Zahlen in einer Liste zu erfassen.",
    symbol: "ℝ",
    badge: "Überabzählbarkeit",
    status: "Platzhalter",
    render: placeholderRender("Cantors Diagonalargument"),
  },
];

// Einträge mit contentId bekommen ihr render() aus Content + Presentation.
// Einträge mit eigenem render() bleiben unverändert.
export const experiments = experimentDefinitions.map((experiment) =>
  experiment.render || !experiment.contentId
    ? experiment
    : { ...experiment, render: createContentRender(experiment) }
);
