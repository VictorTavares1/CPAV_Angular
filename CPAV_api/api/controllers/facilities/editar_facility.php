<?php
require_once "../../config/header.php";
require_once "../../config/require_auth.php";
require_once "../../config/database.php";
require_once "../../models/facility.php";
require_once "../../models/log.php";

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode(["message" => "Método não permitido."]);
    exit;
}

$data = json_decode(file_get_contents("php://input"), true);

if (empty($data['id']) || empty($data['category']) || empty($data['name'])) {
    http_response_code(400);
    echo json_encode(["message" => "ID, categoria e nome são obrigatórios."]);
    exit;
}

$payload = [
    'category'          => $data['category'],
    'name'              => $data['name'],
    'icon'              => $data['icon']              ?? null,
    'address'           => $data['address']           ?? null,
    'tel'               => $data['tel']               ?? null,
    'mobile'            => $data['mobile']            ?? null,
    'email'             => $data['email']             ?? null,
    'responsavel_nome'  => $data['responsavel_nome']  ?? null,
    'responsavel_cargo' => $data['responsavel_cargo'] ?? null,
    'linked_facility'   => $data['linked_facility']   ?? null,
    'services'          => $data['services']          ?? null,
    'sort_order'        => $data['sort_order']        ?? 0,
];

$database = new Database();
$db = $database->getConnection();

$facility = new Facility($db);
if ($facility->editar((int)$data['id'], $payload)) {
    $log = new Log($db);
    $log->inserir($_SESSION['idUser'], 21);
    http_response_code(200);
    echo json_encode(["message" => "Registo atualizado com sucesso."]);
} else {
    http_response_code(500);
    echo json_encode(["message" => "Erro ao atualizar."]);
}
?>
