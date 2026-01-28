<?php
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type');

// Handle preflight OPTIONS request
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit;
}

// Database configuration
$host = 'localhost';
$dbname = 'ilb_school_db';
$username = 'root';
$password = '';

try {
    $pdo = new PDO("mysql:host=$host;dbname=$dbname;charset=utf8mb4", $username, $password);
    $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);

    // Get parameters
    $rollno = isset($_GET['rollno']) ? $_GET['rollno'] : '';
    $class = isset($_GET['class']) ? $_GET['class'] : '';
    $branch = isset($_GET['branch']) ? $_GET['branch'] : '';

    // Validate required parameters
    if (empty($rollno) || empty($class) || empty($branch)) {
        echo json_encode([
            'success' => false,
            'message' => 'Missing required parameters: rollno, class, and branch are required'
        ]);
        exit;
    }

    // Fetch attendance records
    $stmt = $pdo->prepare("
        SELECT date, status, name, created_at
        FROM attendance
        WHERE rollno = :rollno 
        AND class = :class 
        AND branch = :branch
        ORDER BY date DESC
    ");

    $stmt->execute([
        'rollno' => $rollno,
        'class' => $class,
        'branch' => $branch
    ]);

    $attendance = $stmt->fetchAll(PDO::FETCH_ASSOC);

    // Calculate statistics
    $presentCount = 0;
    $absentCount = 0;
    
    foreach ($attendance as $record) {
        if ($record['status'] === 'Present') {
            $presentCount++;
        } else {
            $absentCount++;
        }
    }

    $totalDays = count($attendance);
    $percentage = $totalDays > 0 ? round(($presentCount / $totalDays) * 100, 1) : 0;

    echo json_encode([
        'success' => true,
        'attendance' => $attendance,
        'stats' => [
            'present' => $presentCount,
            'absent' => $absentCount,
            'total' => $totalDays,
            'percentage' => $percentage
        ]
    ]);

} catch (PDOException $e) {
    echo json_encode([
        'success' => false,
        'message' => 'Database error: ' . $e->getMessage()
    ]);
}
?>