-- ============================================================
-- USER ROLES SETUP
-- Add role-based access control for admin users
-- ============================================================

-- Option 1: Using Supabase Auth User Metadata (Recommended for simplicity)
-- Set role for users through Supabase Dashboard or this SQL:

-- To set an admin with full access:
-- UPDATE auth.users 
-- SET raw_user_meta_data = raw_user_meta_data || '{"role": "admin"}'::jsonb
-- WHERE email = 'admin@example.com';

-- To set a user with only appointments access:
-- UPDATE auth.users 
-- SET raw_user_meta_data = raw_user_meta_data || '{"role": "appointments_only"}'::jsonb
-- WHERE email = 'receptionist@example.com';

-- Option 2: Create a user_roles table (More flexible but needs more setup)
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

-- Only admins can manage roles (you'll need to manually set the first admin)
CREATE POLICY "Admins can manage roles" ON user_roles
    FOR ALL
    TO authenticated
    USING (
        EXISTS (
            SELECT 1 FROM user_roles 
            WHERE user_id = auth.uid() AND role = 'admin'
        )
    );

-- Function to get current user's role (checks both metadata and table)
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

-- Update RPC functions to respect roles (optional - for extra security)
-- Example: Restrict certain operations to admin role only

-- Allow appointments_only users to update appointment status
-- (already works - no change needed)

-- Restrict doctor/blog/feed updates to admin role only
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
    user_role text;
BEGIN
    IF auth.role() != 'authenticated' THEN
        RAISE EXCEPTION 'Not authorized';
    END IF;
    
    -- Check if user has admin role
    user_role := get_user_role();
    IF user_role != 'admin' THEN
        RAISE EXCEPTION 'Only admins can update doctors';
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

-- Example: Insert a test user role (after creating the user in Supabase Auth)
-- INSERT INTO user_roles (user_id, role)
-- VALUES ('USER_UUID_HERE', 'appointments_only');

-- To check roles:
-- SELECT u.email, ur.role 
-- FROM auth.users u 
-- LEFT JOIN user_roles ur ON u.id = ur.user_id;

-- ============================================================
-- QUICK REFERENCE: Common SQL Commands
-- ============================================================

-- 1. Set a user as APPOINTMENTS_ONLY (using SQL Editor in Supabase Dashboard)
-- UPDATE auth.users 
-- SET raw_user_meta_data = raw_user_meta_data || '{"role": "appointments_only"}'::jsonb
-- WHERE email = 'receptionist@example.com';

-- 2. Set a user as ADMIN
-- UPDATE auth.users 
-- SET raw_user_meta_data = raw_user_meta_data || '{"role": "admin"}'::jsonb
-- WHERE email = 'admin@example.com';

-- 3. Set multiple users as APPOINTMENTS_ONLY at once
-- UPDATE auth.users 
-- SET raw_user_meta_data = raw_user_meta_data || '{"role": "appointments_only"}'::jsonb
-- WHERE email IN (
--     'receptionist1@example.com',
--     'receptionist2@example.com',
--     'receptionist3@example.com'
-- );

-- 4. View all users and their roles
-- SELECT 
--     email,
--     raw_user_meta_data->>'role' as role,
--     created_at
-- FROM auth.users
-- ORDER BY created_at DESC;

-- 5. View detailed role information (from both metadata and user_roles table)
-- SELECT 
--     u.email,
--     u.raw_user_meta_data->>'role' as role_from_metadata,
--     ur.role as role_from_table,
--     u.created_at
-- FROM auth.users u
-- LEFT JOIN user_roles ur ON u.id = ur.user_id
-- ORDER BY u.created_at DESC;

-- 6. Remove role (revert to default 'admin')
-- UPDATE auth.users 
-- SET raw_user_meta_data = raw_user_meta_data - 'role'
-- WHERE email = 'user@example.com';

-- 7. Find users with specific role
-- SELECT email, created_at
-- FROM auth.users
-- WHERE raw_user_meta_data->>'role' = 'appointments_only';

-- 8. Using user_roles table instead (Option 2)
-- INSERT INTO user_roles (user_id, role)
-- SELECT id, 'appointments_only'
-- FROM auth.users
-- WHERE email = 'receptionist@example.com'
-- ON CONFLICT (user_id) DO UPDATE SET role = EXCLUDED.role;
