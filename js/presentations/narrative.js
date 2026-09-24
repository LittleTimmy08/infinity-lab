/**
 * narrative.js (PRESENTATION – technischer Platzhalter)
 * ------------------------------------------------------------
 * "Erzählende" Darstellung: Der Inhalt wird Seite für Seite
 * als Text erzählt (Abschnitte, danach Beispiele). Mit
 * Zurück/Weiter blättert man durch.
 *
 * Nur ein Platzhalter, um die Architektur zu testen. Keine
 * Entscheidung über spätere Vermittlungsformen.
 */

import { h } from "./dom.js";

/** Macht aus dem Content eine Liste von Seiten: { heading, lines[] } */
function buildPages(content) {
  const sectionPages = content.sections.map((section) => ({
    heading: section.heading,
    lines: [section.text],
  }));
  const examplePages = content.examples.map((example) => ({
    heading: example.title,
    lines: [example.situation, ...example.steps, example.result],
  }));
  return [...sectionPages, ...examplePages];
}

export const narrativePresentation = {
  id: "narrative",
  label: "Erzählend (Platzhalter)",

  render(content, { visualization, controls }) {
    const pages = buildPages(content);
    let index = 0;

    const page = h("div", "presentation");
    visualization.append(page);

    const previous = h("button", "btn btn--secondary", "← Zurück");
    const next = h("button", "btn", "Weiter →");
    previous.type = next.type = "button";
    const counter = h("p", "presentation__muted");
    controls.append(previous, next, counter);

    function show() {
      page.replaceChildren(h("h3", "", pages[index].heading), ...pages[index].lines.map((line) => h("p", "", line)));
      counter.textContent = `Seite ${index + 1} von ${pages.length}`;
      previous.disabled = index === 0;
      next.disabled = index === pages.length - 1;
    }

    const abort = new AbortController();
    previous.addEventListener("click", () => { index -= 1; show(); }, { signal: abort.signal });
    next.addEventListener("click", () => { index += 1; show(); }, { signal: abort.signal });
    show();

    return () => abort.abort(); // Cleanup: Listener entfernen
  },
};
