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

$id = (int)($_GET['id'] ?? 0);
if ($id <= 0) {
    http_response_code(400);
    echo json_encode(["message" => "ID inválido."]);
    exit;
}

$database = new Database();
$db = $database->getConnection();

$facility = new Facility($db);
$stmt = $facility->lerServicosPorFacility($id);
$rows = $stmt->fetchAll(PDO::FETCH_ASSOC);

http_response_code(200);
echo json_encode($rows);
?>
