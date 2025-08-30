# ==========================
# Fix Playwright Installation
# ==========================

Write-Host "🚀 Cleaning old install..."

# Remove node_modules and lock file if they exist
if (Test-Path "node_modules") {
    Remove-Item -Recurse -Force "node_modules"
    Write-Host "🧹 Removed node_modules"
}

if (Test-Path "package-lock.json") {
    Remove-Item -Force "package-lock.json"
    Write-Host "🧹 Removed package-lock.json"
}

# Ensure package.json exists
if (-Not (Test-Path "package.json")) {
    Write-Host "📦 Initializing npm project..."
    npm init -y
}

Write-Host "📦 Installing Playwright test runner..."
npm install -D @playwright/test

Write-Host "🌐 Installing Playwright browsers..."
npx playwright install

# Verify installation
if (Test-Path "node_modules\@playwright\test\cli.js") {
    Write-Host "✅ Playwright installed successfully!"
} else {
    Write-Host "❌ ERROR: cli.js not found. Check Node.js version."
    Write-Host "⚠️ Tip: Use Node.js 20 LTS (recommended)."
}
