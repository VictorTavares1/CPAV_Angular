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

if(!empty($data->id)) {
    $database = new Database();
    $db = $database->getConnection();

    $contacto = new Contacto($db);

    // Lê o tipo antes do toggle para registar no log.
    $stmt = $contacto->lerPorId($data->id);
    $row = $stmt->fetch(PDO::FETCH_ASSOC);
    $alvo = $row ? $row['type'] : null;

    if($contacto->toggleState($data->id)) {
        $log = new Log($db);
        $log->inserir($_SESSION['idUser'], 15, null, null, null, $alvo);
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