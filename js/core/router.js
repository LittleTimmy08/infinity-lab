/**
 * router.js
 * ------------------------------------------------------------
 * Ein kleiner Hash-Router ohne Framework. Er kennt weder Experimente
 * noch Mathematik – er macht nur zwei Dinge:
 *
 *   1. NAVIGATION: Er liest die Adresse hinter dem "#" (z.B.
 *      "#/experiment/hilbert-hotel"), sucht die passende Route und
 *      ruft deren enter()-Funktion auf.
 *   2. LIFECYCLE: Gibt enter() eine Funktion zurück, merkt sich der
 *      Router sie als "Aufräum-Funktion" und ruft sie auf, sobald man
 *      die Route wieder verlässt (Timer stoppen, Listener entfernen ...).
 *
 * Routen beschreibt main.js als Liste von Objekten:
 *
 *   {
 *     path:  "/experiment/:id",          // ":id" ist ein Platzhalter
 *     guard: (params) => true,           // optional: false = Route passt doch nicht
 *     enter: (params) => { ... return cleanupFunktion; }   // Rückgabe ist optional
 *   }
 *
 * Beispiele für Adressen:
 *   #/                                Startseite
 *   #/experiment/hilbert-hotel        ein Experiment
 *   #/lab/hilbert-hotel/pretest       (später) ein Schritt des Ablaufs, Muster "/lab/:id/:step"
 *
 * Unbekannte Adressen (keine Route passt oder guard sagt false) führen
 * zurück auf "#/".
 */

/**
 * Wandelt location.hash in einen sauberen Pfad um.
 *   ""  "#"  "#/"          -> "/"
 *   "#/experiment/x/"      -> "/experiment/x"   (Schrägstrich am Ende entfällt)
 *   "#foo"                 -> "/foo"
 */
export function parseHash(hash) {
  let path = hash.startsWith("#") ? hash.slice(1) : hash;
  if (!path.startsWith("/")) path = "/" + path;
  if (path.length > 1 && path.endsWith("/")) path = path.slice(0, -1);
  return path;
}

/**
 * Vergleicht ein Muster (z.B. "/experiment/:id") mit einem Pfad.
 * Passt es, kommt ein Objekt mit den Platzhaltern zurück ({ id: "hilbert-hotel" }),
 * sonst null. Beide Pfade müssen gleich viele Teile haben, und ein
 * Platzhalter darf nicht leer sein.
 */
export function matchPath(pattern, path) {
  const patternParts = pattern === "/" ? [] : pattern.slice(1).split("/");
  const pathParts = path === "/" ? [] : path.slice(1).split("/");
  if (patternParts.length !== pathParts.length) return null;

  const params = {};
  for (let i = 0; i < patternParts.length; i++) {
    const patternPart = patternParts[i];
    const pathPart = pathParts[i];

    if (patternPart.startsWith(":")) {
      if (pathPart === "") return null;
      try {
        params[patternPart.slice(1)] = decodeURIComponent(pathPart);
      } catch (error) {
        return null; // kaputte %-Kodierung, z.B. "%E0%A4%A"
      }
    } else if (patternPart !== pathPart) {
      return null;
    }
  }
  return params;
}

/**
 * Baut aus Muster und Werten einen Pfad:
 *   buildPath("/experiment/:id", { id: "hilbert-hotel" }) -> "/experiment/hilbert-hotel"
 */
export function buildPath(pattern, params = {}) {
  return pattern.replace(/:([A-Za-z0-9_]+)/g, (_, name) => encodeURIComponent(params[name]));
}

/**
 * Erzeugt den Router.
 *   routes    Liste der Routen (siehe oben), die erste passende gewinnt
 *   fallback  Pfad für unbekannte Adressen (Standard: "/")
 *
 * Rückgabe:
 *   start()          Listener anschließen und die aktuelle Adresse auswerten
 *   stop()           Listener entfernen und die aktuelle Route verlassen
 *   navigate(path)   zu einem Pfad wechseln, z.B. navigate("/experiment/x")
 */
export function createRouter({ routes, fallback = "/" }) {
  let currentPath = null; // zuletzt geöffneter Pfad
  let currentCleanup = null; // Aufräum-Funktion der geöffneten Route (oder null)

  function runCleanup() {
    const cleanup = currentCleanup;
    currentCleanup = null;
    if (!cleanup) return;
    // Ein Fehler beim Aufräumen darf die Navigation nie blockieren.
    try {
      cleanup();
    } catch (error) {
      console.error("Fehler in der Aufräum-Funktion einer Route:", error);
    }
  }

  function resolve() {
    const path = parseHash(window.location.hash);
    if (path === currentPath) return; // gleiche Adresse (z.B. nur "/" am Ende anders)

    for (const route of routes) {
      const params = matchPath(route.path, path);
      if (!params) continue;
      if (route.guard && !route.guard(params)) continue;

      runCleanup(); // erst die alte Ansicht aufräumen ...
      currentPath = path;
      const result = route.enter(params); // ... dann die neue öffnen
      currentCleanup = typeof result === "function" ? result : null;
      return;
    }

    // Unbekannte Adresse -> Fallback. replace() ersetzt den Eintrag im Verlauf,
    // damit der Zurück-Button nicht in die ungültige Adresse springt.
    if (path === fallback) {
      console.error(`Router: Für den Fallback-Pfad "${fallback}" gibt es keine passende Route.`);
      return;
    }
    window.location.replace("#" + fallback);
  }

  function navigate(path) {
    window.location.hash = "#" + path; // löst "hashchange" aus, resolve() übernimmt
  }

  function start() {
    window.addEventListener("hashchange", resolve);
    resolve(); // Adresse beim Laden auswerten (z.B. Reload auf einem Experiment)
  }

  function stop() {
    window.removeEventListener("hashchange", resolve);
    runCleanup();
    currentPath = null;
  }

  return { start, stop, navigate };
}
