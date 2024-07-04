class CasinoInterface {
    constructor() {
        // Loader
        this.loadingElement = document.getElementById('loading');

        // User
        this.user = [];
        this.balance = 0;
        this.bet = null;

        // Buttons and Elements
        this.initElements();

        // Event Listeners
        this.addEventListeners();

        this.checkUserSession();
        this.loadBalance();
        this.drawWheel();
    }

    initElements() {
        this.logoutBtn = document.getElementById('logoutBtnAction');

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
    }

    addEventListeners() {
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

        this.logoutBtn.addEventListener('click', () => this.logout());
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
        if (!this.user) {
            console.error('Utilisateur non connecté');
            this.hideLoading();
            return;
        }

        try {
            if (this.user.nom != undefined) {
                let url = `user.php?action=getBalance&username=${this.user.nom}`;
                let response = await fetch(url);
                if (!response.ok) {
                    throw new Error('Erreur lors du chargement du solde');
                }

                let data = await response.json();
                this.balance = data.balance || 0;
                this.updateBalance();
                this.hideLoading();
            } else {
                console.error('Utilisateur non défini');
                this.hideLoading();
            }
        } catch (error) {
            console.error('Erreur lors du chargement du solde', error);
            this.hideLoading();
        }
    }

    updateBalance() {
        this.moneyElement.innerHTML = `${this.balance} AR`;
    }

    async checkUserSession() {
        try {
            let response = await fetch('user.php?action=checkSession');
            if (response.ok) {
                let data = await response.json();
                if (data.loggedIn) {
                    this.user = data.user;
                    this.balance = data.balance || 0;
                    this.updateBalance();
                } else {
                    this.user = [];
                }
            } else {
                throw new Error('Erreur lors de la vérification de la session utilisateur');
            }
        } catch (error) {
            console.error('Erreur lors de la vérification de la session utilisateur', error);
        }
    }

    async createAccount() {
        const nom = this.registerNom.value.trim();
        const prenom = this.registerPrenom.value.trim();
        const cin = this.registerCIN.value.trim();
        const telephone = this.registerTelephone.value.trim();
        const email = this.registerEmail.value.trim();
        const motDePasse = this.registerMotDePasse.value.trim();
        const codeSecret = this.registerCodeSecret.value.trim();

        if (!nom || !prenom || !cin || !telephone || !email || !motDePasse || !codeSecret) {
            alert('Veuillez remplir tous les champs.');
            return;
        }

        try {
            let response = await fetch('user.php?action=register', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ nom, prenom, cin, telephone, email, motDePasse, codeSecret })
            });

            let data = await response.json();
            if (data.status === 'success') {
                alert('Compte créé avec succès. Vous pouvez maintenant vous connecter.');
                this.hidePopup(this.createAccountPopup);
            } else {
                alert('Erreur lors de la création du compte. Veuillez réessayer.');
            }
        } catch (error) {
            console.error('Erreur lors de la création du compte', error);
        }
    }

    async login() {
        const email = this.loginEmail.value.trim();
        const motDePasse = this.loginMotDePasse.value.trim();

        if (!email || !motDePasse) {
            alert('Veuillez remplir tous les champs.');
            return;
        }

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
                this.user = data.user;
                this.balance = data.balance || 0;
                this.updateBalance();
                this.hidePopup(this.loginPopup);
                alert('Connexion réussie.');
            } else {
                alert('Erreur lors de la connexion. Veuillez réessayer.');
            }
        } catch (error) {
            console.error('Erreur lors de la connexion', error);
        }
    }

    async depositMoney() {
        const amount = this.depositAmount.value.trim();
        if (!amount || isNaN(amount) || amount <= 0) {
            alert('Veuillez entrer un montant valide.');
            return;
        }

        try {
            let response = await fetch('user.php?action=deposit', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ username: this.user.nom, amount: parseInt(amount) })
            });

            let data = await response.json();
            if (data.status === 'success') {
                this.balance += parseInt(amount);
                this.updateBalance();
                this.hidePopup(this.depositPopup);
                alert('Dépôt réussi.');
            } else {
                alert('Erreur lors du dépôt. Veuillez réessayer.');
            }
        } catch (error) {
            console.error('Erreur lors du dépôt', error);
        }
    }

    async withdrawMoney() {
        const amount = this.withdrawAmount.value.trim();
        if (!amount || isNaN(amount) || amount <= 0 || amount > this.balance) {
            alert('Veuillez entrer un montant valide.');
            return;
        }

        try {
            let response = await fetch('user.php?action=withdraw', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ username: this.user.nom, amount: parseInt(amount) })
            });

            let data = await response.json();
            if (data.status === 'success') {
                this.balance -= parseInt(amount);
                this.updateBalance();
                this.hidePopup(this.withdrawPopup);
                alert('Retrait réussi.');
            } else {
                alert('Erreur lors du retrait. Veuillez réessayer.');
            }
        } catch (error) {
            console.error('Erreur lors du retrait', error);
        }
    }

    async logout() {
        try {
            let response = await fetch('user.php?action=logout');
            if (response.ok) {
                this.user = [];
                this.balance = 0;
                this.updateBalance();
                alert('Déconnexion réussie.');
            } else {
                throw new Error('Erreur lors de la déconnexion');
            }
        } catch (error) {
            console.error('Erreur lors de la déconnexion', error);
        }
    }
}

document.addEventListener('DOMContentLoaded', () => {
    const casinoInterface = new CasinoInterface();
});
//Amenagemnt du code
