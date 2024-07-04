<?php
// save_score.php
require 'db.php';

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    session_start();
    if (isset($_SESSION['user_id'])) {
        $user_id = $_SESSION['user_id'];
        $data = json_decode(file_get_contents('php://input'), true);
        $numero_gagnant = $data['numero'];
        $montant_mise = $data['montant'];

        $stmt = $pdo->prepare("INSERT INTO scores (user_id, numero_gagnant, montant_mise) VALUES (?, ?, ?)");
        if ($stmt->execute([$user_id, $numero_gagnant, $montant_mise])) {
            echo json_encode(['status' => 'success']);
        } else {
            echo json_encode(['status' => 'error']);
        }
    } else {
        echo json_encode(['status' => 'error']);
    }
}
?>
