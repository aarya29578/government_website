<?php
// Public endpoint used by customer service-submission forms to upload document
// images (e.g. Aadhaar, PAN, photo). Intentionally does NOT require admin auth -
// only the admin-only endpoints (upload-image.php, delete-image.php) do.
require_once __DIR__ . '/config.php';
api_headers();
api_options();
if (($_SERVER['REQUEST_METHOD'] ?? '') !== 'POST') api_fail('Only POST requests are allowed.', 405);

$safePattern = '/^[A-Za-z0-9_-]{1,64}$/';
$serviceId = $_POST['serviceId'] ?? '';
$submissionId = $_POST['submissionId'] ?? '';
$fieldKey = $_POST['fieldKey'] ?? '';
if (!preg_match($safePattern, $serviceId) || !preg_match($safePattern, $submissionId) || !preg_match($safePattern, $fieldKey)) {
    api_fail('Invalid submission reference.', 400);
}

if (!isset($_FILES['file']) || $_FILES['file']['error'] !== UPLOAD_ERR_OK) api_fail('No image file was provided.', 400);
$file = $_FILES['file'];
if ($file['size'] > 5 * 1024 * 1024) api_fail('Images must be 5 MB or smaller.', 413);

$allowedMime = ['image/jpeg' => 'jpg', 'image/png' => 'png', 'image/webp' => 'webp'];
$mime = (new finfo(FILEINFO_MIME_TYPE))->file($file['tmp_name']);
$extension = strtolower(pathinfo($file['name'], PATHINFO_EXTENSION));
if (!isset($allowedMime[$mime]) || !in_array($extension, ['jpg', 'jpeg', 'png', 'webp'], true)) api_fail('Only JPG, PNG, and WEBP images are allowed.', 415);

$folder = __DIR__ . '/../service-submissions/' . $submissionId;
if (!is_dir($folder) && !mkdir($folder, 0755, true)) api_fail('The upload directory is unavailable.', 500);
$filename = $fieldKey . '-' . bin2hex(random_bytes(8)) . '.' . $allowedMime[$mime];
$destination = $folder . '/' . $filename;
if (!move_uploaded_file($file['tmp_name'], $destination)) api_fail('The image could not be saved.', 500);

$publicUrl = rtrim($apiConfig['public_base_url'], '/') . '/service-submissions/' . rawurlencode($submissionId) . '/' . rawurlencode($filename);
echo json_encode([
    'success' => true,
    'message' => 'Image uploaded successfully.',
    'filename' => $filename,
    'publicUrl' => $publicUrl,
]);
