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
$id   = (int)($data['id'] ?? 0);

if (!$id) {
    http_response_code(400); echo json_encode(["message" => "ID obrigatório."]); exit;
}

$db = (new Database())->getConnection();
$loc = new Location($db);

if ($loc->toggleState($id)) {
    (new Log($db))->inserir($_SESSION['idUser'], 33);
    http_response_code(200);
    echo json_encode(["message" => "Estado alterado com sucesso."]);
} else {
    http_response_code(500);
    echo json_encode(["message" => "Erro ao alterar o estado."]);
}
?>
