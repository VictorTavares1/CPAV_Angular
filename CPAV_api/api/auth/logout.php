<?php
require_once "../config/header.php";
require_once "../config/session_init.php";
require_once "../config/database.php";
require_once "../models/log.php";

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode(["message" => "Método não permitido."]);
    exit;
}

$idUser = $_SESSION['idUser'] ?? null;

if ($idUser) {
    $database = new Database();
    $db = $database->getConnection();
    $log = new Log($db);
    $log->inserir($idUser, 12);
}

session_unset();
session_destroy();

http_response_code(200);
echo json_encode(["message" => "Sessão terminada com sucesso."]);
?>
