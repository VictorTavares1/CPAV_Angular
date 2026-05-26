<?php
// Política de password partilhada por todos os endpoints que aceitam passwords.
// Devolve null se a password cumprir todos os requisitos, ou uma mensagem
// de erro com a lista de requisitos em falta.

function validate_password_strength($password): ?string {
    $issues = [];
    if (strlen($password) < 8) {
        $issues[] = "ter pelo menos 8 carateres";
    }
    if (!preg_match('/[A-Z]/', $password)) {
        $issues[] = "conter pelo menos uma letra maiúscula";
    }
    if (!preg_match('/[0-9]/', $password)) {
        $issues[] = "conter pelo menos um número";
    }
    if (!preg_match('/[^A-Za-z0-9]/', $password)) {
        $issues[] = "conter pelo menos um carater especial";
    }
    if (empty($issues)) {
        return null;
    }
    return "A password deve " . implode(", ", $issues) . ".";
}
?>
