import { createServerClient } from '@supabase/ssr'
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export async function middleware(req: NextRequest) {
  let response = NextResponse.next({
    request: {
      headers: req.headers,
    },
  })

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name: string) {
          return req.cookies.get(name)?.value
        },
        set(name: string, value: string, options: any) {
          req.cookies.set({
            name,
            value,
            ...options,
          })
          response = NextResponse.next({
            request: {
              headers: req.headers,
            },
          })
          response.cookies.set({
            name,
            value,
            ...options,
          })
        },
        remove(name: string, options: any) {
          req.cookies.set({
            name,
            value: '',
            ...options,
          })
          response = NextResponse.next({
            request: {
              headers: req.headers,
            },
          })
          response.cookies.set({
            name,
            value: '',
            ...options,
          })
        },
      },
    }
  )

  let {
    data: { session },
  } = await supabase.auth.getSession()

  // Refresh session if close to expiry (sliding window - 12 hour timeout)
  const ONE_HOUR = 60 * 60
  if (session?.expires_at) {
    const expiresAt = session.expires_at
    const timeLeft = expiresAt - Math.floor(Date.now() / 1000)
    if (timeLeft < ONE_HOUR && timeLeft > 0) {
      const { data: refreshed } = await supabase.auth.refreshSession()
      if (refreshed.session) {
        session = refreshed.session
      }
    }
  }

  // Protected routes that require authentication
  const protectedPaths = ['/checkout', '/orders', '/admin']
  const isProtectedPath = protectedPaths.some((path) =>
    req.nextUrl.pathname.startsWith(path)
  )
  const isCreatePassword = req.nextUrl.pathname === '/auth/create-password'

  if (isProtectedPath && !session) {
    const redirectUrl = new URL('/auth/signin', req.url)
    redirectUrl.searchParams.set('redirect', req.nextUrl.pathname)
    return NextResponse.redirect(redirectUrl)
  }

  // If authenticated but must set password, redirect to create-password (except when already there)
  if (isProtectedPath && session && !isCreatePassword) {
    const { data: profile } = await supabase
      .from('user_profiles')
      .select('requires_password_setup')
      .eq('user_id', session.user.id)
      .single()

    if (profile?.requires_password_setup) {
      const redirectUrl = new URL('/auth/create-password', req.url)
      redirectUrl.searchParams.set('redirect', req.nextUrl.pathname)
      return NextResponse.redirect(redirectUrl)
    }
  }

  return response
}

export const config = {
  matcher: ['/checkout/:path*', '/orders/:path*', '/admin/:path*'],
}
