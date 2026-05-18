<?php
class User {
    private $conn;
    private $table_name = "users";

    public function __construct($db) {
        $this->conn = $db;
    }

    public function login($email, $password) {
        $query = "SELECT id, email, password
                  FROM " . $this->table_name . "
                  WHERE email = :email
                  AND idState = 1
                  LIMIT 1";

        $stmt = $this->conn->prepare($query);
        $stmt->bindParam(":email", $email);
        $stmt->execute();

        $user = $stmt->fetch(PDO::FETCH_ASSOC);
        if (!$user) {
            return false;
        }

        $storedPassword = $user['password'];

        // Novo formato seguro.
        if (password_verify($password, $storedPassword)) {
            // Reforça segurança automaticamente se o custo/algoritmo mudar.
            if (password_needs_rehash($storedPassword, PASSWORD_DEFAULT)) {
                $this->updatePasswordHash($user['id'], password_hash($password, PASSWORD_DEFAULT));
            }
            return $user;
        }

        // Compatibilidade temporária com contas antigas em md5.
        if (md5($password) === $storedPassword) {
            $this->updatePasswordHash($user['id'], password_hash($password, PASSWORD_DEFAULT));
            return $user;
        }

        return false;
    }

    private function updatePasswordHash($id, $newHash) {
        $query = "UPDATE " . $this->table_name . " SET password = :password WHERE id = :id";
        $stmt = $this->conn->prepare($query);
        $stmt->bindParam(":password", $newHash);
        $stmt->bindParam(":id", $id);
        return $stmt->execute();
    }
}
?>