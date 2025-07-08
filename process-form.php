<?php
// --- DATABASE CREDENTIALS ---
// Replace with your actual database details
$servername = "localhost";
$username = "your_username";
$password = "your_password";
$dbname = "your_database_name";

// Create connection
$conn = new mysqli($servername, $username, $password, $dbname);

// Check connection
if ($conn->connect_error) {
    die("Connection failed: " . $conn->connect_error);
}

// --- FORM DATA PROCESSING ---
// Check if the form was submitted using the POST method
if ($_SERVER["REQUEST_METHOD"] == "POST") {
    
    // Get and sanitize form data
    $fullName = htmlspecialchars($_POST['full_name']);
    $email = htmlspecialchars($_POST['email']);
    $company = htmlspecialchars($_POST['company_name']);
    $contactNumber = htmlspecialchars($_POST['contact_number']);
    $message = htmlspecialchars($_POST['message']);

    // --- PREPARE AND BIND THE SQL STATEMENT ---
    // Using prepared statements to prevent SQL injection
    $stmt = $conn->prepare("INSERT INTO contacts (full_name, email, company_name, contact_number, message) VALUES (?, ?, ?, ?, ?)");
    
    // The "sssss" indicates that all five parameters are strings
    $stmt->bind_param("sssss", $fullName, $email, $company, $contactNumber, $message);

    // --- EXECUTE AND PROVIDE FEEDBACK ---
    if ($stmt->execute()) {
        echo "Thank you! Your message has been sent successfully.";
    } else {
        echo "Error: " . $stmt->error;
    }

    // Close the statement and connection
    $stmt->close();
    $conn->close();
} else {
    // If not a POST request, redirect back to the form or show an error
    echo "Invalid request method.";
}
?>