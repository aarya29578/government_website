<?php
// Repository-safe configuration. Prefer replacing these placeholders with private
// Hostinger environment/configuration values rather than committing production secrets.
$apiConfig = [
    'firebase_project_id' => getenv('FIREBASE_PROJECT_ID') ?: 'website-5e7e3',
    'admin_uid' => getenv('ADMIN_UID') ?: '',
    'public_base_url' => getenv('PUBLIC_BASE_URL') ?: 'https://jenishaonlineservice.com/website',
    'storage_root' => __DIR__ . '/../',
    'allowed_origins' => [
        'http://localhost:5174',
        'http://127.0.0.1:5174',
        'http://localhost:5173',
        'http://127.0.0.1:5173',
        'https://jenishaonlineservice.com',
        'https://www.jenishaonlineservice.com',
        'https://admin.jenishaonlineservice.com',
        'https://jenishaadminpanel.netlify.app',
        'https://jenishaonlineservice-com-452787.hostingersite.com',
    ],
];

function api_headers(): void {
    global $apiConfig;
    $origin = $_SERVER['HTTP_ORIGIN'] ?? '';
    if (in_array($origin, $apiConfig['allowed_origins'], true)) {
        header('Access-Control-Allow-Origin: ' . $origin);
        header('Vary: Origin');
    }
    header('Access-Control-Allow-Methods: GET, POST, OPTIONS');
    header('Access-Control-Allow-Headers: Authorization, Content-Type');
    header('Access-Control-Max-Age: 600');
    header('Content-Type: application/json; charset=utf-8');
}

function api_fail(string $message, int $status): never {
    http_response_code($status);
    echo json_encode(['success' => false, 'message' => $message]);
    exit;
}

function api_options(): void {
    if (($_SERVER['REQUEST_METHOD'] ?? '') === 'OPTIONS') {
        http_response_code(204);
        exit;
    }
}