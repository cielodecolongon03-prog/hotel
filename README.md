# Hotel Task Management and Employee Rating System

**Crown Jewel Hotel**  
K'noon, Poblacion, T'boli, South Cotabato, Philippines, 9513

A production-grade hotel operations platform for task assignment, employee performance evaluation, accountability, centralized record management, reporting, and guest feedback.

## 🎯 System Objective

Improve hotel operations by replacing manual task assignment with a digital system that provides:
- Digital task assignment and monitoring
- Real-time task progress tracking
- Objective employee performance evaluation
- Centralized record management
- Automated reporting and analytics
- Guest feedback collection
- Enhanced accountability and transparency

## 🏗️ Technology Stack

### Frontend
- **React.js** - UI framework
- **Next.js** - React framework with SSR
- **TypeScript** - Type safety
- **Tailwind CSS** - Styling
- **shadcn/ui** - Component library
- **Lucide React** - Icons
- **TanStack Query** - Data fetching and caching
- **React Hook Form** - Form management
- **Zod** - Schema validation
- **Recharts** - Data visualization
- **Framer Motion** - Animations (where UX-appropriate)

### Backend
- **Node.js** - Runtime environment
- **TypeScript** - Type safety
- **Express.js** - REST API framework

### Database & Services
- **Supabase PostgreSQL** - Primary database
- **Supabase Authentication** - User authentication
- **Supabase Storage** - File/image storage
- **Supabase Row Level Security (RLS)** - Database security
- **Supabase Realtime** - Real-time updates

### Deployment
- **Netlify** - Frontend hosting
- **Render** - Backend API hosting
- **Supabase** - Database, auth, storage, realtime
- **GitHub** - Source control

## 👥 User Roles

### Hotel Owner
- View high-level hotel performance
- View reports and statistics
- View employee performance metrics
- Access operational statistics

### Hotel Manager
- Manage employees and roles
- Create, assign, and edit tasks
- Set deadlines and priorities
- Monitor task progress in real-time
- Verify completed tasks
- Manage employee ratings
- View and generate reports
- Review guest feedback
- Monitor activity logs

### Front Desk Staff
- View assigned tasks
- Update task status
- Complete assigned tasks
- View relevant operational information
- Respond to guest-related tasks

### Housekeeping Staff
- View assigned housekeeping tasks
- Update task status
- Mark tasks as completed
- View task details

### Maintenance Staff
- View assigned maintenance tasks
- Update task status
- Mark tasks as completed
- View task details

### Hotel Guest
- Submit service ratings
- Provide feedback
- View guest-facing information
- **No access to employee management functions**

## 📋 Core Modules

### 1. Authentication
- Secure login/logout with Supabase Auth
- Session persistence
- Protected routes
- Role-based access control
- Password management
- Account status management

### 2. Dashboard
- Role-specific dashboards with relevant metrics
- Real-time operational statistics
- Task completion trends
- Employee performance overview
- Recent activity and feedback

### 3. Task Management
- Create, assign, and manage tasks
- Task categories and priorities
- Deadline management
- Status tracking
- Task verification workflow
- Real-time updates

### 4. Task Verification
- Multi-step verification process
- Completion notes
- Manager verification
- Audit trail
- Accountability tracking

### 5. Employee Management
- Employee profiles and roles
- Department assignments
- Account status management
- Performance statistics
- Activity history

### 6. Employee Rating System
- Standardized performance criteria:
  - Punctuality
  - Task completion
  - Quality of work
  - Customer feedback
- Historical performance tracking
- Objective evaluation metrics

### 7. Guest Rating & Feedback
- Guest rating submission
- Feedback collection
- Service-specific comments
- Anti-abuse protections
- Manager review capabilities

### 8. Activity Logs
- Comprehensive audit trail
- Action tracking with metadata
- Tamper-resistant logging
- Historical record management

### 9. Reporting
- Daily, weekly, monthly reports
- Task completion analytics
- Employee performance reports
- Guest feedback trends
- Operational statistics
- Export capabilities

## 🏗️ Architecture

```
                         USERS
                           |
                           v
                 ┌─────────────────────┐
                 │    NEXT.JS APP      │
                 │      React UI        │
                 │      Netlify         │
                 └──────────┬──────────┘
                            |
                            | HTTPS REST API
                            v
                 ┌─────────────────────┐
                 │    EXPRESS API      │
                 │   Node.js + TS      │
                 │      Render         │
                 └──────────┬──────────┘
                            |
              ┌─────────────┼─────────────┐
              |             |             |
              v             v             v
        ┌──────────┐  ┌──────────┐  ┌────────────┐
        │ Supabase│  │ Supabase │  │ Supabase   │
        │PostgreSQL│ │   Auth   │  │  Storage   │
        └──────────┘  └──────────┘  └────────────┘
                            |
                            v
                     Supabase Realtime
```

## 📁 Project Structure

```
hotel/
├── frontend/                 # Next.js frontend application
│   ├── app/                 # Next.js app directory
│   ├── components/          # React components
│   ├── lib/                 # Utility libraries
│   ├── hooks/               # Custom React hooks
│   ├── services/            # API service layer
│   ├── types/               # TypeScript types
│   └── public/              # Static assets
│
├── backend/                 # Express backend API
│   ├── src/
│   │   ├── routes/          # API route definitions
│   │   ├── controllers/     # Request handlers
│   │   ├── services/        # Business logic
│   │   ├── repositories/    # Data access layer
│   │   ├── middleware/      # Express middleware
│   │   ├── validators/      # Request validation
│   │   ├── utils/           # Utility functions
│   │   └── types/           # TypeScript types
│   └── tests/               # Backend tests
│
├── database/                # Database migrations and seeds
│   ├── migrations/         # SQL migration files
│   └── seeds/               # Seed data scripts
│
├── docs/                    # Documentation
│   ├── ARCHITECTURE.md
│   ├── DATABASE.md
│   ├── API.md
│   ├── DEPLOYMENT.md
│   ├── SECURITY.md
│   └── ENVIRONMENT.md
│
└── README.md               # This file
```

## 🚀 Getting Started

### Prerequisites
- Node.js 18+ 
- npm or yarn
- Git
- Supabase account
- Netlify account
- Render account

### Development Setup

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd hotel
   ```

2. **Set up environment variables**
   - Copy `.env.example` files in both frontend and backend
   - Configure your Supabase credentials
   - See [ENVIRONMENT.md](docs/ENVIRONMENT.md) for details

3. **Install dependencies**
   ```bash
   # Frontend
   cd frontend
   npm install
   
   # Backend
   cd ../backend
   npm install
   ```

4. **Set up the database**
   - Create a Supabase project
   - Run migrations from `database/migrations/`
   - See [DATABASE.md](docs/DATABASE.md) for details

5. **Start development servers**
   ```bash
   # Frontend (port 3000)
   cd frontend
   npm run dev
   
   # Backend (port 5000)
   cd backend
   npm run dev
   ```

## 📚 Documentation

- [ARCHITECTURE.md](docs/ARCHITECTURE.md) - System architecture and design decisions
- [DATABASE.md](docs/DATABASE.md) - Database schema and RLS policies
- [API.md](docs/API.md) - API endpoints and contracts
- [DEPLOYMENT.md](docs/DEPLOYMENT.md) - Deployment instructions
- [SECURITY.md](docs/SECURITY.md) - Security considerations
- [ENVIRONMENT.md](docs/ENVIRONMENT.md) - Environment variable reference

## 🔒 Security

- Row Level Security (RLS) enabled on all tables
- Service-role keys never exposed to frontend
- CORS restricted to production domains
- Input validation on all API endpoints
- Activity logging for audit trails
- Role-based access control enforced at multiple levels

## 🧪 Testing

```bash
# Frontend tests
cd frontend
npm test

# Backend tests
cd backend
npm test
```

## 📊 Key Features

- **Real-time Task Tracking**: Live updates on task status and progress
- **Performance Analytics**: Data-driven employee evaluation
- **Guest Feedback Integration**: Direct customer input into performance metrics
- **Comprehensive Reporting**: Daily, weekly, monthly operational reports
- **Audit Trail**: Complete activity logging for accountability
- **Mobile Responsive**: Works on desktop, tablet, and mobile devices
- **Role-Based Access**: Proper permissions for each user type

## 🎨 Design Principles

The interface follows modern design principles inspired by industry-leading products:
- Clean, minimalist interface
- Strong information hierarchy
- Intuitive navigation
- Professional typography
- Consistent spacing and visual rhythm
- Accessible color contrasts
- Responsive layouts

## 📄 License

Proprietary - Crown Jewel Hotel

## 👥 Support

For technical support or questions, please contact the development team.

---

**Built with ❤️ for Crown Jewel Hotel**
