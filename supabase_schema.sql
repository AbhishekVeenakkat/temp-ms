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

-- Enable Row Level Security (RLS)
ALTER TABLE gallery ENABLE ROW LEVEL SECURITY;
ALTER TABLE feed ENABLE ROW LEVEL SECURITY;
ALTER TABLE blogs ENABLE ROW LEVEL SECURITY;
ALTER TABLE ask_doctor ENABLE ROW LEVEL SECURITY;

-- Create policies (Public Read, Admin Write)
-- Note: Admin write requires authentication, which we'll handle via Supabase Auth

-- Public Access (Select)
CREATE POLICY "Public Read Gallery" ON gallery FOR SELECT USING (true);
CREATE POLICY "Public Read Feed" ON feed FOR SELECT USING (true);
CREATE POLICY "Public Read Blogs" ON blogs FOR SELECT USING (true);

-- Public Insert for Ask Doctor (anyone can submit)
CREATE POLICY "Public Insert Ask Doctor" ON ask_doctor FOR INSERT 
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
