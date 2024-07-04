class CasinoInterface {
    constructor() {
        //Loader
        this.loadingElement = document.getElementById('loading');

        //user 
        this.user = [];


        this.balance = 0;
        this.bet = null;

        //Logout btn
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

        this.logoutBtn.addEventListener('click', () => this.logout());

        this.checkUserSession();
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
                    throw new Error(`HTTP error! Status: ${response.status}`);
                }
                let data = await response.json();
                if (data.success) {
                    this.balance = data.balance;
                    this.updateBalance();
                } else {
                    console.error('Erreur lors du chargement du solde');
                }
            } else {
                // Si c'est undifiend
                // console.log("Empty");
            }
        } catch (error) {
            console.error('Erreur lors du chargement du solde', error);
        } finally {
            this.hideLoading();
        }
    }


    //chek user connected
    async checkUserSession() {
        const token = CasinoInterface.getCookie('tokens');
        if (token) {
            let response = await fetch('user.php?action=checkSession', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    token: token,
                })
            });
            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }
            let data = await response.json();
            if (data == null) {
                console.log('Veuillez vous reconnecter');
            } else if (data.status == 'connecter') {
                console.log('valider');
                this.balance = data.balance;
                this.updateBalance();

                //boutton de connexion false
                this.loginButton.style.display = "none";
                //Boutton d'inscription à false
                this.createAccountButton.style.display = "none";
                //logout true
                this.logoutBtn.style.display = "block";
            } else {
                console.error('Erreur');
            }
        } else {
            console.log("Aucune token n'est trouver.")
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
                    this.registerNom.value = '';
                    this.registerPrenom.value = '';
                    this.registerCIN.value = '';
                    this.registerTelephone.value = '';
                    email.value = '';
                    this.registerMotDePasse.value = '';
                    this.registerCodeSecret.value = '';
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



    //Allow to login in our application
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
                    body: JSON.stringify({
                        email: email,
                        secret: motDePasse
                    })
                });

                let data = await response.json();
                if (data.status === 'connecter') {
                    this.hidePopup(this.loginPopup);
                    CasinoInterface.setCookie('tokens', data.tokens, 1);
                    alert('Connexion réussie !');
                    this.loadBalance();
                    this.checkUserSession();

                    //Vider les champ
                    this.loginEmail.value = '';
                    this.loginMotDePasse.value = '';
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

    //Allow to logout an user 
    //The proccess is by deleting cookies to logout
    async logout() {
        // const token = CasinoInterface.getCookie('tokens');
        CasinoInterface.eraseCookie('tokens');
        this.checkUserSession();
    }

    //Cookies
    static setCookie(name, value, days) {
        let expire = "";
        if (days) {
            let date = new Date();
            date.setTime(date.getTime() + (days * 24 * 60 * 60 * 1000));
            expire = ": expires=" + date.toUTCString();
        }
        document.cookie = name + "=" + (value || "") + expire + ": path=/";
    }

    static getCookie(name) {
        let nameEQ = name + "=";
        let ca = document.cookie.split(':');
        for (let i = 0; i < ca.length; i++) {
            let c = ca[i];
            while (c.charAt(0) == ' ') c = c.substring(1, c.length);
            if (c.indexOf(nameEQ) == 0) return c.substring(nameEQ.length, c.length);
        }
        return null;
    }

    //Suprimer cookies
    static eraseCookie(name) {
        document.cookie = name + '=, Max-Age=-99999999; path=/';
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
