# AshishSport — Sport Outfit Web Application

A complete full-stack web application built with Next.js 14 (App Router), TypeScript, TailwindCSS, and Supabase for managing and displaying sport outfits.

## 🚀 Features

### Public Website
- **Home Page**: Grid view of all sport outfits with responsive design
- **Outfit Detail Page**: Individual outfit pages with SEO-friendly metadata
- **Contact Page**: Form for customers to inquire about outfits
- **SEO Optimized**: Dynamic metadata and Open Graph tags for social sharing

### Admin Panel
- **Authentication**: Secure admin login using Supabase Auth
- **Dashboard**: Overview of outfits and contact requests
- **Outfit Management**: Create, read, update, and delete outfits
- **Image Upload**: Upload images to Supabase Storage
- **Contact Management**: View and manage customer inquiries

## 🛠️ Tech Stack

- **Framework**: Next.js 14 (App Router)
- **Language**: TypeScript
- **Styling**: TailwindCSS
- **Database**: Supabase (PostgreSQL)
- **Authentication**: Supabase Auth
- **Storage**: Supabase Storage
- **Image Optimization**: Next.js Image Component

## 📋 Prerequisites

- Node.js 18+ installed
- A Supabase account and project
- npm or yarn package manager

## 🔧 Setup Instructions

### 1. Clone and Install Dependencies

```bash
npm install
```

### 2. Set Up Supabase

1. Create a new project at [supabase.com](https://supabase.com)
2. Go to SQL Editor and run the following SQL to create the database tables:

```sql
-- Create outfits table
CREATE TABLE outfits (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  category TEXT NOT NULL,
  price NUMERIC,
  image_url TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create contacts table
CREATE TABLE contacts (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  mobile TEXT NOT NULL,
  message TEXT NOT NULL,
  outfit_id UUID REFERENCES outfits(id) ON DELETE SET NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable Row Level Security (RLS)
ALTER TABLE outfits ENABLE ROW LEVEL SECURITY;
ALTER TABLE contacts ENABLE ROW LEVEL SECURITY;

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
```

3. Create a storage bucket:
   - Go to Storage in your Supabase dashboard
   - Create a new bucket named `ashishsport-outfits`
   - Set it to **Public** (or configure policies for public access)
   - Add the following policy for public read access:

```sql
-- Allow public to read images
CREATE POLICY "Public can view images" ON storage.objects
  FOR SELECT USING (bucket_id = 'ashishsport-outfits');

-- Allow authenticated users to upload
CREATE POLICY "Authenticated users can upload" ON storage.objects
  FOR INSERT WITH CHECK (bucket_id = 'ashishsport-outfits' AND auth.role() = 'authenticated');

-- Allow authenticated users to delete
CREATE POLICY "Authenticated users can delete" ON storage.objects
  FOR DELETE USING (bucket_id = 'ashishsport-outfits' AND auth.role() = 'authenticated');
```

### 3. Configure Environment Variables

Create a `.env.local` file in the root directory:

```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key
```

You can find these values in your Supabase project settings:
- **Project URL**: Settings → API → Project URL
- **Anon Key**: Settings → API → Project API keys → anon/public
- **Service Role Key**: Settings → API → Project API keys → service_role (keep this secret!)

### 4. Create Admin User

1. Go to Authentication → Users in your Supabase dashboard
2. Click "Add User" → "Create new user"
3. Enter an email and password for your admin account
4. Save the credentials (you'll use these to log into the admin panel)

### 5. Run the Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## 📁 Project Structure

```
src/
├── app/
│   ├── (public)/
│   │   ├── page.tsx              # Home page
│   │   └── layout.tsx
│   ├── outfit/
│   │   └── [id]/
│   │       └── page.tsx          # Outfit detail page
│   ├── contact/
│   │   └── page.tsx              # Contact page
│   ├── admin/
│   │   ├── layout.tsx            # Admin layout with auth check
│   │   ├── login/
│   │   │   └── page.tsx          # Admin login
│   │   ├── page.tsx              # Admin dashboard
│   │   ├── outfits/
│   │   │   ├── page.tsx          # List outfits
│   │   │   ├── new/
│   │   │   │   └── page.tsx      # Create outfit
│   │   │   └── [id]/
│   │   │       └── edit/
│   │   │           └── page.tsx  # Edit outfit
│   │   └── contacts/
│   │       └── page.tsx          # View contacts
│   ├── api/
│   │   ├── contact/
│   │   │   └── route.ts          # Contact form API
│   │   ├── contacts/
│   │   │   └── route.ts          # Admin contacts API
│   │   └── outfits/
│   │       ├── route.ts          # Get outfits API
│   │       ├── upload/
│   │       │   └── route.ts      # Upload outfit API
│   │       └── [id]/
│   │           └── route.ts      # Update/Delete outfit API
│   ├── globals.css
│   └── layout.tsx
├── components/
│   ├── Header.tsx
│   ├── Footer.tsx
│   ├── OutfitCard.tsx
│   ├── OutfitAdminCard.tsx
│   ├── OutfitForm.tsx
│   ├── ContactForm.tsx
│   ├── ContactButton.tsx
│   ├── LoginForm.tsx
│   └── AdminHeader.tsx
├── lib/
│   ├── supabase/
│   │   ├── client.ts             # Browser client
│   │   ├── server.ts             # Server client
│   │   └── admin.ts              # Admin client (service role)
│   └── utils.ts
└── types/
    └── index.ts
```

## 🚢 Deployment

### Deploy to Vercel

1. Push your code to GitHub
2. Import your repository in [Vercel](https://vercel.com)
3. Add your environment variables in Vercel project settings
4. Deploy!

### Environment Variables for Production

Make sure to add the same environment variables in your Vercel project settings:
- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- `SUPABASE_SERVICE_ROLE_KEY`

## 🔒 Security Notes

- The service role key should **never** be exposed to the client
- All admin API routes check for authentication
- Row Level Security (RLS) is enabled on all tables
- Images are stored in Supabase Storage with proper access policies

## 📝 Usage

### Admin Login
1. Navigate to `/admin/login`
2. Use the credentials you created in Supabase
3. Access the admin dashboard

### Adding Outfits
1. Log into the admin panel
2. Go to "Outfits" → "Add New Outfit"
3. Fill in the form and upload an image
4. Click "Create Outfit"

### Managing Contacts
1. Log into the admin panel
2. Go to "Contacts" to view all inquiries
3. Contact requests are automatically saved when users submit the contact form

## 🎨 Customization

- **Branding**: Update "AshishSport" throughout the codebase to match your brand
- **Styling**: Modify TailwindCSS classes in components to change the design
- **Categories**: Update category options in the outfit form as needed

## 📄 License

This project is open source and available under the MIT License.

## 🤝 Support

For issues or questions, please open an issue on the repository.

