# Deployment Guide: Connecting to Netlify, Render, and Supabase

This guide will walk you through connecting the Hotel Management System to:
- **Supabase** (Database, Auth, Storage)
- **Render** (Backend API)
- **Netlify** (Frontend)

## Prerequisites

- Git installed and configured
- GitHub account
- Netlify account
- Render account
- Supabase account

## Step 1: Set Up Supabase

### 1.1 Create Supabase Project

1. Go to [https://supabase.com](https://supabase.com)
2. Sign up or log in
3. Click "New Project"
4. Fill in project details:
   - **Name**: `crown-jewel-hotel`
   - **Database Password**: Generate a strong password (save this!)
   - **Region**: Choose closest to your users
   - **Pricing Plan**: Free tier to start

### 1.2 Run Database Migrations

1. In Supabase Dashboard, go to **SQL Editor**
2. Copy the contents of `database/migrations/001_initial_schema.sql`
3. Paste and run the SQL
4. Copy the contents of `database/migrations/002_rls_policies.sql`
5. Paste and run the SQL

### 1.3 Get Supabase Credentials

1. Go to **Project Settings** → **API**
2. Copy these values:
   - **Project URL**: `https://xxx.supabase.co`
   - **anon public key**: For frontend
   - **service_role key**: For backend (keep secret!)
   - **Connection string**: For backend

### 1.4 Configure Authentication

1. Go to **Authentication** → **Settings**
2. Enable **Email Auth**
3. Set up email templates (optional)
4. Configure session settings:
   - Session expiry: 24 hours
   - Enable refresh token rotation

## Step 2: Set Up Backend on Render

### 2.1 Push Code to GitHub

```bash
# Initialize git if not already done
cd C:\Users\Administrator\Desktop\hotel
git init
git add .
git commit -m "Initial commit"
```

Create a GitHub repository and push:
```bash
git remote add origin https://github.com/your-username/hotel.git
git branch -M main
git push -u origin main
```

### 2.2 Create Render Account

1. Go to [https://render.com](https://render.com)
2. Sign up with GitHub
3. Authorize Render to access your repository

### 2.3 Deploy Backend

1. In Render Dashboard, click **New** → **Web Service**
2. Connect to your GitHub repository
3. Configure settings:
   - **Name**: `crown-jewel-hotel-api`
   - **Root Directory**: `backend`
   - **Build Command**: `npm install && npm run build`
   - **Start Command**: `npm start`
   - **Runtime**: Node.js 18+

4. Add Environment Variables:
   ```
   PORT=5000
   NODE_ENV=production
   SUPABASE_URL=your-supabase-url
   SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
   DATABASE_URL=your-database-connection-string
   FRONTEND_URL=https://your-frontend.netlify.app
   JWT_SECRET=generate-random-secret
   SESSION_SECRET=generate-random-secret
   LOG_LEVEL=info
   ```

5. Click **Deploy Web Service**

### 2.4 Test Backend Deployment

1. Wait for deployment to complete
2. Test health endpoint: `https://your-api.onrender.com/health`
3. Check Render logs for any errors

## Step 3: Set Up Frontend on Netlify

### 3.1 Prepare Frontend for Deployment

1. Update `frontend/.env.production` with your values:
   ```env
   NEXT_PUBLIC_SUPABASE_URL=your-supabase-url
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your-supabase-anon-key
   NEXT_PUBLIC_API_URL=https://your-api.onrender.com/api
   NEXT_PUBLIC_APP_NAME=Crown Jewel Hotel Management
   NEXT_PUBLIC_APP_URL=https://your-frontend.netlify.app
   ```

### 2.2 Create Netlify Account

1. Go to [https://netlify.com](https://netlify.com)
2. Sign up with GitHub
3. Authorize Netlify to access your repository

### 3.3 Deploy Frontend

1. In Netlify Dashboard, click **Add new site** → **Import an existing project**
2. Connect to your GitHub repository
3. Configure build settings:
   - **Build command**: `npm run build`
   - **Publish directory**: `.next`
   - **Base directory**: `frontend`

4. Add Environment Variables:
   ```
   NEXT_PUBLIC_SUPABASE_URL=your-supabase-url
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your-supabase-anon-key
   NEXT_PUBLIC_API_URL=https://your-api.onrender.com/api
   NEXT_PUBLIC_APP_NAME=Crown Jewel Hotel Management
   NEXT_PUBLIC_APP_URL=https://your-frontend.netlify.app
   ```

5. Click **Deploy site**

### 3.4 Test Frontend Deployment

1. Wait for deployment to complete
2. Visit your Netlify URL
3. Test that the homepage loads
4. Check browser console for errors

## Step 4: Update CORS Configuration

### 4.1 Update Backend CORS

In your backend code, ensure CORS is configured to allow your Netlify domain:

```typescript
// In backend/src/index.ts
app.use(cors({
  origin: process.env.FRONTEND_URL, // Should be your Netlify URL
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization'],
}));
```

### 4.2 Update Render Environment Variable

1. Go to Render Dashboard → Your service → Environment
2. Update `FRONTEND_URL` to your actual Netlify URL
3. Redeploy the service

## Step 5: Test Integration

### 5.1 Test Health Endpoints

```bash
# Backend health
curl https://your-api.onrender.com/health

# Frontend loads
# Visit https://your-frontend.netlify.app
```

### 5.2 Test Database Connection

1. In Supabase Dashboard, go to **Table Editor**
2. Verify tables were created (profiles, tasks, employees, etc.)
3. Check that RLS policies are enabled

### 5.3 Test API Connectivity

```bash
# Test API health
curl https://your-api.onrender.com/api/v1/health
```

## Step 6: Create Test Users

### 6.1 Create Manager Account

1. In Supabase Dashboard, go to **Authentication** → **Users**
2. Click "Add user"
3. Create a manager account:
   - Email: `manager@crownjewel.com`
   - Password: `your-secure-password`
   - Auto confirm user: Yes

### 6.2 Create Profile for Manager

1. Go to **SQL Editor**
2. Run this query (replace with actual user ID):
```sql
INSERT INTO profiles (id, email, full_name, role_id)
VALUES (
  'user-id-from-auth',
  'manager@crownjewel.com',
  'Sarah Johnson',
  (SELECT id FROM roles WHERE name = 'hotel_manager')
);
```

## Step 7: Monitor and Debug

### 7.1 Check Logs

**Render Logs**:
- Go to Render Dashboard → Your service → Logs
- Monitor for errors and warnings

**Netlify Logs**:
- Go to Netlify Dashboard → Your site → Deploys
- Check build logs and function logs

**Supabase Logs**:
- Go to Supabase Dashboard → Logs
- Monitor database queries and auth events

### 7.2 Common Issues

**CORS Errors**:
- Verify FRONTEND_URL matches exactly
- Check that backend CORS is configured correctly
- Ensure no trailing slashes in URLs

**Database Connection**:
- Verify DATABASE_URL is correct
- Check that Supabase project is active
- Ensure SSL mode is enabled

**Build Failures**:
- Check build logs for specific errors
- Verify all dependencies are in package.json
- Ensure Node.js version is compatible

## Step 8: Set Up Custom Domains (Optional)

### 8.1 Netlify Custom Domain

1. In Netlify Dashboard → Site settings → Domain management
2. Add custom domain
3. Update DNS records at your domain registrar

### 8.2 Render Custom Domain

1. In Render Dashboard → Service → Settings → Custom Domains
2. Add custom domain
3. Update DNS records

## Step 9: Enable Backups and Monitoring

### 9.1 Supabase Backups

1. Go to Supabase Dashboard → Database → Backups
2. Enable automated daily backups
3. Set up point-in-time recovery

### 9.2 Monitoring

- Enable Render monitoring
- Set up Netlify analytics
- Configure Supabase logging

## Quick Reference URLs

After deployment, you'll have:

- **Frontend**: `https://your-site.netlify.app`
- **Backend API**: `https://your-api.onrender.com`
- **Backend Health**: `https://your-api.onrender.com/health`
- **API Health**: `https://your-api.onrender.com/api/v1/health`
- **Supabase Dashboard**: `https://supabase.com/dashboard`

## Security Checklist

- [ ] Service role key never exposed to frontend
- [ ] CORS restricted to production domains
- [ ] Environment variables set correctly
- [ ] RLS policies enabled on all tables
- [ ] HTTPS enforced on all endpoints
- [ ] Rate limiting enabled
- [ ] Database backups enabled
- [ ] Strong passwords used

## Next Steps

1. Test authentication flow
2. Create initial employees and tasks
3. Test task management features
4. Set up monitoring and alerts
5. Configure custom domains (optional)
6. Set up CI/CD pipeline (optional)

---

Your Hotel Management System is now connected to Netlify, Render, and Supabase! 🎉
