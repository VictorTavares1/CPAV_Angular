<?php
/**
 * Cabeçalhos partilhados por todos os endpoints da API.
 *
 * CORS: só são permitidas as origens listadas em $allowedOrigins. Pedidos vindos
 * de outros domínios não recebem o cabeçalho Access-Control-Allow-Origin e por
 * isso são bloqueados pelo navegador.
 *
 * Para adicionar uma nova origem permitida (ex: subdomínio de testes), basta
 * acrescentar à lista.
 */

$allowedOrigins = [
    // Desenvolvimento local
    'http://localhost:4200',
    'http://localhost',

    // Produção
    'https://cspslalhosvedros.pt',
    'https://www.cspslalhosvedros.pt',
];

$origin = $_SERVER['HTTP_ORIGIN'] ?? '';
if (in_array($origin, $allowedOrigins, true)) {
    header("Access-Control-Allow-Origin: " . $origin);
    header("Access-Control-Allow-Credentials: true");
}

// A resposta da API é sempre JSON em UTF-8
header("Content-Type: application/json; charset=UTF-8");

// Métodos HTTP permitidos
header("Access-Control-Allow-Methods: POST, GET, PUT, DELETE, OPTIONS");

// Tempo de vida da permissão CORS (em segundos) para o browser não repetir
// o pedido preflight a cada operação.
header("Access-Control-Max-Age: 3600");

// Cabeçalhos que o cliente pode enviar nos pedidos
header("Access-Control-Allow-Headers: Content-Type, Authorization, X-Requested-With");

// Responde imediatamente aos pedidos preflight (OPTIONS) que o browser
// envia antes de operações POST/PUT/DELETE com credenciais.
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit;
}
?>
