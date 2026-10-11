/**
 * flow.js (RESEARCH)
 * ------------------------------------------------------------
 * Der Forschungs-Flow für den Hilbert-Hotel-Forschungsmodus (siehe
 * technische Spezifikation v1.3). Bildet die Client-Seite der
 * serverseitigen Zustandsmaschine ab:
 *
 *   created → t1 → assigned → learning → t2 → waiting → t3 → done
 *
 * Die Routen-Schritte (siehe main.js, Muster "/lab/:id/:step") sind
 * eine Teilmenge davon – "created" und "assigned" sind serverseitig
 * zwar eigene Zustände, haben aber keinen eigenen Bildschirm: Eine neu
 * angelegte Teilnahme ist sofort beim Schritt "t1" (siehe
 * js/data/mock-backend.js), und "assigned" ist der Moment zwischen
 * T1-Abschluss und Lernphasen-Beginn, den niemand als eigene Seite
 * sieht. Deshalb bildet RESEARCH_STEPS nur die sechs tatsächlich
 * sichtbaren Schritte ab.
 *
 * WICHTIG, wie gefordert (§6/§18 der Spezifikation): Dieser Flow ist
 * NICHT vertrauenswürdig. Er führt nur eine freundliche, clientseitige
 * Weiterleitung zum jeweils richtigen Schritt aus, wenn z.B. jemand per
 * Browser-Adresse direkt auf einen späteren Schritt springt. Die
 * verbindliche Prüfung jedes Übergangs passiert später serverseitig
 * (Phase 6B, Durable Object).
 *
 * Ebenfalls wie gefordert (§19): Dieser Flow verwendet NICHT den
 * bestehenden js/core/store.js (der bleibt der flüchtige Demo-Store).
 * Der "aktive Teilnehmercode" lebt nur als Modul-Variable hier – geht
 * bei einem Reload bewusst verloren, genau wie im echten System auch:
 * Ein neuer Tab/ein neues Gerät kennt den Code nicht automatisch,
 * sondern die Person gibt ihn auf dem "code"-Bildschirm erneut ein.
 */

import { h } from "../presentations/dom.js";
import { renderAssessmentStep } from "./assessment-step.js";
import { renderLearningStep } from "./learning-step.js";

export const RESEARCH_STEPS = ["code", "t1", "learning", "t2", "t3", "done"];

// Welcher Schritt zu welchem (Mock-)Status passt. "waiting" zeigt denselben
// Schritt wie "t3" (die Wartenachricht ist Teil des t3-Bildschirms, siehe
// assessment-step.js); "assigned" kommt hier nicht vor (siehe Kopfkommentar).
const STEP_FOR_STATUS = {
  t1: "t1",
  learning: "learning",
  t2: "t2",
  waiting: "t3",
  t3: "t3",
  done: "done",
};

let activeCode = null;

/** NUR FÜR TESTS: lässt den Flow den zuletzt aktiven Code vergessen, ohne die Seite neu zu laden. */
export function __testForgetActiveCode() {
  activeCode = null;
}

export function renderResearchStep(container, { id, step, navigate, participantStore }) {
  container.innerHTML = "";
  const abort = new AbortController();

  if (step === "code") {
    renderCodeStep(container, { id, navigate, participantStore, signal: abort.signal });
    return () => abort.abort();
  }

  if (!activeCode) {
    // Kein Teilnehmercode in dieser Sitzung bekannt (z.B. nach Reload) –
    // freundlich zum Einstieg zurückschicken, statt eine kaputte Seite zu
    // zeigen oder stillschweigend einen neuen Teilnehmer zu erfinden.
    navigate(`/lab/${id}/code`);
    return () => abort.abort();
  }

  let cancelled = false;
  // Immer frisch laden statt auf zwischengespeicherte Daten zu vertrauen –
  // auch innerhalb dieser Sitzung kann sich der Status durch eine Aktion auf
  // einem anderen Gerät geändert haben (Spezifikation v1.3, Szenario 3).
  participantStore.loadParticipant({ code: activeCode }).then((participant) => {
    if (cancelled) return;
    if (!participant) {
      activeCode = null;
      navigate(`/lab/${id}/code`);
      return;
    }
    const correctStep = STEP_FOR_STATUS[participant.status];
    if (step !== correctStep) {
      navigate(`/lab/${id}/${correctStep}`);
      return;
    }
    renderStepBody(container, { id, step, participant, navigate, participantStore, signal: abort.signal });
  });

  return () => {
    cancelled = true;
    abort.abort();
  };
}

function renderStepBody(container, { id, step, participant, navigate, participantStore, signal }) {
  container.append(h("p", "research__code-banner", `Dein Code: ${participant.code} — notiere ihn dir für später.`));

  if (step === "t1" || step === "t2" || step === "t3") {
    renderAssessmentStep(container, { id, step, participant, navigate, participantStore, signal });
  } else if (step === "learning") {
    renderLearningStep(container, { id, participant, navigate, participantStore, signal });
  } else if (step === "done") {
    renderDoneStep(container);
  }
}

function renderCodeStep(container, { id, navigate, participantStore, signal }) {
  const root = h("div", "research");
  root.append(
    h("h2", "", "Am Hilbert-Hotel-Forschungsprojekt teilnehmen"),
    h(
      "p",
      "research__muted",
      "Hast du schon einen Forschungscode? Dann gib ihn unten ein. Sonst erzeugst du jetzt einen neuen."
    )
  );

  const input = h("input", "input");
  input.placeholder = "z.B. K7M4-XP9Q-2L8R";
  const resumeLabel = h("label", "field-label", "Vorhandenen Code eingeben");
  const resumeField = h("div", "field");
  resumeField.append(resumeLabel, input);

  const resumeButton = h("button", "btn btn--secondary", "Fortsetzen");
  resumeButton.type = "button";
  const createButton = h("button", "btn", "Neu beginnen");
  createButton.type = "button";
  const actions = h("div", "research__actions");
  actions.append(createButton);

  const message = h("p", "research__feedback");

  resumeButton.addEventListener(
    "click",
    async () => {
      const code = input.value.trim().toUpperCase();
      if (!code) {
        message.textContent = "Bitte gib deinen Code ein.";
        return;
      }
      const participant = await participantStore.loadParticipant({ code });
      if (!participant) {
        message.textContent = "Dieser Code ist nicht bekannt. Bitte prüfe ihn noch einmal.";
        return;
      }
      activeCode = code;
      navigate(`/lab/${id}/${STEP_FOR_STATUS[participant.status]}`);
    },
    { signal }
  );

  createButton.addEventListener(
    "click",
    async () => {
      const { code, participant } = await participantStore.createParticipant({});
      activeCode = code;
      showCreatedCode(container, {
        code,
        onContinue: () => navigate(`/lab/${id}/${STEP_FOR_STATUS[participant.status]}`),
      });
    },
    { signal }
  );

  root.append(resumeField, resumeButton, h("hr", "research__divider"), actions, message);
  container.append(root);
}

function showCreatedCode(container, { code, onContinue }) {
  const root = h("div", "research");
  root.append(
    h("h2", "", "Dein Forschungscode"),
    h("p", "", "Notiere dir diesen Code — du brauchst ihn in ein paar Tagen noch einmal:"),
    h("p", "research__code", code)
  );
  const button = h("button", "btn", "Weiter");
  button.type = "button";
  button.addEventListener("click", onContinue);
  root.append(button);
  container.innerHTML = "";
  container.append(root);
}

function renderDoneStep(container) {
  const root = h("div", "research");
  root.append(
    h("h2", "", "Danke für deine Teilnahme!"),
    h("p", "", "Alle drei Teile sind abgeschlossen. Du kannst dieses Fenster jetzt schließen.")
  );
  container.append(root);
}
