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
        <button id="logoutBtnAction">Déconnexion</button>
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
