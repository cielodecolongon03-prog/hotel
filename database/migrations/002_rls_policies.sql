-- Row Level Security Policies Migration
-- This migration creates detailed RLS policies for all tables

-- Profiles RLS Policies
DROP POLICY IF EXISTS "Users can view own profile" ON profiles;
DROP POLICY IF EXISTS "Managers can view all profiles" ON profiles;
DROP POLICY IF EXISTS "Users can update own profile" ON profiles;

CREATE POLICY "Users can view own profile"
  ON profiles FOR SELECT
  TO authenticated
  USING (id = auth.uid());

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

CREATE POLICY "Users can update own profile"
  ON profiles FOR UPDATE
  TO authenticated
  USING (id = auth.uid())
  WITH CHECK (id = auth.uid());

-- Tasks RLS Policies
DROP POLICY IF EXISTS "Managers can view all tasks" ON tasks;
DROP POLICY IF EXISTS "Employees can view assigned tasks" ON tasks;
DROP POLICY IF EXISTS "Managers can create tasks" ON tasks;
DROP POLICY IF EXISTS "Employees can update own tasks" ON tasks;
DROP POLICY IF EXISTS "Managers can update all tasks" ON tasks;

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

CREATE POLICY "Employees can view assigned tasks"
  ON tasks FOR SELECT
  TO authenticated
  USING (
    assigned_to IN (
      SELECT id FROM employees WHERE profile_id = auth.uid()
    )
  );

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

-- Employee Ratings RLS Policies
DROP POLICY IF EXISTS "Managers can view all ratings" ON employee_ratings;
DROP POLICY IF EXISTS "Employees can view own ratings" ON employee_ratings;
DROP POLICY IF EXISTS "Managers can create ratings" ON employee_ratings;
DROP POLICY IF EXISTS "Managers can update ratings" ON employee_ratings;

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

CREATE POLICY "Employees can view own ratings"
  ON employee_ratings FOR SELECT
  TO authenticated
  USING (
    employee_id IN (
      SELECT id FROM employees WHERE profile_id = auth.uid()
    )
  );

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

-- Guest Feedback RLS Policies
DROP POLICY IF EXISTS "Anyone can submit feedback" ON guest_feedback;
DROP POLICY IF EXISTS "Managers can view all feedback" ON guest_feedback;
DROP POLICY IF EXISTS "Managers can update feedback" ON guest_feedback;

CREATE POLICY "Anyone can submit feedback"
  ON guest_feedback FOR INSERT
  TO authenticated
  WITH CHECK (true);

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

-- Activity Logs RLS Policies
DROP POLICY IF EXISTS "Users can view own activity logs" ON activity_logs;
DROP POLICY IF EXISTS "Managers can view all activity logs" ON activity_logs;
DROP POLICY IF EXISTS "Service role can insert activity logs" ON activity_logs;

CREATE POLICY "Users can view own activity logs"
  ON activity_logs FOR SELECT
  TO authenticated
  USING (user_id = auth.uid());

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

CREATE POLICY "Service role can insert activity logs"
  ON activity_logs FOR INSERT
  TO service_role
  WITH CHECK (true);

-- Employees RLS Policies
DROP POLICY IF EXISTS "Managers can view all employees" ON employees;
DROP POLICY IF EXISTS "Employees can view own employee record" ON employees;

CREATE POLICY "Managers can view all employees"
  ON employees FOR SELECT
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

CREATE POLICY "Employees can view own employee record"
  ON employees FOR SELECT
  TO authenticated
  USING (profile_id = auth.uid());

-- Departments RLS Policies
DROP POLICY IF EXISTS "Authenticated users can view departments" ON departments;

CREATE POLICY "Authenticated users can view departments"
  ON departments FOR SELECT
  TO authenticated
  USING (true);

-- Task Categories RLS Policies
DROP POLICY IF EXISTS "Authenticated users can view categories" ON task_categories;

CREATE POLICY "Authenticated users can view categories"
  ON task_categories FOR SELECT
  TO authenticated
  USING (true);

-- Roles RLS Policies
DROP POLICY IF EXISTS "Authenticated users can view roles" ON roles;

CREATE POLICY "Authenticated users can view roles"
  ON roles FOR SELECT
  TO authenticated
  USING (true);

-- Task Status History RLS Policies
DROP POLICY IF EXISTS "Users can view history for accessible tasks" ON task_status_history;

CREATE POLICY "Users can view history for accessible tasks"
  ON task_status_history FOR SELECT
  TO authenticated
  USING (
    -- Managers can see all history
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid()
      AND profiles.role_id IN (
        SELECT id FROM roles WHERE name IN ('hotel_owner', 'hotel_manager')
      )
    )
    OR
    -- Employees can see history for their assigned tasks
    EXISTS (
      SELECT 1 FROM tasks
      WHERE tasks.id = task_status_history.task_id
      AND tasks.assigned_to IN (
        SELECT id FROM employees WHERE profile_id = auth.uid()
      )
    )
  );

-- Task Verifications RLS Policies
DROP POLICY IF EXISTS "Users can view verifications for accessible tasks" ON task_verifications;

CREATE POLICY "Users can view verifications for accessible tasks"
  ON task_verifications FOR SELECT
  TO authenticated
  USING (
    -- Managers can see all verifications
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid()
      AND profiles.role_id IN (
        SELECT id FROM roles WHERE name IN ('hotel_owner', 'hotel_manager')
      )
    )
    OR
    -- Employees can see verifications for their assigned tasks
    EXISTS (
      SELECT 1 FROM tasks
      WHERE tasks.id = task_verifications.task_id
      AND tasks.assigned_to IN (
        SELECT id FROM employees WHERE profile_id = auth.uid()
      )
    )
  );