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
}
?>