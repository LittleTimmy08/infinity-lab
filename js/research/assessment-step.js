/**
 * assessment-step.js (RESEARCH)
 * ------------------------------------------------------------
 * Rendert T1, T2 und T3 – alle drei nutzen dieselbe Infrastruktur
 * (js/components/assessment-frame.js) und unterscheiden sich nur durch
 * den Messzeitpunkt und die verwendete Testform (Form 1 / Form 2, siehe
 * Methodenkonzept – NICHT A/B, das bleibt für die Lernbedingung
 * reserviert).
 *
 * Die hier verwendeten Items sind ausdrücklich NUR Platzhalter
 * (js/assessment/placeholder-items.js) – die echten Testfragen sind
 * noch nicht entwickelt. Es geht in Phase 6A nur um die technische
 * Struktur: T1 ohne Lösungshinweise/Feedback, strukturierte und offene
 * Antworten, unbeantwortet ≠ falsch, keine automatische Bewertung.
 *
 * Für T3 wird unterschieden zwischen dem Status "waiting" (T2 ist
 * fertig, das Zeitfenster für T3 ist aber noch nicht erreicht – zeigt
 * eine Wartenachricht statt des Tests) und "t3" (T3 ist freigegeben).
 */

import { h } from "../presentations/dom.js";
import { runAssessment } from "../components/assessment-frame.js";
import { placeholderItems } from "../assessment/placeholder-items.js";

export function renderAssessmentStep(container, { id, step, participant, navigate, participantStore, signal }) {
  if (step === "t3" && participant.status === "waiting") {
    renderWaitingScreen(container);
    return;
  }

  const items = itemsFor(step, participant);
  const title = { t1: "Teil 1", t2: "Teil 2", t3: "Teil 3" }[step];

  runAssessment(container, {
    title,
    items,
    signal,
    onComplete: async (responses) => {
      if (step === "t1") {
        const priorKnowledge = responses.find((r) => r.itemId === "prior-knowledge")?.answer ?? null;
        await participantStore.saveT1({ code: participant.code, responses, priorKnowledge });
        navigate(`/lab/${id}/learning`);
      } else if (step === "t2") {
        await participantStore.saveT2({ code: participant.code, responses });
        navigate(`/lab/${id}/t3`); // zeigt danach, abhängig vom Status, die Wartenachricht
      } else if (step === "t3") {
        await participantStore.saveT3({ code: participant.code, responses });
        navigate(`/lab/${id}/done`);
      }
    },
  });
}

function itemsFor(step, participant) {
  if (step === "t1") return placeholderItems.t1;
  const form = step === "t2" ? participant.form.t2 : participant.form.t3;
  return placeholderItems[`${step}-${form}`];
}

function renderWaitingScreen(container) {
  const root = h("div", "research");
  root.append(
    h("h2", "", "Teil 3 kommt später"),
    h(
      "p",
      "",
      "Teil 2 ist abgeschlossen. In ein paar Tagen kannst du mit demselben Code hierher zurückkommen, um Teil 3 zu machen."
    )
  );
  container.append(root);
}
