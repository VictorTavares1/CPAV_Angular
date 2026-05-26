<?php
require_once "../../config/header.php";
require_once "../../config/require_super_admin.php";
require_once "../../config/database.php";
require_once "../../models/User.php";

if ($_SERVER['REQUEST_METHOD'] !== 'GET') {
    http_response_code(405);
    echo json_encode(["message" => "Método não permitido."]);
    exit;
}

$database = new Database();
$db = $database->getConnection();

$user = new User($db);
$stmt = $user->lerTodos();

$rows = [];
while ($row = $stmt->fetch(PDO::FETCH_ASSOC)) {
    $row['idState'] = (int)$row['idState'];
    $rows[] = $row;
}

http_response_code(200);
echo json_encode($rows);
?>
