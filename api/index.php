<?php

// Paksa direktori kerja dan storage Laravel ke folder temporary serverless
$_ENV['APP_STORAGE'] = '/tmp';
$_ENV['VIEW_COMPILED_PATH'] = '/tmp';
$_ENV['SESSION_DRIVER'] = 'cookie';
$_ENV['LOG_CHANNEL'] = 'stderr';

// Buat struktur folder sementara di /tmp jika belum ada
$dirs = [
    '/tmp/views',
    '/tmp/framework/views',
    '/tmp/framework/sessions',
    '/tmp/framework/cache',
];

foreach ($dirs as $dir) {
    if (!is_dir($dir)) {
        mkdir($dir, 0755, true);
    }
}

require __DIR__ . '/../public/index.php';