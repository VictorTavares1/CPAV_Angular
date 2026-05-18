<?php
class Log {
    private $conn;

    public function __construct($db) {
        $this->conn = $db;
    }

    public function inserir($idUser, $idOperation, $idNews = null, $idReport = null, $idSchedule = null) {
        $stmt = $this->conn->prepare(
            "INSERT INTO logs (idUser, idOperation, idNews, idReport, idSchedule)
             VALUES (:idUser, :idOperation, :idNews, :idReport, :idSchedule)"
        );
        $stmt->bindValue(':idUser',      (int)$idUser,      PDO::PARAM_INT);
        $stmt->bindValue(':idOperation', (int)$idOperation, PDO::PARAM_INT);
        $stmt->bindValue(':idNews',      $idNews,           PDO::PARAM_INT);
        $stmt->bindValue(':idReport',    $idReport,         PDO::PARAM_INT);
        $stmt->bindValue(':idSchedule',  $idSchedule,       PDO::PARAM_INT);
        return $stmt->execute();
    }

    public function lerOperacoes() {
        $stmt = $this->conn->prepare("SELECT id, title FROM operations ORDER BY id ASC");
        $stmt->execute();
        return $stmt;
    }

    private function buildWhere($operationId, $dateFrom, $dateTo) {
        $conditions = [];
        $params = [];

        if ($operationId > 0) {
            $conditions[] = "l.idOperation = :opId";
            $params[':opId'] = (int)$operationId;
        }
        if ($dateFrom) {
            $conditions[] = "l.dateHour >= :dateFrom";
            $params[':dateFrom'] = $dateFrom . ' 00:00:00';
        }
        if ($dateTo) {
            $conditions[] = "l.dateHour <= :dateTo";
            $params[':dateTo'] = $dateTo . ' 23:59:59';
        }

        $where = count($conditions) ? 'WHERE ' . implode(' AND ', $conditions) : '';
        return [$where, $params];
    }

    public function contar($operationId = 0, $dateFrom = null, $dateTo = null) {
        [$where, $params] = $this->buildWhere($operationId, $dateFrom, $dateTo);
        $stmt = $this->conn->prepare("SELECT COUNT(*) AS total FROM logs l $where");
        foreach ($params as $k => $v) $stmt->bindValue($k, $v);
        $stmt->execute();
        $row = $stmt->fetch(PDO::FETCH_ASSOC);
        return (int)($row['total'] ?? 0);
    }

    public function lerPaginados($page = 1, $perPage = 50, $operationId = 0, $dateFrom = null, $dateTo = null) {
        [$where, $params] = $this->buildWhere($operationId, $dateFrom, $dateTo);
        $offset = ($page - 1) * $perPage;

        $query = "SELECT l.dateHour, u.email AS adminEmail, o.title AS operationTitle,
                         COALESCE(n.title, r.title, sc.title) AS alvoTitle
                  FROM logs l
                  INNER JOIN users u ON l.idUser = u.id
                  INNER JOIN operations o ON l.idOperation = o.id
                  LEFT JOIN news n ON l.idNews = n.id
                  LEFT JOIN reports r ON l.idReport = r.id
                  LEFT JOIN schedules sc ON l.idSchedule = sc.id
                  $where
                  ORDER BY l.dateHour DESC
                  LIMIT :perPage OFFSET :offset";

        $stmt = $this->conn->prepare($query);
        foreach ($params as $k => $v) $stmt->bindValue($k, $v);
        $stmt->bindValue(':perPage', (int)$perPage, PDO::PARAM_INT);
        $stmt->bindValue(':offset', (int)$offset, PDO::PARAM_INT);
        $stmt->execute();
        return $stmt;
    }
}
?>
