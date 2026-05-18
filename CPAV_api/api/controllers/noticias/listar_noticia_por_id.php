<?php
require_once "../../config/header.php";
require_once "../../config/database.php";
require_once "../../models/noticia.php";

if ($_SERVER['REQUEST_METHOD'] !== 'GET') {
    http_response_code(405);
    echo json_encode(["message" => "Método não permitido."]);
    exit;
}

$id = isset($_GET['id']) ? (int)$_GET['id'] : 0;

if ($id <= 0) {
    http_response_code(400);
    echo json_encode(["message" => "ID inválido."]);
    exit;
}

$database = new Database();
$db = $database->getConnection();

$noticia = new Noticia($db);
$stmt = $noticia->lerPorId($id);

if ($stmt && $stmt->rowCount() > 0) {
    $row = $stmt->fetch(PDO::FETCH_ASSOC);
    $row['images'] = $row['images'] ? explode(',', $row['images']) : [];
    http_response_code(200);
    echo json_encode($row);
} else {
    http_response_code(404);
    echo json_encode(["message" => "Notícia não encontrada."]);
}
?>
