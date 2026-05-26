<?php
require_once "../../config/header.php";
require_once "../../config/require_super_admin.php";
require_once "../../config/database.php";
require_once "../../models/User.php";
require_once "../../models/log.php";

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode(["message" => "Método não permitido."]);
    exit;
}

$data = json_decode(file_get_contents("php://input"), true);
$id   = (int)($data['id'] ?? 0);

if (!$id) {
    http_response_code(400);
    echo json_encode(["message" => "ID obrigatório."]);
    exit;
}

// Não permitir auto-desativação
if ((int)$_SESSION['idUser'] === $id) {
    http_response_code(400);
    echo json_encode(["message" => "Não pode desativar a sua própria conta."]);
    exit;
}

$database = new Database();
$db = $database->getConnection();

$user = new User($db);

// Antes de desativar, verificar se é o último super_admin ativo
$stmt = $user->lerPorId($id);
$alvo = $stmt->fetch(PDO::FETCH_ASSOC);
if ($alvo && $alvo['role'] === 'super_admin' && (int)$alvo['idState'] === 1) {
    $outrosSuper = $user->contarSuperAdminsAtivos($id);
    if ($outrosSuper === 0) {
        http_response_code(400);
        echo json_encode(["message" => "Não pode desativar o último super-administrador ativo."]);
        exit;
    }
}

if ($user->toggleState($id)) {
    $log = new Log($db);
    $log->inserir($_SESSION['idUser'], 25);
    http_response_code(200);
    echo json_encode(["message" => "Estado alterado com sucesso."]);
} else {
    http_response_code(500);
    echo json_encode(["message" => "Erro ao alterar o estado."]);
}
?>
