<?php
require_once "../../config/header.php";
require_once "../../config/require_auth.php";
require_once "../../config/database.php";
require_once "../../models/noticia.php";
require_once "../../models/log.php";

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode(["message" => "Método não permitido."]);
    exit;
}

// Suporta FormData (multipart) e JSON
$contentType = isset($_SERVER['CONTENT_TYPE']) ? $_SERVER['CONTENT_TYPE'] : '';
$isMultipart = strpos($contentType, 'multipart/form-data') !== false;

if ($isMultipart) {
    $id       = (int)($_POST['id']      ?? 0);
    $title    = trim($_POST['title']    ?? '');
    $content  = trim($_POST['content']  ?? '');
    // imagensRemover pode chegar como CSV (ex: "12,15,18")
    $removerCsv = trim($_POST['imagensRemover'] ?? '');
    $imagensRemover = $removerCsv === '' ? [] : array_filter(array_map('intval', explode(',', $removerCsv)));
} else {
    $data    = json_decode(file_get_contents("php://input"));
    $id      = (int)($data->id      ?? 0);
    $title   = trim($data->title    ?? '');
    $content = trim($data->content  ?? '');
    $imagensRemover = isset($data->imagensRemover) && is_array($data->imagensRemover)
        ? array_map('intval', $data->imagensRemover)
        : [];
}

if (!$id || empty($title) || empty($content)) {
    http_response_code(400);
    echo json_encode(["message" => "ID, título e conteúdo são obrigatórios."]);
    exit;
}

$uploadDir    = __DIR__ . '/../../../uploads/';
$allowedTypes = ['image/jpeg', 'image/png', 'image/webp'];
$maxSize      = 0.5 * 1024 * 1024;

// Normaliza ficheiros novos (esperados em $_FILES['images'])
$ficheiros = [];
if (isset($_FILES['images']) && is_array($_FILES['images']['name'])) {
    $n = count($_FILES['images']['name']);
    for ($i = 0; $i < $n; $i++) {
        if (empty($_FILES['images']['name'][$i])) continue;
        $ficheiros[] = [
            'name'     => $_FILES['images']['name'][$i],
            'type'     => $_FILES['images']['type'][$i],
            'tmp_name' => $_FILES['images']['tmp_name'][$i],
            'error'    => $_FILES['images']['error'][$i],
            'size'     => $_FILES['images']['size'][$i],
        ];
    }
}

// Valida ficheiros antes de qualquer operação
foreach ($ficheiros as $file) {
    if (!in_array($file['type'], $allowedTypes)) {
        http_response_code(400);
        echo json_encode(["message" => "Formato inválido em '{$file['name']}'. Só JPG, PNG ou WEBP."]);
        exit;
    }
    if ($file['size'] > $maxSize) {
        http_response_code(400);
        echo json_encode(["message" => "A imagem '{$file['name']}' é demasiado grande. Máx. 500kb."]);
        exit;
    }
}

$database = new Database();
$db       = $database->getConnection();
$noticia  = new Noticia($db);

// Atualiza título e conteúdo
if (!$noticia->editar($id, $title, $content)) {
    http_response_code(500);
    echo json_encode(["message" => "Erro ao atualizar a notícia."]);
    exit;
}

// Remove imagens marcadas
$log = new Log($db);
foreach ($imagensRemover as $imgId) {
    $urlApagada = $noticia->apagarImagem($imgId);
    if ($urlApagada && file_exists($uploadDir . $urlApagada)) {
        @unlink($uploadDir . $urlApagada);
        $log->inserir($_SESSION['idUser'], 9, $id, null, null, $urlApagada);
    }
}

// Garante pasta de uploads
if (!empty($ficheiros) && !is_dir($uploadDir)) {
    mkdir($uploadDir, 0755, true);
}

// Adiciona novas imagens
$novas = [];
foreach ($ficheiros as $file) {
    $base = pathinfo(basename($file['name']), PATHINFO_FILENAME);
    $base = preg_replace('/[^\p{L}\p{N} \-_]+/u', '', $base);
    $base = trim($base);
    if ($base === '') $base = 'imagem';

    $ext       = pathinfo($file['name'], PATHINFO_EXTENSION);
    $ext       = strtolower($ext) ?: 'jpg';
    $filename  = $base . '.' . $ext;
    $dest      = $uploadDir . $filename;
    $i = 1;
    while (file_exists($dest)) {
        $filename = $base . '_' . $i . '.' . $ext;
        $dest     = $uploadDir . $filename;
        $i++;
    }

    if (move_uploaded_file($file['tmp_name'], $dest)) {
        $noticia->inserirImagem($id, $filename);
        $novas[] = $filename;
        $log->inserir($_SESSION['idUser'], 10, $id, null, null, $filename);
    }
}

$log->inserir($_SESSION['idUser'], 2, $id, null, null, $title);

http_response_code(200);
echo json_encode([
    "message"          => "Notícia atualizada com sucesso.",
    "imagensRemovidas" => $imagensRemover,
    "imagensNovas"     => $novas,
]);
?>
