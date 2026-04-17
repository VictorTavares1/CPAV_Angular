<?php
class Relatorio {
    private $conn;
    private $table_name = "reports";

    public function __construct($db) {
        $this->conn = $db;
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
}
?>