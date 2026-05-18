<?php
require_once "../../config/header.php";
require_once "../../config/require_auth.php";
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
$stmt = $contacto->lerTodos();

$contactos = [];
while ($row = $stmt->fetch(PDO::FETCH_ASSOC)) {
    $row['idState'] = (int)$row['idState'];
    $contactos[] = $row;
}

http_response_code(200);
echo json_encode($contactos);
?>
