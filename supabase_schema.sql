-- Gallery Table
CREATE TABLE gallery (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
    url TEXT NOT NULL,
    type TEXT NOT NULL DEFAULT 'image', -- 'image' or 'video'
    description TEXT,
    caption TEXT,
    caption_id UUID -- To group multiple uploads under one caption/session
);

-- Feed Table
CREATE TABLE feed (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
    image_url TEXT,
    description TEXT,
    youtube_link TEXT,
    article_link TEXT,
    content TEXT
);

-- Blogs Table
CREATE TABLE blogs (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
    title TEXT NOT NULL,
    description TEXT,
    content TEXT,
    photo_url TEXT
);

-- Ask Doctor Table
CREATE TABLE ask_doctor (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
    question TEXT NOT NULL,
    name TEXT,
    email TEXT,
    phone TEXT,
    status TEXT DEFAULT 'pending', -- 'pending', 'answered', 'archived'
    admin_notes TEXT
);

-- Doctors Table
CREATE TABLE doctors (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
    name TEXT NOT NULL,
    qualification TEXT,
    caption TEXT,
    description TEXT,
    photo_url TEXT,
    available_days TEXT[], -- Array of days like ['Monday', 'Tuesday', 'Wednesday']
    availability_note TEXT, -- Custom note like 'except 2nd Wednesdays onwards'
    time_start TEXT, -- Format: 'HH:MM' like '09:00'
    time_end TEXT, -- Format: 'HH:MM' like '17:00'
    additional_locations JSONB DEFAULT '[]'::jsonb, -- Array of {label, description} objects
    rank INTEGER DEFAULT 999 -- Display order: lower numbers appear first
);

-- Appointments Table
CREATE TABLE appointments (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
    doctor_id UUID REFERENCES doctors(id) ON DELETE CASCADE,
    doctor_name TEXT NOT NULL,
    appointment_date DATE NOT NULL,
    time_slot TEXT NOT NULL, -- Format: 'HH:MM - HH:MM' like '09:00 - 10:00'
    patient_name TEXT NOT NULL,
    patient_phone TEXT NOT NULL,
    status TEXT DEFAULT 'pending', -- 'pending', 'confirmed', 'cancelled'
    admin_notes TEXT
);

-- Enable Row Level Security (RLS)
ALTER TABLE gallery ENABLE ROW LEVEL SECURITY;
ALTER TABLE feed ENABLE ROW LEVEL SECURITY;
ALTER TABLE blogs ENABLE ROW LEVEL SECURITY;
ALTER TABLE ask_doctor ENABLE ROW LEVEL SECURITY;
ALTER TABLE doctors ENABLE ROW LEVEL SECURITY;
ALTER TABLE appointments ENABLE ROW LEVEL SECURITY;

-- Create policies (Public Read, Admin Write)
-- Note: Admin write requires authentication, which we'll handle via Supabase Auth

-- Public Access (Select)
CREATE POLICY "Public Read Gallery" ON gallery FOR SELECT USING (true);
CREATE POLICY "Public Read Feed" ON feed FOR SELECT USING (true);
CREATE POLICY "Public Read Blogs" ON blogs FOR SELECT USING (true);
CREATE POLICY "Public Read Doctors" ON doctors FOR SELECT USING (true);

-- Public Insert for Ask Doctor (anyone can submit)
CREATE POLICY "Public Insert Ask Doctor" ON ask_doctor FOR INSERT 
    TO anon
    WITH CHECK (true);

-- Public Insert for Appointments (anyone can book)
CREATE POLICY "Public Insert Appointments" ON appointments FOR INSERT 
    TO anon, authenticated
    WITH CHECK (true);

-- Admin Access (All actions for authenticated users)
CREATE POLICY "Admin CRUD Gallery" ON gallery FOR ALL 
    USING (auth.role() = 'authenticated') 
    WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Admin CRUD Feed" ON feed FOR ALL 
    USING (auth.role() = 'authenticated') 
    WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Admin CRUD Blogs" ON blogs FOR ALL 
    USING (auth.role() = 'authenticated') 
    WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Admin CRUD Ask Doctor" ON ask_doctor FOR ALL 
    USING (auth.role() = 'authenticated') 
    WITH CHECK (auth.role() = 'authenticated');

-- Doctors policies (separate for each operation)
CREATE POLICY "Admin Insert Doctors" ON doctors 
    FOR INSERT 
    TO authenticated
    WITH CHECK (true);

CREATE POLICY "Admin Update Doctors" ON doctors 
    FOR UPDATE 
    TO authenticated
    USING (true)
    WITH CHECK (true);

CREATE POLICY "Admin Delete Doctors" ON doctors 
    FOR DELETE 
    TO authenticated
    USING (true);

-- Appointments policies (admin can view, update, delete)
CREATE POLICY "Admin Select Appointments" ON appointments 
    FOR SELECT 
    TO authenticated
    USING (true);

CREATE POLICY "Admin Update Appointments" ON appointments 
    FOR UPDATE 
    TO authenticated
    USING (true)
    WITH CHECK (true);

CREATE POLICY "Admin Delete Appointments" ON appointments 
    FOR DELETE 
    TO authenticated
    USING (true);

-- ============================================================
-- STORAGE RLS POLICIES (Run these in SQL Editor)
-- ============================================================

-- Ensure the 'media' bucket exists
-- INSERT INTO storage.buckets (id, name, public) VALUES ('media', 'media', true) 
-- ON CONFLICT (id) DO NOTHING;

-- Allow public to read/download from the media bucket
CREATE POLICY "Public Read Media" ON storage.objects FOR SELECT 
    USING (bucket_id = 'media');

-- Allow authenticated users to upload to the media bucket
CREATE POLICY "Admin Upload Media" ON storage.objects FOR INSERT 
    WITH CHECK (bucket_id = 'media' AND auth.role() = 'authenticated');

-- Allow authenticated users to update/delete their own uploads (or all in this simple case)
CREATE POLICY "Admin Update Media" ON storage.objects FOR UPDATE 
    USING (bucket_id = 'media' AND auth.role() = 'authenticated');

CREATE POLICY "Admin Delete Media" ON storage.objects FOR DELETE 
    USING (bucket_id = 'media' AND auth.role() = 'authenticated');

-- ============================================================
-- POSTGRESQL FUNCTIONS (to bypass CORS issues with PATCH)
-- ============================================================

-- Function to update appointment status
CREATE OR REPLACE FUNCTION update_appointment_status(
    appointment_id uuid,
    new_status text
)
RETURNS json
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
    updated_row appointments%ROWTYPE;
BEGIN
    IF auth.role() != 'authenticated' THEN
        RAISE EXCEPTION 'Not authorized';
    END IF;

    UPDATE appointments
    SET status = new_status
    WHERE id = appointment_id
    RETURNING * INTO updated_row;

    IF NOT FOUND THEN
        RAISE EXCEPTION 'Appointment not found';
    END IF;

    RETURN row_to_json(updated_row);
END;
$$;

-- Function to update gallery items
CREATE OR REPLACE FUNCTION update_gallery_item(
    item_id uuid,
    new_description text DEFAULT NULL,
    new_caption text DEFAULT NULL
)
RETURNS json
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
    updated_row gallery%ROWTYPE;
BEGIN
    IF auth.role() != 'authenticated' THEN
        RAISE EXCEPTION 'Not authorized';
    END IF;

    UPDATE gallery
    SET 
        description = COALESCE(new_description, description),
        caption = COALESCE(new_caption, caption)
    WHERE id = item_id
    RETURNING * INTO updated_row;

    IF NOT FOUND THEN
        RAISE EXCEPTION 'Gallery item not found';
    END IF;

    RETURN row_to_json(updated_row);
END;
$$;

-- Function to update feed items
CREATE OR REPLACE FUNCTION update_feed_item(
    item_id uuid,
    new_description text DEFAULT NULL,
    new_youtube_link text DEFAULT NULL,
    new_article_link text DEFAULT NULL,
    new_content text DEFAULT NULL
)
RETURNS json
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
    updated_row feed%ROWTYPE;
BEGIN
    IF auth.role() != 'authenticated' THEN
        RAISE EXCEPTION 'Not authorized';
    END IF;

    UPDATE feed
    SET 
        description = COALESCE(new_description, description),
        youtube_link = new_youtube_link,
        article_link = new_article_link,
        content = COALESCE(new_content, content)
    WHERE id = item_id
    RETURNING * INTO updated_row;

    IF NOT FOUND THEN
        RAISE EXCEPTION 'Feed item not found';
    END IF;

    RETURN row_to_json(updated_row);
END;
$$;

-- Function to update blog items
CREATE OR REPLACE FUNCTION update_blog_item(
    item_id uuid,
    new_title text DEFAULT NULL,
    new_description text DEFAULT NULL,
    new_content text DEFAULT NULL
)
RETURNS json
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
    updated_row blogs%ROWTYPE;
BEGIN
    IF auth.role() != 'authenticated' THEN
        RAISE EXCEPTION 'Not authorized';
    END IF;

    UPDATE blogs
    SET 
        title = COALESCE(new_title, title),
        description = new_description,
        content = new_content
    WHERE id = item_id
    RETURNING * INTO updated_row;

    IF NOT FOUND THEN
        RAISE EXCEPTION 'Blog item not found';
    END IF;

    RETURN row_to_json(updated_row);
END;
$$;

-- Function to update doctor details
CREATE OR REPLACE FUNCTION update_doctor(
    doctor_id uuid,
    new_name text DEFAULT NULL,
    new_qualification text DEFAULT NULL,
    new_caption text DEFAULT NULL,
    new_description text DEFAULT NULL,
    new_photo_url text DEFAULT NULL,
    new_available_days text[] DEFAULT NULL,
    new_availability_note text DEFAULT NULL,
    new_time_start text DEFAULT NULL,
    new_time_end text DEFAULT NULL,
    new_additional_locations jsonb DEFAULT NULL,
    new_rank integer DEFAULT NULL
)
RETURNS json
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
    updated_row doctors%ROWTYPE;
BEGIN
    IF auth.role() != 'authenticated' THEN
        RAISE EXCEPTION 'Not authorized';
    END IF;

    UPDATE doctors
    SET 
        name = COALESCE(new_name, name),
        qualification = COALESCE(new_qualification, qualification),
        caption = COALESCE(new_caption, caption),
        description = COALESCE(new_description, description),
        photo_url = COALESCE(new_photo_url, photo_url),
        available_days = COALESCE(new_available_days, available_days),
        availability_note = COALESCE(new_availability_note, availability_note),
        time_start = COALESCE(new_time_start, time_start),
        time_end = COALESCE(new_time_end, time_end),
        additional_locations = COALESCE(new_additional_locations, additional_locations),
        rank = COALESCE(new_rank, rank)
    WHERE id = doctor_id
    RETURNING * INTO updated_row;

    IF NOT FOUND THEN
        RAISE EXCEPTION 'Doctor not found';
    END IF;

    RETURN row_to_json(updated_row);
END;
$$;

-- Function to update ask_doctor status and notes
CREATE OR REPLACE FUNCTION update_ask_doctor_entry(
    entry_id uuid,
    new_status text DEFAULT NULL,
    new_admin_notes text DEFAULT NULL
)
RETURNS json
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
    updated_row ask_doctor%ROWTYPE;
BEGIN
    IF auth.role() != 'authenticated' THEN
        RAISE EXCEPTION 'Not authorized';
    END IF;

    UPDATE ask_doctor
    SET 
        status = COALESCE(new_status, status),
        admin_notes = new_admin_notes
    WHERE id = entry_id
    RETURNING * INTO updated_row;

    IF NOT FOUND THEN
        RAISE EXCEPTION 'Ask doctor entry not found';
    END IF;

    RETURN row_to_json(updated_row);
END;
$$;

-- ============================================================
-- USER ROLES SYSTEM (Optional)
-- ============================================================

-- Create user_roles table for role-based access control
CREATE TABLE IF NOT EXISTS user_roles (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE,
    role text NOT NULL CHECK (role IN ('admin', 'appointments_only', 'viewer')),
    created_at timestamptz DEFAULT now(),
    UNIQUE(user_id)
);

-- Enable RLS
ALTER TABLE user_roles ENABLE ROW LEVEL SECURITY;

-- Only authenticated users can read their own role
CREATE POLICY "Users can read own role" ON user_roles
    FOR SELECT
    TO authenticated
    USING (auth.uid() = user_id);

-- Function to get current user's role
CREATE OR REPLACE FUNCTION get_user_role()
RETURNS text
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
    user_role text;
BEGIN
    -- First try to get from user_roles table
    SELECT role INTO user_role
    FROM user_roles
    WHERE user_id = auth.uid();
    
    -- If not found in table, check auth metadata
    IF user_role IS NULL THEN
        SELECT raw_user_meta_data->>'role' INTO user_role
        FROM auth.users
        WHERE id = auth.uid();
    END IF;
    
    -- Default to 'admin' if no role is set (for backward compatibility)
    RETURN COALESCE(user_role, 'admin');
END;
$$;

-- ============================================================
-- INSTRUCTIONS FOR SETTING UP ROLES
-- ============================================================

-- Method 1: Using user metadata (simpler - set in Supabase Dashboard):
-- Go to Authentication > Users > Select User > Edit User > 
-- Add to raw_user_meta_data: {"role": "appointments_only"}

-- Method 2: Using SQL to set metadata:
-- UPDATE auth.users 
-- SET raw_user_meta_data = raw_user_meta_data || '{"role": "appointments_only"}'::jsonb
-- WHERE email = 'receptionist@example.com';

-- Method 3: Using user_roles table:
-- INSERT INTO user_roles (user_id, role)
-- VALUES ('USER_UUID_HERE', 'appointments_only')
-- ON CONFLICT (user_id) DO UPDATE SET role = EXCLUDED.role;
