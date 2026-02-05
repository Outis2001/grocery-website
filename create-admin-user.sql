-- Create / Promote a User to Admin
-- Run in Supabase SQL Editor when you need to add a new admin or promote an existing user.
-- Requires: supabase-admin-schema.sql has been run (so promote_to_admin function exists).

-- INSTRUCTIONS:
-- 1. Create the user in Supabase first: Authentication → Users → Add User
--    - Enter email and password, then confirm the user (e.g. "Confirm email" in the dashboard).
-- 2. Replace 'admin@example.com' below with that user's email.
-- 3. Run this script (or just the SELECT line).

-- Promote the user to admin (sets is_admin, skip_verification, and ensures profile exists)
SELECT public.promote_to_admin('admin@example.com');

-- Optional: ensure auth.users has email confirmed (if you didn’t confirm in the dashboard)
-- UPDATE auth.users
-- SET email_confirmed_at = COALESCE(email_confirmed_at, NOW())
-- WHERE email = 'admin@example.com';

-- After running: that user can sign in at /admin/login with email + password.
-- Set NEXT_PUBLIC_ADMIN_EMAIL in .env.local to this email for fallback admin checks.
