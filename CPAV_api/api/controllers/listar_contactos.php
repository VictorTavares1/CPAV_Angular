<?php
require_once "../config/header.php";
require_once "../config/database.php";
require_once "../models/Contacto.php";

$database = new Database();
$db = $database->getConnection();

$contacto = new Contacto($db);
$stmt = $contacto->lerAtivos();

if($stmt->rowCount() > 0) {
    $contactos = array();
    while($row = $stmt->fetch(PDO::FETCH_ASSOC)) {
        array_push($contactos, $row);
    }
    http_response_code(200);
    echo json_encode($contactos);
} else {
    http_response_code(404);
    echo json_encode(["message" => "Nenhum contacto encontrado."]);
}
?>