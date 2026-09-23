/**
 * experiment-frame.js
 * ------------------------------------------------------------
 * Der wiederverwendbare Rahmen für jede Experiment-Seite:
 *
 *   ┌──────────────────────────────────────────────┐
 *   │ Titel + Kurzbeschreibung                     │
 *   ├────────────────────────┬─────────────────────┤
 *   │     VISUALISIERUNG     │     STEUERUNG       │
 *   └────────────────────────┴─────────────────────┘
 *
 * Die Funktion baut nur die Struktur auf und gibt die beiden
 * Flächen zurück. Jedes Experiment füllt sie dann selbst:
 *
 *   const { visualization, controls } = createExperimentFrame(container, { title: "..." });
 *   visualization.innerHTML = "...";   // links
 *   controls.innerHTML = "...";        // rechts
 *
 * Das Aussehen (zwei Spalten, untereinander auf kleinen Displays)
 * steckt komplett in style.css (Abschnitt "Experiment-Rahmen").
 */

export function createExperimentFrame(container, { title, description = "" }) {
  // Feste Struktur. Titel und Beschreibung setzen wir unten per textContent,
  // damit sie nie als HTML interpretiert werden.
  container.innerHTML = `
    <div class="experiment">
      <header class="experiment-header">
        <h2 class="experiment-title"></h2>
        <p class="experiment-description"></p>
      </header>
      <div class="experiment-layout">
        <section class="card experiment-visualization" aria-label="Visualisierung"></section>
        <aside class="card experiment-controls" aria-label="Steuerung">
          <h3 class="experiment-controls__title">Steuerung</h3>
          <div class="experiment-controls__body"></div>
        </aside>
      </div>
    </div>
  `;

  container.querySelector(".experiment-title").textContent = title;

  const descriptionElement = container.querySelector(".experiment-description");
  if (description) {
    descriptionElement.textContent = description;
  } else {
    descriptionElement.remove();
  }

  return {
    visualization: container.querySelector(".experiment-visualization"),
    controls: container.querySelector(".experiment-controls__body"),
  };
}
