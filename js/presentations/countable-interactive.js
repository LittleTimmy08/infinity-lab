/**
 * countable-interactive.js (PRESENTATION)
 * ------------------------------------------------------------
 * Die (bisher einzige) Darstellung für das Experiment "countable-nz".
 * Ein geführter Ablauf in Schritten (siehe stepper.js):
 *
 *   1. Einstieg          (content.sections[0])
 *   2. Zentrale Frage     (content.sections[1])
 *   3. Interaktive Zuordnung (content.matching)   <- eigener Schritt unten
 *   4. Aha-Moment          (content.ahaMoment, aus step-kit.js)
 *   5. Verständnisfrage    (content.quiz, aus step-kit.js)
 *   6. Zusammenfassung     (content.summary, aus step-kit.js)
 *
 * Dies ist kein Pre-/Post-Test und keine wissenschaftliche Bedingung,
 * sondern die einzige aktuell implementierte Darstellung dieses Inhalts.
 */

import { h } from "./dom.js";
import { createStepper } from "./stepper.js";
import { textStep, ahaStep, quizStep, summaryStep } from "./step-kit.js";

export const countableInteractivePresentation = {
  id: "countable-interactive",
  label: "Interaktiv",

  render(content, slots) {
    const steps = [
      textStep(content.sections[0].heading, [content.sections[0].text]),
      textStep(content.sections[1].heading, [content.sections[1].text]),
      matchingStep(content.matching),
      ahaStep(content.ahaMoment),
      quizStep(content.quiz),
      summaryStep(content.summary),
    ];
    return createStepper(slots, steps);
  },
};

/**
 * Der Zuordnungs-Schritt: Startet leer, "Zuordnung starten" zeigt Element 1,
 * "Nächster Schritt" fügt die nächste Zeile hinzu (bis matching.itemCount),
 * "Zurücksetzen" leert die Liste wieder. Am Ende erscheint der Hinweis,
 * dass sich das Muster beliebig fortsetzen lässt.
 */
function matchingStep(matching) {
  return {
    render(page) {
      let count = 0; // Anzahl sichtbarer Zeilen (0 = noch nicht gestartet)

      const rows = h("div", "presentation__matching");
      const note = h("p", "presentation__muted");
      const actions = h("div", "presentation__actions");
      const start = h("button", "btn", "Zuordnung starten");
      const nextRow = h("button", "btn btn--secondary", "Nächster Schritt");
      const reset = h("button", "btn btn--secondary", "Zurücksetzen");
      start.type = nextRow.type = reset.type = "button";
      actions.append(start, nextRow, reset);

      function render() {
        rows.replaceChildren();
        for (let i = 1; i <= count; i++) {
          const row = h("div", "presentation__matching-row");
          row.append(
            h("span", "presentation__matching-number", String(i)),
            h("span", "presentation__matching-arrow", "→"),
            h("span", "", `${matching.itemLabel} ${i}`)
          );
          rows.append(row);
        }
        start.disabled = count > 0;
        nextRow.disabled = count === 0 || count >= matching.itemCount;
        note.textContent = count >= matching.itemCount ? matching.continuationNote : "";
      }

      start.addEventListener("click", () => { count = 1; render(); });
      nextRow.addEventListener("click", () => { count = Math.min(count + 1, matching.itemCount); render(); });
      reset.addEventListener("click", () => { count = 0; render(); });

      render();
      page.append(
        h("h3", "", "Jedem Element eine Nummer geben"),
        h("p", "", "Ordne jedem Element der Reihe nach eine natürliche Zahl zu."),
        actions,
        rows,
        note
      );
    },
  };
}
