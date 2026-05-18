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
    !empty($data->title) &&
    !empty($data->description) &&
    !empty($data->icon_or_image)
) {
    $database = new Database();
    $db = $database->getConnection();

    $servico = new Servico($db);

    $idServico = $servico->inserir($data->title, $data->description, $data->icon_or_image);
    if($idServico) {
        $log = new Log($db);
        $log->inserir($_SESSION['idUser'], 16);
        http_response_code(201);
        echo json_encode(["message" => "Serviço inserido com sucesso."]);
    } else {
        http_response_code(500);
        echo json_encode(["message" => "Erro ao inserir o serviço."]);
    }
} else {
    http_response_code(400);
    echo json_encode(["message" => "Dados incompletos."]);
}
?>
