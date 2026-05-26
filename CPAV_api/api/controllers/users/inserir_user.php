<?php
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

$data = json_decode(file_get_contents("php://input"), true);

$email    = trim($data['email']    ?? '');
$password = (string)($data['password'] ?? '');
$role     = $data['role'] ?? 'admin';

if (empty($email) || empty($password)) {
    http_response_code(400);
    echo json_encode(["message" => "Email e password são obrigatórios."]);
    exit;
}

if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
    http_response_code(400);
    echo json_encode(["message" => "Email inválido."]);
    exit;
}

$passwordError = validate_password_strength($password);
if ($passwordError !== null) {
    http_response_code(400);
    echo json_encode(["message" => $passwordError]);
    exit;
}

if (!in_array($role, ['admin', 'super_admin'], true)) {
    $role = 'admin';
}

$database = new Database();
$db = $database->getConnection();

$user = new User($db);

if ($user->emailExiste($email)) {
    http_response_code(409);
    echo json_encode(["message" => "Já existe um utilizador com esse email."]);
    exit;
}

$id = $user->inserir($email, $password, $role);
if ($id) {
    $log = new Log($db);
    $log->inserir($_SESSION['idUser'], 23);
    http_response_code(201);
    echo json_encode(["message" => "Utilizador inserido com sucesso.", "id" => $id]);
} else {
    http_response_code(500);
    echo json_encode(["message" => "Erro ao inserir o utilizador."]);
}
?>
