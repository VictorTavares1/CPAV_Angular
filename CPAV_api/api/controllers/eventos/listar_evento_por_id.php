<?php
require_once "../../config/header.php";
require_once "../../config/require_auth.php";
require_once "../../config/database.php";
require_once "../../models/evento.php";

if ($_SERVER['REQUEST_METHOD'] !== 'GET') {
    http_response_code(405);
    echo json_encode(["message" => "Método não permitido."]);
    exit;
}

$id = isset($_GET['id']) ? (int)$_GET['id'] : 0;
if ($id <= 0) {
    http_response_code(400);
    echo json_encode(["message" => "ID inválido."]);
    exit;
}

$database = new Database();
$db = $database->getConnection();

$evento = new Evento($db);
$row = $evento->lerPorId($id);

if ($row) {
    http_response_code(200);
    echo json_encode($row);
} else {
    http_response_code(404);
    echo json_encode(["message" => "Evento não encontrado."]);
}
?>
