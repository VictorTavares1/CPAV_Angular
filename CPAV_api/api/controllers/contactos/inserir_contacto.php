<?php
require_once "../../config/header.php";
require_once "../../config/require_auth.php";
require_once "../../config/database.php";
require_once "../../models/contacto.php";
require_once "../../models/log.php";

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode(["message" => "Método não permitido."]);
    exit;
}

$data = json_decode(file_get_contents("php://input"), true);

$type     = trim($data['type']     ?? '');
$value    = trim($data['value']    ?? '');
$icon     = trim($data['icon']     ?? '');
$category = trim($data['category'] ?? 'footer');

if (empty($type) || empty($value)) {
    http_response_code(400);
    echo json_encode(["message" => "Tipo e valor são obrigatórios."]);
    exit;
}

if (mb_strlen($type) > 100 || mb_strlen($value) > 255 || mb_strlen($icon) > 100) {
    http_response_code(400);
    echo json_encode(["message" => "Um dos campos excede o comprimento máximo permitido."]);
    exit;
}

if (!in_array($category, ['footer', 'rapido'], true)) {
    $category = 'footer';
}

$database = new Database();
$db = $database->getConnection();

$contacto = new Contacto($db);
$id = $contacto->inserir($type, $value, $icon, $category);

if ($id) {
    try { (new Log($db))->inserir($_SESSION['idUser'], 30); } catch (\Throwable $e) { error_log($e->getMessage()); }
    http_response_code(201);
    echo json_encode(["message" => "Contacto inserido com sucesso.", "id" => $id]);
} else {
    http_response_code(500);
    echo json_encode(["message" => "Erro ao inserir o contacto."]);
}
?>
