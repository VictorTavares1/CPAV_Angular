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
}
?>