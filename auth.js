// Utilisateur connecté (null si personne n'est connecté)
const loggedInUser = JSON.parse(localStorage.getItem("loggedInUser"));

// On récupère TOUS les éléments avec ces classes (desktop + mobile)
const userNames = document.querySelectorAll(".user-name");
const loginBtns = document.querySelectorAll(".login-btn");
const logoutBtns = document.querySelectorAll(".logout-btn");

if (loggedInUser) {
  // Connecté : on affiche le nom et on cache "Connect"
  userNames.forEach(el => el.textContent = "Hello, " + loggedInUser.nom);
  loginBtns.forEach(el => el.classList.add("d-none"));
} else {
  // Non connecté : on cache "Disconnect"
  logoutBtns.forEach(el => el.classList.add("d-none"));
}

// Déconnexion : on supprime l'utilisateur et on retourne à l'accueil
logoutBtns.forEach(btn => {
  btn.addEventListener("click", () => {
    localStorage.removeItem("loggedInUser");
    window.location.href = "index.html";
  });
});