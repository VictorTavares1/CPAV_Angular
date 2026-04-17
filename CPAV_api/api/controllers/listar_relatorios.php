<?php
require_once "../config/header.php";
require_once "../config/database.php";
require_once "../models/relatorio.php";

$database = new Database();
$db = $database->getConnection();

$relatorio = new Relatorio($db);
$stmt = $relatorio->lerAtivos();

if($stmt->rowCount() > 0) {
    $relatorios = array();
    while($row = $stmt->fetch(PDO::FETCH_ASSOC)) {
        array_push($relatorios, $row);
    }
    http_response_code(200);
    echo json_encode($relatorios);
} else {
    http_response_code(404);
    echo json_encode(["message" => "Nenhum relatório encontrado."]);
}
?>