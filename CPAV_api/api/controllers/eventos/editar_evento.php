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

if(
    !empty($data->id) &&
    !empty($data->title) &&
    !empty($data->event_date) &&
    (!empty($data->event_time) || !empty($data->end_date))
) {
    $end_date = !empty($data->end_date) ? $data->end_date : null;
    if ($end_date) {
        $today    = new DateTime('today');
        $eventDay = DateTime::createFromFormat('Y-m-d', $data->event_date);
        $endDay   = DateTime::createFromFormat('Y-m-d', $end_date);
        if (!$endDay || !$eventDay || $endDay <= $eventDay) {
            http_response_code(400);
            echo json_encode(["message" => "A data de fim deve ser posterior à data de início."]);
            exit;
        }
        if ($endDay < $today) {
            http_response_code(400);
            echo json_encode(["message" => "A data de fim não pode ser uma data já passada."]);
            exit;
        }
        $maxEnd = (clone $eventDay)->modify('+7 days');
        if ($endDay > $maxEnd) {
            http_response_code(400);
            echo json_encode(["message" => "A duração máxima de um evento é 1 semana (7 dias)."]);
            exit;
        }
    }

    $database = new Database();
    $db = $database->getConnection();

    $evento = new Evento($db);

    if($evento->editar($data->id, $data->title, $data->event_date, $end_date, $data->event_time)) {
        $log = new Log($db);
        $log->inserir($_SESSION['idUser'], 7, null, null, $data->id);

        http_response_code(200);
        echo json_encode(["message" => "Evento atualizado com sucesso."]);
    } else {
        http_response_code(500);
        echo json_encode(["message" => "Erro ao atualizar o evento."]);
    }
} else {
    http_response_code(400);
    echo json_encode(["message" => "Dados incompletos."]);
}
?>