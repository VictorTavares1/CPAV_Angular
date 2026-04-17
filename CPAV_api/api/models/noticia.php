<?php
class Noticia {
    private $conn;
    private $table_name = "news";

    public function __construct($db) {
        $this->conn = $db;
    }

    public function lerTodas() {
        $query = "SELECT id, title, content, dateHour, idState 
                  FROM " . $this->table_name . " 
                  ORDER BY dateHour DESC";
        $stmt = $this->conn->prepare($query);
        $stmt->execute();
        return $stmt;
    }

    public function lerAtivas() {
        $query = "SELECT id, title, content, dateHour 
                  FROM " . $this->table_name . " 
                  WHERE idState = 1
                  ORDER BY dateHour DESC";
        $stmt = $this->conn->prepare($query);
        $stmt->execute();
        return $stmt;
    }

    public function inserir($title, $content) {
        $query = "INSERT INTO " . $this->table_name . " (title, content) 
                  VALUES (:title, :content)";
        $stmt = $this->conn->prepare($query);
        $stmt->bindParam(":title", $title);
        $stmt->bindParam(":content", $content);

        if ($stmt->execute()) {
            return $this->conn->lastInsertId();
        }
        return false;
    }
}
?>