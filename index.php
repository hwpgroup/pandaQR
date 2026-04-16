<?php
session_start();

$seo_protocol = (!empty($_SERVER['HTTPS']) && $_SERVER['HTTPS'] !== 'off')
    || (isset($_SERVER['SERVER_PORT']) && (string) $_SERVER['SERVER_PORT'] === '443')
    ? 'https' : 'http';
$seo_host = $_SERVER['HTTP_HOST'] ?? 'localhost';
$seo_path = strtok($_SERVER['REQUEST_URI'] ?? '/', '?');
if ($seo_path === '' || $seo_path[0] !== '/') {
    $seo_path = '/' . ltrim((string) $seo_path, '/');
}
$seo_canonical = $seo_protocol . '://' . $seo_host . $seo_path;

$seo_script_dir = dirname($_SERVER['SCRIPT_NAME'] ?? '/');
$seo_script_dir = str_replace('\\', '/', $seo_script_dir);
$seo_base_path = ($seo_script_dir === '/' || $seo_script_dir === '.') ? '' : rtrim($seo_script_dir, '/');
$seo_asset_base = $seo_protocol . '://' . $seo_host . ($seo_base_path === '' ? '' : $seo_base_path);
$seo_og_image = $seo_asset_base . '/logo.png';
$seo_logo_url = $seo_asset_base . '/tiny.png';

$seo_site_name = 'PandaQR';
$seo_title = 'PandaQR — Professional QR Code Generator | Free Online Tool';
$seo_description = 'Create free, professional QR codes in seconds. Encode websites, vCards, WiFi, PDFs, images, videos, app store links, WhatsApp, and feedback forms. Customize colors, dot styles, frames, and logos — download high-quality JPG. No account required.';
$seo_keywords = 'QR code generator, free QR code, custom QR code, vCard QR, WiFi QR code, QR code with logo, dynamic QR, QR code download, business QR code, PandaQR';
$seo_theme_color = '#0ea5e9';
$seo_twitter_handle = ''; /* optional: @YourHandle */

$seo_jsonld_website = [
    '@context' => 'https://schema.org',
    '@type' => 'WebSite',
    'name' => $seo_site_name,
    'alternateName' => 'Panda QR',
    'url' => $seo_canonical,
    'description' => $seo_description,
    'inLanguage' => 'en-US',
    'publisher' => [
        '@type' => 'Organization',
        'name' => 'Manda Panda Tools',
        'url' => $seo_canonical,
        'logo' => ['@type' => 'ImageObject', 'url' => $seo_logo_url],
    ],
];

$seo_jsonld_app = [
    '@context' => 'https://schema.org',
    '@type' => 'WebApplication',
    'name' => $seo_site_name,
    'url' => $seo_canonical,
    'description' => $seo_description,
    'applicationCategory' => 'UtilitiesApplication',
    'applicationSubCategory' => 'QRCodeGenerator',
    'operatingSystem' => 'Any (Web browser)',
    'browserRequirements' => 'Requires JavaScript. Modern evergreen browser recommended.',
    'offers' => [
        '@type' => 'Offer',
        'price' => '0',
        'priceCurrency' => 'USD',
    ],
    'featureList' => [
        'Multiple QR types: website, vCard, PDF, image, video, app links, WhatsApp, WiFi, feedback',
        'Visual customization: colors, dot shapes, corner styles, frames, center logos',
        'Download as JPG',
        'No registration required',
    ],
    'screenshot' => $seo_og_image,
    'image' => $seo_og_image,
    'author' => ['@type' => 'Organization', 'name' => 'Manda Panda Tools'],
    'provider' => ['@type' => 'Organization', 'name' => 'Manda Panda Tools'],
];

$seo_jsonld_org = [
    '@context' => 'https://schema.org',
    '@type' => 'Organization',
    'name' => 'Manda Panda Tools',
    'url' => $seo_canonical,
    'logo' => $seo_logo_url,
];

$seo_jsonld_breadcrumb = [
    '@context' => 'https://schema.org',
    '@type' => 'BreadcrumbList',
    'itemListElement' => [
        [
            '@type' => 'ListItem',
            'position' => 1,
            'name' => 'Home',
            'item' => $seo_canonical,
        ],
    ],
];

$seo_jsonld_output = function ($data) {
    return json_encode(
        $data,
        JSON_UNESCAPED_SLASHES | JSON_UNESCAPED_UNICODE | JSON_HEX_TAG | JSON_HEX_AMP | JSON_HEX_APOS
    );
};
?>
<!DOCTYPE html>
<html lang="en-US">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0, viewport-fit=cover">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">

    <title><?php echo htmlspecialchars($seo_title, ENT_QUOTES, 'UTF-8'); ?></title>
    <meta name="description" content="<?php echo htmlspecialchars($seo_description, ENT_QUOTES, 'UTF-8'); ?>">
    <meta name="keywords" content="<?php echo htmlspecialchars($seo_keywords, ENT_QUOTES, 'UTF-8'); ?>">
    <meta name="author" content="Manda Panda Tools">
    <meta name="application-name" content="<?php echo htmlspecialchars($seo_site_name, ENT_QUOTES, 'UTF-8'); ?>">
    <meta name="theme-color" content="<?php echo htmlspecialchars($seo_theme_color, ENT_QUOTES, 'UTF-8'); ?>">
    <meta name="color-scheme" content="dark light">
    <meta name="format-detection" content="telephone=no">
    <meta name="referrer" content="strict-origin-when-cross-origin">
    <meta name="robots" content="index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1">
    <meta name="googlebot" content="index, follow">
    <link rel="canonical" href="<?php echo htmlspecialchars($seo_canonical, ENT_QUOTES, 'UTF-8'); ?>">
    <link rel="icon" href="<?php echo htmlspecialchars($seo_asset_base . '/tiny.png', ENT_QUOTES, 'UTF-8'); ?>" type="image/png" sizes="any">
    <link rel="apple-touch-icon" href="<?php echo htmlspecialchars($seo_asset_base . '/logo.png', ENT_QUOTES, 'UTF-8'); ?>">
    <meta name="apple-mobile-web-app-title" content="<?php echo htmlspecialchars($seo_site_name, ENT_QUOTES, 'UTF-8'); ?>">
    <meta name="mobile-web-app-capable" content="yes">
    <link rel="alternate" hreflang="en-US" href="<?php echo htmlspecialchars($seo_canonical, ENT_QUOTES, 'UTF-8'); ?>">
    <link rel="alternate" hreflang="x-default" href="<?php echo htmlspecialchars($seo_canonical, ENT_QUOTES, 'UTF-8'); ?>">

    <meta property="og:type" content="website">
    <meta property="og:site_name" content="<?php echo htmlspecialchars($seo_site_name, ENT_QUOTES, 'UTF-8'); ?>">
    <meta property="og:title" content="<?php echo htmlspecialchars($seo_title, ENT_QUOTES, 'UTF-8'); ?>">
    <meta property="og:description" content="<?php echo htmlspecialchars($seo_description, ENT_QUOTES, 'UTF-8'); ?>">
    <meta property="og:url" content="<?php echo htmlspecialchars($seo_canonical, ENT_QUOTES, 'UTF-8'); ?>">
    <meta property="og:locale" content="en_US">
    <meta property="og:image" content="<?php echo htmlspecialchars($seo_og_image, ENT_QUOTES, 'UTF-8'); ?>">
    <meta property="og:image:alt" content="<?php echo htmlspecialchars($seo_site_name . ' — QR code generator', ENT_QUOTES, 'UTF-8'); ?>">

    <meta name="twitter:card" content="summary_large_image">
    <meta name="twitter:title" content="<?php echo htmlspecialchars($seo_title, ENT_QUOTES, 'UTF-8'); ?>">
    <meta name="twitter:description" content="<?php echo htmlspecialchars($seo_description, ENT_QUOTES, 'UTF-8'); ?>">
    <meta name="twitter:image" content="<?php echo htmlspecialchars($seo_og_image, ENT_QUOTES, 'UTF-8'); ?>">
    <meta name="twitter:image:alt" content="<?php echo htmlspecialchars($seo_site_name . ' mascot and branding', ENT_QUOTES, 'UTF-8'); ?>">
<?php if ($seo_twitter_handle !== ''): ?>
    <meta name="twitter:site" content="<?php echo htmlspecialchars($seo_twitter_handle, ENT_QUOTES, 'UTF-8'); ?>">
<?php endif; ?>

    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link rel="dns-prefetch" href="https://cdnjs.cloudflare.com">
    <link rel="dns-prefetch" href="https://unpkg.com">
    <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800&display=swap" rel="stylesheet">
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.1/css/all.min.css">
    <link rel="stylesheet" href="style.css">

    <script type="application/ld+json"><?php echo $seo_jsonld_output($seo_jsonld_website); ?></script>
    <script type="application/ld+json"><?php echo $seo_jsonld_output($seo_jsonld_app); ?></script>
    <script type="application/ld+json"><?php echo $seo_jsonld_output($seo_jsonld_org); ?></script>
    <script type="application/ld+json"><?php echo $seo_jsonld_output($seo_jsonld_breadcrumb); ?></script>
</head>
<body>
<div id="app">

    <header id="site-header">
        <button class="header-logo" id="logo-home-btn" title="Start over" aria-label="PandaQR — Go to home">
            <img src="tiny.png" alt="PandaQR" class="header-logo-img">
            <span>Panda<strong>QR</strong></span>
        </button>

        <nav class="steps-nav" aria-label="Progress">
            <div class="step-item active" id="nav-step-1" data-step="1">
                <div class="step-num"><i class="fa-solid fa-check step-check"></i><span class="step-digit">1</span></div>
                <div class="step-label">
                    <span class="step-title">Choose QR Type</span>
                </div>
            </div>
            <div class="step-connector" id="conn-1"></div>
            <div class="step-item" id="nav-step-2" data-step="2">
                <div class="step-num"><i class="fa-solid fa-check step-check"></i><span class="step-digit">2</span></div>
                <div class="step-label">
                    <span class="step-title">Complete Content</span>
                </div>
            </div>
            <div class="step-connector" id="conn-2"></div>
            <div class="step-item" id="nav-step-3" data-step="3">
                <div class="step-num"><i class="fa-solid fa-check step-check"></i><span class="step-digit">3</span></div>
                <div class="step-label">
                    <span class="step-title">Customize QR</span>
                </div>
            </div>
        </nav>

        <div class="header-spacer"></div>

        <button class="btn-start-over" id="btn-start-over" style="display:none;" title="Start over from the beginning">
            <i class="fa-solid fa-rotate-left"></i>
            <span>Start Over</span>
        </button>

        <label class="theme-toggle" title="Toggle light / dark mode" aria-label="Toggle theme">
            <input type="checkbox" id="theme-toggle-input">
            <span class="theme-track">
                <i class="fa-solid fa-moon t-icon-moon"></i>
                <i class="fa-solid fa-sun t-icon-sun"></i>
            </span>
            <span class="theme-thumb"></span>
        </label>

    </header>

    <main id="main-content">

        <section id="step-1" class="step-content active">
            <div class="step1-wrapper">

                <div class="hero-section">
                    <div class="hero-content">
                        <span class="hero-eyebrow">
                            <i class="fa-solid fa-qrcode"></i> Free QR Code Generator
                        </span>
                        <h1 class="hero-title">Create Professional<br><span class="hero-accent">QR Codes</span> in Seconds</h1>
                        <p class="hero-desc">
                            Everything a QR code can do, fully under your control. Generate codes for
                            websites, business cards, WiFi, videos, and more, then make them yours with
                            custom colors, shapes, frames, and logos. Download instantly. No account needed.
                        </p>
                        <div class="hero-features">
                            <div class="hero-feature">
                                <span class="hf-icon"><i class="fa-solid fa-layer-group"></i></span>
                                <span>9 QR types</span>
                            </div>
                            <div class="hero-feature">
                                <span class="hf-icon"><i class="fa-solid fa-palette"></i></span>
                                <span>Full customization</span>
                            </div>
                            <div class="hero-feature">
                                <span class="hf-icon"><i class="fa-solid fa-download"></i></span>
                                <span>Free download</span>
                            </div>
                            <div class="hero-feature">
                                <span class="hf-icon"><i class="fa-solid fa-shield-halved"></i></span>
                                <span>No sign-up needed</span>
                            </div>
                        </div>
                    </div>
                    <div class="hero-mascot">
                        <div class="mascot-glow"></div>
                        <div class="mascot-card">
                            <img src="logo.png" alt="PandaQR mascot" class="mascot-img">
                        </div>
                    </div>
                </div>

                <div class="grid-section-header">
                    <h2>Choose your QR code type</h2>
                    <p>Select the type of content you want to encode, then we'll walk you through the rest.</p>
                </div>

                <div class="qr-types-grid">

                    <div class="qr-type-card" data-type="website">
                        <div class="qr-type-body">
                            <div class="qr-type-icon"><i class="fa-solid fa-globe"></i></div>
                            <div class="qr-type-text">
                                <h3>Website</h3>
                                <p>Open a website or landing page</p>
                            </div>
                        </div>
                        <div class="qr-type-arrow"><i class="fa-solid fa-arrow-right"></i></div>
                    </div>

                    <div class="qr-type-card" data-type="vcard">
                        <div class="qr-type-body">
                            <div class="qr-type-icon"><i class="fa-solid fa-address-card"></i></div>
                            <div class="qr-type-text">
                                <h3>vCard</h3>
                                <p>Share a digital business card</p>
                            </div>
                        </div>
                        <div class="qr-type-arrow"><i class="fa-solid fa-arrow-right"></i></div>
                    </div>

                    <div class="qr-type-card" data-type="pdf">
                        <div class="qr-type-body">
                            <div class="qr-type-icon"><i class="fa-solid fa-file-pdf"></i></div>
                            <div class="qr-type-text">
                                <h3>PDF</h3>
                                <p>Open a PDF document</p>
                            </div>
                        </div>
                        <div class="qr-type-arrow"><i class="fa-solid fa-arrow-right"></i></div>
                    </div>

                    <div class="qr-type-card" data-type="image">
                        <div class="qr-type-body">
                            <div class="qr-type-icon"><i class="fa-solid fa-image"></i></div>
                            <div class="qr-type-text">
                                <h3>Image</h3>
                                <p>Display an image or photo</p>
                            </div>
                        </div>
                        <div class="qr-type-arrow"><i class="fa-solid fa-arrow-right"></i></div>
                    </div>

                    <div class="qr-type-card" data-type="video">
                        <div class="qr-type-body">
                            <div class="qr-type-icon"><i class="fa-solid fa-circle-play"></i></div>
                            <div class="qr-type-text">
                                <h3>Video</h3>
                                <p>Display a video with one scan</p>
                            </div>
                        </div>
                        <div class="qr-type-arrow"><i class="fa-solid fa-arrow-right"></i></div>
                    </div>

                    <div class="qr-type-card" data-type="applink">
                        <div class="qr-type-body">
                            <div class="qr-type-icon"><i class="fa-solid fa-mobile-screen-button"></i></div>
                            <div class="qr-type-text">
                                <h3>App Link</h3>
                                <p>Redirects to different App stores</p>
                            </div>
                        </div>
                        <div class="qr-type-arrow"><i class="fa-solid fa-arrow-right"></i></div>
                    </div>

                    <div class="qr-type-card" data-type="whatsapp">
                        <div class="qr-type-body">
                            <div class="qr-type-icon"><i class="fa-brands fa-whatsapp"></i></div>
                            <div class="qr-type-text">
                                <h3>WhatsApp</h3>
                                <p>Start a WhatsApp chat instantly</p>
                            </div>
                        </div>
                        <div class="qr-type-arrow"><i class="fa-solid fa-arrow-right"></i></div>
                    </div>

                    <div class="qr-type-card" data-type="wifi">
                        <div class="qr-type-body">
                            <div class="qr-type-icon"><i class="fa-solid fa-wifi"></i></div>
                            <div class="qr-type-text">
                                <h3>WiFi</h3>
                                <p>Connect to a WiFi network</p>
                            </div>
                        </div>
                        <div class="qr-type-arrow"><i class="fa-solid fa-arrow-right"></i></div>
                    </div>

                    <div class="qr-type-card" data-type="feedback">
                        <div class="qr-type-body">
                            <div class="qr-type-icon"><i class="fa-solid fa-star"></i></div>
                            <div class="qr-type-text">
                                <h3>Feedback</h3>
                                <p>Request feedback or a review</p>
                            </div>
                        </div>
                        <div class="qr-type-arrow"><i class="fa-solid fa-arrow-right"></i></div>
                    </div>

                </div>
            </div>
        </section>

        <section id="step-2" class="step-content">
            <div class="step2-layout">
                <div class="form-panel" id="form-panel">
                </div>
                <aside class="step2-preview">
                    <div class="preview-phone">
                        <div class="phone-shell">
                            <div class="phone-notch"></div>
                            <div class="phone-screen">
                                <div class="phone-url-bar" id="phone-url-bar">
                                    <i class="fa-solid fa-lock" style="font-size:0.6rem;"></i>
                                    <span id="phone-url-text">your-content-here</span>
                                </div>
                                <div class="phone-content-area">
                                    <div class="phone-content-icon" id="phone-content-icon">
                                        <i class="fa-solid fa-globe"></i>
                                    </div>
                                    <div class="phone-content-lines">
                                        <div class="pline pline-lg"></div>
                                        <div class="pline"></div>
                                        <div class="pline pline-sm"></div>
                                        <div class="pline pline-btn"></div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <p class="preview-hint">Preview of your QR destination</p>
                </aside>
            </div>
        </section>

        <section id="step-3" class="step-content">
            <div class="step3-layout">

                <div class="customize-panel">

                    <div class="accordion-item" id="acc-frame">
                        <button class="accordion-header" aria-expanded="false">
                            <div class="accordion-header-left">
                                <div class="accordion-icon">
                                    <i class="fa-solid fa-border-all"></i>
                                </div>
                                <div class="accordion-title">
                                    <h3>Frame</h3>
                                    <p>Add a stylish frame around your QR code</p>
                                </div>
                            </div>
                            <i class="fa-solid fa-chevron-down accordion-chevron"></i>
                        </button>
                        <div class="accordion-body">
                            <p class="acc-section-label">Frame around the QR code</p>
                            <div class="frame-grid" id="frame-grid">
                            </div>
                            <div class="frame-text-row" id="frame-text-row" style="display:none;">
                                <div class="form-group mt-1">
                                    <label>Frame Text</label>
                                    <input type="text" class="form-control" id="frame-text" value="Scan me!" maxlength="40" placeholder="e.g. Scan me!">
                                </div>
                                <div class="color-row">
                                    <div class="color-input-block">
                                        <label>Text Color</label>
                                        <div class="color-field">
                                            <input type="text" id="text-color-hex" value="#FFFFFF" maxlength="7">
                                            <input type="color" id="text-color-picker" value="#ffffff">
                                        </div>
                                    </div>
                                    <div class="color-input-block">
                                        <label>Frame Color</label>
                                        <div class="color-field">
                                            <input type="text" id="frame-color-hex" value="#000000" maxlength="7">
                                            <input type="color" id="frame-color-picker" value="#000000">
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div class="accordion-item" id="acc-customize">
                        <button class="accordion-header" aria-expanded="false">
                            <div class="accordion-header-left">
                                <div class="accordion-icon">
                                    <i class="fa-solid fa-palette"></i>
                                </div>
                                <div class="accordion-title">
                                    <h3>Customization</h3>
                                    <p>Add unique shapes, colors &amp; texts to your QR</p>
                                </div>
                            </div>
                            <i class="fa-solid fa-chevron-down accordion-chevron"></i>
                        </button>
                        <div class="accordion-body">

                            <div class="shape-section">
                                <label class="shape-label">QR Shape</label>
                                <div class="shape-grid" id="dot-style-grid">
                                </div>
                            </div>

                            <div class="shape-section">
                                <label class="shape-label">Corner Square Shape</label>
                                <div class="shape-grid" id="corner-sq-grid">
                                </div>
                            </div>

                            <div class="shape-section">
                                <label class="shape-label">Corner Dot Shape</label>
                                <div class="shape-grid" id="corner-dot-grid">
                                </div>
                            </div>

                            <div class="color-row mt-1">
                                <div class="color-input-block">
                                    <label>QR Color</label>
                                    <div class="color-field">
                                        <input type="text" id="qr-color-hex" value="#000000" maxlength="7">
                                        <input type="color" id="qr-color-picker" value="#000000">
                                    </div>
                                </div>
                                <div class="color-input-block">
                                    <label>Background Color</label>
                                    <div class="color-field">
                                        <input type="text" id="bg-color-hex" value="#FFFFFF" maxlength="7">
                                        <input type="color" id="bg-color-picker" value="#ffffff">
                                    </div>
                                </div>
                            </div>

                        </div>
                    </div>

                    <div class="accordion-item" id="acc-logo">
                        <button class="accordion-header" aria-expanded="false">
                            <div class="accordion-header-left">
                                <div class="accordion-icon">
                                    <i class="fa-solid fa-image"></i>
                                </div>
                                <div class="accordion-title">
                                    <h3>Logo</h3>
                                    <p>Add your brand logo to the center of the QR code</p>
                                </div>
                            </div>
                            <i class="fa-solid fa-chevron-down accordion-chevron"></i>
                        </button>
                        <div class="accordion-body">
                            <div class="upload-zone-sm" id="logo-upload-zone">
                                <input type="file" id="logo-file-input" accept="image/*" style="display:none;">
                                <i class="fa-solid fa-cloud-arrow-up"></i>
                                <p>Click to upload or drag &amp; drop your logo</p>
                                <small>Max size: 5 MB &bull; jpg, .png, .svg, etc.</small>
                            </div>

                            <p class="acc-section-label" style="margin-top:1.25rem;">Select a logo</p>
                            <div class="logo-grid" id="logo-preset-grid">
                            </div>
                        </div>
                    </div>

                </div>

                <aside class="qr-preview-panel">
                    <div class="qr-preview-card">
                        <p class="preview-label">Live Preview</p>
                        <div id="qr-canvas-wrapper">
                            <canvas id="qr-preview-canvas"></canvas>
                        </div>
                        <p class="qr-name-label" id="qr-name-display">Your QR Code</p>
                    </div>
                </aside>

            </div>
        </section>

    </main>

    <footer id="site-footer">
        <div class="footer-left">
            <button class="btn btn-ghost" id="btn-cancel">Cancel</button>
        </div>
        <p class="footer-center" id="footer-copyright">
            © <span id="footer-year"><?php echo date('Y'); ?></span> Manda Panda Tools
        </p>
        <div class="footer-right">
            <button class="btn btn-ghost btn-icon" id="btn-back" style="display:none;">
                <i class="fa-solid fa-arrow-left"></i> Back
            </button>
            <button class="btn btn-primary btn-icon" id="btn-next" style="display:none;">
                Next <i class="fa-solid fa-arrow-right"></i>
            </button>
            <button class="btn btn-download" id="btn-download" style="display:none;">
                <i class="fa-solid fa-download"></i> Download QR
            </button>
        </div>
    </footer>

    <div id="toast" class="toast" aria-live="polite"></div>

</div>

<script src="https://unpkg.com/qr-code-styling@1.6.0-rc.1/lib/qr-code-styling.js"></script>
<script src="app.js"></script>
</body>
</html>
