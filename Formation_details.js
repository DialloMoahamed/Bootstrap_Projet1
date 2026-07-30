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

// ============================
// Chargement du blog concerné (contenu de la page de détail)
// ============================

// Récupère la liste des blogs enregistrés (la même source de vérité
// que Formation.html/Formation.js) et retourne celui dont l'id
// correspond au paramètre ?id=... de l'URL.
function getBlogActuel() {
    const stored = localStorage.getItem("blogs");
    if (!stored) return null;

    const blogs = JSON.parse(stored);

    // Les id peuvent être des nombres (blogs de base) ou des
    // timestamps (Date.now()) créés via le formulaire d'ajout.
    // On compare donc en chaîne de caractères pour éviter tout
    // souci de type entre l'URL (string) et les données (number).
    return blogs.find((blog) => String(blog.id) === String(postId)) || null;
}

// Remplit le contenu de la page (image, titre, auteur, date,
// catégorie, description) avec les informations du blog cliqué
// depuis Formation.html.
function afficherDetailsBlog() {
    const blog = getBlogActuel();

    // Si aucun blog ne correspond (id invalide ou manquant),
    // on laisse le contenu par défaut déjà présent dans le HTML.
    if (!blog) return;

    const detailImage = document.getElementById("detailImage");
    const detailTitre = document.getElementById("detailTitre");
    const detailAuteurDate = document.getElementById("detailAuteurDate");
    const detailDescription = document.getElementById("detailDescription");
    const detailCategorie = document.getElementById("detailCategorie");

    if (detailImage) detailImage.src = blog.image;
    if (detailTitre) detailTitre.textContent = blog.titre;
    if (detailAuteurDate) {
        detailAuteurDate.textContent =
            "By " + blog.auteur + " | Published on " + blog.date;
    }
    if (detailDescription) detailDescription.textContent = blog.description;
    if (detailCategorie) detailCategorie.textContent = blog.categorie;
}

// Met à jour le nombre de commentaires affiché sur la carte du
// blog dans Formation.html, pour qu'il reste synchronisé avec le
// nombre réel de commentaires publiés sur cette page de détail.
function synchroniserCompteurCommentaires(nombre) {
    const stored = localStorage.getItem("blogs");
    if (!stored) return;

    const blogs = JSON.parse(stored);
    const index = blogs.findIndex((blog) => String(blog.id) === String(postId));

    if (index !== -1) {
        blogs[index].commentaires = nombre;
        localStorage.setItem("blogs", JSON.stringify(blogs));
    }
}

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

    // Garde le compteur "X comments" de la carte (Formation.html)
    // synchronisé avec le nombre réel de commentaires de cet article.
    synchroniserCompteurCommentaires(comments.length);
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
    // Affiche le contenu de l'article (image, titre, auteur, description...)
    afficherDetailsBlog();
    // Affiche la liste des commentaires + met à jour le compteur
    renderComments();
    // Prépare le formulaire selon l'état de connexion
    setupCommentForm();
});