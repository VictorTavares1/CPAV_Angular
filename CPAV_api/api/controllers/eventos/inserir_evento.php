<?php
require_once "../../config/header.php";
require_once "../../config/database.php";
require_once "../../models/Evento.php";

$data = json_decode(file_get_contents("php://input"));

if(
    !empty($data->title) &&
    !empty($data->event_date) &&
    !empty($data->event_time) &&
    !empty($data->idLocation)
) {
    $database = new Database();
    $db = $database->getConnection();

    $evento = new Evento($db);

    if($evento->inserir($data->title, $data->event_date, $data->event_time, $data->idLocation)) {
        http_response_code(201);
        echo json_encode(["message" => "Evento inserido com sucesso."]);
    } else {
        http_response_code(500);
        echo json_encode(["message" => "Erro ao inserir o evento."]);
    }
} else {
    http_response_code(400);
    echo json_encode(["message" => "Dados incompletos."]);
}
?>