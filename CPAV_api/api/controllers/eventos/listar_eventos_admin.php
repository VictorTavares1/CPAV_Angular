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

$database = new Database();
$db = $database->getConnection();

$evento = new Evento($db);

// Antes de listar, arquiva (idState = 2) os eventos cuja data já passou.
// Garante que o admin vê eventos passados como "Inativo" automaticamente.
$evento->desativarPassados();

$stmt = $evento->lerTodos();

$eventos = [];
while ($row = $stmt->fetch(PDO::FETCH_ASSOC)) {
    $eventos[] = $row;
}

http_response_code(200);
echo json_encode($eventos);
?>
