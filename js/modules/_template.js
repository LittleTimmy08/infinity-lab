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
 *   2. id, title und render() anpassen
 *   3. In registry.js importieren und im experiments-Array eintragen
 */

export const templateExperiment = {
  id: "template",
  title: "Beispiel-Experiment",

  // container ist das <main id="experiment-stage"> Element.
  render(container) {
    container.innerHTML = `
      <h2>Beispiel-Experiment</h2>
      <p>Hier entsteht später der Inhalt dieses Experiments.</p>
    `;
  },
};
