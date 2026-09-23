/**
 * _template.js
 * ------------------------------------------------------------
 * Vorlage für ein neues Experiment. Diese Datei wird von
 * main.js NICHT geladen (sie ist nicht in registry.js
 * eingetragen). Kopiere sie einfach, wenn du ein neues
 * Experiment anlegst, z.B. als "hilbert-hotel.js".
 *
 * Schritte, um ein neues Experiment hinzuzufügen:
 *   1. Diese Datei kopieren und umbenennen (z.B. hilbert-hotel.js)
 *   2. id, title, description, symbol, badge, status und render() anpassen
 *   3. In registry.js importieren und im experiments-Array eintragen
 */

import { createExperimentFrame } from "../components/experiment-frame.js";

export const templateExperiment = {
  id: "template",
  title: "Beispiel-Experiment",
  description: "Kurzer Text für die Karte auf der Startseite.",
  symbol: "∞",            // großes Zeichen im Bildbereich der Karte
  badge: "Beispiel",      // Typ des Experiments
  status: "In Arbeit",    // Bearbeitungsstand

  // container ist das <section id="experiment-stage"> Element.
  render(container) {
    // Baut den Rahmen und gibt die zwei Flächen zurück.
    const { visualization, controls } = createExperimentFrame(container, {
      title: "Beispiel-Experiment",
      description: "Eine Zeile, die erklärt, worum es geht.",
    });

    // Links: hier entsteht später die Visualisierung.
    visualization.innerHTML = `<p>Hier kommt die Visualisierung hin.</p>`;

    // Rechts: Bedienelemente aus der Komponentenbibliothek.
    controls.innerHTML = `
      <button type="button" class="btn" id="start-button">Starten</button>

      <div class="field">
        <div class="field-header">
          <label class="field-label" for="count-slider">Anzahl</label>
          <output class="field-value" id="count-value">5</output>
        </div>
        <input class="slider" id="count-slider" type="range" min="1" max="10" value="5">
      </div>
    `;

    // Verhalten hängst du danach selbst an, z.B.:
    const slider = controls.querySelector("#count-slider");
    const valueLabel = controls.querySelector("#count-value");
    slider.addEventListener("input", () => {
      valueLabel.textContent = slider.value;
    });
  },
};
