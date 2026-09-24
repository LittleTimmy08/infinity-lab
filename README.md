# Infinity Lab

Modulare Webanwendung für mathematische Experimente rund um Unendlichkeit
(Jugend forscht Projekt).

## Projektstruktur

```
infinity-lab/
├── index.html              Grundgerüst der Seite
├── css/
│   └── style.css           Alle Styles
├── js/
│   ├── main.js              Lädt Experimente, baut die Navigation, definiert die Routen
│   ├── core/
│   │   └── router.js        Hash-Router (Adresse hinter dem #) + Aufräum-Lifecycle
│   ├── theme.js             Dark-/Light-Mode (Umschalter + Speicherung)
│   ├── components/
│   │   ├── experiment-card.js    Karte eines Experiments (Startseite)
│   │   ├── nav-dropdown.js       Öffnen/Schließen des Experimente-Dropdowns
│   │   └── experiment-frame.js   Rahmen einer Experiment-Seite (Visualisierung + Steuerung)
│   └── modules/
│       ├── registry.js      Zentrale Liste aller Experimente
│       └── _template.js     Vorlage für ein neues Experiment
└── README.md
```

## Lokal starten

Weil `main.js` als ES-Modul (`type="module"`) eingebunden ist, blockieren
Browser das direkte Öffnen von `index.html` per Doppelklick (file://).
Du brauchst einen einfachen lokalen Server, z.B.:

- VS Code: Erweiterung "Live Server" installieren, dann Rechtsklick auf
  `index.html` → "Open with Live Server"
- oder im Terminal im Projektordner: `python3 -m http.server`
  und dann `http://localhost:8000` im Browser öffnen

## Ein neues Experiment hinzufügen

1. `js/modules/_template.js` kopieren und umbenennen, z.B. `hilbert-hotel.js`
2. `id`, `title`, `description`, `symbol`, `badge`, `status` und die
   `render()`-Funktion anpassen
3. In `js/modules/registry.js` importieren und in das `experiments`-Array
   eintragen

main.js muss dafür nicht verändert werden.

## Themes (Dark / Light)

- Die Farben jedes Themes stehen in `css/style.css` (Blöcke `:root` = Dark und
  `[data-theme="light"]`). Im restlichen CSS nur `var(--color-...)` benutzen,
  nie feste Hex-Werte.
- `js/theme.js` setzt `data-theme` am `<html>`-Element und speichert die Wahl
  in `localStorage`. Standard ist Dark.
- Neues Theme: Name in `THEMES` (theme.js) eintragen und in style.css einen
  Block `[data-theme="name"]` mit denselben Variablennamen anlegen.
- Für Canvas-Diagramme (später): Farben mit
  `getComputedStyle(document.documentElement).getPropertyValue("--color-blue")`
  lesen und beim Theme-Wechsel neu zeichnen.

## Hero-Grafik

Die Grafik im Hero (Sterne + leuchtende ∞-Schleife) ist ein inline-SVG in
`index.html` und braucht keine Bilddateien. Ihre Farben kommen aus den
Theme-Variablen (`--color-blue`, `--color-violet`, `--hero-star`,
`--hero-glow-opacity`), der Hintergrund aus `--hero-bg` in style.css.

## Komponentenbibliothek (css/style.css, Abschnitt "KOMPONENTEN")

| Klasse | Zweck |
| --- | --- |
| `.card` / `.card--interactive` | Fläche mit Rahmen; die zweite Variante hebt sich beim Hover an |
| `.btn` / `.btn--secondary` | Haupt- und Nebenaktion |
| `.badge` / `.badge--muted` | Label für Typ oder Status |
| `.field`, `.field-label`, `.field-value` | Beschriftung (und Wert) über einem Steuerelement |
| `.input` | Textfeld |
| `.slider` | Schieberegler (`<input type="range">`) |
| `.experiment-card` | Karte auf der Startseite |
| `.experiment-layout` | zwei Spalten (Laptop) bzw. untereinander (schmal) |

Die Komponenten benutzen nur Variablen (`--color-primary`, `--radius-sm`,
`--transition` ...). Farben nie direkt in Komponenten schreiben.

## Experiment-Rahmen benutzen

```js
import { createExperimentFrame } from "../components/experiment-frame.js";

render(container) {
  const { visualization, controls } = createExperimentFrame(container, {
    title: "Mein Experiment",
  });
  visualization.innerHTML = "...";  // links
  controls.innerHTML = "...";       // rechts (.btn, .slider, .input ...)
}
```

Ein vollständiges Beispiel steht in `js/modules/_template.js`.

## Router (js/core/router.js)

Die Adresse hinter dem `#` bestimmt, was angezeigt wird. Dadurch funktionieren
Zurück-/Vorwärts-Button, Reload und Direktlinks.

| Adresse | Ansicht |
| --- | --- |
| `#/` | Startseite |
| `#/experiment/<id>` | Experiment, z. B. `#/experiment/hilbert-hotel` |

Unbekannte Adressen (oder eine unbekannte `<id>`) führen zurück auf `#/`.
Der Router kennt keine Experimente: `main.js` übergibt eine Liste von Routen
(`path`, optional `guard`, `enter`). Muster wie `/lab/:id/:step` funktionieren
bereits im Router, sind in `main.js` aber noch nicht eingetragen.

**Aufräumen beim Verlassen:** `render(container)` darf eine Funktion
zurückgeben. Der Router ruft sie auf, wenn man das Experiment verlässt
(Timer stoppen, Listener entfernen ...). Experimente ohne Rückgabe
funktionieren unverändert.

## Navigation

Header: `⌂ Startseite` und `Experimente ▾`. Das Dropdown zeigt die Experimente
nach Kategorien gruppiert.

- **Daten:** `categories` und `experiments` in `js/modules/registry.js`. Jedes
  Experiment verweist mit `category` auf die `id` einer Kategorie.
- **Aufbau:** `main.js` baut daraus Gruppen (Kategorie-Überschrift + Einträge).
  Kategorien ohne Experimente werden nicht angezeigt.
- **Verhalten:** `js/components/nav-dropdown.js` (Klick, Klick außerhalb, Escape, Tab).
- **Aktiver Zustand:** Startseite aktiv, solange keine Experiment-Seite offen ist;
  sonst ist "Experimente" aktiv und der geöffnete Eintrag im Menü markiert.

Neues Experiment: Eintrag in `experiments` mit passender `category`.
Neue Kategorie: Eintrag in `categories` und `category` beim Experiment setzen.
Eine unbekannte Kategorie meldet der Browser in der Konsole (F12).
