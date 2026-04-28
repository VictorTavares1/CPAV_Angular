<?php
require_once "../../config/header.php";
require_once "../../config/database.php";
require_once "../../models/Contacto.php";

$data = json_decode(file_get_contents("php://input"));

if(!empty($data->id)) {
    $database = new Database();
    $db = $database->getConnection();

    $contacto = new Contacto($db);

    if($contacto->toggleState($data->id)) {
        http_response_code(200);
        echo json_encode(["message" => "Estado do contacto alterado com sucesso."]);
    } else {
        http_response_code(500);
        echo json_encode(["message" => "Erro ao alterar o estado."]);
    }
} else {
    http_response_code(400);
    echo json_encode(["message" => "ID obrigatório."]);
}
?>