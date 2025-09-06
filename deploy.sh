#!/bin/bash

# Job-Do Netlify Deployment Script
echo "🚀 Starting Job-Do deployment to Netlify..."

# Build the application
echo "📦 Building the application..."
npm run build

# Check if build was successful
if [ $? -eq 0 ]; then
    echo "✅ Build successful!"
    echo "📁 Build files are ready in the 'dist' directory"
    echo ""
    echo "🌐 Next steps for Netlify deployment:"
    echo "1. Go to https://app.netlify.com/projects/job-do/overview"
    echo "2. Connect your GitHub repository: https://github.com/pritam-ray/JOBDO.git"
    echo "3. Set build command: npm run build"
    echo "4. Set publish directory: dist"
    echo "5. Add environment variables:"
    echo "   - VITE_SUPABASE_URL"
    echo "   - VITE_SUPABASE_ANON_KEY"
    echo ""
    echo "🎯 Your Job-Do app will be live once deployed!"
else
    echo "❌ Build failed! Please check the errors above."
    exit 1
fi
