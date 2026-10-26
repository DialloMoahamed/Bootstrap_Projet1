const URL_FAO = "https://nsi-release-ro-statsuite.fao.org/rest/data/FAO,DF_SDG_2_C_1,1.0/A.AG_FPA_COMM.562.........?startPeriod=2021&endPeriod=2024&dimensionAtObservation=AllDimensions";

const PRODUITS = { "0113": "Riz importé", "0112": "Maïs blanc", "0114": "Sorgho", "0118": "Mil" };

async function chargerIndicateurs() {
  const message = document.getElementById("fao-message");
  try {
    const reponse = await fetch(URL_FAO);
    if (!reponse.ok) throw new Error("Erreur HTTP " + reponse.status);

    const texte = await reponse.text();                              // c'est du XML, pas du JSON
    const xml = new DOMParser().parseFromString(texte, "application/xml");

    const lignes = [];
    xml.querySelectorAll("Obs").forEach(obs => {
      const cle = {};
      obs.querySelectorAll("ObsKey Value").forEach(v => cle[v.getAttribute("id")] = v.getAttribute("value"));

      const valeur = obs.querySelector("ObsValue");
      const commentaire = obs.querySelector('Attributes Value[id="COMMENT_OBS"]');

      lignes.push({
        produit: PRODUITS[cle.PRODUCT] ?? cle.PRODUCT,
        annee: cle.TIME_PERIOD,
        valeur: valeur ? valeur.getAttribute("value") : "N/D",
        details: commentaire ? commentaire.getAttribute("value") : ""
      });
    });

    // tri par produit puis par année
    lignes.sort((a, b) => a.produit.localeCompare(b.produit) || a.annee - b.annee);

    document.getElementById("fao-tbody").innerHTML = lignes.map(l => `
      <tr><td>${l.produit}</td><td>${l.annee}</td><td>${l.valeur}</td><td>${l.details}</td></tr>
    `).join("");
    message.textContent = lignes.length + " observations trouvées.";
  } catch (e) {
    console.error(e);
    message.textContent = "Impossible de charger les données de la FAO.";
  }
}
chargerIndicateurs();