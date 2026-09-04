-- Initial Schema Migration for Crown Jewel Hotel Management System
-- This migration creates the core database structure

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create roles table
CREATE TABLE roles (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT UNIQUE NOT NULL,
  description TEXT,
  permissions JSONB DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Insert default roles
INSERT INTO roles (name, description, permissions) VALUES
('hotel_owner', 'Hotel owner with full access', '{"view": "all", "manage": "none"}'::jsonb),
('hotel_manager', 'Hotel manager with operational control', '{"view": "all", "manage": "operations"}'::jsonb),
('front_desk', 'Front desk staff', '{"view": "assigned", "manage": "own_tasks"}'::jsonb),
('housekeeping', 'Housekeeping staff', '{"view": "assigned", "manage": "own_tasks"}'::jsonb),
('maintenance', 'Maintenance staff', '{"view": "assigned", "manage": "own_tasks"}'::jsonb),
('guest', 'Hotel guest', '{"view": "guest", "manage": "feedback"}'::jsonb);

-- Create departments table
CREATE TABLE departments (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT UNIQUE NOT NULL,
  description TEXT,
  manager_id UUID REFERENCES employees(id) ON DELETE SET NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Insert default departments
INSERT INTO departments (name, description) VALUES
('Front Desk', 'Guest check-in, check-out, and concierge services'),
('Housekeeping', 'Room cleaning and maintenance'),
('Maintenance', 'Building and equipment maintenance'),
('Food & Beverage', 'Restaurant and room service'),
('Management', 'Hotel administration and operations');

-- Create profiles table (extends Supabase auth.users)
CREATE TABLE profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT UNIQUE NOT NULL,
  full_name TEXT,
  role_id UUID REFERENCES roles(id) ON DELETE SET NULL,
  avatar_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create employees table
CREATE TABLE employees (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  profile_id UUID UNIQUE REFERENCES profiles(id) ON DELETE CASCADE,
  department_id UUID REFERENCES departments(id) ON DELETE SET NULL,
  employee_number TEXT UNIQUE NOT NULL,
  hire_date DATE NOT NULL,
  status TEXT DEFAULT 'active' CHECK (status IN ('active', 'inactive', 'on_leave', 'terminated')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create task_categories table
CREATE TABLE task_categories (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT UNIQUE NOT NULL,
  description TEXT,
  department_id UUID REFERENCES departments(id) ON DELETE SET NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Insert default task categories
INSERT INTO task_categories (name, description, department_id) VALUES
('Room Cleaning', 'Guest room cleaning and preparation', 
 (SELECT id FROM departments WHERE name = 'Housekeeping')),
('Guest Check-in', 'Guest registration and room assignment',
 (SELECT id FROM departments WHERE name = 'Front Desk')),
('Maintenance Request', 'Building and equipment repairs',
 (SELECT id FROM departments WHERE name = 'Maintenance')),
('Guest Service', 'Special guest requests and services',
 (SELECT id FROM departments WHERE name = 'Front Desk'));

-- Create tasks table
CREATE TABLE tasks (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
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

-- Create task_status_history table
CREATE TABLE task_status_history (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  task_id UUID NOT NULL REFERENCES tasks(id) ON DELETE CASCADE,
  status TEXT NOT NULL,
  changed_by UUID NOT NULL REFERENCES profiles(id) ON DELETE SET NULL,
  changed_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  notes TEXT
);

-- Create task_verifications table
CREATE TABLE task_verifications (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  task_id UUID NOT NULL REFERENCES tasks(id) ON DELETE CASCADE,
  verified_by UUID NOT NULL REFERENCES profiles(id) ON DELETE SET NULL,
  verified_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  notes TEXT,
  result TEXT NOT NULL CHECK (result IN ('approved', 'rejected', 'needs_revision'))
);

-- Create employee_ratings table
CREATE TABLE employee_ratings (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  employee_id UUID NOT NULL REFERENCES employees(id) ON DELETE CASCADE,
  rated_by UUID NOT NULL REFERENCES profiles(id) ON DELETE SET NULL,
  rating_period TEXT NOT NULL,
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

-- Create guest_feedback table
CREATE TABLE guest_feedback (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
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

-- Create activity_logs table
CREATE TABLE activity_logs (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES profiles(id) ON DELETE SET NULL,
  action TEXT NOT NULL,
  entity_type TEXT NOT NULL,
  entity_id UUID,
  details JSONB DEFAULT '{}',
  ip_address TEXT,
  user_agent TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for performance
CREATE INDEX idx_profiles_role ON profiles(role_id);
CREATE INDEX idx_profiles_email ON profiles(email);
CREATE INDEX idx_employees_profile ON employees(profile_id);
CREATE INDEX idx_employees_department ON employees(department_id);
CREATE INDEX idx_employees_status ON employees(status);
CREATE INDEX idx_tasks_assigned ON tasks(assigned_to);
CREATE INDEX idx_tasks_created_by ON tasks(created_by);
CREATE INDEX idx_tasks_status ON tasks(status);
CREATE INDEX idx_tasks_priority ON tasks(priority);
CREATE INDEX idx_tasks_category ON tasks(category_id);
CREATE INDEX idx_tasks_deadline ON tasks(deadline);
CREATE INDEX idx_task_history_task ON task_status_history(task_id);
CREATE INDEX idx_task_history_changed_by ON task_status_history(changed_by);
CREATE INDEX idx_task_verifications_task ON task_verifications(task_id);
CREATE INDEX idx_task_verifications_verified_by ON task_verifications(verified_by);
CREATE INDEX idx_ratings_employee ON employee_ratings(employee_id);
CREATE INDEX idx_ratings_rated_by ON employee_ratings(rated_by);
CREATE INDEX idx_ratings_period ON employee_ratings(rating_period);
CREATE INDEX idx_feedback_task ON guest_feedback(task_id);
CREATE INDEX idx_feedback_reviewed ON guest_feedback(reviewed);
CREATE INDEX idx_feedback_submitted ON guest_feedback(submitted_at);
CREATE INDEX idx_activity_user ON activity_logs(user_id);
CREATE INDEX idx_activity_entity ON activity_logs(entity_type, entity_id);
CREATE INDEX idx_activity_created ON activity_logs(created_at);
CREATE INDEX idx_activity_action ON activity_logs(action);

-- Create update_timestamp function
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Apply update_timestamp triggers
CREATE TRIGGER update_profiles_updated_at BEFORE UPDATE ON profiles
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_employees_updated_at BEFORE UPDATE ON employees
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_departments_updated_at BEFORE UPDATE ON departments
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_tasks_updated_at BEFORE UPDATE ON tasks
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_employee_ratings_updated_at BEFORE UPDATE ON employee_ratings
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Create task status transition validation function
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

-- Enable Row Level Security
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

-- Create RLS policies (basic ones - more detailed policies in separate migration)
CREATE POLICY "Service role can manage profiles" ON profiles FOR ALL TO service_role USING (true) WITH CHECK (true);
CREATE POLICY "Service role can manage roles" ON roles FOR ALL TO service_role USING (true) WITH CHECK (true);
CREATE POLICY "Service role can manage departments" ON departments FOR ALL TO service_role USING (true) WITH CHECK (true);
CREATE POLICY "Service role can manage employees" ON employees FOR ALL TO service_role USING (true) WITH CHECK (true);
CREATE POLICY "Service role can manage task_categories" ON task_categories FOR ALL TO service_role USING (true) WITH CHECK (true);
CREATE POLICY "Service role can manage tasks" ON tasks FOR ALL TO service_role USING (true) WITH CHECK (true);
CREATE POLICY "Service role can manage task_status_history" ON task_status_history FOR ALL TO service_role USING (true) WITH CHECK (true);
CREATE POLICY "Service role can manage task_verifications" ON task_verifications FOR ALL TO service_role USING (true) WITH CHECK (true);
CREATE POLICY "Service role can manage employee_ratings" ON employee_ratings FOR ALL TO service_role USING (true) WITH CHECK (true);
CREATE POLICY "Service role can manage guest_feedback" ON guest_feedback FOR ALL TO service_role USING (true) WITH CHECK (true);
CREATE POLICY "Service role can manage activity_logs" ON activity_logs FOR ALL TO service_role USING (true) WITH CHECK (true);