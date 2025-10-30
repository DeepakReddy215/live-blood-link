# Deployment Helper - Render Configuration
# Run this in PowerShell to prepare for deployment

Write-Host "`n" -ForegroundColor Cyan
Write-Host "═══════════════════════════════════════════════════════════════" -ForegroundColor Cyan
Write-Host "       🚀 BLOODSTREAM RENDER DEPLOYMENT HELPER 🚀" -ForegroundColor Cyan
Write-Host "═══════════════════════════════════════════════════════════════" -ForegroundColor Cyan
Write-Host "`n"

# Check if Node.js is installed
Write-Host "📋 Checking Prerequisites..." -ForegroundColor Yellow
Write-Host "`n"

try {
    $nodeVersion = node --version
    Write-Host "✅ Node.js installed: $nodeVersion" -ForegroundColor Green
} catch {
    Write-Host "❌ Node.js not found. Please install Node.js first." -ForegroundColor Red
    exit 1
}

Write-Host "`n"
Write-Host "═══════════════════════════════════════════════════════════════" -ForegroundColor Cyan
Write-Host "📋 Generating JWT Secrets..." -ForegroundColor Yellow
Write-Host "`n"

# Generate JWT secrets using Node.js
$jwtSecret = node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
$jwtRefreshSecret = node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"

Write-Host "Copy these to your Render environment variables:" -ForegroundColor White
Write-Host "`n"
Write-Host "JWT_SECRET=$jwtSecret" -ForegroundColor Green
Write-Host "JWT_REFRESH_SECRET=$jwtRefreshSecret" -ForegroundColor Green
Write-Host "`n"

# Save to file
$secretsContent = @"
# GENERATED JWT SECRETS
# Generated on: $(Get-Date -Format "yyyy-MM-dd HH:mm:ss")
# ⚠️  KEEP THESE SECURE - DO NOT COMMIT TO GIT

JWT_SECRET=$jwtSecret
JWT_REFRESH_SECRET=$jwtRefreshSecret

# Copy these to your Render Dashboard > Environment Variables
"@

$secretsContent | Out-File -FilePath "GENERATED_SECRETS.txt" -Encoding UTF8
Write-Host "💾 Secrets saved to: GENERATED_SECRETS.txt" -ForegroundColor Cyan
Write-Host "`n"

Write-Host "═══════════════════════════════════════════════════════════════" -ForegroundColor Cyan
Write-Host "📋 Backend Environment Variables Template" -ForegroundColor Yellow
Write-Host "`n"

$backendEnv = @"
NODE_ENV=production
PORT=10000
MONGODB_URI=<your-mongodb-connection-string>
JWT_SECRET=$jwtSecret
JWT_REFRESH_SECRET=$jwtRefreshSecret
JWT_EXPIRES_IN=1h
JWT_REFRESH_EXPIRES_IN=7d
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=<your-email@gmail.com>
EMAIL_PASSWORD=<your-app-password>
EMAIL_FROM=BloodStream <noreply@bloodstream.com>
FRONTEND_URL=<will-update-after-frontend-deployment>
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=100
OTP_EXPIRES_IN=10
OTP_LENGTH=6
"@

Write-Host $backendEnv -ForegroundColor White
Write-Host "`n"

Write-Host "═══════════════════════════════════════════════════════════════" -ForegroundColor Cyan
Write-Host "📋 Frontend Environment Variables Template" -ForegroundColor Yellow
Write-Host "`n"

$frontendEnv = @"
VITE_API_URL=https://your-backend-name.onrender.com/api
VITE_SOCKET_URL=https://your-backend-name.onrender.com
"@

Write-Host $frontendEnv -ForegroundColor White
Write-Host "`n"

Write-Host "═══════════════════════════════════════════════════════════════" -ForegroundColor Cyan
Write-Host "📋 Deployment Steps" -ForegroundColor Yellow
Write-Host "`n"

$steps = @(
    "1. ✅ Set up MongoDB Atlas cluster",
    "2. ✅ Generate JWT secrets (done above)",
    "3. ⏳ Create Gmail App Password",
    "4. ⏳ Deploy Backend on Render",
    "5. ⏳ Copy Backend URL",
    "6. ⏳ Deploy Frontend on Render",
    "7. ⏳ Update Backend FRONTEND_URL",
    "8. ⏳ Test the application"
)

foreach ($step in $steps) {
    Write-Host $step -ForegroundColor White
}

Write-Host "`n"
Write-Host "═══════════════════════════════════════════════════════════════" -ForegroundColor Cyan
Write-Host "📚 Next Steps" -ForegroundColor Yellow
Write-Host "`n"

Write-Host "1. Open: RENDER_DEPLOYMENT_GUIDE.md for complete instructions" -ForegroundColor White
Write-Host "2. Use: DEPLOYMENT_CHECKLIST_RENDER.md to track progress" -ForegroundColor White
Write-Host "3. Reference: QUICK_DEPLOY_REFERENCE.md for quick commands" -ForegroundColor White
Write-Host "`n"

Write-Host "═══════════════════════════════════════════════════════════════" -ForegroundColor Cyan
Write-Host "⚠️  Important Reminders" -ForegroundColor Red
Write-Host "`n"

Write-Host "• Add GENERATED_SECRETS.txt to .gitignore" -ForegroundColor Yellow
Write-Host "• Never commit sensitive credentials to Git" -ForegroundColor Yellow
Write-Host "• Use strong passwords for MongoDB and Email" -ForegroundColor Yellow
Write-Host "• Update FRONTEND_URL after frontend deployment" -ForegroundColor Yellow
Write-Host "`n"

Write-Host "═══════════════════════════════════════════════════════════════" -ForegroundColor Cyan
Write-Host "🎉 Setup Complete! Ready to deploy!" -ForegroundColor Green
Write-Host "═══════════════════════════════════════════════════════════════" -ForegroundColor Cyan
Write-Host "`n"
