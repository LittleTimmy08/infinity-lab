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
│   ├── main.js              Lädt Experimente und steuert die Navigation
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
2. `id`, `title` und die `render()`-Funktion anpassen
3. In `js/modules/registry.js` importieren und in das `experiments`-Array
   eintragen

main.js muss dafür nicht verändert werden.
