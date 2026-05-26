<?php
// Usado pelo super_admin para mudar a password de qualquer utilizador.
// Não exige password atual.

require_once "../../config/header.php";
require_once "../../config/require_super_admin.php";
require_once "../../config/database.php";
require_once "../../config/password_policy.php";
require_once "../../models/User.php";
require_once "../../models/log.php";

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode(["message" => "Método não permitido."]);
    exit;
}

$data     = json_decode(file_get_contents("php://input"), true);
$id       = (int)($data['id'] ?? 0);
$password = (string)($data['password'] ?? '');

if (!$id || empty($password)) {
    http_response_code(400);
    echo json_encode(["message" => "ID e password são obrigatórios."]);
    exit;
}

$passwordError = validate_password_strength($password);
if ($passwordError !== null) {
    http_response_code(400);
    echo json_encode(["message" => $passwordError]);
    exit;
}

$database = new Database();
$db = $database->getConnection();

$user = new User($db);
if ($user->mudarPassword($id, $password)) {
    $log = new Log($db);
    $log->inserir($_SESSION['idUser'], 26);
    http_response_code(200);
    echo json_encode(["message" => "Password alterada com sucesso."]);
} else {
    http_response_code(500);
    echo json_encode(["message" => "Erro ao alterar a password."]);
}
?>
