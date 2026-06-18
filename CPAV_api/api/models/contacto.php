<?php
class Contacto {
    private $conn;
    private $table_name = "contacts";

    public function __construct($db) {
        $this->conn = $db;
    }

    public function lerAtivos($category = null) {
        $query = "SELECT id, type, value, icon, category
                  FROM " . $this->table_name . "
                  WHERE idState = 1";
        if ($category !== null) {
            $query .= " AND category = :category";
        }
        $query .= " ORDER BY id ASC";
        $stmt = $this->conn->prepare($query);
        if ($category !== null) {
            $stmt->bindParam(':category', $category);
        }
        $stmt->execute();
        return $stmt;
    }

    public function lerTodos() {
        $query = "SELECT id, type, value, icon, category, idState
                  FROM " . $this->table_name . "
                  ORDER BY id ASC";
        $stmt = $this->conn->prepare($query);
        $stmt->execute();
        return $stmt;
    }

    public function lerPorId($id) {
        $query = "SELECT id, type, value, icon, category, idState
                  FROM " . $this->table_name . "
                  WHERE id = :id";
        $stmt = $this->conn->prepare($query);
        $stmt->bindParam(':id', $id, PDO::PARAM_INT);
        $stmt->execute();
        return $stmt;
    }

    public function inserir($type, $value, $icon, $category) {
        $query = "INSERT INTO " . $this->table_name . "
                  (type, value, icon, category)
                  VALUES (:type, :value, :icon, :category)";
        $stmt = $this->conn->prepare($query);
        $stmt->bindParam(":type", $type);
        $stmt->bindParam(":value", $value);
        $stmt->bindParam(":icon", $icon);
        $stmt->bindParam(":category", $category);
        if ($stmt->execute()) {
            return (int)$this->conn->lastInsertId();
        }
        return 0;
    }
public function toggleState($id) {
    $query = "UPDATE " . $this->table_name . "
              SET idState = IF(idState = 1, 2, 1)
              WHERE id = :id";

    $stmt = $this->conn->prepare($query);
    $stmt->bindParam(":id", $id);

    return $stmt->execute();
}
public function editar($id, $type, $value, $icon, $category) {
    $query = "UPDATE " . $this->table_name . "
              SET type = :type, value = :value, icon = :icon, category = :category
              WHERE id = :id";

    $stmt = $this->conn->prepare($query);
    $stmt->bindParam(":id", $id);
    $stmt->bindParam(":type", $type);
    $stmt->bindParam(":value", $value);
    $stmt->bindParam(":icon", $icon);
    $stmt->bindParam(":category", $category);

    return $stmt->execute();
}
}
?>