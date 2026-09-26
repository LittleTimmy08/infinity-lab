/**
 * diagonal-interactive.js (PRESENTATION)
 * ------------------------------------------------------------
 * Die (bisher einzige) Darstellung für das Experiment "diagonal-argument".
 * Ein geführter Ablauf in Schritten (siehe stepper.js):
 *
 *   1. Demonstrationsliste     (content.sections[0], content.demoList, content.listNote)
 *   2. Diagonale markieren     (eigener Schritt unten, Ziffer für Ziffer)
 *   3. Neue Zahl konstruieren  (eigener Schritt unten, per Knopfdruck)
 *   4. Vergleich mit der Liste (eigener Schritt unten)
 *   5. Aha-Moment               (content.ahaMoment, aus step-kit.js)
 *   6. Verständnisfrage         (content.quiz, aus step-kit.js)
 *   7. Zusammenfassung          (content.summary, aus step-kit.js)
 *
 * Die Mathematik (welche Ziffer zur Diagonale gehört, welche neue Ziffer
 * daraus wird) steht ausschließlich in content/diagonal.js – hier wird
 * nur dargestellt, nicht gerechnet.
 */

import { h } from "./dom.js";
import { createStepper } from "./stepper.js";
import { textStep, ahaStep, quizStep, summaryStep } from "./step-kit.js";
import { diagonalDigits, buildNewDigits } from "../content/diagonal.js";

export const diagonalInteractivePresentation = {
  id: "diagonal-interactive",
  label: "Interaktiv",

  render(content, slots) {
    const steps = [
      listStep(content),
      diagonalStep(content),
      newNumberStep(content),
      comparisonStep(content),
      ahaStep(content.ahaMoment),
      quizStep(content.quiz),
      summaryStep(content.summary),
    ];
    return createStepper(slots, steps);
  },
};

/** Eine Ziffernreihe. Die Ziffer an highlightIndex wird in eckigen Klammern gezeigt
 *  (nicht nur farblich hervorgehoben, damit die Markierung nicht allein über Farbe läuft). */
function digitsRow(digits, highlightIndex = -1) {
  const row = h("div", "presentation__digits");
  [...digits].forEach((digit, i) => {
    const span = h("span", "presentation__digit");
    if (i === highlightIndex) {
      span.classList.add("presentation__digit--diagonal");
      span.textContent = `[${digit}]`;
    } else {
      span.textContent = digit;
    }
    row.append(span);
  });
  return row;
}

function listRow(index, digits, highlightIndex = -1) {
  const row = h("div", "presentation__list-row");
  row.append(h("span", "presentation__list-index", `${index + 1}.`), h("span", "", "0,"), digitsRow(digits, highlightIndex));
  return row;
}

function listStep(content) {
  return {
    render(page) {
      page.append(h("h3", "", content.sections[0].heading), h("p", "", content.sections[0].text));
      if (content.listNote) page.append(h("p", "presentation__muted", content.listNote));
      content.demoList.forEach((digits, i) => page.append(listRow(i, digits)));
    },
  };
}

/**
 * Deckt die Diagonalziffern nacheinander auf: "Diagonale markieren" zeigt die
 * erste, jeder weitere Klick (Beschriftung wechselt zu "Nächste Ziffer") die
 * nächste, bis alle fünf markiert sind. "Zurücksetzen" blendet sie wieder aus.
 */
function diagonalStep(content) {
  return {
    render(page) {
      const total = content.demoList.length;
      let revealed = 0;

      const rowsWrap = h("div", "presentation__list");
      const note = h("p", "presentation__muted");
      const actions = h("div", "presentation__actions");
      const mark = h("button", "btn", "Diagonale markieren");
      const reset = h("button", "btn btn--secondary", "Zurücksetzen");
      mark.type = reset.type = "button";
      actions.append(mark, reset);

      function render() {
        rowsWrap.replaceChildren();
        content.demoList.forEach((digits, i) => {
          rowsWrap.append(listRow(i, digits, i < revealed ? i : -1));
        });
        mark.textContent = revealed === 0 ? "Diagonale markieren" : "Nächste Ziffer";
        mark.disabled = revealed >= total;
        note.textContent = revealed >= total ? "Das ist die Diagonale: die n-te Ziffer der n-ten Zahl." : "";
      }

      mark.addEventListener("click", () => { revealed = Math.min(revealed + 1, total); render(); });
      reset.addEventListener("click", () => { revealed = 0; render(); });

      render();
      page.append(h("h3", "", "Die Diagonale"), actions, rowsWrap, note);
    },
  };
}

/** "Neue Zahl erzeugen" baut aus den Diagonalziffern per Regel die neue Zahl auf. */
function newNumberStep(content) {
  return {
    render(page) {
      let built = false;
      const result = h("div", "presentation__box");
      const build = h("button", "btn", "Neue Zahl erzeugen");
      build.type = "button";

      function render() {
        if (!built) { result.replaceChildren(); return; }
        const digits = diagonalDigits(content.demoList);
        const newDigits = buildNewDigits(content.demoList, content.diagonalRule);
        const table = h("div", "presentation__digits");
        newDigits.forEach((newDigit, i) => {
          const span = h("span", "presentation__digit presentation__digit--diagonal");
          span.textContent = `${digits[i]} → ${newDigit}`;
          table.append(span);
        });
        result.replaceChildren(
          h("p", "", `Diagonalziffern: ${digits.join(", ")}`),
          table,
          h("p", "", `Neue Zahl: 0,${newDigits.join("")}...`)
        );
      }

      build.addEventListener("click", () => { built = true; render(); });
      render();
      page.append(
        h("h3", "", "Eine neue Zahl konstruieren"),
        h("p", "", "Wir verändern jede Diagonalziffer nach einer festen Regel und bauen daraus eine neue Zahl."),
        build,
        result
      );
    },
  };
}

function comparisonStep(content) {
  return {
    render(page) {
      const digits = diagonalDigits(content.demoList);
      const newDigits = buildNewDigits(content.demoList, content.diagonalRule);
      const list = h("ul", "presentation__list");
      content.demoList.forEach((_, i) => {
        const item = document.createElement("li");
        item.textContent =
          `Neue Zahl ≠ Zahl ${i + 1} an Stelle ${i + 1} ` +
          `(dort steht ${digits[i]}, die neue Zahl hat dort ${newDigits[i]}).`;
        list.append(item);
      });
      page.append(h("h3", "", "Vergleich mit der Liste"), list);
    },
  };
}
