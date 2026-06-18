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

$data  = json_decode(file_get_contents("php://input"), true);
$id    = (int)($data['id']    ?? 0);
$email = trim($data['email']  ?? '');
$role  = $data['role'] ?? 'admin';

if (!$id || empty($email)) {
    http_response_code(400);
    echo json_encode(["message" => "ID e email são obrigatórios."]);
    exit;
}

if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
    http_response_code(400);
    echo json_encode(["message" => "Email inválido."]);
    exit;
}

if (!in_array($role, ['admin', 'super_admin'], true)) {
    $role = 'admin';
}

$database = new Database();
$db = $database->getConnection();

$user = new User($db);

// Um super_admin só pode editar admins normais ou a sua própria conta
$stmtAlvo = $user->lerPorId($id);
$alvo = $stmtAlvo->fetch(PDO::FETCH_ASSOC);
if ($alvo && $alvo['role'] === 'super_admin' && (int)$_SESSION['idUser'] !== $id) {
    http_response_code(403);
    echo json_encode(["message" => "Não tem permissão para editar outro super-administrador."]);
    exit;
}

if ($user->emailExiste($email, $id)) {
    http_response_code(409);
    echo json_encode(["message" => "Já existe outro utilizador com esse email."]);
    exit;
}

// Não permitir que o último super_admin ativo se despromova
if ((int)$_SESSION['idUser'] === $id && $role !== 'super_admin') {
    $outrosSuper = $user->contarSuperAdminsAtivos($id);
    if ($outrosSuper === 0) {
        http_response_code(400);
        echo json_encode(["message" => "Não pode despromover-se. É o último super-administrador ativo."]);
        exit;
    }
}

if ($user->editar($id, $email, $role)) {
    $log = new Log($db);
    $log->inserir($_SESSION['idUser'], 24, null, null, null, $email);

    // Se editou a própria conta, atualizar a sessão
    if ((int)$_SESSION['idUser'] === $id) {
        $_SESSION['email'] = $email;
        $_SESSION['role']  = $role;
    }

    http_response_code(200);
    echo json_encode(["message" => "Utilizador atualizado com sucesso."]);
} else {
    http_response_code(500);
    echo json_encode(["message" => "Erro ao atualizar o utilizador."]);
}
?>
