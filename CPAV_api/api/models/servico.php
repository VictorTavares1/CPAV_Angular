<?php
class Servico {
    private $conn;
    private $table_name = "services";

    public function __construct($db) {
        $this->conn = $db;
    }

    public function lerAtivos() {
        $query = "SELECT id, title, description, icon_or_image
                  FROM " . $this->table_name . "
                  WHERE idState = 1
                  ORDER BY id ASC";
        $stmt = $this->conn->prepare($query);
        $stmt->execute();
        return $stmt;
    }

    public function inserir($title, $description, $icon_or_image) {
    $query = "INSERT INTO " . $this->table_name . " 
              (title, description, icon_or_image) 
              VALUES (:title, :description, :icon_or_image)";

    $stmt = $this->conn->prepare($query);
    $stmt->bindParam(":title", $title);
    $stmt->bindParam(":description", $description);
    $stmt->bindParam(":icon_or_image", $icon_or_image);

    return $stmt->execute();
}
public function toggleState($id) {
    $query = "UPDATE " . $this->table_name . " 
              SET idState = IF(idState = 1, 2, 1) 
              WHERE id = :id";

    $stmt = $this->conn->prepare($query);
    $stmt->bindParam(":id", $id);

    return $stmt->execute();
}
public function editar($id, $title, $description, $icon_or_image) {
    $query = "UPDATE " . $this->table_name . " 
              SET title = :title, description = :description, icon_or_image = :icon_or_image
              WHERE id = :id";

    $stmt = $this->conn->prepare($query);
    $stmt->bindParam(":id", $id);
    $stmt->bindParam(":title", $title);
    $stmt->bindParam(":description", $description);
    $stmt->bindParam(":icon_or_image", $icon_or_image);

    return $stmt->execute();
}
}
?>