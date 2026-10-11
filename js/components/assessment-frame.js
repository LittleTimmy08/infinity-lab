/**
 * assessment-frame.js
 * ------------------------------------------------------------
 * Eigener, schlanker Rahmen für Forschungs-Testbildschirme (T1/T2/T3).
 * BEWUSST GETRENNT von js/components/experiment-frame.js (siehe
 * technische Spezifikation v1.3 §4/§21): Ein Test ist Frage für Frage,
 * nicht Visualisierung+Steuerung, und soll nicht an die freie Demo-Optik
 * gekoppelt sein. Nutzt dieselben Bausteine wie der Rest von Infinity
 * Lab (.card-ähnliche Flächen, .btn, .input), aber ein eigenes,
 * einspaltiges Layout.
 *
 * Itemformat (reine Daten, siehe js/assessment/placeholder-items.js):
 *   { id, type: "single-choice" | "open", prompt, options? }
 *   options (nur bei "single-choice"): [{ id, label }]
 *
 * Antwortformat, das onComplete() übergeben bekommt – ein Eintrag pro
 * Item, in derselben Reihenfolge:
 *   { itemId, answered, answer, timestamp }
 * answered ist false, wenn das Item übersprungen/nicht beantwortet
 * wurde; answer ist dann null. "Unbeantwortet" wird NICHT mit einer
 * falschen Antwort gleichgesetzt (Spezifikation v1.3 §12).
 *
 * Diese Datei kennt keine richtigen/falschen Antworten und berechnet
 * keinen Score – das ist bewusst (die Bewertungsschicht kommt später,
 * außerhalb dieser Phase).
 */

import { h } from "../presentations/dom.js";

export function runAssessment(container, { title, items, signal, onComplete }) {
  let index = 0;
  const responses = new Map(); // itemId -> { itemId, answered, answer, timestamp }

  const root = h("div", "assessment");
  const header = h("div", "assessment__header");
  header.append(h("h2", "", title), h("p", "assessment__progress"));

  const body = h("div", "assessment__item");
  const back = h("button", "btn btn--secondary", "← Zurück");
  const next = h("button", "btn", "Weiter →");
  back.type = next.type = "button";
  const nav = h("div", "assessment__nav");
  nav.append(back, next);

  root.append(header, body, nav);
  container.append(root);

  const progress = header.querySelector(".assessment__progress");

  function currentAnswer() {
    const item = items[index];
    return responses.get(item.id) ?? { itemId: item.id, answered: false, answer: null, timestamp: null };
  }

  function setAnswer(answer) {
    const item = items[index];
    responses.set(item.id, { itemId: item.id, answered: true, answer, timestamp: new Date().toISOString() });
  }

  function renderItem() {
    const item = items[index];
    const existing = currentAnswer();
    body.replaceChildren();
    body.append(h("p", "assessment__prompt", item.prompt));

    if (item.type === "single-choice") {
      const options = h("div", "assessment__options");
      item.options.forEach((option) => {
        const optionButton = h("button", "btn btn--secondary", option.label);
        optionButton.type = "button";
        optionButton.classList.toggle("is-selected", existing.answer === option.id);
        optionButton.addEventListener(
          "click",
          () => {
            setAnswer(option.id);
            renderItem();
          },
          { signal }
        );
        options.append(optionButton);
      });
      body.append(options);
    } else if (item.type === "open") {
      const textarea = h("textarea", "input assessment__textarea");
      textarea.rows = 4;
      textarea.value = existing.answer ?? "";
      textarea.addEventListener(
        "input",
        () => {
          const value = textarea.value;
          if (value.trim() === "") responses.delete(item.id);
          else setAnswer(value);
        },
        { signal }
      );
      body.append(textarea);
    }

    progress.textContent = `Frage ${index + 1} von ${items.length}`;
    back.disabled = index === 0;
    next.textContent = index === items.length - 1 ? "Abschließen" : "Weiter →";
  }

  back.addEventListener(
    "click",
    () => {
      index -= 1;
      renderItem();
    },
    { signal }
  );

  next.addEventListener(
    "click",
    () => {
      if (index < items.length - 1) {
        index += 1;
        renderItem();
        return;
      }
      const allResponses = items.map(
        (item) => responses.get(item.id) ?? { itemId: item.id, answered: false, answer: null, timestamp: null }
      );
      onComplete(allResponses);
    },
    { signal }
  );

  renderItem();
}
