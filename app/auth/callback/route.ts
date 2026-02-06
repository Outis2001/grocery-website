import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';
import { NextRequest, NextResponse } from 'next/server';

/** Get the correct origin (avoid localhost when deployed on Vercel). */
function getOrigin(request: NextRequest): string {
  const url = new URL(request.url);
  const forwardedHost = request.headers.get('x-forwarded-host');
  const forwardedProto = request.headers.get('x-forwarded-proto');
  if (forwardedHost && forwardedProto) {
    return `${forwardedProto}://${forwardedHost}`;
  }
  if (process.env.VERCEL_URL) {
    return `https://${process.env.VERCEL_URL}`;
  }
  if (process.env.NEXT_PUBLIC_APP_URL) {
    return process.env.NEXT_PUBLIC_APP_URL.replace(/\/$/, '');
  }
  return url.origin;
}

export async function GET(request: NextRequest) {
  const requestUrl = new URL(request.url);
  const origin = getOrigin(request);
  const code = requestUrl.searchParams.get('code');
  const redirect = requestUrl.searchParams.get('redirect') || '/';

  if (!code) {
    return NextResponse.redirect(new URL('/auth/signin', origin));
  }

  const response = NextResponse.redirect(new URL(redirect, origin));

  const cookieStore = await cookies();
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name: string) {
          return cookieStore.get(name)?.value;
        },
        set(name: string, value: string, options: any) {
          // Set cookie in both the cookie store and response
          try {
            cookieStore.set({ name, value, ...options });
          } catch (e) {
            // Ignore errors setting in cookie store
          }
          // Always set in response
          response.cookies.set({
            name,
            value,
            ...options,
          });
        },
        remove(name: string, options: any) {
          // Remove cookie from both
          try {
            cookieStore.set({ name, value: '', ...options });
          } catch (e) {
            // Ignore errors
          }
          response.cookies.set({
            name,
            value: '',
            ...options,
          });
        },
      },
    }
  );

  const { data, error } = await supabase.auth.exchangeCodeForSession(code);

  if (error) {
    console.error('Auth callback error:', error);
    return NextResponse.redirect(
      new URL(`/auth/signin?error=${encodeURIComponent(error.message)}`, origin)
    );
  }

  // Determine final redirect URL
  let finalRedirect = redirect;
  const userId = data.user?.id;

  if (userId) {
    const { data: profile } = await supabase
      .from('user_profiles')
      .select('requires_password_setup')
      .eq('user_id', userId)
      .single();

    // Create profile if trigger didn't run (e.g., existing user)
    if (!profile) {
      await supabase
        .from('user_profiles')
        .upsert({ user_id: userId, requires_password_setup: true }, { onConflict: 'user_id' });
    }

    const requiresPasswordSetup = profile?.requires_password_setup !== false;

    if (requiresPasswordSetup) {
      finalRedirect = `/auth/create-password?redirect=${encodeURIComponent(redirect)}`;
    }
  }

  // Use same response to preserve session cookies, update redirect
  response.headers.set('Location', new URL(finalRedirect, origin).toString());
  return response;
}
