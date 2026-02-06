-- Fix: Admin cannot see all orders (RLS used hardcoded email)
-- Run this in Supabase SQL Editor. Ensures admins are identified by user_profiles.is_admin
-- so the app (NEXT_PUBLIC_ADMIN_EMAIL / is_admin) and database agree.

-- Helper: true when the current user is an admin (user_profiles.is_admin)
-- Uses COALESCE so missing profile or column defaults to false
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

-- Orders: allow SELECT for own orders OR admin
DROP POLICY IF EXISTS "Users can view their own orders" ON orders;
CREATE POLICY "Users can view their own orders" ON orders
  FOR SELECT USING (
    auth.uid() = user_id OR public.is_admin_user()
  );

-- Orders: allow UPDATE for admin
DROP POLICY IF EXISTS "Admins can update orders" ON orders;
CREATE POLICY "Admins can update orders" ON orders
  FOR UPDATE USING (public.is_admin_user());

-- Order Items: allow SELECT for own order items OR admin
DROP POLICY IF EXISTS "Users can view their own order items" ON order_items;
CREATE POLICY "Users can view their own order items" ON order_items
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM orders o
      WHERE o.id = order_items.order_id
      AND (o.user_id = auth.uid() OR public.is_admin_user())
    )
  );

-- Products: allow admin management by is_admin (not hardcoded email)
DROP POLICY IF EXISTS "Admins can manage products" ON products;
CREATE POLICY "Admins can manage products" ON products
  FOR ALL USING (public.is_admin_user());
