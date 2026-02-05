-- Admin Direct Login Schema
-- Run this in your Supabase SQL Editor AFTER supabase-schema.sql and supabase-auth-schema.sql
-- Adds admin flags to user_profiles for the admin login flow

-- Add admin columns to user_profiles (user_profiles links to auth.users via user_id)
ALTER TABLE public.user_profiles
  ADD COLUMN IF NOT EXISTS is_admin BOOLEAN DEFAULT false,
  ADD COLUMN IF NOT EXISTS skip_verification BOOLEAN DEFAULT false;

-- Index for faster admin lookups
CREATE INDEX IF NOT EXISTS idx_user_profiles_is_admin
  ON public.user_profiles(is_admin)
  WHERE is_admin = true;

-- Function to promote a user to admin by email (auth.users email)
-- Run after creating the user in Supabase Dashboard (Authentication → Users → Add User)
CREATE OR REPLACE FUNCTION public.promote_to_admin(user_email TEXT)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = ''
AS $$
DECLARE
  v_user_id UUID;
BEGIN
  SELECT id INTO v_user_id
  FROM auth.users
  WHERE email = user_email
  LIMIT 1;

  IF v_user_id IS NULL THEN
    RAISE EXCEPTION 'User with email % not found in auth.users', user_email;
  END IF;

  INSERT INTO public.user_profiles (user_id, is_admin, skip_verification, requires_password_setup, updated_at)
  VALUES (v_user_id, true, true, false, NOW())
  ON CONFLICT (user_id) DO UPDATE SET
    is_admin = true,
    skip_verification = true,
    requires_password_setup = false,
    updated_at = NOW();
END;
$$;

COMMENT ON COLUMN public.user_profiles.is_admin IS 'When true, user can log in via /admin/login without verification';
COMMENT ON COLUMN public.user_profiles.skip_verification IS 'When true, user bypasses email/phone verification';
