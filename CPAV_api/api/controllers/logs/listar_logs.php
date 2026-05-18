<?php
require_once "../../config/header.php";
require_once "../../config/require_auth.php";
require_once "../../config/database.php";
require_once "../../models/log.php";

if ($_SERVER['REQUEST_METHOD'] !== 'GET') {
    http_response_code(405);
    echo json_encode(["message" => "Método não permitido."]);
    exit;
}

$page        = max(1, (int)($_GET['page']        ?? 1));
$perPage     = max(1, min(100, (int)($_GET['perPage']  ?? 50)));
$operationId = (int)($_GET['operationId'] ?? 0);
$dateFrom    = $_GET['dateFrom'] ?? null;
$dateTo      = $_GET['dateTo']   ?? null;

if ($dateFrom && !preg_match('/^\d{4}-\d{2}-\d{2}$/', $dateFrom)) $dateFrom = null;
if ($dateTo   && !preg_match('/^\d{4}-\d{2}-\d{2}$/', $dateTo))   $dateTo   = null;

$database = new Database();
$db = $database->getConnection();
$log = new Log($db);

$total      = $log->contar($operationId, $dateFrom, $dateTo);
$totalPages = $perPage > 0 ? (int)ceil($total / $perPage) : 1;

$stmt = $log->lerPaginados($page, $perPage, $operationId, $dateFrom, $dateTo);
$logs = [];
while ($row = $stmt->fetch(PDO::FETCH_ASSOC)) {
    $logs[] = $row;
}

$opStmt     = $log->lerOperacoes();
$operations = $opStmt->fetchAll(PDO::FETCH_ASSOC);

http_response_code(200);
echo json_encode([
    "data"       => $logs,
    "total"      => $total,
    "page"       => $page,
    "perPage"    => $perPage,
    "totalPages" => $totalPages,
    "operations" => $operations,
]);
?>
