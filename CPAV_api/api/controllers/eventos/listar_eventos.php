<?php
require_once "../../config/header.php";
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
$evento->desativarPassados();

$stmt = $evento->lerAtivos();

if($stmt->rowCount() > 0) {
    $eventos = array();
    while($row = $stmt->fetch(PDO::FETCH_ASSOC)) {
        array_push($eventos, $row);
    }
    http_response_code(200);
    echo json_encode($eventos);
} else {
    http_response_code(200);
    echo json_encode([]);
}
?>