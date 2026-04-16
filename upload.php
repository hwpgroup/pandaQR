<?php
header('Content-Type: application/json; charset=utf-8');
header('X-Content-Type-Options: nosniff');

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode(['error' => 'Method not allowed']);
    exit;
}

define('UPLOAD_DIR',  __DIR__ . '/assets/uploads/');
define('UPLOAD_URL',  'assets/uploads/');
define('MAX_SIZE',    10 * 1024 * 1024); // 10 MB

$ALLOWED_TYPES = [
    'image/jpeg'       => 'jpg',
    'image/png'        => 'png',
    'image/gif'        => 'gif',
    'image/webp'       => 'webp',
    'image/svg+xml'    => 'svg',
    'application/pdf'  => 'pdf',
];

if (!is_dir(UPLOAD_DIR)) {
    if (!mkdir(UPLOAD_DIR, 0755, true)) {
        http_response_code(500);
        echo json_encode(['error' => 'Cannot create upload directory']);
        exit;
    }
}

if (!isset($_FILES['file']) || $_FILES['file']['error'] !== UPLOAD_ERR_OK) {
    $errMap = [
        UPLOAD_ERR_INI_SIZE   => 'File exceeds server size limit',
        UPLOAD_ERR_FORM_SIZE  => 'File exceeds form size limit',
        UPLOAD_ERR_PARTIAL    => 'File was only partially uploaded',
        UPLOAD_ERR_NO_FILE    => 'No file was uploaded',
        UPLOAD_ERR_NO_TMP_DIR => 'Missing temporary folder',
        UPLOAD_ERR_CANT_WRITE => 'Failed to write file',
        UPLOAD_ERR_EXTENSION  => 'Upload blocked by extension',
    ];
    $code = $_FILES['file']['error'] ?? UPLOAD_ERR_NO_FILE;
    echo json_encode(['error' => $errMap[$code] ?? 'Upload error']);
    exit;
}

$file    = $_FILES['file'];
$tmpPath = $file['tmp_name'];
$origName = basename($file['name']);

if ($file['size'] > MAX_SIZE) {
    echo json_encode(['error' => 'File too large. Maximum is 10 MB.']);
    exit;
}

$finfo    = new finfo(FILEINFO_MIME_TYPE);
$mimeType = $finfo->file($tmpPath);

if (!array_key_exists($mimeType, $ALLOWED_TYPES)) {
    echo json_encode(['error' => 'Invalid file type: ' . htmlspecialchars($mimeType)]);
    exit;
}

$ext      = $ALLOWED_TYPES[$mimeType];
$filename = bin2hex(random_bytes(16)) . '.' . $ext;
$destPath = UPLOAD_DIR . $filename;

if (!move_uploaded_file($tmpPath, $destPath)) {
    http_response_code(500);
    echo json_encode(['error' => 'Failed to save file']);
    exit;
}

$protocol = (!empty($_SERVER['HTTPS']) && $_SERVER['HTTPS'] !== 'off') ? 'https' : 'http';
$host     = $_SERVER['HTTP_HOST'] ?? 'localhost';
$basePath = rtrim(dirname($_SERVER['SCRIPT_NAME']), '/\\') . '/';
$publicUrl = $protocol . '://' . $host . $basePath . UPLOAD_URL . $filename;

echo json_encode([
    'success'  => true,
    'url'      => UPLOAD_URL . $filename,
    'full_url' => $publicUrl,
    'name'     => $origName,
    'size'     => $file['size'],
    'type'     => $mimeType,
]);
