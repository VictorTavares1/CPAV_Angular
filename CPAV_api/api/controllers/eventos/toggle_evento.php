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

    $row = $evento->lerPorId($data->id);
    if (!$row) {
        http_response_code(404);
        echo json_encode(["message" => "Evento não encontrado."]);
        exit;
    }

    // Impede reativar eventos cuja data (ou data de fim) já passou
    $isInactive  = (int)($row['idState'] ?? 1) !== 1;
    $relevantDate = !empty($row['end_date']) ? $row['end_date'] : $row['event_date'];
    if ($isInactive && $relevantDate < date('Y-m-d')) {
        http_response_code(400);
        echo json_encode(["message" => "Não é possível reativar um evento cuja data já passou."]);
        exit;
    }

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