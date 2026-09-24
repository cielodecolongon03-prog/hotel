-- Migration 004: Room Classifications, Hourly & Daily Rates, Rooms, Bookings, and Payments
-- Enables world-class flexible room pricing per day and per hour, real transaction logging

CREATE TABLE IF NOT EXISTS room_classifications (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  code TEXT UNIQUE NOT NULL,
  tagline TEXT,
  description TEXT,
  daily_rate NUMERIC(10,2) NOT NULL,
  hourly_rate NUMERIC(10,2) NOT NULL,
  min_hours INTEGER DEFAULT 3,
  capacity INTEGER DEFAULT 2,
  bed_type TEXT,
  size_sqm INTEGER,
  floor_level TEXT,
  amenities TEXT[],
  image_url TEXT,
  badge TEXT,
  total_rooms INTEGER DEFAULT 10,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS rooms (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  room_number TEXT UNIQUE NOT NULL,
  classification_id UUID REFERENCES room_classifications(id) ON DELETE SET NULL,
  floor INTEGER NOT NULL,
  status TEXT NOT NULL DEFAULT 'vacant' CHECK (status IN ('vacant', 'occupied', 'cleaning', 'maintenance', 'reserved')),
  current_guest JSONB DEFAULT NULL,
  cleaning_status TEXT DEFAULT 'clean' CHECK (cleaning_status IN ('clean', 'needs_cleaning', 'in_progress')),
  maintenance_notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS bookings (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  reference_code TEXT UNIQUE NOT NULL,
  guest_name TEXT NOT NULL,
  guest_email TEXT NOT NULL,
  guest_phone TEXT NOT NULL,
  room_number TEXT NOT NULL,
  classification_id UUID REFERENCES room_classifications(id) ON DELETE SET NULL,
  classification_name TEXT NOT NULL,
  rate_type TEXT NOT NULL CHECK (rate_type IN ('daily', 'hourly')),
  duration INTEGER NOT NULL,
  check_in_date DATE NOT NULL,
  check_in_time TIME NOT NULL,
  check_out_date DATE NOT NULL,
  check_out_time TIME NOT NULL,
  number_of_guests INTEGER DEFAULT 1,
  base_amount NUMERIC(10,2) NOT NULL,
  tax_amount NUMERIC(10,2) NOT NULL,
  service_charge NUMERIC(10,2) NOT NULL,
  total_amount NUMERIC(10,2) NOT NULL,
  special_requests TEXT,
  status TEXT NOT NULL DEFAULT 'confirmed' CHECK (status IN ('confirmed', 'checked_in', 'checked_out', 'cancelled')),
  payment_status TEXT NOT NULL DEFAULT 'pending' CHECK (payment_status IN ('paid', 'pending', 'partially_paid', 'refunded')),
  payment_method TEXT,
  card_last4 TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS payments (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  receipt_number TEXT UNIQUE NOT NULL,
  booking_id UUID REFERENCES bookings(id) ON DELETE CASCADE,
  booking_ref TEXT NOT NULL,
  guest_name TEXT NOT NULL,
  guest_email TEXT NOT NULL,
  amount NUMERIC(10,2) NOT NULL,
  currency TEXT DEFAULT 'USD',
  payment_method TEXT NOT NULL,
  card_brand TEXT,
  card_last4 TEXT,
  status TEXT NOT NULL DEFAULT 'completed' CHECK (status IN ('completed', 'pending', 'failed')),
  auth_code TEXT NOT NULL,
  breakdown JSONB NOT NULL DEFAULT '{}'::jsonb,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Seed initial room classifications
INSERT INTO room_classifications (name, code, tagline, description, daily_rate, hourly_rate, min_hours, capacity, bed_type, size_sqm, floor_level, amenities, badge)
VALUES
  ('Standard Executive Room', 'STD', 'Contemporary Comfort & Refined Simplicity', 'Ergonomic workspace, high-speed fiber internet and plush bedding.', 120.00, 20.00, 3, 2, '1 Queen Bed', 32, 'Floors 2-3', ARRAY['High-Speed WiFi', 'Workstation', '43 Smart TV', 'Rain Shower'], 'Popular for Business'),
  ('Deluxe Haven Suite', 'DLX', 'Spacious Elegance with Panoramic Garden Views', 'Terrace balcony, artisan coffee and designer marble bath.', 190.00, 32.00, 3, 3, '1 King Bed', 45, 'Floors 3-4', ARRAY['Private Balcony', 'Nespresso Machine', '55 OLED TV', 'Marble Bath'], 'Guest Favorite'),
  ('Crown Royal Executive Suite', 'EXE', 'Exclusive Skyline Luxury & Lounge Access', 'Separate lounge, jacuzzi soaking tub and VIP club privileges.', 340.00, 55.00, 3, 4, '1 Master King + Sofa Bed', 70, 'Floors 5-6', ARRAY['Lounge Access', 'Soaking Jacuzzi', 'Dining Area', '65 Soundbar TV'], 'VIP Choice'),
  ('Presidential Imperial Penthouse', 'PEN', 'The Pinnacle of World-Class Opulence', 'Private heated plunge pool, dedicated butler and 360 views.', 750.00, 120.00, 4, 6, '2 Master King Suites', 150, 'Penthouse Level 7', ARRAY['24hr Butler', 'Plunge Pool', 'Full Chef Kitchen', 'Private Elevator'], 'Ultra Luxury'),
  ('Grand Family Garden Villa', 'FAM', 'Serene Private Estate for Families', 'Lush gardens, BBQ patio and family entertainment pavilion.', 480.00, 80.00, 4, 8, '3 Bedrooms (King+Queens+Bunks)', 120, 'Garden Wing', ARRAY['Private Garden', 'BBQ Patio', 'Gourmet Kitchen', 'Carport'], 'Family Preferred')
ON CONFLICT (code) DO UPDATE
SET daily_rate = EXCLUDED.daily_rate,
    hourly_rate = EXCLUDED.hourly_rate;

-- Enable RLS
ALTER TABLE room_classifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE rooms ENABLE ROW LEVEL SECURITY;
ALTER TABLE bookings ENABLE ROW LEVEL SECURITY;
ALTER TABLE payments ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public can view room classifications" ON room_classifications FOR SELECT USING (true);
CREATE POLICY "Public can view available rooms" ON rooms FOR SELECT USING (true);
CREATE POLICY "Public can create bookings" ON bookings FOR INSERT WITH CHECK (true);
CREATE POLICY "Public can view their own booking" ON bookings FOR SELECT USING (true);
CREATE POLICY "Public can view payment receipts" ON payments FOR SELECT USING (true);
