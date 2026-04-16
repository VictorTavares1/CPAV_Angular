<?php
class Database {
    private $host = "localhost";
    private $db_name = "centros_paroquiais"; // Escreva aqui o nome da sua base de dados
    private $username = "root";
    private $password = "";
    public $conn;

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