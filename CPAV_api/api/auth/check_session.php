<?php
require_once "../config/header.php";

if (session_status() === PHP_SESSION_NONE) {
    session_start();
}

if (!empty($_SESSION['idUser'])) {
    http_response_code(200);
    echo json_encode([
        "authenticated" => true,
        "idUser" => $_SESSION['idUser'],
        "email" => $_SESSION['email'] ?? null
    ]);
    exit;
}

http_response_code(401);
echo json_encode(["authenticated" => false]);
?>
