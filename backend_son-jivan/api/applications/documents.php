<?php
require_once __DIR__ . '/../../config/db.php';
require_once __DIR__ . '/../../config/auth.php';

header('Content-Type: application/json');

Auth::requireAuth();

$database = new Database();
$db = $database->getConnection();

$method = $_SERVER['REQUEST_METHOD'];

if ($method === 'GET') {
    if (!isset($_GET['application_id'])) {
        http_response_code(400);
        echo json_encode(['error' => 'Missing application_id parameter']);
        exit();
    }
    
    $applicationId = $_GET['application_id'];
    
    $query = "SELECT id, doc_type, file_path, original_name, created_at 
              FROM application_documents 
              WHERE application_id = :application_id 
              ORDER BY created_at DESC";
    
    $stmt = $db->prepare($query);
    $stmt->bindParam(':application_id', $applicationId, PDO::PARAM_INT);
    $stmt->execute();
    
    $documents = $stmt->fetchAll();
    
    echo json_encode([
        'success' => true,
        'documents' => $documents
    ]);
} else {
    http_response_code(405);
    echo json_encode(['error' => 'Method not allowed']);
}
