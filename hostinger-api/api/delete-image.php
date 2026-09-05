<?php
require_once __DIR__ . '/auth.php';
api_headers();
api_options();
if (($_SERVER['REQUEST_METHOD'] ?? '') !== 'POST') api_fail('Only POST requests are allowed.', 405);
require_admin_uid();

$type = $_POST['type'] ?? '';
$filename = $_POST['filename'] ?? '';
$folders = ['logo' => 'logo', 'qr-code' => 'qr-code', 'google-play' => 'google-play'];
if (!isset($folders[$type]) || $filename !== basename($filename) || !preg_match('/^[a-f0-9]{32}\.(jpg|png|webp)$/', $filename)) api_fail('Invalid image reference.', 400);

$path = __DIR__ . '/../' . $folders[$type] . '/' . $filename;
if (!is_file($path)) api_fail('Image not found.', 404);
if (!unlink($path)) api_fail('Image could not be deleted.', 500);
echo json_encode(['success' => true, 'message' => 'Image deleted successfully.']);