/**
 * quiz.js (PRESENTATION – gemeinsamer Helfer)
 * ------------------------------------------------------------
 * Eine kleine Verständnisfrage mit Auswahlmöglichkeiten und sofortiger
 * Rückmeldung. Das ist KEIN Pre-/Post-Test: Es wird nichts gespeichert
 * oder ausgewertet, die Auswahl lebt nur in diesem DOM/JS-Zustand und
 * verschwindet, sobald der Schritt/das Experiment verlassen wird.
 *
 * quiz: {
 *   question, correctOptionId,
 *   options: [{ id, label, feedback? }],   // feedback ist optional pro Option
 *   correctExplanation?, incorrectExplanation?,  // Rückfall, falls eine
 *                                                 // Option kein eigenes feedback hat
 * }
 *
 * Rückmeldung wird IMMER als Text angezeigt (nie nur über Farbe), die
 * Farbe (siehe style.css) ist nur eine zusätzliche, keine alleinige
 * Kennzeichnung von richtig/falsch.
 */

import { h } from "./dom.js";

export function renderQuiz(container, quiz) {
  const question = h("p", "", quiz.question);
  const optionsWrap = h("div", "presentation__options");
  const feedback = h("p", "presentation__feedback");

  quiz.options.forEach((option) => {
    const button = h("button", "btn btn--secondary", option.label);
    button.type = "button";
    button.addEventListener("click", () => {
      const correct = option.id === quiz.correctOptionId;
      feedback.textContent = option.feedback || (correct ? quiz.correctExplanation : quiz.incorrectExplanation);
      feedback.classList.toggle("presentation__feedback--correct", correct);
      feedback.classList.toggle("presentation__feedback--incorrect", !correct);
      [...optionsWrap.children].forEach((btn) => btn.classList.toggle("is-selected", btn === button));
    });
    optionsWrap.append(button);
  });

  container.append(question, optionsWrap, feedback);
}
