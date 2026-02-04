import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'
import { NextRequest, NextResponse } from 'next/server'

export async function GET(request: NextRequest) {
  const requestUrl = new URL(request.url)
  const code = requestUrl.searchParams.get('code')
  const redirect = requestUrl.searchParams.get('redirect') || '/'

  if (!code) {
    // No code provided, redirect to signin
    return NextResponse.redirect(new URL('/auth/signin', requestUrl.origin))
  }

  // Create response object first
  const response = NextResponse.redirect(new URL(redirect, requestUrl.origin))

  const cookieStore = await cookies()
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name: string) {
          return cookieStore.get(name)?.value
        },
        set(name: string, value: string, options: any) {
          // Set cookie in both the cookie store and response
          try {
            cookieStore.set({ name, value, ...options })
          } catch (e) {
            // Ignore errors setting in cookie store
          }
          // Always set in response
          response.cookies.set({
            name,
            value,
            ...options,
          })
        },
        remove(name: string, options: any) {
          // Remove cookie from both
          try {
            cookieStore.set({ name, value: '', ...options })
          } catch (e) {
            // Ignore errors
          }
          response.cookies.set({
            name,
            value: '',
            ...options,
          })
        },
      },
    }
  )
  
  const { error } = await supabase.auth.exchangeCodeForSession(code)
  
  if (error) {
    console.error('Auth callback error:', error)
    console.error('Error details:', {
      code: error.code,
      message: error.message,
      status: error.status,
    })
    
    // Redirect to signin with specific error message
    return NextResponse.redirect(
      new URL(`/auth/signin?error=${encodeURIComponent(error.message)}`, requestUrl.origin)
    )
  }

  return response
}
