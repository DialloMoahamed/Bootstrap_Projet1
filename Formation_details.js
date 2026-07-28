// ============================
// Gestion de l'utilisateur connecté
// ============================

// récupérer l'utilisateur connecté
const loggedInUser = JSON.parse(localStorage.getItem("loggedInUser"));

// Vérifie si un utilisateur est connecté
if (loggedInUser) {
    userName.textContent = "Hello, " + loggedInUser.nom;
    username.textContent = loggedInUser.nom;
    role.textContent = loggedInUser.role;
} else {
    username.textContent = "";
    role.textContent = "";
    logoutBtn.style.display = "none";
}

// Déconnexion
logoutBtn.addEventListener("click", function () {
    localStorage.removeItem("loggedInUser");
    window.location.href = "index.html";
});


// ============================
// Gestion des commentaires
// ============================

// Chaque page de détail correspond à un article (ex: Formation_details.html?id=3).
// On récupère cet identifiant pour que les commentaires d'un article
// ne s'affichent jamais sur un autre article.
const params = new URLSearchParams(window.location.search);
const postId = params.get("id") || "default";
const commentsKey = "comments_" + postId;

// Commentaires de démonstration affichés la toute première fois
// qu'un visiteur ouvre cet article (avant tout ajout réel).
const defaultComments = [
    { auteur: "Mariam", email: "mariam76@example.com", texte: "Merci du partage", date: "2025-12-01T06:14:53" }
];

// Récupère les commentaires de CET article depuis le localStorage
function getComments() {
    const stored = localStorage.getItem(commentsKey);
    if (stored) {
        return JSON.parse(stored);
    }
    localStorage.setItem(commentsKey, JSON.stringify(defaultComments));
    return defaultComments;
}

// Sauvegarde les commentaires de CET article
function saveComments(comments) {
    localStorage.setItem(commentsKey, JSON.stringify(comments));
}

// Formate une date ISO au format jj/mm/aaaa hh.mm.ss
function formatDate(isoString) {
    const d = new Date(isoString);
    const pad = (n) => String(n).padStart(2, "0");
    return pad(d.getDate()) + "/" + pad(d.getMonth() + 1) + "/" + d.getFullYear() +
        " " + pad(d.getHours()) + "." + pad(d.getMinutes()) + "." + pad(d.getSeconds());
}

// Échappe le texte saisi par l'utilisateur avant de l'insérer dans le HTML
function escapeHtml(text) {
    const div = document.createElement("div");
    div.textContent = text;
    return div.innerHTML;
}

// Affiche la liste des commentaires + met à jour le compteur
function renderComments() {
    const comments = getComments();
    const commentsList = document.getElementById("commentsList");
    commentsList.innerHTML = "";

    comments.forEach(function (comment) {
        const card = document.createElement("div");
        card.className = "card mt-3 w-75";
        card.style.borderTopColor = "#1A8755";
        card.style.borderBottomColor = "#1A8755";

        card.innerHTML =
            '<div class="card-body">' +
            '<div class="d-flex justify-content-between">' +
            '<span><strong>' + escapeHtml(comment.auteur) + '</strong> (' + escapeHtml(comment.email) + ')</span>' +
            '<i class="bi bi-arrow-return-left fs-5"></i>' +
            '</div>' +
            '<div class="mt-3"><span class="small">' + formatDate(comment.date) + '</span></div>' +
            '<span class="small">' + escapeHtml(comment.texte) + '</span>' +
            '</div>';

        commentsList.appendChild(card);
    });

    document.getElementById("commentTitle").textContent = "Comments (" + comments.length + ")";
}

// Ajoute un commentaire (accessible connecté ou non)
function addComment() {
    const commentText = document.getElementById("commentText");
    const texte = commentText.value.trim();

    if (!texte) {
        alert("Veuillez écrire un commentaire avant de publier.");
        return;
    }

    let auteur, email;

    if (loggedInUser) {
        auteur = loggedInUser.nom;
        email = loggedInUser.email || "";
    } else {
        const commentName = document.getElementById("commentName");
        const commentEmail = document.getElementById("commentEmail");
        auteur = commentName.value.trim();
        email = commentEmail.value.trim();

        if (!auteur || !email) {
            alert("Veuillez entrer votre nom et votre email.");
            return;
        }

        commentName.value = "";
        commentEmail.value = "";
    }

    const comments = getComments();
    comments.push({
        auteur: auteur,
        email: email,
        texte: texte,
        date: new Date().toISOString()
    });
    saveComments(comments);
    renderComments();

    commentText.value = "";
}

// Prépare le formulaire selon l'état de connexion
function setupCommentForm() {
    const guestFields = document.getElementById("guestFields");
    const loggedInLabel = document.getElementById("commentAsLoggedIn");

    if (loggedInUser) {
        guestFields.style.display = "none";
        loggedInLabel.style.display = "block";
        loggedInLabel.textContent = "Vous commentez en tant que " + loggedInUser.nom;
    }

    document.getElementById("submitComment").addEventListener("click", addComment);
}

document.addEventListener("DOMContentLoaded", function () {
    // Affiche la liste des commentaires + met à jour le compteur
    renderComments();
    // Prépare le formulaire selon l'état de connexion
    setupCommentForm();
});