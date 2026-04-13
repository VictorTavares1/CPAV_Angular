<?php
require_once "../config/header.php";
require_once "../config/database.php";
require_once "../models/Evento.php";

$database = new Database();
$db = $database->getConnection();

$evento = new Evento($db);
$stmt = $evento->lerAtivos();

if($stmt->rowCount() > 0) {
    $eventos = array();
    while($row = $stmt->fetch(PDO::FETCH_ASSOC)) {
        array_push($eventos, $row);
    }
    http_response_code(200);
    echo json_encode($eventos);
} else {
    http_response_code(404);
    echo json_encode(["message" => "Nenhum evento encontrado."]);
}
?>