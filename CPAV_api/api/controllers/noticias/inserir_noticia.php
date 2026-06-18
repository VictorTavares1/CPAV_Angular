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
if (strpos($contentType, 'multipart/form-data') !== false) {
    $title   = trim(isset($_POST['title'])   ? $_POST['title']   : '');
    $content = trim(isset($_POST['content']) ? $_POST['content'] : '');
} else {
    $data    = json_decode(file_get_contents("php://input"));
    $title   = trim(isset($data->title)   ? $data->title   : '');
    $content = trim(isset($data->content) ? $data->content : '');
}

if (empty($title) || empty($content)) {
    http_response_code(400);
    echo json_encode(["message" => "Título e conteúdo são obrigatórios."]);
    exit;
}

$uploadDir    = __DIR__ . '/../../../uploads/';
$allowedTypes = ['image/jpeg', 'image/png', 'image/webp'];
$maxSize      = 0.5 * 1024 * 1024; // 500 KB

// Normaliza o $_FILES para uma lista uniforme, aceitando tanto
// $_FILES['image'] (singular, legacy) como $_FILES['images'][] (múltiplas)
$ficheiros = [];
if (!empty($_FILES['image']['name'])) {
    $ficheiros[] = $_FILES['image'];
}
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

if (!empty($ficheiros) && !is_dir($uploadDir)) {
    mkdir($uploadDir, 0755, true);
}

// Valida todos antes de gravar nada
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

$idNoticia = $noticia->inserir($title, $content);
if (!$idNoticia) {
    http_response_code(500);
    echo json_encode(["message" => "Erro ao inserir a notícia."]);
    exit;
}

// Move ficheiros e regista imagens
$gravados = [];
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
        $noticia->inserirImagem($idNoticia, $filename);
        $gravados[] = $filename;
    }
}

$log = new Log($db);
$log->inserir($_SESSION['idUser'], 1, $idNoticia, null, null, $title);

http_response_code(201);
echo json_encode([
    "message" => "Notícia inserida com sucesso.",
    "id"      => $idNoticia,
    "images"  => $gravados,
]);
?>
