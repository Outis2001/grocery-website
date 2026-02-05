# PRD: Password-Based Authentication System

## 1. Introduction/Overview

This feature updates the current authentication system from a magic link/OTP-only flow to a traditional username and password system. Currently, users authenticate via email magic links or phone OTP every time they sign in. This PRD outlines a new flow where users verify their identity once (via email link or phone OTP) and then create a password for subsequent logins.

**Problem Solved:** The current magic link/OTP flow requires users to verify their identity on every login, which can be inconvenient for frequent shoppers. A password-based system provides faster, more convenient access while maintaining security through initial verification.

**Goal:** Implement a secure, user-friendly authentication system that verifies user identity on first signup and allows password-based login for all subsequent sessions.

## 2. Goals

1. **Reduce login friction** - Enable users to sign in quickly with username/password instead of waiting for OTP/magic links
2. **Maintain security** - Verify user identity (email/phone) before allowing password creation
3. **Migrate existing users smoothly** - Transition all current users to the new system without data loss
4. **Support both email and phone** - Handle verification and password reset for both authentication methods
5. **Implement session management** - Automatically log users out after 12 hours of inactivity for security

## 3. User Stories

### Story 1: First-Time User with Email
**As a** new user signing up with email  
**I want to** receive a verification link and create a password  
**So that** I can securely access my account on future visits

**Acceptance Criteria:**
- User enters email on signup page
- System sends verification link to email within 30 seconds
- Link expires after 5 minutes
- After clicking link, user is redirected to password creation page
- User cannot proceed without completing password setup
- After password creation, user is logged in and can access the site

### Story 2: First-Time User with Phone
**As a** new user signing up with phone number  
**I want to** receive an OTP code and create a password  
**So that** I can quickly access my account on future visits

**Acceptance Criteria:**
- User enters phone number (format: +94XXXXXXXXX)
- System sends 6-digit OTP via SMS within 30 seconds
- OTP expires after 5 minutes
- After entering valid OTP, user is redirected to password creation page
- User cannot proceed without completing password setup
- After password creation, user is logged in and can access the site

### Story 3: Returning User Login
**As a** returning user  
**I want to** log in with my email/phone and password  
**So that** I can quickly access my account without waiting for verification codes

**Acceptance Criteria:**
- User enters username (email or phone) and password
- System validates credentials
- On success, user is logged in and redirected to homepage or intended page
- On failure, clear error message is shown
- Session remains active for 12 hours of activity
- After 12 hours of inactivity, user is automatically logged out

### Story 4: Existing User Migration
**As an** existing user who previously used magic link/OTP  
**I want to** be prompted to create a password  
**So that** I can continue using the platform with the new authentication method

**Acceptance Criteria:**
- When existing user next logs in via magic link/OTP, they are redirected to password creation
- User must create password before accessing the site
- User's existing order history and data remain intact
- After password creation, user can log in with username/password

### Story 5: Password Reset (Email Users)
**As a** user who forgot my password (email account)  
**I want to** receive a password reset link  
**So that** I can regain access to my account

**Acceptance Criteria:**
- User clicks "Forgot Password" link
- User enters email address
- System sends password reset link to email
- Link expires after 5 minutes
- User clicks link and is directed to reset password page
- User creates new password and is logged in

### Story 6: Password Reset (Phone Users)
**As a** user who forgot my password (phone account)  
**I want to** receive an OTP to reset my password  
**So that** I can regain access to my account

**Acceptance Criteria:**
- User clicks "Forgot Password" link
- User enters phone number
- System sends 6-digit OTP via SMS
- OTP expires after 5 minutes
- User enters OTP and is directed to reset password page
- User creates new password and is logged in

## 4. Functional Requirements

### 4.1 Signup Flow

#### FR-1.1: Email Signup
- The system MUST accept valid email addresses as username input
- The system MUST send a verification link to the provided email address
- The verification link MUST contain a secure, unique token
- The verification link MUST expire after 5 minutes
- The system MUST display a message: "Verification link sent! Please check your email and click the link to continue."

#### FR-1.2: Phone Signup
- The system MUST accept phone numbers in international format (e.g., +94771234567)
- The system MUST validate phone number format before sending OTP
- The system MUST generate a random 6-digit OTP code
- The system MUST send the OTP via SMS to the provided phone number
- The OTP MUST expire after 5 minutes
- The system MUST display an OTP input form with clear instructions

#### FR-1.3: Verification Completion
- Upon successful email link click or OTP entry, the system MUST mark the email/phone as verified
- The system MUST immediately redirect the user to the password creation page
- The system MUST NOT allow users to skip password creation
- The system MUST NOT allow access to any other pages until password is set

### 4.2 Password Creation

#### FR-2.1: Password Requirements
- The system MUST enforce a minimum password length of 8 characters
- The system MUST require at least 1 numeric digit in the password
- The system MUST display password requirements clearly on the form
- The system MUST show real-time validation feedback (e.g., "✓ 8 characters", "✗ Needs a number")

#### FR-2.2: Password Creation Form
- The form MUST include a password input field with show/hide toggle
- The form MUST include a confirm password field
- The system MUST validate that both password fields match
- The system MUST provide clear error messages for validation failures
- Upon successful password creation, the system MUST create a user account in the database
- The system MUST automatically log the user in after password creation
- The system MUST redirect the user to the homepage after successful account creation

### 4.3 Login Flow

#### FR-3.1: Login Form
- The system MUST provide a login form with two fields: username (email or phone) and password
- The system MUST accept both email addresses and phone numbers in the username field
- The system MUST mask password input by default with option to show
- The system MUST include a "Forgot Password?" link

#### FR-3.2: Login Validation
- The system MUST validate credentials against the database
- The system MUST return a clear error message for invalid credentials: "Invalid username or password"
- The system MUST NOT reveal whether the username exists (security best practice)
- The system MUST rate-limit login attempts (max 5 attempts per 15 minutes per IP)
- Upon successful login, the system MUST create a session with 12-hour timeout
- The system MUST redirect the user to their intended destination or homepage

### 4.4 Session Management

#### FR-4.1: Session Creation
- The system MUST create a secure session token upon successful login
- The session token MUST be stored securely (HTTP-only cookie)
- The system MUST record session creation timestamp

#### FR-4.2: Session Timeout
- The system MUST automatically expire sessions after 12 hours of inactivity
- The system MUST check session validity on every protected route access
- When a session expires, the system MUST log the user out
- The system MUST redirect expired users to the login page with message: "Your session has expired. Please log in again."
- The system MUST clear all session data upon expiration

#### FR-4.3: Manual Logout
- The system MUST provide a "Logout" button in the header/menu
- Upon logout, the system MUST invalidate the session
- Upon logout, the system MUST clear all client-side session data
- Upon logout, the system MUST redirect the user to the homepage

### 4.5 Existing User Migration

#### FR-5.1: Detection
- The system MUST identify users who have authenticated via magic link/OTP but have no password set
- The system MUST check password status immediately after magic link/OTP verification

#### FR-5.2: Migration Flow
- When an existing user logs in via magic link/OTP, the system MUST detect they have no password
- The system MUST redirect them to the password creation page
- The system MUST display a message: "Welcome back! To improve your experience, please create a password for faster logins."
- The system MUST block access to all other pages until password is created
- The system MUST preserve the user's existing data (orders, profile, etc.)

### 4.6 Password Reset Flow

#### FR-6.1: Initiate Reset
- The password reset link MUST be clearly visible on the login page
- The system MUST provide a form asking for email OR phone number
- The system MUST detect whether the input is an email or phone format

#### FR-6.2: Email-Based Reset
- If email is provided, the system MUST send a password reset link to that email
- The reset link MUST contain a secure, unique token
- The reset link MUST expire after 5 minutes
- The system MUST display: "Password reset link sent! Check your email."
- When user clicks the link, the system MUST validate the token
- If valid, the system MUST redirect to the password reset form

#### FR-6.3: Phone-Based Reset
- If phone number is provided, the system MUST send a 6-digit OTP via SMS
- The OTP MUST expire after 5 minutes
- The system MUST display an OTP input form
- When user enters valid OTP, the system MUST redirect to the password reset form

#### FR-6.4: Password Reset Form
- The form MUST include two fields: new password and confirm new password
- The system MUST enforce the same password requirements as signup
- Upon successful reset, the system MUST update the password in the database
- The system MUST automatically log the user in with the new password
- The system MUST invalidate any existing sessions for that user
- The system MUST redirect to the homepage with success message: "Password updated successfully!"

## 5. Non-Goals (Out of Scope)

The following features are explicitly OUT OF SCOPE for this version:

1. **Social Login** - Google, Facebook, Apple Sign-In (may be added later)
2. **Two-Factor Authentication (2FA)** - Additional security layer beyond password (future consideration)
3. **Biometric Authentication** - Fingerprint, Face ID (future mobile app feature)
4. **"Remember This Device"** - Extended session beyond 12 hours for trusted devices
5. **Password Complexity Scoring** - Visual strength meter (nice-to-have, not required)
6. **Account Lockout After Failed Attempts** - Permanent account locks (rate limiting is sufficient)
7. **Email Verification Re-send** - Ability to resend verification emails (can be added if needed during testing)
8. **Multiple Sessions** - User can be logged in on multiple devices (single session only for now)

## 6. Design Considerations

### 6.1 UI/UX Requirements

#### Sign-Up Page
- Clean, minimal design consistent with current site branding (green/yellow theme)
- Clear tabs or toggle for "Email" vs "Phone" signup
- Large, accessible input fields optimized for mobile
- Prominent "Send Verification" button
- Link to existing users: "Already have an account? Log in"

#### Verification Pages
- **Email Verification**: 
  - Success page after sending: "Check your inbox! We sent a verification link to [email]"
  - Countdown timer showing link expiration (5 minutes)
  - "Didn't receive it?" text (with note about spam folder)
  
- **Phone OTP**: 
  - 6 large input boxes for OTP digits (auto-focus next box)
  - "Resend OTP" button (disabled for 60 seconds after first send)
  - Countdown timer showing OTP expiration

#### Password Creation Page
- Page title: "Create Your Password"
- Descriptive text: "You'll use this password along with your [email/phone] to log in"
- Password requirements checklist with checkmarks as requirements are met
- Show/hide password toggle (eye icon)
- Large "Create Account" button
- Progress indicator showing this is the final step

#### Login Page
- Page title: "Welcome Back"
- Single username field with placeholder: "Email or phone number"
- Password field with show/hide toggle
- "Forgot password?" link below password field
- Large "Log In" button
- Link to signup: "New here? Create an account"

#### Password Reset Pages
- Page title: "Reset Your Password"
- Step 1: Form asking for email or phone
- Step 2: Verification (link click or OTP entry)
- Step 3: New password form (same as password creation page)
- Success message after completion

### 6.2 Mobile-First Considerations
- All forms MUST be optimized for mobile screens (site is primarily used on mobile)
- Input fields MUST trigger appropriate keyboards (email, phone, numeric for OTP)
- Touch targets MUST be at least 44x44px for buttons
- Error messages MUST be clearly visible above the keyboard
- Forms MUST use auto-complete attributes for password managers

### 6.3 Accessibility
- All forms MUST have proper labels and ARIA attributes
- Error messages MUST be announced to screen readers
- Password visibility toggle MUST be keyboard accessible
- Color contrast MUST meet WCAG AA standards (text on green/yellow backgrounds)

## 7. Technical Considerations

### 7.1 Technology Stack
- **Framework**: Next.js 14 (App Router) - already in use
- **Database**: Supabase PostgreSQL - already in use
- **Auth Provider**: Supabase Auth - already configured
- **Email**: Resend or SMTP - already configured
- **SMS**: Supabase Phone Auth (requires SMS provider like Twilio)

### 7.2 Database Schema Changes

#### Update `users` table (or Supabase auth.users):
```sql
-- Add password_hash column if not using Supabase Auth's built-in password storage
ALTER TABLE auth.users ADD COLUMN IF NOT EXISTS password_set_at TIMESTAMP;

-- Track when user completed password setup for migration tracking
ALTER TABLE auth.users ADD COLUMN IF NOT EXISTS requires_password_setup BOOLEAN DEFAULT true;
```

#### Create `sessions` table:
```sql
CREATE TABLE user_sessions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  session_token TEXT UNIQUE NOT NULL,
  created_at TIMESTAMP DEFAULT NOW(),
  expires_at TIMESTAMP NOT NULL,
  last_activity TIMESTAMP DEFAULT NOW()
);

-- Index for quick session lookups
CREATE INDEX idx_sessions_token ON user_sessions(session_token);
CREATE INDEX idx_sessions_user ON user_sessions(user_id);
```

#### Create `verification_tokens` table:
```sql
CREATE TABLE verification_tokens (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  identifier TEXT NOT NULL, -- email or phone
  token TEXT UNIQUE NOT NULL,
  type TEXT NOT NULL, -- 'email_verify', 'phone_otp', 'password_reset'
  expires_at TIMESTAMP NOT NULL,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Index for token lookups
CREATE INDEX idx_verification_tokens ON verification_tokens(token);
```

### 7.3 Security Considerations

1. **Password Storage**: 
   - MUST use Supabase Auth's built-in password hashing (bcrypt)
   - NEVER store passwords in plain text

2. **Token Generation**: 
   - Email verification links MUST use cryptographically secure random tokens (32+ characters)
   - OTP codes MUST be truly random 6-digit numbers
   - All tokens MUST be stored hashed in database

3. **Rate Limiting**:
   - Login attempts: Max 5 per 15 minutes per IP
   - OTP sends: Max 3 per hour per phone number
   - Password reset: Max 5 per hour per email/phone

4. **Session Security**:
   - Use HTTP-only, Secure, SameSite cookies
   - Regenerate session token after password change
   - Implement CSRF protection on all forms

5. **Transport Security**:
   - All authentication endpoints MUST use HTTPS
   - No sensitive data in URL parameters

### 7.4 Integration Points

1. **Supabase Auth**: 
   - Leverage existing Supabase Auth methods: `supabase.auth.signUp()`, `supabase.auth.signInWithPassword()`
   - Use Supabase's built-in email/phone verification
   - Extend with custom session management for 12-hour timeout

2. **Email Service**:
   - Use existing Resend/SMTP configuration
   - Email templates needed: verification email, password reset email

3. **SMS Service**:
   - Configure Supabase Phone Auth with Twilio (or similar)
   - Templates needed: OTP message, password reset OTP

4. **Existing Pages**:
   - Update `/app/auth/signin/page.tsx` - add password field, remove magic link UI
   - Update `/app/auth/callback/route.ts` - handle redirects to password setup
   - Add new pages: `/app/auth/create-password/page.tsx`, `/app/auth/reset-password/page.tsx`
   - Update middleware: check session validity on protected routes

### 7.5 Migration Strategy

**Phase 1: Preparation**
1. Add `requires_password_setup` flag to all existing users
2. Deploy new authentication pages without breaking current flow
3. Test email and SMS delivery in production

**Phase 2: Soft Launch**
1. Update login page with password field (but keep magic link as fallback)
2. When existing users log in via magic link, redirect to password setup
3. Monitor for issues, gather feedback

**Phase 3: Hard Cutover**
1. Remove magic link option from login page
2. Force all remaining users to set password on next login
3. Send announcement email to all users explaining the change

**Rollback Plan**: If critical issues arise, revert to magic link/OTP only flow via feature flag

## 8. Success Metrics

### Primary Metrics
1. **Migration Rate**: 95%+ of existing users create passwords within 30 days
2. **Login Success Rate**: 85%+ of login attempts succeed on first try
3. **Session Abandonment**: <5% of users abandon during password setup
4. **Time to Login**: Average login time reduces from 45 seconds (OTP wait) to <10 seconds

### Secondary Metrics
1. **Password Reset Rate**: <10% of users reset password within first 30 days (indicates good password memorability)
2. **Support Tickets**: <5% increase in auth-related support requests
3. **User Satisfaction**: Positive feedback on faster login experience
4. **Security Incidents**: Zero password breaches or unauthorized access incidents

### Technical Metrics
1. **Session Management**: 99.9% uptime for session validation
2. **Email Delivery**: 95%+ verification emails delivered within 30 seconds
3. **SMS Delivery**: 90%+ OTP messages delivered within 30 seconds (lower due to carrier delays)
4. **API Response Time**: Auth endpoints respond in <500ms at p95

## 9. Open Questions

1. **Password Manager Integration**: Should we add specific autocomplete attributes to improve password manager integration? (Recommendation: Yes, use `autocomplete="username"` and `autocomplete="new-password"`) yes

2. **Account Recovery**: If a user loses access to both their email/phone AND forgets their password, what recovery options should exist? (Recommendation: Manual support verification process)Manual support verification process

3. **Username Change**: Should users be able to change their username (email/phone) after account creation? (Out of scope for v1, but worth discussing)No

4. **Session Renewal**: Should the 12-hour timeout reset with each action (sliding window) or be absolute from login? (Recommendation: Sliding window - resets on each activity) Sliding window

5. **Multi-device Sessions**: Current design supports single session. Should we allow users to be logged in on multiple devices simultaneously in the future? (Future consideration) No

6. **Password History**: Should the system prevent users from reusing recent passwords? (Not required for v1, but consider for future security enhancement)

7. **Notification on New Login**: Should users receive email/SMS when a new login occurs on their account? (Good security practice, but may cause notification fatigue - consider for v2)

8. **Grace Period for Existing Users**: Should we give existing users a grace period (e.g., 7 days) where they can still use magic link before forcing password creation? (Recommendation: No grace period to ensure clean migration) No grace period to ensure clean migration

---

## Implementation Priority

**Phase 1 - MVP (Week 1-2)**
- FR-1: Signup flow with email/phone verification
- FR-2: Password creation
- FR-3: Login flow
- FR-4: Basic session management

**Phase 2 - Migration (Week 2-3)**
- FR-5: Existing user migration flow
- Testing with staging users
- Email announcements to users

**Phase 3 - Recovery (Week 3-4)**
- FR-6: Password reset flow
- Rate limiting implementation
- Security hardening

**Phase 4 - Polish (Week 4+)**
- UI/UX improvements based on feedback
- Performance optimization
- Comprehensive testing
- Documentation

---

**Document Version**: 1.0  
**Last Updated**: February 5, 2026  
**Author**: Product Team  
**Status**: Ready for Development
