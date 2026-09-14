-- Admin role, guest room context, service requests, and staff notifications

INSERT INTO roles (name, description, permissions)
SELECT
  'admin',
  'System administrator with full operational control',
  '{"view": "all", "manage": "all"}'::jsonb
WHERE NOT EXISTS (SELECT 1 FROM roles WHERE name = 'admin');

ALTER TABLE profiles
  ADD COLUMN IF NOT EXISTS room_number TEXT;

CREATE TABLE IF NOT EXISTS service_requests (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  guest_id UUID REFERENCES profiles(id) ON DELETE SET NULL,
  guest_name TEXT NOT NULL,
  room_number TEXT NOT NULL,
  request_type TEXT NOT NULL DEFAULT 'room_cleaning'
    CHECK (request_type IN ('room_cleaning', 'towels', 'amenities', 'other')),
  notes TEXT,
  status TEXT NOT NULL DEFAULT 'pending'
    CHECK (status IN ('pending', 'acknowledged', 'in_progress', 'completed', 'cancelled')),
  assigned_to UUID REFERENCES employees(id) ON DELETE SET NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS notifications (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  type TEXT NOT NULL DEFAULT 'general',
  title TEXT NOT NULL,
  message TEXT NOT NULL,
  room_number TEXT,
  guest_name TEXT,
  guest_id UUID REFERENCES profiles(id) ON DELETE SET NULL,
  service_request_id UUID REFERENCES service_requests(id) ON DELETE CASCADE,
  target_roles TEXT[] NOT NULL DEFAULT ARRAY['housekeeping', 'admin', 'hotel_manager', 'front_desk', 'hotel_owner'],
  status TEXT NOT NULL DEFAULT 'unread' CHECK (status IN ('unread', 'read', 'archived')),
  metadata JSONB DEFAULT '{}'::jsonb,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_service_requests_status ON service_requests(status);
CREATE INDEX IF NOT EXISTS idx_service_requests_guest ON service_requests(guest_id);
CREATE INDEX IF NOT EXISTS idx_service_requests_created ON service_requests(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_notifications_created ON notifications(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_notifications_status ON notifications(status);
CREATE INDEX IF NOT EXISTS idx_notifications_type ON notifications(type);

DROP TRIGGER IF EXISTS update_service_requests_updated_at ON service_requests;
CREATE TRIGGER update_service_requests_updated_at
  BEFORE UPDATE ON service_requests
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

ALTER TABLE service_requests ENABLE ROW LEVEL SECURITY;
ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Authenticated can view service requests" ON service_requests;
CREATE POLICY "Authenticated can view service requests"
  ON service_requests FOR SELECT TO authenticated USING (true);

DROP POLICY IF EXISTS "Guests can create service requests" ON service_requests;
CREATE POLICY "Guests can create service requests"
  ON service_requests FOR INSERT TO authenticated WITH CHECK (true);

DROP POLICY IF EXISTS "Staff can update service requests" ON service_requests;
CREATE POLICY "Staff can update service requests"
  ON service_requests FOR UPDATE TO authenticated USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "Authenticated can view notifications" ON notifications;
CREATE POLICY "Authenticated can view notifications"
  ON notifications FOR SELECT TO authenticated USING (true);

DROP POLICY IF EXISTS "Authenticated can create notifications" ON notifications;
CREATE POLICY "Authenticated can create notifications"
  ON notifications FOR INSERT TO authenticated WITH CHECK (true);

DROP POLICY IF EXISTS "Authenticated can update notifications" ON notifications;
CREATE POLICY "Authenticated can update notifications"
  ON notifications FOR UPDATE TO authenticated USING (true) WITH CHECK (true);

CREATE POLICY "Service role can manage service_requests" ON service_requests
  FOR ALL TO service_role USING (true) WITH CHECK (true);

CREATE POLICY "Service role can manage notifications" ON notifications
  FOR ALL TO service_role USING (true) WITH CHECK (true);

-- Include admin in existing manager-level policies
DROP POLICY IF EXISTS "Managers can view all profiles" ON profiles;
CREATE POLICY "Managers can view all profiles"
  ON profiles FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM profiles p
      WHERE p.id = auth.uid()
      AND p.role_id IN (
        SELECT id FROM roles WHERE name IN ('hotel_owner', 'hotel_manager', 'admin')
      )
    )
  );

DROP POLICY IF EXISTS "Managers can view all tasks" ON tasks;
CREATE POLICY "Managers can view all tasks"
  ON tasks FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid()
      AND profiles.role_id IN (
        SELECT id FROM roles WHERE name IN ('hotel_owner', 'hotel_manager', 'admin')
      )
    )
  );

DROP POLICY IF EXISTS "Managers can create tasks" ON tasks;
CREATE POLICY "Managers can create tasks"
  ON tasks FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid()
      AND profiles.role_id IN (
        SELECT id FROM roles WHERE name IN ('hotel_manager', 'admin')
      )
    )
  );

DROP POLICY IF EXISTS "Managers can update all tasks" ON tasks;
CREATE POLICY "Managers can update all tasks"
  ON tasks FOR UPDATE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid()
      AND profiles.role_id IN (
        SELECT id FROM roles WHERE name IN ('hotel_manager', 'admin')
      )
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid()
      AND profiles.role_id IN (
        SELECT id FROM roles WHERE name IN ('hotel_manager', 'admin')
      )
    )
  );
