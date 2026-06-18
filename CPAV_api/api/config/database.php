<?php
class Database {
    private $host;
    private $db_name;
    private $username;
    private $password;
    public $conn;

    public function __construct() {
        $httpHost = $_SERVER['HTTP_HOST'] ?? '';
        $isLocal = (
            strpos($httpHost, 'localhost') !== false ||
            strpos($httpHost, '127.0.0.1') !== false
        );

        if ($isLocal) {
            $this->host     = "localhost";
            $this->db_name  = "centros_paroquiais";
            $this->username = "root";
            $this->password = "";
        } else {
            $this->host     = "cspsla-bd.db.tb-hosting.com";
            $this->db_name  = "cspsla_bd";
            $this->username = "cspsla_admin";
            $this->password = "SaoLourenco26!";
        }
    }

    public function getConnection() {
        $this->conn = null;
        try {
            $this->conn = new PDO("mysql:host=" . $this->host . ";dbname=" . $this->db_name, $this->username, $this->password);
            $this->conn->exec("set names utf8");
        } catch(PDOException $exception) {
            echo "Erro na ligação: " . $exception->getMessage();
        }
        return $this->conn;
    }
}
?>
