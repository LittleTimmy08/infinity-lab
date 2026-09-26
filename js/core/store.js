/**
 * store.js
 * ------------------------------------------------------------
 * Ein kleiner, rein clientseitiger Laufzeit-Speicher für den aktuellen
 * Zustand einer Sitzung (Runtime-Session). Der Store lebt ausschließlich
 * im Arbeitsspeicher des Browsers: kein localStorage, kein sessionStorage,
 * keine Cookies, kein Server. Nach einem Reload ist der Inhalt bewusst
 * weg – die nächste createStore()-Instanz startet mit einer neuen,
 * zufälligen Session-ID. Das ist gewollt, nicht ein Fehler.
 *
 * store.js kennt keine Mathematik: Es speichert nur, WELCHE Experiment-
 * bzw. Darstellungs-ID gerade aktiv ist (reine Zeichenketten), nie WAS
 * ein Experiment inhaltlich bedeutet. Das entscheiden ausschließlich
 * content/ und presentations/.
 *
 * State-Struktur (siehe createInitialState unten):
 *   session      { id, startedAt }                Laufzeit-Session,
 *                                                  keine personenbezogenen Daten
 *   experiment   { id, presentation }              aktuell geöffnetes
 *                                                  Experiment/Darstellung
 *   assessment   { pretest, learning, posttest }   nur strukturelle
 *                                                  Platzhalter für spätere
 *                                                  Phasen, hier überall null
 *
 * API:
 *   getState()           Kopie des aktuellen State. Das Verändern der
 *                         Kopie hat keine Wirkung auf den Store (read-only).
 *   setState(partial)     Ersetzt genau die im partial angegebenen OBERSTEN
 *                         Bereiche (session/experiment/assessment) komplett;
 *                         nicht angegebene Bereiche bleiben unverändert. Kein
 *                         tiefes Zusammenführen einzelner Unterfelder: Wer
 *                         z.B. nur experiment.presentation ändern will, gibt
 *                         trotzdem das komplette experiment-Objekt an (siehe
 *                         js/modules/content-experiment.js). Das hält den
 *                         Store bewusst einfach – kein Redux, kein Merge-
 *                         Algorithmus für beliebig tiefe Objekte.
 *   reset()               Frischer Initialzustand mit neuer Session-ID.
 *   subscribe(listener)   listener(state) wird bei jeder Änderung
 *                         (setState/reset) mit einer frischen Kopie
 *                         aufgerufen. Rückgabewert ist eine unsubscribe()-
 *                         Funktion. Mehrfaches Abonnieren derselben
 *                         Funktion zählt nur einmal (Set statt Liste).
 */

function createSessionId() {
  if (typeof crypto !== "undefined" && typeof crypto.randomUUID === "function") {
    return crypto.randomUUID();
  }
  // Fallback für Umgebungen ohne crypto.randomUUID: keine echte Kryptografie
  // nötig, die ID dient nur der Laufzeit-Zuordnung, nie der Sicherheit.
  return "id-xxxxxxxxxxxxxxxx".replace(/x/g, () => Math.floor(Math.random() * 16).toString(16));
}

function createInitialState() {
  return {
    session: { id: createSessionId(), startedAt: new Date().toISOString() },
    experiment: { id: null, presentation: null },
    assessment: { pretest: null, learning: null, posttest: null },
  };
}

/** Einfache, abhängigkeitsfreie Kopie eines reinen Daten-Objekts (keine Funktionen enthalten). */
function clone(value) {
  return JSON.parse(JSON.stringify(value));
}

export function createStore() {
  let state = createInitialState();
  const listeners = new Set();

  function getState() {
    return clone(state);
  }

  function notify() {
    const snapshot = getState();
    listeners.forEach((listener) => listener(snapshot));
  }

  function setState(partial) {
    state = { ...state, ...clone(partial) };
    notify();
  }

  function reset() {
    state = createInitialState();
    notify();
  }

  function subscribe(listener) {
    listeners.add(listener);
    return () => listeners.delete(listener);
  }

  return { getState, setState, reset, subscribe };
}
