/**
 * rules.js (CONTENT)
 * ------------------------------------------------------------
 * Reine Mathematik zu den roomRule-Angaben im Content, ohne DOM.
 * Alle Darstellungen benutzen diese Funktionen. Dadurch kann keine
 * Darstellung eine andere Zuordnung "erfinden".
 *
 * Regel: neues Zimmer = factor · n + offset
 */

/** Neues Zimmer für den Gast aus Zimmer n. */
export function applyRoomRule(rule, n) {
  return rule.factor * n + rule.offset;
}

/** Text der Regel, z.B. "n → n + 1" oder "n → 2n". */
export function formatRoomRule(rule) {
  const factorPart = rule.factor === 1 ? "n" : `${rule.factor}n`;
  const offsetPart = rule.offset === 0 ? "" : ` + ${rule.offset}`;
  return `n → ${factorPart}${offsetPart}`;
}
