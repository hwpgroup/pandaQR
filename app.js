'use strict';

const STATE = {
    step: 1,
    type: null,
    qrData: '',
    qrName: 'My QR Code',
    customize: {
        frameIndex: 0,
        dotStyle: 'square',
        cornerSqStyle: 'square',
        cornerDotStyle: 'square',
        qrColor: '#000000',
        bgColor: '#ffffff',
        frameColor: '#1a2235',
        frameText: 'Scan me!',
        textColor: '#ffffff',
        logoDataUrl: null,
    }
};

const FRAMES = [
    {
        id: 'none', label: 'None',
        hasText: false,
        thumb: `<svg viewBox="0 0 40 40" xmlns="http://www.w3.org/2000/svg"><rect x="5" y="5" width="30" height="30" fill="none" stroke="#3d506e" stroke-width="2" stroke-dasharray="3,2"/><rect x="10" y="10" width="20" height="20" fill="#3d506e" rx="1"/></svg>`,
        draw: drawFrameNone
    },
    {
        id: 'classic', label: 'Classic',
        hasText: true,
        thumb: `<svg viewBox="0 0 40 48" xmlns="http://www.w3.org/2000/svg"><rect x="1" y="1" width="38" height="38" fill="#fff" stroke="#222" stroke-width="2.5"/><rect x="5" y="5" width="30" height="30" fill="#ddd"/><rect x="1" y="39" width="38" height="8" fill="#222"/><text x="20" y="45.5" text-anchor="middle" font-size="5" fill="#fff" font-family="Arial">SCAN ME</text></svg>`,
        draw: drawFrameClassic
    },
    {
        id: 'rounded', label: 'Rounded',
        hasText: true,
        thumb: `<svg viewBox="0 0 40 48" xmlns="http://www.w3.org/2000/svg"><rect x="1" y="8" width="38" height="39" rx="5" fill="#fff" stroke="#222" stroke-width="2"/><rect x="1" y="1" width="38" height="10" rx="5" fill="#0ea5e9"/><rect x="6" y="12" width="28" height="28" fill="#ddd" rx="2"/><text x="20" y="7.5" text-anchor="middle" font-size="5" fill="#fff" font-family="Arial">SCAN ME</text></svg>`,
        draw: drawFrameRounded
    },
    {
        id: 'minimal', label: 'Minimal',
        hasText: true,
        thumb: `<svg viewBox="0 0 40 48" xmlns="http://www.w3.org/2000/svg"><rect x="8" y="8" width="24" height="24" fill="#ddd"/><path d="M2 10V2h8M38 10V2h-8M2 30v8h8M38 30v8h-8" stroke="#222" stroke-width="2.5" fill="none" stroke-linecap="round"/><text x="20" y="44" text-anchor="middle" font-size="5" fill="#555" font-family="Arial">SCAN ME</text></svg>`,
        draw: drawFrameMinimal
    },
    {
        id: 'double', label: 'Double Border',
        hasText: true,
        thumb: `<svg viewBox="0 0 40 48" xmlns="http://www.w3.org/2000/svg"><rect x="1" y="1" width="38" height="38" fill="none" stroke="#222" stroke-width="2"/><rect x="3.5" y="3.5" width="33" height="33" fill="none" stroke="#222" stroke-width="1"/><rect x="7" y="7" width="26" height="26" fill="#ddd"/><rect x="1" y="39" width="38" height="8" fill="#222"/><text x="20" y="45.5" text-anchor="middle" font-size="5" fill="#fff" font-family="Arial">SCAN ME</text></svg>`,
        draw: drawFrameDouble
    },
    {
        id: 'banner', label: 'Banner',
        hasText: true,
        thumb: `<svg viewBox="0 0 40 52" xmlns="http://www.w3.org/2000/svg"><rect x="0" y="0" width="40" height="10" fill="#0ea5e9"/><text x="20" y="7" text-anchor="middle" font-size="5" fill="#fff" font-family="Arial">SCAN ME</text><rect x="2" y="11" width="36" height="30" fill="#fff" stroke="#ddd" stroke-width="1"/><rect x="6" y="14" width="28" height="24" fill="#ddd"/><rect x="0" y="42" width="40" height="10" fill="#222"/><text x="20" y="49" text-anchor="middle" font-size="5" fill="#fff" font-family="Arial">SCAN HERE!</text></svg>`,
        draw: drawFrameBanner
    },
    {
        id: 'label', label: 'Label',
        hasText: true,
        thumb: `<svg viewBox="0 0 40 50" xmlns="http://www.w3.org/2000/svg"><rect x="1" y="1" width="38" height="48" rx="4" fill="#fff" stroke="#ddd" stroke-width="1.5"/><rect x="5" y="5" width="30" height="30" fill="#e0e0e0" rx="1"/><rect x="1" y="36" width="38" height="13" rx="0" fill="#f5f5f5"/><text x="20" y="42" text-anchor="middle" font-size="4.5" fill="#555" font-family="Arial">SCAN ME!</text><text x="20" y="47.5" text-anchor="middle" font-size="3.5" fill="#999" font-family="Arial">point camera here</text></svg>`,
        draw: drawFrameLabel
    },
    {
        id: 'modern', label: 'Modern',
        hasText: true,
        thumb: `<svg viewBox="0 0 40 48" xmlns="http://www.w3.org/2000/svg"><rect x="2" y="2" width="36" height="36" rx="3" fill="#fff" stroke="#e0e0e0" stroke-width="1.5"/><rect x="4" y="2" width="4" height="36" fill="#0ea5e9" rx="2"/><rect x="11" y="7" width="24" height="24" fill="#ddd" rx="1"/><text x="20" y="46" text-anchor="middle" font-size="5" fill="#555" font-family="Arial">SCAN ME</text></svg>`,
        draw: drawFrameModern
    },
];

function makeDotSvg(shape) {
    const d = { square:`<rect x="2" y="2" width="8" height="8"/>`, dots:`<circle cx="6" cy="6" r="4"/>`, rounded:`<rect x="2" y="2" width="8" height="8" rx="2.5"/>`, 'extra-rounded':`<rect x="2" y="2" width="8" height="8" rx="4"/>`, classy:`<path d="M2 2h8v8H2z M3 3h6v6H3z"/>`, 'classy-rounded':`<rect x="2" y="2" width="8" height="8" rx="3"/><rect x="3.5" y="3.5" width="5" height="5" rx="2" fill="#fff"/>` };
    const pat = d[shape] || d.square;
    const g = [0,12,24].map(ox=>[0,12,24].map(oy=>`<g transform="translate(${ox},${oy})">${pat}</g>`).join('')).join('');
    return `<svg viewBox="0 0 36 36" fill="currentColor" xmlns="http://www.w3.org/2000/svg">${g}</svg>`;
}

const DOT_STYLES = [
    { id:'square',          label:'Square',         svg: makeDotSvg('square') },
    { id:'dots',            label:'Dots',           svg: makeDotSvg('dots') },
    { id:'rounded',         label:'Rounded',        svg: makeDotSvg('rounded') },
    { id:'extra-rounded',   label:'Extra Rounded',  svg: makeDotSvg('extra-rounded') },
    { id:'classy',          label:'Classy',         svg: makeDotSvg('classy') },
    { id:'classy-rounded',  label:'Classy Rounded', svg: makeDotSvg('classy-rounded') },
];

const CORNER_SQ_STYLES = [
    { id:'square',       label:'Square',   svg:`<svg viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg"><rect x="2" y="2" width="20" height="20" fill="none" stroke="currentColor" stroke-width="3.5"/><rect x="7" y="7" width="10" height="10"/></svg>` },
    { id:'extra-rounded',label:'Rounded',  svg:`<svg viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg"><rect x="2" y="2" width="20" height="20" rx="7" fill="none" stroke="currentColor" stroke-width="3.5"/><rect x="7" y="7" width="10" height="10" rx="3"/></svg>` },
    { id:'dot',          label:'Dot',      svg:`<svg viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg"><circle cx="12" cy="12" r="10" fill="none" stroke="currentColor" stroke-width="3.5"/><circle cx="12" cy="12" r="5"/></svg>` },
];

const CORNER_DOT_STYLES = [
    { id:'square', label:'Square', svg:`<svg viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg"><rect x="5" y="5" width="14" height="14"/></svg>` },
    { id:'dot',    label:'Dot',    svg:`<svg viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg"><circle cx="12" cy="12" r="7"/></svg>` },
];

const LOGO_PRESETS = [
    { id:'none',        label:'None',         fa: null,                              color: null       },
    { id:'globe',       label:'Website',      fa:'fa-solid fa-globe',                color:'#0ea5e9'   },
    { id:'envelope',    label:'Email',        fa:'fa-solid fa-envelope',             color:'#6366f1'   },
    { id:'phone',       label:'Phone',        fa:'fa-solid fa-phone',                color:'#10b981'   },
    { id:'card',        label:'Contact',      fa:'fa-solid fa-address-card',         color:'#0284c7'   },
    { id:'comment',     label:'Chat',         fa:'fa-solid fa-comment',              color:'#22c55e'   },
    { id:'link',        label:'Link',         fa:'fa-solid fa-link',                 color:'#38bdf8'   },
    { id:'share',       label:'Share',        fa:'fa-solid fa-share-nodes',          color:'#3b82f6'   },
    { id:'hashtag',     label:'Hashtag',      fa:'fa-solid fa-hashtag',              color:'#ec4899'   },
    { id:'thumbs',      label:'Like',         fa:'fa-solid fa-thumbs-up',            color:'#3b82f6'   },
    { id:'heart',       label:'Favorite',     fa:'fa-solid fa-heart',                color:'#f43f5e'   },
    { id:'star',        label:'Rating',       fa:'fa-solid fa-star',                 color:'#f59e0b'   },
    { id:'bell',        label:'Notify',       fa:'fa-solid fa-bell',                 color:'#f59e0b'   },
    { id:'store',       label:'Shop',         fa:'fa-solid fa-store',                color:'#8b5cf6'   },
    { id:'cart',        label:'Cart',         fa:'fa-solid fa-cart-shopping',        color:'#f97316'   },
    { id:'tag',         label:'Offer',        fa:'fa-solid fa-tag',                  color:'#ec4899'   },
    { id:'dollar',      label:'Finance',      fa:'fa-solid fa-dollar-sign',          color:'#16a34a'   },
    { id:'chart',       label:'Analytics',    fa:'fa-solid fa-chart-line',           color:'#0284c7'   },
    { id:'briefcase',   label:'Work',         fa:'fa-solid fa-briefcase',            color:'#7c3aed'   },
    { id:'building',    label:'Company',      fa:'fa-solid fa-building',             color:'#94a3b8'   },
    { id:'gift',        label:'Gift',         fa:'fa-solid fa-gift',                 color:'#f43f5e'   },
    { id:'ticket',      label:'Ticket',       fa:'fa-solid fa-ticket',               color:'#8b5cf6'   },
    { id:'truck',       label:'Delivery',     fa:'fa-solid fa-truck',                color:'#f97316'   },
    { id:'location',    label:'Location',     fa:'fa-solid fa-location-dot',         color:'#ef4444'   },
    { id:'map',         label:'Map',          fa:'fa-solid fa-map',                  color:'#22c55e'   },
    { id:'home',        label:'Home',         fa:'fa-solid fa-house',                color:'#10b981'   },
    { id:'hotel',       label:'Hotel',        fa:'fa-solid fa-hotel',                color:'#a78bfa'   },
    { id:'plane',       label:'Travel',       fa:'fa-solid fa-plane',                color:'#0ea5e9'   },
    { id:'car',         label:'Auto',         fa:'fa-solid fa-car',                  color:'#64748b'   },
    { id:'utensils',    label:'Restaurant',   fa:'fa-solid fa-utensils',             color:'#f97316'   },
    { id:'coffee',      label:'Café',         fa:'fa-solid fa-mug-hot',              color:'#b45309'   },
    { id:'pizza',       label:'Food',         fa:'fa-solid fa-pizza-slice',          color:'#dc2626'   },
    { id:'beer',        label:'Bar',          fa:'fa-solid fa-beer-mug-empty',       color:'#d97706'   },
    { id:'video',       label:'Video',        fa:'fa-solid fa-circle-play',          color:'#ec4899'   },
    { id:'music',       label:'Music',        fa:'fa-solid fa-music',                color:'#a855f7'   },
    { id:'podcast',     label:'Podcast',      fa:'fa-solid fa-podcast',              color:'#7c3aed'   },
    { id:'image',       label:'Photo',        fa:'fa-solid fa-image',                color:'#06b6d4'   },
    { id:'camera',      label:'Camera',       fa:'fa-solid fa-camera',               color:'#6366f1'   },
    { id:'pdf',         label:'PDF',          fa:'fa-solid fa-file-pdf',             color:'#ef4444'   },
    { id:'wifi',        label:'WiFi',         fa:'fa-solid fa-wifi',                 color:'#0ea5e9'   },
    { id:'qrcode',      label:'QR Code',      fa:'fa-solid fa-qrcode',               color:'#6366f1'   },
    { id:'bolt',        label:'Fast',         fa:'fa-solid fa-bolt',                 color:'#fbbf24'   },
    { id:'shield',      label:'Security',     fa:'fa-solid fa-shield-halved',        color:'#3b82f6'   },
    { id:'key',         label:'Access',       fa:'fa-solid fa-key',                  color:'#d97706'   },
    { id:'tools',       label:'Services',     fa:'fa-solid fa-wrench',               color:'#94a3b8'   },
    { id:'stethoscope', label:'Medical',      fa:'fa-solid fa-stethoscope',          color:'#ef4444'   },
    { id:'graduation',  label:'Education',    fa:'fa-solid fa-graduation-cap',       color:'#7c3aed'   },
    { id:'book',        label:'Book',         fa:'fa-solid fa-book',                 color:'#b45309'   },
    { id:'leaf',        label:'Eco',          fa:'fa-solid fa-leaf',                 color:'#22c55e'   },
    { id:'paw',         label:'Pets',         fa:'fa-solid fa-paw',                  color:'#b45309'   },
    { id:'calendar',    label:'Event',        fa:'fa-solid fa-calendar-days',        color:'#7c3aed'   },
    { id:'info',        label:'Info',         fa:'fa-solid fa-circle-info',          color:'#38bdf8'   },
];

function getFormTemplate(type) {
    const T = {
        website: `
<div class="form-header">
    <h2><span class="fh-icon"><i class="fa-solid fa-globe"></i></span>Website</h2>
    <p>Enter the website URL for your QR code and give it a memorable name</p>
</div>
<div class="form-group">
    <label>Enter your website <span class="req">*</span></label>
    <input type="url" class="form-control" id="f-url" placeholder="https://example.com" required>
</div>
<div class="form-group">
    <label>Name your QR Code</label>
    <input type="text" class="form-control" id="f-name" placeholder="e.g. My Company Website">
</div>`,

        vcard: `
<div class="form-header">
    <h2><span class="fh-icon"><i class="fa-solid fa-address-card"></i></span>vCard</h2>
    <p>Fill in your contact details to create a digital business card</p>
</div>
<div class="form-row">
    <div class="form-group">
        <label>First Name <span class="req">*</span></label>
        <input type="text" class="form-control" id="f-firstname" placeholder="John" required>
    </div>
    <div class="form-group">
        <label>Last Name <span class="req">*</span></label>
        <input type="text" class="form-control" id="f-lastname" placeholder="Smith" required>
    </div>
</div>
<div class="form-row">
    <div class="form-group">
        <label>Email Address</label>
        <input type="email" class="form-control" id="f-email" placeholder="john@example.com">
    </div>
    <div class="form-group">
        <label>Phone Number</label>
        <input type="tel" class="form-control" id="f-phone" placeholder="+1 555 000 0000">
    </div>
</div>
<div class="form-row">
    <div class="form-group">
        <label>Company</label>
        <input type="text" class="form-control" id="f-company" placeholder="Acme Corp">
    </div>
    <div class="form-group">
        <label>Job Title</label>
        <input type="text" class="form-control" id="f-title" placeholder="CEO">
    </div>
</div>
<div class="form-group">
    <label>Website</label>
    <input type="url" class="form-control" id="f-website" placeholder="https://example.com">
</div>
<div class="form-group">
    <label>Street Address</label>
    <input type="text" class="form-control" id="f-street" placeholder="123 Main St">
</div>
<div class="form-row-3">
    <div class="form-group">
        <label>City</label>
        <input type="text" class="form-control" id="f-city" placeholder="New York">
    </div>
    <div class="form-group">
        <label>State / Region</label>
        <input type="text" class="form-control" id="f-state" placeholder="NY">
    </div>
    <div class="form-group">
        <label>ZIP / Postal Code</label>
        <input type="text" class="form-control" id="f-zip" placeholder="10001">
    </div>
</div>
<div class="form-group">
    <label>Country</label>
    <input type="text" class="form-control" id="f-country" placeholder="United States">
</div>
<div class="form-group">
    <label>Name your QR Code</label>
    <input type="text" class="form-control" id="f-name" placeholder="e.g. My Business Card">
</div>`,

        pdf: `
<div class="form-header">
    <h2><span class="fh-icon"><i class="fa-solid fa-file-pdf"></i></span>PDF</h2>
    <p>Upload a PDF document or link to an existing one</p>
</div>
<div class="upload-zone" id="pdf-drop-zone">
    <input type="file" id="pdf-file" accept="application/pdf" style="display:none">
    <i class="fa-solid fa-cloud-arrow-up uz-icon"></i>
    <p>Click to upload or drag &amp; drop your PDF</p>
    <small>Max size: 10 MB &bull; .pdf</small>
</div>
<div id="pdf-file-info" style="display:none;" class="upload-file-info">
    <i class="fa-solid fa-file-pdf" style="color:var(--danger)"></i>
    <span id="pdf-filename"></span>
    <button class="btn-remove-file" onclick="clearFileUpload('pdf')"><i class="fa-solid fa-xmark"></i></button>
</div>
<div class="upload-or-divider">or</div>
<div class="form-group">
    <label>PDF URL</label>
    <input type="url" class="form-control" id="f-pdf-url" placeholder="https://example.com/document.pdf">
</div>
<div class="form-group">
    <label>Name your QR Code</label>
    <input type="text" class="form-control" id="f-name" placeholder="e.g. Our Brochure">
</div>`,

        image: `
<div class="form-header">
    <h2><span class="fh-icon"><i class="fa-solid fa-image"></i></span>Image</h2>
    <p>Upload an image or link to an existing one</p>
</div>
<div class="upload-zone" id="img-drop-zone">
    <input type="file" id="img-file" accept="image/*" style="display:none">
    <i class="fa-solid fa-cloud-arrow-up uz-icon"></i>
    <p>Click to upload or drag &amp; drop your image</p>
    <small>Max size: 5 MB &bull; .jpg, .png, .gif, .webp</small>
</div>
<div id="img-file-info" style="display:none;" class="upload-file-info">
    <i class="fa-solid fa-image" style="color:var(--accent)"></i>
    <span id="img-filename"></span>
    <button class="btn-remove-file" onclick="clearFileUpload('img')"><i class="fa-solid fa-xmark"></i></button>
</div>
<div class="upload-or-divider">or</div>
<div class="form-group">
    <label>Image URL</label>
    <input type="url" class="form-control" id="f-img-url" placeholder="https://example.com/photo.jpg">
</div>
<div class="form-group">
    <label>Name your QR Code</label>
    <input type="text" class="form-control" id="f-name" placeholder="e.g. Product Photo">
</div>`,

        video: `
<div class="form-header">
    <h2><span class="fh-icon"><i class="fa-solid fa-circle-play"></i></span>Video</h2>
    <p>Share a video via QR code — supports YouTube, Vimeo, and direct URLs</p>
</div>
<div class="form-group">
    <label>Video URL <span class="req">*</span></label>
    <input type="url" class="form-control" id="f-url" placeholder="https://youtube.com/watch?v=..." required>
</div>
<div class="form-group">
    <label>Name your QR Code</label>
    <input type="text" class="form-control" id="f-name" placeholder="e.g. Our Promo Video">
</div>`,

        applink: `
<div class="form-header">
    <h2><span class="fh-icon"><i class="fa-solid fa-mobile-screen-button"></i></span>App Link</h2>
    <p>Redirect users to the correct app store based on their device</p>
</div>
<div class="form-group">
    <label>App Name</label>
    <input type="text" class="form-control" id="f-appname" placeholder="My App">
</div>
<div class="form-group">
    <label><i class="fa-brands fa-app-store-ios" style="color:#0ea5e9;margin-right:6px"></i>iOS App Store URL</label>
    <input type="url" class="form-control" id="f-ios" placeholder="https://apps.apple.com/app/...">
</div>
<div class="form-group">
    <label><i class="fa-brands fa-google-play" style="color:#10b981;margin-right:6px"></i>Android Play Store URL</label>
    <input type="url" class="form-control" id="f-android" placeholder="https://play.google.com/store/apps/...">
</div>
<div class="form-group">
    <label>Fallback URL (other devices)</label>
    <input type="url" class="form-control" id="f-fallback" placeholder="https://yourapp.com">
</div>
<div class="form-group">
    <label>Name your QR Code</label>
    <input type="text" class="form-control" id="f-name" placeholder="e.g. Download Our App">
</div>`,

        whatsapp: `
<div class="form-header">
    <h2><span class="fh-icon"><i class="fa-brands fa-whatsapp"></i></span>WhatsApp</h2>
    <p>Let anyone start a WhatsApp conversation with you instantly</p>
</div>
<div class="form-row">
    <div class="form-group">
        <label>Country Code</label>
        <select class="form-control" id="f-cc">
            <option value="1">+1 (US/Canada)</option>
            <option value="44">+44 (UK)</option>
            <option value="61">+61 (Australia)</option>
            <option value="49">+49 (Germany)</option>
            <option value="33">+33 (France)</option>
            <option value="34">+34 (Spain)</option>
            <option value="39">+39 (Italy)</option>
            <option value="55">+55 (Brazil)</option>
            <option value="52">+52 (Mexico)</option>
            <option value="91">+91 (India)</option>
            <option value="86">+86 (China)</option>
            <option value="81">+81 (Japan)</option>
            <option value="82">+82 (South Korea)</option>
            <option value="971">+971 (UAE)</option>
            <option value="966">+966 (Saudi Arabia)</option>
        </select>
    </div>
    <div class="form-group">
        <label>Phone Number <span class="req">*</span></label>
        <input type="tel" class="form-control" id="f-phone" placeholder="5551234567" required>
    </div>
</div>
<div class="form-group">
    <label>Pre-filled Message</label>
    <textarea class="form-control" id="f-message" placeholder="Hello! I found your QR code and..."></textarea>
</div>
<div class="form-group">
    <label>Name your QR Code</label>
    <input type="text" class="form-control" id="f-name" placeholder="e.g. Chat with Us">
</div>`,

        wifi: `
<div class="form-header">
    <h2><span class="fh-icon"><i class="fa-solid fa-wifi"></i></span>WiFi</h2>
    <p>Let people connect to your WiFi network with a single scan</p>
</div>
<div class="form-group">
    <label>Network Name (SSID) <span class="req">*</span></label>
    <input type="text" class="form-control" id="f-ssid" placeholder="MyHomeNetwork" required>
</div>
<div class="form-group">
    <label>Password</label>
    <input type="password" class="form-control" id="f-password" placeholder="••••••••••••">
</div>
<div class="form-group">
    <label>Security Type</label>
    <div class="radio-group">
        <label class="radio-label"><input type="radio" name="wifi-sec" value="WPA" checked> WPA/WPA2</label>
        <label class="radio-label"><input type="radio" name="wifi-sec" value="WEP"> WEP</label>
        <label class="radio-label"><input type="radio" name="wifi-sec" value=""> None (Open)</label>
    </div>
</div>
<div class="form-group">
    <div class="toggle-row">
        <span class="toggle-label-text">Hidden Network</span>
        <label class="toggle">
            <input type="checkbox" id="f-hidden">
            <span class="toggle-slider"></span>
        </label>
    </div>
</div>
<div class="form-group">
    <label>Name your QR Code</label>
    <input type="text" class="form-control" id="f-name" placeholder="e.g. Guest WiFi">
</div>`,

        feedback: `
<div class="form-header">
    <h2><span class="fh-icon"><i class="fa-solid fa-star"></i></span>Feedback</h2>
    <p>Direct customers to leave a review or provide feedback</p>
</div>
<div class="form-group">
    <label>Business Name</label>
    <input type="text" class="form-control" id="f-biz" placeholder="My Restaurant">
</div>
<div class="form-group">
    <label>Review Platform</label>
    <select class="form-control" id="f-platform">
        <option value="google">Google Reviews</option>
        <option value="yelp">Yelp</option>
        <option value="tripadvisor">TripAdvisor</option>
        <option value="facebook">Facebook</option>
        <option value="trustpilot">Trustpilot</option>
        <option value="custom">Custom URL</option>
    </select>
</div>
<div class="form-group">
    <label>Review Page URL <span class="req">*</span></label>
    <input type="url" class="form-control" id="f-url" placeholder="https://g.page/r/..." required>
</div>
<div class="form-group">
    <label>Name your QR Code</label>
    <input type="text" class="form-control" id="f-name" placeholder="e.g. Leave Us a Review">
</div>`,
    };
    return T[type] || '';
}

function buildQRData() {
    const v = id => { const el = document.getElementById(id); return el ? el.value.trim() : ''; };
    const type = STATE.type;

    if (type === 'website' || type === 'video' || type === 'feedback') {
        return v('f-url') || 'https://qrpanda.com';
    }

    if (type === 'vcard') {
        const fn = v('f-firstname'), ln = v('f-lastname');
        return [
            'BEGIN:VCARD', 'VERSION:3.0',
            `N:${ln};${fn};;;`,
            `FN:${fn} ${ln}`,
            v('f-company')  ? `ORG:${v('f-company')}` : '',
            v('f-title')    ? `TITLE:${v('f-title')}` : '',
            v('f-phone')    ? `TEL;TYPE=WORK,VOICE:${v('f-phone')}` : '',
            v('f-email')    ? `EMAIL:${v('f-email')}` : '',
            v('f-website')  ? `URL:${v('f-website')}` : '',
            (v('f-street') || v('f-city')) ? `ADR:;;${v('f-street')};${v('f-city')};${v('f-state')};${v('f-zip')};${v('f-country')}` : '',
            'END:VCARD',
        ].filter(Boolean).join('\n');
    }

    if (type === 'pdf') {
        return v('f-pdf-url') || STATE.qrData || 'https://example.com/document.pdf';
    }

    if (type === 'image') {
        return v('f-img-url') || STATE.qrData || 'https://example.com/image.jpg';
    }

    if (type === 'applink') {
        const ios = v('f-ios'), android = v('f-android'), fb = v('f-fallback');
        const base = window.location.origin + '/redirect.php';
        const params = new URLSearchParams();
        if (ios)     params.set('ios', ios);
        if (android) params.set('android', android);
        if (fb)      params.set('fallback', fb);
        return params.toString() ? `${base}?${params}` : (ios || android || fb || 'https://example.com');
    }

    if (type === 'whatsapp') {
        const cc = v('f-cc') || '1';
        const phone = v('f-phone').replace(/\D/g,'');
        const msg = v('f-message');
        const num = `${cc}${phone}`;
        return msg ? `https://wa.me/${num}?text=${encodeURIComponent(msg)}` : `https://wa.me/${num}`;
    }

    if (type === 'wifi') {
        const ssid = v('f-ssid');
        const pass = v('f-password');
        const sec  = document.querySelector('input[name="wifi-sec"]:checked')?.value ?? 'WPA';
        const hidden = document.getElementById('f-hidden')?.checked ? 'true' : 'false';
        const esc = s => s.replace(/[\\;,":]/g, c => '\\' + c);
        return `WIFI:T:${esc(sec)};S:${esc(ssid)};P:${esc(pass)};H:${hidden};;`;
    }

    return 'https://qrpanda.com';
}

let previewDebounce = null;

function schedulePreviewUpdate() {
    clearTimeout(previewDebounce);
    previewDebounce = setTimeout(renderQRPreview, 300);
}

async function renderQRPreview() {
    const data = buildQRData();
    if (!data) return;

    const c  = STATE.customize;
    const QR_SIZE = 260;

    const qrInst = new QRCodeStyling({
        width:  QR_SIZE,
        height: QR_SIZE,
        type:   'canvas',
        data:   data,
        margin: 10,
        qrOptions:  { errorCorrectionLevel: c.logoDataUrl ? 'H' : 'M' },
        imageOptions: { hideBackgroundDots: true, imageSize: 0.38, margin: 4, crossOrigin: 'anonymous' },
        dotsOptions:          { color: c.qrColor,  type: c.dotStyle },
        backgroundOptions:    { color: c.bgColor },
        cornersSquareOptions: { color: c.qrColor,  type: c.cornerSqStyle },
        cornersDotOptions:    { color: c.qrColor,  type: c.cornerDotStyle },
        image: c.logoDataUrl || undefined,
    });

    try {
        const blob = await qrInst.getRawData('png');
        const url  = URL.createObjectURL(blob);
        const img  = new Image();
        img.onload = () => {
            compositePreview(img, QR_SIZE);
            URL.revokeObjectURL(url);
        };
        img.onerror = () => URL.revokeObjectURL(url);
        img.src = url;
    } catch(e) {
        console.warn('QR render error:', e);
    }
}

function compositePreview(qrImg, qrSize) {
    const frame = FRAMES[STATE.customize.frameIndex] || FRAMES[0];
    const canvas = document.getElementById('qr-preview-canvas');
    frame.draw(canvas, qrImg, qrSize, STATE.customize, 1);
}

function setCanvasSize(canvas, w, h, scale) {
    canvas.width  = w * scale;
    canvas.height = h * scale;
    canvas.style.width  = w + 'px';
    canvas.style.height = h + 'px';
}

function drawFrameNone(canvas, qrImg, qrSize, opts, scale) {
    scale = scale || 1;
    setCanvasSize(canvas, qrSize, qrSize, scale);
    const ctx = canvas.getContext('2d');
    ctx.scale(scale, scale);
    ctx.clearRect(0, 0, qrSize, qrSize);
    ctx.drawImage(qrImg, 0, 0, qrSize, qrSize);
}

function drawFrameClassic(canvas, qrImg, qrSize, opts, scale) {
    scale = scale || 1;
    const pad = 16, barH = 42;
    const W = qrSize + pad * 2, H = qrSize + pad * 2 + barH;
    setCanvasSize(canvas, W, H, scale);
    const ctx = canvas.getContext('2d');
    ctx.scale(scale, scale);
    ctx.fillStyle = opts.bgColor || '#ffffff';
    ctx.fillRect(0, 0, W, H);
    ctx.strokeStyle = opts.frameColor;
    ctx.lineWidth = 3;
    ctx.strokeRect(1.5, 1.5, W - 3, H - 3);
    ctx.drawImage(qrImg, pad, pad, qrSize, qrSize);
    ctx.fillStyle = opts.frameColor;
    ctx.fillRect(0, H - barH, W, barH);
    ctx.fillStyle = opts.textColor || '#ffffff';
    ctx.font = `bold ${Math.round(barH * 0.42)}px Inter, Arial, sans-serif`;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText((opts.frameText || 'Scan me!').toUpperCase(), W / 2, H - barH / 2);
}

function drawFrameRounded(canvas, qrImg, qrSize, opts, scale) {
    scale = scale || 1;
    const pad = 16, topH = 44;
    const W = qrSize + pad * 2, H = qrSize + pad * 2 + topH;
    setCanvasSize(canvas, W, H, scale);
    const ctx = canvas.getContext('2d');
    ctx.scale(scale, scale);
    const r = 18;
    ctx.fillStyle = opts.bgColor || '#ffffff';
    roundRect(ctx, 0, 0, W, H, r);
    ctx.fill();
    ctx.fillStyle = opts.frameColor;
    roundRect(ctx, 0, 0, W, topH + r, r);
    ctx.fill();
    ctx.fillStyle = opts.bgColor || '#ffffff';
    ctx.fillRect(0, topH, W, r);
    ctx.fillStyle = opts.textColor || '#ffffff';
    ctx.font = `bold ${Math.round(topH * 0.4)}px Inter, Arial, sans-serif`;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(opts.frameText || 'Scan me!', W / 2, topH / 2);
    ctx.drawImage(qrImg, pad, topH + pad / 2, qrSize, qrSize);
    ctx.strokeStyle = opts.frameColor;
    ctx.lineWidth = 2;
    roundRect(ctx, 1, 1, W - 2, H - 2, r - 1);
    ctx.stroke();
}

function drawFrameMinimal(canvas, qrImg, qrSize, opts, scale) {
    scale = scale || 1;
    const pad = 20, bracketLen = 22, bracketW = 4, textH = 32;
    const W = qrSize + pad * 2, H = qrSize + pad * 2 + textH;
    setCanvasSize(canvas, W, H, scale);
    const ctx = canvas.getContext('2d');
    ctx.scale(scale, scale);
    ctx.fillStyle = opts.bgColor || '#ffffff';
    ctx.fillRect(0, 0, W, H);
    ctx.drawImage(qrImg, pad, pad, qrSize, qrSize);
    ctx.strokeStyle = opts.frameColor;
    ctx.lineWidth = bracketW;
    ctx.lineCap = 'round';
    const x1 = pad / 2, y1 = pad / 2;
    const x2 = W - pad / 2, y2 = pad / 2 + qrSize + pad;
    ctx.beginPath(); ctx.moveTo(x1 + bracketLen, y1); ctx.lineTo(x1, y1); ctx.lineTo(x1, y1 + bracketLen); ctx.stroke();
    ctx.beginPath(); ctx.moveTo(x2 - bracketLen, y1); ctx.lineTo(x2, y1); ctx.lineTo(x2, y1 + bracketLen); ctx.stroke();
    ctx.beginPath(); ctx.moveTo(x1 + bracketLen, y2); ctx.lineTo(x1, y2); ctx.lineTo(x1, y2 - bracketLen); ctx.stroke();
    ctx.beginPath(); ctx.moveTo(x2 - bracketLen, y2); ctx.lineTo(x2, y2); ctx.lineTo(x2, y2 - bracketLen); ctx.stroke();
    ctx.fillStyle = opts.frameColor;
    ctx.font = `600 ${Math.round(textH * 0.45)}px Inter, Arial, sans-serif`;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(opts.frameText || 'Scan me!', W / 2, qrSize + pad * 2 + textH / 2 - 4);
}

function drawFrameDouble(canvas, qrImg, qrSize, opts, scale) {
    scale = scale || 1;
    const pad = 16, barH = 42, gap = 6;
    const W = qrSize + pad * 2, H = qrSize + pad * 2 + barH;
    setCanvasSize(canvas, W, H, scale);
    const ctx = canvas.getContext('2d');
    ctx.scale(scale, scale);
    ctx.fillStyle = opts.bgColor || '#ffffff';
    ctx.fillRect(0, 0, W, H);
    ctx.strokeStyle = opts.frameColor;
    ctx.lineWidth = 2.5;
    ctx.strokeRect(1.25, 1.25, W - 2.5, H - 2.5);
    ctx.lineWidth = 1;
    ctx.strokeRect(1.25 + gap, 1.25 + gap, W - 2.5 - gap * 2, H - 2.5 - gap * 2 - barH + gap);
    ctx.drawImage(qrImg, pad, pad, qrSize, qrSize);
    ctx.fillStyle = opts.frameColor;
    ctx.fillRect(0, H - barH, W, barH);
    ctx.fillStyle = opts.textColor || '#ffffff';
    ctx.font = `bold ${Math.round(barH * 0.42)}px Inter, Arial, sans-serif`;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText((opts.frameText || 'Scan me!').toUpperCase(), W / 2, H - barH / 2);
}

function drawFrameBanner(canvas, qrImg, qrSize, opts, scale) {
    scale = scale || 1;
    const topH = 44, botH = 40, pad = 14;
    const W = qrSize + pad * 2, H = qrSize + pad * 2 + topH + botH;
    setCanvasSize(canvas, W, H, scale);
    const ctx = canvas.getContext('2d');
    ctx.scale(scale, scale);
    ctx.fillStyle = opts.bgColor || '#ffffff';
    ctx.fillRect(0, 0, W, H);
    ctx.fillStyle = opts.frameColor;
    ctx.fillRect(0, 0, W, topH);
    ctx.fillStyle = opts.textColor || '#ffffff';
    ctx.font = `bold ${Math.round(topH * 0.4)}px Inter, Arial, sans-serif`;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(opts.frameText || 'Scan me!', W / 2, topH / 2);
    ctx.strokeStyle = opts.frameColor;
    ctx.lineWidth = 1.5;
    ctx.strokeRect(0.75, topH + 0.75, W - 1.5, qrSize + pad * 2 - 1.5);
    ctx.drawImage(qrImg, pad, topH + pad, qrSize, qrSize);
    ctx.fillStyle = '#f5f5f5';
    ctx.fillRect(0, H - botH, W, botH);
    ctx.strokeStyle = opts.frameColor;
    ctx.lineWidth = 1;
    ctx.strokeRect(0.5, H - botH + 0.5, W - 1, botH - 1);
    ctx.fillStyle = opts.frameColor;
    ctx.font = `600 ${Math.round(botH * 0.36)}px Inter, Arial, sans-serif`;
    ctx.textBaseline = 'middle';
    ctx.fillText('SCAN HERE!', W / 2, H - botH / 2);
}

function drawFrameLabel(canvas, qrImg, qrSize, opts, scale) {
    scale = scale || 1;
    const pad = 16, labelH = 52, r = 14;
    const W = qrSize + pad * 2, H = qrSize + pad * 2 + labelH;
    setCanvasSize(canvas, W, H, scale);
    const ctx = canvas.getContext('2d');
    ctx.scale(scale, scale);
    ctx.fillStyle = opts.bgColor || '#ffffff';
    roundRect(ctx, 0, 0, W, H, r);
    ctx.fill();
    ctx.strokeStyle = '#dddddd';
    ctx.lineWidth = 1.5;
    roundRect(ctx, 0.75, 0.75, W - 1.5, H - 1.5, r - 0.75);
    ctx.stroke();
    ctx.drawImage(qrImg, pad, pad, qrSize, qrSize);
    ctx.strokeStyle = '#eeeeee';
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(pad, qrSize + pad * 1.5);
    ctx.lineTo(W - pad, qrSize + pad * 1.5);
    ctx.stroke();
    ctx.fillStyle = opts.frameColor || '#333333';
    ctx.font = `bold ${Math.round(labelH * 0.35)}px Inter, Arial, sans-serif`;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(opts.frameText || 'Scan me!', W / 2, H - labelH / 2 - 4);
    ctx.fillStyle = '#999999';
    ctx.font = `400 ${Math.round(labelH * 0.26)}px Inter, Arial, sans-serif`;
    ctx.fillText('point your camera here', W / 2, H - labelH * 0.28);
}

function drawFrameModern(canvas, qrImg, qrSize, opts, scale) {
    scale = scale || 1;
    const pad = 16, barW = 8, textH = 36, r = 10;
    const W = qrSize + pad * 2 + barW, H = qrSize + pad * 2 + textH;
    setCanvasSize(canvas, W, H, scale);
    const ctx = canvas.getContext('2d');
    ctx.scale(scale, scale);
    ctx.fillStyle = opts.bgColor || '#ffffff';
    roundRect(ctx, 0, 0, W, H, r);
    ctx.fill();
    ctx.strokeStyle = '#e0e0e0';
    ctx.lineWidth = 1.5;
    roundRect(ctx, 0.75, 0.75, W - 1.5, H - 1.5, r);
    ctx.stroke();
    ctx.fillStyle = opts.frameColor;
    roundRect(ctx, 0, 0, barW + r, H, r);
    ctx.fill();
    ctx.fillStyle = opts.frameColor;
    ctx.fillRect(r, 0, barW, H - textH);
    ctx.drawImage(qrImg, pad + barW, pad, qrSize, qrSize);
    ctx.fillStyle = opts.frameColor || '#333333';
    ctx.font = `600 ${Math.round(textH * 0.42)}px Inter, Arial, sans-serif`;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(opts.frameText || 'Scan me!', (W + barW) / 2, qrSize + pad * 1.5 + textH / 2 - 2);
}

function roundRect(ctx, x, y, w, h, r) {
    ctx.beginPath();
    ctx.moveTo(x + r, y);
    ctx.lineTo(x + w - r, y);
    ctx.quadraticCurveTo(x + w, y, x + w, y + r);
    ctx.lineTo(x + w, y + h - r);
    ctx.quadraticCurveTo(x + w, y + h, x + w - r, y + h);
    ctx.lineTo(x + r, y + h);
    ctx.quadraticCurveTo(x, y + h, x, y + h - r);
    ctx.lineTo(x, y + r);
    ctx.quadraticCurveTo(x, y, x + r, y);
    ctx.closePath();
}

document.addEventListener('DOMContentLoaded', init);

function init() {
    setupThemeToggle();
    setupTypeCards();
    setupFooterButtons();
    setupAccordions();
    renderFrameGrid();
    renderShapeGrids();
    renderLogoGrid();
    setupColorPickers();
    setupLogoUpload();
    updateNavUI();
}

function setupThemeToggle() {
    const toggle = document.getElementById('theme-toggle-input');
    if (!toggle) return;

    const saved = localStorage.getItem('qrpanda-theme') || 'dark';
    applyTheme(saved, toggle);

    toggle.addEventListener('change', () => {
        const next = toggle.checked ? 'light' : 'dark';
        applyTheme(next, toggle);
        localStorage.setItem('qrpanda-theme', next);
    });
}

function applyTheme(theme, toggle) {
    document.documentElement.setAttribute('data-theme', theme);
    if (toggle) toggle.checked = (theme === 'light');
}

function setupTypeCards() {
    document.querySelectorAll('.qr-type-card').forEach(card => {
        card.addEventListener('click', () => {
            const type = card.dataset.type;
            document.querySelectorAll('.qr-type-card').forEach(c => c.classList.remove('selected'));
            card.classList.add('selected');
            STATE.type = type;
            goToStep(2);
        });
        card.addEventListener('keydown', e => {
            if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); card.click(); }
        });
        card.tabIndex = 0;
    });
}

function setupFooterButtons() {
    document.getElementById('logo-home-btn').addEventListener('click', () => {
        if (STATE.step === 1 && !STATE.type || confirm('Start over? Your current QR will be lost.')) resetApp();
    });
    document.getElementById('btn-start-over').addEventListener('click', () => {
        if (confirm('Start over? Your current QR will be lost.')) resetApp();
    });
    document.getElementById('btn-cancel').addEventListener('click', () => {
        if (confirm('Cancel and start over?')) resetApp();
    });
    document.getElementById('btn-back').addEventListener('click', () => {
        goToStep(STATE.step - 1);
    });
    document.getElementById('btn-next').addEventListener('click', () => {
        if (STATE.step === 2 && !validateStep2()) return;
        goToStep(STATE.step + 1);
    });
    document.getElementById('btn-download').addEventListener('click', downloadQR);
}

function setupAccordions() {
    document.querySelectorAll('.accordion-header').forEach(btn => {
        btn.addEventListener('click', () => {
            const item = btn.closest('.accordion-item');
            const isOpen = item.classList.contains('open');
            item.classList.toggle('open', !isOpen);
            btn.setAttribute('aria-expanded', !isOpen);
        });
    });
}

function renderFrameGrid() {
    const grid = document.getElementById('frame-grid');
    if (!grid) return;
    grid.innerHTML = FRAMES.map((f, i) => `
        <div class="frame-thumb ${i === 0 ? 'none-opt selected' : ''}" data-frame="${i}" title="${f.label}">
            ${f.thumb}
        </div>
    `).join('');
    grid.querySelectorAll('.frame-thumb').forEach(el => {
        el.addEventListener('click', () => {
            grid.querySelectorAll('.frame-thumb').forEach(e => e.classList.remove('selected'));
            el.classList.add('selected');
            STATE.customize.frameIndex = parseInt(el.dataset.frame);
            const frame = FRAMES[STATE.customize.frameIndex];
            const textRow = document.getElementById('frame-text-row');
            if (textRow) textRow.style.display = frame.hasText ? '' : 'none';
            schedulePreviewUpdate();
        });
    });
}

function renderShapeGrids() {
    renderGrid('dot-style-grid',  DOT_STYLES,      'dotStyle');
    renderGrid('corner-sq-grid',  CORNER_SQ_STYLES,'cornerSqStyle');
    renderGrid('corner-dot-grid', CORNER_DOT_STYLES,'cornerDotStyle');
}

function renderGrid(id, items, stateKey) {
    const el = document.getElementById(id);
    if (!el) return;
    el.innerHTML = items.map((item, i) => `
        <div class="shape-opt ${i === 0 ? 'selected' : ''}" data-value="${item.id}" title="${item.label}" style="color:var(--text-primary)">
            ${item.svg}
        </div>
    `).join('');
    el.querySelectorAll('.shape-opt').forEach(opt => {
        opt.addEventListener('click', () => {
            el.querySelectorAll('.shape-opt').forEach(o => o.classList.remove('selected'));
            opt.classList.add('selected');
            STATE.customize[stateKey] = opt.dataset.value;
            schedulePreviewUpdate();
        });
    });
}

const LOGO_CACHE = {};
const LOGO_SVG_HTML = {};

function presetSvgAssetUrl(faClass) {
    const iconName = faClass.trim().split(/\s+/).pop().replace('fa-', '');
    return new URL(`assets/fa-presets/${iconName}.svg`, window.location.href).href;
}

async function loadPresetSvg(faClass, color) {
    const url = presetSvgAssetUrl(faClass);
    const resp = await fetch(url, { cache: 'force-cache' });
    if (!resp.ok) throw new Error(`HTTP ${resp.status}`);
    let svg = await resp.text();
    svg = svg.replace(/<!--[\s\S]*?-->/g, '');
    svg = svg.replace(/<svg\s/, `<svg fill="${color}" `);
    const dataUrl = 'data:image/svg+xml;charset=utf-8,' + encodeURIComponent(svg);
    return { svg, dataUrl };
}

async function renderLogoGrid() {
    const grid = document.getElementById('logo-preset-grid');
    if (!grid) return;

    grid.innerHTML = LOGO_PRESETS.map((_, i) =>
        `<div class="logo-opt logo-skeleton ${i === 0 ? 'selected' : ''}" data-id="${LOGO_PRESETS[i].id}"></div>`
    ).join('');

    await Promise.all(
        LOGO_PRESETS.filter(l => l.fa).map(async logo => {
            try {
                const { svg, dataUrl } = await loadPresetSvg(logo.fa, logo.color);
                LOGO_CACHE[logo.id]    = dataUrl;
                LOGO_SVG_HTML[logo.id] = svg;
            } catch (e) {
                console.warn('Logo preset SVG failed:', logo.id, e);
                LOGO_CACHE[logo.id]    = null;
                LOGO_SVG_HTML[logo.id] = null;
            }
        })
    );

    grid.innerHTML = LOGO_PRESETS.map((logo, i) => {
        let inner;
        if (!logo.fa) {
            inner = `<span class="logo-none-x"><i class="fa-solid fa-ban"></i></span>`;
        } else if (LOGO_SVG_HTML[logo.id]) {
            inner = `<span class="logo-svg-wrap">${LOGO_SVG_HTML[logo.id]}</span>`;
        } else {
            inner = `<span class="logo-none-x"><i class="fa-solid fa-triangle-exclamation"></i></span>`;
        }
        return `<div class="logo-opt ${i === 0 ? 'selected' : ''}" data-id="${logo.id}" title="${logo.label}">${inner}</div>`;
    }).join('');

    attachLogoGridHandlers(grid);
}

function attachLogoGridHandlers(grid) {
    grid.querySelectorAll('.logo-opt').forEach(opt => {
        opt.addEventListener('click', () => {
            grid.querySelectorAll('.logo-opt').forEach(o => o.classList.remove('selected'));
            opt.classList.add('selected');
            const id = opt.dataset.id;
            STATE.customize.logoDataUrl = LOGO_CACHE[id] || null;
            schedulePreviewUpdate();
        });
    });
}

function setupColorPickers() {
    linkColorPair('qr-color-hex',    'qr-color-picker',   'qrColor');
    linkColorPair('bg-color-hex',    'bg-color-picker',   'bgColor');
    linkColorPair('frame-color-hex', 'frame-color-picker','frameColor');
    linkColorPair('text-color-hex',  'text-color-picker', 'textColor');

    const frameTextInput = document.getElementById('frame-text');
    if (frameTextInput) {
        frameTextInput.addEventListener('input', () => {
            STATE.customize.frameText = frameTextInput.value;
            schedulePreviewUpdate();
        });
    }
}

function linkColorPair(hexId, pickerId, stateKey) {
    const hexEl   = document.getElementById(hexId);
    const pickEl  = document.getElementById(pickerId);
    if (!hexEl || !pickEl) return;
    hexEl.addEventListener('input', () => {
        const val = hexEl.value;
        if (/^#[0-9a-fA-F]{6}$/.test(val)) {
            STATE.customize[stateKey] = val;
            pickEl.value = val;
            schedulePreviewUpdate();
        }
    });
    pickEl.addEventListener('input', () => {
        const val = pickEl.value;
        STATE.customize[stateKey] = val;
        hexEl.value = val.toUpperCase();
        schedulePreviewUpdate();
    });
}

function setupLogoUpload() {
    const zone  = document.getElementById('logo-upload-zone');
    const input = document.getElementById('logo-file-input');
    if (!zone || !input) return;

    zone.addEventListener('click', () => input.click());
    zone.addEventListener('dragover', e => { e.preventDefault(); zone.classList.add('drag-over'); });
    zone.addEventListener('dragleave', () => zone.classList.remove('drag-over'));
    zone.addEventListener('drop', e => {
        e.preventDefault();
        zone.classList.remove('drag-over');
        const file = e.dataTransfer.files[0];
        if (file) handleLogoFile(file);
    });
    input.addEventListener('change', () => {
        if (input.files[0]) handleLogoFile(input.files[0]);
    });
}

function handleLogoFile(file) {
    if (!file.type.startsWith('image/')) { showToast('Please upload an image file.', 'error'); return; }
    if (file.size > 5 * 1024 * 1024) { showToast('Logo file must be under 5 MB.', 'error'); return; }
    const reader = new FileReader();
    reader.onload = e => {
        STATE.customize.logoDataUrl = e.target.result;
        document.querySelectorAll('.logo-opt').forEach(o => o.classList.remove('selected'));
        schedulePreviewUpdate();
        showToast('Logo uploaded!', 'success');
    };
    reader.readAsDataURL(file);
}

function goToStep(target) {
    if (target < 1 || target > 3) return;
    if (target === 2 && STATE.step === 1) {
        renderStep2Form();
    }
    if (target === 3) {
        const data = buildQRData();
        const nameEl = document.getElementById('f-name');
        STATE.qrData  = data;
        STATE.qrName  = nameEl ? (nameEl.value.trim() || 'My QR Code') : 'My QR Code';
        document.getElementById('qr-name-display').textContent = STATE.qrName;
        setTimeout(() => renderQRPreview(), 100);
    }

    document.querySelectorAll('.step-content').forEach(s => s.classList.remove('active'));
    document.getElementById(`step-${target}`).classList.add('active');
    STATE.step = target;
    updateNavUI();
    window.scrollTo({ top: 0, behavior: 'smooth' });
}

function updateNavUI() {
    const s = STATE.step;
    document.getElementById('btn-back').style.display       = s > 1       ? '' : 'none';
    document.getElementById('btn-next').style.display       = s === 2     ? '' : 'none';
    document.getElementById('btn-download').style.display   = s === 3     ? '' : 'none';
    document.getElementById('btn-start-over').style.display = STATE.type  ? '' : 'none';

    for (let i = 1; i <= 3; i++) {
        const nav = document.getElementById(`nav-step-${i}`);
        nav.classList.remove('active', 'completed');
        if (i === s) nav.classList.add('active');
        else if (i < s) nav.classList.add('completed');
        const conn = document.getElementById(`conn-${i}`);
        if (conn) conn.classList.toggle('done', i < s);
    }
}

function resetApp() {
    STATE.step = 1;
    STATE.type = null;
    document.getElementById('btn-start-over').style.display = 'none';
    STATE.qrData = '';
    STATE.customize = {
        frameIndex: 0, dotStyle: 'square', cornerSqStyle: 'square',
        cornerDotStyle: 'square', qrColor: '#000000', bgColor: '#ffffff',
        frameColor: '#1a2235', frameText: 'Scan me!', textColor: '#ffffff',
        logoDataUrl: null,
    };
    document.querySelectorAll('.qr-type-card').forEach(c => c.classList.remove('selected'));
    document.querySelectorAll('.step-content').forEach(s => s.classList.remove('active'));
    document.getElementById('step-1').classList.add('active');
    updateNavUI();
}

function renderStep2Form() {
    const panel = document.getElementById('form-panel');
    if (!panel) return;
    panel.innerHTML = `<div class="form-section">${getFormTemplate(STATE.type)}</div>`;
    setupUploadZones();
    setupPhonePreview();
}

function setupUploadZones() {
    ['pdf','img'].forEach(prefix => {
        const zone = document.getElementById(`${prefix}-drop-zone`);
        const input = document.getElementById(`${prefix}-file`);
        if (!zone || !input) return;
        zone.addEventListener('click', () => input.click());
        zone.addEventListener('dragover', e => { e.preventDefault(); zone.classList.add('drag-over'); });
        zone.addEventListener('dragleave', () => zone.classList.remove('drag-over'));
        zone.addEventListener('drop', e => {
            e.preventDefault(); zone.classList.remove('drag-over');
            if (e.dataTransfer.files[0]) handleUploadFile(prefix, e.dataTransfer.files[0]);
        });
        input.addEventListener('change', () => {
            if (input.files[0]) handleUploadFile(prefix, input.files[0]);
        });
    });
}

function handleUploadFile(prefix, file) {
    const fd = new FormData();
    fd.append('file', file);
    fetch('upload.php', { method:'POST', body: fd })
        .then(r => r.json())
        .then(data => {
            if (data.url) {
                STATE.qrData = window.location.origin + '/' + data.url;
                const infoEl = document.getElementById(`${prefix}-file-info`);
                const nameEl = document.getElementById(`${prefix}-filename`);
                if (infoEl) infoEl.style.display = '';
                if (nameEl) nameEl.textContent = data.name || file.name;
                updatePhonePreview(STATE.qrData);
                showToast('File uploaded!', 'success');
            } else {
                showToast(data.error || 'Upload failed', 'error');
            }
        })
        .catch(() => showToast('Upload failed. Check server.', 'error'));
}

function clearFileUpload(prefix) {
    STATE.qrData = '';
    const infoEl = document.getElementById(`${prefix}-file-info`);
    if (infoEl) infoEl.style.display = 'none';
    const input = document.getElementById(`${prefix}-file`);
    if (input) input.value = '';
}

function setupPhonePreview() {
    const inputs = document.querySelectorAll('#form-panel .form-control');
    inputs.forEach(inp => inp.addEventListener('input', updatePhoneLive));
}

function updatePhoneLive() {
    const urlEl = document.getElementById('f-url') || document.getElementById('f-pdf-url') ||
                  document.getElementById('f-img-url') || document.getElementById('f-phone');
    const nameEl = document.getElementById('f-firstname') || document.getElementById('f-ssid');
    const preview = urlEl?.value || nameEl?.value || '';
    updatePhonePreview(preview);
}

function updatePhonePreview(text) {
    const bar = document.getElementById('phone-url-text');
    const icon = document.getElementById('phone-content-icon');
    if (bar) bar.textContent = text || 'your-content-here';
    if (icon) {
        const iconMap = {
            website:'fa-globe', vcard:'fa-address-card', pdf:'fa-file-pdf',
            image:'fa-image', video:'fa-circle-play', applink:'fa-mobile-screen-button',
            whatsapp:'fa-brands fa-whatsapp', wifi:'fa-wifi', feedback:'fa-star'
        };
        const ic = iconMap[STATE.type] || 'fa-globe';
        icon.innerHTML = `<i class="fa-solid ${ic}"></i>`;
    }
}

function validateStep2() {
    const required = document.querySelectorAll('#form-panel [required]');
    for (const el of required) {
        if (!el.value.trim()) {
            el.focus();
            el.style.borderColor = 'var(--danger)';
            setTimeout(() => el.style.borderColor = '', 2000);
            showToast('Please fill in all required fields.', 'error');
            return false;
        }
    }
    return true;
}

(function injectExtraStyles() {
    const style = document.createElement('style');
    style.textContent = `
        .upload-file-info {
            display: flex; align-items: center; gap: 0.75rem;
            padding: 0.75rem 1rem;
            background: var(--bg-input);
            border: 1px solid var(--border);
            border-radius: var(--r-md);
            font-size: 0.875rem; color: var(--text-secondary);
        }
        .upload-file-info span { flex: 1; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
        .btn-remove-file {
            background: none; border: none; color: var(--text-muted);
            cursor: pointer; padding: 2px 6px; border-radius: 4px;
            transition: color 150ms ease;
        }
        .btn-remove-file:hover { color: var(--danger); }
        .form-section { max-width: 680px; }
    `;
    document.head.appendChild(style);
})();

async function downloadQR() {
    const btn = document.getElementById('btn-download');
    btn.disabled = true;
    btn.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> Generating…';

    const data = buildQRData() || STATE.qrData;
    if (!data) {
        showToast('No QR data to generate.', 'error');
        btn.disabled = false;
        btn.innerHTML = '<i class="fa-solid fa-download"></i> Download QR';
        return;
    }

    const c  = STATE.customize;
    const DL_SIZE = 800;

    try {
        const qrInst = new QRCodeStyling({
            width:  DL_SIZE,
            height: DL_SIZE,
            type:   'canvas',
            data:   data,
            margin: 30,
            qrOptions:  { errorCorrectionLevel: c.logoDataUrl ? 'H' : 'M' },
            imageOptions: { hideBackgroundDots: true, imageSize: 0.35, margin: 8, crossOrigin:'anonymous' },
            dotsOptions:          { color: c.qrColor, type: c.dotStyle },
            backgroundOptions:    { color: c.bgColor },
            cornersSquareOptions: { color: c.qrColor, type: c.cornerSqStyle },
            cornersDotOptions:    { color: c.qrColor, type: c.cornerDotStyle },
            image: c.logoDataUrl || undefined,
        });

        const blob = await qrInst.getRawData('png');
        const url  = URL.createObjectURL(blob);
        const img  = new Image();

        img.onload = () => {
            const offscreen = document.createElement('canvas');
            const frame = FRAMES[c.frameIndex] || FRAMES[0];
            frame.draw(offscreen, img, DL_SIZE, c, 1);

            offscreen.toBlob(finalBlob => {
                const a = document.createElement('a');
                a.href = URL.createObjectURL(finalBlob);
                a.download = (STATE.qrName || 'qrcode').replace(/[^a-z0-9_\-]/gi,'_') + '.jpg';
                a.click();
                URL.revokeObjectURL(a.href);
                URL.revokeObjectURL(url);
                showToast('QR code downloaded!', 'success');
            }, 'image/jpeg', 0.95);
        };
        img.onerror = () => {
            URL.revokeObjectURL(url);
            showToast('Generation failed. Please try again.', 'error');
        };
        img.src = url;
    } catch(e) {
        console.error(e);
        showToast('Error generating QR code.', 'error');
    } finally {
        btn.disabled = false;
        btn.innerHTML = '<i class="fa-solid fa-download"></i> Download QR';
    }
}

let toastTimer = null;
function showToast(msg, type) {
    const el = document.getElementById('toast');
    if (!el) return;
    el.textContent = msg;
    el.className = `toast show${type ? ' toast-' + type : ''}`;
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => el.classList.remove('show'), 3000);
}

(function setFooterYear() {
    const el = document.getElementById('footer-year');
    if (el) el.textContent = String(new Date().getFullYear());
})();
