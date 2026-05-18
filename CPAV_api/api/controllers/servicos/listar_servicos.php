<?php
require_once "../../config/header.php";
require_once "../../config/database.php";
require_once "../../models/servico.php";

if ($_SERVER['REQUEST_METHOD'] !== 'GET') {
    http_response_code(405);
    echo json_encode(["message" => "Método não permitido."]);
    exit;
}

$database = new Database();
$db = $database->getConnection();

$servico = new Servico($db);
$stmt = $servico->lerAtivos();

if($stmt->rowCount() > 0) {
    $servicos = array();
    while($row = $stmt->fetch(PDO::FETCH_ASSOC)) {
        array_push($servicos, $row);
    }
    http_response_code(200);
    echo json_encode($servicos);
} else {
    http_response_code(200);
    echo json_encode([]);
}
?>