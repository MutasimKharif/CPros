<?php
// Set the content type to JSON to ensure the browser interprets the output correctly.
header('Content-Type: application/json');

// --- DATABASE CREDENTIALS ---
// Replace with your actual database details from your hosting provider.
$servername = "localhost";
$username = "Mutasim";
$password = "Moe5rief$";
$dbname = "moedb";

// --- DATABASE CONNECTION ---
// Create and check the database connection.
$conn = new mysqli($servername, $username, $password, $dbname);
if ($conn->connect_error) {
    // If the connection fails, return a JSON error message and stop the script.
    // In a real application, you would log this error instead of showing it.
    echo json_encode(['error' => 'Database connection failed: ' . $conn->connect_error]);
    exit();
}

// --- DATA FETCHING ROUTING ---
// Use a parameter in the URL (e.g., admin.php?fetch=contacts) to decide what data to get.
$dataType = isset($_GET['fetch']) ? $_GET['fetch'] : '';

$sql = '';
$data = [];

// Use a switch statement to build the correct SQL query based on the 'fetch' parameter.
switch ($dataType) {
    case 'contacts':
        $sql = "SELECT id, full_name, email, company_name, contact_number, submission_date FROM contacts ORDER BY submission_date DESC";
        break;
    case 'users':
        // SECURITY: We explicitly DO NOT select the password_hash.
        $sql = "SELECT user_id, username, email, full_name, created_at FROM users ORDER BY created_at DESC";
        break;
    case 'admins':
        // SECURITY: We explicitly DO NOT select the password_hash.
        $sql = "SELECT admin_id, username, email, full_name, last_login, created_at FROM admin_users ORDER BY created_at DESC";
        break;
    default:
        // If the 'fetch' parameter is invalid or missing, return an error and exit.
        echo json_encode(['error' => 'Invalid data type requested.']);
        exit();
}

// Execute the query.
$result = $conn->query($sql);

if ($result) {
    // If the query is successful, fetch all rows into an associative array.
    while ($row = $result->fetch_assoc()) {
        $data[] = $row;
    }
} else {
    // If the query fails, return a JSON error with the database error message.
    echo json_encode(['error' => 'Failed to execute query: ' . $conn->error]);
    $conn->close();
    exit();
}

// --- OUTPUT ---
// Encode the final data array into a JSON string and output it.
echo json_encode($data);

// Close the database connection.
$conn->close();
?>
