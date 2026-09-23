/**
 * theme.js
 * ------------------------------------------------------------
 * Die EINZIGE Stelle mit Theme-Logik. Aufgaben:
 *   1. Gespeichertes Theme aus localStorage lesen (Standard: "dark")
 *   2. Es als data-theme-Attribut auf <html> setzen
 *   3. Den Theme-Button im Header verdrahten (Klick = nächstes Theme)
 *
 * Die Farben selbst stehen in css/style.css (ein Block pro Theme).
 *
 * Warum kein ES-Modul? Diese Datei wird als normales Skript im <head>
 * geladen und läuft sofort, VOR dem ersten Zeichnen der Seite. Module
 * werden erst danach ausgeführt, dann würde ein gespeichertes Light-Theme
 * kurz als Dark aufblitzen.
 *
 * Neues Theme hinzufügen:
 *   1. Name in THEMES eintragen
 *   2. In style.css einen Block [data-theme="name"] { ... } anlegen
 *   3. Text in SWITCH_LABELS ergänzen
 */
(function () {
  const STORAGE_KEY = "infinity-lab-theme";
  const THEMES = ["dark", "light"];
  const DEFAULT_THEME = "dark";

  // Beschriftung für Screenreader/Tooltip: was passiert beim Klick?
  const SWITCH_LABELS = {
    dark: "Zum dunklen Design wechseln",
    light: "Zum hellen Design wechseln",
  };

  function loadTheme() {
    // localStorage kann fehlen oder blockiert sein (z.B. privater Modus) -> try/catch
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (THEMES.includes(stored)) return stored;
    } catch (error) {}
    return DEFAULT_THEME;
  }

  function saveTheme(theme) {
    try {
      localStorage.setItem(STORAGE_KEY, theme);
    } catch (error) {}
  }

  function applyTheme(theme) {
    document.documentElement.setAttribute("data-theme", theme);
  }

  function nextTheme(theme) {
    return THEMES[(THEMES.indexOf(theme) + 1) % THEMES.length];
  }

  let currentTheme = loadTheme();
  applyTheme(currentTheme);

  // Der Button existiert erst, wenn das HTML geladen ist.
  document.addEventListener("DOMContentLoaded", function () {
    const button = document.getElementById("theme-toggle");
    if (!button) return;

    function updateButton() {
      const label = SWITCH_LABELS[nextTheme(currentTheme)];
      button.setAttribute("aria-label", label);
      button.setAttribute("title", label);
    }

    button.addEventListener("click", function () {
      currentTheme = nextTheme(currentTheme);
      applyTheme(currentTheme);
      saveTheme(currentTheme);
      updateButton();
    });

    updateButton();
  });
})();
