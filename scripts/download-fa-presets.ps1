$base = 'https://cdn.jsdelivr.net/npm/@fortawesome/fontawesome-free@6.5.1/svgs/solid/'
$dest = Join-Path $PSScriptRoot '..\assets\fa-presets'
New-Item -ItemType Directory -Force -Path $dest | Out-Null
$icons = @(
    'globe','envelope','phone','address-card','comment','link','share-nodes','hashtag','thumbs-up','heart','star','bell',
    'store','cart-shopping','tag','dollar-sign','chart-line','briefcase','building','gift','ticket','truck',
    'location-dot','map','house','hotel','plane','car','utensils','mug-hot','pizza-slice','beer-mug-empty',
    'circle-play','music','podcast','image','camera','file-pdf','wifi','qrcode','bolt','shield-halved','key','wrench',
    'stethoscope','graduation-cap','book','leaf','paw','calendar-days','circle-info'
)
foreach ($name in $icons) {
    $url = "$base$name.svg"
    $out = Join-Path $dest "$name.svg"
    try {
        Invoke-WebRequest -Uri $url -OutFile $out -UseBasicParsing
        Write-Host "OK $name"
    } catch {
        Write-Host "FAIL $name $($_.Exception.Message)"
    }
}
