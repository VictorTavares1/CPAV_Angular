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
$name = trim($data['name'] ?? '');

if (empty($name)) {
    http_response_code(400); echo json_encode(["message" => "O nome é obrigatório."]); exit;
}

$db = (new Database())->getConnection();
$loc = new Location($db);

if ($loc->nomeExiste($name)) {
    http_response_code(409); echo json_encode(["message" => "Já existe uma localização com esse nome."]); exit;
}

$id = $loc->inserir($name);
if ($id) {
    (new Log($db))->inserir($_SESSION['idUser'], 31);
    http_response_code(201);
    echo json_encode(["message" => "Localização inserida com sucesso.", "id" => $id]);
} else {
    http_response_code(500);
    echo json_encode(["message" => "Erro ao inserir a localização."]);
}
?>
