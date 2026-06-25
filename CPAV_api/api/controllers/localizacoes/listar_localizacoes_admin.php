<?php
require_once "../../config/header.php";
require_once "../../config/require_auth.php";
require_once "../../config/database.php";
require_once "../../models/location.php";

if ($_SERVER['REQUEST_METHOD'] !== 'GET') {
    http_response_code(405); echo json_encode(["message" => "Método não permitido."]); exit;
}

$db = (new Database())->getConnection();
$loc = new Location($db);
$stmt = $loc->lerTodos();
$rows = [];
while ($row = $stmt->fetch(PDO::FETCH_ASSOC)) {
    $row['idState'] = (int)$row['idState'];
    $rows[] = $row;
}
http_response_code(200);
echo json_encode($rows);
?>
