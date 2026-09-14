-- Seed Data for Development
-- This script creates test data for development purposes
-- DO NOT RUN IN PRODUCTION

-- Note: This script assumes you have already run the initial schema migration
-- You should create actual Supabase Auth users before running this
-- The profile IDs should match the Supabase auth user IDs

-- Create test profiles (replace with actual auth.user IDs from your Supabase project)
-- These UUIDs are placeholders - replace with actual Supabase user IDs

-- Manager profile
INSERT INTO profiles (id, email, full_name, role_id) VALUES
('00000000-0000-0000-0000-000000000001', 'manager@crownjewel.com', 'Sarah Johnson', 
 (SELECT id FROM roles WHERE name = 'hotel_manager'));

-- Front desk staff
INSERT INTO profiles (id, email, full_name, role_id) VALUES
('00000000-0000-0000-0000-000000000002', 'frontdesk1@crownjewel.com', 'Michael Chen', 
 (SELECT id FROM roles WHERE name = 'front_desk'));

-- Housekeeping staff
INSERT INTO profiles (id, email, full_name, role_id) VALUES
('00000000-0000-0000-0000-000000000003', 'housekeeping1@crownjewel.com', 'Maria Santos', 
 (SELECT id FROM roles WHERE name = 'housekeeping'));

-- Maintenance staff
INSERT INTO profiles (id, email, full_name, role_id) VALUES
('00000000-0000-0000-0000-000000000004', 'maintenance1@crownjewel.com', 'John Smith', 
 (SELECT id FROM roles WHERE name = 'maintenance'));

-- Hotel owner
INSERT INTO profiles (id, email, full_name, role_id) VALUES
('00000000-0000-0000-0000-000000000005', 'owner@crownjewel.com', 'Robert Williams', 
 (SELECT id FROM roles WHERE name = 'hotel_owner'));

-- System administrator
INSERT INTO profiles (id, email, full_name, role_id) VALUES
('00000000-0000-0000-0000-000000000006', 'admin@crownjewel.com', 'Ava Cruz',
 (SELECT id FROM roles WHERE name = 'admin'));

-- Create employees
INSERT INTO employees (profile_id, department_id, employee_number, hire_date, status) VALUES
-- Manager (also an employee)
('00000000-0000-0000-0000-000000000001', 
 (SELECT id FROM departments WHERE name = 'Management'), 
 'EMP001', '2020-01-15', 'active'),

-- Front desk staff
('00000000-0000-0000-0000-000000000002', 
 (SELECT id FROM departments WHERE name = 'Front Desk'), 
 'EMP002', '2021-03-20', 'active'),

-- Housekeeping staff
('00000000-0000-0000-0000-000000000003', 
 (SELECT id FROM departments WHERE name = 'Housekeeping'), 
 'EMP003', '2021-06-10', 'active'),

-- Maintenance staff
('00000000-0000-0000-0000-000000000004', 
 (SELECT id FROM departments WHERE name = 'Maintenance'), 
 'EMP004', '2022-02-01', 'active');

-- Create sample tasks
INSERT INTO tasks (title, description, category_id, assigned_to, created_by, priority, status, deadline) VALUES
-- Front desk tasks
('Check-in Room 101', 'Welcome guests and complete check-in process for Room 101', 
 (SELECT id FROM task_categories WHERE name = 'Guest Check-in'),
 (SELECT id FROM employees WHERE employee_number = 'EMP002'),
 (SELECT id FROM profiles WHERE email = 'manager@crownjewel.com'),
 'high', 'in_progress', NOW() + INTERVAL '1 hour'),

('Check-out Room 205', 'Process check-out for Room 205 guests', 
 (SELECT id FROM task_categories WHERE name = 'Guest Check-in'),
 (SELECT id FROM employees WHERE employee_number = 'EMP002'),
 (SELECT id FROM profiles WHERE email = 'manager@crownjewel.com'),
 'medium', 'pending', NOW() + INTERVAL '3 hours'),

-- Housekeeping tasks
('Clean Room 101', 'Complete cleaning of Room 101 after guest checkout', 
 (SELECT id FROM task_categories WHERE name = 'Room Cleaning'),
 (SELECT id FROM employees WHERE employee_number = 'EMP003'),
 (SELECT id FROM profiles WHERE email = 'manager@crownjewel.com'),
 'urgent', 'pending', NOW() + INTERVAL '2 hours'),

('Clean Room 102', 'Daily cleaning for Room 102', 
 (SELECT id FROM task_categories WHERE name = 'Room Cleaning'),
 (SELECT id FROM employees WHERE employee_number = 'EMP003'),
 (SELECT id FROM profiles WHERE email = 'manager@crownjewel.com'),
 'medium', 'completed', NOW() - INTERVAL '1 hour'),

('Restock amenities Room 103', 'Restock toiletries and amenities in Room 103', 
 (SELECT id FROM task_categories WHERE name = 'Room Cleaning'),
 (SELECT id FROM employees WHERE employee_number = 'EMP003'),
 (SELECT id FROM profiles WHERE email = 'manager@crownjewel.com'),
 'low', 'pending', NOW() + INTERVAL '5 hours'),

-- Maintenance tasks
('Fix AC in Room 201', 'Air conditioning not working properly in Room 201', 
 (SELECT id FROM task_categories WHERE name = 'Maintenance Request'),
 (SELECT id FROM employees WHERE employee_number = 'EMP004'),
 (SELECT id FROM profiles WHERE email = 'manager@crownjewel.com'),
 'urgent', 'in_progress', NOW() + INTERVAL '2 hours'),

('Repair lobby light', 'Replace broken light fixture in hotel lobby', 
 (SELECT id FROM task_categories WHERE name = 'Maintenance Request'),
 (SELECT id FROM employees WHERE employee_number = 'EMP004'),
 (SELECT id FROM profiles WHERE email = 'manager@crownjewel.com'),
 'medium', 'pending', NOW() + INTERVAL '1 day'),

-- Guest service tasks
('Special request Room 305', 'Guest requested extra pillows and blankets', 
 (SELECT id FROM task_categories WHERE name = 'Guest Service'),
 (SELECT id FROM employees WHERE employee_number = 'EMP002'),
 (SELECT id FROM profiles WHERE email = 'manager@crownjewel.com'),
 'high', 'pending', NOW() + INTERVAL '30 minutes');

-- Update some tasks with completion/verification data
UPDATE tasks 
SET started_at = NOW() - INTERVAL '2 hours',
    completed_at = NOW() - INTERVAL '1 hour',
    completion_notes = 'Room cleaned thoroughly, all amenities restocked'
WHERE id = (SELECT id FROM tasks WHERE title = 'Clean Room 102' LIMIT 1);

-- Create task status history
INSERT INTO task_status_history (task_id, status, changed_by, notes)
SELECT id, 'pending', created_by, 'Task created' FROM tasks;

INSERT INTO task_status_history (task_id, status, changed_by, notes)
SELECT id, 'in_progress', assigned_to, 'Started working on task' 
FROM tasks 
WHERE status = 'in_progress';

INSERT INTO task_status_history (task_id, status, changed_by, notes)
SELECT id, 'completed', assigned_to, 'Task completed' 
FROM tasks 
WHERE status = 'completed';

-- Create employee ratings
INSERT INTO employee_ratings (employee_id, rated_by, rating_period, punctuality, task_completion, quality_of_work, customer_feedback, overall_rating, notes)
VALUES
((SELECT id FROM employees WHERE employee_number = 'EMP002'),
 (SELECT id FROM profiles WHERE email = 'manager@crownjewel.com'),
 '2024-01', 5, 4, 5, 4, 4.5, 'Excellent performance this month'),

((SELECT id FROM employees WHERE employee_number = 'EMP003'),
 (SELECT id FROM profiles WHERE email = 'manager@crownjewel.com'),
 '2024-01', 5, 5, 5, 5, 5.0, 'Outstanding work, consistently exceeds expectations'),

((SELECT id FROM employees WHERE employee_number = 'EMP004'),
 (SELECT id FROM profiles WHERE email = 'manager@crownjewel.com'),
 '2024-01', 4, 4, 4, 3, 3.75, 'Good performance, room for improvement in customer interaction');

-- Create guest feedback
INSERT INTO guest_feedback (task_id, guest_name, rating, feedback, category, submitted_at)
VALUES
((SELECT id FROM tasks WHERE title = 'Clean Room 102' LIMIT 1),
 'Guest Johnson', 5, 'Room was spotless, very impressed with the cleanliness', 'cleanliness', NOW() - INTERVAL '2 hours'),

((SELECT id FROM tasks WHERE title = 'Check-in Room 101' LIMIT 1),
 'Guest Smith', 4, 'Smooth check-in process, friendly staff', 'service', NOW() - INTERVAL '1 hour'),

((SELECT id FROM tasks WHERE title = 'Special request Room 305' LIMIT 1),
 'Guest Davis', 5, 'Quick response to our request, excellent service', 'service', NOW() - INTERVAL '30 minutes');

-- Create activity logs
INSERT INTO activity_logs (user_id, action, entity_type, entity_id, details)
VALUES
((SELECT id FROM profiles WHERE email = 'manager@crownjewel.com'),
 'task_created', 'task', 
 (SELECT id FROM tasks WHERE title = 'Clean Room 101' LIMIT 1),
 '{"task_title": "Clean Room 101", "assigned_to": "EMP003"}'::jsonb),

((SELECT id FROM profiles WHERE email = 'manager@crownjewel.com'),
 'task_assigned', 'task',
 (SELECT id FROM tasks WHERE title = 'Fix AC in Room 201' LIMIT 1),
 '{"task_title": "Fix AC in Room 201", "assigned_to": "EMP004"}'::jsonb),

((SELECT id FROM profiles WHERE email = 'frontdesk1@crownjewel.com'),
 'task_status_updated', 'task',
 (SELECT id FROM tasks WHERE title = 'Check-in Room 101' LIMIT 1),
 '{"task_title": "Check-in Room 101", "old_status": "pending", "new_status": "in_progress"}'::jsonb),

((SELECT id FROM profiles WHERE email = 'housekeeping1@crownjewel.com'),
 'task_completed', 'task',
 (SELECT id FROM tasks WHERE title = 'Clean Room 102' LIMIT 1),
 '{"task_title": "Clean Room 102", "completion_notes": "Room cleaned thoroughly"}'::jsonb),

((SELECT id FROM profiles WHERE email = 'manager@crownjewel.com'),
 'rating_created', 'employee_rating',
 (SELECT id FROM employee_ratings WHERE employee_id = (SELECT id FROM employees WHERE employee_number = 'EMP003') LIMIT 1),
 '{"employee": "Maria Santos", "rating_period": "2024-01", "overall_rating": 5.0}'::jsonb);

-- Note: To use this seed data:
-- 1. Create actual users in Supabase Auth
-- 2. Replace the placeholder UUIDs with actual auth.user IDs
-- 3. Run this script in Supabase SQL Editor
-- 4. The seed data will be available for development/testing