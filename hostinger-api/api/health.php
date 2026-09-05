<?php
require_once __DIR__ . '/config.php';
api_headers();
api_options();
if (($_SERVER['REQUEST_METHOD'] ?? '') !== 'GET') api_fail('Only GET requests are allowed.', 405);
echo json_encode(['success' => true, 'service' => 'website-api']);