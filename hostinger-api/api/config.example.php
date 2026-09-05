<?php
// Copy the values into Hostinger's private server configuration. Do not commit real values.
return [
    'firebase_project_id' => 'website-5e7e3',
    'admin_uid' => 'REPLACE_WITH_FIREBASE_ADMIN_UID',
    'public_base_url' => 'https://jenishaonlineservice.com/website',
    'storage_root' => __DIR__ . '/../',
    'allowed_origins' => [
        'http://localhost:5174',
        'http://127.0.0.1:5174',
        'http://localhost:5173',
        'http://127.0.0.1:5173',
        'https://jenishaonlineservice.com',
        'https://www.jenishaonlineservice.com',
        'https://admin.jenishaonlineservice.com',
        'https://jenishaonlineservice-com-452787.hostingersite.com',
    ],
];