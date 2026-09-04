# Quick Start Guide

Get your Hotel Management System up and running in 15 minutes.

## 1. Supabase Setup (5 minutes)

### Create Project
1. Go to [supabase.com](https://supabase.com) and sign up
2. Click "New Project"
3. Name: `crown-jewel-hotel`
4. Save your database password

### Run Migrations
1. Go to SQL Editor in Supabase Dashboard
2. Run `database/migrations/001_initial_schema.sql`
3. Run `database/migrations/002_rls_policies.sql`

### Get Credentials
1. Go to Project Settings → API
2. Copy these 3 values:
   - Project URL
   - anon public key  
   - service_role key

## 2. Backend Deployment (5 minutes)

### Deploy to Render
1. Push code to GitHub
2. Go to [render.com](https://render.com) and sign up with GitHub
3. Click "New" → "Web Service"
4. Connect your GitHub repo
5. Configure:
   - Root: `backend`
   - Build: `npm install && npm run build`
   - Start: `npm start`
6. Add environment variables (see below)
7. Click "Deploy"

### Backend Environment Variables
```
PORT=5000
NODE_ENV=production
SUPABASE_URL=your-project-url
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
DATABASE_URL=your-database-connection-string
FRONTEND_URL=https://your-site.netlify.app
JWT_SECRET=generate-random-32-char-string
SESSION_SECRET=generate-random-32-char-string
LOG_LEVEL=info
```

## 3. Frontend Deployment (5 minutes)

### Deploy to Netlify
1. Go to [netlify.com](https://netlify.com) and sign up with GitHub
2. Click "Add new site" → "Import an existing project"
3. Connect your GitHub repo
4. Configure:
   - Build: `npm run build`
   - Publish: `.next`
   - Base: `frontend`
5. Add environment variables (see below)
6. Click "Deploy"

### Frontend Environment Variables
```
NEXT_PUBLIC_SUPABASE_URL=your-project-url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
NEXT_PUBLIC_API_URL=https://your-api.onrender.com/api
NEXT_PUBLIC_APP_NAME=Crown Jewel Hotel Management
NEXT_PUBLIC_APP_URL=https://your-site.netlify.app
```

## 4. Test It Out

### Test Backend
```bash
curl https://your-api.onrender.com/health
```

### Test Frontend
Visit your Netlify URL in browser

### Create First User
1. Go to Supabase Dashboard → Authentication → Users
2. Add user: `manager@crownjewel.com`
3. Run this in SQL Editor:
```sql
INSERT INTO profiles (id, email, full_name, role_id)
VALUES (
  'user-id-from-auth',
  'manager@crownjewel.com',
  'Sarah Johnson',
  (SELECT id FROM roles WHERE name = 'hotel_manager')
);
```

## Important Notes

⚠️ **Never commit**:
- `.env` files
- Service role keys
- Database passwords
- JWT secrets

⚠️ **Always use**:
- HTTPS in production
- Strong random secrets
- Environment variables for config

🔧 **Troubleshooting**:
- Check Render logs for backend errors
- Check Netlify logs for frontend errors
- Verify CORS settings match your domains
- Ensure Supabase project is active

## Next Steps

1. Add shadcn/ui components to frontend
2. Build authentication pages
3. Create dashboard UI
4. Add task management interface
5. Test all features end-to-end

## Need Help?

- Full deployment guide: `DEPLOYMENT_GUIDE.md`
- Architecture docs: `docs/ARCHITECTURE.md`
- API documentation: `docs/API.md`
- Database schema: `docs/DATABASE.md`

---

You're live! 🚀
