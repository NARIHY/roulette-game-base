<?php
class ScoreManager {
    private $file;

    public function __construct($file) {
        $this->file = $file;
    }

    public function saveScore($score) {
        $data = $this->loadScores();
        $data[] = $score;
        file_put_contents($this->file, json_encode($data));
    }

    public function loadScores() {
        if (file_exists($this->file)) {
            return json_decode(file_get_contents($this->file), true);
        }
        return [];
    }
}

// Fichier save_score.php
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    require_once 'ScoreManager.php';
    $scoreManager = new ScoreManager('scores.json');
    $score = json_decode(file_get_contents('php://input'), true);
    $scoreManager->saveScore($score);
    echo json_encode(['status' => 'success']);
}
?>
