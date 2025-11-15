# Environment Variables Setup

## Quick Setup Guide

Create a `.env.local` file in the root directory of your project with the following variables:

```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key
NEXT_PUBLIC_SITE_URL=http://localhost:3000
```

## Where to Find These Values

### 1. Supabase Project URL
- Go to your Supabase project dashboard
- Navigate to **Settings** → **API**
- Copy the **Project URL** (looks like: `https://xxxxx.supabase.co`)

### 2. Supabase Anon Key
- In the same **Settings** → **API** page
- Copy the **anon/public** key under **Project API keys**

### 3. Supabase Service Role Key
- Still in **Settings** → **API** page
- Copy the **service_role** key under **Project API keys**
- ⚠️ **IMPORTANT**: Keep this key secret! Never commit it to version control.

### 4. Site URL (Optional)
- For local development: `http://localhost:3000`
- For production: Your deployed domain (e.g., `https://yourdomain.com`)

## Example `.env.local` File

```env
NEXT_PUBLIC_SUPABASE_URL=https://abcdefghijklmnop.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFiY2RlZmdoaWprbG1ub3AiLCJyb2xlIjoiYW5vbiIsImlhdCI6MTYxNjIzOTAyMiwiZXhwIjoxOTMxODE1MDIyfQ.example
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFiY2RlZmdoaWprbG1ub3AiLCJyb2xlIjoic2VydmljZV9yb2xlIiwiaWF0IjoxNjE2MjM5MDIyLCJleHAiOjE5MzE4MTUwMjJ9.example
NEXT_PUBLIC_SITE_URL=http://localhost:3000
```

## Troubleshooting

### Error: "Invalid supabaseUrl: Must be a valid HTTP or HTTPS URL"

This means your environment variables are not set correctly. Check:
1. Is `.env.local` in the root directory?
2. Are the variable names spelled correctly?
3. Did you restart the development server after adding the variables?
4. Are there any extra spaces or quotes around the values?

### After Adding Environment Variables

1. **Restart your development server** (stop with `Ctrl+C` and run `npm run dev` again)
2. Environment variables are loaded when the server starts, so changes require a restart

## Security Notes

- ✅ `.env.local` is already in `.gitignore` - your secrets won't be committed
- ❌ Never commit `.env.local` to version control
- ❌ Never expose `SUPABASE_SERVICE_ROLE_KEY` to the client
- ✅ Use `NEXT_PUBLIC_*` prefix only for variables that need to be accessible in the browser

