<?php
require_once "../../config/header.php";
require_once "../../config/database.php";
require_once "../../models/Noticia.php";

$data = json_decode(file_get_contents("php://input"));

if(
    !empty($data->id) &&
    !empty($data->title) &&
    !empty($data->content)
) {
    $database = new Database();
    $db = $database->getConnection();

    $noticia = new Noticia($db);

    if($noticia->editar($data->id, $data->title, $data->content)) {
        http_response_code(200);
        echo json_encode(["message" => "Notícia atualizada com sucesso."]);
    } else {
        http_response_code(500);
        echo json_encode(["message" => "Erro ao atualizar a notícia."]);
    }
} else {
    http_response_code(400);
    echo json_encode(["message" => "Dados incompletos."]);
}
?>