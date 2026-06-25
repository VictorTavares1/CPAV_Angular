<?php
class Location {
    private $conn;
    private $table_name = "locations";

    public function __construct($db) {
        $this->conn = $db;
    }

    public function lerTodos() {
        $stmt = $this->conn->prepare(
            "SELECT id, name, idState FROM {$this->table_name} ORDER BY name ASC"
        );
        $stmt->execute();
        return $stmt;
    }

    public function lerAtivos() {
        $stmt = $this->conn->prepare(
            "SELECT id, name FROM {$this->table_name} WHERE idState = 1 ORDER BY name ASC"
        );
        $stmt->execute();
        return $stmt;
    }

    public function lerPorId($id) {
        $stmt = $this->conn->prepare(
            "SELECT id, name, idState FROM {$this->table_name} WHERE id = :id"
        );
        $stmt->bindValue(':id', (int)$id, PDO::PARAM_INT);
        $stmt->execute();
        return $stmt->fetch(PDO::FETCH_ASSOC);
    }

    public function inserir($name) {
        $stmt = $this->conn->prepare(
            "INSERT INTO {$this->table_name} (name) VALUES (:name)"
        );
        $stmt->bindValue(':name', $name);
        if ($stmt->execute()) {
            return (int)$this->conn->lastInsertId();
        }
        return 0;
    }

    public function editar($id, $name) {
        $stmt = $this->conn->prepare(
            "UPDATE {$this->table_name} SET name = :name WHERE id = :id"
        );
        $stmt->bindValue(':name', $name);
        $stmt->bindValue(':id', (int)$id, PDO::PARAM_INT);
        return $stmt->execute();
    }

    public function toggleState($id) {
        $stmt = $this->conn->prepare(
            "UPDATE {$this->table_name} SET idState = IF(idState = 1, 2, 1) WHERE id = :id"
        );
        $stmt->bindValue(':id', (int)$id, PDO::PARAM_INT);
        return $stmt->execute();
    }

    public function nomeExiste($name, $excludeId = 0) {
        $stmt = $this->conn->prepare(
            "SELECT id FROM {$this->table_name} WHERE name = :name AND id != :excludeId"
        );
        $stmt->bindValue(':name', $name);
        $stmt->bindValue(':excludeId', (int)$excludeId, PDO::PARAM_INT);
        $stmt->execute();
        return $stmt->fetch() !== false;
    }
}
?>
