<?php
class Facility {
    private $conn;
    private $table_name = "facilities";

    public function __construct($db) {
        $this->conn = $db;
    }

    public function lerAtivos($category = null) {
        $query = "SELECT id, category, name, icon, address, tel, mobile, email,
                         responsavel_nome, responsavel_cargo, linked_facility, services, sort_order
                  FROM " . $this->table_name . "
                  WHERE idState = 1";
        if ($category !== null) {
            $query .= " AND category = :category";
        }
        $query .= " ORDER BY sort_order ASC, id ASC";
        $stmt = $this->conn->prepare($query);
        if ($category !== null) {
            $stmt->bindParam(':category', $category);
        }
        $stmt->execute();
        return $stmt;
    }

    public function lerTodos() {
        $query = "SELECT id, category, name, icon, address, tel, mobile, email,
                         responsavel_nome, responsavel_cargo, linked_facility, services, sort_order, idState
                  FROM " . $this->table_name . "
                  ORDER BY category ASC, sort_order ASC, id ASC";
        $stmt = $this->conn->prepare($query);
        $stmt->execute();
        return $stmt;
    }

    public function lerPorId($id) {
        $query = "SELECT id, category, name, icon, address, tel, mobile, email,
                         responsavel_nome, responsavel_cargo, linked_facility, services, sort_order, idState
                  FROM " . $this->table_name . "
                  WHERE id = :id";
        $stmt = $this->conn->prepare($query);
        $stmt->bindParam(':id', $id, PDO::PARAM_INT);
        $stmt->execute();
        return $stmt;
    }

    public function inserir($data) {
        $query = "INSERT INTO " . $this->table_name . "
                  (category, name, icon, address, tel, mobile, email,
                   responsavel_nome, responsavel_cargo, linked_facility, services, sort_order)
                  VALUES
                  (:category, :name, :icon, :address, :tel, :mobile, :email,
                   :responsavel_nome, :responsavel_cargo, :linked_facility, :services, :sort_order)";
        $stmt = $this->conn->prepare($query);
        $stmt->bindValue(':category',          $data['category']);
        $stmt->bindValue(':name',              $data['name']);
        $stmt->bindValue(':icon',              $data['icon']);
        $stmt->bindValue(':address',           $data['address']);
        $stmt->bindValue(':tel',               $data['tel']);
        $stmt->bindValue(':mobile',            $data['mobile']);
        $stmt->bindValue(':email',             $data['email']);
        $stmt->bindValue(':responsavel_nome',  $data['responsavel_nome']);
        $stmt->bindValue(':responsavel_cargo', $data['responsavel_cargo']);
        $stmt->bindValue(':linked_facility',   $data['linked_facility']);
        $stmt->bindValue(':services',          $data['services']);
        $stmt->bindValue(':sort_order',        (int)$data['sort_order'], PDO::PARAM_INT);
        if ($stmt->execute()) {
            return (int)$this->conn->lastInsertId();
        }
        return 0;
    }

    public function editar($id, $data) {
        $query = "UPDATE " . $this->table_name . "
                  SET category = :category, name = :name, icon = :icon,
                      address = :address, tel = :tel, mobile = :mobile, email = :email,
                      responsavel_nome = :responsavel_nome, responsavel_cargo = :responsavel_cargo,
                      linked_facility = :linked_facility, services = :services, sort_order = :sort_order
                  WHERE id = :id";
        $stmt = $this->conn->prepare($query);
        $stmt->bindValue(':id',                $id, PDO::PARAM_INT);
        $stmt->bindValue(':category',          $data['category']);
        $stmt->bindValue(':name',              $data['name']);
        $stmt->bindValue(':icon',              $data['icon']);
        $stmt->bindValue(':address',           $data['address']);
        $stmt->bindValue(':tel',               $data['tel']);
        $stmt->bindValue(':mobile',            $data['mobile']);
        $stmt->bindValue(':email',             $data['email']);
        $stmt->bindValue(':responsavel_nome',  $data['responsavel_nome']);
        $stmt->bindValue(':responsavel_cargo', $data['responsavel_cargo']);
        $stmt->bindValue(':linked_facility',   $data['linked_facility']);
        $stmt->bindValue(':services',          $data['services']);
        $stmt->bindValue(':sort_order',        (int)$data['sort_order'], PDO::PARAM_INT);
        return $stmt->execute();
    }

    public function toggleState($id) {
        $query = "UPDATE " . $this->table_name . "
                  SET idState = IF(idState = 1, 2, 1)
                  WHERE id = :id";
        $stmt = $this->conn->prepare($query);
        $stmt->bindParam(':id', $id, PDO::PARAM_INT);
        return $stmt->execute();
    }
}
?>
