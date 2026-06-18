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
        $query = "SELECT n.id, n.title, n.content, n.dateHour,
                         GROUP_CONCAT(i.url ORDER BY i.id SEPARATOR ',') AS images
                  FROM " . $this->table_name . " n
                  LEFT JOIN images i ON i.idNews = n.id
                  WHERE n.idState = 1
                  GROUP BY n.id
                  ORDER BY n.dateHour DESC";
        $stmt = $this->conn->prepare($query);
        $stmt->execute();
        return $stmt;
    }

    public function lerPorId($id) {
        $query = "SELECT n.id, n.title, n.content, n.dateHour,
                         GROUP_CONCAT(i.url ORDER BY i.id SEPARATOR ',') AS images
                  FROM " . $this->table_name . " n
                  LEFT JOIN images i ON i.idNews = n.id
                  WHERE n.id = :id AND n.idState = 1
                  GROUP BY n.id
                  LIMIT 1";
        $stmt = $this->conn->prepare($query);
        $stmt->bindParam(":id", $id, PDO::PARAM_INT);
        $stmt->execute();
        return $stmt;
    }

    public function lerPorIdAdmin($id) {
        $query = "SELECT id, title, content, dateHour, idState
                  FROM " . $this->table_name . "
                  WHERE id = :id
                  LIMIT 1";
        $stmt = $this->conn->prepare($query);
        $stmt->bindParam(":id", $id, PDO::PARAM_INT);
        $stmt->execute();
        return $stmt;
    }

    public function lerImagensPorIdNoticia($idNews) {
        $query = "SELECT id, url
                  FROM images
                  WHERE idNews = :idNews
                  ORDER BY id ASC";
        $stmt = $this->conn->prepare($query);
        $stmt->bindParam(":idNews", $idNews, PDO::PARAM_INT);
        $stmt->execute();
        return $stmt;
    }

    public function inserirImagem($idNews, $url) {
        $query = "INSERT INTO images (url, idNews) VALUES (:url, :idNews)";
        $stmt = $this->conn->prepare($query);
        $stmt->bindParam(":url", $url);
        $stmt->bindParam(":idNews", $idNews, PDO::PARAM_INT);
        return $stmt->execute();
    }

    public function apagarImagem($idImagem) {
        // Devolve o url antes de apagar para o controlador remover o ficheiro físico.
        $stmt = $this->conn->prepare("SELECT url FROM images WHERE id = :id LIMIT 1");
        $stmt->bindParam(":id", $idImagem, PDO::PARAM_INT);
        $stmt->execute();
        $row = $stmt->fetch(PDO::FETCH_ASSOC);
        if (!$row) return null;

        $del = $this->conn->prepare("DELETE FROM images WHERE id = :id");
        $del->bindParam(":id", $idImagem, PDO::PARAM_INT);
        $del->execute();
        return $row['url'];
    }

    public function inserir($title, $content, $image = null) {
        $query = "INSERT INTO " . $this->table_name . " (title, content)
                  VALUES (:title, :content)";
        $stmt = $this->conn->prepare($query);
        $stmt->bindParam(":title", $title);
        $stmt->bindParam(":content", $content);

        if (!$stmt->execute()) {
            return false;
        }

        $idNoticia = $this->conn->lastInsertId();

        if ($image !== null) {
            $queryImg = "INSERT INTO images (url, idNews) VALUES (:url, :idNews)";
            $stmtImg  = $this->conn->prepare($queryImg);
            $stmtImg->bindParam(":url", $image);
            $stmtImg->bindParam(":idNews", $idNoticia, PDO::PARAM_INT);
            if (!$stmtImg->execute()) {
                return false;
            }
        }

        return $idNoticia;
    }

    public function editar($id, $title, $content) {
    $query = "UPDATE " . $this->table_name . " 
              SET title = :title, content = :content 
              WHERE id = :id";

    $stmt = $this->conn->prepare($query);
    $stmt->bindParam(":id", $id);
    $stmt->bindParam(":title", $title);
    $stmt->bindParam(":content", $content);

    return $stmt->execute();
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