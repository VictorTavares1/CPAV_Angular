<?php
require_once "../config/header.php";
require_once "../config/database.php";
require_once "../models/Noticia.php";

// Só aceita pedidos POST
if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode(["message" => "Método não permitido."]);
    exit;
}

// Lê os dados JSON enviados pelo Angular
$data = json_decode(file_get_contents("php://input"));

if (empty($data->title) || empty($data->content)) {
    http_response_code(400);
    echo json_encode(["message" => "Título e conteúdo são obrigatórios."]);
    exit;
}

$database = new Database();
$db = $database->getConnection();

$noticia = new Noticia($db);
$idNoticia = $noticia->inserir($data->title, $data->content);

if ($idNoticia) {
    http_response_code(201);
    echo json_encode([
        "message" => "Notícia inserida com sucesso.",
        "id" => $idNoticia
    ]);
} else {
    http_response_code(500);
    echo json_encode(["message" => "Erro ao inserir a notícia."]);
}
?>
