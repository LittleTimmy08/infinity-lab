/**
 * placeholder-items.js (ASSESSMENT)
 * ------------------------------------------------------------
 * Platzhalter-Items für T1/T2/T3 – ausschließlich zum Testen der
 * technischen Struktur (Phase 6A). Das sind NICHT die späteren
 * offiziellen Testfragen aus dem Methodenkonzept (Level 1/2a/2b/3a/3b,
 * Two-Tier-Format, Bewertungsraster usw.) – die werden in einer eigenen,
 * separaten, fachlich freigegebenen Phase entwickelt. Jeder Prompt
 * beginnt deshalb bewusst mit "[Platzhalter]".
 *
 * Itemformat: siehe js/components/assessment-frame.js.
 * Das Item mit id "prior-knowledge" in t1 wird von
 * js/research/assessment-step.js separat als (ungewertete)
 * Vorwissens-Angabe ausgelesen (siehe Methodenkonzept, Abschnitt zu T1).
 *
 * Formen heißen "form-1"/"form-2" (nie "A"/"B" – das bleibt für die
 * Lernbedingung reserviert, siehe Spezifikation v1.3 §12).
 */

export const placeholderItems = {
  t1: [
    {
      id: "t1-situation",
      type: "single-choice",
      prompt:
        "[Platzhalter] Ein Hotel hat unendlich viele Zimmer, alle sind belegt. Kann noch ein neuer Gast einziehen?",
      options: [
        { id: "yes", label: "Ja" },
        { id: "no", label: "Nein" },
        { id: "unsure", label: "Weiß ich nicht" },
      ],
    },
    {
      id: "prior-knowledge",
      type: "single-choice",
      prompt: "[Platzhalter] Kanntest du das Hilbert-Hotel schon vor heute?",
      options: [
        { id: "yes", label: "Ja" },
        { id: "no", label: "Nein" },
      ],
    },
  ],

  "t2-form-1": [
    {
      id: "t2-f1-apply",
      type: "single-choice",
      prompt: "[Platzhalter, Form 1] Jeder Gast zieht ein Zimmer weiter. Welches Zimmer wird frei?",
      options: [
        { id: "1", label: "Zimmer 1" },
        { id: "2", label: "Zimmer 2" },
        { id: "none", label: "Keins" },
      ],
    },
    {
      id: "t2-f1-explain",
      type: "open",
      prompt: "[Platzhalter, Form 1] Erkläre mit eigenen Worten, warum das funktioniert.",
    },
  ],

  "t2-form-2": [
    {
      id: "t2-f2-apply",
      type: "single-choice",
      prompt: "[Platzhalter, Form 2] Jeder Gast zieht zwei Zimmer weiter. Welche Zimmer werden frei?",
      options: [
        { id: "1-2", label: "Zimmer 1 und 2" },
        { id: "1", label: "Nur Zimmer 1" },
        { id: "none", label: "Keins" },
      ],
    },
    {
      id: "t2-f2-explain",
      type: "open",
      prompt: "[Platzhalter, Form 2] Erkläre mit eigenen Worten, warum das funktioniert.",
    },
  ],

  "t3-form-1": [
    {
      id: "t3-f1-apply",
      type: "single-choice",
      prompt:
        "[Platzhalter, Form 1] Erinnerst du dich: Welches Zimmer wird frei, wenn jeder Gast ein Zimmer weiterzieht?",
      options: [
        { id: "1", label: "Zimmer 1" },
        { id: "2", label: "Zimmer 2" },
        { id: "none", label: "Keins" },
      ],
    },
  ],

  "t3-form-2": [
    {
      id: "t3-f2-apply",
      type: "single-choice",
      prompt: "[Platzhalter, Form 2] Jeder Gast zieht zwei Zimmer weiter. Welche Zimmer werden frei?",
      options: [
        { id: "1-2", label: "Zimmer 1 und 2" },
        { id: "1", label: "Nur Zimmer 1" },
        { id: "none", label: "Keins" },
      ],
    },
  ],
};
