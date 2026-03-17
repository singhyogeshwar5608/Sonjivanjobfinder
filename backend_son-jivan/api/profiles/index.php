<?php
require_once __DIR__ . '/../../config/db.php';
require_once __DIR__ . '/../../config/auth.php';

header('Content-Type: application/json');

Auth::requireAuth();

$database = new Database();
$db = $database->getConnection();

if (!isset($_GET['id'])) {
    http_response_code(400);
    echo json_encode(['error' => 'Application ID is required']);
    exit();
}

$query = "SELECT a.*, j.title as job_title, j.company 
          FROM applications a 
          LEFT JOIN jobs j ON a.job_id = j.id 
          WHERE a.id = :id 
          LIMIT 1";

$stmt = $db->prepare($query);
$stmt->bindParam(':id', $_GET['id']);
$stmt->execute();

$profile = $stmt->fetch();

if (!$profile) {
    http_response_code(404);
    echo json_encode(['error' => 'Profile not found']);
    exit();
}

echo json_encode(['success' => true, 'profile' => $profile]);
