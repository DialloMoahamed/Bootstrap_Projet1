// Position par défaut (Niamey) si la détection échoue ou est refusée
function obtenirPosition() {
  return new Promise((resolve) => {
    const defaut = { lat: 13.51, lon: 2.11, detectee: false };
    if (!navigator.geolocation) return resolve(defaut);

    navigator.geolocation.getCurrentPosition(
      (pos) => resolve({ lat: pos.coords.latitude, lon: pos.coords.longitude, detectee: true }),
      () => resolve(defaut)
    );
  });
}

// L'appel à l'API : on construit l'URL, on fait fetch, on renvoie le JSON
async function recupererMeteo(lat, lon) {
  const url = "https://api.open-meteo.com/v1/forecast"
    + `?latitude=${lat}&longitude=${lon}`
    + "&current=temperature_2m,relative_humidity_2m,precipitation,wind_speed_10m,weather_code"
    + "&hourly=temperature_2m,relative_humidity_2m,precipitation,wind_speed_10m"
    + "&daily=weather_code,temperature_2m_max"
    + "&timezone=auto&forecast_days=6";

  const reponse = await fetch(url);
  if (!reponse.ok) throw new Error("Erreur HTTP " + reponse.status);
  return await reponse.json();
}

// open-meteo renvoie un code numérique, on le traduit en icône + texte
function decrireCode(code) {
  if (code === 0) return { icone: "☀️", texte: "Ciel dégagé" };
  if (code === 1 || code === 2) return { icone: "⛅", texte: "Peu nuageux" };
  if (code === 3) return { icone: "☁️", texte: "Couvert" };
  if (code === 45 || code === 48) return { icone: "🌫️", texte: "Brouillard" };
  if (code >= 51 && code <= 67) return { icone: "🌧️", texte: "Pluie" };
  if (code >= 80 && code <= 82) return { icone: "🌦️", texte: "Averses" };
  if (code >= 95) return { icone: "⛈️", texte: "Orage" };
  return { icone: "❓", texte: "Inconnu" };
}