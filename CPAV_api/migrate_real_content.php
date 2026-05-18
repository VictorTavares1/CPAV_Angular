<?php
/**
 * Migração de conteúdo REAL do site antigo (htdocs/3L_TIS) para a BD centros_paroquiais.
 * Substitui dados placeholder/teste por conteúdo real extraído do HTML/PHP antigo.
 * Idempotente: pode ser executado várias vezes.
 */
$pdo = new PDO('mysql:host=localhost;dbname=centros_paroquiais;charset=utf8mb4', 'root', '');
$pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
$pdo->exec("SET NAMES utf8mb4");

/* ============================================================
   1. PAGE_CONTENTS — conteúdo real de index.php e sobreNos.php
   ============================================================ */
$pageContents = [
    // page_name, section_key, content_type, content_value
    ['home', 'hero_title', 'text', 'Centro Paroquial de São Lourenço de Alhos Vedros'],
    ['home', 'hero_description', 'text', 'Somos uma IPSS com trabalho diário na infância, juventude, apoio domiciliário e projetos comunitários. Priorizamos proximidade, confiança e um acompanhamento consistente às famílias e à população mais vulnerável.'],
    ['home', 'servicos_description', 'text', 'Entra diretamente em cada resposta social. Aqui o foco é navegação rápida e clara, com chamadas fortes e texto real, sem "cartões".'],
    ['sobre-nos', 'quem_somos', 'text', 'O Centro Social Paroquial de São Lourenço de Alhos Vedros é uma Instituição Particular de Solidariedade Social (IPSS) da Igreja Católica, pertencente à Paróquia de São Lourenço de Alhos Vedros. Inicialmente criado como espaço de apoio à comunidade paroquial, o Centro iniciou a sua atividade como Jardim de Infância em outubro de 1973, com o objetivo de apoiar as famílias trabalhadoras da freguesia. Ao longo dos anos, foi alargando a sua intervenção social, respondendo às necessidades da comunidade em diferentes fases da vida.'],
    ['sobre-nos', 'missao', 'text', 'Promover o bem-estar e a inclusão social, prestando apoio às crianças, famílias e população sénior, com base em valores de solidariedade, respeito e dignidade humana.'],
    ['sobre-nos', 'visao', 'text', 'Ser uma referência na intervenção social da comunidade local, contribuindo para uma sociedade mais justa, coesa e humana.'],
    ['sobre-nos', 'valores', 'text', 'Solidariedade, responsabilidade social, proximidade, respeito pelo outro e compromisso com a comunidade.'],
];

// Upsert por (Page_name, section_key) — atualiza se existir, insere se não
$find = $pdo->prepare("SELECT id FROM page_contents WHERE Page_name = :p AND section_key = :k");
$upd  = $pdo->prepare("UPDATE page_contents SET content_type = :t, content_value = :v, updated_at = NOW() WHERE id = :id");
$ins  = $pdo->prepare("INSERT INTO page_contents (Page_name, section_key, content_type, content_value, updated_at) VALUES (:p, :k, :t, :v, NOW())");
foreach ($pageContents as [$p, $k, $t, $v]) {
    $find->execute([':p' => $p, ':k' => $k]);
    $row = $find->fetch(PDO::FETCH_ASSOC);
    if ($row) {
        $upd->execute([':t' => $t, ':v' => $v, ':id' => $row['id']]);
        echo "page_contents ATUALIZADO: $p / $k\n";
    } else {
        $ins->execute([':p' => $p, ':k' => $k, ':t' => $t, ':v' => $v]);
        echo "page_contents INSERIDO:  $p / $k\n";
    }
}

/* ============================================================
   2. CONTACTS — contactos reais (rodapé + página contactos)
   Remove dados de teste/placeholder e insere os reais.
   ============================================================ */
$pdo->exec("DELETE FROM contacts");
$pdo->exec("ALTER TABLE contacts AUTO_INCREMENT = 1");
$contacts = [
    ['Morada',   'Largo da Igreja, Alhos Vedros', 'fa-solid fa-location-dot', 1],
    ['Telefone', '212 043 425',                   'fa-solid fa-phone',        1],
    ['Email',    'cspslav@hotmail.com',           'fa-solid fa-envelope',     1],
];
$insC = $pdo->prepare("INSERT INTO contacts (type, value, icon, idState) VALUES (:t, :v, :i, :s)");
foreach ($contacts as [$t, $v, $i, $s]) {
    $insC->execute([':t' => $t, ':v' => $v, ':i' => $i, ':s' => $s]);
    echo "contacts INSERIDO: $t = $v\n";
}

/* ============================================================
   3. SERVICES — 6 valências reais (servicos/servicos.php)
   ============================================================ */
$pdo->exec("DELETE FROM services");
$pdo->exec("ALTER TABLE services AUTO_INCREMENT = 1");
$services = [
    ['Pré-Escolar', 'Educação pré-escolar para crianças dos 3 aos 6 anos, em ambiente seguro e estimulante.', '/images/servicos/sala_pre_escolar_alhos_vedros.png', 1],
    ['Centro de Atividades de Tempos Livres (CATL)', 'Acolhimento de crianças em idade escolar com atividades pedagógicas, lúdicas e apoio ao desenvolvimento.', '/images/servicos/salalaranja.png', 1],
    ['Serviço de Apoio Domiciliário (SAD)', 'Apoio a idosos e pessoas com dependência no domicílio, garantindo qualidade de vida e autonomia.', '/images/servicos/apoio_domiciliario.png', 1],
    ['Centro Comunitário P.A.R.A.G.E.M', 'Espaço de encontro e convívio com atividades socioculturais para todas as idades.', '/images/servicos/paragem_interior.png', 1],
    ['Apoio ao Estudo', 'Acompanhamento escolar personalizado do 1º ao 3º ciclo, promovendo o sucesso educativo.', '/images/servicos/catl_entrada.png', 1],
    ['Centro Social Nossa Senhora de Belém', 'Resposta social com foco no acolhimento, acompanhamento educativo e apoio ao desenvolvimento de crianças e jovens.', '/images/servicos/sala_arco_iris_exterior.png', 1],
];
$insS = $pdo->prepare("INSERT INTO services (title, description, icon_or_image, idState, created_at, updated_at) VALUES (:t, :d, :i, :s, NOW(), NOW())");
foreach ($services as [$t, $d, $i, $s]) {
    $insS->execute([':t' => $t, ':d' => $d, ':i' => $i, ':s' => $s]);
    echo "services INSERIDO: $t\n";
}

echo "\n=== MIGRAÇÃO CONCLUÍDA ===\n";
?>
