-- Password-Based Authentication Schema
-- Run this in your Supabase SQL Editor AFTER the main supabase-schema.sql
-- This adds tables for the new authentication flow

-- User Profiles: Track password setup status (Supabase auth.users is managed by Supabase)
CREATE TABLE IF NOT EXISTS user_profiles (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL UNIQUE,
  requires_password_setup BOOLEAN DEFAULT true,
  password_set_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Index for user lookups
CREATE INDEX IF NOT EXISTS idx_user_profiles_user_id ON user_profiles(user_id);

-- Enable RLS
ALTER TABLE user_profiles ENABLE ROW LEVEL SECURITY;

-- Users can read/update their own profile
CREATE POLICY "Users can view own profile" ON user_profiles
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can update own profile" ON user_profiles
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own profile" ON user_profiles
  FOR INSERT WITH CHECK (auth.uid() = user_id);

-- User Sessions: For 12-hour session tracking and sliding window
CREATE TABLE IF NOT EXISTS user_sessions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  session_token TEXT UNIQUE NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  expires_at TIMESTAMP WITH TIME ZONE NOT NULL,
  last_activity TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_user_sessions_token ON user_sessions(session_token);
CREATE INDEX IF NOT EXISTS idx_user_sessions_user_id ON user_sessions(user_id);
CREATE INDEX IF NOT EXISTS idx_user_sessions_expires ON user_sessions(expires_at);

ALTER TABLE user_sessions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can manage own sessions" ON user_sessions
  FOR ALL USING (auth.uid() = user_id);

-- Verification Tokens: For password reset OTP (phone users)
CREATE TABLE IF NOT EXISTS verification_tokens (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  identifier TEXT NOT NULL,
  token TEXT NOT NULL,
  type TEXT NOT NULL CHECK (type IN ('email_verify', 'phone_otp', 'password_reset', 'password_reset_otp')),
  expires_at TIMESTAMP WITH TIME ZONE NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_verification_tokens_token ON verification_tokens(token);
CREATE INDEX IF NOT EXISTS idx_verification_tokens_identifier ON verification_tokens(identifier);
CREATE INDEX IF NOT EXISTS idx_verification_tokens_expires ON verification_tokens(expires_at);

-- verification_tokens: No direct client access. Use service role in API routes.
ALTER TABLE verification_tokens ENABLE ROW LEVEL SECURITY;

-- No permissive policies = deny all. Service role bypasses RLS for server operations.

-- RPC: Verify token and return identifier if valid (callable with anon key)
CREATE OR REPLACE FUNCTION public.verify_verification_token(p_token text, p_type text)
RETURNS text
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = ''
AS $$
DECLARE
  v_identifier text;
BEGIN
  SELECT identifier INTO v_identifier
  FROM public.verification_tokens
  WHERE token = p_token AND type = p_type AND expires_at > NOW()
  LIMIT 1;
  -- Delete used token
  DELETE FROM public.verification_tokens WHERE token = p_token;
  RETURN v_identifier;
END;
$$;

GRANT EXECUTE ON FUNCTION public.verify_verification_token(text, text) TO anon;
GRANT EXECUTE ON FUNCTION public.verify_verification_token(text, text) TO authenticated;

-- Function to auto-create user_profile when user signs up (via trigger on auth.users)
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = ''
AS $$
BEGIN
  INSERT INTO public.user_profiles (user_id, requires_password_setup)
  VALUES (NEW.id, true)
  ON CONFLICT (user_id) DO NOTHING;
  RETURN NEW;
EXCEPTION WHEN OTHERS THEN
  RETURN NEW; -- Don't block signup if profile creation fails
END;
$$;

-- Drop trigger if exists then create (in case of re-run)
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Migration: Add profiles for existing users (run once)
INSERT INTO public.user_profiles (user_id, requires_password_setup)
SELECT id, true FROM auth.users
WHERE id NOT IN (SELECT user_id FROM public.user_profiles)
ON CONFLICT (user_id) DO UPDATE SET requires_password_setup = true, updated_at = NOW();

COMMENT ON TABLE user_profiles IS 'Tracks password setup status for auth migration';
COMMENT ON TABLE user_sessions IS 'Custom session tracking for 12-hour timeout';
COMMENT ON TABLE verification_tokens IS 'Tokens for password reset OTP (phone users)';
