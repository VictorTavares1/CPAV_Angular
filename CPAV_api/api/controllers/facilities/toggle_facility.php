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

if (empty($data['id'])) {
    http_response_code(400);
    echo json_encode(["message" => "ID obrigatório."]);
    exit;
}

$database = new Database();
$db = $database->getConnection();

$facility = new Facility($db);
if ($facility->toggleState((int)$data['id'])) {
    $log = new Log($db);
    $log->inserir($_SESSION['idUser'], 22);
    http_response_code(200);
    echo json_encode(["message" => "Estado alterado com sucesso."]);
} else {
    http_response_code(500);
    echo json_encode(["message" => "Erro ao alterar estado."]);
}
?>
