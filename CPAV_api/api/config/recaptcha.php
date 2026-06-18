<?php
/**
 * Verificação do Google reCAPTCHA v2.
 *
 * Envia o token recebido do cliente para a API do Google e devolve true
 * se Google confirmar que o token é válido (e que veio de um humano).
 *
 * → Substitui RECAPTCHA_SECRET_KEY pela tua chave secreta (a privada,
 *   que recebeste em https://www.google.com/recaptcha/admin).
 *   NUNCA partilhes esta chave nem a metas no frontend.
 */

const RECAPTCHA_SECRET_KEY = '6LcsPwctAAAAAAkUz37mZHhvZYnilwYxbOKL7-FG';

function verify_recaptcha($token): bool {
    if (empty($token)) {
        return false;
    }

    $url  = 'https://www.google.com/recaptcha/api/siteverify';
    $data = http_build_query([
        'secret'   => RECAPTCHA_SECRET_KEY,
        'response' => $token,
        'remoteip' => $_SERVER['REMOTE_ADDR'] ?? '',
    ]);

    // Preferir cURL se disponível, caso contrário usa file_get_contents.
    if (function_exists('curl_init')) {
        $ch = curl_init($url);
        curl_setopt($ch, CURLOPT_POST, true);
        curl_setopt($ch, CURLOPT_POSTFIELDS, $data);
        curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
        curl_setopt($ch, CURLOPT_TIMEOUT, 5);
        $response = curl_exec($ch);
        curl_close($ch);
    } else {
        $context = stream_context_create([
            'http' => [
                'method'  => 'POST',
                'header'  => 'Content-Type: application/x-www-form-urlencoded',
                'content' => $data,
                'timeout' => 5,
            ],
        ]);
        $response = @file_get_contents($url, false, $context);
    }

    if ($response === false) {
        // Falha de comunicação com o Google. Em produção convém logar isto.
        error_log('reCAPTCHA: falhou pedido ao Google.');
        return false;
    }

    $result = json_decode($response, true);
    return is_array($result) && !empty($result['success']);
}
?>
