<?php
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');

// Database configuration - PORT 3306 (default)
$host = 'localhost';
$dbname = 'ilb_school_db';
$username = 'root';
$password = '';

try {
    $pdo = new PDO("mysql:host=$host;dbname=$dbname;charset=utf8mb4", $username, $password);
    $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);

    $class = isset($_GET['class']) ? $_GET['class'] : '';
    $branch = isset($_GET['branch']) ? $_GET['branch'] : '';

    if (empty($class)) {
        echo json_encode(['success' => false, 'message' => 'Class parameter required']);
        exit;
    }

    $sql = "SELECT DISTINCT rollno, name FROM attendance WHERE class = :class";
    $params = ['class' => $class];
    
    if (!empty($branch)) {
        $sql .= " AND branch = :branch";
        $params['branch'] = $branch;
    }
    
    $sql .= " ORDER BY rollno ASC";
    
    $stmt = $pdo->prepare($sql);
    $stmt->execute($params);
    $students = $stmt->fetchAll(PDO::FETCH_ASSOC);

    echo json_encode(['success' => true, 'students' => $students, 'count' => count($students)]);

} catch (PDOException $e) {
    echo json_encode(['success' => false, 'message' => 'Database error: ' . $e->getMessage()]);
}
?>
