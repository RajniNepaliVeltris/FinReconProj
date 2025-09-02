# Start Chrome with remote debugging enabled
$chromePath = "C:\Program Files\Google\Chrome\Application\chrome.exe"
$debugDir = "C:\ChromeDebug"

# Create debug directory if it doesn't exist
if (-not (Test-Path -Path $debugDir)) {
    New-Item -ItemType Directory -Path $debugDir
}

# Start Chrome with remote debugging
Start-Process -FilePath $chromePath -ArgumentList "--remote-debugging-port=9222", "--user-data-dir=$debugDir"

Write-Host "Chrome started with remote debugging on port 9222"
Write-Host "Debug profile directory: $debugDir"
Write-Host "Keep this Chrome instance running while running your tests"