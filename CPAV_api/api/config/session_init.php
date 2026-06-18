<?php
/**
 * Inicialização central das sessões PHP.
 *
 * Garante que o cookie da sessão (PHPSESSID) é configurado da mesma forma
 * em todos os endpoints, com path "/" para que viaje em pedidos a qualquer
 * pasta da API (auth, controllers/contactos, controllers/users, etc.),
 * em vez de ficar restrito ao caminho do script que o criou.
 *
 * Detecta automaticamente se a ligação é HTTPS para ativar o atributo
 * Secure no cookie, mantendo compatibilidade com o ambiente local em HTTP.
 */

if (session_status() === PHP_SESSION_NONE) {
    $isHttps = (
        (!empty($_SERVER['HTTPS']) && $_SERVER['HTTPS'] !== 'off')
        || (isset($_SERVER['HTTP_X_FORWARDED_PROTO']) && $_SERVER['HTTP_X_FORWARDED_PROTO'] === 'https')
        || (isset($_SERVER['SERVER_PORT']) && (int)$_SERVER['SERVER_PORT'] === 443)
    );

    session_set_cookie_params([
        'lifetime' => 0,
        'path'     => '/',
        'domain'   => '',
        'secure'   => $isHttps,
        'httponly' => true,
        'samesite' => 'Lax',
    ]);

    session_start();
}
?>
