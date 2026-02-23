<?php
/**
 * JDP Credit Solutions - Lead Form Handler
 * Sends form submissions to info@jdpcredit.com
 */

// Configuration
$recipient_email = 'info@jdpcredit.com';
$email_subject = 'New Lead from JDP Credit Solutions Website';
$redirect_success = 'index.html?success=1';
$redirect_error = 'index.html?error=1';

// Only process POST requests
if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    header('Location: index.html');
    exit;
}

// Sanitize input function
function sanitize($data) {
    $data = trim($data);
    $data = stripslashes($data);
    $data = htmlspecialchars($data, ENT_QUOTES, 'UTF-8');
    return $data;
}

// Get and sanitize form data
$name = isset($_POST['name']) ? sanitize($_POST['name']) : '';
$email = isset($_POST['email']) ? sanitize($_POST['email']) : '';
$phone = isset($_POST['phone']) ? sanitize($_POST['phone']) : '';
$goal = isset($_POST['goal']) ? sanitize($_POST['goal']) : '';
$message = isset($_POST['message']) ? sanitize($_POST['message']) : '';

// Validate required fields
if (empty($name) || empty($email) || empty($phone) || empty($goal)) {
    header('Location: ' . $redirect_error);
    exit;
}

// Validate email format
if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
    header('Location: ' . $redirect_error);
    exit;
}

// Build email body
$email_body = "New Lead from JDP Credit Solutions Website\n";
$email_body .= "==========================================\n\n";
$email_body .= "Name: $name\n";
$email_body .= "Email: $email\n";
$email_body .= "Phone: $phone\n";
$email_body .= "Service Needed: $goal\n";
$email_body .= "Message/Goal: " . (!empty($message) ? $message : 'Not provided') . "\n\n";
$email_body .= "==========================================\n";
$email_body .= "Submitted: " . date('F j, Y \a\t g:i A T') . "\n";
$email_body .= "IP Address: " . $_SERVER['REMOTE_ADDR'] . "\n";

// Email headers
$headers = array(
    'From: JDP Credit Solutions <noreply@jdpcreditsolutions.com>',
    'Reply-To: ' . $email,
    'X-Mailer: PHP/' . phpversion(),
    'Content-Type: text/plain; charset=UTF-8'
);

// Send email
$mail_sent = mail($recipient_email, $email_subject, $email_body, implode("\r\n", $headers));

// Send auto-reply to the lead
if ($mail_sent) {
    $auto_reply_subject = 'Thank You for Contacting JDP Credit Solutions';
    $auto_reply_body = "Hi $name,\n\n";
    $auto_reply_body .= "Thank you for reaching out to JDP Credit Solutions!\n\n";
    $auto_reply_body .= "We received your request for help with: $goal\n\n";
    $auto_reply_body .= "One of our credit specialists will contact you within 24 hours (Monday-Friday, 9AM-5PM EST).\n\n";
    $auto_reply_body .= "In the meantime, feel free to call us directly at (786) 520-5461.\n\n";
    $auto_reply_body .= "Best regards,\n";
    $auto_reply_body .= "JDP Credit Solutions Team\n";
    $auto_reply_body .= "2125 Biscayne Blvd, Ste 204\n";
    $auto_reply_body .= "Miami, FL 33137\n";
    $auto_reply_body .= "(786) 520-5461\n";
    $auto_reply_body .= "info@jdpcreditsolutions.com\n";

    $auto_reply_headers = array(
        'From: JDP Credit Solutions <noreply@jdpcreditsolutions.com>',
        'Reply-To: info@jdpcreditsolutions.com',
        'Content-Type: text/plain; charset=UTF-8'
    );

    mail($email, $auto_reply_subject, $auto_reply_body, implode("\r\n", $auto_reply_headers));
}

// Redirect based on result
if ($mail_sent) {
    header('Location: ' . $redirect_success);
} else {
    header('Location: ' . $redirect_error);
}
exit;
?>
