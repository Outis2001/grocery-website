import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { checkRateLimit, getClientIdentifier } from '@/lib/auth/rate-limit';

function isEmail(identifier: string): boolean {
  return identifier.includes('@');
}

function formatPhone(identifier: string): string {
  let formatted = identifier.trim();
  if (!formatted.startsWith('+')) {
    if (formatted.startsWith('0')) {
      formatted = '+94' + formatted.substring(1);
    } else if (formatted.startsWith('94')) {
      formatted = '+' + formatted;
    } else {
      formatted = '+94' + formatted;
    }
  }
  return formatted;
}

export async function POST(request: NextRequest) {
  try {
    const clientId = getClientIdentifier(request);
    const { allowed } = checkRateLimit(`reset:${clientId}`, 5, 3600); // 5 per hour per IP
    if (!allowed) {
      return NextResponse.json(
        { error: 'Too many requests. Please try again later.' },
        { status: 429 }
      );
    }

    const { identifier } = await request.json();

    if (!identifier || typeof identifier !== 'string') {
      return NextResponse.json({ error: 'Email or phone number is required' }, { status: 400 });
    }

    const trimmed = identifier.trim();

    if (isEmail(trimmed)) {
      // Email: Use Supabase resetPasswordForEmail
      const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
      const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
      const supabase = createClient(supabaseUrl, supabaseAnonKey);

      const baseUrl = (process.env.NEXT_PUBLIC_APP_URL || request.nextUrl.origin).replace(
        /\/$/,
        ''
      );
      const redirectTo = `${baseUrl}/auth/reset-password`;

      const { error } = await supabase.auth.resetPasswordForEmail(trimmed, {
        redirectTo,
      });

      if (error) {
        // Don't reveal if user exists
        console.error('Password reset email error:', error);
      }

      return NextResponse.json({
        success: true,
        type: 'email',
        message: 'If an account exists, a reset link has been sent.',
      });
    } else {
      // Phone: Send OTP via Supabase (never reveal if user exists)
      const formattedPhone = formatPhone(trimmed);
      const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
      const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
      const supabase = createClient(supabaseUrl, supabaseAnonKey);

      await supabase.auth.signInWithOtp({
        phone: formattedPhone,
        options: { shouldCreateUser: false },
      });

      return NextResponse.json({
        success: true,
        type: 'phone',
        phone: formattedPhone,
        message: 'If an account exists, a code has been sent.',
      });
    }
  } catch (err) {
    console.error('Reset password request error:', err);
    return NextResponse.json({ error: 'Something went wrong' }, { status: 500 });
  }
}
