<?php
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: POST, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type');

// Handle preflight OPTIONS request
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit;
}

// Database configuration - PORT 3306 (default)
$host = 'localhost';
$dbname = 'ilb_school_db';
$username = 'root';
$password = '';

try {
    $pdo = new PDO("mysql:host=$host;dbname=$dbname;charset=utf8mb4", $username, $password);
    $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);

    // Get raw POST data
    $input = file_get_contents('php://input');
    $data = json_decode($input, true);

    // Validate input
    if (!isset($data['records']) || !is_array($data['records'])) {
        echo json_encode(['success' => false, 'message' => 'Invalid data format']);
        exit;
    }

    $records = $data['records'];
    
    if (empty($records)) {
        echo json_encode(['success' => false, 'message' => 'No records to save']);
        exit;
    }

    // Start transaction
    $pdo->beginTransaction();

    $stmt = $pdo->prepare("
        INSERT INTO attendance (date, rollno, name, class, branch, status)
        VALUES (:date, :rollno, :name, :class, :branch, :status)
        ON DUPLICATE KEY UPDATE 
            name = VALUES(name), 
            status = VALUES(status)
    ");

    $successCount = 0;
    $errors = [];

    foreach ($records as $record) {
        // Validate required fields
        $requiredFields = ['date', 'rollno', 'name', 'class', 'branch', 'status'];
        foreach ($requiredFields as $field) {
            if (!isset($record[$field]) || $record[$field] === '') {
                $errors[] = "Missing field: $field for record";
                continue 2;
            }
        }

        // Validate status
        if (!in_array($record['status'], ['Present', 'Absent'])) {
            $errors[] = "Invalid status for Roll No {$record['rollno']}";
            continue;
        }

        try {
            $stmt->execute([
                'date' => $record['date'],
                'rollno' => $record['rollno'],
                'name' => $record['name'],
                'class' => $record['class'],
                'branch' => $record['branch'],
                'status' => $record['status']
            ]);
            $successCount++;
        } catch (PDOException $e) {
            $errors[] = "Roll No {$record['rollno']}: " . $e->getMessage();
        }
    }

    // Commit transaction
    $pdo->commit();

    // Build response
    $response = [
        'success' => true,
        'message' => "Successfully saved attendance for $successCount students",
        'successCount' => $successCount,
        'totalRecords' => count($records)
    ];

    if (!empty($errors)) {
        $response['warnings'] = $errors;
    }

    echo json_encode($response);

} catch (Exception $e) {
    if (isset($pdo) && $pdo->inTransaction()) {
        $pdo->rollBack();
    }
    echo json_encode(['success' => false, 'message' => 'Error: ' . $e->getMessage()]);
}
?>
