dans script.js
class CasinoInterface {
    constructor() {
        //Loader
        this.loadingElement = document.getElementById('loading');

        this.balance = 0;
        this.bet = null;

        // Roulette Elements
        this.spinButton = document.getElementById('spinButton');
        this.betButton = document.getElementById('betButton');
        this.resultDiv = document.getElementById('result');
        this.canvas = document.getElementById('wheelCanvas');
        this.context = this.canvas.getContext('2d');
        this.numbers = Array.from({ length: 38 }, (_, i) => i);
        this.colors = ['red', 'black'];
        this.moneyElement = document.getElementById('money');

        // Menu Buttons
        this.createAccountButton = document.getElementById('createAccountButton');
        this.loginButton = document.getElementById('loginButton');
        this.depositButton = document.getElementById('depositButton');
        this.withdrawButton = document.getElementById('withdrawButton');

        // Popups
        this.createAccountPopup = document.getElementById('createAccountPopup');
        this.loginPopup = document.getElementById('loginPopup');
        this.depositPopup = document.getElementById('depositPopup');
        this.withdrawPopup = document.getElementById('withdrawPopup');

        // Popup Inputs
        this.registerNom = document.getElementById('registerNom');
        this.registerPrenom = document.getElementById('registerPrenom');
        this.registerCIN = document.getElementById('registerCIN');
        this.registerTelephone = document.getElementById('registerTelephone');
        this.registerEmail = document.getElementById('registerEmail');
        this.registerMotDePasse = document.getElementById('registerMotDePasse');
        this.registerCodeSecret = document.getElementById('registerCodeSecret');
        this.loginEmail = document.getElementById('loginEmail');
        this.loginMotDePasse = document.getElementById('loginMotDePasse');
        this.depositAmount = document.getElementById('depositAmount');
        this.withdrawAmount = document.getElementById('withdrawAmount');

        // Popup Buttons
        this.registerSubmit = document.getElementById('registerSubmit');
        this.closeRegisterPopup = document.getElementById('closeRegisterPopup');
        this.loginSubmit = document.getElementById('loginSubmit');
        this.closeLoginPopup = document.getElementById('closeLoginPopup');
        this.depositSubmit = document.getElementById('depositSubmit');
        this.closeDepositPopup = document.getElementById('closeDepositPopup');
        this.withdrawSubmit = document.getElementById('withdrawSubmit');
        this.closeWithdrawPopup = document.getElementById('closeWithdrawPopup');

        // Event Listeners
        this.spinButton.addEventListener('click', () => this.spin());
        this.betButton.addEventListener('click', () => this.placeBet());

        this.createAccountButton.addEventListener('click', () => this.showPopup(this.createAccountPopup));
        this.loginButton.addEventListener('click', () => this.showPopup(this.loginPopup));
        this.depositButton.addEventListener('click', () => this.showPopup(this.depositPopup));
        this.withdrawButton.addEventListener('click', () => this.showPopup(this.withdrawPopup));

        this.registerSubmit.addEventListener('click', () => this.createAccount());
        this.closeRegisterPopup.addEventListener('click', () => this.hidePopup(this.createAccountPopup));

        this.loginSubmit.addEventListener('click', () => this.login());
        this.closeLoginPopup.addEventListener('click', () => this.hidePopup(this.loginPopup));

        this.depositSubmit.addEventListener('click', () => this.depositMoney());
        this.closeDepositPopup.addEventListener('click', () => this.hidePopup(this.depositPopup));

        this.withdrawSubmit.addEventListener('click', () => this.withdrawMoney());
        this.closeWithdrawPopup.addEventListener('click', () => this.hidePopup(this.withdrawPopup));

        this.loadBalance();
        this.drawWheel();
    }

    showPopup(popup) {
        popup.style.display = 'flex';
    }

    hidePopup(popup) {
        popup.style.display = 'none';
    }

    drawWheel() {
        const radius = this.canvas.width / 2;
        const angle = (2 * Math.PI) / this.numbers.length;
        this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
        this.numbers.forEach((number, index) => {
            this.context.beginPath();
            this.context.moveTo(radius, radius);
            this.context.arc(radius, radius, radius, index * angle, (index + 1) * angle);
            this.context.fillStyle = this.colors[index % 2];
            this.context.fill();
            this.context.stroke();

            this.context.save();
            this.context.translate(radius, radius);
            this.context.rotate((index + 0.5) * angle);
            this.context.textAlign = "center";
            this.context.fillStyle = "white";
            this.context.fillText(number, radius - 30, 10);
            this.context.restore();

            this.hideLoading();
        });
    }

    showLoading() {
        this.loadingElement.classList.remove('d-none');
    }

    hideLoading() {
        this.loadingElement.classList.add('d-none');
    }

    async spin() {
        //Petit chargement
        // this.showLoading();
        // this.hideLoading();
        const duration = Math.random() * 11000 + 4000; // Durée entre 4s et 15s
        const startTime = Date.now();
        const startAngle = 0;
        const endAngle = (Math.random() * 2 * Math.PI) + 10 * Math.PI; // Roue tournera au moins 5 tours

        const spinAnimation = () => {
            const currentTime = Date.now();
            const elapsedTime = currentTime - startTime;
            if (elapsedTime < duration) {
                const angle = startAngle + (endAngle - startAngle) * (elapsedTime / duration);
                this.context.save();
                this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
                this.context.translate(this.canvas.width / 2, this.canvas.height / 2);
                this.context.rotate(angle);
                this.context.translate(-this.canvas.width / 2, -this.canvas.height / 2);
                this.drawWheel();
                this.context.restore();
                requestAnimationFrame(spinAnimation);
            } else {
                const winningAngle = endAngle % (2 * Math.PI);
                const winningNumberIndex = Math.floor((winningAngle / (2 * Math.PI)) * this.numbers.length);
                const winningNumber = this.numbers[winningNumberIndex];
                this.displayResult(winningNumber);
                this.saveScore({ numero: winningNumber, montant: this.bet ? this.bet.amount : 0 });
                if (this.bet !== null && this.bet.number === winningNumber) {
                    const winnings = this.bet.amount * 2;
                    this.balance += winnings;
                    this.resultDiv.innerHTML += `<br>Vous avez gagné ${winnings} AR!`;
                } else if (this.bet !== null) {
                    this.resultDiv.innerHTML += `<br>Vous avez perdu ${this.bet.amount} AR!`;
                }
                this.updateBalance();
                this.bet = null;
            }
        };

        requestAnimationFrame(spinAnimation);
    }

    placeBet() {
        const number = prompt("Veuillez entrer votre mise (numéro entre 0 et 37) :");
        const amount = prompt("Veuillez entrer le montant de votre mise :");
        if (number !== null && !isNaN(number) && number >= 0 && number <= 37 &&
            amount !== null && !isNaN(amount) && amount > 0 && amount <= this.balance) {
            this.bet = { number: parseInt(number), amount: parseInt(amount) };
            this.balance -= this.bet.amount;
            this.updateBalance();
            this.resultDiv.innerHTML = `Vous avez misé ${this.bet.amount} AR sur le numéro : ${this.bet.number}`;
        } else {
            alert("Mise invalide ou solde insuffisant. Veuillez entrer un numéro entre 0 et 37 et un montant valide.");
        }
    }

    displayResult(numero) {
        this.resultDiv.innerHTML = `Le numéro gagnant est : <span style="background-color: blue; color: white;">${numero}</span>`;
    }

    async saveScore(score) {
        try {
            let response = await fetch('save_score.php', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(score)
            });

            let data = await response.json();
            if (data.status !== 'success') {
                console.error('Erreur lors de la sauvegarde du score');
            }
        } catch (error) {
            console.error('Erreur lors de la sauvegarde du score', error);
        }
    }

    async loadBalance() {
        try {
            //Nom récupérer l'utilisateur qui est connecter dans la session
            //Ajouter une méthode qui permet de vérifier si un utilisateur est connecter
            //Alors récupérer cette utilisateur dans une méthodes et récupérer tous ces informations nécessaires comme sont nom
            //Et que la balances est formater en format monetaire
            let nom = "Nari";
            let url = 'user.php?action=getBalance&username=' + nom;
            let response = await fetch(url);
            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }
            let data = await response.json();
            if (data.success === true) {
                this.balance = data.balance;
                this.updateBalance();
            } else {
                console.error('Erreur lors du chargement du solde');
            }
        } catch (error) {
            console.error('Erreur lors du chargement du solde', error);
        }
    }


    /**
     * Il ne reste plus qu'a formater les formulaires et ajouter un petit loader pour chaque action
     * @async méthode asynchrone pour la création d'un compte
     * 
     */
    async createAccount() {
        const nom = this.registerNom.value;
        const prenom = this.registerPrenom.value;
        const cin = this.registerCIN.value;
        const telephone = this.registerTelephone.value;
        const email = this.registerEmail.value;
        const motDePasse = this.registerMotDePasse.value;
        const codeSecret = this.registerCodeSecret.value;

        if (nom && prenom && cin && telephone && email && motDePasse && codeSecret) {
            try {
                let response = await fetch('user.php?action=register', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({
                        nom: nom,
                        prenom: prenom, // Nom de la variable correctement orthographié
                        cin: cin,
                        telephone: telephone,
                        email: email,
                        mot_de_passe: motDePasse, // Nom de la variable correctement orthographié
                        code_secret: codeSecret,
                        amount: 1000 // Par exemple, si vous voulez déposer un montant initial
                    })
                });

                let data = await response.json();
                if (data.status === 'success') {
                    this.hidePopup(this.createAccountPopup);
                    alert('Compte créé avec succès !');
                    //Enlever les valeurs dans les champs
                } else {
                    alert('Erreur lors de la création du compte');
                }
            } catch (error) {
                console.error('Erreur lors de la création du compte', error);
            }
        } else {
            alert('Veuillez remplir tous les champs');
        }
    }




    async login() {
        const email = this.loginEmail.value;
        const motDePasse = this.loginMotDePasse.value;

        if (email && motDePasse) {
            try {
                let response = await fetch('user.php?action=login', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({ email, motDePasse })
                });

                let data = await response.json();
                if (data.status === 'success') {
                    this.hidePopup(this.loginPopup);
                    alert('Connexion réussie !');
                    this.loadBalance();
                } else {
                    alert('Email ou mot de passe incorrect');
                }
            } catch (error) {
                console.error('Erreur lors de la connexion', error);
            }
        } else {
            alert('Veuillez remplir tous les champs');
        }
    }

    async depositMoney() {
        const amount = parseInt(this.depositAmount.value);
        //Recupération de l'utilisateur connecter pour permettre le déposite
        if (!isNaN(amount) && amount > 0) {
            try {
                let response = await fetch('user.php?action=deposite', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({ amount })
                });

                let data = await response.json();
                if (data.status === 'success') {
                    this.balance += amount;
                    this.updateBalance();
                    this.hidePopup(this.depositPopup);
                    alert('Dépôt réussi !');
                } else {
                    alert('Erreur lors du dépôt');
                }
            } catch (error) {
                console.error('Erreur lors du dépôt', error);
            }
        } else {
            alert('Veuillez entrer un montant valide');
        }
    }

    async withdrawMoney() {
        const amount = parseInt(this.withdrawAmount.value);
        if (!isNaN(amount) && amount > 0 && amount <= this.balance) {
            try {
                let response = await fetch('user.php?action=withdraw', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({
                        nom: "Nari",
                        amount: amount
                    })
                });

                let data = await response.json();
                if (data.status === 'success') {
                    this.balance -= amount;
                    this.updateBalance();
                    this.hidePopup(this.withdrawPopup);
                    alert('Retrait réussi !');
                } else {
                    alert('Erreur lors du retrait');
                }
            } catch (error) {
                console.error('Erreur lors du retrait', error);
            }
        } else {
            alert('Veuillez entrer un montant valide');
        }
    }

    updateBalance() {
        this.moneyElement.textContent = `${this.balance}`;
    }
}

document.addEventListener('DOMContentLoaded', () => {
    new CasinoInterface();
});


Améliorer le code et faire dans la partie loadBalance() ces principes la //Nom récupérer l'utilisateur qui est connecter dans la session
            //Ajouter une méthode qui permet de vérifier si un utilisateur est connecter
            //Alors récupérer cette utilisateur dans une méthodes et récupérer tous ces informations nécessaires comme sont nom
            //Et que la balances est formater en format monetaire
et bien documenter le codes et ajouter un loader pour chaque partie du code voici les autre codes

dans user.php
<?php
require 'connection.php';

header('Content-Type: application/json');

$action = $_GET['action'] ?? $_POST['action'];

switch ($action) {
    case 'register':
        register();
        break;
    case 'deposit':
        deposit();
        break;
    case 'withdraw':
        withdraw();
        break;
    case 'getBalance':
        getBalance();
        break;
    default:
        http_response_code(400);
        echo json_encode(['error' => 'Invalid action']);
        break;
}

function register()
{
    $data = json_decode(file_get_contents('php://input'), true);
    // Vérification de la présence des champs requis
    $requiredFields = ['nom', 'prenom', 'cin', 'telephone', 'email', 'mot_de_passe', 'code_secret', 'amount'];
    foreach ($requiredFields as $field) {
        if (empty($data[$field])) {
            http_response_code(400);
            echo json_encode(['error' => 'Veuillez remplir tous les champs']);
            return;
        }
    }

    $pdo = connect();

    $nom = htmlspecialchars($data['nom']);
    $prenom = htmlspecialchars($data['prenom']);
    $cin = htmlspecialchars($data['cin']);
    $telephone = htmlspecialchars($data['telephone']);
    $email = htmlspecialchars($data['email']);
    $motDePasse = htmlspecialchars($data['mot_de_passe']);
    $codeSecret = htmlspecialchars($data['code_secret']);
    $solde = htmlspecialchars($data['amount']);

    $hashedPassword = password_hash($motDePasse, PASSWORD_DEFAULT);
    $secret_hashed = password_hash($codeSecret, PASSWORD_DEFAULT);

    $stmt = $pdo->prepare("INSERT INTO users (nom, prenom, cin, telephone, email, mot_de_passe, code_secret, solde) 
                           VALUES (:nom, :prenom, :cin, :telephone, :email, :mot_de_passe, :code_secret, :solde)");

    $stmt->execute([
        'nom' => $nom,
        'prenom' => $prenom,
        'cin' => $cin,
        'telephone' => $telephone,
        'email' => $email,
        'mot_de_passe' => $hashedPassword,
        'code_secret' => $secret_hashed,
        'solde' => $solde
    ]);

    if ($stmt->rowCount() > 0) {
        echo json_encode(['status' => 'success']);
    } else {
        http_response_code(500);
        echo json_encode(['error' => 'Erreur lors de l\'enregistrement']);
    }
}
    //Coriger plus tard
function deposit()
{
    $data = json_decode(file_get_contents('php://input'), true);

    if (!isset($data['id']) || !isset($data['amount'])) {
        http_response_code(400);
        echo json_encode(['error' => 'Veuillez fournir un nom d\'utilisateur et un montant']);
        return;
    }

    $email = htmlspecialchars($data['email']);
    $amount = (float) $data['amount'];

    if ($amount <= 0) {
        http_response_code(400);
        echo json_encode(['error' => 'Le montant doit être supérieur à zéro']);
        return;
    }

    $pdo = connect();
    //erreur
    $stmt = $pdo->prepare("UPDATE users SET solde = solde + :amount WHERE   = :email");
    $stmt->execute(['amount' => $amount, 'email' => $email]);

    echo json_encode(['success' => true]);
}

function withdraw()
{
    $data = json_decode(file_get_contents('php://input'), true);

    if (!isset($data['nom']) || !isset($data['amount'])) {
        http_response_code(400);
        echo json_encode(['error' => 'Veuillez fournir un nom d\'utilisateur et un montant']);
        return;
    }

    $username = htmlspecialchars($data['nom']);
    $amount = (float) $data['amount'];

    if ($amount <= 0) {
        http_response_code(400);
        echo json_encode(['error' => 'Le montant doit être supérieur à zéro']);
        return;
    }

    $pdo = connect();

    // Vérifier que l'utilisateur a suffisamment de solde
    $stmt = $pdo->prepare("SELECT solde FROM users WHERE nom = :nom");
    $stmt->execute(['nom' => $username]);
    $balance = $stmt->fetchColumn();

    if ($balance === false) {
        http_response_code(404);
        echo json_encode(['error' => 'Utilisateur non trouvé']);
        return;
    }

    if ($balance < $amount) {
        http_response_code(400);
        echo json_encode(['error' => 'Solde insuffisant']);
        return;
    }

    $stmt = $pdo->prepare("UPDATE users SET solde = solde - :amount WHERE nom = :nom");
    $stmt->execute(['amount' => $amount, 'nom' => $username]);

    echo json_encode(['status' => 'success']);
}

function getBalance()
{
    $username = $_GET['username'] ?? '';

    if (empty($username)) {
        http_response_code(400);
        echo json_encode(['error' => 'Username non spécifié']);
        return;
    }

    $pdo = connect();

    $stmt = $pdo->prepare("SELECT solde FROM users WHERE nom = :nom");
    $stmt->execute(['nom' => $username]);

    $balance = $stmt->fetchColumn();

    if ($balance !== false) {
        echo json_encode(['balance' => $balance, 'success' => true]);
    } else {
        http_response_code(404);
        echo json_encode(['error' => 'Utilisateur non trouvé']);
    }
}
//Permet de connecter un utilisateur
function login()
{
    $email = $_GET['email'] ?? $_POST['email'];
    $password = $_GET['password'] ?? $_POST['password'];
}
Ajouter une méthode qui permet de ce connecter via un requete Ajax et sauvgarder l'utilisateur dans le session et un autre script pour vérifier si un utilisateur est stocker dans le session créer ensuite la relation qui permet de vérifier si un utilisateur est bien connecter dans la session ou pas eete recupérer cette personne dans le Js ajouter une autre nouveau class et lier le avec le class existant

voici dans le fichier index.php 
<!DOCTYPE html>
<html lang="fr">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Spin to win</title>
    <link rel="stylesheet" href="css/style.css">
    <link rel="stylesheet" href="vendor/bootstrap/css/bootstrap.min.css">
</head>
<body>
    <div class="menu">
        <div id="balance">Solde: <span id="money">0</span> AR</div>
        <button id="createAccountButton">Créer un Compte</button>
        <button id="loginButton">Se Connecter</button>
        <button id="depositButton">Déposer de l'Argent</button>
        <button id="withdrawButton">Retirer de l'Argent</button>
    </div>
    <div id="loading" class="d-none">Chargement...
        <div class="spinner-border text-primary" role="status">
            <span class="visually-hidden">Loading...</span>
        </div>
    </div>
    <div id="roulette">
        <canvas id="wheelCanvas" width="400" height="400"></canvas>
        <div>
            <button id="spinButton" class="spin">Lancer la Roue</button>
            <button id="betButton">Miser</button>
        </div>
        <div id="result"></div>
    </div>

    <div id="createAccountPopup" class="popup">
        <div class="popup-content">
            <h2>Créer un Compte</h2>
            <input type="text" id="registerNom" placeholder="Nom">
            <input type="text" id="registerPrenom" placeholder="Prénom">
            <input type="text" id="registerCIN" placeholder="CIN">
            <input type="text" id="registerTelephone" placeholder="Numéro de Téléphone">
            <input type="email" id="registerEmail" placeholder="Email">
            <input type="password" id="registerMotDePasse" placeholder="Mot de Passe">
            <input type="password" id="registerCodeSecret" placeholder="Code Secret">
            <button id="registerSubmit">S'inscrire</button>
            <button id="closeRegisterPopup" class="btn-fermer">Fermer</button>
        </div>
    </div>

    <div id="loginPopup" class="popup">
        <div class="popup-content">
            <h2>Se Connecter</h2>
            <input type="email" id="loginEmail" placeholder="Email">
            <input type="password" id="loginMotDePasse" placeholder="Mot de Passe">
            <button id="loginSubmit">Se Connecter</button>
            <button id="closeLoginPopup" class="btn-fermer">Fermer</button>
        </div>
    </div>

    <div id="depositPopup" class="popup">
        <div class="popup-content">
            <h2>Déposer de l'Argent</h2>
            <input type="number" id="depositAmount" placeholder="Montant">
            <button id="depositSubmit">Déposer</button>
            <button id="closeDepositPopup" class="btn-fermer">Fermer</button>
        </div>
    </div>

    <div id="withdrawPopup" class="popup">
        <div class="popup-content">
            <h2>Retirer de l'Argent</h2>
            <input type="number" id="withdrawAmount" placeholder="Montant">
            <button id="withdrawSubmit">Retirer</button>
            <button id="closeWithdrawPopup" class="btn-fermer">Fermer</button>
        </div>
    </div>
    <script src="vendor/bootstrap/js/bootstrap.min.js"></script>
    <script src="js/script.js"></script>
</body>
</html>
et voici celle dans le style.css 
body {
    font-family: Arial, sans-serif;
    background: #f0f0f0;
    text-align: center;
    margin: 0;
    padding: 0;
}

.menu {
    display: flex;
    justify-content: space-between;
    align-items: center;
    background: #fff;
    padding: 10px;
    box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
}

.menu button {
    margin: 5px;
    padding: 10px;
    font-size: 14px;
    cursor: pointer;
    background: #007BFF;
    color: #fff;
    border: none;
    border-radius: 5px;
    transition: background 0.3s;
}

.menu button:hover {
    background: #0056b3;
}




#balance {
    font-weight: bold;
}

#roulette {
    margin: 20px auto;
    text-align: center;
}

#wheelCanvas {
    margin: 20px auto;
    display: block;
    background: #fff;
    border-radius: 50%;
    box-shadow: 0 0 20px rgba(0, 0, 0, 0.2);
    max-width: 90%;
    height: auto;
}

#spinButton,
#betButton {
    margin: 10px;
    padding: 10px 20px;
    font-size: 16px;
    cursor: pointer;
    background: #007BFF;
    color: #fff;
    border: none;
    border-radius: 5px;
    transition: background 0.3s;
}

#spinButton:hover,
#betButton:hover {
    background: #0056b3;
}

#spinButton.spin {
    background: rgb(7, 126, 7);
    transition: background 0.3s;
}

#spinButton.spin:hover {
    background: green;
}

#result {
    margin: 20px;
    font-size: 20px;
    font-weight: bold;
}

.popup {
    display: none;
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: rgba(0, 0, 0, 0.5);
    justify-content: center;
    align-items: center;
    z-index: 1000;
}

.popup-content {
    background: #fff;
    width: 90%;
    max-width: 500px;
    padding: 20px;
    border-radius: 5px;
    text-align: left;
    box-shadow: 0 0 20px rgba(0, 0, 0, 0.3);
}

.popup-content input {
    display: block;
    width: 100%;
    margin: 10px 0;
    padding: 10px;
    box-sizing: border-box;
}

.popup-content button {
    padding: 10px 20px;
    cursor: pointer;
    background: #007BFF;
    color: #fff;
    border: none;
    border-radius: 5px;
    transition: background 0.3s;
}

.popup-content button:hover {
    background: #0056b3;
}

.popup-content .btn-fermer {
    background: rgb(196, 27, 27);
    transition: background 0.3s;
}

.popup-content .btn-fermer:hover {
    background: red;
}


@media (max-width: 600px) {
    .menu {
        flex-direction: column;
        align-items: stretch;
        padding: 10px;
    }

    .menu button {
        margin: 5px auto;
        width: 100%;
    }
}

#loading {
    text-align: center;
    font-size: 24px;
    padding: 20px;
} N'oublier pas bien documenter chaque partie du code avec la doc et séparer les class des deux Js en deux fichier différent