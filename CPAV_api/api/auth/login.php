<?php
require_once "../config/header.php";
require_once "../config/session_init.php";
require_once "../config/database.php";
require_once "../config/recaptcha.php";
require_once "../models/User.php";
require_once "../models/log.php";

// Lê os dados enviados pelo Angular em formato JSON
$data = json_decode(file_get_contents("php://input"));

if (
    !empty($data->email) &&
    !empty($data->password)
) {
    // Em localhost saltamos a verificação do reCAPTCHA para facilitar testes.
    $httpHost = $_SERVER['HTTP_HOST'] ?? '';
    $isLocal = strpos($httpHost, 'localhost') !== false || strpos($httpHost, '127.0.0.1') !== false;

    if (!$isLocal) {
        $captchaToken = $data->captchaToken ?? '';
        if (!verify_recaptcha($captchaToken)) {
            http_response_code(400);
            echo json_encode([
                "message" => "Verificação reCAPTCHA falhou. Tenta novamente."
            ]);
            exit;
        }
    }

    $database = new Database();
    $db = $database->getConnection();

    $user = new User($db);
    $loggedUser = $user->login($data->email, $data->password);

    if ($loggedUser) {

        // Sessão já inicializada via session_init.php no topo. Aqui só populamos.
        $_SESSION['idUser'] = $loggedUser['id'];
        $_SESSION['email']  = $loggedUser['email'];
        $_SESSION['role']   = $loggedUser['role'] ?? 'admin';

        $log = new Log($db);
        $log->inserir($loggedUser['id'], 11);

        http_response_code(200);
        echo json_encode([
            "message" => "Login efetuado com sucesso.",
            "idUser"  => $loggedUser['id'],
            "email"   => $loggedUser['email'],
            "role"    => $_SESSION['role']
        ]);
    } else {
        http_response_code(401);
        echo json_encode(["message" => "Email ou password incorretos."]);
    }
} else {
    http_response_code(400);
    echo json_encode(["message" => "Email e password são obrigatórios."]);
}
?>