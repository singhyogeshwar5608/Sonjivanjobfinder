<?php
require_once __DIR__ . '/../../config/db.php';
require_once __DIR__ . '/../../config/auth.php';
require_once __DIR__ . '/../../config/config.php';
require_once __DIR__ . '/../../vendor/fpdf/fpdf.php';

Auth::requireAuth();

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

$type = isset($_GET['type']) ? $_GET['type'] : 'profile';

class PDF extends FPDF {
    function Header() {
        $this->SetFont('Arial', 'B', 16);
        $this->SetTextColor(41, 128, 185);
        $this->Cell(0, 10, 'Applicant Profile', 0, 1, 'C');
        $this->Ln(5);
    }
    
    function Footer() {
        $this->SetY(-15);
        $this->SetFont('Arial', 'I', 8);
        $this->SetTextColor(128, 128, 128);
        $this->Cell(0, 10, 'Page ' . $this->PageNo(), 0, 0, 'C');
    }
}

$pdf = new PDF();
$pdf->AddPage();

if ($applicant['profile_image'] && file_exists(UPLOAD_DIR . $applicant['profile_image'])) {
    $imageType = exif_imagetype(UPLOAD_DIR . $applicant['profile_image']);
    if ($imageType !== false) {
        try {
            $pdf->Image(UPLOAD_DIR . $applicant['profile_image'], 85, 30, 40, 40);
            $pdf->Ln(50);
        } catch (Exception $e) {
            $pdf->Ln(10);
        }
    }
} else {
    $pdf->Ln(10);
}

$pdf->SetFont('Arial', 'B', 18);
$pdf->SetTextColor(44, 62, 80);
$pdf->Cell(0, 10, $applicant['full_name'], 0, 1, 'C');

$pdf->SetFont('Arial', 'I', 12);
$pdf->SetTextColor(52, 73, 94);
$pdf->Cell(0, 8, $applicant['profession'], 0, 1, 'C');
$pdf->Ln(5);

$pdf->SetDrawColor(41, 128, 185);
$pdf->SetLineWidth(0.5);
$pdf->Line(20, $pdf->GetY(), 190, $pdf->GetY());
$pdf->Ln(8);

$pdf->SetFont('Arial', 'B', 12);
$pdf->SetTextColor(41, 128, 185);
$pdf->Cell(0, 8, 'Contact Information', 0, 1);
$pdf->SetFont('Arial', '', 10);
$pdf->SetTextColor(44, 62, 80);
$pdf->Cell(40, 6, 'Email:', 0, 0);
$pdf->SetFont('Arial', '', 10);
$pdf->Cell(0, 6, $applicant['email'], 0, 1);
$pdf->SetFont('Arial', '', 10);
$pdf->Cell(40, 6, 'Phone:', 0, 0);
$pdf->Cell(0, 6, $applicant['phone'], 0, 1);
$pdf->Ln(3);

$pdf->SetFont('Arial', 'B', 12);
$pdf->SetTextColor(41, 128, 185);
$pdf->Cell(0, 8, 'Professional Details', 0, 1);
$pdf->SetFont('Arial', '', 10);
$pdf->SetTextColor(44, 62, 80);
$pdf->Cell(40, 6, 'Experience:', 0, 0);
$pdf->Cell(0, 6, $applicant['experience'] . ' years', 0, 1);
$pdf->Cell(40, 6, 'Education:', 0, 0);
$pdf->MultiCell(0, 6, $applicant['education']);
$pdf->Cell(40, 6, 'Languages:', 0, 0);
$pdf->MultiCell(0, 6, $applicant['languages']);
$pdf->Ln(3);

$pdf->SetFont('Arial', 'B', 12);
$pdf->SetTextColor(41, 128, 185);
$pdf->Cell(0, 8, 'Skills', 0, 1);
$pdf->SetFont('Arial', '', 10);
$pdf->SetTextColor(44, 62, 80);
$pdf->MultiCell(0, 6, $applicant['skills']);
$pdf->Ln(3);

$pdf->SetFont('Arial', 'B', 12);
$pdf->SetTextColor(41, 128, 185);
$pdf->Cell(0, 8, 'About', 0, 1);
$pdf->SetFont('Arial', '', 10);
$pdf->SetTextColor(44, 62, 80);
$pdf->MultiCell(0, 6, $applicant['bio']);
$pdf->Ln(3);

$pdf->SetFont('Arial', 'B', 12);
$pdf->SetTextColor(41, 128, 185);
$pdf->Cell(0, 8, 'Applied For', 0, 1);
$pdf->SetFont('Arial', '', 10);
$pdf->SetTextColor(44, 62, 80);
$pdf->Cell(40, 6, 'Position:', 0, 0);
$pdf->Cell(0, 6, $applicant['job_title'], 0, 1);
$pdf->Cell(40, 6, 'Company:', 0, 0);
$pdf->Cell(0, 6, $applicant['company'], 0, 1);

$filename = 'applicant_' . $applicant['id'] . '_' . time() . '.pdf';
$pdf->Output('D', $filename);
