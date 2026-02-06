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

-- RLS: Use is_admin for orders/products so app and DB agree (no hardcoded admin email)
CREATE OR REPLACE FUNCTION public.is_admin_user()
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT COALESCE(
    (SELECT is_admin FROM public.user_profiles WHERE user_id = auth.uid() LIMIT 1),
    false
  );
$$;

DROP POLICY IF EXISTS "Users can view their own orders" ON orders;
CREATE POLICY "Users can view their own orders" ON orders
  FOR SELECT USING (auth.uid() = user_id OR public.is_admin_user());

DROP POLICY IF EXISTS "Admins can update orders" ON orders;
CREATE POLICY "Admins can update orders" ON orders
  FOR UPDATE USING (public.is_admin_user());

DROP POLICY IF EXISTS "Users can view their own order items" ON order_items;
CREATE POLICY "Users can view their own order items" ON order_items
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM orders o
      WHERE o.id = order_items.order_id
      AND (o.user_id = auth.uid() OR public.is_admin_user())
    )
  );

DROP POLICY IF EXISTS "Admins can manage products" ON products;
CREATE POLICY "Admins can manage products" ON products
  FOR ALL USING (public.is_admin_user());
