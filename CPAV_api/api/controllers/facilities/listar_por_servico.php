<?php
require_once "../../config/header.php";
require_once "../../config/database.php";
require_once "../../models/facility.php";

if ($_SERVER['REQUEST_METHOD'] !== 'GET') {
    http_response_code(405);
    echo json_encode(["message" => "Método não permitido."]);
    exit;
}

$service_key = trim($_GET['service_key'] ?? '');
if (empty($service_key)) {
    http_response_code(400);
    echo json_encode(["message" => "service_key é obrigatório."]);
    exit;
}

$database = new Database();
$db = $database->getConnection();

$facility = new Facility($db);
$stmt = $facility->lerPorServico($service_key);
$rows = $stmt->fetchAll(PDO::FETCH_ASSOC);

http_response_code(200);
echo json_encode($rows);
?>
