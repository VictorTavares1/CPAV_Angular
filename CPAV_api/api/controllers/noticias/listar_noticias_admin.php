<?php
require_once "../../config/header.php";
require_once "../../config/database.php";
require_once "../../models/noticia.php";

if ($_SERVER['REQUEST_METHOD'] !== 'GET') {
    http_response_code(405);
    echo json_encode(["message" => "Método não permitido."]);
    exit;
}

$database = new Database();
$db = $database->getConnection();

$noticia = new Noticia($db);
$stmt = $noticia->lerTodas();

if ($stmt->rowCount() > 0) {
    $noticias = array();
    while ($row = $stmt->fetch(PDO::FETCH_ASSOC)) {
        array_push($noticias, $row);
    }
    http_response_code(200);
    echo json_encode($noticias);
} else {
    http_response_code(200);
    echo json_encode([]);
}
?>
