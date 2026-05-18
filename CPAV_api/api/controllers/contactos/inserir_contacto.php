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
    !empty($data->type) &&
    !empty($data->value) &&
    !empty($data->icon)
) {
    $database = new Database();
    $db = $database->getConnection();

    $contacto = new Contacto($db);

    $idContacto = $contacto->inserir($data->type, $data->value, $data->icon);
    if($idContacto) {
        $log = new Log($db);
        $log->inserir($_SESSION['idUser'], 13);
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
