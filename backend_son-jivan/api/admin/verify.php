<?php
require_once __DIR__ . '/../../config/db.php';
require_once __DIR__ . '/../../config/auth.php';

header('Content-Type: application/json');

$payload = Auth::requireAuth();

$database = new Database();
$db = $database->getConnection();

$query = "SELECT id, name, email FROM admins WHERE id = :id LIMIT 1";
$stmt = $db->prepare($query);
$stmt->bindParam(':id', $payload['user_id']);
$stmt->execute();

$admin = $stmt->fetch();

if (!$admin) {
    http_response_code(401);
    echo json_encode(['error' => 'Admin not found']);
    exit();
}

echo json_encode([
    'success' => true,
    'admin' => $admin
]);
