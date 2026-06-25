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
    !empty($data->title) &&
    !empty($data->event_date) &&
    !empty($data->event_time) &&
    !empty($data->idLocation)
) {
    $today    = new DateTime('today');
    $eventDay = DateTime::createFromFormat('Y-m-d', $data->event_date);
    if (!$eventDay || $eventDay < $today) {
        http_response_code(400);
        echo json_encode(["message" => "Não é possível inserir um evento numa data já passada."]);
        exit;
    }

    $end_date = !empty($data->end_date) ? $data->end_date : null;
    if ($end_date) {
        $endDay = DateTime::createFromFormat('Y-m-d', $end_date);
        if (!$endDay || $endDay <= $eventDay) {
            http_response_code(400);
            echo json_encode(["message" => "A data de fim deve ser posterior à data de início."]);
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

    $idEvento = $evento->inserir($data->title, $data->event_date, $end_date, $data->event_time, $data->idLocation);
    if($idEvento) {
        $log = new Log($db);
        $log->inserir($_SESSION['idUser'], 6, null, null, $idEvento);

        http_response_code(201);
        echo json_encode(["message" => "Evento inserido com sucesso."]);
    } else {
        http_response_code(500);
        echo json_encode(["message" => "Erro ao inserir o evento."]);
    }
} else {
    http_response_code(400);
    echo json_encode(["message" => "Dados incompletos."]);
}
?>