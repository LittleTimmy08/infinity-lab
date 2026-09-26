/**
 * diagonal.js (CONTENT)
 * ------------------------------------------------------------
 * Reine Mathematik zu Cantors Diagonalargument, ohne DOM. Alle
 * Darstellungen benutzen diese Funktionen, damit keine Darstellung
 * eine andere Diagonale oder neue Zahl "erfindet".
 *
 * Die Zahlen aus content.demoList sind Ziffernfolgen (Strings) nach
 * dem Komma, z.B. "12345" steht für 0,12345... .
 */

/** Die n-te Ziffer der n-ten Zahl (0-indiziert: Index i -> Zahl i, Stelle i). */
export function diagonalDigitAt(list, index) {
  return list[index][index];
}

/** Alle Diagonalziffern der Liste, in derselben Reihenfolge wie die Liste. */
export function diagonalDigits(list) {
  return list.map((_, index) => diagonalDigitAt(list, index));
}

/** Wendet die Regel auf eine einzelne Ziffer an: gleich equalsDigit -> ifEqual, sonst otherwise. */
export function applyDiagonalRule(rule, digit) {
  return digit === rule.equalsDigit ? rule.ifEqual : rule.otherwise;
}

/** Die Ziffern der neu konstruierten Zahl, eine pro Listeneintrag. */
export function buildNewDigits(list, rule) {
  return diagonalDigits(list).map((digit) => applyDiagonalRule(rule, digit));
}
