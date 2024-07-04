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
    case 'login':
        login();
        break;
    case 'checkSession':
        checkUserSession();
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
    $username = $_GET['username'] ?? $_POST['username'];

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
    $data = json_decode(file_get_contents('php://input'), true);
    $email = $data['email'];
    $password = $data['secret'];

    $pdo = connect();
    try {
        $sql = "SELECT * FROM users WHERE email = :email ";
        $smtp = $pdo->prepare($sql);
        $smtp->bindParam(':email',$email);
        $smtp->execute();

        $user = $smtp->fetch(PDO::FETCH_ASSOC);
        //Verification des mots de passe
        if($user && password_verify($password, $user['mot_de_passe'])){
            $token = base64_encode(json_encode(['identification' => $user['id'], 'nom' => $user['nom'],'prenom' => $user['prenom'], 'balance' => $user['solde'], 'status' => 'connecter', 'exp' => time() + 3600]));
            echo json_encode(['status' => 'connecter', 'tokens' => $token]);
            return;
        } else {            
            http_response_code(400);
            echo json_encode(['status' => 'echec lors de la connection', 'message' => 'Email ou mots de passe incorrect']);
            return;
        }
    } catch(\Exception $e) {
        http_response_code(500);
        echo json_encode(['status' => 'Echec..', 'message' => $e->getMessage()]);
        return;
    }
}

function checkUserSession()
{
    $data = json_decode(file_get_contents('php://input'), true);
    $tokens = $data['token'];
    //decoded 
    $decoded = json_decode(base64_decode($tokens), true);
    echo json_encode($decoded);
    // if($decoded && $decoded['exp'] > time()) {
    //     // echo json_encode(['valid' => true, 'data' => $decoded]);
    //     echo json_encode($decoded);
    // } else {
    //     echo json_encode(['valid' => false]);
    // }
}


