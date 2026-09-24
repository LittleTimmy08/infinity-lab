/**
 * interactive.js (PRESENTATION – technischer Platzhalter)
 * ------------------------------------------------------------
 * "Interaktive" Darstellung: Man wählt ein Beispiel und eine
 * Zimmernummer n und sieht, in welches Zimmer der Gast umzieht.
 * Bewusst einfach (Auswahl + Schieberegler), kein Spiel.
 *
 * Nur ein Platzhalter, um die Architektur zu testen.
 */

import { h } from "./dom.js";
import { applyRoomRule, formatRoomRule } from "../content/rules.js";

const MAX_ROOM = 12; // größte Zimmernummer am Schieberegler

export const interactivePresentation = {
  id: "interactive",
  label: "Interaktiv (Platzhalter)",

  render(content, { visualization, controls }) {
    // Nur Beispiele mit Zimmerregel lassen sich hier durchrechnen.
    const examples = content.examples.filter((example) => example.roomRule);
    let example = examples[0];
    let n = 1;

    // ----- Steuerung: Auswahl des Beispiels + Schieberegler -----
    const select = h("select", "input");
    select.id = "interactive-example";
    examples.forEach((item) => select.append(new Option(item.title, item.id)));
    const selectLabel = h("label", "field-label", "Beispiel");
    selectLabel.htmlFor = select.id;

    const slider = h("input", "slider");
    slider.type = "range";
    slider.id = "interactive-room";
    slider.min = "1";
    slider.max = String(MAX_ROOM);
    slider.value = String(n);
    const sliderLabel = h("label", "field-label", "Zimmernummer n");
    sliderLabel.htmlFor = slider.id;
    const sliderValue = h("output", "field-value");
    sliderValue.htmlFor = slider.id;

    controls.append(wrapField(selectLabel, select), wrapField(sliderLabel, slider, sliderValue));

    // ----- Darstellung -----
    const root = h("div", "presentation");
    visualization.append(root);

    function show() {
      const rule = example.roomRule;
      const chips = h("div", "presentation__chips");
      for (let room = 1; room <= MAX_ROOM; room++) {
        chips.append(h("span", room === n ? "badge" : "badge badge--muted", `${room} → ${applyRoomRule(rule, room)}`));
      }
      sliderValue.textContent = String(n);
      root.replaceChildren(
        h("h3", "", example.title),
        h("p", "presentation__muted", example.situation),
        h("p", "", `Regel: ${formatRoomRule(rule)}`),
        h("p", "", `Der Gast aus Zimmer ${n} zieht in Zimmer ${applyRoomRule(rule, n)}.`),
        chips,
        h("p", "presentation__muted", example.result)
      );
    }

    const abort = new AbortController();
    select.addEventListener("change", () => {
      example = examples.find((item) => item.id === select.value);
      show();
    }, { signal: abort.signal });
    slider.addEventListener("input", () => {
      n = Number(slider.value);
      show();
    }, { signal: abort.signal });
    show();

    return () => abort.abort(); // Cleanup: Listener entfernen
  },
};

/** Baut ein .field: Beschriftung (mit optionalem Wert daneben) über dem Steuerelement. */
function wrapField(label, control, value) {
  const field = h("div", "field");
  const header = h("div", "field-header");
  header.append(label);
  if (value) header.append(value);
  field.append(header, control);
  return field;
}
