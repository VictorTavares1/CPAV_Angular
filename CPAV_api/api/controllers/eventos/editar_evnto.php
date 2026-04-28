<?php
require_once "../../config/header.php";
require_once "../../config/database.php";
require_once "../../models/Evento.php";

$data = json_decode(file_get_contents("php://input"));

if(
    !empty($data->id) &&
    !empty($data->title) &&
    !empty($data->event_date) &&
    !empty($data->event_time)
) {
    $database = new Database();
    $db = $database->getConnection();

    $evento = new Evento($db);

    if($evento->editar($data->id, $data->title, $data->event_date, $data->event_time)) {
        http_response_code(200);
        echo json_encode(["message" => "Evento atualizado com sucesso."]);
    } else {
        http_response_code(500);
        echo json_encode(["message" => "Erro ao atualizar o evento."]);
    }
} else {
    http_response_code(400);
    echo json_encode(["message" => "Dados incompletos."]);
}
?>