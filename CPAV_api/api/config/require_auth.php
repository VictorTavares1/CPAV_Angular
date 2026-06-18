<?php
require_once __DIR__ . "/session_init.php";

if (empty($_SESSION['idUser'])) {
    http_response_code(401);
    echo json_encode(["message" => "Sessão inválida ou expirada."]);
    exit;
}
?>
