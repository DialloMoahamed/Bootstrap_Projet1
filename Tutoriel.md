# Tutoriel — Agritech App : connexion, gestion des blogs et commentaires

Ce tutoriel est basé sur **ton vrai dépôt** `Bootstrap_Projet1` (projet **Agritech App**). Contrairement au projet Pharm Inventory, une bonne partie du code est **déjà écrite** dans le dépôt — ce tutoriel t'explique comment elle fonctionne, morceau par morceau, pour que tu puisses la reproduire et la comprendre toi-même, plutôt que de simplement la copier-coller.

Il reste un vrai trou à combler que je signale en gras là où il apparaît : **la page d'accueil (`index.html`) n'affiche pas encore le nom de l'utilisateur connecté**, contrairement à `Formation.html` et `Formation_details.html`.

---

## 0. Rappels de base avant de commencer

### Une fonction / une fonction fléchée

Un bloc de code auquel on donne un nom pour l'exécuter plusieurs fois.

```js
function direBonjour(nom) { console.log("Bonjour " + nom); }
const direBonjour2 = (nom) => console.log("Bonjour " + nom); // équivalent, en fléchée
```

### `const` et `let`

`const` : la valeur ne changera jamais. `let` : elle peut changer.

### Le JSON et `localStorage`

`localStorage` est une petite base de données du navigateur qui ne stocke que du **texte**.

- `JSON.stringify(objet)` : transforme un objet JS en texte, pour l'écrire.
- `JSON.parse(texte)` : transforme du texte en objet JS, pour le relire.
- `localStorage.getItem("cle")` renvoie `null` si la clé n'existe pas encore — utile pour tester "est-ce que c'est la première fois ?".

### Les méthodes de tableau : `find`, `filter`, `findIndex`, `forEach`, `map`

- `.find(...)` : renvoie le **premier** élément qui correspond à une condition (ou `undefined` si aucun).
- `.filter(...)` : renvoie un **nouveau tableau** avec seulement les éléments qui correspondent.
- `.findIndex(...)` : comme `.find()`, mais renvoie la **position** (index) de l'élément, pas l'élément lui-même (`-1` si rien n'est trouvé).
- `.forEach(...)` : exécute du code pour chaque élément, sans rien renvoyer.
- `.map(...)` : transforme chaque élément en autre chose.

### `document.getElementById` et l'accès "automatique" par id

Normalement, pour manipuler un élément HTML en JS, on écrit :

```js
const bouton = document.getElementById("monBouton");
```

Mais le navigateur fait aussi quelque chose d'un peu magique : **tout élément qui a un `id`** devient automatiquement accessible comme une variable globale portant ce même nom, sans même écrire `document.getElementById`. C'est ce que fait `Formation_details.js` avec `userName.textContent = ...` ou `logoutBtn.addEventListener(...)`, sans jamais les déclarer.

Ce raccourci fonctionne, mais il est considéré comme une mauvaise pratique dans du code professionnel (il rend le code plus difficile à suivre, et peut créer des conflits de noms). Dans ce tutoriel, je te montre les deux façons — sache reconnaître le raccourci si tu le vois dans le code existant, mais préfère `const x = document.getElementById("x");` explicite dans le code que **tu** écris.

### `addEventListener` et `event.preventDefault()`

Permet de réagir à une action de l'utilisateur (clic, soumission de formulaire...). `event.preventDefault()` empêche le comportement par défaut du navigateur — pour un formulaire, ça empêche le rechargement automatique de la page à la soumission, pour qu'on puisse gérer nous-mêmes ce qui se passe en JavaScript.

### `URLSearchParams`

Permet de lire les paramètres d'une URL du type `page.html?id=3`. Ici, `Formation_details.html?id=3` transporte l'identifiant du blog à afficher.

```js
const params = new URLSearchParams(window.location.search);
const postId = params.get("id"); // "3"
```

### `FileReader` et le base64

Pour afficher une image choisie par l'utilisateur (`<input type="file">`) sans avoir de serveur pour l'héberger, on la convertit en une longue chaîne de texte (base64) directement utilisable comme `src` d'une balise `<img>`.

```js
const reader = new FileReader();
reader.onload = (event) => {
  // event.target.result contient l'image encodée, utilisable comme src
};
reader.readAsDataURL(fichier);
```

C'est **asynchrone** : le code dans `reader.onload` ne s'exécute que lorsque la lecture du fichier est terminée, pas immédiatement après `readAsDataURL`.

### `escapeHtml` et la sécurité

Quand on affiche un texte tapé par un utilisateur (un commentaire, par exemple) avec `innerHTML`, il faut d'abord neutraliser tout code HTML qu'il aurait pu taper — sinon quelqu'un pourrait écrire `<script>...</script>` dans un commentaire et l'exécuter chez tous les visiteurs (une faille appelée **XSS**). L'astuce utilisée ici est simple et efficace :

```js
function escapeHtml(text) {
  const div = document.createElement("div");
  div.textContent = text;   // écrire du texte brut échappe automatiquement les caractères spéciaux
  return div.innerHTML;     // on relit le HTML, maintenant sécurisé
}
```

### L'API Modal de Bootstrap

```js
const modal = new bootstrap.Modal(document.getElementById("monModal"));
modal.show();     // ouvre le modal
// ...
bootstrap.Modal.getInstance(document.getElementById("monModal")).hide(); // le referme
```

`getInstance` récupère le modal déjà créé (par exemple par un bouton avec `data-bs-toggle="modal"`) au lieu d'en créer un second par erreur.

---

## 1. Structure du projet

```
index.html               <- page d'accueil (section "Our Team" avec les 4 comptes)
login.html + login.js     <- page et logique de connexion
Formation.html + Formation.js           <- liste des blogs (affichage, édition, suppression, création)
Formation_details.html + Formation_details.js  <- détail d'un blog + commentaires
style.css
```

Les "utilisateurs" et les "blogs" ne sont **jamais** stockés sur un serveur : tout vit dans le `localStorage` du navigateur, sous forme de texte JSON. C'est ce que le README appelle "utiliser le Local Storage comme simulateur de base de données".

---

## 2. Exercice N°1 — Gestion de la connexion

### 2.1 Créer les 4 comptes une seule fois (`login.js`)

Les 4 comptes doivent correspondre exactement aux 4 membres affichés dans "Our Team" sur `index.html` (mêmes noms, mêmes rôles) :

```js
// login.js
const users = [
  { nom: "Malika Malikatou", email: "malika.malikatou@example.com", role: "Specialiste Environnement", password: "123" },
  { nom: "Amir Amirou", email: "amir.amirou@example.com", role: "Specialiste en Viticulture", password: "456" },
  { nom: "Abdou Abdourahmane", email: "abdou.abdourahmane@example.com", role: "Specialiste en gestion des solset des eaux", password: "789" },
  { nom: "Leila Leilatou", email: "leila.leilatou@example.com", role: "Specialiste en Production Végétale", password: "abc" },
];

// S'il n'y a pas encore d'utilisateurs dans le Local Storage, alors on les crée.
// Ce test est essentiel : sans lui, à CHAQUE chargement de login.js on écraserait
// la liste stockée, effaçant au passage toute modification faite depuis (il n'y en a
// pas ici, mais c'est le même principe que pour les produits dans Pharm Inventory).
if (!localStorage.getItem("users")) {
  localStorage.setItem("users", JSON.stringify(users));
}
```

### 2.2 Le formulaire de connexion

Sur `login.html`, le formulaire a l'id `loginForm`, avec un champ email (`exampleInputEmail1`) et un champ mot de passe (`exampleInputPassword1`).

```js
const form = document.getElementById("loginForm");

form.addEventListener("submit", function (event) {
  // Empêche le rechargement automatique de la page à la soumission du formulaire.
  event.preventDefault();

  const email = document.getElementById("exampleInputEmail1").value;
  const password = document.getElementById("exampleInputPassword1").value;

  // Récupère les utilisateurs enregistrés
  const storedUsers = JSON.parse(localStorage.getItem("users"));

  // Cherche un utilisateur dont l'email ET le mot de passe correspondent EXACTEMENT
  const user = storedUsers.find(user => user.email === email && user.password === password);

  if (user) {
    // Connexion réussie : on enregistre CET utilisateur comme "connecté"
    localStorage.setItem("loggedInUser", JSON.stringify(user));
    // Redirection vers la suite du site
    window.location.href = "Formation.html";
  } else {
    alert("Email ou mot de passe incorrect.");
  }
});
```

> Pourquoi `localStorage.setItem("loggedInUser", ...)` en plus de `"users"` ? Parce que `"users"` est la liste de **tous** les comptes qui existent (comme une table d'utilisateurs), alors que `"loggedInUser"` ne contient **qu'un seul** utilisateur : celui actuellement connecté sur cet appareil. C'est cette deuxième clé que toutes les autres pages vont vérifier pour savoir "qui navigue en ce moment ?".

### 2.3 Afficher le nom + gérer la déconnexion (déjà fait sur `Formation.html`)

Sur `Formation.html`, la navbar contient :

```html
<span id="userName"></span>
<button id="logoutBtn" ...>Disconnect</button>
```

Et `Formation.js` fait ceci **au chargement du fichier** (pas dans une fonction séparée, directement en haut du script) :

```js
// Relit l'utilisateur connecté (ou null si personne n'est connecté)
const loggedInUser = JSON.parse(localStorage.getItem("loggedInUser"));

const userName = document.getElementById("userName");
const logoutBtn = document.getElementById("logoutBtn");

if (loggedInUser) {
  userName.textContent = "Hello, " + loggedInUser.nom;
} else {
  userName.textContent = "";
  logoutBtn.style.display = "none"; // pas de bouton Déconnexion si personne n'est connecté
}

logoutBtn.addEventListener("click", function () {
  localStorage.removeItem("loggedInUser"); // "oublie" qui était connecté
  window.location.href = "index.html";
});
```

### 2.4 ⚠️ À compléter toi-même : le même affichage sur `index.html`

C'est le principal morceau manquant dans le dépôt actuel : `index.html` a un bouton "Connect" fixe (ligne ~70), mais **aucun script** ne vérifie si un utilisateur est connecté sur cette page. Voici comment appliquer exactement le même principe qu'à l'étape 2.3 :

**HTML** — remplace le bouton "Connect" fixe :

```html
<!-- Avant -->
<button style="background-color: #1B3D14; width: 12em;" type="button"
    class="btn text-light rounded-pill btnvert"><a href="login.html"
        class="text-decoration-none text-light"> Connect <i class="fa-solid fa-arrow-right-to-bracket"></i></a></button>

<!-- Après -->
<div class="d-flex align-items-center gap-3">
    <span id="userName"></span>
    <a href="login.html" id="loginLink" class="btn text-light rounded-pill btnvert" style="background-color: #1B3D14; width: 12em;">
        Connect <i class="fa-solid fa-arrow-right-to-bracket"></i>
    </a>
    <button id="logoutBtn" style="width: 12em;" type="button" class="btn text-light rounded-pill bg-danger">
        Disconnect <i class="fa-solid fa-arrow-right-to-bracket"></i>
    </button>
</div>
```

On garde **les deux** éléments (`loginLink` et `logoutBtn`) dans le HTML, et c'est le script qui décide lequel afficher — exactement comme `d-none` cachait des blocs dans le projet précédent, sauf qu'ici on bascule `style.display` directement en JS.

**Nouveau fichier `auth.js`** (pour ne pas dupliquer ce code dans chaque page) :

```js
// auth.js — à inclure sur index.html (et toute autre page qui doit
// afficher l'état de connexion mais n'a pas déjà sa propre logique).

const loggedInUser = JSON.parse(localStorage.getItem("loggedInUser"));

const userName = document.getElementById("userName");
const logoutBtn = document.getElementById("logoutBtn");
const loginLink = document.getElementById("loginLink");

if (loggedInUser) {
  userName.textContent = "Hello, " + loggedInUser.nom;
  if (loginLink) loginLink.style.display = "none";
} else {
  userName.textContent = "";
  logoutBtn.style.display = "none";
}

logoutBtn.addEventListener("click", function () {
  localStorage.removeItem("loggedInUser");
  window.location.href = "index.html";
});
```

Ajoute `<script src="auth.js"></script>` juste avant `</body>` sur `index.html`, après le script de Bootstrap.

---

## 3. Exercice N°2 — Affichage, édition et suppression des blogs (`Formation.js`)

### 3.1 Le tableau de blogs et son enregistrement initial

Comme pour les utilisateurs, la liste de départ n'est enregistrée dans `localStorage` **qu'une seule fois** :

```js
const blogs = [
  {
    id: 1,
    titre: "Lorem dolor",
    categorie: "Jardinage",
    auteur: "malika.malikatou@example.com", // email de l'auteur, pas son nom
    date: "10/08/2020",
    image: "images/cardimg5.jpg",
    commentaires: 7,
    description: "Lorem ipsum dolor sit amet...",
  },
  // ... 9 autres blogs
];

if (!localStorage.getItem("blogs")) {
  localStorage.setItem("blogs", JSON.stringify(blogs));
}
```

> Pourquoi stocker l'**email** de l'auteur (`auteur: "malika.malikatou@example.com"`) et pas son nom ? Parce que l'email est unique et stable pour chaque compte (`loggedInUser.email`), alors que si deux personnes s'appelaient pareil, comparer les noms donnerait de faux positifs. Comparer des emails est plus fiable pour savoir "est-ce que CET utilisateur connecté est bien l'auteur de CE blog ?".

### 3.2 "Réparer" automatiquement une donnée incomplète

Avant d'afficher un blog, on passe chaque entrée dans une fonction qui comble les champs manquants — utile si un blog a été mal formé lors d'un ajout précédent, ou si tu changes la structure des données plus tard :

```js
const DESCRIPTION_PAR_DEFAUT = "Lorem ipsum dolor sit amet consectetur adipisicing elit...";

function nettoyerBlog(blog) {
  return {
    id: blog && blog.id ? blog.id : Date.now() + Math.random(),
    titre: (blog && blog.titre) || "Sans titre",
    categorie: (blog && blog.categorie) || "Jardinage",
    auteur: (blog && blog.auteur) || "inconnu@example.com",
    date: (blog && blog.date) || new Date().toLocaleDateString(),
    image: (blog && blog.image) || "images/logo.png",
    commentaires: blog && typeof blog.commentaires === "number" ? blog.commentaires : 0,
    description: (blog && blog.description) || DESCRIPTION_PAR_DEFAUT,
  };
}
```

`(blog && blog.titre) || "Sans titre"` se lit ainsi : "si `blog` existe ET a un `titre`, utilise ce titre ; sinon, utilise 'Sans titre'". C'est un raccourci très courant en JavaScript pour donner une valeur par défaut.

### 3.3 Afficher les cartes de blog

```js
const loggedInUser = JSON.parse(localStorage.getItem("loggedInUser"));
const blogContainer = document.getElementById("blogsContainer");

function formaterDate(dateStr) {
  // Sécurité : si un blog n'a pas de date valide, on affiche un placeholder
  // au lieu de faire planter tout l'affichage.
  if (!dateStr || typeof dateStr !== "string" || !dateStr.includes("/")) {
    return { jour: "--", moisAnnee: "--/----" };
  }
  const [jour, mois, annee] = dateStr.split("/");
  return { jour, moisAnnee: `${mois}/${annee}` };
}

function afficherBlogs() {
  blogContainer.innerHTML = "";

  // On relit et "répare" chaque blog, puis on réenregistre la version propre
  // (la réparation devient donc permanente, pas juste temporaire à l'affichage).
  const storedBlogs = JSON.parse(localStorage.getItem("blogs")).map(nettoyerBlog);
  localStorage.setItem("blogs", JSON.stringify(storedBlogs));

  storedBlogs.forEach((blog) => {
    const blogCard = document.createElement("div");
    blogCard.classList.add("col-md-4", "mb-4", "CARD1");

    const { jour, moisAnnee } = formaterDate(blog.date);

    blogCard.innerHTML = `
      <div class="card border-0 rounded-4 overflow-hidden position-relative shadow-sm">
        <div class="position-relative">
          <img src="${blog.image}" class="card-img-top" alt="${blog.titre}">

          ${loggedInUser ? `
            <button class="card-icon-btn edit-btn" data-id="${blog.id}" title="Editer">
              <i class="fa-solid fa-pen"></i>
            </button>
            <button class="card-icon-btn delete-btn" data-id="${blog.id}" title="Supprimer">
              <i class="fa-solid fa-trash"></i>
            </button>
          ` : ""}

          <div class="date-badge">
            <span class="day">${jour}</span>
            <span class="month">${moisAnnee}</span>
          </div>
        </div>

        <div class="card-body text-center">
          <p class="text-success fw-semibold">${blog.categorie}</p>
          <h5 class="card-title">${blog.titre}</h5>
          <p class="small mb-1 text-muted">${blog.auteur}</p>
          <p class="card-text">${blog.description}</p>
          <div>
            <span style="font-size: small;">
              <i class="fa-regular fa-comment-dots"></i> ${blog.commentaires} comments
            </span>
          </div><br>
          <button type="button" class="btn rounded-pill text-light p-2" style="background-color: #173610; width: 10em;">
            <a href="Formation_details.html?id=${blog.id}" class="text-decoration-none text-light">
              Voir plus <i class="fa-solid fa-arrow-up-right-from-square"></i>
            </a>
          </button>
        </div>
      </div>
    `;

    blogContainer.appendChild(blogCard);
  });

  activerBoutons();
}
```

> **Point clé de l'exercice** : `${loggedInUser ? "...boutons..." : ""}` est la ligne qui répond exactement à la consigne *"Une fois un utilisateur connecté, il doit voir les boutons Éditer et Supprimer apparaître sur les blogs"*. Si `loggedInUser` est `null` (personne connecté), le morceau de HTML des boutons n'est même pas généré.

### 3.4 Réattacher les clics à chaque affichage

Comme `afficherBlogs()` recrée **toutes** les cartes à chaque appel (pour rester synchronisé avec les données), les anciens boutons "Éditer"/"Supprimer" sont détruits et recréés — il faut donc réattacher un `addEventListener` sur les nouveaux à chaque fois :

```js
let blogASupprimer = null; // mémorise quel blog est visé, entre le clic et la confirmation

function activerBoutons() {
  document.querySelectorAll(".delete-btn").forEach((button) => {
    button.addEventListener("click", () => {
      blogASupprimer = Number(button.dataset.id);
      new bootstrap.Modal(document.getElementById("deleteModal")).show();
    });
  });

  document.querySelectorAll(".edit-btn").forEach((button) => {
    button.addEventListener("click", () => {
      ouvrirModalEdition(Number(button.dataset.id));
    });
  });
}
```

### 3.5 Confirmer la suppression

Le bouton de confirmation vit **dans le modal**, donc en dehors de `blogsContainer` — il n'est jamais recréé par `afficherBlogs()`. On attache donc son écouteur **une seule fois**, ailleurs dans le script (pas dans `activerBoutons()`, sinon on empilerait plusieurs écouteurs identiques à chaque rafraîchissement) :

```js
document.getElementById("confirmDelete").addEventListener("click", () => {
  let blogs = JSON.parse(localStorage.getItem("blogs"));

  // Garde tous les blogs SAUF celui qu'on vient de confirmer
  blogs = blogs.filter((blog) => blog.id !== blogASupprimer);

  localStorage.setItem("blogs", JSON.stringify(blogs));
  bootstrap.Modal.getInstance(document.getElementById("deleteModal")).hide();
  blogASupprimer = null;

  afficherBlogs(); // réaffiche la liste sans le blog supprimé
});
```

### 3.6 Éditer un blog

```html
<!-- Modal d'édition (Formation.html) -->
<p id="authorMessage" class="text-danger fw-bold text-center mb-4"></p>
<input type="hidden" id="editId">
<input type="text" id="editTitre" class="form-control">
<select id="editCategorie" class="form-select">
    <option>Jardinage</option>
    <option>Contre-Saison</option>
    <option>Élevage</option>
</select>
<textarea id="editDescription" class="form-control"></textarea>
<button id="saveBlog" class="btn btn-success px-4">Sauvegarder</button>
```

```js
function ouvrirModalEdition(blogId) {
  const blogs = JSON.parse(localStorage.getItem("blogs"));
  const blog = blogs.find((blog) => blog.id === blogId);

  document.getElementById("editId").value = blog.id;
  document.getElementById("editTitre").value = blog.titre;
  document.getElementById("editCategorie").value = blog.categorie;
  document.getElementById("editDescription").value = blog.description;

  // C'est ici que répond la consigne : "il devra être affiché si l'utilisateur
  // actuel est l'auteur du blog ou non" — à titre indicatif seulement,
  // l'édition reste possible même si ce n'est pas son article.
  const authorMessage = document.getElementById("authorMessage");
  if (loggedInUser && loggedInUser.email === blog.auteur) {
    authorMessage.textContent = "Vous êtes l'auteur de ce blog";
  } else {
    authorMessage.textContent = "Vous n'êtes pas l'auteur de ce blog";
  }

  new bootstrap.Modal(document.getElementById("editBlogModal")).show();
}

document.getElementById("saveBlog").addEventListener("click", function () {
  const blogId = Number(document.getElementById("editId").value);
  const nouveauTitre = document.getElementById("editTitre").value;
  const nouvelleCategorie = document.getElementById("editCategorie").value;
  const nouvelleDescription = document.getElementById("editDescription").value;

  let blogs = JSON.parse(localStorage.getItem("blogs"));
  const index = blogs.findIndex((blog) => blog.id === blogId);

  if (index !== -1) {
    // On modifie SEULEMENT les champs éditables (auteur et image restent inchangés).
    blogs[index].titre = nouveauTitre;
    blogs[index].categorie = nouvelleCategorie;
    blogs[index].description = nouvelleDescription;

    localStorage.setItem("blogs", JSON.stringify(blogs));
    afficherBlogs();
    bootstrap.Modal.getInstance(document.getElementById("editBlogModal")).hide();
  }
});
```

---

## 4. Exercice N°3 — Création d'un blog

### 4.1 Le formulaire d'ajout

```html
<button class="btn rounded-pill px-4 text-white" style="background:#1B5E20"
    data-bs-toggle="modal" data-bs-target="#addBlogModal">
    Ajouter un article
</button>

<!-- Modal (id="addBlogModal") -->
<input id="addTitre" class="form-control">
<select id="addCategorie" class="form-select">
    <option>Jardinage</option>
    <option>Contre-Saison</option>
    <option>Élevage</option>
</select>
<input type="file" id="addImage" class="form-control" accept="image/*">
<textarea id="addDescription" rows="6" class="form-control"></textarea>
<button id="confirmAddBlog" class="btn btn-success">Confirmer</button>
```

> **⚠️ À corriger toi-même** : dans le dépôt actuel, ce bouton "Ajouter un article" est **toujours visible**, même pour un visiteur non connecté — ce qui contredit la consigne *"Une fois un utilisateur connecté, il doit voir le bouton Ajouter un blog"*, et provoquerait une erreur si un visiteur non connecté l'utilisait (`loggedInUser.email` planterait puisque `loggedInUser` vaudrait `null`). Corrige ça en encadrant le bouton avec la même condition que pour Éditer/Supprimer :
>
> ```html
> <div id="addBlogButtonWrapper" style="display: none;">
>     <button class="btn rounded-pill px-4 text-white" style="background:#1B5E20"
>         data-bs-toggle="modal" data-bs-target="#addBlogModal">
>         Ajouter un article
>     </button>
> </div>
> ```
>
> ```js
> // Juste après avoir récupéré loggedInUser, en haut du script :
> if (loggedInUser) {
>   document.getElementById("addBlogButtonWrapper").style.display = "block";
> }
> ```

### 4.2 Enregistrer le nouveau blog

```js
const saveNewBlog = document.getElementById("confirmAddBlog");

saveNewBlog.addEventListener("click", function () {
  const titre = document.getElementById("addTitre").value;
  const categorie = document.getElementById("addCategorie").value;
  const description = document.getElementById("addDescription").value.trim() || DESCRIPTION_PAR_DEFAUT;

  const imageInput = document.getElementById("addImage");
  const fichierImage = imageInput.files[0];

  // Fonction séparée, car la lecture d'un fichier est asynchrone : on ne peut
  // enregistrer le blog qu'une fois cette lecture terminée.
  function enregistrerNouveauBlog(cheminImage) {
    let blogs = JSON.parse(localStorage.getItem("blogs"));

    const nouveauBlog = {
      id: Date.now(), // un timestamp est un id "unique" simple, sans calcul compliqué
      titre: titre,
      categorie: categorie,
      auteur: loggedInUser.email, // l'auteur est automatiquement l'utilisateur connecté
      date: new Date().toLocaleDateString(),
      image: cheminImage,
      commentaires: 0, // un nouvel article démarre toujours sans commentaire
      description: description,
    };

    blogs.push(nouveauBlog);
    localStorage.setItem("blogs", JSON.stringify(blogs));
    afficherBlogs();
    bootstrap.Modal.getInstance(document.getElementById("addBlogModal")).hide();

    // On vide le formulaire pour la prochaine fois
    document.getElementById("addTitre").value = "";
    document.getElementById("addCategorie").value = "";
    document.getElementById("addDescription").value = DESCRIPTION_PAR_DEFAUT;
    imageInput.value = "";
  }

  if (fichierImage) {
    // Une image a été choisie : on la convertit en base64.
    const reader = new FileReader();
    reader.onload = function (event) {
      enregistrerNouveauBlog(event.target.result);
    };
    reader.readAsDataURL(fichierImage);
  } else {
    // Pas d'image choisie : on utilise une image par défaut.
    enregistrerNouveauBlog("images/logo.png");
  }
});
```

`titre`, `categorie`, `description`, `imageInput` et `fichierImage` sont lus **avant** le `if (fichierImage)`, alors que `enregistrerNouveauBlog` peut être appelée de façon asynchrone (après la lecture du fichier) — c'est pour ça que ces variables doivent être capturées tout en haut, sinon elles ne seraient plus accessibles au moment où `reader.onload` s'exécute enfin.

---

## 5. Exercice N°4 — Commentaires (`Formation_details.html` + `Formation_details.js`)

### 5.1 Savoir quel blog on regarde

```js
const params = new URLSearchParams(window.location.search);
const postId = params.get("id") || "default";

// Une clé de stockage DIFFÉRENTE pour chaque article, ex: "comments_3" pour le blog n°3.
// C'est ce qui garantit que "chaque commentaire ne doit s'afficher que sur le blog
// où il a été publié" — deux blogs ne partagent jamais la même clé.
const commentsKey = "comments_" + postId;
```

### 5.2 Afficher le contenu de l'article

```js
function getBlogActuel() {
  const stored = localStorage.getItem("blogs");
  if (!stored) return null;
  const blogs = JSON.parse(stored);

  // On compare en texte (String(...)) des deux côtés : l'id dans l'URL est
  // toujours une chaîne de caractères, alors que l'id d'un blog peut être
  // un nombre — sans cette conversion, la comparaison échouerait à tort.
  return blogs.find((blog) => String(blog.id) === String(postId)) || null;
}

function afficherDetailsBlog() {
  const blog = getBlogActuel();
  if (!blog) return; // id invalide : on laisse le contenu par défaut du HTML

  document.getElementById("detailImage").src = blog.image;
  document.getElementById("detailTitre").textContent = blog.titre;
  document.getElementById("detailAuteurDate").textContent = "By " + blog.auteur + " | Published on " + blog.date;
  document.getElementById("detailDescription").textContent = blog.description;
  document.getElementById("detailCategorie").textContent = blog.categorie;
}
```

### 5.3 Charger / sauvegarder les commentaires de CET article

```js
const defaultComments = [
  { auteur: "Mariam", email: "mariam76@example.com", texte: "Merci du partage", date: "2025-12-01T06:14:53" }
];

function getComments() {
  const stored = localStorage.getItem(commentsKey);
  if (stored) return JSON.parse(stored);

  // Première visite sur cet article : on installe un commentaire de démo.
  localStorage.setItem(commentsKey, JSON.stringify(defaultComments));
  return defaultComments;
}

function saveComments(comments) {
  localStorage.setItem(commentsKey, JSON.stringify(comments));
}
```

### 5.4 Afficher la liste + le compteur toujours à jour

```js
function formatDate(isoString) {
  const d = new Date(isoString);
  const pad = (n) => String(n).padStart(2, "0"); // ajoute un 0 devant si besoin (5 -> "05")
  return pad(d.getDate()) + "/" + pad(d.getMonth() + 1) + "/" + d.getFullYear() +
    " " + pad(d.getHours()) + "." + pad(d.getMinutes()) + "." + pad(d.getSeconds());
}

function renderComments() {
  const comments = getComments();
  const commentsList = document.getElementById("commentsList");
  commentsList.innerHTML = "";

  comments.forEach(function (comment) {
    const card = document.createElement("div");
    card.className = "card mt-3 w-75";
    card.innerHTML =
      '<div class="card-body">' +
      '<div class="d-flex justify-content-between">' +
      '<span><strong>' + escapeHtml(comment.auteur) + '</strong> (' + escapeHtml(comment.email) + ')</span>' +
      '</div>' +
      '<div class="mt-3"><span class="small">' + formatDate(comment.date) + '</span></div>' +
      '<span class="small">' + escapeHtml(comment.texte) + '</span>' +
      '</div>';
    commentsList.appendChild(card);
  });

  document.getElementById("commentTitle").textContent = "Comments (" + comments.length + ")";

  // Répond à la consigne : "l'affichage du nombre total de commentaires
  // doit rester toujours à jour" — y compris sur la carte du blog dans
  // Formation.html, qu'on met donc à jour ici aussi.
  synchroniserCompteurCommentaires(comments.length);
}

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
```

### 5.5 Le formulaire d'ajout (connecté OU invité)

```html
<p id="commentAsLoggedIn" class="small text-muted mb-2" style="display: none;"></p>
<div class="row g-2" id="guestFields">
    <input type="text" id="commentName" class="form-control" placeholder="Your Name">
    <input type="email" id="commentEmail" class="form-control" placeholder="Your Email">
</div>
<textarea id="commentText" class="form-control"></textarea>
<button type="button" id="submitComment" class="btn rounded-pill text-light p-2">Publier</button>
```

```js
function setupCommentForm() {
  const guestFields = document.getElementById("guestFields");
  const loggedInLabel = document.getElementById("commentAsLoggedIn");

  if (loggedInUser) {
    // Connecté : on cache les champs nom/email (déjà connus) et on
    // affiche juste un rappel de qui commente.
    guestFields.style.display = "none";
    loggedInLabel.style.display = "block";
    loggedInLabel.textContent = "Vous commentez en tant que " + loggedInUser.nom;
  }
  // Non connecté : les champs nom/email restent visibles (comportement par défaut du HTML).

  document.getElementById("submitComment").addEventListener("click", addComment);
}

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
    // Répond à la consigne : "Connecté ou non, il sera possible de
    // faire des commentaires" — un invité doit juste donner son nom/email.
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
  comments.push({ auteur, email, texte, date: new Date().toISOString() });
  saveComments(comments);
  renderComments(); // réaffiche la liste ET met à jour le compteur automatiquement

  commentText.value = "";
}
```

`{ auteur, email, texte, date: new Date().toISOString() }` est une écriture raccourcie : quand le nom de la propriété est identique au nom de la variable (`auteur: auteur`), on peut juste écrire `auteur`.

### 5.6 Tout lancer au chargement de la page

```js
document.addEventListener("DOMContentLoaded", function () {
  afficherDetailsBlog();
  renderComments();
  setupCommentForm();
});
```

---

## 6. Ordre d'implémentation conseillé

1. **`login.js`** — sans comptes ni connexion, rien d'autre n'a de sens
2. **Affichage de l'état connecté sur `Formation.html`** (déjà là) **puis sur `index.html`** (à ajouter, voir §2.4)
3. **`Formation.js`** — affichage des blogs, puis édition, puis suppression
4. **Création de blog** (§4) — corrige au passage la visibilité du bouton pour les visiteurs non connectés
5. **`Formation_details.js`** — détail de l'article, puis commentaires

## 7. Checklist finale

- [ ] Les 4 comptes de "Our Team" se connectent bien via `login.html` avec leur email + mot de passe
- [ ] Le nom de l'utilisateur connecté apparaît près du bouton Déconnexion, **sur `index.html` ET sur `Formation.html`**
- [ ] Se déconnecter fait disparaître le nom et réaffiche le lien de connexion
- [ ] Les boutons Éditer/Supprimer n'apparaissent sur les blogs QUE pour un utilisateur connecté
- [ ] Le modal d'édition indique bien si l'utilisateur connecté est l'auteur du blog ou non
- [ ] Le bouton "Ajouter un article" n'apparaît QUE pour un utilisateur connecté (à corriger, voir §4.1)
- [ ] Un nouveau blog affiche bien sa date de création et son auteur (l'utilisateur connecté)
- [ ] Un commentaire peut être posté connecté OU non connecté
- [ ] Chaque commentaire n'apparaît que sur le blog où il a été posté (jamais sur un autre)
- [ ] Le nombre de commentaires affiché reste à jour après chaque ajout, y compris sur la carte du blog dans `Formation.html`

---

Si un mot de vocabulaire du code te bloque en avançant (`URLSearchParams`, `FileReader`, `escapeHtml`, `findIndex`...), redemande-moi une explication précise sur ce mot-là plutôt que de tout relire d'un coup.
