# 🔐 Authentication Fix - Testing Guide

## What Was Fixed

### Issue: PKCE Code Verifier Not Found
**Error:** `AuthPKCECodeVerifierMissingError: PKCE code verifier not found in storage`

**Root Cause:** The PKCE (Proof Key for Code Exchange) code verifier wasn't being properly stored in cookies between the sign-in request and the callback.

### Fixes Applied:

1. **✅ Enhanced Browser Client** (`lib/supabase/client.ts`)
   - Added explicit cookie handling for PKCE storage
   - Ensures code verifier persists across page loads

2. **✅ Improved Callback Route** (`app/auth/callback/route.ts`)
   - Better error handling with detailed logging
   - Sets cookies in both cookie store and response
   - Shows specific error messages to user

3. **✅ Better Error Display** (`app/auth/signin/page.tsx`)
   - Shows auth errors from URL parameters
   - User-friendly error messages
   - Proper URL encoding

---

## 🧪 Testing Steps

### Step 1: Restart Dev Server
```bash
# Stop the current server (Ctrl+C)
npm run dev
```

### Step 2: Clear Browser Data
**IMPORTANT:** Clear cookies and localStorage for `localhost:3000`

**Chrome/Edge:**
1. Open DevTools (F12)
2. Go to Application tab
3. Clear Storage → Clear site data
4. Refresh the page

**Or use Incognito/Private window**

### Step 3: Test Sign-In Flow

1. **Go to:** http://localhost:3000
2. **Click:** "Sign In" (or go to http://localhost:3000/auth/signin)
3. **Enter your email** (use the same one you used before)
4. **Click:** "Send Magic Link"
5. **Check your email** inbox
6. **Important:** Open the email link in the **SAME BROWSER** where you initiated sign-in
7. **Click the magic link**
8. ✅ **You should be redirected and logged in!**

---

## ⚠️ Common Issues & Solutions

### Issue 1: Still Getting PKCE Error

**Symptoms:** Same error appears in terminal

**Solutions:**
1. **Clear ALL browser data** for localhost:3000 (including cookies, localStorage, sessionStorage)
2. **Use the same browser** to open the magic link (don't open in Gmail app or different browser)
3. **Don't wait too long** - magic links expire (usually 60 minutes)
4. **Check browser console** for any JavaScript errors

### Issue 2: Different Browser/Device

**Symptom:** Opened email on phone, but signed in on computer

**Solution:** This won't work with PKCE flow. You must:
- Open the magic link on the **same device** where you initiated sign-in
- Copy the link and paste it in the **same browser**

### Issue 3: Email Not Arriving

**Solutions:**
1. Check spam folder
2. Wait 1-2 minutes (Supabase can be slow)
3. Verify Supabase email settings:
   - Go to Supabase Dashboard
   - Authentication → Email Templates
   - Check if "Confirm signup" is enabled

### Issue 4: "Authentication failed" Message

**This means:**
- The magic link expired (typically 60 min)
- The link was already used
- PKCE verifier was cleared from cookies

**Solution:** Try signing in again from scratch

---

## 🔍 Debugging

### Check Terminal Logs
Look for these in your terminal:

**Good:** No errors after clicking magic link
```
✓ Compiled /auth/callback in 159ms (403 modules)
```

**Bad:** PKCE error
```
Auth callback error: AuthPKCECodeVerifierMissingError...
```

### Check Browser Console (F12)
1. Open DevTools before signing in
2. Go to Console tab
3. Watch for any errors during the flow

### Check Network Tab
1. Open DevTools → Network tab
2. Sign in and click magic link
3. Look for `/auth/callback` request
4. Check if cookies are being set

### Check Cookies
1. DevTools → Application → Cookies → http://localhost:3000
2. After clicking "Send Magic Link", you should see Supabase cookies
3. Look for cookies starting with `sb-` prefix

---

## ✅ Success Indicators

You'll know it's working when:

1. ✅ No PKCE errors in terminal
2. ✅ Redirected to homepage (or original destination)
3. ✅ Header shows your user icon/profile
4. ✅ Can access /orders and /checkout pages
5. ✅ Supabase cookies visible in browser DevTools

---

## 🎯 Alternative: Test with Password Auth (Optional)

If magic links keep failing, you can temporarily enable password auth:

### Enable in Supabase:
1. Dashboard → Authentication → Providers
2. Enable "Email" provider
3. Set "Confirm email" to false (for testing)

### Update Code (Temporary):
```typescript
// In app/auth/signin/page.tsx
const { error } = await supabase.auth.signUp({
  email,
  password: 'test123456', // Temporary for testing
})
```

**Note:** This is just for debugging. Magic links are more secure for production.

---

## 📊 Verification Checklist

After signing in successfully:

- [ ] Can see user profile in header
- [ ] Can access `/orders` page
- [ ] Can access `/checkout` page  
- [ ] Can add items to cart
- [ ] Can place an order
- [ ] Can sign out
- [ ] Can sign back in

---

## 🚀 If Everything Works

Once sign-in is working locally:

1. **Test thoroughly** - try signing in multiple times
2. **Test in different browsers** (Chrome, Firefox, Edge)
3. **Ready to deploy!** - Follow the Vercel deployment guide

---

## 🆘 Still Not Working?

If you're still having issues:

### Check These:

1. **Supabase Project Status**
   - Go to Supabase Dashboard
   - Check if project is active (not paused)

2. **Environment Variables**
   - Verify `.env.local` has correct Supabase URL and keys
   - Restart dev server after any `.env.local` changes

3. **Supabase Auth Settings**
   - Dashboard → Authentication → URL Configuration
   - Site URL: `http://localhost:3000`
   - Redirect URLs: `http://localhost:3000/auth/callback`

4. **Email Provider**
   - Check Supabase → Authentication → Email
   - If using custom SMTP, verify credentials

### Get Detailed Error Info:

Add this to `app/auth/callback/route.ts` after line 47:
```typescript
console.log('Full error object:', JSON.stringify(error, null, 2))
console.log('Request URL:', requestUrl.href)
console.log('All cookies:', await cookieStore.getAll())
```

This will show more details in the terminal.

---

## 📝 Summary

**The key fix:** Proper PKCE code verifier storage in cookies via `@supabase/ssr`.

**Most important:** Use the **same browser/device** to click the magic link!

---

**Last Updated:** $(Get-Date -Format "yyyy-MM-dd HH:mm")
