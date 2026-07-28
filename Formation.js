// ===============================
// TABLEAU DES BLOGS
// ===============================

// Création d'un tableau contenant tous les blogs.
// Chaque objet représente un blog.
const blogs = [
  {
    // Identifiant unique du blog
    id: 1,

    // Titre du blog
    titre: "Lorem dolor",

    // Catégorie du blog
    categorie: "Jardinage",

    // Email de l'auteur du blog
    // Il servira plus tard à vérifier si
    // l'utilisateur connecté est l'auteur.
    auteur: "malika.malikatou@example.com",

    // Date de publication
    date: "10/08/2020",

    // Chemin vers l'image du blog
    image: "images/cardimg5.jpg",

    // Nombre de commentaires
    commentaires: 7,

    // Description du blog
    description:
      "Lorem ipsum dolor sit amet consectetur adipisicing elit. Vitae unde natus, culpa eius aliquam adipisci...",
  },
  {
    id: 2,
    titre: "Cras dapibus",
    categorie: "Contre-Saison",
    auteur: "amir.amirou@example.com",
    date: "29/09/2019",
    image: "images/cardimg4.jpg",
    commentaires: 7,
    description:
      "Lorem ipsum dolor sit amet consectetur adipisicing elit. Vitae unde natus, culpa eius aliquam adipisci...",
  },
  {
    id: 3,
    titre: "Lorem ipsum",
    categorie: "Jardinage",
    auteur: "abdou.abdourahmane@example.com",
    date: "26/07/2019",
    image: "images/Blog-img-4.jpg",
    commentaires: 7,
    description:
      "Lorem ipsum dolor sit amet consectetur adipisicing elit. Vitae unde natus, culpa eius aliquam adipisci...",
  },
  {
    id: 4,
    titre: "Lorem dolor",
    categorie: "Jardinage",
    auteur: "malika.malikatou@example.com",
    date: "10/08/2020",
    image: "images/Blog-img-10.jpg",
    commentaires: 7,
    description:
      "Lorem ipsum dolor sit amet consectetur adipisicing elit. Vitae unde natus, culpa eius aliquam adipisci...",
  },
  {
    id: 5,
    titre: "Cras dapibus",
    categorie: "Contre-Saison",
    auteur: "amir.amirou@example.com",
    date: "29/09/2019",
    image: "images/Blog-img-2.jpg",
    commentaires: 7,
    description:
      "Lorem ipsum dolor sit amet consectetur adipisicing elit. Vitae unde natus, culpa eius aliquam adipisci...",
  },
  {
    id: 6,
    titre: "Lorem ipsum",
    categorie: "Jardinage",
    auteur: "abdou.abdourahmane@example.com",
    date: "26/07/2019",
    image: "images/Blog-img-3.jpg",
    commentaires: 7,
    description:
      "Lorem ipsum dolor sit amet consectetur adipisicing elit. Vitae unde natus, culpa eius aliquam adipisci...",
  },
  {
    id: 7,
    titre: "Lorem dolor",
    categorie: "Jardinage",
    auteur: "malika.malikatou@example.com",
    date: "10/08/2020",
    image: "images/Blog-img-7.jpg",
    commentaires: 7,
    description:
      "Lorem ipsum dolor sit amet consectetur adipisicing elit. Vitae unde natus, culpa eius aliquam adipisci...",
  },
  {
    id: 8,
    titre: "Cras dapibus",
    categorie: "Contre-Saison",
    auteur: "amir.amirou@example.com",
    date: "29/09/2019",
    image: "images/Blog-img-8.jpg",
    commentaires: 7,
    description:
      "Lorem ipsum dolor sit amet consectetur adipisicing elit. Vitae unde natus, culpa eius aliquam adipisci...",
  },
  {
    id: 9,
    titre: "Lorem ipsum",
    categorie: "Jardinage",
    auteur: "abdou.abdourahmane@example.com",
    date: "26/07/2019",
    image: "images/Blog-img-6.jpg",
    commentaires: 7,
    description:
      "Lorem ipsum dolor sit amet consectetur adipisicing elit. Vitae unde natus, culpa eius aliquam adipisci...",
  },
  {
    id: 10,
    titre: "Lorem dolor",
    categorie: "Jardinage",
    auteur: "malika.malikatou@example.com",
    date: "10/08/2020",
    image: "images/Blog-img-5.jpg",
    commentaires: 7,
    description:
      "Lorem ipsum dolor sit amet consectetur adipisicing elit. Vitae unde natus, culpa eius aliquam adipisci...",
  },
];

// ===============================
// DESCRIPTION PAR DÉFAUT
// ===============================

// Texte utilisé quand une carte n'a pas (ou plus) de description
// valide, et pré-rempli dans le formulaire d'ajout d'un article.
const DESCRIPTION_PAR_DEFAUT =
  "Lorem ipsum dolor sit amet consectetur adipisicing elit. Vitae unde natus, culpa eius aliquam adipisci...";

// ===============================
// GESTION DE L'UTILISATEUR CONNECTÉ
// ===============================

// Récupère l'utilisateur connecté depuis le Local Storage.
// JSON.parse() transforme la chaîne de caractères en objet JavaScript.
// Si aucun utilisateur n'est connecté, localStorage.getItem() renvoie
// null et loggedInUser vaudra donc null (pas d'erreur).
const loggedInUser = JSON.parse(localStorage.getItem("loggedInUser"));

// ===============================
// RÉCUPÉRATION DES ÉLÉMENTS HTML
// ===============================

// Élément où sera affiché le nom de l'utilisateur.
const userName = document.getElementById("userName");

// Bouton de déconnexion.
const logoutBtn = document.getElementById("logoutBtn");

// ===============================
// VÉRIFICATION DE LA CONNEXION
// ===============================

// Si un utilisateur est connecté...
if (loggedInUser) {
  // ...on affiche son nom.
  userName.textContent = "Hello, " + loggedInUser.nom;
} else {
  // Sinon on n'affiche aucun nom.
  userName.textContent = "";

  // Et on cache le bouton Déconnexion.
  logoutBtn.style.display = "none";
}

// ===============================
// DÉCONNEXION
// ===============================

// Lorsqu'on clique sur le bouton Déconnexion...
logoutBtn.addEventListener("click", function () {
  // ...on supprime l'utilisateur connecté
  // du Local Storage.
  localStorage.removeItem("loggedInUser");

  // Puis on recharge la page d'accueil.
  window.location.href = "index.html";
});

// ===============================
// ENREGISTREMENT DES BLOGS
// ===============================

// Vérifie si les blogs existent déjà
// dans le Local Storage.
if (!localStorage.getItem("blogs")) {
  // Si ce n'est pas le cas,
  // on enregistre le tableau blogs.
  // (Cela évite d'écraser des blogs déjà ajoutés/modifiés
  // par l'utilisateur lors d'une session précédente.)
  localStorage.setItem("blogs", JSON.stringify(blogs));
}

// Récupère la zone HTML où seront affichées les cartes
const blogContainer = document.getElementById("blogsContainer");

// Variable globale qui garde en mémoire l'id du blog
// à supprimer (utilisée entre le clic sur "Supprimer"
// et la confirmation dans le modal).
let blogASupprimer = null;

// ===============================
// FONCTION D'AFFICHAGE DES BLOGS
// ===============================

// Comble les champs manquants ou invalides d'un blog (id, image,
// date, description...). Ça permet de "réparer" automatiquement
// une donnée corrompue (ancien test, bug passé, etc.) au lieu de
// faire planter tout l'affichage à chaque fois qu'on la rencontre.
function nettoyerBlog(blog) {
  return {
    id: blog && blog.id ? blog.id : Date.now() + Math.random(),
    titre: (blog && blog.titre) || "Sans titre",
    categorie: (blog && blog.categorie) || "Jardinage",
    auteur: (blog && blog.auteur) || "inconnu@example.com",
    date: (blog && blog.date) || new Date().toLocaleDateString(),
    image: (blog && blog.image) || "images/logo.png",
    commentaires:
      blog && typeof blog.commentaires === "number" ? blog.commentaires : 0,
    description: (blog && blog.description) || DESCRIPTION_PAR_DEFAUT,
  };
}

function afficherBlogs() {
  // On vide le contenu avant chaque affichage
  // pour éviter les doublons
  blogContainer.innerHTML = "";

  // Récupération des blogs depuis LocalStorage
  // (source de vérité : on relit à chaque appel pour être
  // toujours synchronisé avec les dernières modifications).
  // On passe chaque blog dans nettoyerBlog() pour combler les
  // champs manquants, puis on réenregistre la version propre :
  // la réparation devient ainsi permanente.
  const storedBlogs = JSON.parse(localStorage.getItem("blogs")).map(
    nettoyerBlog,
  );
  localStorage.setItem("blogs", JSON.stringify(storedBlogs));

  // Découpe une date au format "jj/mm/aaaa" en deux morceaux :
  // - jour : le quantième seul (ex: "10")
  // - moisAnnee : mois + année (ex: "08/2020")
  // Cela permet d'afficher une bulle de date à deux étages
  // (gros chiffre du jour au-dessus, mois/année en dessous).
  function formaterDate(dateStr) {
    // Sécurité : si un blog n'a pas de date valide (donnée
    // corrompue ou champ manquant), on affiche un placeholder
    // au lieu de faire planter tout l'affichage des blogs.
    if (!dateStr || typeof dateStr !== "string" || !dateStr.includes("/")) {
      return { jour: "--", moisAnnee: "--/----" };
    }
    const [jour, mois, annee] = dateStr.split("/");
    return { jour, moisAnnee: `${mois}/${annee}` };
  }

  // Parcours de chaque blog
  storedBlogs.forEach((blog) => {
    // Crée la colonne Bootstrap qui contiendra la carte du blog
    const blogCard = document.createElement("div");
    blogCard.classList.add("col-md-4", "mb-4", "CARD1");

    // Découpe la date du blog pour l'affichage en bulle
    const { jour, moisAnnee } = formaterDate(blog.date);

    blogCard.innerHTML = `
    <div class="card border-0 rounded-4 overflow-hidden position-relative shadow-sm">

      <div class="position-relative">

        <img src="${blog.image}" class="card-img-top" alt="${blog.titre}">

        ${
          // Les boutons Editer/Supprimer ne sont affichés
          // que si un utilisateur est connecté. Un visiteur
          // non connecté ne peut donc pas modifier les blogs.
          loggedInUser
            ? `
            <button class="card-icon-btn edit-btn" data-id="${blog.id}" title="Editer">
                <i class="fa-solid fa-pen"></i>
            </button>
            <button class="card-icon-btn delete-btn" data-id="${blog.id}" title="Supprimer">
                <i class="fa-solid fa-trash"></i>
            </button>
            `
            : ""
        }

        <!-- BULLE DE DATE -->
        <div class="date-badge">
          <span class="day">${jour}</span>
          <span class="month">${moisAnnee}</span>
        </div>

      </div>

      <div class="card-body text-center">
        <p class="text-success fw-semibold">${blog.categorie}</p>
        <h5 class="card-title">${blog.titre}</h5>
        <p class="small mb-1 text-muted">${blog.auteur}</p>
        <p class="card-text">
          ${blog.description}
        </p>
        <div>
          <span style="font-size: small;">
            <i class="fa-regular fa-comment-dots"></i> ${blog.commentaires} comments
          </span>
        </div><br>
        <button type="button" class="btn rounded-pill text-light p-2"
          style="background-color: #173610; width: 10em;">
          <!-- Le paramètre ?id=... transmet l'identifiant du blog
               à la page de détail, pour qu'elle sache quel article
               (et quels commentaires) afficher. -->
          <a href="Formation_details.html?id=${blog.id}" class="text-decoration-none text-light">
            Voir plus <i class="fa-solid fa-arrow-up-right-from-square"></i>
          </a>
        </button>
      </div>

    </div>
  `;

    // Insère la carte fraîchement créée dans le container
    blogContainer.appendChild(blogCard);
  });

  // Active les boutons après création des cartes
  // (uniquement les boutons Editer/Supprimer, qui sont
  // recréés à chaque affichage)
  activerBoutons();
}

function activerBoutons() {
  // ===========================
  // BOUTON SUPPRIMER
  // ===========================

  // Comme ces boutons sont recréés à chaque appel de
  // afficherBlogs(), on doit re-sélectionner et
  // ré-attacher un listener à chacun d'eux ici.
  const deleteButtons = document.querySelectorAll(".delete-btn");

  deleteButtons.forEach((button) => {
    button.addEventListener("click", () => {
      // On mémorise l'id du blog visé, pour que le bouton
      // de confirmation (dans le modal) sache lequel supprimer.
      blogASupprimer = Number(button.dataset.id);

      const deleteModal = new bootstrap.Modal(
        document.getElementById("deleteModal"),
      );

      deleteModal.show();
    });
  });

  // ===========================
  // BOUTON EDITER
  // ===========================

  const editButtons = document.querySelectorAll(".edit-btn");

  editButtons.forEach((button) => {
    button.addEventListener("click", () => {
      const blogId = Number(button.dataset.id);

      // Ouvre le modal d'édition pré-rempli avec les
      // informations du blog concerné.
      ouvrirModalEdition(blogId);
    });
  });
}

// ===============================
// CONFIRMATION DE SUPPRESSION
// ===============================

// IMPORTANT : ce bouton ("confirmDelete") vit dans le modal,
// en dehors de blogsContainer, donc il n'est JAMAIS recréé
// par afficherBlogs(). On attache le listener une seule fois,
// ici, en dehors de activerBoutons(), pour éviter d'empiler
// plusieurs listeners identiques à chaque rafraîchissement.
document.getElementById("confirmDelete").addEventListener("click", () => {
  // Récupère la liste actuelle des blogs
  let blogs = JSON.parse(localStorage.getItem("blogs"));

  // Ne garde que les blogs dont l'id est différent
  // de celui à supprimer (= retire le blog ciblé)
  blogs = blogs.filter((blog) => blog.id !== blogASupprimer);

  // Sauvegarde la liste mise à jour
  localStorage.setItem("blogs", JSON.stringify(blogs));

  // Ferme le modal de confirmation
  bootstrap.Modal.getInstance(document.getElementById("deleteModal")).hide();

  // Réinitialise l'id mémorisé, pour éviter toute suppression
  // accidentelle si le bouton était re-cliqué sans sélection.
  blogASupprimer = null;

  // Rafraîchit l'affichage pour refléter la suppression
  afficherBlogs();
});

// ===============================
// OUVERTURE DU MODAL D'ÉDITION
// ===============================

function ouvrirModalEdition(blogId) {
  // Récupération des blogs
  const blogs = JSON.parse(localStorage.getItem("blogs"));

  // Cherche le blog correspondant à l'id cliqué
  const blog = blogs.find((blog) => blog.id === blogId);

  // Remplissage du formulaire avec les valeurs actuelles du blog,
  // afin que l'utilisateur puisse les modifier facilement.

  document.getElementById("editId").value = blog.id;

  document.getElementById("editTitre").value = blog.titre;

  document.getElementById("editCategorie").value = blog.categorie;

  document.getElementById("editDescription").value = blog.description;

  // Vérification auteur
  // On informe l'utilisateur s'il est bien l'auteur du blog,
  // simplement à titre indicatif (aucun blocage n'est fait ici :
  // l'édition reste possible même si ce n'est pas son article).

  const authorMessage = document.getElementById("authorMessage");

  if (loggedInUser && loggedInUser.email === blog.auteur) {
    authorMessage.textContent = "Vous êtes l'auteur de ce blog";
  } else {
    authorMessage.textContent = "Vous n'êtes pas l'auteur de ce blog";
  }

  // Ouverture du modal Bootstrap

  const modal = new bootstrap.Modal(document.getElementById("editBlogModal"));

  modal.show();
}

// ===============================
// ENREGISTREMENT DES MODIFICATIONS
// ===============================

// Récupère le bouton Enregistrer du modal
const saveBlogBtn = document.getElementById("saveBlog");

// Quand l'utilisateur clique sur Enregistrer
saveBlogBtn.addEventListener("click", function () {
  // ===============================
  // RÉCUPÉRATION DES NOUVELLES VALEURS
  // ===============================

  // Récupère l'id du blog modifié
  const blogId = Number(document.getElementById("editId").value);

  // Récupère le nouveau titre
  const nouveauTitre = document.getElementById("editTitre").value;

  // Récupère la nouvelle catégorie
  const nouvelleCategorie = document.getElementById("editCategorie").value;

  // Récupère la nouvelle description
  const nouvelleDescription = document.getElementById("editDescription").value;

  // ===============================
  // RÉCUPÉRATION DES BLOGS
  // ===============================

  // Récupère les blogs enregistrés
  let blogs = JSON.parse(localStorage.getItem("blogs"));

  // ===============================
  // RECHERCHE DU BLOG
  // ===============================

  // Cherche l'emplacement (index) du blog dans le tableau,
  // grâce à son id, pour pouvoir le modifier directement.
  const index = blogs.findIndex((blog) => blog.id === blogId);

  // Vérifie si le blog existe bien (findIndex renvoie -1 sinon)
  if (index !== -1) {
    // ===============================
    // MODIFICATION DES INFORMATIONS
    // ===============================

    // On met à jour uniquement les champs modifiables
    // (le reste du blog, comme l'auteur ou l'image, est conservé).
    blogs[index].titre = nouveauTitre;

    blogs[index].categorie = nouvelleCategorie;

    blogs[index].description = nouvelleDescription;

    // ===============================
    // SAUVEGARDE
    // ===============================

    // Enregistre les nouvelles données
    localStorage.setItem("blogs", JSON.stringify(blogs));

    // ===============================
    // ACTUALISATION
    // ===============================

    // Recharge l'affichage pour voir les changements
    // immédiatement, sans devoir rafraîchir la page.
    afficherBlogs();

    // ===============================
    // FERMETURE DU MODAL
    // ===============================

    const modalElement = document.getElementById("editBlogModal");

    const modalInstance = bootstrap.Modal.getInstance(modalElement);

    modalInstance.hide();
  }
});

// ===============================
// AJOUT D'UN NOUVEL ARTICLE
// ===============================

// Bouton Ajouter
const saveNewBlog = document.getElementById("confirmAddBlog");

saveNewBlog.addEventListener("click", function () {
  // Récupération des valeurs du formulaire

  const titre = document.getElementById("addTitre").value;

  const categorie = document.getElementById("addCategorie").value;

  // Si l'utilisateur laisse le champ vide, on retombe sur le
  // texte par défaut plutôt que d'enregistrer une description vide.
  const description =
    document.getElementById("addDescription").value.trim() ||
    DESCRIPTION_PAR_DEFAUT;

  // Récupération de l'éventuel fichier image sélectionné
  const imageInput = document.getElementById("addImage");
  const fichierImage = imageInput.files[0];

  // Fonction qui construit et enregistre le nouveau blog,
  // une fois qu'on connaît l'image à utiliser (par défaut
  // ou celle lue depuis le fichier uploadé).
  // On l'isole dans une fonction séparée car la lecture du
  // fichier via FileReader est asynchrone : on ne peut donc
  // enregistrer le blog qu'une fois cette lecture terminée.
  function enregistrerNouveauBlog(cheminImage) {
    // Récupération des anciens blogs
    let blogs = JSON.parse(localStorage.getItem("blogs"));

    // Création du nouvel article
    const nouveauBlog = {
      // Date.now() garantit un id unique (timestamp en
      // millisecondes), sans avoir besoin de calculer
      // le prochain id disponible.
      id: Date.now(),
      titre: titre,
      categorie: categorie,
      // L'auteur est automatiquement l'utilisateur connecté :
      // il faut donc être connecté pour ajouter un blog.
      auteur: loggedInUser.email,
      date: new Date().toLocaleDateString(),
      image: cheminImage,
      // Un nouvel article démarre logiquement sans commentaire.
      commentaires: 0,
      description: description,
    };

    // Ajoute le nouveau blog à la fin du tableau
    blogs.push(nouveauBlog);

    // Sauvegarde le tableau complet mis à jour
    localStorage.setItem("blogs", JSON.stringify(blogs));

    // Recharge l'affichage pour montrer le nouvel article
    afficherBlogs();

    // Ferme le modal d'ajout
    const modalElement = document.getElementById("addBlogModal");
    const modal = bootstrap.Modal.getInstance(modalElement);
    modal.hide();

    // Nettoyage du formulaire, pour qu'il soit vide
    // la prochaine fois qu'on voudra ajouter un article.
    document.getElementById("addTitre").value = "";
    document.getElementById("addCategorie").value = "";
    document.getElementById("addDescription").value = DESCRIPTION_PAR_DEFAUT;
    imageInput.value = "";
  }

  if (fichierImage) {
    // Si un fichier a été choisi, on le convertit en
    // base64 (via FileReader) pour pouvoir l'afficher
    // directement sans avoir besoin d'un serveur.
    const reader = new FileReader();

    // reader.onload se déclenche une fois la lecture terminée :
    // event.target.result contient alors l'image encodée
    // en base64, utilisable directement comme src d'une <img>.
    reader.onload = function (event) {
      enregistrerNouveauBlog(event.target.result);
    };

    reader.readAsDataURL(fichierImage);
  } else {
    // Sinon, on utilise une image par défaut
    enregistrerNouveauBlog("images/logo.png");
  }
});

// Pré-remplit le champ description avec le texte par défaut
// à chaque ouverture du modal d'ajout, s'il est vide.
document
  .getElementById("addBlogModal")
  .addEventListener("show.bs.modal", function () {
    const champDescription = document.getElementById("addDescription");
    if (!champDescription.value.trim()) {
      champDescription.value = DESCRIPTION_PAR_DEFAUT;
    }
  });

// Affiche les blogs dès le chargement de la page
afficherBlogs();