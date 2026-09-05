<?php
require_once __DIR__ . '/config.php';

function auth_base64url_decode(string $value): string|false {
    return base64_decode(strtr($value, '-_', '+/') . str_repeat('=', (4 - strlen($value) % 4) % 4), true);
}

function require_admin_uid(): string {
    global $apiConfig;
    $headers = function_exists('getallheaders') ? getallheaders() : [];
    $authorization = $headers['Authorization'] ?? $_SERVER['HTTP_AUTHORIZATION'] ?? '';
    if (!preg_match('/^Bearer\s+(.+)$/i', trim($authorization), $matches)) api_fail('Authentication token is required.', 401);
    if (!$apiConfig['admin_uid']) api_fail('API authorization is not configured.', 503);

    $parts = explode('.', $matches[1]);
    if (count($parts) !== 3) api_fail('Invalid authentication token.', 401);
    $header = json_decode(auth_base64url_decode($parts[0]) ?: '', true);
    $claims = json_decode(auth_base64url_decode($parts[1]) ?: '', true);
    $signature = auth_base64url_decode($parts[2]);
    if (!is_array($header) || !is_array($claims) || $signature === false || ($header['alg'] ?? '') !== 'RS256') api_fail('Invalid authentication token.', 401);

    $now = time();
    if (($claims['aud'] ?? '') !== $apiConfig['firebase_project_id'] || ($claims['iss'] ?? '') !== 'https://securetoken.google.com/' . $apiConfig['firebase_project_id'] || empty($claims['sub']) || ($claims['exp'] ?? 0) < $now || ($claims['iat'] ?? 0) > $now + 60) api_fail('Invalid authentication token.', 401);

    $certs = @file_get_contents('https://www.googleapis.com/robot/v1/metadata/x509/securetoken@system.gserviceaccount.com');
    $certMap = $certs ? json_decode($certs, true) : null;
    $certificate = is_array($certMap) ? ($certMap[$header['kid'] ?? ''] ?? null) : null;
    if (!$certificate || !$signature || openssl_verify($parts[0] . '.' . $parts[1], $signature, $certificate, OPENSSL_ALGO_SHA256) !== 1) api_fail('Invalid authentication token.', 401);
    if (!hash_equals($apiConfig['admin_uid'], (string) $claims['sub'])) api_fail('Administrator authorization required.', 403);
    return (string) $claims['sub'];
}