<?php
require_once "../../config/header.php";
require_once "../../config/require_auth.php";
require_once "../../config/database.php";
require_once "../../models/contacto.php";
require_once "../../models/log.php";

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode(["message" => "Método não permitido."]);
    exit;
}

$data = json_decode(file_get_contents("php://input"));

if(
    !empty($data->id) &&
    !empty($data->type) &&
    !empty($data->value) &&
    !empty($data->icon)
) {
    $database = new Database();
    $db = $database->getConnection();

    $contacto = new Contacto($db);

    $category = !empty($data->category) ? $data->category : 'footer';
    if($contacto->editar($data->id, $data->type, $data->value, $data->icon, $category)) {
        $log = new Log($db);
        $log->inserir($_SESSION['idUser'], 14);
        http_response_code(200);
        echo json_encode(["message" => "Contacto atualizado com sucesso."]);
    } else {
        http_response_code(500);
        echo json_encode(["message" => "Erro ao atualizar o contacto."]);
    }
} else {
    http_response_code(400);
    echo json_encode(["message" => "Dados incompletos."]);
}
?>