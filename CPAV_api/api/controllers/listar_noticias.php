<?php
require_once "../config/header.php";
require_once "../config/database.php";
require_once "../models/noticia.php";

$database = new Database();
$db = $database->getConnection();

$noticia = new Noticia($db);
$stmt = $noticia->lerAtivas();

if($stmt->rowCount() > 0) {
    $noticias = array();
    while($row = $stmt->fetch(PDO::FETCH_ASSOC)) {
        array_push($noticias, $row);
    }
    http_response_code(200);
    echo json_encode($noticias);
} else {
    http_response_code(404);
    echo json_encode(["message" => "Nenhuma notícia encontrada."]);
}
?>