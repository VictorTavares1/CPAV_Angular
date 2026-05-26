<?php
class User {
    private $conn;
    private $table_name = "users";

    public function __construct($db) {
        $this->conn = $db;
    }

    // ---- Autenticação ----

    public function login($email, $password) {
        $query = "SELECT id, email, password, role
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

        // Formato seguro (password_hash).
        if (password_verify($password, $storedPassword)) {
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

    public function verificarPassword($id, $password) {
        $stmt = $this->conn->prepare("SELECT password FROM " . $this->table_name . " WHERE id = :id LIMIT 1");
        $stmt->bindParam(":id", $id, PDO::PARAM_INT);
        $stmt->execute();
        $row = $stmt->fetch(PDO::FETCH_ASSOC);
        if (!$row) return false;
        return password_verify($password, $row['password']) || md5($password) === $row['password'];
    }

    private function updatePasswordHash($id, $newHash) {
        $query = "UPDATE " . $this->table_name . " SET password = :password WHERE id = :id";
        $stmt = $this->conn->prepare($query);
        $stmt->bindParam(":password", $newHash);
        $stmt->bindParam(":id", $id);
        return $stmt->execute();
    }

    // ---- CRUD para gestão de utilizadores ----

    public function lerTodos() {
        $query = "SELECT id, email, role, idState
                  FROM " . $this->table_name . "
                  ORDER BY role DESC, id ASC";
        $stmt = $this->conn->prepare($query);
        $stmt->execute();
        return $stmt;
    }

    public function lerPorId($id) {
        $query = "SELECT id, email, role, idState
                  FROM " . $this->table_name . "
                  WHERE id = :id";
        $stmt = $this->conn->prepare($query);
        $stmt->bindParam(":id", $id, PDO::PARAM_INT);
        $stmt->execute();
        return $stmt;
    }

    public function emailExiste($email, $idIgnorar = null) {
        $query = "SELECT id FROM " . $this->table_name . " WHERE email = :email";
        if ($idIgnorar !== null) {
            $query .= " AND id != :id";
        }
        $stmt = $this->conn->prepare($query);
        $stmt->bindParam(":email", $email);
        if ($idIgnorar !== null) {
            $stmt->bindParam(":id", $idIgnorar, PDO::PARAM_INT);
        }
        $stmt->execute();
        return $stmt->fetch() !== false;
    }

    public function inserir($email, $password, $role) {
        $hash = password_hash($password, PASSWORD_DEFAULT);
        $query = "INSERT INTO " . $this->table_name . "
                  (email, password, role, idState)
                  VALUES (:email, :password, :role, 1)";
        $stmt = $this->conn->prepare($query);
        $stmt->bindParam(":email", $email);
        $stmt->bindParam(":password", $hash);
        $stmt->bindParam(":role", $role);
        if ($stmt->execute()) {
            return (int)$this->conn->lastInsertId();
        }
        return 0;
    }

    public function editar($id, $email, $role) {
        $query = "UPDATE " . $this->table_name . "
                  SET email = :email, role = :role
                  WHERE id = :id";
        $stmt = $this->conn->prepare($query);
        $stmt->bindParam(":id", $id, PDO::PARAM_INT);
        $stmt->bindParam(":email", $email);
        $stmt->bindParam(":role", $role);
        return $stmt->execute();
    }

    public function mudarPassword($id, $novaPassword) {
        $hash = password_hash($novaPassword, PASSWORD_DEFAULT);
        return $this->updatePasswordHash($id, $hash);
    }

    public function toggleState($id) {
        $query = "UPDATE " . $this->table_name . "
                  SET idState = IF(idState = 1, 2, 1)
                  WHERE id = :id";
        $stmt = $this->conn->prepare($query);
        $stmt->bindParam(":id", $id, PDO::PARAM_INT);
        return $stmt->execute();
    }

    public function contarSuperAdminsAtivos($idIgnorar = null) {
        $query = "SELECT COUNT(*) FROM " . $this->table_name . "
                  WHERE role = 'super_admin' AND idState = 1";
        if ($idIgnorar !== null) {
            $query .= " AND id != :id";
        }
        $stmt = $this->conn->prepare($query);
        if ($idIgnorar !== null) {
            $stmt->bindParam(":id", $idIgnorar, PDO::PARAM_INT);
        }
        $stmt->execute();
        return (int)$stmt->fetchColumn();
    }
}
?>
