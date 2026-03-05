-- Fix appointments UPDATE policy to avoid CORS issues
-- Drop existing policies
DROP POLICY IF EXISTS "Admin Update Appointments" ON appointments;
DROP POLICY IF EXISTS "Admin CRUD Appointments" ON appointments;
DROP POLICY IF EXISTS "Admin Select Appointments" ON appointments;
DROP POLICY IF EXISTS "Admin Delete Appointments" ON appointments;
DROP POLICY IF EXISTS "Public Insert Appointments" ON appointments;

-- Disable RLS temporarily to ensure clean slate
ALTER TABLE appointments DISABLE ROW LEVEL SECURITY;

-- Re-enable RLS
ALTER TABLE appointments ENABLE ROW LEVEL SECURITY;

-- Create policies in correct order
-- 1. Public can insert (book appointments)
CREATE POLICY "Public Insert Appointments" ON appointments 
    FOR INSERT 
    TO anon, authenticated
    WITH CHECK (true);

-- 2. Authenticated users can select
CREATE POLICY "Admin Select Appointments" ON appointments 
    FOR SELECT 
    TO authenticated
    USING (true);

-- 3. Authenticated users can update
CREATE POLICY "Admin Update Appointments" ON appointments 
    FOR UPDATE 
    TO authenticated
    USING (true)
    WITH CHECK (true);

-- 4. Authenticated users can delete
CREATE POLICY "Admin Delete Appointments" ON appointments 
    FOR DELETE 
    TO authenticated
    USING (true);

-- Verify all policies are created correctly
SELECT 
    schemaname, 
    tablename, 
    policyname, 
    cmd as operation,
    roles,
    qual as using_expression,
    with_check as with_check_expression
FROM pg_policies 
WHERE tablename = 'appointments' 
ORDER BY policyname;

-- Check RLS is enabled
SELECT tablename, rowsecurity 
FROM pg_tables 
WHERE tablename = 'appointments';
