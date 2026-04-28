<?php
require_once "../../config/header.php";
require_once "../../config/database.php";
require_once "../../models/Relatorio.php";

$data = json_decode(file_get_contents("php://input"));

if(
    !empty($data->title) &&
    !empty($data->url) &&
    !empty($data->idType)
) {
    $database = new Database();
    $db = $database->getConnection();

    $relatorio = new Relatorio($db);

    if($relatorio->inserir($data->title, $data->url, $data->idType)) {
        http_response_code(201);
        echo json_encode(["message" => "Relatório inserido com sucesso."]);
    } else {
        http_response_code(500);
        echo json_encode(["message" => "Erro ao inserir o relatório."]);
    }
} else {
    http_response_code(400);
    echo json_encode(["message" => "Dados incompletos."]);
}
?>