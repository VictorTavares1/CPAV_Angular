<?php
require_once "../../config/header.php";
require_once "../../config/require_auth.php";
require_once "../../config/database.php";
require_once "../../models/facility.php";

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode(["message" => "Método não permitido."]);
    exit;
}

$data = json_decode(file_get_contents("php://input"), true);
$id = (int)($data['id'] ?? 0);

if ($id <= 0) {
    http_response_code(400);
    echo json_encode(["message" => "ID inválido."]);
    exit;
}

$database = new Database();
$db = $database->getConnection();

$facility = new Facility($db);
$ok = $facility->apagarServico($id);

if ($ok) {
    http_response_code(200);
    echo json_encode(["message" => "Associação removida com sucesso."]);
} else {
    http_response_code(500);
    echo json_encode(["message" => "Erro ao remover associação."]);
}
?>
