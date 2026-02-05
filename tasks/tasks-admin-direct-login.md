# Tasks: Admin Direct Login

Based on: `prd-admin-direct-login.md`

## Relevant Files

- `app/admin/login/page.tsx` - New admin login page with email/password form
- `middleware.ts` - Update to recognize `/admin/login` as public route and redirect admin routes
- `app/admin/page.tsx` - Update to check `is_admin` flag and redirect to `/admin/login`
- `supabase-admin-schema.sql` - Database schema updates for admin flags
- `migrate-existing-admin.sql` - Migration script for existing admin user
- `create-admin-user.sql` - SQL script template for creating new admin users
- `lib/supabase/database.types.ts` - TypeScript types for new database columns
- `README.md` - Documentation updates for admin user management
- `components/auth/PasswordInput.tsx` - Reused component for password input field

### Notes

- This feature adds a separate admin login flow without affecting regular user authentication
- Admin accounts are created manually via Supabase dashboard + SQL scripts
- The existing `NEXT_PUBLIC_ADMIN_EMAIL` environment variable is used as a fallback

## Instructions for Completing Tasks

**IMPORTANT:** As you complete each task, you must check it off in this markdown file by changing `- [ ]` to `- [x]`. This helps track progress and ensures you don't skip any steps.

Example:
- `- [ ] 1.1 Read file` → `- [x] 1.1 Read file` (after completing)

Update the file after completing each sub-task, not just after completing an entire parent task.

## Tasks

- [x] 0.0 Create feature branch
  - [x] 0.1 Create and checkout a new branch: `git checkout -b feature/admin-direct-login`

- [x] 1.0 Set up database schema for admin flags
  - [x] 1.1 Read current `supabase-schema.sql` or `supabase-auth-schema.sql` to understand existing schema
  - [x] 1.2 Create new file `supabase-admin-schema.sql` in the project root
  - [x] 1.3 Add SQL to create `is_admin` boolean column in `user_profiles` table (default: false)
  - [x] 1.4 Add SQL to create `skip_verification` boolean column in `user_profiles` table (default: false)
  - [x] 1.5 Add SQL to create index on `user_profiles.is_admin` for faster admin lookups
  - [x] 1.6 Create `promote_to_admin()` PostgreSQL function that accepts user email and sets admin flags
  - [x] 1.7 Run the schema updates in Supabase SQL Editor (manual step)
  - [x] 1.8 Update `lib/supabase/database.types.ts` if needed to reflect new columns
  - [x] 1.9 Verify schema changes in Supabase dashboard (manual step)

- [x] 2.0 Create admin login page
  - [x] 2.1 Read existing `app/auth/signin/page.tsx` for reference and component reuse
  - [x] 2.2 Create directory `app/admin/login/`
  - [x] 2.3 Create `app/admin/login/page.tsx` with 'use client' directive
  - [x] 2.4 Import necessary dependencies (useState, useRouter, createClient, PasswordInput, etc.)
  - [x] 2.5 Add state variables for email, password, loading, and error
  - [x] 2.6 Implement redirect logic for already-authenticated admins (check session on mount)
  - [x] 2.7 Create admin login form with email input field (labeled "Admin Email")
  - [x] 2.8 Reuse `<PasswordInput>` component for password field with show/hide toggle
  - [x] 2.9 Add "Sign In" button with loading state (show Loader2 icon when loading)
  - [x] 2.10 Add error message display area with proper styling
  - [x] 2.11 Add professional heading "Admin Access" with shop branding
  - [x] 2.12 Style the page with clean, minimal design matching existing auth pages
  - [x] 2.13 Ensure mobile responsive design (test on mobile viewport)
  - [x] 2.14 Do NOT include links to signup, forgot password, or other user flows

- [x] 3.0 Implement admin authentication logic
  - [x] 3.1 Create handleSignIn function in admin login page
  - [x] 3.2 Call `supabase.auth.signInWithPassword()` with email and password
  - [x] 3.3 Handle authentication errors (invalid credentials) with error message: "Invalid email or password"
  - [x] 3.4 After successful Supabase auth, verify user's email matches `NEXT_PUBLIC_ADMIN_EMAIL`
  - [x] 3.5 Query Supabase `user_profiles` table to check if `is_admin = true` for the user
  - [x] 3.6 If user is admin (email matches OR is_admin flag is true) → redirect to `/admin`
  - [x] 3.7 If user is NOT admin → call `supabase.auth.signOut()` and show error: "Access denied. Admin credentials required."
  - [x] 3.8 Add try-catch block for network errors with message: "Connection error. Please try again."
  - [x] 3.9 Set loading state correctly (disable button during authentication)
  - [x] 3.10 Test rate limiting behavior (Supabase's built-in rate limiting should work)

- [x] 4.0 Update middleware and route protection
  - [x] 4.1 Read current `middleware.ts` to understand existing route protection logic
  - [x] 4.2 Add `/admin/login` to the list of public routes (no authentication required)
  - [x] 4.3 Update protected `/admin` and `/admin/*` routes to redirect to `/admin/login` instead of `/auth/signin`
  - [x] 4.4 Ensure regular user routes (like `/checkout`, `/orders`) still redirect to `/auth/signin`
  - [ ] 4.5 Test middleware by accessing `/admin` without authentication (should redirect to `/admin/login`) (manual test)
  - [ ] 4.6 Test that regular routes still work correctly (manual test)

- [x] 5.0 Update admin dashboard access control
  - [x] 5.1 Read current `app/admin/page.tsx` to understand existing access control
  - [x] 5.2 Add Supabase query to fetch user data including `is_admin` flag from `user_profiles` table
  - [x] 5.3 Update authentication check to verify `is_admin = true` OR email matches `NEXT_PUBLIC_ADMIN_EMAIL` (fallback)
  - [x] 5.4 If user is not authenticated → redirect to `/admin/login?redirect=/admin`
  - [x] 5.5 If user is authenticated but not admin → redirect to `/` with error message
  - [ ] 5.6 Test that regular users cannot access admin dashboard (manual test)
  - [ ] 5.7 Test that admin can access dashboard after logging in via `/admin/login` (manual test)

- [x] 6.0 Create SQL scripts for admin management
  - [x] 6.1 Create `migrate-existing-admin.sql` file in project root
  - [x] 6.2 Add SQL to update existing admin user (benujith@gmail.com) with is_admin and skip_verification flags
  - [x] 6.3 Add SQL to set email_confirmed_at if null
  - [x] 6.4 Add SQL to clear phone_confirmed_at (admins don't need phone verification)
  - [x] 6.5 Create `create-admin-user.sql` template file in project root
  - [x] 6.6 Add parameterized SQL that can be used to promote any user to admin
  - [x] 6.7 Add comments and usage instructions in both SQL files
  - [ ] 6.8 Run `migrate-existing-admin.sql` in Supabase SQL Editor (manual step)
  - [ ] 6.9 Test that existing admin can now log in via `/admin/login` (manual test)

- [x] 7.0 Update documentation and test the complete flow
  - [x] 7.1 Open `README.md` and locate the admin setup section
  - [x] 7.2 Add instructions for creating admin accounts manually via Supabase dashboard
  - [x] 7.3 Document the SQL scripts (`migrate-existing-admin.sql` and `create-admin-user.sql`)
  - [x] 7.4 Add section explaining the new `/admin/login` endpoint
  - [x] 7.5 Document that admins log in without email verification
  - [x] 7.6 Update environment variables section to mention `NEXT_PUBLIC_ADMIN_EMAIL` is used as fallback
  - [ ] 7.7 Test complete flow: Access `/admin/login`, sign in with admin credentials, verify redirect to dashboard (manual test)
  - [ ] 7.8 Test non-admin user cannot access admin dashboard (manual test)
  - [ ] 7.9 Test error messages for invalid credentials (manual test)
  - [ ] 7.10 Test mobile responsive design of admin login page (manual test)
  - [ ] 7.11 Test that regular user authentication still works correctly (no regression) (manual test)
  - [ ] 7.12 Verify all acceptance criteria from PRD are met (manual test)
