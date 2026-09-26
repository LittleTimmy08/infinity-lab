/**
 * diagonal-argument.js (CONTENT)
 * ------------------------------------------------------------
 * Der mathematische Inhalt zu Cantors Diagonalargument – ohne jede
 * Darstellung. Erlaubt sind hier nur reine Daten: Texte, Zahlen,
 * Listen, Objekte. NICHT erlaubt: HTML, CSS, DOM, Buttons, Funktionen.
 *
 * demoList: fünf Ziffernfolgen nach dem Komma, z.B. "12345" steht für
 * 0,12345... . Es ist ausdrücklich NUR ein Beispiel, keine vollständige
 * Liste (siehe listNote) – das wird auch in der Darstellung so gezeigt.
 *
 * diagonalRule: die Vorschrift, mit der aus einer Diagonalziffer eine
 * neue Ziffer wird (ist die Ziffer gleich equalsDigit, wird sie zu
 * ifEqual, sonst zu otherwise). Weil ifEqual und otherwise beide
 * ungleich equalsDigit sind, unterscheidet sich jede neue Ziffer
 * garantiert von der zugehörigen Diagonalziffer. Ausgewertet wird die
 * Regel nur in content/diagonal.js, nie in einer Darstellung direkt.
 */

export const diagonalArgumentContent = {
  id: "diagonal-argument",
  title: "Cantors Diagonalargument",

  concept: {
    name: "Überabzählbare Unendlichkeit",
    summary:
      "Selbst wenn man versucht, alle Zahlen zwischen 0 und 1 in einer Liste aufzuschreiben, lässt sich " +
      "immer eine Zahl finden, die in der Liste fehlt. Deshalb sind die reellen Zahlen zwischen 0 und 1 " +
      "nicht abzählbar.",
    keyTerms: [
      {
        term: "Diagonalargument",
        meaning:
          "Ein Verfahren von Georg Cantor, mit dem man zu jeder angeblich vollständigen Liste von Zahlen " +
          "eine Zahl konstruieren kann, die in der Liste fehlt.",
      },
      {
        term: "nicht abzählbar",
        meaning:
          "Es gibt keine Möglichkeit, jedem Element der Menge eine eigene natürliche Zahl zuzuordnen, " +
          "ohne dass Elemente fehlen.",
      },
    ],
  },

  learningGoals: [
    "Manche unendlichen Mengen sind nicht abzählbar.",
    "Cantors Diagonalargument zeigt, dass zu jeder Liste von Zahlen zwischen 0 und 1 eine fehlende Zahl konstruiert werden kann.",
    "Der Grund ist die gezielte Konstruktion einer neuen Zahl, nicht die Größe der Zahl.",
    "Deshalb sind die reellen Zahlen zwischen 0 und 1 nicht abzählbar.",
  ],

  sections: [
    {
      id: "intro",
      heading: "Sind wirklich alle Zahlen abzählbar?",
      text:
        "Stell dir vor, jemand behauptet, er hätte alle Zahlen zwischen 0 und 1 in einer Liste aufgeschrieben. " +
        "Nehmen wir für einen Moment an, diese Liste wäre wirklich vollständig.",
    },
  ],

  listNote:
    "Diese Liste ist nur ein Beispiel mit fünf Zahlen. Sie zeigt nicht wirklich alle Zahlen zwischen 0 und 1 " +
    "– das wäre unmöglich aufzuschreiben.",

  // Fünf Ziffernfolgen nach dem Komma (nur ein Beispiel, siehe listNote).
  demoList: ["12345", "58321", "73491", "29183", "45672"],

  // neue Ziffer = equalsDigit ? ifEqual : otherwise (siehe content/diagonal.js)
  diagonalRule: { equalsDigit: "5", ifEqual: "6", otherwise: "5" },

  ahaMoment: {
    lines: [
      "Unsere neue Zahl unterscheidet sich von jeder Zahl der Liste an mindestens einer Stelle.",
      "Also kann sie nicht in unserer Liste stehen.",
      "Egal, wie wir versuchen, alle Zahlen aufzulisten: Mit diesem Verfahren können wir immer eine Zahl konstruieren, die fehlt.",
    ],
    conclusion: "Die reellen Zahlen zwischen 0 und 1 sind deshalb nicht abzählbar.",
  },

  quiz: {
    question: "Warum kann die neu erzeugte Zahl nicht in der ursprünglichen Liste stehen?",
    options: [
      {
        id: "a",
        label: "Weil sie größer als alle anderen Zahlen ist.",
        feedback:
          "Nicht ganz. Die Größe der Zahl spielt hier keine Rolle. Entscheidend ist, dass sie sich von " +
          "jeder Zahl der Liste unterscheidet.",
      },
      {
        id: "b",
        label: "Weil sie sich von jeder Zahl der Liste an mindestens einer Stelle unterscheidet.",
        feedback:
          "Richtig. Für jede Zahl der Liste wurde gezielt eine Stelle verändert. Deshalb unterscheidet " +
          "sich die neue Zahl von jedem Listeneintrag.",
      },
      {
        id: "c",
        label: "Weil Dezimalzahlen immer endlich sind.",
        feedback:
          "Nicht ganz. Dezimalzahlen können unendlich viele Nachkommastellen haben. Der Grund liegt in der " +
          "gezielten Konstruktion der neuen Zahl.",
      },
    ],
    correctOptionId: "b",
  },

  summary: {
    points: [
      "Wir nehmen an, alle Zahlen zwischen 0 und 1 seien vollständig aufgelistet.",
      "Wir betrachten die Diagonale: die n-te Ziffer der n-ten Zahl.",
      "Wir verändern jede Diagonalziffer nach einer festen Regel.",
      "Dadurch entsteht eine neue Zahl.",
      "Diese neue Zahl unterscheidet sich von jedem Eintrag der Liste – an mindestens einer Stelle.",
      "Deshalb fehlt sie in der Liste.",
      "Daraus folgt: Die reellen Zahlen zwischen 0 und 1 sind nicht abzählbar.",
    ],
  },

  metadata: {
    status: "entwurf",
    language: "de",
    source: "Facharbeit „Unendlich ist nicht gleich unendlich“, Kapitel 5; Spezifikation Phase 4",
    note:
      "Eigenständiges Demonstrationsmodul. Die Mehrdeutigkeit von Dezimaldarstellungen " +
      "(0,4999... = 0,5000...) wird hier bewusst nicht behandelt.",
  },
};
