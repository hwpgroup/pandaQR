<?php
$ios      = isset($_GET['ios'])      ? filter_var($_GET['ios'],      FILTER_VALIDATE_URL) : false;
$android  = isset($_GET['android'])  ? filter_var($_GET['android'],  FILTER_VALIDATE_URL) : false;
$fallback = isset($_GET['fallback']) ? filter_var($_GET['fallback'],  FILTER_VALIDATE_URL) : false;

$ua = $_SERVER['HTTP_USER_AGENT'] ?? '';

$isIOS     = preg_match('/(iPhone|iPad|iPod)/i', $ua);
$isAndroid = preg_match('/Android/i', $ua);

if ($isIOS && $ios) {
    header('Location: ' . $ios, true, 302);
    exit;
}

if ($isAndroid && $android) {
    header('Location: ' . $android, true, 302);
    exit;
}

if ($fallback) {
    header('Location: ' . $fallback, true, 302);
    exit;
}

$appName = htmlspecialchars($_GET['name'] ?? 'Our App');
?><!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title><?= $appName ?> — Download</title>
    <style>
        * { box-sizing: border-box; margin: 0; padding: 0; }
        body {
            font-family: -apple-system, BlinkMacSystemFont, 'Inter', sans-serif;
            background: #0d1117; color: #f0f4fb;
            min-height: 100vh; display: flex; align-items: center; justify-content: center;
            padding: 2rem;
        }
        .card {
            background: #141c2b; border: 1px solid #1e2d48; border-radius: 20px;
            padding: 2.5rem; max-width: 420px; width: 100%; text-align: center;
        }
        h1 { font-size: 1.5rem; margin-bottom: .5rem; }
        p  { color: #8a9bbe; margin-bottom: 1.5rem; font-size: .9rem; }
        .btn-row { display: flex; flex-direction: column; gap: .75rem; }
        a.btn {
            display: block; padding: .875rem 1.5rem; border-radius: 12px;
            font-weight: 600; font-size: .95rem; text-decoration: none;
            transition: filter 150ms ease;
        }
        a.btn:hover { filter: brightness(1.1); }
        .btn-ios     { background: #0ea5e9; color: #fff; }
        .btn-android { background: #10b981; color: #fff; }
        .btn-fb      { background: #1e2d48; color: #f0f4fb; border: 1px solid #2d4270; }
    </style>
</head>
<body>
<div class="card">
    <h1><?= $appName ?></h1>
    <p>Choose your platform to download the app</p>
    <div class="btn-row">
        <?php if ($ios):     ?><a href="<?= htmlspecialchars($ios) ?>"      class="btn btn-ios">     Download on the App Store</a><?php endif; ?>
        <?php if ($android): ?><a href="<?= htmlspecialchars($android) ?>"  class="btn btn-android"> Get it on Google Play</a><?php endif; ?>
        <?php if ($fallback):?><a href="<?= htmlspecialchars($fallback) ?>" class="btn btn-fb">      Visit Website</a><?php endif; ?>
    </div>
</div>
</body>
</html>
