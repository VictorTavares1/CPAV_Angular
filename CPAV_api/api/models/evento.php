<?php
class Evento {
    private $conn;
    private $table_name = "schedules";

    public function __construct($db) {
        $this->conn = $db;
    }

    public function lerAtivos() {
        $query = "SELECT sc.id, sc.title, sc.event_date, sc.event_time, l.name AS location
                  FROM " . $this->table_name . " sc
                  INNER JOIN locations l ON l.id = sc.idLocation
                  WHERE sc.idState = 1 AND l.idState = 1
                  ORDER BY sc.event_date ASC, sc.event_time ASC";
        $stmt = $this->conn->prepare($query);
        $stmt->execute();
        return $stmt;
    }
}
?>