<?php
class Contacto {
    private $conn;
    private $table_name = "Contacts";

    public function __construct($db) {
        $this->conn = $db;
    }

    public function lerAtivos() {
        $query = "SELECT type, value, icon
                  FROM " . $this->table_name . "
                  WHERE idState = 1";
        $stmt = $this->conn->prepare($query);
        $stmt->execute();
        return $stmt;
    }

    public function inserir($type, $value, $icon) {
    $query = "INSERT INTO " . $this->table_name . " 
              (type, value, icon) 
              VALUES (:type, :value, :icon)";

    $stmt = $this->conn->prepare($query);
    $stmt->bindParam(":type", $type);
    $stmt->bindParam(":value", $value);
    $stmt->bindParam(":icon", $icon);

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
public function editar($id, $type, $value, $icon) {
    $query = "UPDATE " . $this->table_name . " 
              SET type = :type, value = :value, icon = :icon
              WHERE id = :id";

    $stmt = $this->conn->prepare($query);
    $stmt->bindParam(":id", $id);
    $stmt->bindParam(":type", $type);
    $stmt->bindParam(":value", $value);
    $stmt->bindParam(":icon", $icon);

    return $stmt->execute();
}
}
?>