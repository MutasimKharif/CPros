<?php
require 'db.php';

if ($_SERVER["REQUEST_METHOD"] == "POST") {
    $username = trim($_POST['username']);
    $email = trim($_POST['email']);
    $password = $_POST['password'];
    $confirm_password = $_POST['confirm_password'];

    if ($password !== $confirm_password) {
        die("Passwords do not match.");
    }

    $password_hash = password_hash($password, PASSWORD_DEFAULT);

    $stmt = $pdo->prepare("INSERT INTO users (username, email, password_hash, first_name, last_name, middle_name) VALUES (?, ?, ?, ?, ?, ?)");
    try {
        $stmt->execute([
            $username,
            $email,
            $password_hash,
            $_POST['first_name'],
            $_POST['last_name'],
            $_POST['middle_name']
        ]);
        header("Location: signup.html");
    } catch (PDOException $e) {
        die("Error: " . $e->getMessage());
    }
}
?>
