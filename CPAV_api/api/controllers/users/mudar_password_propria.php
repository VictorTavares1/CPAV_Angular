<?php
// Usado por qualquer utilizador autenticado para mudar a sua própria password.
// Exige a password atual para confirmar identidade.

require_once "../../config/header.php";
require_once "../../config/require_auth.php";
require_once "../../config/database.php";
require_once "../../config/password_policy.php";
require_once "../../models/User.php";
require_once "../../models/log.php";

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode(["message" => "Método não permitido."]);
    exit;
}

$data            = json_decode(file_get_contents("php://input"), true);
$currentPassword = (string)($data['currentPassword'] ?? '');
$newPassword     = (string)($data['newPassword']     ?? '');

if (empty($currentPassword) || empty($newPassword)) {
    http_response_code(400);
    echo json_encode(["message" => "Password atual e nova são obrigatórias."]);
    exit;
}

$passwordError = validate_password_strength($newPassword);
if ($passwordError !== null) {
    http_response_code(400);
    echo json_encode(["message" => $passwordError]);
    exit;
}

$database = new Database();
$db = $database->getConnection();

$user = new User($db);
$idUtilizador = (int)$_SESSION['idUser'];

if (!$user->verificarPassword($idUtilizador, $currentPassword)) {
    http_response_code(401);
    echo json_encode(["message" => "A password atual está incorreta."]);
    exit;
}

if ($user->mudarPassword($idUtilizador, $newPassword)) {
    $log = new Log($db);
    $log->inserir($idUtilizador, 26);
    http_response_code(200);
    echo json_encode(["message" => "Password alterada com sucesso."]);
} else {
    http_response_code(500);
    echo json_encode(["message" => "Erro ao alterar a password."]);
}
?>
