<?php
echo "<h2>Testing Database Connection</h2>";

$host = 'localhost';
$dbname = 'ilb_school_db';
$username = 'root';
$password = '';

try {
    $pdo = new PDO("mysql:host=$host;dbname=$dbname", $username, $password);
    $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
    
    echo "<p style='color:green;'>✓ Database Connection Successful!</p>";
    echo "<p><strong>MySQL Version:</strong> " . $pdo->getAttribute(PDO::ATTR_SERVER_VERSION) . "</p>";
    
    // Check if attendance table exists
    $stmt = $pdo->query("SHOW TABLES LIKE 'attendance'");
    if ($stmt->rowCount() > 0) {
        echo "<p style='color:green;'>✓ Attendance table exists!</p>";
        
        // Count records
        $count = $pdo->query("SELECT COUNT(*) FROM attendance")->fetchColumn();
        echo "<p><strong>Total attendance records:</strong> $count</p>";
        
        echo "<hr>";
        echo "<h3>Next Steps:</h3>";
        echo "<ol>";
        echo "<li>Go to: <a href='http://localhost/ilb-school/'>http://localhost/ilb-school/</a></li>";
        echo "<li>Click on 'Real-Time Attendance' portal card</li>";
        echo "<li>Select a class (Daycare, PP1, PP2, or PP3)</li>";
        echo "<li>Select a branch (Kothanur or Chellikere)</li>";
        echo "<li>Mark attendance and submit!</li>";
        echo "</ol>";
    } else {
        echo "<p style='color:red;'>✗ Attendance table NOT found. Please create it in phpMyAdmin.</p>";
    }
    
} catch (PDOException $e) {
    echo "<p style='color:red;'>✗ Connection Failed: " . $e->getMessage() . "</p>";
}
?>
