<?php
class Evento {
    private $conn;
    private $table_name = "schedules";

    public function __construct($db) {
        $this->conn = $db;
    }

    public function lerTodos() {
        $query = "SELECT sc.id, sc.title, sc.event_date, sc.end_date, sc.event_time,
                         l.name AS location, sc.idLocation, sc.idState
                  FROM " . $this->table_name . " sc
                  INNER JOIN locations l ON l.id = sc.idLocation
                  ORDER BY sc.event_date DESC, sc.event_time DESC";
        $stmt = $this->conn->prepare($query);
        $stmt->execute();
        return $stmt;
    }

    public function lerPorId($id) {
        $query = "SELECT id, title, event_date, end_date, event_time, idLocation, idState
                  FROM " . $this->table_name . " WHERE id = :id";
        $stmt = $this->conn->prepare($query);
        $stmt->bindValue(':id', (int)$id, PDO::PARAM_INT);
        $stmt->execute();
        return $stmt->fetch(PDO::FETCH_ASSOC);
    }

    public function lerLocalizacoes() {
        $stmt = $this->conn->prepare("SELECT id, name FROM locations WHERE idState = 1 ORDER BY id ASC");
        $stmt->execute();
        return $stmt;
    }

    public function lerAtivos() {
        $query = "SELECT sc.id, sc.title, sc.event_date, sc.end_date, sc.event_time, l.name AS location
                  FROM " . $this->table_name . " sc
                  INNER JOIN locations l ON l.id = sc.idLocation
                  WHERE sc.idState = 1 AND l.idState = 1
                  ORDER BY sc.event_date ASC, sc.event_time ASC";
        $stmt = $this->conn->prepare($query);
        $stmt->execute();
        return $stmt;
    }
    public function inserir($title, $event_date, $end_date, $event_time, $idLocation) {
    $query = "INSERT INTO " . $this->table_name . "
              (title, event_date, end_date, event_time, idLocation)
              VALUES (:title, :event_date, :end_date, :event_time, :idLocation)";

    $stmt = $this->conn->prepare($query);
    $stmt->bindParam(":title", $title);
    $stmt->bindParam(":event_date", $event_date);
    $stmt->bindValue(":end_date", $end_date ?: null, $end_date ? PDO::PARAM_STR : PDO::PARAM_NULL);
    $stmt->bindParam(":event_time", $event_time);
    $stmt->bindParam(":idLocation", $idLocation);

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
public function editar($id, $title, $event_date, $end_date, $event_time) {
    $query = "UPDATE " . $this->table_name . "
              SET title = :title, event_date = :event_date, end_date = :end_date, event_time = :event_time
              WHERE id = :id";

    $stmt = $this->conn->prepare($query);
    $stmt->bindParam(":id", $id);
    $stmt->bindParam(":title", $title);
    $stmt->bindParam(":event_date", $event_date);
    $stmt->bindValue(":end_date", $end_date ?: null, $end_date ? PDO::PARAM_STR : PDO::PARAM_NULL);
    $stmt->bindParam(":event_time", $event_time);

    return $stmt->execute();
}

/**
 * Marca como inativos (idState = 2) todos os eventos ativos cuja data já passou.
 * Eventos do dia atual continuam ativos até à meia-noite.
 * Devolve o número de eventos arquivados.
 */
public function desativarPassados() {
    $stmt = $this->conn->prepare(
        "UPDATE " . $this->table_name . "
         SET idState = 2
         WHERE idState = 1 AND COALESCE(end_date, event_date) < CURDATE()"
    );
    $stmt->execute();
    return $stmt->rowCount();
}
}
    
?>