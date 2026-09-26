/**
 * stepper.js (PRESENTATION – gemeinsamer Helfer)
 * ------------------------------------------------------------
 * Kleiner Schritt-für-Schritt-Assistent für mehrseitige Darstellungen
 * (aktuell genutzt von countable-interactive.js und diagonal-interactive.js).
 * Baut auf demselben Muster wie narrative.js auf (Zurück/Weiter + Zähler
 * in der Steuerung), erlaubt aber Schritten, eigene Bedienelemente in
 * die Seite selbst einzufügen (z.B. "Zuordnung starten").
 *
 * steps: Liste von { render(page) }
 *   page   ist ein leeres <div> (Klasse "presentation"), in das der
 *          Schritt seinen Inhalt einfügt (Text, Überschrift, eigene Buttons).
 *   render darf optional eine Aufräum-Funktion zurückgeben, falls der
 *          Schritt eigene Listener/Timer anlegt, die beim Verlassen des
 *          Schritts beendet werden müssen.
 */

import { h } from "./dom.js";

export function createStepper({ visualization, controls }, steps) {
  let index = 0;
  let stepCleanup = null;

  const page = h("div", "presentation");
  visualization.append(page);

  const previous = h("button", "btn btn--secondary", "← Zurück");
  const next = h("button", "btn", "Weiter →");
  previous.type = next.type = "button";
  const counter = h("p", "presentation__muted");
  controls.append(previous, next, counter);

  function runStepCleanup() {
    const cleanup = stepCleanup;
    stepCleanup = null;
    if (cleanup) cleanup();
  }

  function show() {
    runStepCleanup();
    page.replaceChildren();
    counter.textContent = `Schritt ${index + 1} von ${steps.length}`;
    previous.disabled = index === 0;
    next.disabled = index === steps.length - 1;
    const result = steps[index].render(page);
    stepCleanup = typeof result === "function" ? result : null;
  }

  const abort = new AbortController();
  previous.addEventListener("click", () => { index -= 1; show(); }, { signal: abort.signal });
  next.addEventListener("click", () => { index += 1; show(); }, { signal: abort.signal });
  show();

  return () => { abort.abort(); runStepCleanup(); }; // Cleanup: Listener entfernen, aktuellen Schritt aufräumen
}
