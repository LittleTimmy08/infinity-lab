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
 * Seit Phase 4 nutzen alle drei Experimente die Content/Presentation-
 * Struktur. Jedes hat aktuell genau eine Darstellung (presentations mit
 * nur einem Eintrag) – main.js zeigt dann keinen Umschalter an. Das ist
 * keine wissenschaftliche Festlegung, sondern nur der aktuelle Stand:
 * das Hilbert-Hotel bekommt später weitere, vergleichbare Darstellungen
 * für das eigentliche Jugend-forscht-Experiment.
 */

import { createContentRender } from "./content-experiment.js";

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
    title: "Abzählbare Unendlichkeit",
    description: "Wie man jedem Element einer unendlichen Menge eine eigene natürliche Zahl zuordnen kann.",
    symbol: "ℕ",
    badge: "Abzählbarkeit",
    status: "Lernmodul",
    contentId: "countable-nz",
    presentations: ["countable-interactive"],
  },
  {
    id: "diagonal-argument",
    category: "mathematik",
    title: "Cantors Diagonalargument",
    description: "Warum es unmöglich ist, alle reellen Zahlen in einer Liste zu erfassen.",
    symbol: "ℝ",
    badge: "Überabzählbarkeit",
    status: "Lernmodul",
    contentId: "diagonal-argument",
    presentations: ["diagonal-interactive"],
  },
];

// Einträge mit contentId bekommen ihr render() aus Content + Presentation.
// Einträge mit eigenem render() bleiben unverändert.
export const experiments = experimentDefinitions.map((experiment) =>
  experiment.render || !experiment.contentId
    ? experiment
    : { ...experiment, render: createContentRender(experiment) }
);
