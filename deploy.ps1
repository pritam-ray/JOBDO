# Job-Do Netlify Deployment Script for Windows
Write-Host "🚀 Starting Job-Do deployment to Netlify..." -ForegroundColor Green

# Build the application
Write-Host "📦 Building the application..." -ForegroundColor Yellow
npm run build

# Check if build was successful
if ($LASTEXITCODE -eq 0) {
    Write-Host "✅ Build successful!" -ForegroundColor Green
    Write-Host "📁 Build files are ready in the 'dist' directory" -ForegroundColor Blue
    Write-Host ""
    Write-Host "🌐 Next steps for Netlify deployment:" -ForegroundColor Cyan
    Write-Host "1. Go to https://app.netlify.com/projects/job-do/overview" -ForegroundColor White
    Write-Host "2. Connect your GitHub repository: https://github.com/pritam-ray/JOBDO.git" -ForegroundColor White
    Write-Host "3. Set build command: npm run build" -ForegroundColor White
    Write-Host "4. Set publish directory: dist" -ForegroundColor White
    Write-Host "5. Add environment variables:" -ForegroundColor White
    Write-Host "   - VITE_SUPABASE_URL" -ForegroundColor Gray
    Write-Host "   - VITE_SUPABASE_ANON_KEY" -ForegroundColor Gray
    Write-Host ""
    Write-Host "🎯 Your Job-Do app will be live once deployed!" -ForegroundColor Green
} else {
    Write-Host "❌ Build failed! Please check the errors above." -ForegroundColor Red
    exit 1
}
