# Product Requirements Document: Admin Direct Login

## Introduction/Overview

Currently, all users (including admins) must go through email or phone verification before they can log in to the system. This creates unnecessary friction for administrators who need quick access to the admin dashboard. This feature will implement a streamlined admin authentication flow where administrators can log in directly using their email and password without any verification steps, while regular users continue to use the existing verification-based authentication.

**Problem:** Admin users must complete email/phone verification steps during signup and login, which adds unnecessary delays and complexity to administrative access.

**Solution:** Create a separate admin login page that allows administrators to authenticate using only their email address and password, bypassing all verification requirements.

## Goals

1. Enable admins to log in instantly using email + password without verification steps
2. Maintain security by keeping admin account creation manual (via Supabase dashboard)
3. Provide a dedicated admin login experience separate from regular user flows
4. Migrate existing admin account to work with the new verification-free flow
5. Ensure the new admin flow doesn't interfere with existing regular user authentication

## User Stories

### As an Administrator:
- I want to access `/admin/login` so that I can quickly sign in to the admin dashboard
- I want to enter my email and password to authenticate without waiting for email verification
- I want to be redirected to the admin dashboard immediately after successful login
- I want clear error messages if my credentials are incorrect

### As a System Administrator:
- I want to create admin accounts manually through Supabase so that I control who has admin access
- I want to ensure admin accounts are marked to skip verification in the database
- I want to verify that regular users cannot access the admin login flow

## Functional Requirements

### FR1: Admin Login Page
1.1. Create a new page at `/admin/login` dedicated to admin authentication
1.2. Display a clean, professional login form with:
  - Email input field (labeled "Admin Email")
  - Password input field with show/hide toggle
  - "Sign In" button
  - Error message display area
1.3. Include clear branding/heading indicating this is admin access (e.g., "Admin Access")
1.4. Do NOT include links to signup, forgot password, or other user flows
1.5. Redirect already-authenticated admins directly to `/admin`

### FR2: Admin Authentication Logic
2.1. Use Supabase `signInWithPassword` with email + password
2.2. After successful Supabase authentication, verify the user's email matches `NEXT_PUBLIC_ADMIN_EMAIL`
2.3. If email matches → redirect to `/admin` dashboard
2.4. If email doesn't match → sign out the user and show error: "Access denied. Admin credentials required."
2.5. If authentication fails → show error: "Invalid email or password"
2.6. Handle rate limiting to prevent brute force attacks (use existing Supabase rate limiting)

### FR3: Database Schema Updates
3.1. Add `is_admin` boolean column to the `users` table (default: false)
3.2. Add `skip_verification` boolean column to the `users` table (default: false)
3.3. Create a database function or manual SQL to mark admin users:
  - Set `is_admin = true`
  - Set `skip_verification = true`
  - Set `email_confirmed_at = now()` if null
3.4. Add index on `users.is_admin` for faster admin lookups

### FR4: Admin Account Creation Process
4.1. Document the manual process for creating admin accounts in Supabase:
  - Go to Authentication → Users → Add User
  - Enter admin email and password
  - Confirm the email immediately
  - Run SQL to set `is_admin = true` and `skip_verification = true`
4.2. Create a SQL script (`create-admin-user.sql`) that:
  - Takes an email parameter
  - Updates the user record to set admin flags
  - Confirms the email automatically
4.3. Document in README.md how to create and manage admin users

### FR5: Existing Admin Migration
5.1. Create a migration SQL script to update existing admin user (benujith@gmail.com):
  - Set `is_admin = true`
  - Set `skip_verification = true`
  - Set `email_confirmed_at = now()` if not already set
  - Set `phone_confirmed_at = null` (admins don't need phone verification)
5.2. Document that this script should be run once during deployment

### FR6: Admin Dashboard Access Control
6.1. Update `/admin/page.tsx` to check `is_admin` flag from database instead of only checking email
6.2. Keep email check as a fallback for backward compatibility
6.3. If user is not admin → redirect to `/` with error message
6.4. If user is not authenticated → redirect to `/admin/login?redirect=/admin`

### FR7: Middleware Updates
7.1. Update `middleware.ts` to recognize `/admin/login` as a public route (no auth required)
7.2. Update `/admin/*` routes to redirect to `/admin/login` instead of `/auth/signin`
7.3. Ensure regular user routes still redirect to `/auth/signin`

### FR8: Error Handling & Security
8.1. Implement rate limiting on admin login attempts (leverage Supabase built-in)
8.2. Log failed admin login attempts for security monitoring
8.3. Clear session data on failed admin verification
8.4. Show generic error messages to prevent email enumeration
8.5. Add CSRF protection to admin login form

## Non-Goals (Out of Scope)

1. **Forgot Password Flow for Admins** - Admins must manually reset passwords via Supabase dashboard
2. **Admin Self-Registration** - Admin accounts can only be created manually by system administrators
3. **Multi-Factor Authentication (MFA)** - Not included in this phase, but can be added later
4. **Admin Role-Based Access Control (RBAC)** - All admins have full access; granular permissions are out of scope
5. **Admin API Keys** - This feature only covers web UI login
6. **Changing Regular Users to Admins via UI** - Must be done manually via SQL
7. **Admin Password Reset Flow** - Admins reset passwords through Supabase dashboard only
8. **Session Management Differences** - Admins use the same 12-hour session timeout as regular users

## Design Considerations

### UI/UX Requirements
- Admin login page should have a professional, minimal design
- Use existing design system components (same input fields, buttons as `/auth/signin`)
- Color scheme: Consider using a distinct color accent (e.g., darker theme) to visually differentiate admin login from user login
- Include shop logo/name at the top for brand consistency
- Mobile responsive design (admins may log in from phones)

### Component Reuse
- Reuse `<PasswordInput>` component from existing auth pages
- Use same form styling and layout patterns
- Reuse error message components

### Mockup/Layout
```
┌─────────────────────────────────────┐
│     [Shop Logo]                     │
│                                     │
│     Admin Access                    │
│     ─────────────────               │
│                                     │
│     Admin Email                     │
│     ┌─────────────────────────┐    │
│     │ admin@example.com       │    │
│     └─────────────────────────┘    │
│                                     │
│     Password                        │
│     ┌─────────────────────────┐ 👁  │
│     │ ••••••••••••            │    │
│     └─────────────────────────┘    │
│                                     │
│     [Error message here]            │
│                                     │
│     ┌─────────────────────────┐    │
│     │      Sign In            │    │
│     └─────────────────────────┘    │
│                                     │
└─────────────────────────────────────┘
```

## Technical Considerations

### Dependencies
- **Supabase Auth**: Uses existing `signInWithPassword` method
- **Next.js 15**: Server-side authentication checks
- **Middleware**: Route protection and redirection logic

### Database Schema
```sql
-- Add columns to users table
ALTER TABLE users 
ADD COLUMN is_admin BOOLEAN DEFAULT false,
ADD COLUMN skip_verification BOOLEAN DEFAULT false;

-- Add index for performance
CREATE INDEX idx_users_is_admin ON users(is_admin) WHERE is_admin = true;

-- Function to promote user to admin
CREATE OR REPLACE FUNCTION promote_to_admin(user_email TEXT)
RETURNS void AS $$
BEGIN
  UPDATE users 
  SET 
    is_admin = true,
    skip_verification = true,
    email_confirmed_at = COALESCE(email_confirmed_at, now())
  WHERE email = user_email;
END;
$$ LANGUAGE plpgsql;
```

### Security Considerations
1. **Email Enumeration Prevention**: Use generic error messages
2. **Rate Limiting**: Leverage Supabase's built-in rate limiting (6 attempts per hour per IP)
3. **Session Security**: Admin sessions use same secure cookies as regular users
4. **HTTPS Only**: Admin login must only work over HTTPS in production
5. **Audit Logging**: Consider adding admin action logging (future enhancement)

### Integration Points
- **Existing Auth System**: Works alongside regular user authentication
- **Admin Dashboard**: Seamless integration with existing `/admin` routes
- **Environment Variables**: Uses existing `NEXT_PUBLIC_ADMIN_EMAIL` for fallback checks

### Error Scenarios
| Scenario | User Experience | Technical Handling |
|----------|----------------|-------------------|
| Invalid email/password | "Invalid email or password" | Supabase auth error |
| Non-admin user attempts login | "Access denied. Admin credentials required." | Check `is_admin` flag + email |
| Network error | "Connection error. Please try again." | Catch fetch/network errors |
| Admin account not verified | Auto-verify, then log in | Update `email_confirmed_at` |
| Rate limit exceeded | "Too many attempts. Try again later." | Supabase rate limit error |

## Success Metrics

1. **Admin Login Time**: Reduce average admin login time from ~2 minutes (with email verification) to <10 seconds
2. **Admin Login Success Rate**: >95% first-attempt success rate for valid credentials
3. **Zero Bypass Attempts**: No successful authentication of non-admin users via admin login
4. **System Security**: No increase in security incidents or unauthorized access
5. **Admin Satisfaction**: Positive feedback from admin users on improved login experience

### Measurable Outcomes
- Time to first admin dashboard access after deployment: <30 seconds
- Number of failed admin login attempts per day: <5 (indicating system is working correctly)
- Regular user authentication flow remains unaffected (no regression)

## Open Questions

1. **Password Complexity Requirements**: Should we enforce specific password complexity rules for admin accounts? (e.g., minimum 12 characters, special characters)
   - *Recommendation*: Yes, enforce stronger requirements than regular users

2. **Admin Session Duration**: Should admin sessions be shorter than regular users for security?
   - *Current*: Same 12-hour timeout as users
   - *Alternative*: Consider 4-hour timeout for admins

3. **Multiple Admins**: How many admin accounts do we expect to support?
   - *Impact*: If >10 admins, consider building an admin management UI
   - *Current assumption*: 1-3 admin accounts

4. **Admin Login Monitoring**: Should we send email notifications when admin accounts log in?
   - *Security consideration*: Helps detect unauthorized access
   - *Recommendation*: Add in future phase

5. **Backward Compatibility**: What happens if `NEXT_PUBLIC_ADMIN_EMAIL` is set but database `is_admin` flag is false?
   - *Recommendation*: Email check takes precedence (fallback behavior)

## Implementation Notes

### Phase 1: Core Functionality (MVP)
- Create `/admin/login` page
- Update database schema
- Implement authentication logic
- Migrate existing admin user
- Update middleware and route protection

### Phase 2: Enhancements (Future)
- Admin password reset flow
- Email notifications on admin login
- Admin activity audit log
- Support for multiple admin users via UI
- Admin-specific session timeout

### Testing Checklist
- [ ] Admin can log in with email + password at `/admin/login`
- [ ] Non-admin users are rejected at admin login
- [ ] Existing admin account (benujith@gmail.com) works with new flow
- [ ] Regular user authentication is unaffected
- [ ] Redirect flows work correctly (auth → admin dashboard)
- [ ] Error messages are clear and secure
- [ ] Rate limiting prevents brute force
- [ ] Mobile responsive design works
- [ ] Session persistence works across page refreshes
- [ ] Sign out functionality works correctly

## Acceptance Criteria

### Must Have (Launch Blockers)
1. ✅ Admin login page exists at `/admin/login`
2. ✅ Admins can authenticate with email + password only
3. ✅ Non-admins cannot access admin dashboard
4. ✅ Existing admin (benujith@gmail.com) can log in without verification
5. ✅ Regular user flows are unaffected
6. ✅ Basic error handling and security measures in place

### Should Have (High Priority)
1. ✅ Professional, clean UI design
2. ✅ Clear documentation for creating admin users
3. ✅ SQL scripts for admin management
4. ✅ Rate limiting on login attempts

### Nice to Have (Can Be Added Later)
1. Admin login notifications
2. Audit logging
3. Custom admin session duration
4. Admin management UI

---

**Document Version:** 1.0  
**Created:** 2026-02-05  
**Last Updated:** 2026-02-05  
**Status:** Draft - Ready for Implementation
