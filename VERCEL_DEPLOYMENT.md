# 🚀 Vercel Deployment Guide

## Pre-Deployment Checklist

### ✅ Fixed Issues
- [x] `cookies()` made async for Next.js 15 compatibility
- [x] Dynamic route params properly typed
- [x] `.env.example` file created
- [x] All API routes have proper error handling
- [x] Environment variables properly configured

## Step-by-Step Deployment

### 1. Prerequisites
- [ ] GitHub/GitLab/Bitbucket account
- [ ] Vercel account (free tier works great)
- [ ] Supabase project set up and running
- [ ] Email service configured (Resend or SMTP)

### 2. Push Code to Git Repository

```bash
git init
git add .
git commit -m "Initial commit: Grocery website ready for deployment"
git branch -M main
git remote add origin YOUR_REPO_URL
git push -u origin main
```

### 3. Import Project to Vercel

1. Go to [https://vercel.com](https://vercel.com)
2. Click "Add New Project"
3. Import your Git repository
4. Vercel will auto-detect Next.js settings

### 4. Configure Environment Variables

**CRITICAL:** Add these in Vercel Project Settings → Environment Variables:

```env
# Supabase (REQUIRED)
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key

# Shop Location (REQUIRED)
NEXT_PUBLIC_SHOP_LAT=6.2357
NEXT_PUBLIC_SHOP_LNG=80.0534
NEXT_PUBLIC_SHOP_NAME=Ambalangoda Grocery
NEXT_PUBLIC_SHOP_ADDRESS=No 7/2, Kularathna Cross Road, Ambalangoda
NEXT_PUBLIC_SHOP_PHONE=+94702228573

# Delivery Settings (REQUIRED)
NEXT_PUBLIC_MAX_DELIVERY_RADIUS_KM=5
NEXT_PUBLIC_BASE_DELIVERY_FEE=100
NEXT_PUBLIC_PER_KM_FEE=40
NEXT_PUBLIC_EXPRESS_FEE=150
NEXT_PUBLIC_FREE_DELIVERY_THRESHOLD=5000

# Email - Choose ONE option (REQUIRED)
# Option 1: Resend (Recommended)
RESEND_API_KEY=your_resend_api_key

# Option 2: SMTP
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your_email@gmail.com
SMTP_PASS=your_app_password
SMTP_FROM=your_email@gmail.com

# Admin (REQUIRED)
ADMIN_EMAIL=your_admin_email@gmail.com

# WhatsApp (OPTIONAL)
WHATSAPP_PHONE=94702228573
```

**IMPORTANT NOTES:**
- Variables starting with `NEXT_PUBLIC_` are exposed to the browser
- DO NOT expose sensitive keys (like `RESEND_API_KEY`) with `NEXT_PUBLIC_` prefix
- For Gmail SMTP, use an App Password (not your regular password)

### 5. Deploy

1. Click "Deploy"
2. Vercel will build and deploy your app
3. Wait 2-3 minutes for deployment to complete

### 6. Update Supabase Settings

After deployment, update your Supabase project:

1. Go to Supabase Dashboard → Authentication → URL Configuration
2. Add your Vercel URLs:
   - Site URL: `https://your-app.vercel.app`
   - Redirect URLs:
     ```
     https://your-app.vercel.app/auth/callback
     https://your-app.vercel.app/**
     ```

### 7. Test Your Deployment

Test these critical flows:

- [ ] Homepage loads with products
- [ ] Add items to cart
- [ ] Sign up with OTP works
- [ ] Sign in works
- [ ] Checkout flow completes
- [ ] Order appears in admin dashboard
- [ ] Email notifications sent
- [ ] Map location picker works

### 8. Custom Domain (Optional)

1. Go to Vercel Project Settings → Domains
2. Add your custom domain
3. Update DNS records as instructed
4. Update Supabase URLs with new domain

## Common Deployment Issues

### Build Fails

**Error: "cookies() should be awaited"**
- ✅ Already fixed in this codebase

**Error: "Module not found"**
```bash
# Run locally to verify
npm install
npm run build
```

### Runtime Errors

**Error: "Supabase connection failed"**
- Verify environment variables are set correctly in Vercel
- Check `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_ANON_KEY`

**Error: "Email not sending"**
- Verify `RESEND_API_KEY` or SMTP credentials
- Check Resend domain verification
- For Gmail: Use App Password, enable 2FA first

**Error: "Map not loading"**
- This is normal - Leaflet loads client-side only
- Check browser console for any errors

### Performance Issues

**Slow page loads**
- Enable Vercel Analytics
- Check Supabase performance
- Consider adding more `revalidate` options to pages

**Images not optimized**
- Supabase images are already optimized via `next.config.js`

## Environment-Specific Settings

### Development
```bash
# Use .env.local for local development
cp .env.example .env.local
# Edit .env.local with your local settings
```

### Production (Vercel)
- Set all environment variables in Vercel Dashboard
- Never commit `.env.local` to Git

### Staging (Optional)
- Create a separate Vercel project for staging
- Use different Supabase project or branch

## Monitoring & Maintenance

### Vercel Analytics
- Enable in Project Settings → Analytics
- Monitor page views, performance, errors

### Supabase Logs
- Check Supabase Dashboard → Database → Logs
- Monitor API usage and errors

### Email Monitoring
- **Resend:** Check dashboard for delivery status
- **SMTP:** Check email provider logs

## Scaling Considerations

### Vercel Limits (Free Tier)
- 100GB bandwidth/month
- Serverless function timeout: 10s
- Unlimited deployments

### Supabase Limits (Free Tier)
- 500MB database storage
- 1GB file storage
- 2GB bandwidth
- 50,000 monthly active users

### Upgrade When:
- You exceed free tier limits
- Need faster builds
- Require team collaboration
- Want custom domains on Vercel

## Security Checklist

- [x] `.env.local` is in `.gitignore`
- [x] No API keys in client-side code
- [x] Supabase Row Level Security (RLS) enabled
- [x] CSRF protection via Next.js
- [x] Authentication required for protected routes
- [x] Admin routes protected by email check

## Rollback Strategy

If deployment fails or has issues:

1. Go to Vercel Dashboard → Deployments
2. Find previous working deployment
3. Click "⋯" → "Promote to Production"

## Need Help?

- Vercel Docs: https://vercel.com/docs
- Supabase Docs: https://supabase.com/docs
- Next.js Docs: https://nextjs.org/docs

## Post-Deployment

After successful deployment:

1. Share your site URL with customers
2. Add products to Supabase database
3. Test ordering flow end-to-end
4. Monitor for any errors
5. Collect feedback and iterate

---

**Built with ❤️ for Sri Lankan businesses**

**Deployment Date:** [Add your date here]
**Deployed URL:** [Add your Vercel URL here]
