<?php
// Valida que existe uma sessão activa e que o utilizador é super_admin.
// Os controladores de gestão de utilizadores incluem este ficheiro em vez do require_auth.php.

require_once __DIR__ . "/session_init.php";

if (empty($_SESSION['idUser'])) {
    http_response_code(401);
    echo json_encode(["message" => "Sessão inválida ou expirada."]);
    exit;
}

if (($_SESSION['role'] ?? 'admin') !== 'super_admin') {
    http_response_code(403);
    echo json_encode(["message" => "Acesso negado. Apenas super-administradores podem efetuar esta operação."]);
    exit;
}
?>
