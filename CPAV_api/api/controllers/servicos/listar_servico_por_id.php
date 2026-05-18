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

$id = isset($_GET['id']) ? (int)$_GET['id'] : 0;
if (!$id) {
    http_response_code(400);
    echo json_encode(["message" => "ID obrigatório."]);
    exit;
}

$database = new Database();
$db = $database->getConnection();

$servico = new Servico($db);
$stmt = $servico->lerPorId($id);

if ($stmt->rowCount() === 0) {
    http_response_code(404);
    echo json_encode(["message" => "Serviço não encontrado."]);
    exit;
}

$row = $stmt->fetch(PDO::FETCH_ASSOC);
$row['idState'] = (int)$row['idState'];
http_response_code(200);
echo json_encode($row);
?>
