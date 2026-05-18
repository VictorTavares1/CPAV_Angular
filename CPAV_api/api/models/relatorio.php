<?php
class Relatorio {
    private $conn;
    private $table_name = "reports";

    public function __construct($db) {
        $this->conn = $db;
    }

    public function lerTodos() {
        $query = "SELECT r.id, r.title, r.url, t.type AS typeName, r.idState
                  FROM " . $this->table_name . " r
                  INNER JOIN types t ON r.idType = t.id
                  ORDER BY r.id DESC";
        $stmt = $this->conn->prepare($query);
        $stmt->execute();
        return $stmt;
    }

    public function lerTipos() {
        $stmt = $this->conn->prepare("SELECT id, type FROM types ORDER BY id ASC");
        $stmt->execute();
        return $stmt;
    }

    public function lerAtivos() {
        $query = "SELECT r.id, r.title, r.url, t.type AS typeName
                  FROM " . $this->table_name . " r
                  INNER JOIN types t ON r.idType = t.id
                  WHERE r.idState = 1
                  ORDER BY r.id DESC";
        $stmt = $this->conn->prepare($query);
        $stmt->execute();
        return $stmt;
    }

    public function inserir($title, $url, $idType) {
    $query = "INSERT INTO " . $this->table_name . " 
              (title, url, idType) 
              VALUES (:title, :url, :idType)";

    $stmt = $this->conn->prepare($query);
    $stmt->bindParam(":title", $title);
    $stmt->bindParam(":url", $url);
    $stmt->bindParam(":idType", $idType);

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
}
?>