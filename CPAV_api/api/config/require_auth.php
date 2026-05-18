<?php
if (session_status() === PHP_SESSION_NONE) {
    session_start();
}

if (empty($_SESSION['idUser'])) {
    http_response_code(401);
    echo json_encode(["message" => "Sessão inválida ou expirada."]);
    exit;
}
?>
