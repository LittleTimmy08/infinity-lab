/**
 * index.js (PRESENTATION)
 * ------------------------------------------------------------
 * Alle verfügbaren Darstellungen. Jede hat dieselbe Schnittstelle:
 *
 *   {
 *     id:    "narrative",
 *     label: "Text für die Auswahl",
 *     render(content, { visualization, controls }) {
 *       // content = Inhalt aus js/content/ (nur lesen!)
 *       // visualization / controls = die zwei Flächen des Experiment-Rahmens
 *       // OPTIONAL: eine Aufräum-Funktion zurückgeben (wie bei Experimenten)
 *     }
 *   }
 *
 * WICHTIG: Die Namen sind technische Platzhalter. Sie legen keine
 * wissenschaftlichen Versuchsgruppen fest.
 */

import { narrativePresentation } from "./narrative.js";
import { visualPresentation } from "./visual.js";
import { interactivePresentation } from "./interactive.js";

const presentations = [narrativePresentation, visualPresentation, interactivePresentation];

export function getPresentation(id) {
  const presentation = presentations.find((item) => item.id === id);
  if (!presentation) throw new Error(`Unbekannte Darstellung "${id}" (js/presentations/index.js).`);
  return presentation;
}

export const presentationIds = presentations.map((item) => item.id);
