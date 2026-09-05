<?php
require_once __DIR__ . '/auth.php';
api_headers();
api_options();
if (($_SERVER['REQUEST_METHOD'] ?? '') !== 'POST') api_fail('Only POST requests are allowed.', 405);
require_admin_uid();

$type = $_POST['type'] ?? '';
$folders = ['logo' => 'logo', 'qr-code' => 'qr-code', 'google-play' => 'google-play'];
if (!isset($folders[$type])) api_fail('Invalid image type.', 400);
if (!isset($_FILES['file']) || $_FILES['file']['error'] !== UPLOAD_ERR_OK) api_fail('No image file was provided.', 400);

$file = $_FILES['file'];
if ($file['size'] > 5 * 1024 * 1024) api_fail('Images must be 5 MB or smaller.', 413);
$allowedMime = ['image/jpeg' => 'jpg', 'image/png' => 'png', 'image/webp' => 'webp'];
$mime = (new finfo(FILEINFO_MIME_TYPE))->file($file['tmp_name']);
$extension = strtolower(pathinfo($file['name'], PATHINFO_EXTENSION));
if (!isset($allowedMime[$mime]) || !in_array($extension, ['jpg', 'jpeg', 'png', 'webp'], true)) api_fail('Only JPG, PNG, and WEBP images are allowed.', 415);

$folder = __DIR__ . '/../' . $folders[$type];
if (!is_dir($folder) && !mkdir($folder, 0755, true)) api_fail('The upload directory is unavailable.', 500);
$filename = bin2hex(random_bytes(16)) . '.' . $allowedMime[$mime];
$destination = $folder . '/' . $filename;
if (!move_uploaded_file($file['tmp_name'], $destination)) api_fail('The image could not be saved.', 500);

$publicUrl = rtrim($apiConfig['public_base_url'], '/') . '/' . $folders[$type] . '/' . rawurlencode($filename);
echo json_encode([
    'success' => true,
    'message' => 'Image uploaded successfully.',
    'filename' => $filename,
    'publicUrl' => $publicUrl,
]);
