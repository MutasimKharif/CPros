<?php
// Config
$to = "m77esmaiel@gmail.com.com";  // Change to your desired email
$subject = "New Contact Form Submission";

// Sanitize helper
function sanitize($data) {
    return htmlspecialchars(strip_tags(trim($data)));
}

if ($_SERVER["REQUEST_METHOD"] === "POST") {
    $name = sanitize($_POST['name'] ?? '');
    $email = sanitize($_POST['email'] ?? '');
    $company = sanitize($_POST['company'] ?? '');
    $contact = sanitize($_POST['contact'] ?? '');
    $message = sanitize($_POST['message'] ?? '');

    $errors = [];

    if (empty($name)) $errors[] = "Name is required.";
    if (!filter_var($email, FILTER_VALIDATE_EMAIL)) $errors[] = "Valid email is required.";
    if (empty($company)) $errors[] = "Company is required.";
    if (empty($contact) || !is_numeric($contact)) $errors[] = "Valid contact number is required.";
    if (empty($message)) $errors[] = "Message is required.";

    if (!empty($errors)) {
        echo "<h3>Errors:</h3><ul>";
        foreach ($errors as $err) {
            echo "<li>" . $err . "</li>";
        }
        echo "</ul>";
        echo "<a href='contact.html'>Go back</a>";
        exit;
    }

    // Email body
    $body = <<<EOD
New message from Contact Form:

Name: {$name}
Email: {$email}
Company: {$company}
Contact Number: {$contact}

Message:
{$message}
EOD;

    // Send email
    $headers = "From: {$email}" . "\r\n" .
               "Reply-To: {$email}" . "\r\n" .
               "X-Mailer: PHP/" . phpversion();

    if (mail($to, $subject, $body, $headers)) {
        echo "<h2>Thank you, {$name}. Your message has been sent successfully!</h2>";
    } else {
        echo "<h2>Sorry, there was a problem sending your message. Please try again later.</h2>";
    }

    echo "<a href='index.html'>Return to Home</a>";
} else {
    header("Location: contact.html");
    exit;
}
?>
