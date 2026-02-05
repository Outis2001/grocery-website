-- Migrate Existing Admin User
-- Run this ONCE in Supabase SQL Editor after running supabase-admin-schema.sql
-- Purpose: Mark your existing admin account so they can log in via /admin/login without verification

-- INSTRUCTIONS: Replace 'benujith@gmail.com' below with your actual admin email (must exist in Authentication → Users)

-- 1. Update user_profiles: set is_admin and skip_verification for the admin user
INSERT INTO public.user_profiles (user_id, is_admin, skip_verification, requires_password_setup, updated_at)
SELECT id, true, true, false, NOW()
FROM auth.users
WHERE email = 'benujith@gmail.com'
ON CONFLICT (user_id) DO UPDATE SET
  is_admin = true,
  skip_verification = true,
  requires_password_setup = false,
  updated_at = NOW();

-- 2. Ensure email is confirmed in auth.users (so Supabase treats the user as verified)
UPDATE auth.users
SET email_confirmed_at = COALESCE(email_confirmed_at, NOW())
WHERE email = 'benujith@gmail.com';

-- 3. Clear phone_confirmed_at (admins use email-only login)
UPDATE auth.users
SET phone_confirmed_at = NULL
WHERE email = 'benujith@gmail.com';

-- After running: the admin can sign in at /admin/login with email + password (no verification step).