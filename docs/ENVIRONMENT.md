# Environment Variables Documentation

## Overview

This document provides a comprehensive reference for all environment variables used in the Hotel Task Management and Employee Rating System. Environment variables are used to configure application behavior without hardcoding sensitive information.

## Security Note

**NEVER commit actual environment variable values to Git.** Always use `.env` files (which are gitignored) and provide `.env.example` files with placeholder values.

## Frontend Environment Variables

### File Location
`frontend/.env` (development) or configured in Netlify (production)

### Required Variables

#### NEXT_PUBLIC_SUPABASE_URL
The URL of your Supabase project.

**Format**: `https://[project-id].supabase.co`

**Example**: `NEXT_PUBLIC_SUPABASE_URL=https://abcdefgh.supabase.co`

**How to get**: 
1. Go to Supabase Dashboard → Project Settings → API
2. Copy "Project URL"

**Notes**: 
- Must be public (used in browser)
- Safe to expose
- Same for all environments

---

#### NEXT_PUBLIC_SUPABASE_ANON_KEY
The anonymous/public key for Supabase authentication.

**Format**: JWT token string

**Example**: `NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...`

**How to get**:
1. Go to Supabase Dashboard → Project Settings → API
2. Copy "anon public" key

**Notes**:
- Safe to expose in frontend
- Has limited permissions (RLS enforced)
- Different for each environment

---

#### NEXT_PUBLIC_API_URL
The base URL for the backend API.

**Format**: Full URL including protocol

**Development**: `NEXT_PUBLIC_API_URL=http://localhost:5000/api`

**Production**: `NEXT_PUBLIC_API_URL=https://your-backend.onrender.com/api`

**Notes**:
- Must match CORS configuration on backend
- Include `/api` prefix
- No trailing slash

---

### Optional Variables

#### NEXT_PUBLIC_APP_NAME
The name of the application for display purposes.

**Default**: `Crown Jewel Hotel Management`

**Example**: `NEXT_PUBLIC_APP_NAME=Crown Jewel Hotel Management`

**Notes**:
- Used in page titles, headers
- Can be customized per deployment

---

#### NEXT_PUBLIC_APP_URL
The URL of the frontend application.

**Format**: Full URL including protocol

**Development**: `NEXT_PUBLIC_APP_URL=http://localhost:3000`

**Production**: `NEXT_PUBLIC_APP_URL=https://your-frontend.netlify.app`

**Notes**:
- Used for redirects, email links
- Must match actual deployment URL

---

#### NEXT_PUBLIC_ENABLE_ANALYTICS
Enable/disable analytics tracking.

**Default**: `false`

**Example**: `NEXT_PUBLIC_ENABLE_ANALYTICS=true`

**Notes**:
- Set to `true` only if analytics consent obtained
- Requires privacy policy compliance

---

## Backend Environment Variables

### File Location
`backend/.env` (development) or configured in Render (production)

### Required Variables

#### PORT
The port on which the backend server runs.

**Default**: `5000`

**Example**: `PORT=5000`

**Notes**:
- Development: can use 5000
- Production: Render sets PORT automatically
- Don't hardcode in application code

---

#### NODE_ENV
The Node.js environment mode.

**Values**: `development`, `production`, `test`

**Development**: `NODE_ENV=development`

**Production**: `NODE_ENV=production`

**Notes**:
- Affects error messages, logging, optimizations
- Production enables optimizations
- Test enables test-specific behavior

---

#### SUPABASE_URL
The URL of your Supabase project (same as frontend).

**Format**: `https://[project-id].supabase.co`

**Example**: `SUPABASE_URL=https://abcdefgh.supabase.co`

**How to get**: Same as frontend SUPABASE_URL

**Notes**:
- Must match frontend value
- Used for server-side Supabase client

---

#### SUPABASE_SERVICE_ROLE_KEY
The service role key for Supabase (backend only).

**Format**: JWT token string

**Example**: `SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...`

**How to get**:
1. Go to Supabase Dashboard → Project Settings → API
2. Copy "service_role" key

**Notes**:
- **NEVER expose to frontend**
- Bypasses RLS (use carefully)
- Required for admin operations
- Keep secret, rotate regularly

---

#### DATABASE_URL
The PostgreSQL connection string for Supabase.

**Format**: `postgresql://[user]:[password]@[host]:[port]/[database]?sslmode=require`

**Example**: `DATABASE_URL=postgresql://postgres:[password]@db.abcdefgh.supabase.co:5432/postgres?sslmode=require`

**How to get**:
1. Go to Supabase Dashboard → Project Settings → Database
2. Copy "Connection string" (URI format)
3. Replace `[password]` with your database password

**Notes**:
- Use `sslmode=require` for production
- Never commit actual password
- Keep secret

---

#### FRONTEND_URL
The URL of the frontend application for CORS configuration.

**Format**: Full URL including protocol

**Development**: `FRONTEND_URL=http://localhost:3000`

**Production**: `FRONTEND_URL=https://your-frontend.netlify.app`

**Notes**:
- Must match NEXT_PUBLIC_APP_URL
- Used for CORS whitelist
- No trailing slash

---

### Optional Variables

#### JWT_SECRET
Secret key for JWT token signing (if custom JWT used).

**Format**: Random string (min 32 characters)

**Example**: `JWT_SECRET=your-very-secure-random-secret-key-min-32-chars`

**How to generate**: 
```bash
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

**Notes**:
- Generate different secret for each environment
- Keep secret, never commit
- Rotate periodically
- Use strong random value

---

#### SESSION_SECRET
Secret key for session encryption.

**Format**: Random string (min 32 characters)

**Example**: `SESSION_SECRET=another-very-secure-random-secret-key-for-sessions`

**How to generate**: Same as JWT_SECRET

**Notes**:
- Different from JWT_SECRET
- Keep secret, never commit
- Rotate periodically

---

#### LOG_LEVEL
The logging level for the application.

**Values**: `error`, `warn`, `info`, `debug`

**Default**: `info`

**Production**: `LOG_LEVEL=info`

**Development**: `LOG_LEVEL=debug`

**Notes**:
- Controls verbosity of logs
- Debug shows detailed information
- Error shows only errors

---

#### REDIS_URL
Redis connection URL (if using Redis for caching).

**Format**: `redis://[host]:[port]`

**Example**: `REDIS_URL=redis://localhost:6379`

**Notes**:
- Optional, for advanced caching
- Not required for basic deployment
- Used for session storage, caching

---

#### EMAIL_FROM
From address for email notifications.

**Format**: Email address

**Example**: `EMAIL_FROM=noreply@crownjewelhotel.com`

**Notes**:
- Required if email notifications enabled
- Must be verified with email provider

---

#### SMTP_HOST
SMTP server host for email sending.

**Format**: SMTP server hostname

**Example**: `SMTP_HOST=smtp.gmail.com`

**Notes**:
- Required if email notifications enabled
- Use with SMTP_USER, SMTP_PASS

---

#### SMTP_USER
SMTP username for authentication.

**Format**: Username or email

**Example**: `SMTP_USER=your-email@gmail.com`

**Notes**:
- Required if email notifications enabled
- Keep secret

---

#### SMTP_PASS
SMTP password for authentication.

**Format**: Password

**Example**: `SMTP_PASS=your-app-specific-password`

**Notes**:
- Required if email notifications enabled
- Keep secret, never commit
- Use app-specific passwords when possible

---

## Environment-Specific Examples

### Development (.env.development)

**Frontend (frontend/.env.development)**:
```env
NEXT_PUBLIC_SUPABASE_URL=https://dev-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
NEXT_PUBLIC_API_URL=http://localhost:5000/api
NEXT_PUBLIC_APP_NAME=Crown Jewel Hotel (Dev)
NEXT_PUBLIC_APP_URL=http://localhost:3000
NEXT_PUBLIC_ENABLE_ANALYTICS=false
```

**Backend (backend/.env.development)**:
```env
PORT=5000
NODE_ENV=development
SUPABASE_URL=https://dev-project.supabase.co
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
DATABASE_URL=postgresql://postgres:dev-password@db.dev-project.supabase.co:5432/postgres?sslmode=require
FRONTEND_URL=http://localhost:3000
JWT_SECRET=dev-secret-key-for-local-development-only
SESSION_SECRET=dev-session-secret-for-local-development
LOG_LEVEL=debug
```

### Production (.env.production)

**Frontend (configured in Netlify)**:
```env
NEXT_PUBLIC_SUPABASE_URL=https://prod-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
NEXT_PUBLIC_API_URL=https://api.crownjewelhotel.com/api
NEXT_PUBLIC_APP_NAME=Crown Jewel Hotel Management
NEXT_PUBLIC_APP_URL=https://crownjewelhotel.com
NEXT_PUBLIC_ENABLE_ANALYTICS=true
```

**Backend (configured in Render)**:
```env
PORT=5000
NODE_ENV=production
SUPABASE_URL=https://prod-project.supabase.co
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
DATABASE_URL=postgresql://postgres:prod-password@db.prod-project.supabase.co:5432/postgres?sslmode=require
FRONTEND_URL=https://crownjewelhotel.com
JWT_SECRET=prod-secret-key-very-secure-random-string
SESSION_SECRET=prod-session-secret-very-secure-random-string
LOG_LEVEL=info
EMAIL_FROM=noreply@crownjewelhotel.com
SMTP_HOST=smtp.gmail.com
SMTP_USER=notifications@crownjewelhotel.com
SMTP_PASS=secure-app-password
```

## Supabase-Specific Environment Variables

### Getting Supabase Credentials

1. **Create Supabase Project**:
   - Go to https://supabase.com/dashboard
   - Click "New Project"
   - Configure and create project

2. **Get API Credentials**:
   - Navigate to Project Settings → API
   - Copy the following:
     - Project URL (for both frontend and backend)
     - anon public key (for frontend)
     - service_role key (for backend only)

3. **Get Database Credentials**:
   - Navigate to Project Settings → Database
   - Copy "Connection string" (URI format)
   - Replace `[password]` with your database password

### Supabase Environment Variables Summary

| Variable | Frontend | Backend | Purpose |
|----------|----------|---------|---------|
| SUPABASE_URL | ✓ | ✓ | Project URL |
| SUPABASE_ANON_KEY | ✓ | ✗ | Public API key |
| SUPABASE_SERVICE_ROLE_KEY | ✗ | ✓ | Admin API key |
| DATABASE_URL | ✗ | ✓ | Database connection |

## Deployment Platform Configuration

### Netlify (Frontend)

**Setting Environment Variables**:
1. Go to Netlify Dashboard → Site → Settings → Environment variables
2. Add each variable with its value
3. Redeploy site to apply changes

**Important Notes**:
- Variables with `NEXT_PUBLIC_` prefix are exposed to browser
- Other variables are server-side only
- Changes require redeployment

### Render (Backend)

**Setting Environment Variables**:
1. Go to Render Dashboard → Service → Environment
2. Add each variable with its value
3. Deploy to apply changes

**Important Notes**:
- All variables are server-side only
- Render provides `PORT` automatically
- Changes require redeployment

### Supabase

**Supabase doesn't require environment variable configuration** - you use their credentials in your application's environment variables.

## .env.example Files

### Frontend .env.example

Create `frontend/.env.example`:

```env
# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=your-supabase-project-url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-supabase-anon-key

# API Configuration
NEXT_PUBLIC_API_URL=http://localhost:5000/api

# Application Configuration
NEXT_PUBLIC_APP_NAME=Crown Jewel Hotel Management
NEXT_PUBLIC_APP_URL=http://localhost:3000

# Analytics (optional)
NEXT_PUBLIC_ENABLE_ANALYTICS=false
```

### Backend .env.example

Create `backend/.env.example`:

```env
# Server Configuration
PORT=5000
NODE_ENV=development

# Supabase Configuration
SUPABASE_URL=your-supabase-project-url
SUPABASE_SERVICE_ROLE_KEY=your-supabase-service-role-key
DATABASE_URL=your-supabase-database-connection-string

# CORS Configuration
FRONTEND_URL=http://localhost:3000

# Security
JWT_SECRET=your-jwt-secret-key
SESSION_SECRET=your-session-secret

# Logging
LOG_LEVEL=info

# Email Configuration (optional)
EMAIL_FROM=noreply@example.com
SMTP_HOST=smtp.gmail.com
SMTP_USER=your-email@gmail.com
SMTP_PASS=your-app-password
```

## Security Best Practices

### 1. Never Commit Secrets
```bash
# Add to .gitignore
.env
.env.local
.env.*.local
```

### 2. Use Different Values per Environment
- Development keys should be different from production
- Use separate Supabase projects for dev/prod
- Generate new secrets for each environment

### 3. Rotate Secrets Regularly
- Change JWT_SECRET every 90 days
- Rotate SUPABASE_SERVICE_ROLE_KEY quarterly
- Update all deployments after rotation

### 4. Limit Access
- Only give necessary access to team members
- Use secret management tools for teams
- Audit access regularly

### 5. Monitor for Leaks
- Use tools like GitGuardian to scan for secrets
- Monitor commit history for accidental commits
- Rotate secrets immediately if leaked

## Troubleshooting

### Common Issues

**"SUPABASE_URL is not defined"**:
- Check that .env file exists
- Verify variable name matches exactly
- Restart development server

**"CORS error"**:
- Verify FRONTEND_URL matches actual frontend URL
- Check that CORS is configured in backend
- Ensure both use http/https consistently

**"Database connection failed"**:
- Verify DATABASE_URL is correct
- Check that SSL mode is enabled
- Ensure Supabase project is active

**"Invalid JWT"**:
- Verify JWT_SECRET is set and consistent
- Check that token hasn't expired
- Ensure backend and frontend use same Supabase project

## Environment Variable Validation

### Frontend Validation

Create `frontend/lib/env.ts`:

```typescript
const requiredEnvVars = [
  'NEXT_PUBLIC_SUPABASE_URL',
  'NEXT_PUBLIC_SUPABASE_ANON_KEY',
  'NEXT_PUBLIC_API_URL'
] as const;

requiredEnvVars.forEach((varName) => {
  if (!process.env[varName]) {
    throw new Error(`Missing required environment variable: ${varName}`);
  }
});

export const env = {
  supabaseUrl: process.env.NEXT_PUBLIC_SUPABASE_URL!,
  supabaseAnonKey: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
  apiUrl: process.env.NEXT_PUBLIC_API_URL!,
  appName: process.env.NEXT_PUBLIC_APP_NAME || 'Crown Jewel Hotel Management',
  appUrl: process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000',
  enableAnalytics: process.env.NEXT_PUBLIC_ENABLE_ANALYTICS === 'true'
};
```

### Backend Validation

Create `backend/src/config/env.ts`:

```typescript
const requiredEnvVars = [
  'PORT',
  'NODE_ENV',
  'SUPABASE_URL',
  'SUPABASE_SERVICE_ROLE_KEY',
  'DATABASE_URL',
  'FRONTEND_URL'
] as const;

requiredEnvVars.forEach((varName) => {
  if (!process.env[varName]) {
    throw new Error(`Missing required environment variable: ${varName}`);
  }
});

export const config = {
  port: parseInt(process.env.PORT!, 10),
  nodeEnv: process.env.NODE_ENV! as 'development' | 'production' | 'test',
  supabaseUrl: process.env.SUPABASE_URL!,
  supabaseServiceRoleKey: process.env.SUPABASE_SERVICE_ROLE_KEY!,
  databaseUrl: process.env.DATABASE_URL!,
  frontendUrl: process.env.FRONTEND_URL!,
  jwtSecret: process.env.JWT_SECRET || 'default-secret',
  sessionSecret: process.env.SESSION_SECRET || 'default-session-secret',
  logLevel: process.env.LOG_LEVEL || 'info'
};
```

## Support

For issues with environment variables:
1. Check this documentation first
2. Verify you're using the correct format
3. Ensure you've restarted servers after changes
4. Contact development team if issues persist

---

This environment variable configuration ensures secure and flexible deployment across different environments while maintaining security best practices.
