<?php
// Deploy this file to public_html/api/upload-image.php.
// Configure these values for your Hostinger domain before deployment.
const PUBLIC_BASE_URL = 'https://jenishaonlineservice.com/website';
const ALLOWED_ORIGINS = [
    'http://localhost:5174',
    'http://127.0.0.1:5174',
    'http://localhost:5173',
    'http://127.0.0.1:5173',
    'https://jenishaonlineservice.com',
    'https://www.jenishaonlineservice.com',
    'https://jenishaonlineservice-com-452787.hostingersite.com',
];
const MAX_BYTES = 5242880;

$origin = $_SERVER['HTTP_ORIGIN'] ?? '';
if (in_array($origin, ALLOWED_ORIGINS, true)) {
    header('Access-Control-Allow-Origin: ' . $origin);
    header('Vary: Origin');
}
header('Access-Control-Allow-Methods: POST, OPTIONS');
header('Access-Control-Allow-Headers: Authorization, Content-Type');
header('Access-Control-Max-Age: 600');
header('Content-Type: application/json; charset=utf-8');

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(204);
    exit;
}

function fail_response(string $message, int $status): never {
    http_response_code($status);
    echo json_encode(['success' => false, 'message' => $message]);
    exit;
}

if ($_SERVER['REQUEST_METHOD'] !== 'POST') fail_response('Only POST requests are allowed.', 405);

$type = $_POST['type'] ?? '';
$directories = [
    'logo' => ['folder' => 'logo', 'urlFolder' => 'logo'],
    'qr-code' => ['folder' => 'qr-code', 'urlFolder' => 'qr-code'],
    'google-play' => ['folder' => 'google-play', 'urlFolder' => 'google-play'],
];
if (!isset($directories[$type])) fail_response('Invalid image type.', 400);
if (!isset($_FILES['image']) || $_FILES['image']['error'] !== UPLOAD_ERR_OK) fail_response('No valid image upload was received.', 400);

$file = $_FILES['image'];
if ($file['size'] > MAX_BYTES) fail_response('Images must be 5 MB or smaller.', 413);

$allowedMime = ['image/jpeg' => 'jpg', 'image/png' => 'png', 'image/webp' => 'webp'];
$mime = (new finfo(FILEINFO_MIME_TYPE))->file($file['tmp_name']);
if (!isset($allowedMime[$mime])) fail_response('Only JPG, PNG, and WEBP images are allowed.', 415);

$extension = strtolower(pathinfo($file['name'], PATHINFO_EXTENSION));
if (!in_array($extension, ['jpg', 'jpeg', 'png', 'webp'], true)) fail_response('The file extension is not allowed.', 415);

$folder = __DIR__ . '/../website/' . $directories[$type]['folder'];
if (!is_dir($folder) && !mkdir($folder, 0755, true)) fail_response('The upload directory is unavailable.', 500);

$filename = bin2hex(random_bytes(16)) . '.' . $allowedMime[$mime];
$destination = $folder . '/' . $filename;
if (!move_uploaded_file($file['tmp_name'], $destination)) fail_response('The image could not be saved.', 500);

$publicUrl = rtrim(PUBLIC_BASE_URL, '/') . '/' . $directories[$type]['urlFolder'] . '/' . rawurlencode($filename);
echo json_encode([
    'success' => true,
    'message' => 'Image uploaded successfully.',
    'filename' => $filename,
    'publicUrl' => $publicUrl,
]);
