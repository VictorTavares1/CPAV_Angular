<?php
// Permite que qualquer aplicação (como o Angular) aceda a esta API
header("Access-Control-Allow-Origin: *");

// Define que a resposta será sempre em formato JSON
header("Content-Type: application/json; charset=UTF-8");

// Define quais os métodos permitidos (Ler, Criar, Atualizar, Apagar)
header("Access-Control-Allow-Methods: POST, GET, PUT, DELETE");

// Tempo de vida da permissão
header("Access-Control-Max-Age: 3600");

// Define quais os cabeçalhos permitidos nos pedidos
header("Access-Control-Allow-Headers: Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With");
?>