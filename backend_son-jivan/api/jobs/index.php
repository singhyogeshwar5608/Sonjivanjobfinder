<?php
require_once __DIR__ . '/../../config/db.php';
require_once __DIR__ . '/../../config/auth.php';

header('Content-Type: application/json');

$database = new Database();
$db = $database->getConnection();

$method = $_SERVER['REQUEST_METHOD'];

switch ($method) {
    case 'GET':
        if (isset($_GET['id'])) {
            $query = "SELECT j.*, (SELECT COUNT(*) FROM applications a WHERE a.job_id = j.id) as applicant_count 
                      FROM jobs j WHERE j.id = :id LIMIT 1";
            $stmt = $db->prepare($query);
            $stmt->bindParam(':id', $_GET['id']);
            $stmt->execute();
            $job = $stmt->fetch();
            
            if ($job) {
                echo json_encode(['success' => true, 'job' => $job]);
            } else {
                http_response_code(404);
                echo json_encode(['error' => 'Job not found']);
            }
        } else {
            if (isset($_GET['all']) && $_GET['all'] == '1') {
                $query = "SELECT j.*, (SELECT COUNT(*) FROM applications a WHERE a.job_id = j.id) as applicant_count 
                          FROM jobs j ORDER BY j.created_at DESC";
                $stmt = $db->prepare($query);
            } else {
                $status = isset($_GET['status']) ? $_GET['status'] : 'active';
                $query = "SELECT j.*, (SELECT COUNT(*) FROM applications a WHERE a.job_id = j.id) as applicant_count 
                          FROM jobs j WHERE j.status = :status ORDER BY j.created_at DESC";
                $stmt = $db->prepare($query);
                $stmt->bindParam(':status', $status);
            }

            $stmt->execute();
            $jobs = $stmt->fetchAll();
            
            echo json_encode(['success' => true, 'jobs' => $jobs]);
        }
        break;
        
    case 'POST':
        Auth::requireAuth();
        
        $data = json_decode(file_get_contents('php://input'), true);
        
        if (!isset($data['title']) || !isset($data['company']) || !isset($data['location'])) {
            http_response_code(400);
            echo json_encode(['error' => 'Missing required fields']);
            exit();
        }
        
        $query = "INSERT INTO jobs (title, company, location, job_type, salary, description, requirements, status) 
                  VALUES (:title, :company, :location, :job_type, :salary, :description, :requirements, :status)";
        $stmt = $db->prepare($query);
        
        $status = isset($data['status']) ? $data['status'] : 'active';
        
        $stmt->bindParam(':title', $data['title']);
        $stmt->bindParam(':company', $data['company']);
        $stmt->bindParam(':location', $data['location']);
        $stmt->bindParam(':job_type', $data['job_type']);
        $stmt->bindParam(':salary', $data['salary']);
        $stmt->bindParam(':description', $data['description']);
        $stmt->bindParam(':requirements', $data['requirements']);
        $stmt->bindParam(':status', $status);
        
        if ($stmt->execute()) {
            $jobId = $db->lastInsertId();
            echo json_encode(['success' => true, 'job_id' => $jobId, 'message' => 'Job created successfully']);
        } else {
            http_response_code(500);
            echo json_encode(['error' => 'Failed to create job']);
        }
        break;
        
    case 'PUT':
        Auth::requireAuth();
        
        $data = json_decode(file_get_contents('php://input'), true);
        
        if (!isset($data['id'])) {
            http_response_code(400);
            echo json_encode(['error' => 'Job ID is required']);
            exit();
        }
        
        $query = "UPDATE jobs SET 
                  title = :title, 
                  company = :company, 
                  location = :location, 
                  job_type = :job_type, 
                  salary = :salary, 
                  description = :description, 
                  requirements = :requirements, 
                  status = :status 
                  WHERE id = :id";
        $stmt = $db->prepare($query);
        
        $stmt->bindParam(':id', $data['id']);
        $stmt->bindParam(':title', $data['title']);
        $stmt->bindParam(':company', $data['company']);
        $stmt->bindParam(':location', $data['location']);
        $stmt->bindParam(':job_type', $data['job_type']);
        $stmt->bindParam(':salary', $data['salary']);
        $stmt->bindParam(':description', $data['description']);
        $stmt->bindParam(':requirements', $data['requirements']);
        $stmt->bindParam(':status', $data['status']);
        
        if ($stmt->execute()) {
            echo json_encode(['success' => true, 'message' => 'Job updated successfully']);
        } else {
            http_response_code(500);
            echo json_encode(['error' => 'Failed to update job']);
        }
        break;
        
    case 'DELETE':
        Auth::requireAuth();
        
        $data = json_decode(file_get_contents('php://input'), true);
        
        if (!isset($data['id'])) {
            http_response_code(400);
            echo json_encode(['error' => 'Job ID is required']);
            exit();
        }
        
        $query = "DELETE FROM jobs WHERE id = :id";
        $stmt = $db->prepare($query);
        $stmt->bindParam(':id', $data['id']);
        
        if ($stmt->execute()) {
            echo json_encode(['success' => true, 'message' => 'Job deleted successfully']);
        } else {
            http_response_code(500);
            echo json_encode(['error' => 'Failed to delete job']);
        }
        break;
        
    default:
        http_response_code(405);
        echo json_encode(['error' => 'Method not allowed']);
        break;
}
