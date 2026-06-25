<?php
require_once "../../config/header.php";
require_once "../../config/require_auth.php";
require_once "../../config/database.php";
require_once "../../models/servico.php";
require_once "../../models/log.php";

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode(["message" => "Método não permitido."]);
    exit;
}

$contentType = isset($_SERVER['CONTENT_TYPE']) ? $_SERVER['CONTENT_TYPE'] : '';
$isMultipart = strpos($contentType, 'multipart/form-data') !== false;

if ($isMultipart) {
    $id            = (int)($_POST['id']            ?? 0);
    $title         = trim($_POST['title']         ?? '');
    $description   = trim($_POST['description']   ?? '');
    $icon_or_image = trim($_POST['icon_or_image'] ?? '');
} else {
    $data          = json_decode(file_get_contents("php://input"));
    $id            = (int)($data->id            ?? 0);
    $title         = trim($data->title         ?? '');
    $description   = trim($data->description   ?? '');
    $icon_or_image = trim($data->icon_or_image ?? '');
}

if (!$id || empty($title) || empty($description)) {
    http_response_code(400);
    echo json_encode(["message" => "Dados incompletos."]);
    exit;
}

// Tratar upload de imagem opcional
if (isset($_FILES['imagem']) && $_FILES['imagem']['error'] === UPLOAD_ERR_OK) {
    $allowedTypes = ['image/jpeg', 'image/png', 'image/webp'];
    $maxSize      = 0.5 * 1024 * 1024;

    $mime = mime_content_type($_FILES['imagem']['tmp_name']);

    if (!in_array($mime, $allowedTypes)) {
        http_response_code(400);
        echo json_encode(["message" => "Formato inválido. Só JPG, PNG ou WEBP."]);
        exit;
    }

    if ($_FILES['imagem']['size'] > $maxSize) {
        http_response_code(400);
        echo json_encode(["message" => "Imagem demasiado grande. Máx. 500kb."]);
        exit;
    }

    $uploadDir = __DIR__ . '/../../../uploads/servicos/';
    if (!is_dir($uploadDir)) {
        mkdir($uploadDir, 0755, true);
    }

    $ext = match($mime) {
        'image/jpeg' => 'jpg',
        'image/png'  => 'png',
        'image/webp' => 'webp',
        default      => 'jpg',
    };

    $base = pathinfo(basename($_FILES['imagem']['name']), PATHINFO_FILENAME);
    $base = preg_replace('/[^\p{L}\p{N}\-_]+/u', '_', $base);
    $base = trim($base, '_');
    if ($base === '') $base = 'servico';

    $filename = $base . '.' . $ext;
    $dest     = $uploadDir . $filename;
    $i = 1;
    while (file_exists($dest)) {
        $filename = $base . '_' . $i . '.' . $ext;
        $dest     = $uploadDir . $filename;
        $i++;
    }

    if (!move_uploaded_file($_FILES['imagem']['tmp_name'], $dest)) {
        http_response_code(500);
        echo json_encode(["message" => "Erro ao guardar a imagem."]);
        exit;
    }

    $icon_or_image = 'servicos/' . $filename;
}

if (empty($icon_or_image)) {
    http_response_code(400);
    echo json_encode(["message" => "A imagem é obrigatória."]);
    exit;
}

$database = new Database();
$db       = $database->getConnection();
$servico  = new Servico($db);

if ($servico->editar($id, $title, $description, $icon_or_image)) {
    $log = new Log($db);
    $log->inserir($_SESSION['idUser'], 17, null, null, null, $title);
    http_response_code(200);
    echo json_encode(["message" => "Serviço atualizado com sucesso."]);
} else {
    http_response_code(500);
    echo json_encode(["message" => "Erro ao atualizar o serviço."]);
}
?>
