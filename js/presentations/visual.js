/**
 * visual.js (PRESENTATION – technischer Platzhalter)
 * ------------------------------------------------------------
 * "Visuell-abstrakte" Darstellung: Für jedes Beispiel mit
 * Zimmerregel wird ein einfaches Diagramm gezeichnet
 * (obere Reihe = Zimmer vorher, untere Reihe = nachher, Pfeil = Umzug).
 * Nichts ist bedienbar, in der Steuerung steht nur eine Legende.
 *
 * Nur ein Platzhalter, um die Architektur zu testen.
 */

import { h } from "./dom.js";
import { applyRoomRule, formatRoomRule } from "../content/rules.js";

const SVG_NS = "http://www.w3.org/2000/svg";
const ROOMS = 8; // so viele Zimmer werden gezeichnet
const BOX = 44; // Kastenbreite
const GAP = 12; // Abstand zwischen Kästen
const LEFT = 16; // Rand links
const TOP_Y = 34;
const BOTTOM_Y = 130;
const BOX_H = 32;
const WIDTH = LEFT * 2 + ROOMS * BOX + (ROOMS - 1) * GAP;

function svgElement(name, attributes) {
  const element = document.createElementNS(SVG_NS, name);
  Object.entries(attributes).forEach(([key, value]) => element.setAttribute(key, value));
  return element;
}

const centerX = (room) => LEFT + (room - 1) * (BOX + GAP) + BOX / 2;

/** Farben kommen aus den Theme-Variablen, damit Dark/Light automatisch passt. */
function drawRoom(svg, room, y) {
  svg.append(
    svgElement("rect", {
      x: centerX(room) - BOX / 2, y, width: BOX, height: BOX_H, rx: 6,
      style: "fill: var(--color-surface-2); stroke: var(--color-border)",
    })
  );
  const label = svgElement("text", {
    x: centerX(room), y: y + BOX_H / 2 + 5, "text-anchor": "middle",
    style: "fill: var(--color-text); font-size: 14px; font-family: inherit",
  });
  label.textContent = String(room);
  svg.append(label);
}

function drawDiagram(rule) {
  const svg = svgElement("svg", { viewBox: `0 0 ${WIDTH} 170`, class: "presentation__svg", role: "img" });
  svg.setAttribute("aria-label", `Zimmerregel ${formatRoomRule(rule)}`);

  for (let room = 1; room <= ROOMS; room++) {
    drawRoom(svg, room, TOP_Y);
    drawRoom(svg, room, BOTTOM_Y);
  }
  for (let n = 1; n <= ROOMS; n++) {
    const target = applyRoomRule(rule, n);
    if (target > ROOMS) continue; // Ziel liegt außerhalb des gezeichneten Ausschnitts
    svg.append(
      svgElement("line", {
        x1: centerX(n), y1: TOP_Y + BOX_H, x2: centerX(target), y2: BOTTOM_Y,
        style: "stroke: var(--color-blue); stroke-width: 2",
      })
    );
    svg.append(
      svgElement("circle", { cx: centerX(target), cy: BOTTOM_Y, r: 3.5, style: "fill: var(--color-blue)" })
    );
  }
  return svg;
}

export const visualPresentation = {
  id: "visual",
  label: "Visuell-abstrakt (Platzhalter)",

  render(content, { visualization, controls }) {
    const root = h("div", "presentation");
    content.examples.forEach((example) => {
      root.append(h("h3", "", example.title));
      if (example.roomRule) {
        root.append(h("p", "presentation__muted", formatRoomRule(example.roomRule)), drawDiagram(example.roomRule));
      } else {
        root.append(h("p", "presentation__muted", "Für dieses Beispiel gibt es keine einfache Zimmerregel."));
      }
    });
    visualization.append(root);

    controls.append(
      h("p", "presentation__muted", "Obere Reihe: Zimmer vorher. Untere Reihe: Zimmer nachher."),
      h("p", "presentation__muted", "Ein Pfeil zeigt, in welches Zimmer der Gast umzieht.")
    );
    // Kein Timer, keine Listener -> kein Cleanup nötig (Rückgabe ist optional).
  },
};
