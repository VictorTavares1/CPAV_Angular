<?php
require_once "../../config/header.php";
require_once "../../config/require_auth.php";
require_once "../../config/database.php";
require_once "../../models/servico.php";
require_once "../../models/log.php";

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode(["message" => "Método não permitido."]);
    exit;
}

$data = json_decode(file_get_contents("php://input"));

if(
    !empty($data->id) &&
    !empty($data->title) &&
    !empty($data->description) &&
    !empty($data->icon_or_image)
) {
    $database = new Database();
    $db = $database->getConnection();

    $servico = new Servico($db);

    if($servico->editar($data->id, $data->title, $data->description, $data->icon_or_image)) {
        $log = new Log($db);
        $log->inserir($_SESSION['idUser'], 17, null, null, null, $data->title);
        http_response_code(200);
        echo json_encode(["message" => "Serviço atualizado com sucesso."]);
    } else {
        http_response_code(500);
        echo json_encode(["message" => "Erro ao atualizar o serviço."]);
    }
} else {
    http_response_code(400);
    echo json_encode(["message" => "Dados incompletos."]);
}
?>