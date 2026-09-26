/**
 * index.js (CONTENT)
 * ------------------------------------------------------------
 * Die Liste aller Inhalte. getContent(id) liefert ein Content-Objekt.
 *
 * Das Objekt wird eingefroren (Object.freeze, auch verschachtelt):
 * Darstellungen dürfen den Inhalt lesen, aber nicht verändern.
 * Wird trotzdem etwas verändert, meldet der Browser im strengen Modus
 * (Module sind immer streng) sofort einen Fehler statt still Unsinn zu tun.
 */

import { hilbertHotelContent } from "./hilbert-hotel.js";
import { countableNzContent } from "./countable-nz.js";
import { diagonalArgumentContent } from "./diagonal-argument.js";

function deepFreeze(value) {
  if (value && typeof value === "object" && !Object.isFrozen(value)) {
    Object.values(value).forEach(deepFreeze);
    Object.freeze(value);
  }
  return value;
}

const contents = [hilbertHotelContent, countableNzContent, diagonalArgumentContent].map(deepFreeze);

export function getContent(id) {
  const content = contents.find((item) => item.id === id);
  if (!content) throw new Error(`Unbekannte contentId "${id}" (js/content/index.js).`);
  return content;
}

export const contentIds = contents.map((item) => item.id);
