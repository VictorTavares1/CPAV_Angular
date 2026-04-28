<?php
require_once "../../config/header.php";
require_once "../../config/database.php";
require_once "../../models/Evento.php";

$data = json_decode(file_get_contents("php://input"));

if(!empty($data->id)) {
    $database = new Database();
    $db = $database->getConnection();

    $evento = new Evento($db);

    if($evento->toggleState($data->id)) {
        http_response_code(200);
        echo json_encode(["message" => "Estado do evento alterado com sucesso."]);
    } else {
        http_response_code(500);
        echo json_encode(["message" => "Erro ao alterar o estado."]);
    }
} else {
    http_response_code(400);
    echo json_encode(["message" => "ID obrigatório."]);
}
?>