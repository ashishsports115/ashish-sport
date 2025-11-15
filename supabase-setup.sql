-- AshishSport Database Setup
-- Run this SQL in your Supabase SQL Editor

-- Create outfits table
CREATE TABLE IF NOT EXISTS outfits (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  category TEXT NOT NULL,
  price NUMERIC,
  description TEXT,
  image_url TEXT NOT NULL,
  image_urls TEXT[], -- Array of image URLs for multiple images
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Add description column if it doesn't exist (for existing databases)
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'outfits' AND column_name = 'description'
  ) THEN
    ALTER TABLE outfits ADD COLUMN description TEXT;
  END IF;
END $$;

-- Add image_urls column if it doesn't exist (for existing databases)
DO $$ 
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'outfits' AND column_name = 'image_urls'
  ) THEN
    ALTER TABLE outfits ADD COLUMN image_urls TEXT[];
  END IF;
END $$;

-- Create contacts table
CREATE TABLE IF NOT EXISTS contacts (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  mobile TEXT NOT NULL,
  message TEXT NOT NULL,
  outfit_id UUID REFERENCES outfits(id) ON DELETE SET NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create company_details table (single row table)
CREATE TABLE IF NOT EXISTS company_details (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  company_name TEXT NOT NULL DEFAULT 'AshishSport',
  email TEXT,
  phone TEXT,
  mobile TEXT,
  address TEXT,
  city TEXT,
  state TEXT,
  zip_code TEXT,
  country TEXT DEFAULT 'USA',
  website TEXT,
  description TEXT,
  logo_url TEXT,
  social_facebook TEXT,
  social_instagram TEXT,
  social_twitter TEXT,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Add logo_url column if it doesn't exist (for existing databases)
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'company_details' AND column_name = 'logo_url'
  ) THEN
    ALTER TABLE company_details ADD COLUMN logo_url TEXT;
  END IF;
END $$;

-- Insert default company details if table is empty
INSERT INTO company_details (id, company_name, email, phone, mobile, address, city, state, zip_code, country, description)
SELECT 
  gen_random_uuid(),
  'AshishSport',
  'info@ashishsport.com',
  '+1 (555) 123-4567',
  '+1 (555) 123-4567',
  '123 Sport Street',
  'New York',
  'NY',
  '10001',
  'USA',
  'Premium sport outfits and athletic wear. Built for athletes, designed for performance.'
WHERE NOT EXISTS (SELECT 1 FROM company_details);

-- Enable Row Level Security (RLS)
ALTER TABLE outfits ENABLE ROW LEVEL SECURITY;
ALTER TABLE contacts ENABLE ROW LEVEL SECURITY;
ALTER TABLE company_details ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if they exist (for re-running this script)
DROP POLICY IF EXISTS "Public can view outfits" ON outfits;
DROP POLICY IF EXISTS "Only authenticated users can insert outfits" ON outfits;
DROP POLICY IF EXISTS "Only authenticated users can update outfits" ON outfits;
DROP POLICY IF EXISTS "Only authenticated users can delete outfits" ON outfits;
DROP POLICY IF EXISTS "Public can insert contacts" ON contacts;
DROP POLICY IF EXISTS "Only authenticated users can view contacts" ON contacts;

-- Create policies for outfits (public read, admin write)
CREATE POLICY "Public can view outfits" ON outfits
  FOR SELECT USING (true);

CREATE POLICY "Only authenticated users can insert outfits" ON outfits
  FOR INSERT WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Only authenticated users can update outfits" ON outfits
  FOR UPDATE USING (auth.role() = 'authenticated');

CREATE POLICY "Only authenticated users can delete outfits" ON outfits
  FOR DELETE USING (auth.role() = 'authenticated');

-- Create policies for contacts (public insert, admin read)
CREATE POLICY "Public can insert contacts" ON contacts
  FOR INSERT WITH CHECK (true);

CREATE POLICY "Only authenticated users can view contacts" ON contacts
  FOR SELECT USING (auth.role() = 'authenticated');

-- Create policies for company_details (public read, admin write)
DROP POLICY IF EXISTS "Public can view company details" ON company_details;
DROP POLICY IF EXISTS "Only authenticated users can update company details" ON company_details;

CREATE POLICY "Public can view company details" ON company_details
  FOR SELECT USING (true);

CREATE POLICY "Only authenticated users can update company details" ON company_details
  FOR UPDATE USING (auth.role() = 'authenticated');

-- Storage policies for ashishsport-outfits bucket
-- Note: These need to be run after creating the bucket in Supabase Storage

-- Allow public to read images
CREATE POLICY IF NOT EXISTS "Public can view images" ON storage.objects
  FOR SELECT USING (bucket_id = 'ashishsport-outfits');

-- Allow authenticated users to upload
CREATE POLICY IF NOT EXISTS "Authenticated users can upload" ON storage.objects
  FOR INSERT WITH CHECK (bucket_id = 'ashishsport-outfits' AND auth.role() = 'authenticated');

-- Allow authenticated users to delete
CREATE POLICY IF NOT EXISTS "Authenticated users can delete" ON storage.objects
  FOR DELETE USING (bucket_id = 'ashishsport-outfits' AND auth.role() = 'authenticated');

-- Storage policies for ashishsport-company bucket (for company logo)
-- Note: Create the bucket 'ashishsport-company' in Supabase Storage first

-- Allow public to read company logo
CREATE POLICY IF NOT EXISTS "Public can view company logo" ON storage.objects
  FOR SELECT USING (bucket_id = 'ashishsport-company');

-- Allow authenticated users to upload company logo
CREATE POLICY IF NOT EXISTS "Authenticated users can upload company logo" ON storage.objects
  FOR INSERT WITH CHECK (bucket_id = 'ashishsport-company' AND auth.role() = 'authenticated');

-- Allow authenticated users to delete company logo
CREATE POLICY IF NOT EXISTS "Authenticated users can delete company logo" ON storage.objects
  FOR DELETE USING (bucket_id = 'ashishsport-company' AND auth.role() = 'authenticated');

