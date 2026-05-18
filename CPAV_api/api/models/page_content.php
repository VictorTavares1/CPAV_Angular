<?php
class PageContent {
    private $conn;
    private $table_name = "page_contents";

    public function __construct($db) {
        $this->conn = $db;
    }

    public function lerTodos() {
        $query = "SELECT id, Page_name, section_key, content_type, content_value, updated_at
                  FROM " . $this->table_name . "
                  ORDER BY Page_name ASC, id ASC";
        $stmt = $this->conn->prepare($query);
        $stmt->execute();
        return $stmt;
    }

    public function lerPorPagina($page_name) {
        $query = "SELECT id, Page_name, section_key, content_type, content_value, updated_at
                  FROM " . $this->table_name . "
                  WHERE Page_name = :page_name
                  ORDER BY id ASC";
        $stmt = $this->conn->prepare($query);
        $stmt->bindParam(':page_name', $page_name);
        $stmt->execute();
        return $stmt;
    }

    public function lerPorId($id) {
        $query = "SELECT id, Page_name, section_key, content_type, content_value, updated_at
                  FROM " . $this->table_name . "
                  WHERE id = :id";
        $stmt = $this->conn->prepare($query);
        $stmt->bindParam(':id', $id, PDO::PARAM_INT);
        $stmt->execute();
        return $stmt;
    }

    public function editar($id, $content_value) {
        $query = "UPDATE " . $this->table_name . "
                  SET content_value = :content_value, updated_at = NOW()
                  WHERE id = :id";
        $stmt = $this->conn->prepare($query);
        $stmt->bindParam(':content_value', $content_value);
        $stmt->bindParam(':id', $id, PDO::PARAM_INT);
        return $stmt->execute();
    }
}
?>
