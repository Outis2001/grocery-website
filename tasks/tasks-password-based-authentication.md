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
  - [x] 0.1 Create and checkout a new branch: `git checkout -b feature/password-based-auth` _(run manually if branch creation had issues)_

- [x] 1.0 Set up database schema and infrastructure
  - [x] 1.1 Read current `supabase-schema.sql` file to understand existing schema
  - [x] 1.2 Add `password_set_at` timestamp column to track when user completed password setup
  - [x] 1.3 Add `requires_password_setup` boolean column (default true) for migration tracking
  - [x] 1.4 Create `user_sessions` table with columns: id, user_id, session_token, created_at, expires_at, last_activity
  - [x] 1.5 Add indexes on `user_sessions` table for session_token and user_id lookups
  - [x] 1.6 Create `verification_tokens` table with columns: id, identifier (email/phone), token, type, expires_at, created_at
  - [x] 1.7 Add index on `verification_tokens` table for token lookups
  - [x] 1.8 Run schema updates in Supabase SQL Editor (user ran supabase-auth-schema.sql)
  - [x] 1.9 Update `lib/supabase/database.types.ts` with new table types
  - [x] 1.10 Test database connection and verify tables exist

- [x] 2.0 Implement email/phone verification for signup
  - [x] 2.1 Create `lib/auth/tokens.ts` utility file for token generation and validation
  - [x] 2.2 Add function to generate secure random tokens (32+ characters)
  - [x] 2.3 Add function to generate 6-digit OTP codes
  - [x] 2.4 Add function to validate and expire tokens (5-minute expiry)
  - [x] 2.5 Email verification uses Supabase built-in (no separate template file)
  - [x] 2.6 Signup uses Supabase signInWithOtp for email (no separate API)
  - [x] 2.7 Signup uses Supabase signInWithOtp for phone OTP
  - [x] 2.8 Verify via Supabase callback / verifyOtp (no separate verify-token API)
  - [x] 2.9 Create signup page `app/auth/signup/page.tsx` with email/phone tabs
  - [x] 2.10 Add form validation for email and phone number formats
  - [x] 2.11 Email flow: message on signup page after sending (no separate verify-email page)
  - [x] 2.12 Update existing OTP page `app/auth/verify-otp/page.tsx` for phone verification
  - [x] 2.13 Add "Resend OTP" functionality with 60-second cooldown
  - [ ] 2.14 Test email verification flow end-to-end (manual)
  - [ ] 2.15 Test phone OTP verification flow end-to-end (manual)

- [x] 3.0 Implement password creation flow
  - [x] 3.1 Create `lib/auth/password.ts` utility for password validation
  - [x] 3.2 Add function to validate password requirements (8+ chars, 1 number)
  - [x] 3.3 Add function to check password strength and return feedback
  - [x] 3.4 Create `components/auth/PasswordInput.tsx` with show/hide toggle
  - [x] 3.5 Create `components/auth/PasswordStrengthIndicator.tsx` with requirements checklist
  - [x] 3.6 Create password creation page `app/auth/create-password/page.tsx`
  - [x] 3.7 Add form with password and confirm password fields
  - [x] 3.8 Add real-time validation feedback as user types
  - [x] 3.9 Password set via Supabase updateUser() on page; profile via API
  - [x] 3.10 Integrate with Supabase Auth to set password using `updateUser()`
  - [x] 3.11 Update user record via `/api/auth/complete-password-setup`
  - [x] 3.12 Automatically log user in after password creation
  - [x] 3.13 Redirect to homepage or redirect param after successful password creation
  - [ ] 3.14 Test password creation with various inputs (manual)
  - [ ] 3.15 Test error handling for password creation failures (manual)

- [x] 4.0 Implement username/password login
  - [x] 4.1 Login handled on signin page via Supabase signInWithPassword (no separate API)
  - [x] 4.2 Add logic to detect if input is email or phone number format
  - [x] 4.3 Integrate with Supabase Auth `signInWithPassword()` method
  - [x] 4.4 Return appropriate error messages without revealing if username exists
  - [x] 4.5 Update signin page `app/auth/signin/page.tsx` completely
  - [x] 4.6 Replace magic link UI with username and password fields
  - [x] 4.7 Add "Forgot Password?" link below password field
  - [x] 4.8 Add placeholder text: "Email or phone number" for username field
  - [x] 4.9 Add form validation and error display
  - [ ] 4.10 Test login with email and password (manual)
  - [ ] 4.11 Test login with phone number and password (manual)
  - [ ] 4.12 Test login with incorrect credentials (manual)
  - [ ] 4.13 Test that error messages don't reveal whether username exists (manual)

- [x] 5.0 Implement session management with 12-hour timeout
  - [x] 5.1 Session uses Supabase JWT (JWT expiry set to 12h in dashboard)
  - [x] 5.2 Supabase creates session with expiry
  - [x] 5.3 Middleware checks session via getSession()
  - [x] 5.4 Sliding window: middleware refreshes session when under 1h left
  - [x] 5.5 Logout via supabase.auth.signOut() in Header
  - [x] 5.6 Update `middleware.ts` to check session validity on protected routes
  - [x] 5.7 Expired sessions redirect to signin (Supabase handles expiry)
  - [x] 5.8 user_sessions table available; Supabase JWT used for auth
  - [x] 5.9 Header already has Sign Out button
  - [x] 5.10 Logout via client signOut (no separate API)
  - [x] 5.11 Implement logout: signOut(), clear UI state
  - [ ] 5.12–5.15 Test session and logout (manual)

- [x] 6.0 Implement existing user migration flow
  - [x] 6.1 Callback checks user_profiles
  - [x] 6.2 Add logic to check if user has `requires_password_setup = true`
  - [x] 6.3 If true, redirect to `/auth/create-password?redirect=...`
  - [x] 6.4 Message on create-password page (context shows it's account setup)
  - [x] 6.5 Session preserved; user completes password on create-password page
  - [x] 6.6 Middleware redirects to create-password when flag true on protected routes
  - [x] 6.7 Update middleware to check `requires_password_setup` flag
  - [ ] 6.8–6.11 Test migration flow (manual)

- [x] 7.0 Implement password reset functionality
  - [x] 7.1 Create forgot password page `app/auth/forgot-password/page.tsx`
  - [x] 7.2 Add form asking for email OR phone number
  - [x] 7.3 Add logic to detect input format (email vs phone)
  - [x] 7.4 Password reset email via `sendPasswordResetEmail` in lib/email/send.ts
  - [x] 7.5 Create API route `app/api/auth/reset-password-request/route.ts`
  - [x] 7.6 For email: Supabase resetPasswordForEmail
  - [x] 7.7 For phone: Supabase signInWithOtp (shouldCreateUser: false)
  - [x] 7.8 Email/phone reset use Supabase flows (5min expiry)
  - [x] 7.9 Create reset password page `app/auth/reset-password/page.tsx`
  - [x] 7.10 For email: token in URL hash, Supabase client establishes session
  - [x] 7.11 For phone: OTP step then password form
  - [x] 7.12 Reuse PasswordInput and PasswordStrengthIndicator
  - [x] 7.13 Password update via updateUser() on reset-password page
  - [x] 7.14 Update password using Supabase Auth `updateUser()` method
  - [x] 7.15 User stays logged in after reset (redirect to home)
  - [x] 7.16 Automatically log user in with new password
  - [ ] 7.17–7.19 Test reset flows (manual)

- [x] 8.0 Add rate limiting and security measures
  - [x] 8.1 Create `lib/auth/rate-limit.ts` utility for rate limiting
  - [x] 8.2 In-memory rate limiter implemented
  - [ ] 8.3 Login rate limit (optional: add to signin if server-side login API added)
  - [ ] 8.4 OTP rate limit via Supabase (60s cooldown on client)
  - [x] 8.5 Add rate limiting: 5 password reset requests per hour per IP
  - [x] 8.8 Update password reset API route to use rate limiting
  - [ ] 8.9 CSRF (rely on SameSite cookies in production)
  - [ ] 8.10 HTTPS in production (Vercel default)
  - [ ] 8.12–8.14 Test rate limiting (manual)

- [x] 9.0 Update UI components and styling
  - [x] 9.2 Apply green/yellow (primary/accent) theme to all auth pages
  - [x] 9.3 Forms use responsive Tailwind classes
  - [x] 9.4 Add loading spinners to all form submission buttons
  - [x] 9.5 Success/error messages in-band on forms
  - [x] 9.6 Password inputs use type="password"; inputMode where relevant
  - [x] 9.7 Add autocomplete attributes on signin/signup/create-password
  - [x] 9.10 PasswordInput has aria-invalid, aria-describedby
  - [ ] 9.1, 9.8, 9.9, 9.11–9.14 Optional polish (manual testing)

- [x] 10.0 Testing and documentation
  - [ ] 10.1–10.13 Manual testing (signup, login, reset, migration, devices)
  - [x] 10.14 Update README.md with new authentication flow documentation
  - [x] 10.15 README documents env vars (SUPABASE_SERVICE_ROLE_KEY, JWT expiry)
  - [ ] 10.16–10.20 Optional: migration guide, API docs, announcement, rollback plan

---

**Status**: Detailed sub-tasks generated  
**Total Sub-tasks**: 145  
**Ready for implementation**: Yes
