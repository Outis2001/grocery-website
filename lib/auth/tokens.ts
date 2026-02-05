import { createAdminClient } from '@/lib/supabase/admin'
import crypto from 'crypto'

const TOKEN_EXPIRY_MINUTES = 5
const OTP_LENGTH = 6

/** Generate cryptographically secure random token (32+ chars) */
export function generateSecureToken(): string {
  return crypto.randomBytes(32).toString('hex')
}

/** Generate 6-digit OTP code */
export function generateOTP(): string {
  const bytes = crypto.randomBytes(4)
  const num = bytes.readUInt32BE(0)
  return String(num % 1000000).padStart(6, '0')
}

/** Get expiry timestamp (5 minutes from now) */
export function getTokenExpiry(): Date {
  const expiry = new Date()
  expiry.setMinutes(expiry.getMinutes() + TOKEN_EXPIRY_MINUTES)
  return expiry
}

/** Store verification token for password reset (phone users) */
export async function storeVerificationToken(
  identifier: string,
  token: string,
  type: 'password_reset_otp' | 'phone_otp'
): Promise<void> {
  const supabase = createAdminClient()
  const expiresAt = getTokenExpiry().toISOString()

  await (supabase as any).from('verification_tokens').insert({
    identifier,
    token,
    type,
    expires_at: expiresAt,
  })
}

/** Verify token and return identifier if valid */
export async function verifyToken(
  token: string,
  type: string
): Promise<string | null> {
  const supabase = createAdminClient()
  const { data, error } = await (supabase as any).rpc('verify_verification_token', {
    p_token: token,
    p_type: type,
  })

  if (error) {
    console.error('Token verification error:', error)
    return null
  }

  return data
}
