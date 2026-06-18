<?php
require_once "../config/header.php";
require_once "../config/session_init.php";

if (!empty($_SESSION['idUser'])) {
    http_response_code(200);
    echo json_encode([
        "authenticated" => true,
        "idUser" => $_SESSION['idUser'],
        "email"  => $_SESSION['email'] ?? null,
        "role"   => $_SESSION['role']  ?? 'admin'
    ]);
    exit;
}

http_response_code(401);
echo json_encode(["authenticated" => false]);
?>
