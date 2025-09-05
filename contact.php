<?php
// contact.php

// Require PHPMailer files
// Adjust path if you didn't use Composer or if vendor folder is elsewhere
require 'vendor/autoload.php';

use PHPMailer\PHPMailer\PHPMailer;
use PHPMailer\PHPMailer\Exception;

header('Content-Type: application/json'); // Set header for JSON response

$response = [
    'success' => false,
    'message' => 'Une erreur inattendue est survenue. Veuillez réessayer plus tard.'
];

if ($_SERVER["REQUEST_METHOD"] == "POST") {
    // Sanitize and validate input
    $name = filter_input(INPUT_POST, 'name', FILTER_SANITIZE_STRING);
    $email = filter_input(INPUT_POST, 'email', FILTER_SANITIZE_EMAIL);
    $subject = filter_input(INPUT_POST, 'subject', FILTER_SANITIZE_STRING);
    $message = filter_input(INPUT_POST, 'message', FILTER_SANITIZE_STRING);

    // Basic validation
    if (empty($name) || empty($email) || empty($message)) {
        $response['message'] = 'Veuillez remplir tous les champs obligatoires.';
        echo json_encode($response);
        exit;
    }

    if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
        $response['message'] = 'Veuillez entrer une adresse email valide.';
        echo json_encode($response);
        exit;
    }

    // Initialize PHPMailer
    $mail = new PHPMailer(true); // true enables exceptions

    try {
        // Server settings
        $mail->isSMTP();
        $mail->Host       = 'smtp.gmail.com'; // Gmail SMTP server
        $mail->SMTPAuth   = true;
        $mail->Username   = 'hassaneahmat06@gmail.com';
        $mail->Password   = 'npcc vqwb clki hhle'; // Make sure this is your App Password
        $mail->SMTPSecure = PHPMailer::ENCRYPTION_STARTTLS;
        $mail->Port       = 587;
        
        // Recipients
        $mail->setFrom($email, $name);
        $mail->addAddress('hassaneahmat06@gmail.com', 'Totalis trading'); // Replace with your business email
        // You can add more recipients if needed:
        // $mail->addAddress('another_recipient@example.com');
        // $mail->addReplyTo($email, $name); // Reply to the sender's email

        // Content
        $mail->isHTML(true); // Set email format to HTML
        $mail->Subject = 'Nouveau message de contact via Totalis Trading: ' . ($subject ?: 'Sans sujet');
        $mail->Body    = "
            <html>
            <head>
                <title>Nouveau message de contact</title>
                <style>
                    body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
                    .container { max-width: 600px; margin: 20px auto; padding: 20px; border: 1px solid #ddd; border-radius: 5px; background-color: #f9f9f9; }
                    h2 { color: #1a237e; }
                    p { margin-bottom: 10px; }
                    strong { color: #1a237e; }
                </style>
            </head>
            <body>
                <div class='container'>
                    <h2>Nouveau message de contact de Totalis Trading</h2>
                    <p><strong>Nom:</strong> " . htmlspecialchars($name) . "</p>
                    <p><strong>Email:</strong> " . htmlspecialchars($email) . "</p>
                    <p><strong>Sujet:</strong> " . htmlspecialchars($subject ?: 'N/A') . "</p>
                    <p><strong>Message:</strong></p>
                    <p>" . nl2br(htmlspecialchars($message)) . "</p>
                </div>
            </body>
            </html>
        ";
        $mail->AltBody = "Nouveau message de contact de Totalis Trading:\n\n" .
                         "Nom: " . $name . "\n" .
                         "Email: " . $email . "\n" .
                         "Sujet: " . ($subject ?: 'N/A') . "\n" .
                         "Message: " . $message;

        $mail->send();
        $response['success'] = true;
        $response['message'] = 'Merci ! Votre message a été envoyé avec succès.';

    } catch (Exception $e) {
        // Log the error for debugging
        error_log("PHPMailer Error: " . $e->getMessage());
        $response['message'] = "Le message n'a pas pu être envoyé. Erreur du Mailer: {$mail->ErrorInfo}";
    }
} else {
    $response['message'] = 'Requête invalide.';
}

echo json_encode($response);
exit;
?>