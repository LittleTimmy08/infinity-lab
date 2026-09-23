/**
 * registry.js
 * ------------------------------------------------------------
 * Hier werden alle Experimente eingetragen, die im Infinity Lab
 * auftauchen sollen. main.js liest NUR diese Liste aus – sowohl
 * für die Navigation im Header als auch für die Experiment-Karten
 * auf der Startseite. So steht Titel/Beschreibung jedes Experiments
 * an genau einer Stelle im Code.
 *
 * Ein Experiment ist ein Objekt mit diesen Eigenschaften:
 *
 *   {
 *     id:          "eindeutiger-name",   // z.B. "hilbert-hotel"
 *     title:       "Anzeigename",
 *     description: "Kurzer Text für die Karte auf der Startseite",
 *     symbol:      "∞",                  // großes Zeichen im Bildbereich der Karte
 *     badge:       "Abzählbarkeit",      // Typ des Experiments (Badge auf der Karte)
 *     status:      "Platzhalter",        // Bearbeitungsstand (graues Badge)
 *     render: function(container) {
 *       // container ist das <section id="experiment-stage">-Element.
 *       // Hier entsteht später der eigentliche Inhalt/die Simulation.
 *     }
 *   }
 *
 * Aktuell haben alle drei Experimente nur eine Platzhalter-render()-
 * Funktion, weil noch keine Mathematik implementiert ist. Die echte
 * Logik kommt später jeweils in eine eigene Datei (siehe _template.js).
 */

import { createExperimentFrame } from "../components/experiment-frame.js";

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

export const experiments = [
  {
    id: "hilbert-hotel",
    title: "Hilbert-Hotel",
    description: "Ein Hotel mit unendlich vielen Zimmern hat trotzdem immer noch Platz für neue Gäste.",
    symbol: "∞",
    badge: "Paradoxon",
    status: "Platzhalter",
    render: placeholderRender("Hilbert-Hotel"),
  },
  {
    id: "countable-nz",
    title: "Abzählbarkeit: ℕ ↔ ℤ",
    description: "Wie sich jeder ganzen Zahl eindeutig eine natürliche Zahl zuordnen lässt.",
    symbol: "ℕ ↔ ℤ",
    badge: "Abzählbarkeit",
    status: "Platzhalter",
    render: placeholderRender("Abzählbarkeit: ℕ ↔ ℤ"),
  },
  {
    id: "diagonal-argument",
    title: "Cantors Diagonalargument",
    description: "Warum es unmöglich ist, alle reellen Zahlen in einer Liste zu erfassen.",
    symbol: "ℝ",
    badge: "Überabzählbarkeit",
    status: "Platzhalter",
    render: placeholderRender("Cantors Diagonalargument"),
  },
];
