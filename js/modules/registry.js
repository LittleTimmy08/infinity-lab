/**
 * registry.js
 * ------------------------------------------------------------
 * Hier werden alle Experimente eingetragen, die im Infinity Lab
 * auftauchen sollen. main.js liest nur diese Liste aus und weiß
 * sonst nichts über die einzelnen Experimente.
 *
 * Ein Experiment ist ein einfaches Objekt mit drei Eigenschaften:
 *
 *   {
 *     id:    "eindeutiger-name",       // z.B. "hilbert-hotel"
 *     title: "Anzeigename für den Button",
 *     render: function(container) {
 *       // container ist das <main>-Element (#experiment-stage).
 *       // Hier baust du später den Inhalt des Experiments auf,
 *       // z.B. container.innerHTML = "...";
 *     }
 *   }
 *
 * Aktuell ist die Liste leer, weil noch keine Experimente
 * implementiert sind. Ein neues Experiment fügst du hinzu, indem
 * du eine eigene Datei in js/modules/ anlegst (siehe
 * _template.js als Vorlage) und sie hier importierst und in das
 * Array einträgst.
 */

export const experiments = [
  // Beispiel (aktuell auskommentiert):
  // import { hilbertHotel } from "./hilbert-hotel.js";
  // hilbertHotel,
];
