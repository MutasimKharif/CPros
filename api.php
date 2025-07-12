<?php
/**
 * api.php - The central backend for the admin panel.
 * Handles all database interactions for the frontend.
 */

// Set headers for JSON response and allow cross-origin requests (for development)
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *'); // In production, restrict this to your domain: header('Access-Control-Allow-Origin: https://yourdomain.com');
header('Access-Control-Allow-Methods: GET, POST, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type');

// --- DATABASE CREDENTIALS ---
$servername = "localhost";
$username = "root";       // <-- IMPORTANT: Replace with your database username
$password = "Moe5rief$"; // <-- IMPORTANT: Replace with your database password
$dbname = "moedb";        // <-- IMPORTANT: Replace with your database name

// --- DATABASE CONNECTION (using PDO for better security) ---
try {
    $pdo = new PDO("mysql:host=$servername;dbname=$dbname;charset=utf8mb4", $username, $password);
    // Set PDO to throw exceptions on error, making error handling easier
    $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
} catch (PDOException $e) {
    // If connection fails, stop the script and return a server error
    http_response_code(500);
    echo json_encode(['error' => 'Database connection failed: ' . $e->getMessage()]);
    exit();
}

// --- ROUTING ---
// Determine the requested action from the URL (e.g., api.php?action=get_stats)
$action = $_GET['action'] ?? '';
$method = $_SERVER['REQUEST_METHOD'];

// Handle GET requests (fetching data)
if ($method === 'GET') {
    switch ($action) {
        case 'get_stats':
            // Fetch dashboard statistics
            $stats = [
                'requests' => $pdo->query("SELECT count(*) FROM users WHERE approved = 0")->fetchColumn(),
                'messages' => $pdo->query("SELECT count(*) FROM contacts")->fetchColumn(),
                'users' => $pdo->query("SELECT count(*) FROM users WHERE approved = 1 AND role = 'user'")->fetchColumn(),
                'admins' => $pdo->query("SELECT count(*) FROM users WHERE approved = 1 AND role = 'admin'")->fetchColumn(),
            ];
            echo json_encode($stats);
            break;

        case 'get_requests':
            // Fetch all unapproved user requests
            $stmt = $pdo->query("SELECT id, username, email, CONCAT(first_name, ' ', last_name) as fullName, created_at as requestDate FROM users WHERE approved = 0 ORDER BY created_at DESC");
            echo json_encode($stmt->fetchAll(PDO::FETCH_ASSOC));
            break;

        case 'get_messages':
            // Fetch all contact messages
            $stmt = $pdo->query("SELECT id, full_name as name, email, company_name as company, submission_date as received, message FROM contacts ORDER BY submission_date DESC");
            echo json_encode($stmt->fetchAll(PDO::FETCH_ASSOC));
            break;

        case 'get_users':
            // Fetch all approved, regular users
            $stmt = $pdo->query("SELECT id, username, email, CONCAT(first_name, ' ', last_name) as fullName, created_at as dateJoined FROM users WHERE approved = 1 AND role = 'user' ORDER BY created_at DESC");
            echo json_encode($stmt->fetchAll(PDO::FETCH_ASSOC));
            break;

        case 'get_admins':
            // Fetch all approved admin users
            $stmt = $pdo->query("SELECT id, username, email, CONCAT(first_name, ' ', last_name) as fullName, last_login as lastLogin FROM users WHERE approved = 1 AND role = 'admin' ORDER BY created_at DESC");
            echo json_encode($stmt->fetchAll(PDO::FETCH_ASSOC));
            break;

        default:
            // Handle invalid GET actions
            http_response_code(400);
            echo json_encode(['error' => 'Invalid GET action specified']);
    }
} 
// Handle POST requests (performing actions)
elseif ($method === 'POST') {
    // Get the JSON payload from the request body
    $data = json_decode(file_get_contents('php://input'), true);
    $id = $data['id'] ?? null;

    switch ($action) {
        case 'approve_request':
            if (!$id) { http_response_code(400); echo json_encode(['error' => 'User ID is required.']); exit(); }
            // Update the user's 'approved' status to 1
            $stmt = $pdo->prepare("UPDATE users SET approved = 1 WHERE id = ?");
            $stmt->execute([$id]);
            echo json_encode(['success' => true, 'message' => "User #{$id} has been approved."]);
            break;

        case 'deny_request':
            if (!$id) { http_response_code(400); echo json_encode(['error' => 'User ID is required.']); exit(); }
            // Delete the user record for the denied request
            $stmt = $pdo->prepare("DELETE FROM users WHERE id = ? AND approved = 0");
            $stmt->execute([$id]);
            echo json_encode(['success' => true, 'message' => "Request #{$id} has been denied and removed."]);
            break;

        case 'delete_item':
            $type = $data['type'] ?? null;
            if (!$id || !$type) { http_response_code(400); echo json_encode(['error' => 'Item ID and type are required for deletion.']); exit(); }
            
            $table = '';
            // Determine the correct table based on the 'type'
            if ($type === 'messages') $table = 'contacts';
            if ($type === 'users' || $type === 'admins') $table = 'users';

            if ($table) {
                // Add a security check to prevent deleting the last administrator
                if ($table === 'users' && $type === 'admins') {
                    $count = $pdo->query("SELECT count(*) FROM users WHERE role = 'admin' AND approved = 1")->fetchColumn();
                    if ($count <= 1) {
                        http_response_code(400); // Bad Request
                        echo json_encode(['error' => 'Action blocked: Cannot delete the last administrator.']);
                        exit();
                    }
                }
                // Prepare and execute the deletion
                $stmt = $pdo->prepare("DELETE FROM {$table} WHERE id = ?");
                $stmt->execute([$id]);
                echo json_encode(['success' => true, 'message' => "Item #{$id} from {$type} has been deleted."]);
            } else {
                 http_response_code(400);
                 echo json_encode(['error' => 'Invalid item type specified for deletion.']);
            }
            break;

        default:
            // Handle invalid POST actions
            http_response_code(400);
            echo json_encode(['error' => 'Invalid POST action specified']);
    }
}
?>
