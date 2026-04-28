<?php
require_once "../../config/header.php";
require_once "../../config/database.php";
require_once "../../models/Contacto.php";

$data = json_decode(file_get_contents("php://input"));

if(
    !empty($data->type) &&
    !empty($data->value) &&
    !empty($data->icon)
) {
    $database = new Database();
    $db = $database->getConnection();

    $contacto = new Contacto($db);

    if($contacto->inserir($data->type, $data->value, $data->icon)) {
        http_response_code(201);
        echo json_encode(["message" => "Contacto inserido com sucesso."]);
    } else {
        http_response_code(500);
        echo json_encode(["message" => "Erro ao inserir o contacto."]);
    }
} else {
    http_response_code(400);
    echo json_encode(["message" => "Dados incompletos."]);
}
?>
