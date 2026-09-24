/**
 * dom.js (PRESENTATION)
 * ------------------------------------------------------------
 * Winziger Helfer, damit die Darstellungen nicht überall
 * document.createElement ausschreiben müssen.
 *
 *   h("p", "presentation__muted", "Text")   ->  <p class="presentation__muted">Text</p>
 *
 * Text wird immer per textContent gesetzt, nie als HTML.
 */
export function h(tag, className = "", text = "") {
  const element = document.createElement(tag);
  if (className) element.className = className;
  if (text) element.textContent = text;
  return element;
}
