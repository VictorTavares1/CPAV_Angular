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

$id_facility = (int)($data['id_facility'] ?? 0);
$service_key = trim($data['service_key'] ?? '');
$description = trim($data['description'] ?? '') ?: null;
$note        = trim($data['note']        ?? '') ?: null;
$sort_order  = (int)($data['sort_order'] ?? 0);

if ($id_facility <= 0 || empty($service_key)) {
    http_response_code(400);
    echo json_encode(["message" => "id_facility e service_key são obrigatórios."]);
    exit;
}

$database = new Database();
$db = $database->getConnection();

$facility = new Facility($db);
$id = $facility->inserirServico($id_facility, $service_key, $description, $note, $sort_order);

if ($id) {
    http_response_code(201);
    echo json_encode(["message" => "Associação criada com sucesso.", "id" => $id]);
} else {
    http_response_code(500);
    echo json_encode(["message" => "Erro ao criar associação."]);
}
?>
