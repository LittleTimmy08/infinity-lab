/**
 * learning-step.js (RESEARCH)
 * ------------------------------------------------------------
 * Die Lernphase im Forschungsmodus. Zeigt GENAU EINE, serverseitig
 * zugewiesene Darstellung des Hilbert-Hotels – ohne Umschalter, ohne
 * sichtbaren Hinweis auf eine zweite Variante (technische Spezifikation
 * v1.3 §13/§19).
 *
 * "Gruppe A" = die bestehende "interactive"-Darstellung (Manipulation +
 * unmittelbares Feedback), "Gruppe B" = die bestehende "narrative"-
 * Darstellung (linear, nicht manipulierbar) – siehe js/presentations/.
 * Beide existieren bereits und werden hier unverändert wiederverwendet,
 * genauso wie js/components/experiment-frame.js: Diese Datei baut keine
 * neue Visualisierung, sie entscheidet nur, WELCHE der bestehenden
 * gezeigt wird, und lässt dafür den sonst dort vorhandenen Umschalter
 * einfach weg (experiment-frame.js ohne die toolbar-Option).
 *
 * Nutzungssignale (§14): Start-/Endzeit, Dauer und eine einfache
 * Interaktionszählung. Die Zählung hängt sich als EIN delegierter
 * Event-Listener an den Rahmen, statt narrative.js/interactive.js
 * selbst anzufassen – so bleiben die bestehenden Darstellungen
 * unverändert wiederverwendbar, wie gefordert.
 */

import { h } from "../presentations/dom.js";
import { createExperimentFrame } from "../components/experiment-frame.js";
import { getContent } from "../content/index.js";
import { getPresentation } from "../presentations/index.js";

export function renderLearningStep(container, { id, participant, navigate, participantStore, signal }) {
  const content = getContent("hilbert-hotel");
  const presentation = getPresentation(participant.condition); // "interactive" oder "narrative"

  const { visualization, controls } = createExperimentFrame(container, {
    title: content.title,
    description: "Lies dir in Ruhe an, wie das Hilbert-Hotel funktioniert.",
  });

  const startedAt = new Date().toISOString();
  const startedAtMs = Date.now();
  let interactionCount = 0;
  const countInteraction = () => {
    interactionCount += 1;
  };
  container.addEventListener("click", countInteraction, { signal });
  container.addEventListener("input", countInteraction, { signal });
  container.addEventListener("change", countInteraction, { signal });

  const presentationCleanup = presentation.render(content, { visualization, controls });

  const finishButton = h("button", "btn", "Weiter zu Teil 2");
  finishButton.type = "button";
  controls.append(finishButton);

  finishButton.addEventListener(
    "click",
    async () => {
      finishButton.disabled = true;
      if (typeof presentationCleanup === "function") presentationCleanup();
      const completedAt = new Date().toISOString();
      await participantStore.saveLearning({
        code: participant.code,
        startedAt,
        completedAt,
        duration: Date.now() - startedAtMs,
        usageSignals: { condition: participant.condition, interactionCount },
      });
      navigate(`/lab/${id}/t2`);
    },
    { signal }
  );
}
