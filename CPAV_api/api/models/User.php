<?php
class User {
    private $conn;
    private $table_name = "users";

    public function __construct($db) {
        $this->conn = $db;
    }

    public function login($email, $password) {
        $passwordHash = md5($password); // Mantém o teu md5 atual

        $query = "SELECT id, email 
                  FROM " . $this->table_name . " 
                  WHERE email = :email 
                  AND password = :password 
                  AND idState = 1 
                  LIMIT 1";

        $stmt = $this->conn->prepare($query);
        $stmt->bindParam(":email", $email);
        $stmt->bindParam(":password", $passwordHash);
        $stmt->execute();

        return $stmt;
    }
}
?>