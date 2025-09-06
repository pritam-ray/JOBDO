# 🌐 Job-Do Netlify Deployment Guide

## Quick Deployment Steps

### 1. 📋 Prerequisites
- GitHub repository: `https://github.com/pritam-ray/JOBDO.git`
- Netlify account with project: `https://app.netlify.com/projects/job-do/overview`
- Supabase project for database (optional)

### 2. 🔗 Connect GitHub to Netlify

1. Go to your Netlify project: https://app.netlify.com/projects/job-do/overview
2. Click "Connect to Git" or "Import from Git"
3. Select GitHub and authorize if needed
4. Choose repository: `pritam-ray/JOBDO`
5. Select branch: `main`

### 3. ⚙️ Build Settings

Configure these settings in Netlify:

```
Build command: npm run build
Publish directory: dist
Node.js version: 18
```

### 4. 🔐 Environment Variables

Add these in Netlify Dashboard > Site Settings > Environment Variables:

```
VITE_SUPABASE_URL=your_supabase_project_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
```

**Note:** These are optional. The app works without Supabase (database features will be disabled).

### 5. 🚀 Deploy

1. Click "Deploy Site" in Netlify
2. Wait for build to complete (~2-3 minutes)
3. Your site will be live at: `https://your-site-name.netlify.app`

### 6. 🎯 Custom Domain (Optional)

To use a custom domain:
1. Go to Site Settings > Domain Management
2. Add your custom domain
3. Configure DNS records as shown

## 📁 Build Configuration

The project includes:
- `netlify.toml` - Netlify configuration
- `deploy.ps1` - Windows deployment script
- `deploy.sh` - Unix deployment script

## 🔄 Auto-Deploy

Once connected, Netlify will automatically deploy when you push to the `main` branch.

## 🛠️ Local Build Test

To test the build locally:

```bash
npm run build
```

## 🌟 Features Included

- ✅ Indian job search with 24+ sources
- ✅ Sample company data (TCS, Infosys, Wipro, etc.)
- ✅ Location-based search
- ✅ Skills filtering
- ✅ Export to Excel/CSV
- ✅ Responsive design
- ✅ Progressive Web App ready

## 🚨 Troubleshooting

### Build Fails
- Check Node.js version (use 18+)
- Verify `package.json` dependencies
- Check for TypeScript errors

### App Loads but No Data
- Verify environment variables are set
- Check browser console for errors
- Ensure Supabase project is accessible

### Deployment Issues
- Check build logs in Netlify dashboard
- Verify GitHub repository access
- Ensure `dist` folder is published

## 📞 Support

For issues:
1. Check GitHub repository: https://github.com/pritam-ray/JOBDO
2. Review Netlify build logs
3. Contact: support@job-do.com
