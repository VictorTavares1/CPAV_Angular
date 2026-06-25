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

$id          = (int)($data['id']          ?? 0);
$service_key = trim($data['service_key']  ?? '');
$description = trim($data['description']  ?? '') ?: null;
$note        = trim($data['note']         ?? '') ?: null;
$sort_order  = (int)($data['sort_order']  ?? 0);

if ($id <= 0 || empty($service_key)) {
    http_response_code(400);
    echo json_encode(["message" => "id e service_key são obrigatórios."]);
    exit;
}

$database = new Database();
$db = $database->getConnection();

$facility = new Facility($db);
$ok = $facility->editarServico($id, $service_key, $description, $note, $sort_order);

if ($ok) {
    http_response_code(200);
    echo json_encode(["message" => "Associação atualizada com sucesso."]);
} else {
    http_response_code(500);
    echo json_encode(["message" => "Erro ao atualizar associação."]);
}
?>
