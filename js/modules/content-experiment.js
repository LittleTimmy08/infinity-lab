/**
 * content-experiment.js
 * ------------------------------------------------------------
 * Verbindet CONTENT und PRESENTATION zu einem normalen render():
 *
 *   Registry-Eintrag { contentId, presentations: [...] }
 *        ↓ createContentRender(eintrag)
 *   render(container)   – genau die Funktion, die main.js schon kennt
 *
 * Ablauf in render():
 *   1. Content holen (ein und dasselbe Objekt für ALLE Darstellungen)
 *   2. Experiment-Rahmen bauen
 *   3. Die erste Darstellung der Liste starten
 *   4. Aufräum-Funktion zurückgeben (Router ruft sie beim Verlassen auf)
 *
 * Der Umschalter "Darstellung" im Rahmen ist eine technische Vorschau
 * für die Entwicklung. Er ist KEINE Gruppenzuweisung. Später (Ablauf/
 * Experiment) entscheidet der Ablauf, welche Darstellung gezeigt wird.
 *
 * Seit Phase 5: render(container, { store }) bekommt optional den
 * Store aus main.js (js/core/store.js) als zweiten Parameter. show()
 * ist die einzige Stelle, die zuverlässig weiß, welche Darstellung
 * gerade läuft – deshalb aktualisiert genau sie experiment.id und
 * experiment.presentation, sowohl beim ersten Anzeigen als auch bei
 * jedem Wechsel über den Umschalter. Ohne Store (store === undefined,
 * z.B. wenn render() isoliert aufgerufen wird) passiert einfach nichts.
 */

import { createExperimentFrame } from "../components/experiment-frame.js";
import { getContent } from "../content/index.js";
import { getPresentation } from "../presentations/index.js";
import { h } from "../presentations/dom.js";

export function createContentRender(experiment) {
  return function render(container, { store } = {}) {
    const content = getContent(experiment.contentId);
    const options = experiment.presentations.map(getPresentation);
    if (options.length === 0) {
      throw new Error(`Experiment "${experiment.id}" hat contentId, aber keine presentations.`);
    }

    const { visualization, controls, toolbar } = createExperimentFrame(container, {
      title: experiment.title,
      description: experiment.description,
      toolbar: options.length > 1, // Umschalter nur, wenn es etwas umzuschalten gibt
    });

    // Aufräum-Funktion der gerade laufenden Darstellung
    let stopPresentation = null;

    function stop() {
      const cleanup = stopPresentation;
      stopPresentation = null;
      if (!cleanup) return;
      try {
        cleanup();
      } catch (error) {
        console.error("Fehler in der Aufräum-Funktion einer Darstellung:", error);
      }
    }

    function show(presentation) {
      stop();
      visualization.replaceChildren();
      controls.replaceChildren();
      const result = presentation.render(content, { visualization, controls });
      stopPresentation = typeof result === "function" ? result : null;
      store?.setState({ experiment: { id: experiment.id, presentation: presentation.id } });
    }

    const abort = new AbortController();

    if (toolbar) {
      const select = h("select", "input");
      select.id = "presentation-select";
      options.forEach((presentation) => select.append(new Option(presentation.label, presentation.id)));
      const label = h("label", "field-label", "Darstellung (technische Vorschau)");
      label.htmlFor = select.id;
      const field = h("div", "field");
      field.append(label, select);
      toolbar.append(field);

      select.addEventListener("change", () => show(options.find((item) => item.id === select.value)), {
        signal: abort.signal,
      });
    }

    show(options[0]);

    return () => {
      abort.abort();
      stop();
    };
  };
}
