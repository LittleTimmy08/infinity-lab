/**
 * mock-backend.js  —  NUR FÜR LOKALE ENTWICKLUNG UND TESTS
 * ------------------------------------------------------------
 * Eine In-Memory-"Datenbank" für js/data/participant-store.js, rein im
 * Arbeitsspeicher dieser einen Browser-Sitzung. KEINE Persistenz über
 * einen Reload hinweg – absichtlich kein localStorage (siehe technische
 * Spezifikation v1.3 §7: "Keine localStorage-Fake-Datenbank als Ersatz
 * für die spätere zentrale Persistenz").
 *
 * Diese Datei wird in Phase 6B durch einen echten Client ersetzt, der
 * dieselben sechs Methoden gegen den Cloudflare Worker aufruft. Sie
 * darf NIE im produktiven Forschungsmodus verwendet werden – main.js
 * entscheidet, welches backend-Objekt an createParticipantStore()
 * übergeben wird, und tut das für Phase 6A bewusst nur hier.
 *
 * Bewusste Vereinfachungen gegenüber der echten Spezifikation (gelten
 * NUR für diesen Mock, nicht für die spätere Forschungslogik):
 *  - Codes liegen im Klartext im Speicher (kein Hashing nötig, da hier
 *    ohnehin nichts über einen Prozessneustart hinaus existiert).
 *  - Die Gruppenzuweisung ist ein einfacher Rundlauf (abwechselnd
 *    interactive/narrative), keine echte Kohorten-Durable-Object-Logik
 *    mit kohortenübergreifender Zählung.
 *  - Es gibt keine echte "cohortId" aus einem Start-Token – alle
 *    Mock-Teilnehmer landen in derselben Entwicklungs-Kohorte.
 *
 * Statusmodell (siehe js/research/flow.js für die Begründung, warum
 * "created" und "assigned" hier nicht als eigene, beobachtbare Werte
 * auftauchen): ein neu angelegter Teilnehmer startet direkt bei "t1".
 */

const participantsByCode = new Map();
let nextConditionIsInteractive = true;

function randomCode() {
  // Vermeidet leicht verwechselbare Zeichen (0/O, 1/I/L).
  const alphabet = "23456789ABCDEFGHJKMNPQRSTUVWXYZ";
  const group = () =>
    Array.from({ length: 4 }, () => alphabet[Math.floor(Math.random() * alphabet.length)]).join("");
  return `${group()}-${group()}-${group()}`;
}

function requireParticipant(code) {
  const participant = participantsByCode.get(code);
  if (!participant) throw new Error(`Unbekannter Forschungscode (Mock-Backend): "${code}".`);
  return participant;
}

export const mockBackend = {
  async createParticipant() {
    const code = randomCode();
    const participant = {
      code,
      cohortId: "dev-cohort",
      status: "t1",
      condition: null,
      form: { t2: null, t3: null },
      t1: null,
      learning: null,
      t2: null,
      t3: null,
    };
    participantsByCode.set(code, participant);
    return { code, participant };
  },

  async loadParticipant({ code }) {
    return participantsByCode.get(code) ?? null;
  },

  async saveT1({ code, responses, priorKnowledge }) {
    const participant = requireParticipant(code);
    if (participant.status !== "t1") {
      throw new Error(`T1 kann im Status "${participant.status}" nicht gespeichert werden.`);
    }
    participant.t1 = { responses, priorKnowledge, completedAt: new Date().toISOString() };
    // Gruppenzuweisung: serverseitig, einmalig, im selben Vorgang wie das
    // Speichern von T1 (Spezifikation v1.3 §11). Der echte Cohort-DO zählt
    // dafür über die Kohorte hinweg aus; dieser Mock alterniert nur lokal –
    // das genügt, um das Frontend zu entwickeln und zu testen.
    participant.condition = nextConditionIsInteractive ? "interactive" : "narrative";
    nextConditionIsInteractive = !nextConditionIsInteractive;
    participant.status = "learning";
    return participant;
  },

  async saveLearning({ code, startedAt, completedAt, duration, usageSignals }) {
    const participant = requireParticipant(code);
    if (participant.status !== "learning") {
      throw new Error(`Lernphase kann im Status "${participant.status}" nicht gespeichert werden.`);
    }
    participant.learning = { startedAt, completedAt, duration, usageSignals };
    // Formenzuweisung für T2/T3 (Gegenbalancierung, siehe Methodenkonzept):
    // wird hier einmalig festgelegt und bleibt danach unverändert.
    const firstForm = Math.random() < 0.5 ? "form-1" : "form-2";
    participant.form = { t2: firstForm, t3: firstForm === "form-1" ? "form-2" : "form-1" };
    participant.status = "t2";
    return participant;
  },

  async saveT2({ code, responses }) {
    const participant = requireParticipant(code);
    if (participant.status !== "t2") {
      throw new Error(`T2 kann im Status "${participant.status}" nicht gespeichert werden.`);
    }
    participant.t2 = { form: participant.form.t2, responses, completedAt: new Date().toISOString() };
    participant.status = "waiting";
    return participant;
  },

  async saveT3({ code, responses }) {
    const participant = requireParticipant(code);
    if (participant.status !== "t3") {
      throw new Error(`T3 kann im Status "${participant.status}" nicht gespeichert werden.`);
    }
    participant.t3 = { form: participant.form.t3, responses, completedAt: new Date().toISOString() };
    participant.status = "done";
    return participant;
  },
};

/**
 * NUR FÜR TESTS: schaltet einen Teilnehmer sofort von "waiting" auf "t3",
 * ohne auf das echte Zeitfenster zu warten. Kein Teil der UI ruft das auf –
 * in der echten Anwendung entscheidet später der Server, wann T3 freigegeben
 * wird (Spezifikation v1.3 §12, Zielintervall ca. 14 Tage).
 */
export function __testSkipWaitingForT3(code) {
  const participant = requireParticipant(code);
  if (participant.status === "waiting") participant.status = "t3";
  return participant;
}

/** NUR FÜR TESTS: setzt den Mock auf einen leeren Zustand zurück. */
export function __testResetMockBackend() {
  participantsByCode.clear();
  nextConditionIsInteractive = true;
}
