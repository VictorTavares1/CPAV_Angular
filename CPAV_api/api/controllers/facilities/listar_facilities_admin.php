<?php
require_once "../../config/header.php";
require_once "../../config/require_auth.php";
require_once "../../config/database.php";
require_once "../../models/facility.php";

if ($_SERVER['REQUEST_METHOD'] !== 'GET') {
    http_response_code(405);
    echo json_encode(["message" => "Método não permitido."]);
    exit;
}

$database = new Database();
$db = $database->getConnection();

$facility = new Facility($db);
$stmt = $facility->lerTodos();

$rows = [];
while ($row = $stmt->fetch(PDO::FETCH_ASSOC)) {
    $row['sort_order'] = (int)$row['sort_order'];
    $row['idState']    = (int)$row['idState'];
    $rows[] = $row;
}

http_response_code(200);
echo json_encode($rows);
?>
