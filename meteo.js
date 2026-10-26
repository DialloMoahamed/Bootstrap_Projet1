let meteoData = null;   // on garde la réponse de l'API ici
let graphique = null;   // le graphique Chart.js actuel

async function trouverNomVille(lat, lon) {
  try {
    const r = await fetch(`https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${lat}&longitude=${lon}&localityLanguage=fr`);
    const d = await r.json();
    return d.city || d.locality || "Position détectée";
  } catch {
    return "Position détectée";
  }
}

async function chargerPage() {
  const pos = await obtenirPosition();
  const ville = pos.detectee ? await trouverNomVille(pos.lat, pos.lon) : "Niamey";
  try {
    meteoData = await recupererMeteo(pos.lat, pos.lon);
    document.getElementById("ville").textContent = ville;
    afficherActuel();
    afficherGraphique("temperature");
    afficherPrevisions();
  } catch (e) {
    console.error(e);
    document.getElementById("ville").textContent = "Erreur de chargement";
  }
}

document.getElementById("btn-position").addEventListener("click", chargerPage);
chargerPage();

function afficherActuel() {
  const c = meteoData.current;
  document.getElementById("temp").textContent = c.temperature_2m + "°C";
  document.getElementById("humidity").textContent = c.relative_humidity_2m + "%";
  document.getElementById("precip").textContent = c.precipitation + " mm";
  document.getElementById("wind").textContent = c.wind_speed_10m + " km/h";
  document.getElementById("heure").textContent = c.time.slice(11);   // "2026-10-21T08:15" -> "08:15"
}

function prochaines6Heures(cle) {
  const h = meteoData.hourly;
  const debut = h.time.indexOf(meteoData.current.time.slice(0, 13) + ":00");
  return {
    heures: h.time.slice(debut, debut + 6).map(t => t.slice(11)),
    valeurs: h[cle].slice(debut, debut + 6)
  };
}


function afficherGraphique(type) {
  const titre = document.getElementById("titre-graphique");
  const canvas = document.getElementById("graphique");
  const vent = document.getElementById("vent");

  if (graphique) graphique.destroy();   // sinon Chart.js se mélange avec l'ancien
  vent.innerHTML = "";

  if (type === "vent") {
    canvas.classList.add("d-none");
    titre.textContent = "Vent des 6 prochaines heures";
    const d = prochaines6Heures("wind_speed_10m");
    vent.innerHTML = d.valeurs.map((v, i) =>
      `<div class="col text-center"><strong>➤ ${v} km/h</strong><br><small>${d.heures[i]}</small></div>`
    ).join("");
    return;
  }

  canvas.classList.remove("d-none");
  const config = {
    temperature: { titre: "Température des 6 prochaines heures", cle: "temperature_2m",
                   type: "line", label: "Temperature °C", couleur: "#e03a3a" },
    precipitation: { titre: "Précipitations des 6 prochaines heures", cle: "relative_humidity_2m",
                     type: "bar", label: "Humidity %", couleur: "#9bbcf5" }
  }[type];

  titre.textContent = config.titre;
  const d = prochaines6Heures(config.cle);
  graphique = new Chart(canvas, {
    type: config.type,
    data: {
      labels: d.heures,
      datasets: [{ label: config.label, data: d.valeurs,
                   borderColor: config.couleur, backgroundColor: config.couleur, tension: 0.4 }]
    }
  });
}

document.getElementById("btn-temp").addEventListener("click", () => afficherGraphique("temperature"));
document.getElementById("btn-vent").addEventListener("click", () => afficherGraphique("vent"));
document.getElementById("btn-precip").addEventListener("click", () => afficherGraphique("precipitation"));


function afficherPrevisions() {
  const d = meteoData.daily;
  document.getElementById("previsions").innerHTML = d.time.map((jour, i) => {
    const nom = new Date(jour + "T12:00").toLocaleDateString("fr-FR", { weekday: "short" });
    const meteo = decrireCode(d.weather_code[i]);
    return `
      <div class="col">
        <div class="border rounded text-center p-3">
          <div>${nom}</div>
          <div class="fs-2">${meteo.icone}</div>
          <strong>${d.temperature_2m_max[i]}°C</strong>
        </div>
      </div>`;
  }).join("");
}