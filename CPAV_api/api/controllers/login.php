<?php
require_once "../config/header.php";
require_once "../config/database.php";
require_once "../models/User.php";

// Lê os dados enviados pelo Angular em formato JSON
$data = json_decode(file_get_contents("php://input"));

if (
    !empty($data->email) &&
    !empty($data->password)
) {
    $database = new Database();
    $db = $database->getConnection();

    $user = new User($db);
    $stmt = $user->login($data->email, $data->password);

    if ($stmt->rowCount() > 0) {
        $row = $stmt->fetch(PDO::FETCH_ASSOC);

        // Inicia a sessão e guarda o id do utilizador
        session_start();
        $_SESSION['idUser'] = $row['id'];
        $_SESSION['email'] = $row['email'];

        http_response_code(200);
        echo json_encode([
            "message" => "Login efetuado com sucesso.",
            "idUser" => $row['id'],
            "email" => $row['email']
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