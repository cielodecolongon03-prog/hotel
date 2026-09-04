# Architecture Documentation

## System Overview

The Hotel Task Management and Employee Rating System is a full-stack web application designed to improve hotel operations through digital task management, employee performance evaluation, and guest feedback collection.

## Architectural Principles

### 1. Separation of Concerns
- **Frontend**: UI/UX, user interaction, state management
- **Backend**: Business logic, API orchestration, authorization
- **Database**: Data persistence, relationships, security policies

### 2. Security Layers
- **Frontend**: UI permission controls, route protection
- **Backend**: Authentication middleware, authorization checks
- **Database**: Row Level Security (RLS), constraints

### 3. Scalability
- Stateless REST API design
- Database connection pooling
- Efficient data fetching with pagination
- Caching strategies where appropriate

### 4. Maintainability
- Type safety with TypeScript
- Clear separation of layers
- Consistent code patterns
- Comprehensive documentation

## Technology Stack Rationale

### Frontend Stack

**Next.js + React**
- Industry-standard React framework
- Server-side rendering capabilities
- Excellent developer experience
- Strong ecosystem and community
- Built-in routing and optimization

**TypeScript**
- Type safety across the stack
- Better IDE support
- Catch errors at compile time
- Self-documenting code

**Tailwind CSS**
- Utility-first CSS framework
- Consistent design system
- Responsive design utilities
- No custom CSS needed for most cases

**shadcn/ui**
- Modern, accessible components
- Built on Radix UI primitives
- Customizable and copy-pasteable
- No runtime dependencies

**TanStack Query**
- Server state management
- Automatic caching and refetching
- Optimistic updates
- Background refetching

**React Hook Form + Zod**
- Performant form handling
- Schema validation
- Type-safe form data
- Excellent developer experience

### Backend Stack

**Express.js**
- Minimal, flexible Node.js framework
- Large middleware ecosystem
- Proven in production
- Easy to test and maintain

**TypeScript**
- Consistent type safety with frontend
- Better API contracts
- Reduced runtime errors

### Database Stack

**Supabase PostgreSQL**
- Managed PostgreSQL service
- Built-in authentication
- Real-time subscriptions
- Storage for files/images
- Row Level Security
- Excellent developer tools

## System Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                         CLIENT LAYER                             │
│  ┌───────────────────────────────────────────────────────────┐  │
│  │                    Next.js Frontend                        │  │
│  │  ┌─────────────┐  ┌─────────────┐  ┌───────────────────┐ │  │
│  │  │   Pages     │  │ Components  │  │   State Mgmt      │ │  │
│  │  │             │  │             │  │ (React Context/   │ │  │
│  │  │ Dashboard   │  │  UI Kit     │  │  TanStack Query)  │ │  │
│  │  │ Tasks       │  │  Forms      │  │                   │ │  │
│  │  │ Employees   │  │  Tables     │  │                   │ │  │
│  │  │ Reports     │  │  Charts     │  │                   │ │  │
│  │  └─────────────┘  └─────────────┘  └───────────────────┘ │  │
│  └───────────────────────────────────────────────────────────┘  │
│                         ↓                                        │
│                    HTTP/HTTPS                                   │
└─────────────────────────────────────────────────────────────────┘
                           ↓
┌─────────────────────────────────────────────────────────────────┐
│                      API GATEWAY LAYER                          │
│  ┌───────────────────────────────────────────────────────────┐  │
│  │                  Express Backend API                       │  │
│  │  ┌─────────────┐  ┌─────────────┐  ┌───────────────────┐ │  │
│  │  │  Middleware │  │  Routes     │  │   Controllers     │ │  │
│  │  │             │  │             │  │                   │ │  │
│  │  │ Auth        │  │ /api/auth   │  │ AuthController    │ │  │
│  │  │ CORS        │  │ /api/tasks  │  │ TaskController    │ │  │
│  │  │ Validation  │  │ /api/emp... │  │ EmpController     │ │  │
│  │  │ Error       │  │ /api/ratings│  │ RatingController  │ │  │
│  │  │ Logging     │  │ /api/feedback│  │ FeedbackController│ │  │
│  │  └─────────────┘  └─────────────┘  └───────────────────┘ │  │
│  │           ↓                    ↓                   ↓      │  │
│  │  ┌────────────────────────────────────────────────────┐  │  │
│  │  │              Services Layer                          │  │  │
│  │  │  ┌──────────┐  ┌──────────┐  ┌──────────────────┐  │  │  │
│  │  │  │AuthService│ │TaskService│ │EmployeeService  │  │  │  │
│  │  │  └──────────┘  └──────────┘  └──────────────────┘  │  │  │
│  │  └────────────────────────────────────────────────────┘  │  │
│  └───────────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────────┘
                           ↓
┌─────────────────────────────────────────────────────────────────┐
│                      DATA LAYER                                  │
│  ┌───────────────────────────────────────────────────────────┐  │
│  │                   Supabase PostgreSQL                     │  │
│  │  ┌─────────────────────────────────────────────────────┐  │  │
│  │  │              Tables with RLS Policies               │  │  │
│  │  │  ┌─────────┐  ┌─────────┐  ┌─────────────────────┐  │  │  │
│  │  │  │profiles │  │  tasks  │  │employee_ratings    │  │  │  │
│  │  │  └─────────┘  └─────────┘  └─────────────────────┘  │  │  │
│  │  │  ┌─────────┐  ┌─────────┐  ┌─────────────────────┐  │  │  │
│  │  │  │employees│  │feedback │  │activity_logs       │  │  │  │
│  │  │  └─────────┘  └─────────┘  └─────────────────────┘  │  │  │
│  │  └─────────────────────────────────────────────────────┘  │  │  │
│  └───────────────────────────────────────────────────────────┘  │
│                                                                  │
│  ┌───────────────────────────────────────────────────────────┐  │
│  │              Supabase Services                              │  │
│  │  ┌─────────┐  ┌─────────┐  ┌─────────────────────────────┐  │  │
│  │  │  Auth   │  │ Storage │  │      Realtime                │  │  │
│  │  └─────────┘  └─────────┘  │  (Task updates, notifications)│  │  │
│  │                             └─────────────────────────────┘  │  │
│  └───────────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────────┘
```

## Frontend Architecture

### Directory Structure

```
frontend/
├── app/                          # Next.js App Router
│   ├── (auth)/                  # Auth route group
│   │   ├── login/
│   │   └── layout.tsx
│   ├── (dashboard)/             # Dashboard route group
│   │   ├── dashboard/
│   │   ├── tasks/
│   │   ├── employees/
│   │   ├── reports/
│   │   └── layout.tsx
│   ├── api/                     # API routes (if needed)
│   ├── layout.tsx               # Root layout
│   └── page.tsx                 # Home page
│
├── components/                   # React components
│   ├── ui/                      # shadcn/ui components
│   ├── dashboard/               # Dashboard-specific components
│   ├── tasks/                   # Task-related components
│   ├── employees/               # Employee-related components
│   ├── reports/                 # Report-related components
│   └── shared/                  # Shared components
│
├── lib/                         # Utility libraries
│   ├── supabase/                # Supabase client
│   ├── utils.ts                 # Utility functions
│   └── validations.ts           # Zod schemas
│
├── hooks/                       # Custom React hooks
│   ├── useAuth.ts               # Authentication hook
│   ├── useTasks.ts              # Task data hook
│   └── useRealtime.ts           # Realtime subscription hook
│
├── services/                    # API service layer
│   ├── api.ts                   # Base API client
│   ├── auth.service.ts          # Auth API calls
│   ├── tasks.service.ts         # Task API calls
│   └── employees.service.ts     # Employee API calls
│
└── types/                       # TypeScript types
    ├── index.ts                 # Shared types
    ├── task.ts                  # Task types
    └── employee.ts              # Employee types
```

### State Management Strategy

**Client State**: React Context for:
- Authentication state
- User preferences
- UI state (modals, drawers)

**Server State**: TanStack Query for:
- API data fetching
- Caching and refetching
- Optimistic updates
- Background synchronization

**Form State**: React Hook Form for:
- Form data management
- Validation
- Submission handling

### Component Architecture

**Atomic Design Pattern**:
- **Atoms**: Basic UI elements (buttons, inputs)
- **Molecules**: Combinations of atoms (form fields, cards)
- **Organisms**: Complex components (task list, dashboard)
- **Templates**: Page layouts
- **Pages**: Complete pages

## Backend Architecture

### Directory Structure

```
backend/
├── src/
│   ├── routes/                  # API route definitions
│   │   ├── auth.routes.ts
│   │   ├── tasks.routes.ts
│   │   ├── employees.routes.ts
│   │   ├── ratings.routes.ts
│   │   ├── feedback.routes.ts
│   │   ├── reports.routes.ts
│   │   └── activity-logs.routes.ts
│   │
│   ├── controllers/             # Request handlers
│   │   ├── auth.controller.ts
│   │   ├── tasks.controller.ts
│   │   ├── employees.controller.ts
│   │   ├── ratings.controller.ts
│   │   ├── feedback.controller.ts
│   │   ├── reports.controller.ts
│   │   └── activity-logs.controller.ts
│   │
│   ├── services/                # Business logic
│   │   ├── auth.service.ts
│   │   ├── tasks.service.ts
│   │   ├── employees.service.ts
│   │   ├── ratings.service.ts
│   │   ├── feedback.service.ts
│   │   ├── reports.service.ts
│   │   └── activity-logs.service.ts
│   │
│   ├── repositories/            # Data access layer
│   │   ├── base.repository.ts
│   │   ├── tasks.repository.ts
│   │   ├── employees.repository.ts
│   │   └── ratings.repository.ts
│   │
│   ├── middleware/              # Express middleware
│   │   ├── auth.middleware.ts
│   │   ├── rbac.middleware.ts
│   │   ├── validation.middleware.ts
│   │   ├── error.middleware.ts
│   │   └── logger.middleware.ts
│   │
│   ├── validators/              # Request validation schemas
│   │   ├── auth.validator.ts
│   │   ├── tasks.validator.ts
│   │   └── employees.validator.ts
│   │
│   ├── utils/                   # Utility functions
│   │   ├── logger.ts
│   │   ├── errors.ts
│   │   └── supabase.ts
│   │
│   └── types/                   # TypeScript types
│       ├── index.ts
│       ├── auth.types.ts
│       └── task.types.ts
│
├── tests/                       # Test files
│   ├── unit/
│   ├── integration/
│   └── e2e/
│
├── package.json
├── tsconfig.json
└── .env.example
```

### API Architecture Pattern

**Layered Architecture**:
1. **Routes**: Define endpoints and attach middleware
2. **Controllers**: Handle HTTP requests/responses
3. **Services**: Implement business logic
4. **Repositories**: Handle data access

**Example Flow**:
```
POST /api/tasks
  ↓
auth.middleware (verify JWT)
  ↓
rbac.middleware (check permissions)
  ↓
validation.middleware (validate request body)
  ↓
tasks.controller.create (handle request)
  ↓
tasks.service.create (business logic)
  ↓
tasks.repository.create (database operation)
  ↓
activity-logs.service.log (audit trail)
  ↓
response
```

### Security Layers

**1. Authentication Middleware**
- Verify JWT tokens from Supabase Auth
- Extract user information
- Attach user to request object

**2. Authorization Middleware**
- Role-based access control (RBAC)
- Permission checks per endpoint
- Resource ownership verification

**3. Validation Middleware**
- Request body validation using Zod
- Query parameter validation
- Type safety enforcement

**4. Error Handling Middleware**
- Centralized error handling
- Appropriate HTTP status codes
- Safe error messages (no stack traces)

## Database Architecture

### Schema Design Principles

**Normalization**: Third Normal Form (3NF)
- Eliminate redundant data
- Ensure data integrity
- Optimize for queries

**Relationships**:
- One-to-many: Employee → Tasks
- Many-to-one: Tasks → Departments
- One-to-one: Profile → Employee

**Indexes**:
- Primary keys
- Foreign keys
- Frequently queried columns
- Composite indexes for common query patterns

### Row Level Security (RLS)

**Policy Types**:
- **Authentication-based**: Allow authenticated users
- **Role-based**: Restrict by user role
- **Ownership-based**: Users can only access their own data
- **Department-based**: Department-level access

**Example Policies**:
```sql
-- Tasks table
CREATE POLICY "Managers can view all tasks"
  ON tasks FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid()
      AND profiles.role = 'manager'
    )
  );

CREATE POLICY "Employees can view their assigned tasks"
  ON tasks FOR SELECT
  TO authenticated
  USING (assigned_to = auth.uid());
```

## Real-time Architecture

### Supabase Realtime Integration

**Use Cases**:
- Task status changes
- New task assignments
- Task verification updates
- Notification triggers

**Implementation**:
```typescript
// Frontend subscription
const subscription = supabase
  .channel('tasks-changes')
  .on(
    'postgres_changes',
    {
      event: '*',
      schema: 'public',
      table: 'tasks'
    },
    (payload) => {
      // Handle real-time update
      queryClient.invalidateQueries(['tasks']);
    }
  )
  .subscribe();
```

**Optimization**:
- Subscribe only to relevant changes
- Filter by user/department where possible
- Unsubscribe on component unmount
- Debounce rapid updates

## Performance Optimization

### Frontend Optimization

**Code Splitting**:
- Route-based splitting with Next.js
- Lazy loading heavy components
- Dynamic imports for libraries

**Data Fetching**:
- Pagination for large datasets
- Selective field querying
- Background refetching
- Stale-while-revalidate strategy

**Rendering**:
- React.memo for expensive components
- Virtualization for long lists
- Optimistic updates for better UX

### Backend Optimization

**Database**:
- Connection pooling
- Query optimization
- Proper indexing
- N+1 query prevention

**API**:
- Response compression
- Caching headers
- Rate limiting
- Request timeout handling

## Security Architecture

### Defense in Depth

**1. Network Security**
- HTTPS only in production
- CORS restrictions
- API rate limiting

**2. Application Security**
- Input validation
- Output encoding
- SQL injection prevention
- XSS protection

**3. Data Security**
- Encryption at rest (Supabase)
- Encryption in transit (HTTPS)
- Secure session management
- Secure password handling

**4. Access Control**
- Multi-layer authorization
- Principle of least privilege
- Regular security audits
- Activity logging

### Security Checklist

- [ ] Service role key never exposed to frontend
- [ ] RLS policies enabled on all tables
- [ ] CORS restricted to production domains
- [ ] All API inputs validated
- [ ] SQL injection prevention
- [ ] XSS mitigation
- [ ] CSRF protection
- [ ] Secure password handling
- [ ] Session timeout implementation
- [ ] Audit logging for sensitive operations

## Deployment Architecture

### Frontend Deployment (Netlify)

**Build Process**:
- Next.js production build
- Static site generation where possible
- Environment variable injection
- Asset optimization

**Configuration**:
- netlify.toml for build settings
- Redirect rules for SPA routing
- Headers for security

### Backend Deployment (Render)

**Configuration**:
- Node.js build pack
- Environment variables
- Health check endpoint
- Auto-scaling settings

**Monitoring**:
- Application logs
- Error tracking
- Performance metrics
- Uptime monitoring

### Database (Supabase)

**Configuration**:
- Database backups
- Point-in-time recovery
- Connection pooling
- Performance monitoring

## Monitoring and Observability

### Application Monitoring

**Frontend**:
- Error tracking (Sentry or similar)
- Performance monitoring
- User analytics (if approved)

**Backend**:
- Application logs
- API response times
- Error rates
- Database query performance

### Logging Strategy

**Structured Logging**:
- JSON format
- Consistent log levels
- Request correlation IDs
- Sensitive data redaction

**Log Categories**:
- Authentication events
- Authorization failures
- API errors
- Performance metrics
- Security events

## Disaster Recovery

### Backup Strategy

**Database**:
- Daily automated backups (Supabase)
- Point-in-time recovery (7 days)
- Manual backup before major changes

**Application**:
- Git version control
- Environment variable backups
- Configuration management

### Recovery Procedures

**Database Recovery**:
1. Identify backup point
2. Restore to Supabase
3. Verify data integrity
4. Test application functionality

**Application Recovery**:
1. Deploy from Git
2. Restore environment variables
3. Verify integrations
4. Monitor for issues

## Scaling Strategy

### Horizontal Scaling

**Frontend**:
- CDN distribution (Netlify)
- Edge functions for dynamic content
- Asset optimization

**Backend**:
- Load balancing (Render)
- Horizontal pod autoscaling
- Database connection pooling

### Vertical Scaling

**Database**:
- Upgrade Supabase tier as needed
- Optimize queries
- Add indexes
- Archive old data

## Future Considerations

### Potential Enhancements

**Mobile App**:
- React Native implementation
- Push notifications
- Offline capabilities

**Advanced Features**:
- AI-powered task recommendations
- Predictive analytics
- Advanced reporting
- Integration with hotel PMS

**Integrations**:
- Payment gateways
- SMS notifications
- Third-party hotel systems
- Accounting software

## Technology Debt Management

**Regular Maintenance**:
- Dependency updates
- Security patches
- Code refactoring
- Documentation updates
- Performance optimization

**Review Schedule**:
- Monthly security reviews
- Quarterly architecture reviews
- Annual technology stack evaluation

---

This architecture is designed to be scalable, maintainable, and secure while providing an excellent user experience for Crown Jewel Hotel staff and guests.
