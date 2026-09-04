# 🚀 Complete Deployment Guide - Crown Jewel Hotel Management

## 📋 What to Do Next

### 1. Install Git (if not already installed)

Since Git is not currently recognized on your system, you need to install it first:

1. **Download Git Installer**:
   - You already have the installer: `Git-2.55.0.5-64-bit.exe` in your Downloads folder
   - Or download from: https://git-scm.com/download/win

2. **Install Git**:
   - Run the installer as Administrator
   - Use default settings (recommended)
   - Make sure to add Git to PATH during installation

3. **Verify Installation**:
   ```bash
   git --version
   ```

### 2. Initialize Git Repository

```bash
cd C:\Users\Administrator\Downloads\hotel
git init
```

### 3. Create GitHub Repository

1. **Go to GitHub**: https://github.com
2. **Sign in** to your account (or create one)
3. **Create a new repository**:
   - Click the "+" icon → "New repository"
   - Repository name: `crown-jewel-hotel` (or your preferred name)
   - Description: "Crown Jewel Hotel Management System"
   - Make it **Private** (recommended for hotel systems)
   - **Don't** initialize with README, .gitignore, or license
   - Click "Create repository"

### 4. Configure Git and Push to GitHub

```bash
cd C:\Users\Administrator\Downloads\hotel

# Add all files
git add .

# Commit changes
git commit -m "Initial commit: World-class authentication and dashboard system"

# Add remote repository (replace YOUR_USERNAME with your GitHub username)
git remote add origin https://github.com/YOUR_USERNAME/crown-jewel-hotel.git

# Push to GitHub
git branch -M main
git push -u origin main
```

## 🌐 Deploy to Netlify (Frontend)

### Option 1: Automatic Deployment via GitHub Integration

1. **Go to Netlify**: https://app.netlify.com
2. **Sign up/sign in** with your GitHub account
3. **Create new site**:
   - Click "Add new site" → "Import an existing project"
   - Select your GitHub repository
   - Configure build settings:
     - **Build command**: `npm run build`
     - **Publish directory**: `frontend/.next`
     - **Base directory**: `frontend`
   - Click "Deploy site"

### Option 2: Manual Deployment

1. **Build the frontend**:
```bash
cd frontend
npm install
npm run build
```

2. **Deploy to Netlify**:
   - Install Netlify CLI: `npm install -g netlify-cli`
   - Login: `netlify login`
   - Deploy: `netlify deploy --prod --dir=frontend/.next`

### Configure Environment Variables in Netlify

1. Go to your site settings in Netlify
2. Navigate to "Site settings" → "Environment variables"
3. Add these variables:
   ```
   NEXT_PUBLIC_SUPABASE_URL=your-supabase-url
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your-supabase-anon-key
   NEXT_PUBLIC_API_URL=your-backend-render-url
   NEXT_PUBLIC_APP_NAME=Crown Jewel Hotel Management
   NEXT_PUBLIC_APP_URL=your-netlify-url
   ```

## 🔧 Deploy to Render (Backend)

### 1. Prepare Backend for Render

Create a `render.yaml` file in the backend directory (already exists, verify it):

```yaml
services:
  - type: web
    name: crown-jewel-api
    env: node
    buildCommand: cd backend && npm install
    startCommand: cd backend && npm start
    envVars:
      - key: NODE_ENV
        value: production
      - key: PORT
        value: 5000
```

### 2. Deploy via Render Dashboard

1. **Go to Render**: https://render.com
2. **Sign up/sign in** with your GitHub account
3. **Create new web service**:
   - Click "New +" → "Web Service"
   - Connect your GitHub repository
   - Configure:
     - **Name**: `crown-jewel-api`
     - **Region**: Choose closest to your users
     - **Branch**: `main`
     - **Root Directory**: `backend`
     - **Build Command**: `npm install`
     - **Start Command**: `npm start`
   - Click "Create Web Service"

### 3. Configure Environment Variables in Render

1. Go to your service settings in Render
2. Navigate to "Environment" section
3. Add these variables:
   ```
   NODE_ENV=production
   PORT=5000
   SUPABASE_URL=your-supabase-url
   SUPABASE_SERVICE_ROLE_KEY=your-supabase-service-role-key
   SUPABASE_ANON_KEY=your-supabase-anon-key
   FRONTEND_URL=your-netlify-url
   ```

## 🔑 Set Up Supabase

### 1. Create Supabase Project

1. **Go to Supabase**: https://supabase.com
2. **Sign up/sign in**
3. **Create new project**:
   - Click "New Project"
   - Name: `crown-jewel-hotel`
   - Database password: (generate a strong password)
   - Region: Choose closest to your users
   - Click "Create new project"

### 2. Get Supabase Credentials

1. Go to Project Settings → API
2. Copy these values:
   - **Project URL**: `https://xxx.supabase.co`
   - **anon public key**: `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...`
   - **service_role key**: `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...`

### 3. Set Up Database Tables

Run these SQL queries in Supabase SQL Editor:

```sql
-- Create roles table
CREATE TABLE roles (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name VARCHAR(50) UNIQUE NOT NULL,
  description TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create profiles table
CREATE TABLE profiles (
  id UUID REFERENCES auth.users NOT NULL PRIMARY KEY,
  email TEXT NOT NULL,
  full_name TEXT,
  role_id UUID REFERENCES roles(id),
  avatar_url TEXT,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create departments table
CREATE TABLE departments (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  description TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create employees table
CREATE TABLE employees (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  profile_id UUID REFERENCES profiles(id),
  department_id UUID REFERENCES departments(id),
  employee_number VARCHAR(20) UNIQUE NOT NULL,
  hire_date DATE NOT NULL,
  status VARCHAR(20) DEFAULT 'active',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Insert default roles
INSERT INTO roles (name, description) VALUES
('owner', 'Hotel Owner - Full access'),
('manager', 'Hotel Manager - Task and employee management'),
('front_desk', 'Front Desk Staff - Guest services'),
('housekeeping', 'Housekeeping Staff - Room cleaning'),
('maintenance', 'Maintenance Staff - Facility repairs');

-- Insert default departments
INSERT INTO departments (name, description) VALUES
('Front Desk', 'Guest check-in, check-out, and concierge services'),
('Housekeeping', 'Room cleaning and maintenance'),
('Maintenance', 'Facility repairs and maintenance'),
('Food Service', 'Restaurant and room service'),
('Management', 'Hotel administration and oversight');

-- Enable Row Level Security
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE employees ENABLE ROW LEVEL SECURITY;
ALTER TABLE departments ENABLE ROW LEVEL SECURITY;
ALTER TABLE roles ENABLE ROW LEVEL SECURITY;

-- Create RLS policies
CREATE POLICY "Users can view own profile" ON profiles
  FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can update own profile" ON profiles
  FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "Authenticated users can view departments" ON departments
  FOR SELECT USING (auth.role() = 'authenticated');

CREATE POLICY "Authenticated users can view roles" ON roles
  FOR SELECT USING (auth.role() = 'authenticated');
```

### 4. Update Environment Variables

Replace the placeholder values in your:
- Frontend `.env.local`
- Backend `.env`
- Netlify environment variables
- Render environment variables

## 🧪 Test the Deployed Application

### 1. Test Frontend (Netlify)
- Visit your Netlify URL
- Test the landing page
- Try the login page
- Check responsive design on mobile

### 2. Test Backend (Render)
- Test health endpoint: `https://your-api.onrender.com/health`
- Test auth endpoints: `https://your-api.onrender.com/api/v1/auth/login`

### 3. Test Integration
- Login with Supabase credentials
- Navigate to dashboard
- Test protected routes
- Verify role-based access

## 🔄 Continuous Deployment

### Automatic Deployments
Both Netlify and Render are configured for automatic deployments:
- **Netlify**: Deploys on every push to GitHub
- **Render**: Deploys on every push to GitHub

### Workflow
1. Make changes locally
2. Commit and push to GitHub
3. Automatic deployment triggers
4. Test the deployed changes

## 📝 Quick Reference Commands

```bash
# Git workflow
git add .
git commit -m "Your commit message"
git push origin main

# Frontend development
cd frontend
npm install
npm run dev        # Development server
npm run build      # Production build
npm start          # Production server

# Backend development
cd backend
npm install
npm run dev        # Development server
npm start          # Production server
```

## 🐛 Troubleshooting

### Git Issues
- **Git not found**: Install Git from the downloaded installer
- **Permission denied**: Run as Administrator
- **Remote already exists**: `git remote set-url origin <new-url>`

### Deployment Issues
- **Build fails**: Check build logs in Netlify/Render
- **Environment variables**: Ensure all required variables are set
- **Database connection**: Verify Supabase credentials

### Common Errors
- **CORS errors**: Check FRONTEND_URL in backend env
- **Auth failures**: Verify Supabase credentials
- **404 errors**: Check route configurations

## 🎯 Next Steps After Deployment

1. **Create Test Users**: Register users with different roles
2. **Test All Features**: Verify authentication, dashboard, routes
3. **Customize Branding**: Update colors, logos, and content
4. **Set Up Monitoring**: Configure error tracking and analytics
5. **Backup Strategy**: Set up database backups in Supabase
6. **Documentation**: Update user manuals and admin guides

## 📞 Support Resources

- **Netlify Docs**: https://docs.netlify.com
- **Render Docs**: https://render.com/docs
- **Supabase Docs**: https://supabase.com/docs
- **Next.js Docs**: https://nextjs.org/docs
- **GitHub Guides**: https://guides.github.com

---

**Your Crown Jewel Hotel Management system is now ready for world-class deployment!** 🎉