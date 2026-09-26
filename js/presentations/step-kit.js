/**
 * step-kit.js (PRESENTATION – gemeinsamer Helfer)
 * ------------------------------------------------------------
 * Bausteine für Schritte, die in mehreren Stepper-Darstellungen gleich
 * aussehen sollen: ein reiner Text-Schritt, der hervorgehobene
 * Aha-Moment-Kasten, die kleine Verständnisfrage (siehe quiz.js) und
 * die Zusammenfassung am Ende. Erwartet die Datenform aus den
 * content/*.js-Dateien (ahaMoment, quiz, summary).
 */

import { h } from "./dom.js";
import { renderQuiz } from "./quiz.js";

/** Ein einfacher Schritt: Überschrift + ein oder mehrere Absätze. */
export function textStep(heading, paragraphs) {
  return {
    render(page) {
      page.append(h("h3", "", heading), ...paragraphs.map((text) => h("p", "", text)));
    },
  };
}

/** Der hervorgehobene Erklärungsbereich nach der Interaktion. */
export function ahaStep(ahaMoment) {
  return {
    render(page) {
      const box = h("div", "presentation__box");
      box.append(...ahaMoment.lines.map((line) => h("p", "", line)));
      if (ahaMoment.conclusion) box.append(h("p", "", ahaMoment.conclusion));
      page.append(h("h3", "", "Der entscheidende Gedanke"), box);
    },
  };
}

/** Die kleine Verständnisfrage. Keine Speicherung, kein Scoring. */
export function quizStep(quiz) {
  return {
    render(page) {
      page.append(h("h3", "", "Kurz nachgedacht"));
      renderQuiz(page, quiz);
    },
  };
}

/** Die Zusammenfassung am Ende, optional mit Merksatz. */
export function summaryStep(summary) {
  return {
    render(page) {
      const list = h("ul", "presentation__list");
      summary.points.forEach((point) => {
        const item = document.createElement("li");
        item.textContent = point;
        list.append(item);
      });
      page.append(h("h3", "", "Zusammenfassung"), list);
      if (summary.mnemonic) page.append(h("p", "presentation__box", summary.mnemonic));
    },
  };
}
