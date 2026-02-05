# Tasks: Password-Based Authentication System

Based on: `prd-password-based-authentication.md`

## Relevant Files

- `supabase-schema.sql` - Database schema updates for sessions and verification tokens
- `lib/supabase/database.types.ts` - TypeScript types for new database tables
- `app/auth/signup/page.tsx` - New signup page with email/phone input
- `app/auth/verify-email/page.tsx` - Email verification confirmation page
- `app/auth/verify-otp/page.tsx` - Phone OTP verification page (update existing)
- `app/auth/create-password/page.tsx` - New password creation page
- `app/auth/signin/page.tsx` - Update existing signin page for username/password
- `app/auth/forgot-password/page.tsx` - New password reset request page
- `app/auth/reset-password/page.tsx` - New password reset form page
- `app/api/auth/send-verification/route.ts` - API endpoint to send email verification
- `app/api/auth/send-otp/route.ts` - API endpoint to send phone OTP
- `app/api/auth/verify-token/route.ts` - API endpoint to verify email tokens/OTP
- `app/api/auth/create-password/route.ts` - API endpoint to create password
- `app/api/auth/login/route.ts` - API endpoint for username/password login
- `app/api/auth/reset-password/route.ts` - API endpoint for password reset
- `lib/auth/session.ts` - Session management utilities
- `lib/auth/tokens.ts` - Token generation and validation utilities
- `lib/auth/rate-limit.ts` - Rate limiting middleware
- `middleware.ts` - Update to check session validity
- `components/auth/PasswordInput.tsx` - Reusable password input with show/hide toggle
- `components/auth/PasswordStrengthIndicator.tsx` - Password requirements checklist
- `lib/email/templates/verification.ts` - Email verification template
- `lib/email/templates/password-reset.ts` - Password reset email template

### Notes

- This implementation uses Supabase Auth as the foundation
- Session management will be handled with custom logic for 12-hour timeout
- Rate limiting will be implemented at the API route level
- All sensitive operations will be handled server-side

## Instructions for Completing Tasks

**IMPORTANT:** As you complete each task, you must check it off in this markdown file by changing `- [ ]` to `- [x]`. This helps track progress and ensures you don't skip any steps.

Example:
- `- [ ] 1.1 Read file` → `- [x] 1.1 Read file` (after completing)

Update the file after completing each sub-task, not just after completing an entire parent task.

## Tasks

- [x] 0.0 Create feature branch
  - [x] 0.1 Create and checkout a new branch: `git checkout -b feature/password-based-auth` *(run manually if branch creation had issues)*

- [x] 1.0 Set up database schema and infrastructure
  - [x] 1.1 Read current `supabase-schema.sql` file to understand existing schema
  - [ ] 1.2 Add `password_set_at` timestamp column to track when user completed password setup
  - [ ] 1.3 Add `requires_password_setup` boolean column (default true) for migration tracking
  - [ ] 1.4 Create `user_sessions` table with columns: id, user_id, session_token, created_at, expires_at, last_activity
  - [ ] 1.5 Add indexes on `user_sessions` table for session_token and user_id lookups
  - [ ] 1.6 Create `verification_tokens` table with columns: id, identifier (email/phone), token, type, expires_at, created_at
  - [ ] 1.7 Add index on `verification_tokens` table for token lookups
  - [ ] 1.8 Run schema updates in Supabase SQL Editor
  - [ ] 1.9 Update `lib/supabase/database.types.ts` with new table types
  - [ ] 1.10 Test database connection and verify tables exist

- [ ] 2.0 Implement email/phone verification for signup
  - [ ] 2.1 Create `lib/auth/tokens.ts` utility file for token generation and validation
  - [ ] 2.2 Add function to generate secure random tokens (32+ characters)
  - [ ] 2.3 Add function to generate 6-digit OTP codes
  - [ ] 2.4 Add function to validate and expire tokens (5-minute expiry)
  - [ ] 2.5 Create `lib/email/templates/verification.ts` for email verification template
  - [ ] 2.6 Create API route `app/api/auth/send-verification/route.ts` to send email verification links
  - [ ] 2.7 Create API route `app/api/auth/send-otp/route.ts` to send phone OTP codes
  - [ ] 2.8 Create API route `app/api/auth/verify-token/route.ts` to verify tokens and OTPs
  - [ ] 2.9 Create signup page `app/auth/signup/page.tsx` with email/phone tabs
  - [ ] 2.10 Add form validation for email and phone number formats
  - [ ] 2.11 Create email verification page `app/auth/verify-email/page.tsx` with countdown timer
  - [ ] 2.12 Update existing OTP page `app/auth/verify-otp/page.tsx` for phone verification
  - [ ] 2.13 Add "Resend OTP" functionality with 60-second cooldown
  - [ ] 2.14 Test email verification flow end-to-end
  - [ ] 2.15 Test phone OTP verification flow end-to-end

- [ ] 3.0 Implement password creation flow
  - [ ] 3.1 Create `lib/auth/password.ts` utility for password validation
  - [ ] 3.2 Add function to validate password requirements (8+ chars, 1 number)
  - [ ] 3.3 Add function to check password strength and return feedback
  - [ ] 3.4 Create `components/auth/PasswordInput.tsx` with show/hide toggle
  - [ ] 3.5 Create `components/auth/PasswordStrengthIndicator.tsx` with requirements checklist
  - [ ] 3.6 Create password creation page `app/auth/create-password/page.tsx`
  - [ ] 3.7 Add form with password and confirm password fields
  - [ ] 3.8 Add real-time validation feedback as user types
  - [ ] 3.9 Create API route `app/api/auth/create-password/route.ts`
  - [ ] 3.10 Integrate with Supabase Auth to set password using `updateUser()`
  - [ ] 3.11 Update user record: set `password_set_at`, set `requires_password_setup = false`
  - [ ] 3.12 Automatically log user in after password creation
  - [ ] 3.13 Redirect to homepage after successful password creation
  - [ ] 3.14 Test password creation with various inputs (weak, strong, mismatched)
  - [ ] 3.15 Test error handling for password creation failures

- [ ] 4.0 Implement username/password login
  - [ ] 4.1 Create API route `app/api/auth/login/route.ts` for authentication
  - [ ] 4.2 Add logic to detect if input is email or phone number format
  - [ ] 4.3 Integrate with Supabase Auth `signInWithPassword()` method
  - [ ] 4.4 Return appropriate error messages without revealing if username exists
  - [ ] 4.5 Update signin page `app/auth/signin/page.tsx` completely
  - [ ] 4.6 Replace magic link UI with username and password fields
  - [ ] 4.7 Add "Forgot Password?" link below password field
  - [ ] 4.8 Add placeholder text: "Email or phone number" for username field
  - [ ] 4.9 Add form validation and error display
  - [ ] 4.10 Test login with email and password
  - [ ] 4.11 Test login with phone number and password
  - [ ] 4.12 Test login with incorrect credentials
  - [ ] 4.13 Test that error messages don't reveal whether username exists

- [ ] 5.0 Implement session management with 12-hour timeout
  - [ ] 5.1 Create `lib/auth/session.ts` utility for session management
  - [ ] 5.2 Add function to create session with 12-hour expiry timestamp
  - [ ] 5.3 Add function to validate session and check expiration
  - [ ] 5.4 Add function to update last_activity timestamp (sliding window)
  - [ ] 5.5 Add function to invalidate/delete session
  - [ ] 5.6 Update `middleware.ts` to check session validity on protected routes
  - [ ] 5.7 Add logic to redirect expired sessions to login page with message
  - [ ] 5.8 Add session cleanup logic to remove expired sessions from database
  - [ ] 5.9 Update Header component to include logout button
  - [ ] 5.10 Create logout API route `app/api/auth/logout/route.ts`
  - [ ] 5.11 Implement logout: invalidate session, clear cookies, redirect to homepage
  - [ ] 5.12 Test session creation on successful login
  - [ ] 5.13 Test session validation on protected routes (checkout, orders, admin)
  - [ ] 5.14 Test session expiration after 12 hours of inactivity
  - [ ] 5.15 Test logout functionality

- [ ] 6.0 Implement existing user migration flow
  - [ ] 6.1 Read current auth callback route `app/auth/callback/route.ts`
  - [ ] 6.2 Add logic to check if user has `requires_password_setup = true`
  - [ ] 6.3 If true, redirect to `/auth/create-password` page
  - [ ] 6.4 Add informational message: "Welcome back! Please create a password for faster logins."
  - [ ] 6.5 Store user data in temporary session to prevent blocking access
  - [ ] 6.6 Block access to all routes except `/auth/create-password` until password is set
  - [ ] 6.7 Update middleware to check `requires_password_setup` flag
  - [ ] 6.8 Test migration flow: existing user logs in via magic link
  - [ ] 6.9 Verify user is redirected to password creation
  - [ ] 6.10 Verify user data (orders, profile) remains intact
  - [ ] 6.11 Test that user can successfully log in with new password after migration

- [ ] 7.0 Implement password reset functionality
  - [ ] 7.1 Create forgot password page `app/auth/forgot-password/page.tsx`
  - [ ] 7.2 Add form asking for email OR phone number
  - [ ] 7.3 Add logic to detect input format (email vs phone)
  - [ ] 7.4 Create password reset email template `lib/email/templates/password-reset.ts`
  - [ ] 7.5 Create API route `app/api/auth/reset-password-request/route.ts`
  - [ ] 7.6 For email: generate reset token, send email with reset link
  - [ ] 7.7 For phone: generate OTP, send via SMS
  - [ ] 7.8 Store reset tokens in `verification_tokens` table with 5-minute expiry
  - [ ] 7.9 Create reset password page `app/auth/reset-password/page.tsx`
  - [ ] 7.10 For email users: validate token from URL parameter
  - [ ] 7.11 For phone users: show OTP input form
  - [ ] 7.12 After verification, show new password form (reuse password creation components)
  - [ ] 7.13 Create API route `app/api/auth/reset-password/route.ts`
  - [ ] 7.14 Update password using Supabase Auth `updateUser()` method
  - [ ] 7.15 Invalidate all existing sessions for that user
  - [ ] 7.16 Automatically log user in with new password
  - [ ] 7.17 Test password reset flow for email users
  - [ ] 7.18 Test password reset flow for phone users
  - [ ] 7.19 Test expired reset tokens/OTPs

- [ ] 8.0 Add rate limiting and security measures
  - [ ] 8.1 Create `lib/auth/rate-limit.ts` utility for rate limiting
  - [ ] 8.2 Implement simple in-memory rate limiter (or use package like `rate-limiter-flexible`)
  - [ ] 8.3 Add rate limiting middleware: 5 attempts per 15 minutes per IP for login
  - [ ] 8.4 Add rate limiting: 3 OTP sends per hour per phone number
  - [ ] 8.5 Add rate limiting: 5 password reset requests per hour per email/phone
  - [ ] 8.6 Update login API route to use rate limiting
  - [ ] 8.7 Update OTP send API route to use rate limiting
  - [ ] 8.8 Update password reset API route to use rate limiting
  - [ ] 8.9 Add CSRF token validation to all auth forms
  - [ ] 8.10 Ensure all auth endpoints use HTTPS only (check in production)
  - [ ] 8.11 Add security headers to Next.js config if not already present
  - [ ] 8.12 Test rate limiting: attempt multiple failed logins
  - [ ] 8.13 Test rate limiting: attempt multiple OTP sends
  - [ ] 8.14 Verify appropriate error messages are shown when rate limited

- [ ] 9.0 Update UI components and styling
  - [ ] 9.1 Create consistent auth layout component `components/auth/AuthLayout.tsx`
  - [ ] 9.2 Apply green/yellow theme colors to all auth pages
  - [ ] 9.3 Ensure all forms are mobile-responsive (test on small screens)
  - [ ] 9.4 Add loading spinners to all form submission buttons
  - [ ] 9.5 Add success/error toast notifications for user feedback
  - [ ] 9.6 Ensure password input fields trigger password keyboard on mobile
  - [ ] 9.7 Add autocomplete attributes: `autocomplete="username"` and `autocomplete="new-password"`
  - [ ] 9.8 Ensure all touch targets are at least 44x44px
  - [ ] 9.9 Test color contrast for accessibility (WCAG AA standards)
  - [ ] 9.10 Add proper ARIA labels to all form inputs
  - [ ] 9.11 Test keyboard navigation through all forms
  - [ ] 9.12 Test with screen reader to ensure proper announcements
  - [ ] 9.13 Add focus states to all interactive elements
  - [ ] 9.14 Ensure error messages are clearly visible and accessible

- [ ] 10.0 Testing and documentation
  - [ ] 10.1 Test complete signup flow: email verification → password creation → login
  - [ ] 10.2 Test complete signup flow: phone OTP → password creation → login
  - [ ] 10.3 Test login flow with email and password
  - [ ] 10.4 Test login flow with phone and password
  - [ ] 10.5 Test password reset flow for email users
  - [ ] 10.6 Test password reset flow for phone users
  - [ ] 10.7 Test existing user migration: magic link → password creation
  - [ ] 10.8 Test session timeout after 12 hours
  - [ ] 10.9 Test logout functionality
  - [ ] 10.10 Test that protected routes require authentication
  - [ ] 10.11 Test edge cases: expired tokens, invalid OTPs, weak passwords
  - [ ] 10.12 Test on multiple devices (desktop, mobile, tablet)
  - [ ] 10.13 Test on multiple browsers (Chrome, Safari, Firefox)
  - [ ] 10.14 Update README.md with new authentication flow documentation
  - [ ] 10.15 Document environment variables needed for SMS provider
  - [ ] 10.16 Create migration guide for existing users
  - [ ] 10.17 Document API endpoints in README or separate API.md file
  - [ ] 10.18 Create user-facing announcement about authentication changes
  - [ ] 10.19 Prepare rollback plan documentation
  - [ ] 10.20 Final review of all code before merging

---

**Status**: Detailed sub-tasks generated  
**Total Sub-tasks**: 145  
**Ready for implementation**: Yes
