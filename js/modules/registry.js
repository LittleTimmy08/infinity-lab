/**
 * registry.js
 * ------------------------------------------------------------
 * Hier werden alle Experimente eingetragen, die im Infinity Lab
 * auftauchen sollen. main.js liest NUR diese Liste aus – sowohl
 * für die Navigation im Header als auch für die Experiment-Karten
 * auf der Startseite. So steht Titel/Beschreibung jedes Experiments
 * an genau einer Stelle im Code.
 *
 * Ein Experiment ist ein Objekt mit vier Eigenschaften:
 *
 *   {
 *     id:          "eindeutiger-name",   // z.B. "hilbert-hotel"
 *     title:       "Anzeigename",
 *     description: "Kurzer Text für die Karte auf der Startseite",
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

function placeholderRender(title) {
  return function (container) {
    container.innerHTML = `
      <h2>${title}</h2>
      <p class="placeholder-text">Dieses Experiment ist noch nicht implementiert.</p>
    `;
  };
}

export const experiments = [
  {
    id: "hilbert-hotel",
    title: "Hilbert-Hotel",
    description: "Ein Hotel mit unendlich vielen Zimmern hat trotzdem immer noch Platz für neue Gäste.",
    render: placeholderRender("Hilbert-Hotel"),
  },
  {
    id: "countable-nz",
    title: "Abzählbarkeit: ℕ ↔ ℤ",
    description: "Wie sich jeder ganzen Zahl eindeutig eine natürliche Zahl zuordnen lässt.",
    render: placeholderRender("Abzählbarkeit: ℕ ↔ ℤ"),
  },
  {
    id: "diagonal-argument",
    title: "Cantors Diagonalargument",
    description: "Warum es unmöglich ist, alle reellen Zahlen in einer Liste zu erfassen.",
    render: placeholderRender("Cantors Diagonalargument"),
  },
];
