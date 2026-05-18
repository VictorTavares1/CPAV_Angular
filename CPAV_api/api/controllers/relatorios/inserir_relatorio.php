<?php
require_once "../../config/header.php";
require_once "../../config/require_auth.php";
require_once "../../config/database.php";
require_once "../../models/relatorio.php";
require_once "../../models/log.php";

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode(["message" => "Método não permitido."]);
    exit;
}

$title  = trim($_POST['title']  ?? '');
$idType = trim($_POST['idType'] ?? '');

if (empty($title) || empty($idType) || empty($_FILES['file'])) {
    http_response_code(400);
    echo json_encode(["message" => "Dados incompletos."]);
    exit;
}

if ($_FILES['file']['error'] !== UPLOAD_ERR_OK) {
    http_response_code(400);
    echo json_encode(["message" => "Erro no upload do ficheiro."]);
    exit;
}

$mime = mime_content_type($_FILES['file']['tmp_name']);
if ($mime !== 'application/pdf') {
    http_response_code(400);
    echo json_encode(["message" => "Apenas ficheiros PDF são permitidos."]);
    exit;
}

$uploadDir = __DIR__ . '/../../../../uploads/relatorios/';
$filename  = uniqid('rel_', true) . '.pdf';
$dest      = $uploadDir . $filename;

if (!move_uploaded_file($_FILES['file']['tmp_name'], $dest)) {
    http_response_code(500);
    echo json_encode(["message" => "Erro ao guardar o ficheiro."]);
    exit;
}

$database = new Database();
$db       = $database->getConnection();
$relatorio = new Relatorio($db);

$idRelatorio = $relatorio->inserir($title, $filename, $idType);
if ($idRelatorio) {
    $log = new Log($db);
    $log->inserir($_SESSION['idUser'], 4, null, $idRelatorio);

    http_response_code(201);
    echo json_encode(["message" => "Relatório inserido com sucesso."]);
} else {
    unlink($dest);
    http_response_code(500);
    echo json_encode(["message" => "Erro ao inserir na base de dados."]);
}
?>
