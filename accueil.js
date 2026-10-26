async function chargerMeteoAccueil() {
  try {
    const pos = await obtenirPosition();
    const data = await recupererMeteo(pos.lat, pos.lon);
    const c = data.current;
    const meteo = decrireCode(c.weather_code);

    document.getElementById("accueil-date").textContent =
      new Date().toLocaleDateString("fr-FR", { weekday: "long", day: "numeric", month: "short" });
    document.getElementById("accueil-heure").textContent = c.time.slice(11);
    document.getElementById("accueil-icone").textContent = meteo.icone;
    document.getElementById("accueil-temp").textContent = c.temperature_2m + "°C";
    document.getElementById("accueil-texte").textContent = meteo.texte;
    document.getElementById("accueil-humidity").textContent = c.relative_humidity_2m;
    document.getElementById("accueil-rain").textContent = c.precipitation;
    document.getElementById("accueil-wind").textContent = c.wind_speed_10m;
  } catch (e) {
    console.error("Météo accueil :", e);   // la carte garde ses valeurs statiques
  }
}
chargerMeteoAccueil();