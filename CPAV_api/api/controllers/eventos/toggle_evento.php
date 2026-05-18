<?php
require_once "../../config/header.php";
require_once "../../config/require_auth.php";
require_once "../../config/database.php";
require_once "../../models/evento.php";
require_once "../../models/log.php";

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode(["message" => "Método não permitido."]);
    exit;
}

$data = json_decode(file_get_contents("php://input"));

if(!empty($data->id)) {
    $database = new Database();
    $db = $database->getConnection();

    $evento = new Evento($db);

    if($evento->toggleState($data->id)) {
        $log = new Log($db);
        $log->inserir($_SESSION['idUser'], 8, null, null, $data->id);

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