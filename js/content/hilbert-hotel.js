/**
 * hilbert-hotel.js (CONTENT)
 * ------------------------------------------------------------
 * Der mathematische Inhalt zum Hilbert-Hotel – ohne jede Darstellung.
 * Erlaubt sind hier nur reine Daten: Texte, Zahlen, Listen, Objekte.
 * NICHT erlaubt: HTML, CSS, DOM, Buttons, Animationen, Funktionen.
 *
 * Alle Darstellungen (js/presentations/) bekommen genau dieses Objekt.
 * Ändert sich hier ein Satz, ändert er sich in allen Darstellungen gleich.
 *
 * Herkunft: Inhalt und Aussagen folgen der Facharbeit (Kapitel 6 und 5).
 * Die Formulierungen sind noch NICHT an Klasse 5–7 angepasst (siehe metadata).
 *
 * roomRule (optional, maschinenlesbar): neues Zimmer = factor · n + offset.
 * Ausgewertet wird sie an einer einzigen Stelle: content/rules.js.
 */

export const hilbertHotelContent = {
  id: "hilbert-hotel",
  title: "Hilbert-Hotel",

  concept: {
    name: "Abzählbare Unendlichkeit",
    summary:
      "Ein Hotel mit unendlich vielen Zimmern, die alle belegt sind, kann trotzdem neue Gäste aufnehmen. " +
      "Das gelingt, weil man die Zimmer durchnummerieren und die Gäste eindeutig umziehen lassen kann.",
    keyTerms: [
      {
        term: "abzählbar unendlich",
        meaning: "Jedem Element der Menge lässt sich genau eine natürliche Zahl zuordnen, ohne dass eines fehlt oder doppelt vorkommt.",
      },
      {
        term: "Eins-zu-eins-Zuordnung",
        meaning: "Jedem Element der einen Menge wird genau ein Element der anderen Menge zugeordnet, keines bleibt übrig, keines wird doppelt benutzt.",
      },
    ],
  },

  learningGoals: [
    "Unendlich ist keine sehr große Zahl, sondern eine Eigenschaft einer Menge ohne Ende.",
    "Bei unendlichen Mengen kann ein Teil genauso viele Elemente haben wie das Ganze.",
    "Zwei Mengen sind gleich groß, wenn sich ihre Elemente eins zu eins zuordnen lassen.",
    "Das Hilbert-Hotel funktioniert nur bei abzählbaren Mengen, nicht bei den reellen Zahlen.",
  ],

  sections: [
    {
      id: "situation",
      heading: "Das Hotel",
      text:
        "Das Hilbert-Hotel ist ein Gedankenexperiment des Mathematikers David Hilbert. " +
        "Es hat unendlich viele Zimmer mit den Nummern 1, 2, 3, 4, … und alle Zimmer sind belegt. " +
        "Trotzdem können immer noch neue Gäste aufgenommen werden.",
    },
    {
      id: "idee",
      heading: "Die Idee dahinter",
      text:
        "Jeder Gast wird mit einer Regel einem Zimmer zugeordnet. Die Regel ordnet jeder Zimmernummer genau eine neue Zimmernummer zu. " +
        "Weil die Zimmer durchnummeriert sind, lässt sich diese Zuordnung immer angeben.",
    },
    {
      id: "grenze",
      heading: "Wo das Hotel nicht mehr funktioniert",
      text:
        "Das Hotel funktioniert nur, weil seine Zimmer abzählbar unendlich sind. " +
        "Bei den reellen Zahlen zwischen 0 und 1 ist keine vollständige Nummerierung möglich (Cantors Diagonalargument). " +
        "Deshalb lässt sich das Verschieben der Gäste darauf nicht übertragen.",
    },
  ],

  examples: [
    {
      id: "ein-neuer-gast",
      title: "Ein neuer Gast",
      situation: "Alle Zimmer sind belegt. Ein neuer Gast kommt.",
      steps: [
        "Alle Gäste ziehen gleichzeitig um: Der Gast aus Zimmer n geht in Zimmer n + 1.",
        "Dadurch wird Zimmer 1 frei.",
      ],
      result: "Der neue Gast bekommt Zimmer 1.",
      roomRule: { factor: 1, offset: 1 },
    },
    {
      id: "unendlich-viele-gaeste",
      title: "Unendlich viele neue Gäste (ein Bus)",
      situation: "Alle Zimmer sind belegt. Ein Bus mit unendlich vielen neuen Gästen kommt.",
      steps: [
        "Alle Gäste ziehen gleichzeitig um: Der Gast aus Zimmer n geht in Zimmer 2n.",
        "Dadurch werden alle Zimmer mit ungerader Nummer frei.",
      ],
      result: "Die unendlich vielen neuen Gäste bekommen die freien Zimmer mit ungerader Nummer.",
      roomRule: { factor: 2, offset: 0 },
    },
    {
      id: "unendlich-viele-busse",
      title: "Unendlich viele Busse mit unendlich vielen Gästen",
      situation: "Alle Zimmer sind belegt. Unendlich viele Busse kommen, in jedem sitzen unendlich viele Gäste.",
      steps: [
        "Die Gäste werden in einer Tabelle angeordnet: eine Zeile pro Bus, eine Spalte pro Platz im Bus.",
        "Die Tabelle wird diagonal durchgegangen. Dadurch entsteht eine feste Reihenfolge aller Gäste.",
        "In dieser Reihenfolge ziehen die Gäste in die Zimmer ein.",
      ],
      result: "Auch in diesem Fall bekommt jeder Gast ein Zimmer.",
    },
  ],

  metadata: {
    status: "entwurf",
    language: "de",
    source: "Facharbeit „Unendlich ist nicht gleich unendlich“, Kapitel 5 und 6",
    note: "Sprache und Lernziele sind Entwürfe und noch nicht an Klasse 5–7 angepasst.",
  },
};
