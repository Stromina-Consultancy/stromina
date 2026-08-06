<?php
header('Content-Type: application/json');

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $naam = trim($_POST['naam'] ?? '');
    $email = trim($_POST['email'] ?? '');
    $organisatie = trim($_POST['organisatie'] ?? '');
    $bericht = trim($_POST['bericht'] ?? '');

    // Basic protection against header injection in user input.
    $naam = str_replace(["\r", "\n"], ' ', $naam);
    $email = str_replace(["\r", "\n"], '', $email);
    
    // Validatie
    if (empty($naam) || empty($email) || empty($bericht)) {
        http_response_code(400);
        echo json_encode(['success' => false, 'message' => 'Vereiste velden ontbreken']);
        exit;
    }
    
    if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
        http_response_code(400);
        echo json_encode(['success' => false, 'message' => 'Ongeldig e-mailadres']);
        exit;
    }
    
    // Email samenstellen
    $to = 'info@stromina.nl';
    $fromAddress = 'no-reply@stromina.nl';
    $subject = 'Nieuw contactformulier van ' . $naam;
    $message = "Naam: " . $naam . "\n";
    $message .= "E-mail: " . $email . "\n";
    $message .= "Organisatie: " . ($organisatie ?: 'Niet opgegeven') . "\n";
    $message .= "Bericht:\n" . $bericht;
    
    $headers = "From: Stromina Website <" . $fromAddress . ">\r\n";
    $headers .= "Sender: " . $fromAddress . "\r\n";
    $headers .= "Return-Path: " . $fromAddress . "\r\n";
    $headers .= "Reply-To: " . $email . "\r\n";
    $headers .= "Content-Type: text/plain; charset=UTF-8\r\n";
    $headers .= "X-Mailer: PHP/" . phpversion() . "\r\n";
    
    // Email versturen
    if (mail($to, $subject, $message, $headers, '-f' . $fromAddress)) {
        http_response_code(200);
        echo json_encode(['success' => true, 'message' => 'Bericht verstuurd']);
    } else {
        http_response_code(500);
        echo json_encode(['success' => false, 'message' => 'Fout bij verzenden']);
    }
} else {
    http_response_code(405);
    echo json_encode(['success' => false, 'message' => 'Methode niet toegestaan']);
}
?>
