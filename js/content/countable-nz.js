/**
 * countable-nz.js (CONTENT)
 * ------------------------------------------------------------
 * Der mathematische Inhalt zur abzählbaren Unendlichkeit – ohne jede
 * Darstellung. Erlaubt sind hier nur reine Daten: Texte, Zahlen,
 * Listen, Objekte. NICHT erlaubt: HTML, CSS, DOM, Buttons, Funktionen.
 *
 * Eigenständiges Demonstrationsmodul (Phase 4). Anders als beim
 * Hilbert-Hotel gibt es hier keine "examples" mit Zimmerregel, sondern
 * einen kleinen geführten Ablauf: Einstieg, zentrale Frage, eine
 * interaktive Zuordnung, ein Aha-Moment, eine Verständnisfrage und
 * eine Zusammenfassung. Jedes Feld ist reine Daten; wie daraus Schritte
 * werden, entscheidet die Darstellung (js/presentations/countable-interactive.js).
 */

export const countableNzContent = {
  id: "countable-nz",
  title: "Abzählbare Unendlichkeit",

  concept: {
    name: "Abzählbare Unendlichkeit",
    summary:
      "Die natürlichen Zahlen hören nie auf. Trotzdem kann man jedem Element einer solchen Menge " +
      "eine eigene, eindeutige Nummer geben. Genau das nennt man abzählbar unendlich.",
    keyTerms: [
      {
        term: "natürliche Zahlen",
        meaning: "Die Zahlen 1, 2, 3, 4, 5, ... Sie hören nie auf, es gibt keine größte natürliche Zahl.",
      },
      {
        term: "abzählbar unendlich",
        meaning:
          "Jedem Element einer Menge lässt sich eine eigene natürliche Zahl zuordnen, ohne dass eine " +
          "ausgelassen oder doppelt vergeben wird.",
      },
    ],
  },

  learningGoals: [
    "Die natürlichen Zahlen sind unendlich, es gibt keine letzte natürliche Zahl.",
    "„Unendlich“ ist keine besonders große Zahl, sondern bedeutet, dass es kein Ende gibt.",
    "Abzählbar bedeutet nicht, dass man irgendwann fertig wird.",
    "Abzählbar bedeutet, dass jedes Element eine eigene, eindeutige Nummer bekommen kann.",
  ],

  sections: [
    {
      id: "intro",
      heading: "Unendlich viele Zahlen?",
      text:
        "Die natürlichen Zahlen beginnen mit 1, 2, 3, 4, 5 und hören niemals auf. " +
        "Egal, wie weit man zählt: Es gibt immer eine nächste Zahl.",
    },
    {
      id: "frage",
      heading: "Kann man unendlich viele Zahlen trotzdem abzählen?",
      text:
        "Beim Abzählen geht es hier nicht darum, irgendwann fertig zu werden. " +
        "Es geht darum, jedem Element einen eindeutigen Platz zu geben – also eine eigene natürliche Zahl.",
    },
  ],

  // Daten für die interaktive Zuordnung (Schritt für Schritt aufgedeckt).
  matching: {
    itemLabel: "Element",
    itemCount: 7,
    continuationNote:
      "Das Muster kann immer weiter fortgesetzt werden. Wir werden nie fertig – " +
      "aber jedes Element bekommt trotzdem eine eigene Nummer.",
  },

  ahaMoment: {
    lines: [
      "Obwohl die Liste niemals endet, kann jedes Element einen festen Platz bekommen.",
      "Genau das meint man mit abzählbar unendlich.",
    ],
  },

  quiz: {
    question: "Welche natürliche Zahl gehört zum 7. Element?",
    options: [
      { id: "a", label: "5" },
      { id: "b", label: "6" },
      { id: "c", label: "7" },
      { id: "d", label: "8" },
    ],
    correctOptionId: "c",
    correctExplanation:
      "Richtig. Das 7. Element erhält die Nummer 7. Das Muster lässt sich auch für beliebig viele weitere Elemente fortsetzen.",
    incorrectExplanation:
      "Nicht ganz. Jedes Element bekommt der Reihe nach seine eigene Nummer – das n-te Element bekommt die Nummer n.",
  },

  summary: {
    points: [
      "Die natürlichen Zahlen sind unendlich.",
      "Es gibt keine letzte natürliche Zahl.",
      "Trotzdem kann jedem Element eine eindeutige natürliche Zahl zugeordnet werden.",
      "Deshalb sind die natürlichen Zahlen abzählbar unendlich.",
    ],
    mnemonic: "Abzählbar unendlich heißt: Es gibt immer ein nächstes Element – aber kein letztes.",
  },

  metadata: {
    status: "entwurf",
    language: "de",
    source: "Facharbeit „Unendlich ist nicht gleich unendlich“, Kapitel 3 und 4; Spezifikation Phase 4",
    note:
      "Eigenständiges Demonstrationsmodul, sprachlich auf Klasse 5–7 ausgerichtet, " +
      "aber noch nicht mit Schülerinnen und Schülern getestet.",
  },
};
