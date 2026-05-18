<?php
require_once "../../config/header.php";
require_once "../../config/database.php";
require_once "../../models/page_content.php";

if ($_SERVER['REQUEST_METHOD'] !== 'GET') {
    http_response_code(405);
    echo json_encode(["message" => "Método não permitido."]);
    exit;
}

$database = new Database();
$db = $database->getConnection();

$pageContent = new PageContent($db);

$page_name = isset($_GET['page']) ? trim($_GET['page']) : null;

if ($page_name) {
    $stmt = $pageContent->lerPorPagina($page_name);
} else {
    $stmt = $pageContent->lerTodos();
}

$contents = [];
while ($row = $stmt->fetch(PDO::FETCH_ASSOC)) {
    $contents[] = $row;
}

http_response_code(200);
echo json_encode($contents);
?>
