<?php
function connect() {
    $dsn = 'mysql:host=localhost;dbname=casino';
    $username = 'root';
    $password = ''; // Change this to your actual password

    try {
        $pdo = new PDO($dsn, $username, $password);
        $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
        return $pdo;
    } catch (PDOException $e) {
        echo 'Connection failed: ' . $e->getMessage();
        exit();
    }
}
