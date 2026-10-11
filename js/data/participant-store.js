/**
 * participant-store.js
 * ------------------------------------------------------------
 * Schnittstelle zwischen dem Forschungs-Flow (js/research/) und der
 * eigentlichen Teilnehmer-Persistenz. Diese Datei kennt selbst keine
 * Datenbank, kein Cloudflare, kein SQLite – sie legt nur fest, WELCHE
 * Operationen es gibt, nicht WIE sie gespeichert werden.
 *
 * Phase 6A: noch kein echtes Backend. createParticipantStore(backend)
 * nimmt ein Objekt entgegen, das dieselben sechs Methoden implementiert.
 * Für die lokale Entwicklung/Tests liefert js/data/mock-backend.js so
 * ein Objekt (klar als Mock gekennzeichnet, siehe dort). Phase 6B
 * ersetzt nur dieses backend-Objekt durch echte fetch()-Aufrufe gegen
 * den Cloudflare Worker (technische Spezifikation v1.3) – der
 * Forschungs-Flow und die Assessment-Komponenten ändern sich dadurch
 * nicht, weil sie ausschließlich gegen diese Schnittstelle arbeiten.
 *
 * WICHTIG: Kein Teil dieser Datei kennt Forschungslogik (welche Gruppe
 * untersucht wird, was eine richtige Antwort ist, wie randomisiert
 * wird usw.) – sie reicht nur Daten durch.
 *
 * Erwartete Form eines Teilnehmer-Datensatzes (so, wie backend.* ihn
 * zurückgibt):
 *   {
 *     code, cohortId, status, condition,
 *     form: { t2, t3 },
 *     t1, learning, t2, t3,
 *   }
 * status ist einer der in js/research/flow.js verwendeten Werte
 * ("t1" | "learning" | "t2" | "waiting" | "t3" | "done").
 */

export function createParticipantStore(backend) {
  return {
    /** Legt einen neuen Teilnehmer an. Gibt { code, participant } zurück. */
    createParticipant: (args) => backend.createParticipant(args),
    /** Lädt einen bestehenden Teilnehmer anhand des Codes, oder null. */
    loadParticipant: (args) => backend.loadParticipant(args),
    /** Speichert T1 und löst (serverseitig) die Gruppenzuweisung aus. */
    saveT1: (args) => backend.saveT1(args),
    /** Speichert Beginn/Ende/Dauer/Nutzungssignale der Lernphase. */
    saveLearning: (args) => backend.saveLearning(args),
    /** Speichert T2. */
    saveT2: (args) => backend.saveT2(args),
    /** Speichert T3. */
    saveT3: (args) => backend.saveT3(args),
  };
}
