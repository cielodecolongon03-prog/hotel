# Database Documentation

## Overview

The Hotel Task Management and Employee Rating System uses Supabase PostgreSQL as the primary database. This document describes the database schema, relationships, constraints, and Row Level Security (RLS) policies.

## Database Design Principles

### Normalization
The database follows Third Normal Form (3NF) to:
- Eliminate data redundancy
- Ensure data integrity
- Optimize query performance
- Simplify maintenance

### Security
- Row Level Security (RLS) enabled on all tables
- Service role access only via backend
- Principle of least privilege
- Audit logging for sensitive operations

### Performance
- Proper indexing on frequently queried columns
- Foreign key constraints for data integrity
- Efficient data types
- Query optimization

## Entity Relationship Diagram

```
┌─────────────────┐       ┌─────────────────┐
│    profiles    │       │     roles       │
├─────────────────┤       ├─────────────────┤
│ id (PK)         │───┐   │ id (PK)         │
│ email           │   │   │ name            │
│ full_name       │   │   │ description     │
│ role_id (FK)    │───┘   │ permissions     │
│ avatar_url      │       └─────────────────┘
│ created_at      │
│ updated_at      │
└─────────────────┘
         │
         │ 1
         │
         │ N
┌─────────────────┐       ┌─────────────────┐
│   employees     │       │  departments    │
├─────────────────┤       ├─────────────────┤
│ id (PK)         │───┐   │ id (PK)         │
│ profile_id (FK) │   │   │ name            │
│ department_id   │───┘   │ description     │
│ (FK)            │       │ manager_id (FK) │
│ employee_number │       └─────────────────┘
│ hire_date       │
│ status          │
│ created_at      │
│ updated_at      │
└─────────────────┘
         │
         │ 1
         │
         │ N
┌─────────────────┐       ┌─────────────────┐
│     tasks       │       │task_categories  │
├─────────────────┤       ├─────────────────┤
│ id (PK)         │───┐   │ id (PK)         │
│ title           │   │   │ name            │
│ description     │   │   │ description     │
│ category_id (FK)│───┘   │ department_id   │
│ (FK)            │       │ (FK)            │
│ assigned_to (FK)│───────┐
│ created_by (FK) │       │
│ priority        │       │
│ status          │       │
│ deadline        │       │
│ started_at      │       │
│ completed_at    │       │
│ verified_at     │       │
│ verified_by (FK)│       │
│ completion_notes│       │
│ verification_   │       │
│ notes           │       │
│ created_at      │       │
│ updated_at      │       │
└─────────────────┘       └─────────────────┘
         │
         │ 1
         │
         │ N
┌─────────────────┐       ┌─────────────────┐
│task_status_     │       │task_verifications│
│history          │       ├─────────────────┤
├─────────────────┤       │ id (PK)         │
│ id (PK)         │       │ task_id (FK)    │
│ task_id (FK)    │───────│ verified_by (FK)│
│ status          │       │ verified_at     │
│ changed_by (FK) │       │ notes           │
│ changed_at      │       │ result          │
│ notes           │       └─────────────────┘
└─────────────────┘
         
┌─────────────────┐       ┌─────────────────┐
│employee_ratings │       │ guest_feedback  │
├─────────────────┤       ├─────────────────┤
│ id (PK)         │       │ id (PK)         │
│ employee_id (FK)│       │ task_id (FK)    │
│ rated_by (FK)   │       │ guest_name      │
│ rating_period   │       │ rating          │
│ punctuality     │       │ feedback        │
│ task_completion │       │ category        │
│ quality_of_work │       │ submitted_at    │
│ customer_       │       │ reviewed        │
│ feedback        │       │ reviewed_by (FK)│
│ overall_rating  │       │ reviewed_at     │
│ notes           │       └─────────────────┘
│ created_at      │
│ updated_at      │
└─────────────────┘

┌─────────────────┐
│ activity_logs   │
├─────────────────┤
│ id (PK)         │
│ user_id (FK)    │
│ action          │
│ entity_type     │
│ entity_id       │
│ details         │
│ ip_address      │
│ user_agent      │
│ created_at      │
└─────────────────┘
```

## Table Definitions

### profiles

Stores user authentication and profile information managed by Supabase Auth.

```sql
CREATE TABLE profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT UNIQUE NOT NULL,
  full_name TEXT,
  role_id UUID REFERENCES roles(id) ON DELETE SET NULL,
  avatar_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX idx_profiles_role ON profiles(role_id);
CREATE INDEX idx_profiles_email ON profiles(email);
```

### roles

Defines user roles and their associated permissions.

```sql
CREATE TABLE roles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT UNIQUE NOT NULL,
  description TEXT,
  permissions JSONB DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Default roles
INSERT INTO roles (name, description, permissions) VALUES
('hotel_owner', 'Hotel owner with full access', '{"view": "all", "manage": "none"}'),
('hotel_manager', 'Hotel manager with operational control', '{"view": "all", "manage": "operations"}'),
('front_desk', 'Front desk staff', '{"view": "assigned", "manage": "own_tasks"}'),
('housekeeping', 'Housekeeping staff', '{"view": "assigned", "manage": "own_tasks"}'),
('maintenance', 'Maintenance staff', '{"view": "assigned", "manage": "own_tasks"}'),
('guest', 'Hotel guest', '{"view": "guest", "manage": "feedback"}');
```

### departments

Organizational departments within the hotel.

```sql
CREATE TABLE departments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT UNIQUE NOT NULL,
  description TEXT,
  manager_id UUID REFERENCES employees(id) ON DELETE SET NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Default departments
INSERT INTO departments (name, description) VALUES
('Front Desk', 'Guest check-in, check-out, and concierge services'),
('Housekeeping', 'Room cleaning and maintenance'),
('Maintenance', 'Building and equipment maintenance'),
('Food & Beverage', 'Restaurant and room service'),
('Management', 'Hotel administration and operations');
```

### employees

Extended employee information beyond the basic profile.

```sql
CREATE TABLE employees (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  profile_id UUID UNIQUE REFERENCES profiles(id) ON DELETE CASCADE,
  department_id UUID REFERENCES departments(id) ON DELETE SET NULL,
  employee_number TEXT UNIQUE NOT NULL,
  hire_date DATE NOT NULL,
  status TEXT DEFAULT 'active' CHECK (status IN ('active', 'inactive', 'on_leave', 'terminated')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX idx_employees_profile ON employees(profile_id);
CREATE INDEX idx_employees_department ON employees(department_id);
CREATE INDEX idx_employees_status ON employees(status);
```

### task_categories

Categories for organizing tasks.

```sql
CREATE TABLE task_categories (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT UNIQUE NOT NULL,
  description TEXT,
  department_id UUID REFERENCES departments(id) ON DELETE SET NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Default task categories
INSERT INTO task_categories (name, description, department_id) VALUES
('Room Cleaning', 'Guest room cleaning and preparation', 
 (SELECT id FROM departments WHERE name = 'Housekeeping')),
('Guest Check-in', 'Guest registration and room assignment',
 (SELECT id FROM departments WHERE name = 'Front Desk')),
('Maintenance Request', 'Building and equipment repairs',
 (SELECT id FROM departments WHERE name = 'Maintenance')),
('Guest Service', 'Special guest requests and services',
 (SELECT id FROM departments WHERE name = 'Front Desk'));
```

### tasks

Core task management table.

```sql
CREATE TABLE tasks (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  description TEXT,
  category_id UUID REFERENCES task_categories(id) ON DELETE SET NULL,
  assigned_to UUID REFERENCES employees(id) ON DELETE SET NULL,
  created_by UUID REFERENCES profiles(id) ON DELETE SET NULL,
  priority TEXT DEFAULT 'medium' CHECK (priority IN ('low', 'medium', 'high', 'urgent')),
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'in_progress', 'completed', 'verified', 'overdue', 'cancelled')),
  deadline TIMESTAMP WITH TIME ZONE,
  started_at TIMESTAMP WITH TIME ZONE,
  completed_at TIMESTAMP WITH TIME ZONE,
  verified_at TIMESTAMP WITH TIME ZONE,
  verified_by UUID REFERENCES profiles(id) ON DELETE SET NULL,
  completion_notes TEXT,
  verification_notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX idx_tasks_assigned ON tasks(assigned_to);
CREATE INDEX idx_tasks_created_by ON tasks(created_by);
CREATE INDEX idx_tasks_status ON tasks(status);
CREATE INDEX idx_tasks_priority ON tasks(priority);
CREATE INDEX idx_tasks_category ON tasks(category_id);
CREATE INDEX idx_tasks_deadline ON tasks(deadline);
```

### task_status_history

Audit trail for task status changes.

```sql
CREATE TABLE task_status_history (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  task_id UUID NOT NULL REFERENCES tasks(id) ON DELETE CASCADE,
  status TEXT NOT NULL,
  changed_by UUID NOT NULL REFERENCES profiles(id) ON DELETE SET NULL,
  changed_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  notes TEXT
);

CREATE INDEX idx_task_history_task ON task_status_history(task_id);
CREATE INDEX idx_task_history_changed_by ON task_status_history(changed_by);
```

### task_verifications

Task verification records for accountability.

```sql
CREATE TABLE task_verifications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  task_id UUID NOT NULL REFERENCES tasks(id) ON DELETE CASCADE,
  verified_by UUID NOT NULL REFERENCES profiles(id) ON DELETE SET NULL,
  verified_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  notes TEXT,
  result TEXT NOT NULL CHECK (result IN ('approved', 'rejected', 'needs_revision'))
);

CREATE INDEX idx_task_verifications_task ON task_verifications(task_id);
CREATE INDEX idx_task_verifications_verified_by ON task_verifications(verified_by);
```

### employee_ratings

Employee performance ratings.

```sql
CREATE TABLE employee_ratings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  employee_id UUID NOT NULL REFERENCES employees(id) ON DELETE CASCADE,
  rated_by UUID NOT NULL REFERENCES profiles(id) ON DELETE SET NULL,
  rating_period TEXT NOT NULL, -- e.g., "2024-01", "Q1-2024"
  punctuality INTEGER CHECK (punctuality BETWEEN 1 AND 5),
  task_completion INTEGER CHECK (task_completion BETWEEN 1 AND 5),
  quality_of_work INTEGER CHECK (quality_of_work BETWEEN 1 AND 5),
  customer_feedback INTEGER CHECK (customer_feedback BETWEEN 1 AND 5),
  overall_rating INTEGER CHECK (overall_rating BETWEEN 1 AND 5),
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(employee_id, rating_period)
);

CREATE INDEX idx_ratings_employee ON employee_ratings(employee_id);
CREATE INDEX idx_ratings_rated_by ON employee_ratings(rated_by);
CREATE INDEX idx_ratings_period ON employee_ratings(rating_period);
```

### guest_feedback

Guest ratings and feedback.

```sql
CREATE TABLE guest_feedback (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  task_id UUID REFERENCES tasks(id) ON DELETE SET NULL,
  guest_name TEXT NOT NULL,
  rating INTEGER NOT NULL CHECK (rating BETWEEN 1 AND 5),
  feedback TEXT,
  category TEXT CHECK (category IN ('service', 'cleanliness', 'amenities', 'staff', 'other')),
  submitted_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  reviewed BOOLEAN DEFAULT false,
  reviewed_by UUID REFERENCES profiles(id) ON DELETE SET NULL,
  reviewed_at TIMESTAMP WITH TIME ZONE
);

CREATE INDEX idx_feedback_task ON guest_feedback(task_id);
CREATE INDEX idx_feedback_reviewed ON guest_feedback(reviewed);
CREATE INDEX idx_feedback_submitted ON guest_feedback(submitted_at);
```

### activity_logs

Comprehensive audit trail for system activities.

```sql
CREATE TABLE activity_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES profiles(id) ON DELETE SET NULL,
  action TEXT NOT NULL,
  entity_type TEXT NOT NULL,
  entity_id UUID,
  details JSONB DEFAULT '{}',
  ip_address TEXT,
  user_agent TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX idx_activity_user ON activity_logs(user_id);
CREATE INDEX idx_activity_entity ON activity_logs(entity_type, entity_id);
CREATE INDEX idx_activity_created ON activity_logs(created_at);
CREATE INDEX idx_activity_action ON activity_logs(action);
```

## Row Level Security (RLS) Policies

### Enable RLS

```sql
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE roles ENABLE ROW LEVEL SECURITY;
ALTER TABLE departments ENABLE ROW LEVEL SECURITY;
ALTER TABLE employees ENABLE ROW LEVEL SECURITY;
ALTER TABLE task_categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE tasks ENABLE ROW LEVEL SECURITY;
ALTER TABLE task_status_history ENABLE ROW LEVEL SECURITY;
ALTER TABLE task_verifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE employee_ratings ENABLE ROW LEVEL SECURITY;
ALTER TABLE guest_feedback ENABLE ROW LEVEL SECURITY;
ALTER TABLE activity_logs ENABLE ROW LEVEL SECURITY;
```

### profiles Policies

```sql
-- Users can view their own profile
CREATE POLICY "Users can view own profile"
  ON profiles FOR SELECT
  TO authenticated
  USING (id = auth.uid());

-- Managers can view all profiles
CREATE POLICY "Managers can view all profiles"
  ON profiles FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid()
      AND profiles.role_id IN (
        SELECT id FROM roles WHERE name IN ('hotel_owner', 'hotel_manager')
      )
    )
  );

-- Users can update their own profile
CREATE POLICY "Users can update own profile"
  ON profiles FOR UPDATE
  TO authenticated
  USING (id = auth.uid())
  WITH CHECK (id = auth.uid());

-- Service role can do everything (backend only)
CREATE POLICY "Service role can manage profiles"
  ON profiles FOR ALL
  TO service_role
  USING (true) WITH CHECK (true);
```

### tasks Policies

```sql
-- Managers can view all tasks
CREATE POLICY "Managers can view all tasks"
  ON tasks FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid()
      AND profiles.role_id IN (
        SELECT id FROM roles WHERE name IN ('hotel_owner', 'hotel_manager')
      )
    )
  );

-- Employees can view their assigned tasks
CREATE POLICY "Employees can view assigned tasks"
  ON tasks FOR SELECT
  TO authenticated
  USING (
    assigned_to IN (
      SELECT id FROM employees WHERE profile_id = auth.uid()
    )
  );

-- Managers can insert tasks
CREATE POLICY "Managers can create tasks"
  ON tasks FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid()
      AND profiles.role_id IN (
        SELECT id FROM roles WHERE name IN ('hotel_manager')
      )
    )
  );

-- Assigned employees can update task status
CREATE POLICY "Employees can update own tasks"
  ON tasks FOR UPDATE
  TO authenticated
  USING (
    assigned_to IN (
      SELECT id FROM employees WHERE profile_id = auth.uid()
    )
  )
  WITH CHECK (
    assigned_to IN (
      SELECT id FROM employees WHERE profile_id = auth.uid()
    )
  );

-- Managers can update all tasks
CREATE POLICY "Managers can update all tasks"
  ON tasks FOR UPDATE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid()
      AND profiles.role_id IN (
        SELECT id FROM roles WHERE name IN ('hotel_manager')
      )
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid()
      AND profiles.role_id IN (
        SELECT id FROM roles WHERE name IN ('hotel_manager')
      )
    )
  );

-- Service role full access
CREATE POLICY "Service role can manage tasks"
  ON tasks FOR ALL
  TO service_role
  USING (true) WITH CHECK (true);
```

### employee_ratings Policies

```sql
-- Managers can view all ratings
CREATE POLICY "Managers can view all ratings"
  ON employee_ratings FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid()
      AND profiles.role_id IN (
        SELECT id FROM roles WHERE name IN ('hotel_owner', 'hotel_manager')
      )
    )
  );

-- Employees can view their own ratings
CREATE POLICY "Employees can view own ratings"
  ON employee_ratings FOR SELECT
  TO authenticated
  USING (
    employee_id IN (
      SELECT id FROM employees WHERE profile_id = auth.uid()
    )
  );

-- Only managers can create ratings
CREATE POLICY "Managers can create ratings"
  ON employee_ratings FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid()
      AND profiles.role_id IN (
        SELECT id FROM roles WHERE name IN ('hotel_manager')
      )
    )
  );

-- Only managers can update ratings
CREATE POLICY "Managers can update ratings"
  ON employee_ratings FOR UPDATE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid()
      AND profiles.role_id IN (
        SELECT id FROM roles WHERE name IN ('hotel_manager')
      )
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid()
      AND profiles.role_id IN (
        SELECT id FROM roles WHERE name IN ('hotel_manager')
      )
    )
  );

-- Service role full access
CREATE POLICY "Service role can manage ratings"
  ON employee_ratings FOR ALL
  TO service_role
  USING (true) WITH CHECK (true);
```

### guest_feedback Policies

```sql
-- Anyone can submit feedback (insert)
CREATE POLICY "Anyone can submit feedback"
  ON guest_feedback FOR INSERT
  TO authenticated
  WITH CHECK (true);

-- Managers can view all feedback
CREATE POLICY "Managers can view all feedback"
  ON guest_feedback FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid()
      AND profiles.role_id IN (
        SELECT id FROM roles WHERE name IN ('hotel_owner', 'hotel_manager')
      )
    )
  );

-- Managers can update feedback (review status)
CREATE POLICY "Managers can update feedback"
  ON guest_feedback FOR UPDATE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid()
      AND profiles.role_id IN (
        SELECT id FROM roles WHERE name IN ('hotel_manager')
      )
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid()
      AND profiles.role_id IN (
        SELECT id FROM roles WHERE name IN ('hotel_manager')
      )
    )
  );

-- Service role full access
CREATE POLICY "Service role can manage feedback"
  ON guest_feedback FOR ALL
  TO service_role
  USING (true) WITH CHECK (true);
```

### activity_logs Policies

```sql
-- Users can view their own activity logs
CREATE POLICY "Users can view own activity logs"
  ON activity_logs FOR SELECT
  TO authenticated
  USING (user_id = auth.uid());

-- Managers can view all activity logs
CREATE POLICY "Managers can view all activity logs"
  ON activity_logs FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid()
      AND profiles.role_id IN (
        SELECT id FROM roles WHERE name IN ('hotel_owner', 'hotel_manager')
      )
    )
  );

-- Only service role can insert logs (backend only)
CREATE POLICY "Service role can insert activity logs"
  ON activity_logs FOR INSERT
  TO service_role
  WITH CHECK (true);

-- Service role full access
CREATE POLICY "Service role can manage activity logs"
  ON activity_logs FOR ALL
  TO service_role
  USING (true) WITH CHECK (true);
```

## Database Functions

### Update Timestamp Function

```sql
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Apply to tables with updated_at
CREATE TRIGGER update_profiles_updated_at BEFORE UPDATE ON profiles
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_employees_updated_at BEFORE UPDATE ON employees
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_tasks_updated_at BEFORE UPDATE ON tasks
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_employee_ratings_updated_at BEFORE UPDATE ON employee_ratings
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
```

### Task Status Transition Function

```sql
CREATE OR REPLACE FUNCTION validate_task_status_transition()
RETURNS TRIGGER AS $$
DECLARE
  current_status TEXT;
BEGIN
  current_status := OLD.status;
  
  -- Define valid transitions
  IF current_status = 'pending' AND NEW.status NOT IN ('in_progress', 'cancelled') THEN
    RAISE EXCEPTION 'Invalid status transition from pending to %', NEW.status;
  END IF;
  
  IF current_status = 'in_progress' AND NEW.status NOT IN ('completed', 'cancelled', 'pending') THEN
    RAISE EXCEPTION 'Invalid status transition from in_progress to %', NEW.status;
  END IF;
  
  IF current_status = 'completed' AND NEW.status NOT IN ('verified', 'in_progress') THEN
    RAISE EXCEPTION 'Invalid status transition from completed to %', NEW.status;
  END IF;
  
  IF current_status = 'verified' AND NEW.status != 'completed' THEN
    RAISE EXCEPTION 'Cannot change status from verified';
  END IF;
  
  -- Auto-set timestamps based on status
  IF NEW.status = 'in_progress' AND OLD.status != 'in_progress' THEN
    NEW.started_at := NOW();
  END IF;
  
  IF NEW.status = 'completed' AND OLD.status != 'completed' THEN
    NEW.completed_at := NOW();
  END IF;
  
  IF NEW.status = 'verified' AND OLD.status != 'verified' THEN
    NEW.verified_at := NOW();
  END IF;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER validate_task_status_transition_trigger
  BEFORE UPDATE ON tasks
  FOR EACH ROW
  EXECUTE FUNCTION validate_task_status_transition();
```

## Database Views

### Employee Performance View

```sql
CREATE OR REPLACE VIEW employee_performance_view AS
SELECT 
  e.id,
  e.employee_number,
  p.full_name,
  d.name as department,
  e.status,
  COUNT(t.id) as total_tasks,
  COUNT(CASE WHEN t.status = 'completed' THEN 1 END) as completed_tasks,
  COUNT(CASE WHEN t.status = 'verified' THEN 1 END) as verified_tasks,
  COUNT(CASE WHEN t.status = 'overdue' THEN 1 END) as overdue_tasks,
  COALESCE(AVG(er.overall_rating), 0) as average_rating
FROM employees e
JOIN profiles p ON e.profile_id = p.id
LEFT JOIN departments d ON e.department_id = d.id
LEFT JOIN tasks t ON e.id = t.assigned_to
LEFT JOIN employee_ratings er ON e.id = er.employee_id
GROUP BY e.id, e.employee_number, p.full_name, d.name, e.status;
```

### Task Summary View

```sql
CREATE OR REPLACE VIEW task_summary_view AS
SELECT 
  COUNT(*) as total_tasks,
  COUNT(CASE WHEN status = 'pending' THEN 1 END) as pending_tasks,
  COUNT(CASE WHEN status = 'in_progress' THEN 1 END) as in_progress_tasks,
  COUNT(CASE WHEN status = 'completed' THEN 1 END) as completed_tasks,
  COUNT(CASE WHEN status = 'verified' THEN 1 END) as verified_tasks,
  COUNT(CASE WHEN status = 'overdue' THEN 1 END) as overdue_tasks,
  COUNT(CASE WHEN status = 'cancelled' THEN 1 END) as cancelled_tasks
FROM tasks;
```

## Migration Strategy

### Initial Setup

1. Create database in Supabase
2. Run schema creation scripts in order
3. Enable RLS on all tables
4. Create RLS policies
5. Create indexes
6. Create functions and triggers
7. Insert default data (roles, departments, categories)
8. Create views

### Development vs Production

**Development**:
- Use Supabase local development or separate project
- Seed with test data
- More permissive RLS for testing

**Production**:
- Strict RLS policies
- No seed data
- Regular backups
- Monitoring enabled

## Backup and Recovery

### Backup Strategy

- Supabase automated daily backups
- Point-in-time recovery (7-day retention)
- Manual backup before major schema changes
- Export critical data periodically

### Recovery Procedures

1. Identify the point in time to restore
2. Use Supabase dashboard or API to restore
3. Verify data integrity
4. Test application functionality
5. Monitor for issues

## Performance Optimization

### Query Optimization

- Use EXPLAIN ANALYZE for slow queries
- Add composite indexes for common query patterns
- Avoid SELECT *; specify only needed columns
- Use pagination for large result sets
- Consider materialized views for complex aggregations

### Index Maintenance

```sql
-- Analyze tables for query optimization
ANALYZE profiles;
ANALYZE tasks;
ANALYZE employees;

-- Reindex if performance degrades
REINDEX TABLE tasks;
```

## Monitoring

### Key Metrics to Monitor

- Query performance
- Database connection count
- Table sizes
- Index usage
- Slow query log
- RLS policy performance

### Supabase Monitoring

Use Supabase dashboard for:
- Database metrics
- Query performance insights
- Storage usage
- API request counts
- Auth events

---

This database schema provides a solid foundation for the Hotel Task Management and Employee Rating System with proper security, performance, and maintainability.
