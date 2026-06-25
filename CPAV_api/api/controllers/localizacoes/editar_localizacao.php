<?php
require_once "../../config/header.php";
require_once "../../config/require_auth.php";
require_once "../../config/database.php";
require_once "../../models/location.php";
require_once "../../models/log.php";

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405); echo json_encode(["message" => "Método não permitido."]); exit;
}

$data = json_decode(file_get_contents("php://input"), true);
$id   = (int)($data['id']   ?? 0);
$name = trim($data['name']  ?? '');

if (!$id || empty($name)) {
    http_response_code(400); echo json_encode(["message" => "ID e nome são obrigatórios."]); exit;
}

$db = (new Database())->getConnection();
$loc = new Location($db);

if ($loc->nomeExiste($name, $id)) {
    http_response_code(409); echo json_encode(["message" => "Já existe outra localização com esse nome."]); exit;
}

if ($loc->editar($id, $name)) {
    (new Log($db))->inserir($_SESSION['idUser'], 32);
    http_response_code(200);
    echo json_encode(["message" => "Localização atualizada com sucesso."]);
} else {
    http_response_code(500);
    echo json_encode(["message" => "Erro ao atualizar a localização."]);
}
?>
