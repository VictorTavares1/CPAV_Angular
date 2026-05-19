<?php
require_once "../../config/header.php";
require_once "../../config/database.php";
require_once "../../models/contacto.php";

if ($_SERVER['REQUEST_METHOD'] !== 'GET') {
    http_response_code(405);
    echo json_encode(["message" => "Método não permitido."]);
    exit;
}

$database = new Database();
$db = $database->getConnection();

$contacto = new Contacto($db);
$category = isset($_GET['category']) && $_GET['category'] !== '' ? $_GET['category'] : null;
$stmt = $contacto->lerAtivos($category);

if($stmt->rowCount() > 0) {
    $contactos = array();
    while($row = $stmt->fetch(PDO::FETCH_ASSOC)) {
        array_push($contactos, $row);
    }
    http_response_code(200);
    echo json_encode($contactos);
} else {
    http_response_code(200);
    echo json_encode([]);
}
?>