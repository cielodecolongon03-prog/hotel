# Security Documentation

## Overview

This document outlines the security measures implemented in the Hotel Task Management and Employee Rating System to protect data, ensure user privacy, and maintain system integrity.

## Security Principles

### Defense in Depth
Multiple layers of security controls to protect against various threats:
- Network security
- Application security
- Data security
- Access control

### Principle of Least Privilege
Users and systems have only the minimum access necessary to perform their functions.

### Zero Trust
No implicit trust - every request is authenticated and authorized regardless of origin.

### Security by Design
Security considerations integrated throughout the development lifecycle.

## Authentication Security

### Supabase Authentication

**Implementation**:
- Industry-standard JWT-based authentication
- Secure password hashing (bcrypt)
- Session management with refresh tokens
- Multi-factor authentication support (optional)

**Best Practices**:
- Password requirements: minimum 8 characters, mixed case, numbers, special characters
- Session expiration: 24 hours
- Refresh token rotation
- Secure token storage (httpOnly cookies for backend, localStorage for frontend with caution)

**Configuration**:
```typescript
// Frontend - Supabase client initialization
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
  {
    auth: {
      autoRefreshToken: true,
      persistSession: true,
      detectSessionInUrl: true
    }
  }
);
```

### Session Management

**Security Measures**:
- JWT tokens with short expiration
- Refresh token rotation
- Secure token storage
- Session invalidation on logout
- Concurrent session limits

**Token Structure**:
```typescript
// JWT payload structure
{
  "sub": "user-id",
  "email": "user@example.com",
  "role": "hotel_manager",
  "exp": 1642234567,
  "iat": 1642148167
}
```

## Authorization Security

### Role-Based Access Control (RBAC)

**Roles**:
- `hotel_owner` - Full access to view and manage
- `hotel_manager` - Operational control
- `front_desk` - Task management for assigned tasks
- `housekeeping` - Task management for assigned tasks
- `maintenance` - Task management for assigned tasks
- `guest` - Feedback submission only

**Permission Matrix**:

| Action | Owner | Manager | Front Desk | Housekeeping | Maintenance | Guest |
|--------|-------|---------|------------|--------------|-------------|-------|
| View all tasks | ✓ | ✓ | ✗ | ✗ | ✗ | ✗ |
| View own tasks | ✓ | ✓ | ✓ | ✓ | ✓ | ✗ |
| Create tasks | ✗ | ✓ | ✗ | ✗ | ✗ | ✗ |
| Assign tasks | ✗ | ✓ | ✗ | ✗ | ✗ | ✗ |
| Update own tasks | ✓ | ✓ | ✓ | ✓ | ✓ | ✗ |
| Verify tasks | ✗ | ✓ | ✗ | ✗ | ✗ | ✗ |
| View all employees | ✓ | ✓ | ✗ | ✗ | ✗ | ✗ |
| Manage employees | ✗ | ✓ | ✗ | ✗ | ✗ | ✗ |
| Create ratings | ✗ | ✓ | ✗ | ✗ | ✗ | ✗ |
| View reports | ✓ | ✓ | ✗ | ✗ | ✗ | ✗ |
| Submit feedback | ✗ | ✗ | ✗ | ✗ | ✗ | ✓ |

### Implementation Layers

**1. Frontend Authorization**:
```typescript
// UI component protection
if (user.role !== 'hotel_manager') {
  return <AccessDenied />;
}
```

**2. Backend Authorization**:
```typescript
// Middleware authorization
const rbacMiddleware = (requiredRole: string) => {
  return (req: Request, res: Response, next: NextFunction) => {
    if (req.user.role !== requiredRole) {
      return res.status(403).json({ error: 'Insufficient permissions' });
    }
    next();
  };
};
```

**3. Database RLS**:
```sql
-- Row Level Security policy
CREATE POLICY "Managers can view all tasks"
  ON tasks FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid()
      AND profiles.role_id IN (
        SELECT id FROM roles WHERE name = 'hotel_manager'
      )
    )
  );
```

## Data Security

### Encryption

**At Rest**:
- Supabase provides AES-256 encryption for data at rest
- Database backups encrypted
- Storage files encrypted

**In Transit**:
- TLS 1.2+ for all connections
- HTTPS enforced in production
- Certificate pinning where appropriate

### Sensitive Data Handling

**Password Security**:
- Never store passwords in plain text
- Use bcrypt for password hashing
- Minimum 10 salt rounds
- Never log passwords

**Personal Information**:
- Minimize collection of personal data
- Encrypt sensitive fields where appropriate
- Implement data retention policies
- Provide data export/deletion capabilities

**API Keys and Secrets**:
- Never commit secrets to Git
- Use environment variables
- Rotate secrets regularly
- Different keys for dev/staging/production

### Data Validation

**Input Validation**:
```typescript
// Zod schema validation
const taskSchema = z.object({
  title: z.string().min(1).max(200),
  description: z.string().max(1000).optional(),
  priority: z.enum(['low', 'medium', 'high', 'urgent']),
  deadline: z.coerce.date().optional()
});
```

**Output Encoding**:
- Escape user-generated content
- Sanitize HTML inputs
- Use parameterized queries
- Prevent XSS attacks

## API Security

### CORS Configuration

**Development**:
```typescript
app.use(cors({
  origin: 'http://localhost:3000',
  credentials: true
}));
```

**Production**:
```typescript
app.use(cors({
  origin: process.env.FRONTEND_URL,
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));
```

### Rate Limiting

**Implementation**:
```typescript
import rateLimit from 'express-rate-limit';

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
  message: 'Too many requests from this IP'
});

app.use('/api/', limiter);
```

**Rate Limits by Role**:
- Managers: 200 requests/minute
- Employees: 100 requests/minute
- Guests: 50 requests/minute

### Request Validation

**Middleware**:
```typescript
const validateRequest = (schema: z.ZodSchema) => {
  return (req: Request, res: Response, next: NextFunction) => {
    const result = schema.safeParse(req.body);
    if (!result.success) {
      return res.status(400).json({ 
        error: 'Validation failed',
        details: result.error.errors 
      });
    }
    req.body = result.data;
    next();
  };
};
```

### SQL Injection Prevention

**Parameterized Queries**:
```typescript
// Safe parameterized query
const result = await supabase
  .from('tasks')
  .select('*')
  .eq('assigned_to', employeeId)
  .order('created_at', { ascending: false });
```

**ORM/Query Builder**:
- Use Supabase client (parameterized by default)
- Never concatenate user input into queries
- Validate and sanitize all inputs

## Database Security

### Row Level Security (RLS)

**Enabled Tables**:
- profiles
- employees
- tasks
- employee_ratings
- guest_feedback
- activity_logs

**Policy Types**:
- Authentication-based: Allow authenticated users
- Role-based: Restrict by user role
- Ownership-based: Users access only their data
- Department-based: Department-level access

**Example RLS Policy**:
```sql
-- Employees can only see their assigned tasks
CREATE POLICY "Employees can view assigned tasks"
  ON tasks FOR SELECT
  TO authenticated
  USING (
    assigned_to IN (
      SELECT id FROM employees WHERE profile_id = auth.uid()
    )
  );
```

### Database Connection Security

**Connection String**:
- Use SSL mode in production
- Never expose connection string in frontend
- Use connection pooling
- Implement connection timeouts

**Environment Variables**:
```env
DATABASE_URL=postgresql://user:password@host:port/database?sslmode=require
```

### Backup Security

**Automated Backups**:
- Daily automated backups
- Encrypted backup storage
- Point-in-time recovery
- Access restricted to authorized personnel

**Manual Backups**:
- Before major changes
- Encrypted and stored securely
- Test restore procedures

## Application Security

### Dependency Management

**Vulnerability Scanning**:
```bash
npm audit
npm audit fix
```

**Regular Updates**:
- Keep dependencies updated
- Review security advisories
- Use semantic versioning
- Lock file for reproducibility

**Trusted Sources**:
- Use official npm packages
- Review package maintainers
- Check package popularity
- Review source code for critical packages

### Error Handling

**Safe Error Messages**:
```typescript
// Production error handling
if (process.env.NODE_ENV === 'production') {
  res.status(500).json({ 
    error: 'An error occurred' 
  });
} else {
  res.status(500).json({ 
    error: error.message,
    stack: error.stack 
  });
}
```

**Error Logging**:
- Log errors securely
- Never log sensitive data
- Include request correlation IDs
- Monitor error rates

### Logging Security

**Structured Logging**:
```typescript
logger.info({
  userId: req.user.id,
  action: 'task_created',
  resourceId: taskId,
  timestamp: new Date().toISOString()
});
```

**Log Protection**:
- No passwords in logs
- No API keys in logs
- No personal data in logs
- Secure log storage
- Log retention policies

## Network Security

### HTTPS/TLS

**Certificate Management**:
- Let's Encrypt certificates (auto-renew)
- TLS 1.2+ only
- Strong cipher suites
- HSTS headers

**Configuration**:
```typescript
// Security headers
app.use(helmet({
  hsts: {
    maxAge: 31536000,
    includeSubDomains: true,
    preload: true
  }
}));
```

### Firewall Rules

**Inbound Rules**:
- Allow: HTTPS (443)
- Allow: SSH (restricted IPs)
- Deny: All other traffic

**Outbound Rules**:
- Allow: Supabase endpoints
- Allow: External APIs (if needed)
- Deny: All other traffic

## Frontend Security

### Content Security Policy (CSP)

**Implementation**:
```javascript
// next.config.js
const ContentSecurityPolicy = `
  default-src 'self';
  script-src 'self' 'unsafe-eval' 'unsafe-inline';
  style-src 'self' 'unsafe-inline';
  img-src 'self' data: https:;
  font-src 'self';
  connect-src 'self' https://*.supabase.co;
`;

module.exports = {
  async headers() {
    return [
      {
        source: '/:path*',
        headers: [
          {
            key: 'Content-Security-Policy',
            value: ContentSecurityPolicy.replace(/\s{2,}/g, ' ').trim()
          }
        ]
      }
    ];
  }
};
```

### XSS Prevention

**Measures**:
- React's built-in XSS protection
- Sanitize user input
- Escape dynamic content
- Use safe rendering methods

**Input Sanitization**:
```typescript
import DOMPurify from 'dompurify';

const sanitized = DOMPurify.sanitize(userInput);
```

### CSRF Protection

**Implementation**:
- SameSite cookie attribute
- CSRF tokens for state-changing operations
- Origin header validation
- Double-submit cookie pattern

## Third-Party Integrations

### Supabase Security

**Key Management**:
- Anon key: Public, limited permissions
- Service role key: Secret, full permissions (server only)
- Never expose service role key to frontend

**RLS Policies**:
- All tables have RLS enabled
- Policies reviewed and tested
- Regular policy audits

### External APIs

**Security Measures**:
- API keys stored server-side
- Rate limiting implemented
- Request/response validation
- Error handling for failures

## Security Monitoring

### Activity Logging

**Logged Events**:
- Login/logout
- Task creation/modification
- Permission changes
- Failed authentication attempts
- Suspicious activity patterns

**Log Format**:
```typescript
{
  timestamp: '2024-01-14T10:00:00Z',
  userId: 'uuid',
  action: 'task_created',
  entityType: 'task',
  entityId: 'uuid',
  ipAddress: '192.168.1.1',
  userAgent: 'Mozilla/5.0...',
  success: true
}
```

### Intrusion Detection

**Monitoring**:
- Failed login attempts
- Unusual access patterns
- Permission escalation attempts
- Data export anomalies

**Alerts**:
- Real-time alerts for critical events
- Daily summary reports
- Threshold-based notifications

### Security Audits

**Regular Audits**:
- Monthly: Access review
- Quarterly: Code security review
- Bi-annually: Penetration testing
- Annually: Full security assessment

## Compliance

### Data Protection

**GDPR Considerations**:
- Data minimization
- User consent management
- Right to access
- Right to deletion
- Data portability

**Data Retention**:
- Activity logs: 1 year
- Task records: 7 years
- Employee data: 7 years post-employment
- Guest feedback: 2 years

### Industry Standards

**Implemented Standards**:
- OWASP Top 10 mitigation
- Secure coding practices
- Regular security updates
- Incident response plan

## Incident Response

### Incident Types

**Severity Levels**:
- **Critical**: Data breach, system compromise
- **High**: Unauthorized access, major service disruption
- **Medium**: Minor security issues, limited impact
- **Low**: Policy violations, procedural issues

### Response Procedure

**1. Detection**:
- Monitoring alerts
- User reports
- Automated scans

**2. Containment**:
- Isolate affected systems
- Revoke compromised credentials
- Implement temporary restrictions

**3. Investigation**:
- Determine scope and impact
- Identify root cause
- Preserve evidence

**4. Remediation**:
- Apply security patches
- Update policies
- Implement preventive measures

**5. Recovery**:
- Restore from backups if needed
- Verify system integrity
- Resume normal operations

**6. Post-Incident**:
- Document lessons learned
- Update procedures
- Conduct security review

## Security Checklist

### Development
- [ ] No secrets in code
- [ ] Environment variables used
- [ ] Input validation implemented
- [ ] Output encoding applied
- [ ] Error handling secure
- [ ] Dependencies audited
- [ ] Code reviewed for security

### Testing
- [ ] Security tests included
- [ ] Penetration testing performed
- [ ] RLS policies tested
- [ ] Authorization tested
- [ ] Input fuzzing performed
- [ ] Dependency scanning

### Deployment
- [ ] HTTPS enforced
- [ ] CORS configured
- [ ] Security headers set
- [ ] Rate limiting enabled
- [ ] Monitoring configured
- [ ] Backups enabled
- [ ] Logging configured

### Operations
- [ ] Regular security updates
- [ ] Access reviews performed
- [ ] Security audits conducted
- [ ] Incident response plan tested
- [ ] Staff security training
- [ ] Documentation maintained

## Security Resources

### Tools
- npm audit - Dependency vulnerability scanning
- OWASP ZAP - Web application security scanner
- Supabase Dashboard - Database monitoring
- Render/Netlify dashboards - Platform monitoring

### Documentation
- [OWASP Top 10](https://owasp.org/www-project-top-ten/)
- [Supabase Security](https://supabase.com/docs/guides/security)
- [Next.js Security](https://nextjs.org/docs/app/building-your-application/configuring/security)

### Contact
- Security team: [contact info]
- Incident response: [contact info]
- Security questions: [contact info]

---

This security framework ensures the Hotel Task Management and Employee Rating System maintains high security standards while protecting sensitive hotel and guest data.
