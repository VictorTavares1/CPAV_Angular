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

$id      = (int)($data['id']      ?? 0);
$name    = trim($data['name']     ?? '');
$address = trim($data['address']  ?? '') ?: null;
$tel     = trim($data['tel']      ?? '') ?: null;
$mobile  = trim($data['mobile']   ?? '') ?: null;
$email   = trim($data['email']    ?? '') ?: null;

if ($id <= 0 || empty($name)) {
    http_response_code(400);
    echo json_encode(["message" => "ID e nome são obrigatórios."]);
    exit;
}

$database = new Database();
$db = $database->getConnection();

$facility = new Facility($db);
$ok = $facility->editarContactos($id, $name, $address, $tel, $mobile, $email);

if ($ok) {
    http_response_code(200);
    echo json_encode(["message" => "Contactos atualizados com sucesso."]);
} else {
    http_response_code(500);
    echo json_encode(["message" => "Erro ao atualizar contactos."]);
}
?>
