<?php
require_once "../../config/header.php";
require_once "../../config/database.php";
require_once "../../models/Noticia.php";

$data = json_decode(file_get_contents("php://input"));

if(!empty($data->id)) {
    $database = new Database();
    $db = $database->getConnection();

    $noticia = new Noticia($db);

    if($noticia->toggleState($data->id)) {
        http_response_code(200);
        echo json_encode(["message" => "Estado da notícia alterado com sucesso."]);
    } else {
        http_response_code(500);
        echo json_encode(["message" => "Erro ao alterar o estado."]);
    }
} else {
    http_response_code(400);
    echo json_encode(["message" => "ID obrigatório."]);
}
?>