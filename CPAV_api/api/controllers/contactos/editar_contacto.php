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

$id       = intval($data['id']       ?? 0);
$type     = trim($data['type']       ?? '');
$value    = trim($data['value']      ?? '');
$icon     = trim($data['icon']       ?? '');
$category = trim($data['category']   ?? 'footer');

if (!in_array($category, ['footer', 'rapido'], true)) {
    $category = 'footer';
}

if (mb_strlen($type) > 100 || mb_strlen($value) > 255 || mb_strlen($icon) > 100) {
    http_response_code(400);
    echo json_encode(["message" => "Um dos campos excede o comprimento máximo permitido."]);
    exit;
}

if(
    $id > 0 &&
    !empty($type) &&
    !empty($value)
) {
    $database = new Database();
    $db = $database->getConnection();

    $contacto = new Contacto($db);

    if($contacto->editar($id, $type, $value, $icon, $category)) {
        try { (new Log($db))->inserir($_SESSION['idUser'], 14, null, null, null, $type); } catch (\Throwable $e) { error_log($e->getMessage()); }
        http_response_code(200);
        echo json_encode(["message" => "Contacto atualizado com sucesso."]);
    } else {
        http_response_code(500);
        echo json_encode(["message" => "Erro ao atualizar o contacto."]);
    }
} else {
    http_response_code(400);
    echo json_encode(["message" => "Dados incompletos."]);
}
?>