<?php
require_once "../../config/header.php";
require_once "../../config/require_auth.php";
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
$stmt = $servico->lerTodos();

$servicos = [];
while ($row = $stmt->fetch(PDO::FETCH_ASSOC)) {
    $row['idState'] = (int)$row['idState'];
    $servicos[] = $row;
}

http_response_code(200);
echo json_encode($servicos);
?>
