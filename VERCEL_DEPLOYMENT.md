# Vercel Deployment Guide

## 🚀 Deploy Crown Jewel Hotel Management System to Vercel

This guide will help you deploy your hotel management system from Netlify to Vercel.

## 📋 Prerequisites

- GitHub account with your project repository
- Vercel account (free tier is sufficient)
- Supabase project URL and anon key
- Backend API URL (if using separate backend)

## 🛠️ Step-by-Step Deployment

### Step 1: Create Vercel Account

1. Go to [vercel.com](https://vercel.com)
2. Sign up using your GitHub account
3. Vercel is free for Next.js projects with generous limits

### Step 2: Import Your Project

1. Click "Add New Project" in Vercel dashboard
2. Select your GitHub repository: `cielodecolongon03-prog/hotel`
3. Vercel will automatically detect it as a Next.js project

### Step 3: Configure Project Settings

**Framework Preset**: Next.js (auto-detected)

**Root Directory**: `frontend`

**Build Command**: `npm run build`

**Output Directory**: `.next`

### Step 4: Set Environment Variables

Add these environment variables in Vercel project settings:

```
NEXT_PUBLIC_SUPABASE_URL=your-supabase-project-url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-supabase-anon-key
NEXT_PUBLIC_API_URL=http://localhost:5000/api
NEXT_PUBLIC_APP_NAME=Crown Jewel Hotel Management
NEXT_PUBLIC_APP_URL=https://your-vercel-app.vercel.app
NEXT_PUBLIC_ENABLE_ANALYTICS=false
```

**To get your Supabase credentials:**
1. Go to your Supabase project dashboard
2. Settings → API
3. Copy "Project URL" for NEXT_PUBLIC_SUPABASE_URL
4. Copy "anon public" key for NEXT_PUBLIC_SUPABASE_ANON_KEY

### Step 5: Deploy

1. Click "Deploy"
2. Vercel will build and deploy your application
3. Wait for the deployment to complete (usually 1-2 minutes)
4. You'll get a URL like: `https://crown-jewel-hotel.vercel.app`

### Step 6: Configure Custom Domain (Optional)

1. Go to your project settings in Vercel
2. Click "Domains"
3. Add your custom domain (e.g., `crown-jewel.netlify.app`)
4. Update DNS records as instructed by Vercel

## 🔧 Post-Deployment Steps

### 1. Test the Application

1. Visit your Vercel URL
2. Test login with your test accounts:
   - Manager: `manager@crownjewel.com`
   - Front Desk: `frontdesk1@crownjewel.com`
   - Housekeeping: `housekeeping1@crownjewel.com`
   - Maintenance: `maintenance1@crownjewel.com`
   - Owner: `owner@crownjewel.com`

### 2. Update Netlify (Optional)

1. Go to your Netlify dashboard
2. Disable auto-publish for the `hotel` project
3. This prevents Netlify from trying to deploy
4. Or delete the Netlify project entirely

### 3. Update DNS (If using custom domain)

1. If you want to keep `crown-jewel.netlify.app`, update DNS to point to Vercel
2. Or get a new Vercel-provided domain

## 📊 Vercel vs Netlify Benefits

### Vercel Advantages:
- ✅ Optimized for Next.js (created by Next.js team)
- ✅ Faster build times
- ✅ Better caching and CDN
- ✅ Automatic HTTPS
- ✅ Preview deployments for every branch
- ✅ More generous free tier for Next.js
- ✅ Built-in analytics
- ✅ Edge functions support

### Free Tier Limits:
- **Vercel**: 100GB bandwidth/month, 6,000 minutes build time/month
- **Netlify**: 100GB bandwidth/month, 300 minutes build time/month

## 🐛 Troubleshooting

### Build Errors:
- Check that all environment variables are set correctly
- Ensure Node.js version is compatible (use 18.x)
- Check build logs for specific errors

### Authentication Issues:
- Verify Supabase URL and anon key are correct
- Check that Supabase project is active
- Ensure RLS policies are properly configured

### White Screen Issues:
- Check browser console for errors
- Verify Next.js build completed successfully
- Ensure environment variables are accessible

## 🎯 Success Indicators

Your deployment is successful when:
- ✅ You can access your Vercel URL
- ✅ Login page loads correctly
- ✅ You can log in with test accounts
- ✅ Dashboard redirects work properly
- ✅ Role-based access control functions
- ✅ All pages load without errors

## 📞 Support

If you encounter issues:
1. Check Vercel deployment logs
2. Verify environment variables
3. Test locally first: `cd frontend && npm run build && npm start`
4. Check Supabase status

---

**Your Crown Jewel Hotel Management System is now ready for Vercel deployment!** 🚀