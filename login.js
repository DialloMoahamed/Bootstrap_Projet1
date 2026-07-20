// Table des utilisateurs
const users = [
    {
        nom: "Malika Malikatou",
        email: "malika.malikatou@example.com",
        role: "Specialiste Environnement",
        password: "123"
    },
    {
        nom: "Amir Amirou",
        email: "amir.amirou@example.com",
        role: "Specialiste en Viticulture",
        password: "456"
    },
    {
        nom: "Abdou Abdourahmane",
        email: "abdou.abdourahmane@example.com",
        role: "Specialiste en gestion des solset des eaux",
        password: "789"
    },
    {
        nom: "Leila Leilatou",
        email: "leila.leilatou@example.com",
        role: "Specialiste en Production Végétale",
        password: "abc"
    },
];


// S'il n'y a pas encore d'utilisateurs dans le Local Storage, alors je les crée.
if (!localStorage.getItem("users")) {
    localStorage.setItem("users", JSON.stringify(users));
}

const form = document.getElementById("loginForm");
form.addEventListener("submit", function (event) {
    event.preventDefault();

    const email = document.getElementById("exampleInputEmail1").value;
    const password = document.getElementById("exampleInputPassword1").value;

    // Récupérer les utilisateurs depuis le Local Storage
    const storedUsers = JSON.parse(localStorage.getItem("users"));

    // Vérifier si l'utilisateur existe et si le mot de passe est correct
    const user = storedUsers.find(user => user.email === email && user.password === password);

    if (user) {
        // Stocker l'utilisateur connecté dans le Local Storage
        localStorage.setItem("loggedInUser", JSON.stringify(user));
        // Rediriger vers la page d'accueil ou une autre page
        window.location.href = "Formation.html";
    } else {
        alert("Email ou mot de passe incorrect.");
    }
});