# Deployment Documentation

## Overview

This document provides comprehensive instructions for deploying the Hotel Task Management and Employee Rating System to production environments.

## Deployment Architecture

```
Frontend (Next.js) → Netlify
    ↓ HTTPS
Backend (Express) → Render
    ↓ HTTPS
Database/Auth/Storage → Supabase
```

## Prerequisites

### Required Accounts
- **Netlify Account** (for frontend hosting)
- **Render Account** (for backend API)
- **Supabase Account** (for database, auth, storage)
- **GitHub Account** (for source control)

### Required Tools
- Git
- Node.js 18+
- npm or yarn
- Supabase CLI (optional, for local development)

## Environment Variables

### Frontend Environment Variables (.env)

```env
# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=your-supabase-project-url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-supabase-anon-key

# API Configuration
NEXT_PUBLIC_API_URL=https://your-backend.onrender.com/api

# Application Configuration
NEXT_PUBLIC_APP_NAME=Crown Jewel Hotel Management
NEXT_PUBLIC_APP_URL=https://your-frontend.netlify.app
```

### Backend Environment Variables (.env)

```env
# Server Configuration
PORT=5000
NODE_ENV=production

# Supabase Configuration
SUPABASE_URL=your-supabase-project-url
SUPABASE_SERVICE_ROLE_KEY=your-supabase-service-role-key
DATABASE_URL=your-supabase-database-connection-string

# CORS Configuration
FRONTEND_URL=https://your-frontend.netlify.app

# Security
JWT_SECRET=your-jwt-secret-key
SESSION_SECRET=your-session-secret

# Logging
LOG_LEVEL=info
```

## Step 1: Supabase Setup

### 1.1 Create Supabase Project

1. Log in to [Supabase Dashboard](https://supabase.com/dashboard)
2. Click "New Project"
3. Configure project:
   - **Name**: `crown-jewel-hotel`
   - **Database Password**: Generate strong password
   - **Region**: Choose region closest to users
   - **Pricing Plan**: Free tier for development, Pro for production

### 1.2 Configure Database

1. Navigate to SQL Editor in Supabase Dashboard
2. Run the database schema from `database/migrations/`
3. Execute in order:
   - Schema creation
   - Table creation
   - RLS policies
   - Indexes
   - Functions and triggers
   - Seed data (development only)

### 1.3 Get Supabase Credentials

1. Navigate to Project Settings → API
2. Copy the following:
   - **Project URL**: `https://xxx.supabase.co`
   - **anon public key**: For frontend
   - **service_role key**: For backend (keep secret!)
   - **Database connection string**: For backend

### 1.4 Configure Authentication

1. Navigate to Authentication → Settings
2. Configure email settings:
   - Enable email provider
   - Set up email templates
   - Configure SMTP (for production)

3. Configure session settings:
   - Session expiry: 24 hours
   - Refresh token rotation: enabled

### 1.5 Configure Storage (if needed)

1. Navigate to Storage
2. Create buckets:
   - `avatars` - for user profile images
   - `documents` - for task-related documents

3. Configure bucket policies:
   - Public read for avatars
   - Authenticated read/write for documents

### 1.6 Enable Realtime

1. Navigate to Database → Replication
2. Enable realtime for tables:
   - `tasks`
   - `task_status_history`
   - `notifications` (if implemented)

## Step 2: Backend Deployment (Render)

### 2.1 Prepare Backend Code

1. Ensure backend code is committed to GitHub
2. Verify `package.json` has correct scripts:
   ```json
   {
     "scripts": {
       "start": "node dist/index.js",
       "build": "tsc",
       "dev": "ts-node src/index.ts"
     }
   }
   ```

3. Create `.env.example` in backend directory:
   ```env
   PORT=5000
   NODE_ENV=production
   SUPABASE_URL=your-supabase-url
   SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
   DATABASE_URL=your-database-url
   FRONTEND_URL=https://your-frontend.netlify.app
   JWT_SECRET=your-jwt-secret
   SESSION_SECRET=your-session-secret
   LOG_LEVEL=info
   ```

### 2.2 Deploy to Render

1. Log in to [Render Dashboard](https://render.com)
2. Click "New" → "Web Service"
3. Connect to your GitHub repository
4. Configure build settings:
   - **Root Directory**: `backend`
   - **Build Command**: `npm install && npm run build`
   - **Start Command**: `npm start`
   - **Runtime**: Node.js 18+

5. Configure environment variables:
   - Add all variables from `.env.example`
   - Use actual values from Supabase
   - Generate secure secrets for JWT_SECRET and SESSION_SECRET

6. Click "Deploy Web Service"

### 2.3 Configure Render Settings

1. Navigate to your service settings
2. Configure:
   - **Instance Type**: Start with Free tier, upgrade as needed
   - **Regions**: Choose region closest to Supabase
   - **Auto-Deploy**: Enable on push to main branch

3. Set up health check:
   - Endpoint: `/health`
   - Interval: 30 seconds
   - Timeout: 10 seconds

### 2.4 Verify Backend Deployment

1. Wait for deployment to complete
2. Test health endpoint:
   ```bash
   curl https://your-backend.onrender.com/health
   ```

3. Test API endpoint:
   ```bash
   curl https://your-backend.onrender.com/api/v1/health
   ```

4. Check Render logs for any errors

## Step 3: Frontend Deployment (Netlify)

### 3.1 Prepare Frontend Code

1. Ensure frontend code is committed to GitHub
2. Verify `package.json` has correct scripts:
   ```json
   {
     "scripts": {
       "dev": "next dev",
       "build": "next build",
       "start": "next start",
       "lint": "next lint"
     }
   }
   ```

3. Create `.env.example` in frontend directory:
   ```env
   NEXT_PUBLIC_SUPABASE_URL=your-supabase-url
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your-supabase-anon-key
   NEXT_PUBLIC_API_URL=https://your-backend.onrender.com/api
   NEXT_PUBLIC_APP_NAME=Crown Jewel Hotel Management
   NEXT_PUBLIC_APP_URL=https://your-frontend.netlify.app
   ```

4. Create `netlify.toml` in frontend root:
   ```toml
   [build]
     command = "npm run build"
     publish = ".next"

   [[plugins]]
     package = "@netlify/plugin-nextjs"

   [build.environment]
     NODE_VERSION = "18"

   [[redirects]]
     from = "/*"
     to = "/index.html"
     status = 200
   ```

### 3.2 Deploy to Netlify

1. Log in to [Netlify Dashboard](https://app.netlify.com)
2. Click "Add new site" → "Import an existing project"
3. Connect to your GitHub repository
4. Configure build settings:
   - **Build command**: `npm run build`
   - **Publish directory**: `.next`
   - **Base directory**: `frontend`

5. Configure environment variables:
   - Add all variables from `.env.example`
   - Use actual values from Supabase and Render

6. Click "Deploy site"

### 3.3 Configure Netlify Settings

1. Navigate to Site settings
2. Configure:
   - **Domain**: Add custom domain if desired
   - **HTTPS**: Automatic with Netlify
   - **Branch deployment**: Enable for preview deployments

3. Set up redirects (if needed):
   - Add any custom redirect rules in `netlify.toml`

### 3.4 Verify Frontend Deployment

1. Wait for deployment to complete
2. Visit the deployed URL
3. Test:
   - Login page loads
   - Static assets load correctly
   - API calls work (check browser console)

## Step 4: DNS Configuration (Optional)

### 4.1 Custom Domain for Frontend

1. Purchase domain from registrar
2. In Netlify, navigate to Domain settings
3. Add custom domain
4. Update DNS records at registrar:
   - A record: Netlify IP addresses
   - CNAME: Netlify domain

### 4.2 Custom Domain for Backend

1. In Render, navigate to domain settings
2. Add custom domain
3. Update DNS records:
   - CNAME: Render domain

## Step 5: SSL Certificates

### Frontend SSL
- Automatic with Netlify (Let's Encrypt)
- No manual configuration needed

### Backend SSL
- Automatic with Render (Let's Encrypt)
- No manual configuration needed

## Step 6: Monitoring and Logging

### Netlify Monitoring

1. Navigate to Site → Deploys
2. View build logs
3. Monitor function logs
4. Set up form notifications

### Render Monitoring

1. Navigate to your service
2. View real-time logs
3. Monitor metrics:
   - Response time
   - Error rate
   - Memory usage
   - CPU usage

### Supabase Monitoring

1. Navigate to Supabase Dashboard
2. Monitor:
   - Database performance
   - API requests
   - Storage usage
   - Auth events

## Step 7: Backup and Recovery

### Database Backups

Supabase provides automated backups:
- Daily backups retained for 7 days (free tier)
- Point-in-time recovery
- Manual backups before major changes

### Code Backups

- Git repository serves as backup
- GitHub provides redundancy
- Tag releases for major versions

### Recovery Procedures

**Database Recovery**:
1. Identify recovery point
2. Use Supabase dashboard to restore
3. Verify data integrity
4. Test application

**Code Recovery**:
1. Restore from Git
2. Rebuild on deployment platform
3. Verify functionality

## Step 8: Security Hardening

### Frontend Security

1. Configure security headers in `next.config.js`:
   ```javascript
   module.exports = {
     async headers() {
       return [
         {
           source: '/:path*',
           headers: [
             {
               key: 'X-Frame-Options',
               value: 'DENY'
             },
             {
               key: 'X-Content-Type-Options',
               value: 'nosniff'
             },
             {
               key: 'Referrer-Policy',
               value: 'origin-when-cross-origin'
             }
           ]
         }
       ]
     }
   }
   ```

2. Enable CSP (Content Security Policy) if needed

### Backend Security

1. Configure CORS to allow only frontend domain:
   ```javascript
   app.use(cors({
     origin: process.env.FRONTEND_URL,
     credentials: true
   }));
   ```

2. Implement rate limiting
3. Enable request logging
4. Validate all inputs

### Database Security

1. Ensure RLS policies are enabled
2. Rotate service role key periodically
3. Use strong database password
4. Enable database connection encryption

## Step 9: Performance Optimization

### Frontend Optimization

1. Enable Next.js image optimization
2. Implement code splitting
3. Use lazy loading for components
4. Optimize bundle size

### Backend Optimization

1. Enable response compression
2. Implement caching where appropriate
3. Use connection pooling
4. Optimize database queries

### Database Optimization

1. Monitor slow queries
2. Add indexes as needed
3. Archive old data
4. Regular maintenance

## Step 10: Post-Deployment Checklist

- [ ] Frontend builds successfully
- [ ] Backend builds successfully
- [ ] Database migrations run successfully
- [ ] Authentication works end-to-end
- [ ] Authorization properly restricts access
- [ ] RLS policies are working
- [ ] API endpoints respond correctly
- [ ] Realtime subscriptions work
- [ ] Email notifications work (if configured)
- [ ] SSL certificates are valid
- [ ] CORS is properly configured
- [ ] Environment variables are set
- [ ] Secrets are not exposed
- [ ] Logs are being collected
- [ ] Monitoring is configured
- [ ] Backups are enabled
- [ ] Health checks pass
- [ ] Error handling works
- [ ] Loading states display
- [ ] Empty states display
- [ ] Mobile responsive works

## Troubleshooting

### Common Issues

**Frontend Build Fails**
- Check Node.js version matches
- Verify all dependencies are installed
- Check build logs for specific errors
- Ensure environment variables are set

**Backend Deployment Fails**
- Verify TypeScript compiles locally
- Check all dependencies are in package.json
- Ensure environment variables are set
- Check Render logs for errors

**Database Connection Issues**
- Verify database URL is correct
- Check Supabase project is active
- Verify service role key is valid
- Check network/firewall settings

**CORS Errors**
- Verify CORS origin matches frontend URL
- Check that credentials are included
- Ensure backend CORS is configured
- Verify API calls include proper headers

**Authentication Issues**
- Verify Supabase anon key is correct
- Check JWT token is being sent
- Verify token is not expired
- Check RLS policies

## Scaling Considerations

### When to Scale Up

**Frontend (Netlify)**:
- High traffic > 100GB bandwidth/month
- Need more build minutes
- Require edge functions

**Backend (Render)**:
- High API request volume
- Long response times
- Memory/CPU constraints

**Database (Supabase)**:
- Approaching storage limits
- Slow query performance
- High connection count

### Scaling Strategy

1. Monitor performance metrics
2. Identify bottlenecks
3. Scale the appropriate component
4. Test after scaling
5. Monitor improvements

## Maintenance

### Regular Tasks

**Daily**:
- Monitor error logs
- Check system health
- Review key metrics

**Weekly**:
- Review performance trends
- Check for security updates
- Analyze user feedback

**Monthly**:
- Review and update dependencies
- Analyze cost vs usage
- Plan improvements
- Backup critical data

**Quarterly**:
- Security audit
- Performance review
- Capacity planning
- Disaster recovery test

## Rollback Procedures

### Frontend Rollback

1. Navigate to Netlify → Deploys
2. Select previous successful deploy
3. Click "Publish deploy"
4. Verify functionality

### Backend Rollback

1. Navigate to Render → Events
2. Identify last successful deployment
3. Revert to previous commit
4. Push to trigger redeploy
5. Verify functionality

### Database Rollback

1. Identify recovery point
2. Use Supabase point-in-time recovery
3. Verify data integrity
4. Test application

## Cost Optimization

### Current Costs (Estimated)

**Netlify**: Free tier available, Pro from $19/month
**Render**: Free tier available, Standard from $7/month
**Supabase**: Free tier available, Pro from $25/month

### Optimization Tips

- Start with free tiers
- Monitor usage closely
- Scale up as needed
- Use reserved instances for predictable workloads
- Implement caching to reduce API calls

## Support and Resources

### Documentation Links
- [Netlify Documentation](https://docs.netlify.com/)
- [Render Documentation](https://render.com/docs)
- [Supabase Documentation](https://supabase.com/docs)

### Emergency Contacts
- Development team: [contact info]
- System administrator: [contact info]

---

This deployment guide ensures a smooth and secure deployment of the Crown Jewel Hotel Management System to production environments.
