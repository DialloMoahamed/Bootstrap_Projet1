# Agritech App

## Description

Dans ce projet vous aurez à rajouter les fonctionnalités du projet Agritech en utilisant le **DOM** et le **Local Storage** de votre navigateur pour simuler un environnement réel.

## Objectifs

- Initiation à la modélisation de base de données en utilisant le Local Storage du navigateur comme simulateur de base de données.
- Apprentissage de la gestion de la connexion.

## Spécifications

- Respectez les directives de la vidéo et des exercices.

## Énoncés d'Exercice

### Exercice N°1 — Gestion de la connexion

- Dans votre base de données (Local Storage), vous devrez créer les 4 comptes des 4 membres présentés dans la section *Our Team* de la page d'accueil.
- Ces utilisateurs devront pouvoir se connecter via la page **Login**.
- Les utilisateurs connectés devront voir leur nom apparaître près du bouton *Se déconnecter* une fois connectés.
- Prenez soin de respecter les informations (nom et rôle) fournies pour les comptes sur la page d'accueil.

### Exercice N°2 — Gestion des blogs

- Une fois un utilisateur connecté, il doit voir les boutons **Éditer** et **Supprimer** apparaître sur les blogs.
- L'utilisateur pourra les utiliser pour modifier ou supprimer les blogs.
- Dans le modal d'édition des blogs, il devra être affiché si l'utilisateur actuel est l'auteur du blog ou non.

### Exercice N°3 — Création de blogs

- Une fois un utilisateur connecté, il doit voir le bouton **Ajouter un blog**.
- L'utilisateur pourra ainsi créer un blog.
- Une fois le blog créé, il devra afficher la date de sa création et son auteur, en plus des autres informations communes à tous les blogs.

### Exercice N°4 — Commentaires

- Connecté ou non, il sera possible de faire des commentaires sur les blogs.
- Chaque commentaire doit afficher son auteur et la date de sa création.
- L'affichage du nombre total de commentaires doit rester toujours à jour après l'ajout d'un commentaire.
- À noter que chaque commentaire ne doit s'afficher que sur le blog où il a été publié.
