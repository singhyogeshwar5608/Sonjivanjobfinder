<?php
require_once __DIR__ . '/../../config/db.php';
require_once __DIR__ . '/../../config/config.php';
require_once __DIR__ . '/../../helpers/dropbox.php';

header('Content-Type: application/json');

$database = new Database();
$db = $database->getConnection();

function detectMimeType($filePath, $fallback = null)
{
    if (function_exists('mime_content_type')) {
        $type = @mime_content_type($filePath);
        if ($type !== false) {
            return $type;
        }
    }

    if (function_exists('finfo_open')) {
        $finfo = finfo_open(FILEINFO_MIME_TYPE);
        if ($finfo) {
            $type = finfo_file($finfo, $filePath);
            finfo_close($finfo);
            if ($type !== false) {
                return $type;
            }
        }
    }

    return $fallback ?: 'application/octet-stream';
}

function uploadToCloudinary($filePath)
{
    $endpoint = 'https://api.cloudinary.com/v1_1/' . CLOUDINARY_CLOUD_NAME . '/image/upload';
    $payload = [
        'file' => new CURLFile($filePath),
        'upload_preset' => CLOUDINARY_UPLOAD_PRESET,
    ];

    if (defined('CLOUDINARY_UPLOAD_FOLDER') && CLOUDINARY_UPLOAD_FOLDER) {
        $payload['folder'] = CLOUDINARY_UPLOAD_FOLDER;
    }

    $ch = curl_init();
    curl_setopt($ch, CURLOPT_URL, $endpoint);
    curl_setopt($ch, CURLOPT_POST, true);
    curl_setopt($ch, CURLOPT_POSTFIELDS, $payload);
    curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
    curl_setopt($ch, CURLOPT_SSL_VERIFYPEER, false);
    curl_setopt($ch, CURLOPT_SSL_VERIFYHOST, 0);

    $response = curl_exec($ch);
    $statusCode = curl_getinfo($ch, CURLINFO_HTTP_CODE);
    $curlError = curl_error($ch);
    curl_close($ch);

    if ($response === false || $statusCode >= 400) {
        error_log('Cloudinary upload failed: ' . ($curlError ?: $response));
        return null;
    }

    $data = json_decode($response, true);
    return $data['secure_url'] ?? $data['url'] ?? null;
}

$method = $_SERVER['REQUEST_METHOD'];

switch ($method) {
    case 'GET':
        require_once __DIR__ . '/../../config/auth.php';
        Auth::requireAuth();
        
        $query = "SELECT a.*, j.title as job_title, j.company 
                  FROM applications a 
                  LEFT JOIN jobs j ON a.job_id = j.id 
                  WHERE 1=1";
        
        $params = [];
        
        if (isset($_GET['job_id'])) {
            $query .= " AND a.job_id = :job_id";
            $params[':job_id'] = $_GET['job_id'];
        }
        
        if (isset($_GET['skills'])) {
            $query .= " AND a.skills LIKE :skills";
            $params[':skills'] = '%' . $_GET['skills'] . '%';
        }
        
        if (isset($_GET['profession'])) {
            $query .= " AND a.profession LIKE :profession";
            $params[':profession'] = '%' . $_GET['profession'] . '%';
        }
        
        if (isset($_GET['min_experience'])) {
            $query .= " AND a.experience >= :min_experience";
            $params[':min_experience'] = $_GET['min_experience'];
        }
        
        if (isset($_GET['max_experience'])) {
            $query .= " AND a.experience <= :max_experience";
            $params[':max_experience'] = $_GET['max_experience'];
        }
        
        if (isset($_GET['search'])) {
            $query .= " AND (a.full_name LIKE :search OR a.email LIKE :search OR a.phone LIKE :search)";
            $params[':search'] = '%' . $_GET['search'] . '%';
        }
        
        $query .= " ORDER BY a.created_at DESC";
        
        $stmt = $db->prepare($query);
        
        foreach ($params as $key => $value) {
            $stmt->bindValue($key, $value);
        }
        
        $stmt->execute();
        $applications = $stmt->fetchAll();
        
        echo json_encode(['success' => true, 'applications' => $applications]);
        break;
        
    case 'POST':
        if (!isset($_POST['full_name']) || !isset($_POST['email']) || !isset($_POST['job_id'])) {
            http_response_code(400);
            echo json_encode(['error' => 'Missing required fields']);
            exit();
        }
        
        $profileImage = null;
        $documentUrl = null;
        $resumeUrl = null;
        $uploadedDocuments = [];
        $documentTypes = isset($_POST['document_types']) ? (array)$_POST['document_types'] : [];

        if (isset($_FILES['profile_image']) && $_FILES['profile_image']['error'] === UPLOAD_ERR_OK) {
            $file = $_FILES['profile_image'];
            
            if ($file['size'] > MAX_FILE_SIZE) {
                http_response_code(400);
                echo json_encode(['error' => 'File size exceeds limit']);
                exit();
            }
            
            if (!in_array($file['type'], ALLOWED_IMAGE_TYPES)) {
                http_response_code(400);
                echo json_encode(['error' => 'Invalid file type']);
                exit();
            }

            $uploadedUrl = uploadToCloudinary($file['tmp_name']);

            if (!$uploadedUrl) {
                http_response_code(500);
                echo json_encode(['error' => 'Failed to upload image']);
                exit();
            }

            $profileImage = $uploadedUrl;
        }

        $processDocument = function ($tmpName, $originalName, $size, $type, $docTypeLabel = 'Supporting Document') use (&$documentUrl, &$resumeUrl, &$uploadedDocuments) {
            if ($size > MAX_DOC_FILE_SIZE) {
                http_response_code(400);
                echo json_encode(['error' => 'Document exceeds maximum allowed size (10MB)']);
                exit();
            }

            $docMime = detectMimeType($tmpName, $type);

            if (!in_array($docMime, ALLOWED_DOC_TYPES)) {
                http_response_code(400);
                echo json_encode(['error' => 'Invalid document type. Only PDF, Word, JPG, or PNG are allowed']);
                exit();
            }

            $extension = strtolower(pathinfo($originalName, PATHINFO_EXTENSION));
            if (!$extension) {
                if ($docMime === 'application/pdf') {
                    $extension = 'pdf';
                } elseif ($docMime === 'application/msword' || $docMime === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document') {
                    $extension = 'doc';
                } elseif (str_contains($docMime, 'jpeg')) {
                    $extension = 'jpg';
                } elseif (str_contains($docMime, 'png')) {
                    $extension = 'png';
                } else {
                    $extension = 'file';
                }
            }

            $isResume = (strtolower($docTypeLabel) === 'resume' || strtolower($docTypeLabel) === 'cv');
            $isPDF = ($docMime === 'application/pdf' || $extension === 'pdf');
            $isImage = in_array($docMime, ['image/jpeg', 'image/png', 'image/jpg']);

            if ($isResume && $isPDF) {
                $fileName = uniqid('resume_', true) . '.pdf';
                $uploadedUrl = uploadToDropbox($tmpName, $fileName);
                
                if (!$uploadedUrl) {
                    http_response_code(500);
                    echo json_encode(['error' => 'Failed to upload resume to Dropbox']);
                    exit();
                }
                
                $resumeUrl = $uploadedUrl;
                
                $uploadedDocuments[] = [
                    'file_path' => $uploadedUrl,
                    'original_name' => $originalName,
                    'doc_type' => $docTypeLabel,
                ];
            } elseif ($isImage) {
                $uploadedUrl = uploadToCloudinary($tmpName);
                
                if (!$uploadedUrl) {
                    http_response_code(500);
                    echo json_encode(['error' => 'Failed to upload document image to Cloudinary']);
                    exit();
                }
                
                $uploadedDocuments[] = [
                    'file_path' => $uploadedUrl,
                    'original_name' => $originalName,
                    'doc_type' => $docTypeLabel ?: 'Supporting Document',
                ];
                
                if ($documentUrl === null) {
                    $documentUrl = $uploadedUrl;
                }
            } else {
                $fileName = uniqid('doc_', true) . '.' . preg_replace('/[^a-z0-9]/i', '', $extension);
                $destination = DOCUMENT_UPLOAD_DIR . $fileName;

                if (!move_uploaded_file($tmpName, $destination)) {
                    http_response_code(500);
                    echo json_encode(['error' => 'Failed to store document']);
                    exit();
                }

                $storedPath = 'uploads/documents/' . $fileName;

                $uploadedDocuments[] = [
                    'file_path' => $storedPath,
                    'original_name' => $originalName,
                    'doc_type' => $docTypeLabel ?: 'Supporting Document',
                ];

                if ($documentUrl === null) {
                    $documentUrl = $storedPath;
                }
            }
        };

        if (isset($_FILES['document_file']) && $_FILES['document_file']['error'] === UPLOAD_ERR_OK) {
            $docFile = $_FILES['document_file'];
            $docTypeLabel = isset($_POST['document_type']) ? $_POST['document_type'] : 'Supporting Document';
            $processDocument($docFile['tmp_name'], $docFile['name'], $docFile['size'], $docFile['type'], $docTypeLabel);
        }

        if (isset($_FILES['documents']) && isset($_FILES['documents']['name']) && is_array($_FILES['documents']['name'])) {
            $docFiles = $_FILES['documents'];
            $docCount = count($docFiles['name']);

            for ($i = 0; $i < $docCount; $i++) {
                if ($docFiles['error'][$i] !== UPLOAD_ERR_OK) {
                    continue;
                }

                $typeLabel = $documentTypes[$i] ?? 'Supporting Document';
                $processDocument(
                    $docFiles['tmp_name'][$i],
                    $docFiles['name'][$i],
                    $docFiles['size'][$i],
                    $docFiles['type'][$i],
                    $typeLabel
                );
            }
        }

        $query = "INSERT INTO applications 
                  (job_id, full_name, email, phone, education, skills, profession, languages, experience, bio, contact_info, profile_image, document_url, resume_url) 
                  VALUES 
                  (:job_id, :full_name, :email, :phone, :education, :skills, :profession, :languages, :experience, :bio, :contact_info, :profile_image, :document_url, :resume_url)";

        $stmt = $db->prepare($query);
        
        $stmt->bindParam(':job_id', $_POST['job_id']);
        $stmt->bindParam(':full_name', $_POST['full_name']);
        $stmt->bindParam(':email', $_POST['email']);
        $stmt->bindParam(':phone', $_POST['phone']);
        $stmt->bindParam(':education', $_POST['education']);
        $stmt->bindParam(':skills', $_POST['skills']);
        $stmt->bindParam(':profession', $_POST['profession']);
        $stmt->bindParam(':languages', $_POST['languages']);
        $stmt->bindParam(':experience', $_POST['experience']);
        $stmt->bindParam(':bio', $_POST['bio']);
        $stmt->bindParam(':contact_info', $_POST['contact_info']);
        $stmt->bindParam(':profile_image', $profileImage);
        $stmt->bindParam(':document_url', $documentUrl);
        $stmt->bindParam(':resume_url', $resumeUrl);
        
        if ($stmt->execute()) {
            $applicationId = $db->lastInsertId();

            if (!empty($uploadedDocuments)) {
                $docInsert = $db->prepare("INSERT INTO application_documents (application_id, doc_type, file_path, original_name) VALUES (:application_id, :doc_type, :file_path, :original_name)");
                foreach ($uploadedDocuments as $doc) {
                    $docInsert->bindValue(':application_id', $applicationId, PDO::PARAM_INT);
                    $docInsert->bindValue(':doc_type', $doc['doc_type']);
                    $docInsert->bindValue(':file_path', $doc['file_path']);
                    $docInsert->bindValue(':original_name', $doc['original_name']);
                    $docInsert->execute();
                }
            }

            echo json_encode([
                'success' => true, 
                'application_id' => $applicationId, 
                'message' => 'Application submitted successfully'
            ]);
        } else {
            http_response_code(500);
            echo json_encode(['error' => 'Failed to submit application']);
        }
        break;
        
    default:
        http_response_code(405);
        echo json_encode(['error' => 'Method not allowed']);
        break;
}
