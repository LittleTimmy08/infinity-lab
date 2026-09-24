/**
 * nav-dropdown.js
 * ------------------------------------------------------------
 * Öffnen und Schließen eines Dropdown-Menüs im Header.
 * Diese Datei weiß NICHTS über Experimente – sie kümmert sich nur um
 * das Verhalten. Den Inhalt des Menüs baut main.js.
 *
 * Erwartete Struktur:
 *
 *   <div class="nav-dropdown">                (wrapper)
 *     <button class="nav-dropdown__trigger">  Auslöser
 *     <div class="nav-dropdown__menu">        das Menü
 *
 * Der Zustand steckt an zwei Stellen:
 *   - Klasse "is-open" am Menü  -> CSS blendet es ein/aus
 *   - aria-expanded am Auslöser -> sagt Screenreadern, ob es offen ist
 *
 * Tastatur: Auslöser und Einträge sind normale Buttons. Tab wechselt
 * zwischen ihnen, Enter/Leertaste löst aus – das macht der Browser von selbst.
 */

export function setupDropdown(wrapper) {
  const trigger = wrapper.querySelector(".nav-dropdown__trigger");
  const menu = wrapper.querySelector(".nav-dropdown__menu");

  function isOpen() {
    return menu.classList.contains("is-open");
  }

  function open() {
    menu.classList.add("is-open");
    trigger.setAttribute("aria-expanded", "true");
  }

  function close() {
    menu.classList.remove("is-open");
    trigger.setAttribute("aria-expanded", "false");
  }

  // Klick auf den Auslöser: umschalten
  trigger.addEventListener("click", () => {
    if (isOpen()) {
      close();
    } else {
      open();
    }
  });

  // Klick irgendwo außerhalb des Dropdowns: schließen
  document.addEventListener("click", (event) => {
    if (!wrapper.contains(event.target)) close();
  });

  // Escape: schließen. Stand der Fokus im Dropdown, geht er zurück zum Auslöser,
  // damit man mit der Tastatur nicht "verloren" geht.
  document.addEventListener("keydown", (event) => {
    if (event.key !== "Escape" || !isOpen()) return;
    const focusWasInside = wrapper.contains(document.activeElement);
    close();
    if (focusWasInside) trigger.focus();
  });

  // Tab aus dem Dropdown heraus: schließen
  wrapper.addEventListener("focusout", (event) => {
    if (event.relatedTarget && !wrapper.contains(event.relatedTarget)) close();
  });

  // close() geben wir zurück, damit main.js das Menü nach einem Klick auf einen Eintrag schließen kann.
  return { close };
}
