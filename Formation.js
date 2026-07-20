// récupérer l'utilisateur connecté
const loggedInUser = JSON.parse(localStorage.getItem("loggedInUser"));

// Récupère les éléments HTML
const userName = document.getElementById("userName");
const logoutBtn = document.getElementById("logoutBtn");

// Vérifie si un utilisateur est connecté
if (loggedInUser) {
    userName.textContent = "Hello, " + loggedInUser.nom;
} else {
    userName.textContent = "";
    logoutBtn.style.display = "none";
}

// Déconnexion
logoutBtn.addEventListener("click", function () {
    localStorage.removeItem("loggedInUser");

    window.location.href = "index.html";
});