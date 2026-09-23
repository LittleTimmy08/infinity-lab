/**
 * experiment-card.js
 * ------------------------------------------------------------
 * Baut die Karte eines Experiments für die Startseite.
 * Alle Texte kommen aus dem Eintrag in registry.js:
 *
 *   symbol       großes Zeichen im Visualisierungsbereich der Karte
 *   badge        Typ des Experiments (farbiges Badge)
 *   status       Bearbeitungsstand (graues Badge)
 *   title        Überschrift
 *   description  Kurzbeschreibung
 *
 * onOpen wird aufgerufen, wenn man auf den Button klickt.
 * Die Karte weiß also nichts über die Navigation – das erledigt main.js.
 */

export function createExperimentCard(experiment, onOpen) {
  const card = document.createElement("article");
  card.className = "card card--interactive experiment-card";

  // Die Texte stammen aus unserer eigenen registry.js, nicht aus Nutzereingaben.
  card.innerHTML = `
    <div class="experiment-card__visual" aria-hidden="true">${experiment.symbol}</div>
    <div class="experiment-card__body">
      <div class="experiment-card__badges">
        <span class="badge">${experiment.badge}</span>
        <span class="badge badge--muted">${experiment.status}</span>
      </div>
      <h3 class="card-title">${experiment.title}</h3>
      <p class="card-description">${experiment.description}</p>
      <button type="button" class="btn btn--secondary">Experiment öffnen →</button>
    </div>
  `;

  const button = card.querySelector("button");
  button.setAttribute("aria-label", `Experiment „${experiment.title}“ öffnen`);
  button.addEventListener("click", onOpen);

  return card;
}
