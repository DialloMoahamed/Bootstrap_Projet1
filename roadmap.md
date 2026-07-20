
1. Créer les 4 utilisateurs

Crée les quatre comptes correspondant aux membres affichés dans la section Our Team de la page d'accueil. Chaque utilisateur doit contenir au minimum son nom, son rôle, un email et un mot de passe.

2. Les enregistrer une seule fois

Au chargement du site, vérifie si les utilisateurs existent déjà dans le Local Storage. S'ils n'existent pas, enregistre les quatre comptes. S'ils sont déjà présents, ne les recrée pas.

3. Préparer le formulaire de connexion

Récupère les informations que l'utilisateur saisit dans le formulaire de connexion, c'est-à-dire son email et son mot de passe.

4. Lire les utilisateurs enregistrés

Lorsque l'utilisateur clique sur Se connecter, récupère la liste des utilisateurs enregistrés dans le Local Storage.

5. Rechercher l'utilisateur

Parcours la liste des utilisateurs et cherche celui dont l'email et le mot de passe correspondent exactement aux informations saisies.

6. Vérifier le résultat

Si un utilisateur est trouvé, la connexion est réussie.

Si aucun utilisateur n'est trouvé, affiche un message indiquant que l'email ou le mot de passe est incorrect.

7. Enregistrer l'utilisateur connecté

Après une connexion réussie, enregistre les informations de l'utilisateur connecté dans le Local Storage afin que le site puisse savoir qui est actuellement connecté.

8. Rediriger vers la page d'accueil

Une fois la connexion validée, envoie automatiquement l'utilisateur vers la page d'accueil.

9. Vérifier si un utilisateur est connecté

À chaque ouverture de la page d'accueil, vérifie si un utilisateur connecté est enregistré dans le Local Storage.

10. Afficher son nom

Si un utilisateur est connecté, affiche son nom à côté du bouton Déconnexion.

Si personne n'est connecté, affiche simplement le bouton Connexion.

11. Gérer la déconnexion

Lorsque l'utilisateur clique sur Déconnexion, supprime les informations de l'utilisateur connecté du Local Storage.

12. Mettre à jour l'affichage

Après la déconnexion, actualise la page ou remets l'interface dans son état initial afin que le bouton Connexion réapparaisse et que le nom de l'utilisateur disparaisse.

En suivant ces 12 étapes dans cet ordre, tu construiras progressivement tout le système de connexion sans avoir besoin d'une base de données ni d'un serveur.
