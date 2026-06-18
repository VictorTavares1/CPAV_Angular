<?php
require_once "../../config/header.php";
require_once "../../config/require_auth.php";
require_once "../../config/database.php";
require_once "../../models/page_content.php";
require_once "../../models/log.php";

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode(["message" => "Método não permitido."]);
    exit;
}

$data = json_decode(file_get_contents("php://input"));

if (!empty($data->id) && isset($data->content_value)) {
    $database = new Database();
    $db = $database->getConnection();

    $pageContent = new PageContent($db);

    // Lê o nome da página + chave para registar no log.
    $stmt = $pageContent->lerPorId($data->id);
    $row = $stmt->fetch(PDO::FETCH_ASSOC);
    $alvo = $row ? ($row['Page_name'] . ': ' . $row['section_key']) : null;

    if ($pageContent->editar($data->id, $data->content_value)) {
        $log = new Log($db);
        $log->inserir($_SESSION['idUser'], 19, null, null, null, $alvo);
        http_response_code(200);
        echo json_encode(["message" => "Conteúdo atualizado com sucesso."]);
    } else {
        http_response_code(500);
        echo json_encode(["message" => "Erro ao atualizar o conteúdo."]);
    }
} else {
    http_response_code(400);
    echo json_encode(["message" => "Dados incompletos."]);
}
?>
