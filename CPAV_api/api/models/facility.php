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

    public function editarContactos($id, $name, $address, $tel, $mobile, $email) {
        $query = "UPDATE " . $this->table_name . "
                  SET name = :name, address = :address, tel = :tel, mobile = :mobile, email = :email
                  WHERE id = :id";
        $stmt = $this->conn->prepare($query);
        $stmt->bindValue(':id',      $id, PDO::PARAM_INT);
        $stmt->bindValue(':name',    $name);
        $stmt->bindValue(':address', $address);
        $stmt->bindValue(':tel',     $tel);
        $stmt->bindValue(':mobile',  $mobile);
        $stmt->bindValue(':email',   $email);
        return $stmt->execute();
    }

    // --- facility_services junction table ---

    public function lerPorServico($service_key) {
        $query = "SELECT fs.id, fs.id_facility, fs.service_key, fs.description, fs.note, fs.sort_order,
                         f.name, f.address, f.tel, f.mobile, f.email
                  FROM facility_services fs
                  INNER JOIN " . $this->table_name . " f ON f.id = fs.id_facility
                  WHERE fs.service_key = :service_key AND f.idState = 1
                  ORDER BY fs.sort_order ASC, fs.id ASC";
        $stmt = $this->conn->prepare($query);
        $stmt->bindParam(':service_key', $service_key);
        $stmt->execute();
        return $stmt;
    }

    public function lerServicosPorFacility($id_facility) {
        $query = "SELECT id, id_facility, service_key, description, note, sort_order
                  FROM facility_services
                  WHERE id_facility = :id_facility
                  ORDER BY service_key ASC, sort_order ASC";
        $stmt = $this->conn->prepare($query);
        $stmt->bindParam(':id_facility', $id_facility, PDO::PARAM_INT);
        $stmt->execute();
        return $stmt;
    }

    public function inserirServico($id_facility, $service_key, $description, $note, $sort_order) {
        $query = "INSERT INTO facility_services (id_facility, service_key, description, note, sort_order)
                  VALUES (:id_facility, :service_key, :description, :note, :sort_order)";
        $stmt = $this->conn->prepare($query);
        $stmt->bindValue(':id_facility',  $id_facility, PDO::PARAM_INT);
        $stmt->bindValue(':service_key',  $service_key);
        $stmt->bindValue(':description',  $description);
        $stmt->bindValue(':note',         $note);
        $stmt->bindValue(':sort_order',   (int)$sort_order, PDO::PARAM_INT);
        if ($stmt->execute()) {
            return (int)$this->conn->lastInsertId();
        }
        return 0;
    }

    public function editarServico($id, $service_key, $description, $note, $sort_order) {
        $query = "UPDATE facility_services
                  SET service_key = :service_key, description = :description,
                      note = :note, sort_order = :sort_order
                  WHERE id = :id";
        $stmt = $this->conn->prepare($query);
        $stmt->bindValue(':id',          $id, PDO::PARAM_INT);
        $stmt->bindValue(':service_key', $service_key);
        $stmt->bindValue(':description', $description);
        $stmt->bindValue(':note',        $note);
        $stmt->bindValue(':sort_order',  (int)$sort_order, PDO::PARAM_INT);
        return $stmt->execute();
    }

    public function apagarServico($id) {
        $query = "DELETE FROM facility_services WHERE id = :id";
        $stmt = $this->conn->prepare($query);
        $stmt->bindParam(':id', $id, PDO::PARAM_INT);
        return $stmt->execute();
    }
}
?>
