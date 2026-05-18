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

// Imagem opcional
$imagemNome = null;
$uploadDir  = __DIR__ . '/../../../uploads/';

if (!empty($_FILES['image']['name'])) {
    $file         = $_FILES['image'];
    $allowedTypes = ['image/jpeg', 'image/png', 'image/webp'];
    $maxSize      = 0.5 * 1024 * 1024; // 500 KB

    if (!in_array($file['type'], $allowedTypes)) {
        http_response_code(400);
        echo json_encode(["message" => "Formato de imagem inválido. Só são permitidos JPG, PNG ou WEBP."]);
        exit;
    }

    if ($file['size'] > $maxSize) {
        http_response_code(400);
        echo json_encode(["message" => "A imagem é demasiado grande. O tamanho máximo é 500kb."]);
        exit;
    }

    if (!is_dir($uploadDir)) {
        mkdir($uploadDir, 0755, true);
    }

    $imagemNome = basename($file['name']);

    if (!move_uploaded_file($file['tmp_name'], $uploadDir . $imagemNome)) {
        http_response_code(500);
        echo json_encode(["message" => "Erro ao guardar a imagem. Tenta novamente."]);
        exit;
    }
}

$database = new Database();
$db       = $database->getConnection();

$noticia   = new Noticia($db);
$idNoticia = $noticia->inserir($title, $content, $imagemNome);

if ($idNoticia) {
    $log = new Log($db);
    $log->inserir($_SESSION['idUser'], 1, $idNoticia);

    http_response_code(201);
    echo json_encode([
        "message" => "Notícia inserida com sucesso.",
        "id"      => $idNoticia
    ]);
} else {
    if ($imagemNome && file_exists($uploadDir . $imagemNome)) {
        unlink($uploadDir . $imagemNome);
    }
    http_response_code(500);
    echo json_encode(["message" => "Erro ao inserir a notícia."]);
}
?>
