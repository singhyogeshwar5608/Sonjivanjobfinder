<?php
require_once __DIR__ . '/../../config/db.php';
require_once __DIR__ . '/../../config/auth.php';
require_once __DIR__ . '/../../config/config.php';

$token = Auth::getAuthToken();
if (!$token && isset($_GET['token'])) {
    $token = $_GET['token'];
}

$payload = Auth::verifyToken($token);
if (!$payload) {
    http_response_code(401);
    echo json_encode(['error' => 'Unauthorized']);
    exit();
}

if (!isset($_GET['id'])) {
    http_response_code(400);
    echo json_encode(['error' => 'Application ID is required']);
    exit();
}

$database = new Database();
$db = $database->getConnection();

$query = "SELECT a.*, j.title as job_title, j.company 
          FROM applications a 
          LEFT JOIN jobs j ON a.job_id = j.id 
          WHERE a.id = :id 
          LIMIT 1";

$stmt = $db->prepare($query);
$stmt->bindParam(':id', $_GET['id']);
$stmt->execute();

$applicant = $stmt->fetch();

if (!$applicant) {
    http_response_code(404);
    echo json_encode(['error' => 'Applicant not found']);
    exit();
}

header('Content-Type: text/html; charset=utf-8');
?>
<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <title>Applicant Profile - <?php echo htmlspecialchars($applicant['full_name']); ?></title>
    <style>
        @media print {
            body { margin: 0; }
            .no-print { display: none; }
        }
        body {
            font-family: Arial, sans-serif;
            max-width: 800px;
            margin: 20px auto;
            padding: 20px;
            background: #f5f5f5;
        }
        .profile-card {
            background: white;
            border-radius: 10px;
            box-shadow: 0 2px 10px rgba(0,0,0,0.1);
            overflow: hidden;
        }
        .header {
            background: linear-gradient(135deg, #2563eb, #1d4ed8);
            height: 100px;
        }
        .profile-content {
            padding: 30px;
            margin-top: -50px;
            position: relative;
        }
        .profile-image {
            width: 120px;
            height: 120px;
            border-radius: 50%;
            border: 4px solid white;
            object-fit: cover;
            display: block;
            margin: 0 auto;
            background: #e5e7eb;
        }
        .name {
            text-align: center;
            font-size: 28px;
            font-weight: bold;
            color: #1f2937;
            margin: 15px 0 5px;
        }
        .profession {
            text-align: center;
            font-size: 18px;
            color: #2563eb;
            font-weight: 600;
            margin-bottom: 30px;
        }
        .section {
            margin-bottom: 20px;
        }
        .section-title {
            font-size: 14px;
            font-weight: bold;
            color: #2563eb;
            margin-bottom: 8px;
            text-transform: uppercase;
            letter-spacing: 0.5px;
        }
        .section-content {
            color: #374151;
            line-height: 1.6;
        }
        .info-row {
            display: flex;
            margin-bottom: 10px;
        }
        .info-label {
            font-weight: 600;
            width: 150px;
            color: #6b7280;
        }
        .info-value {
            flex: 1;
            color: #1f2937;
        }
        .skills {
            display: flex;
            flex-wrap: wrap;
            gap: 8px;
            margin-top: 10px;
        }
        .skill-tag {
            background: #dbeafe;
            color: #1e40af;
            padding: 6px 12px;
            border-radius: 20px;
            font-size: 13px;
            font-weight: 500;
        }
        .applied-box {
            background: #f9fafb;
            border-radius: 8px;
            padding: 15px;
            margin-top: 20px;
        }
        .print-btn {
            background: #2563eb;
            color: white;
            border: none;
            padding: 12px 24px;
            border-radius: 6px;
            cursor: pointer;
            font-size: 16px;
            font-weight: 600;
            margin: 20px auto;
            display: block;
        }
        .print-btn:hover {
            background: #1d4ed8;
        }
        hr {
            border: none;
            border-top: 2px solid #e5e7eb;
            margin: 20px 0;
        }
    </style>
</head>
<body>
    <button class="print-btn no-print" onclick="window.print()">Print / Save as PDF</button>
    
    <div class="profile-card">
        <div class="header"></div>
        
        <div class="profile-content">
            <?php if ($applicant['profile_image']): ?>
                <?php 
                $API_URL = 'http://localhost/sonjivan_job_finder/backend';
                $imageUrl = $API_URL . '/uploads/' . $applicant['profile_image'];
                ?>
                <img src="<?php echo $imageUrl; ?>" alt="Profile" class="profile-image">
            <?php else: ?>
                <div class="profile-image" style="display: flex; align-items: center; justify-content: center; font-size: 48px; color: #9ca3af;">
                    👤
                </div>
            <?php endif; ?>
            
            <h1 class="name"><?php echo htmlspecialchars($applicant['full_name']); ?></h1>
            <p class="profession"><?php echo htmlspecialchars($applicant['profession']); ?></p>
            
            <hr>
            
            <div class="section">
                <div class="section-title">Contact Information</div>
                <div class="info-row">
                    <span class="info-label">Email:</span>
                    <span class="info-value"><?php echo htmlspecialchars($applicant['email']); ?></span>
                </div>
                <div class="info-row">
                    <span class="info-label">Phone:</span>
                    <span class="info-value"><?php echo htmlspecialchars($applicant['phone']); ?></span>
                </div>
            </div>
            
            <hr>
            
            <div class="section">
                <div class="section-title">Professional Details</div>
                <div class="info-row">
                    <span class="info-label">Experience:</span>
                    <span class="info-value"><?php echo htmlspecialchars($applicant['experience']); ?> years</span>
                </div>
                <div class="info-row">
                    <span class="info-label">Education:</span>
                    <span class="info-value"><?php echo htmlspecialchars($applicant['education']); ?></span>
                </div>
                <div class="info-row">
                    <span class="info-label">Languages:</span>
                    <span class="info-value"><?php echo htmlspecialchars($applicant['languages']); ?></span>
                </div>
            </div>
            
            <hr>
            
            <div class="section">
                <div class="section-title">Skills</div>
                <div class="skills">
                    <?php 
                    $skills = explode(',', $applicant['skills']);
                    foreach ($skills as $skill): 
                        $skill = trim($skill);
                        if ($skill):
                    ?>
                        <span class="skill-tag"><?php echo htmlspecialchars($skill); ?></span>
                    <?php 
                        endif;
                    endforeach; 
                    ?>
                </div>
            </div>
            
            <hr>
            
            <div class="section">
                <div class="section-title">About</div>
                <div class="section-content">
                    <?php echo nl2br(htmlspecialchars($applicant['bio'])); ?>
                </div>
            </div>
            
            <?php if ($applicant['contact_info']): ?>
            <hr>
            <div class="section">
                <div class="section-title">Additional Contact Information</div>
                <div class="section-content">
                    <?php echo nl2br(htmlspecialchars($applicant['contact_info'])); ?>
                </div>
            </div>
            <?php endif; ?>
            
            <div class="applied-box">
                <div class="section-title">Applied For</div>
                <div class="info-row">
                    <span class="info-label">Position:</span>
                    <span class="info-value"><?php echo htmlspecialchars($applicant['job_title']); ?></span>
                </div>
                <div class="info-row">
                    <span class="info-label">Company:</span>
                    <span class="info-value"><?php echo htmlspecialchars($applicant['company']); ?></span>
                </div>
                <div class="info-row">
                    <span class="info-label">Applied On:</span>
                    <span class="info-value"><?php echo date('F j, Y', strtotime($applicant['created_at'])); ?></span>
                </div>
            </div>
        </div>
    </div>
    
    <button class="print-btn no-print" onclick="window.print()">Print / Save as PDF</button>
</body>
</html>
