# 🛒 Ambalangoda Grocery - Online Grocery Shop

A modern, mobile-first grocery e-commerce platform built for Sri Lankan businesses. Features pickup/delivery options, real-time distance calculation, and seamless order management.

## ✨ Features

### Customer Features
- **Browse Products**: View 30+ essential grocery items organized by category
- **Smart Cart**: Add items with quantity controls, see cart summary
- **Flexible Fulfillment**: Choose between store pickup or home delivery
- **Location-Based Delivery**: Interactive map to select delivery location with 5km radius check
- **Dynamic Pricing**: 
  - Free delivery on orders over LKR 5,000
  - Base fee (LKR 100) + per km rate (LKR 40/km)
  - Optional express delivery (+LKR 150)
- **Authentication**: Sign in via email magic link or phone OTP
- **Order Tracking**: View order history and status updates
- **WhatsApp Integration**: Send order details directly to shop via WhatsApp

### Admin Features
- **Order Dashboard**: View all orders with filtering and search
- **Status Management**: Update order status (pending → confirmed → packing → ready → dispatched → completed)
- **Print Invoices**: Generate printable invoices for orders
- **Real-time Updates**: Orders sync automatically

### Design & UX
- **Mobile-First**: Optimized for Sri Lankan mobile users
- **Organic Theme**: Fresh green & sun-ripened yellow color palette
- **Trilingual Ready**: Structure supports English, Sinhala, and Tamil
- **Fast & Responsive**: Built with Next.js 14 and Tailwind CSS

## 🚀 Tech Stack

- **Framework**: Next.js 14 (App Router)
- **Database**: Supabase (PostgreSQL)
- **Styling**: Tailwind CSS
- **Maps**: Leaflet with OpenStreetMap
- **Email**: Resend (3,000 free/month) or SMTP fallback
- **Auth**: Supabase Auth (Email & Phone OTP)
- **Deployment**: Vercel (recommended)

## 📋 Prerequisites

- Node.js 18+ and npm/yarn
- Supabase account (free tier works)
- Domain name (optional, for custom domain on Vercel)
- Email service:
  - **Option 1**: Resend account (recommended)
  - **Option 2**: Gmail/SMTP credentials

## 🛠️ Setup Instructions

### 1. Clone and Install

```bash
git clone <your-repo-url>
cd ambalangoda-grocery
npm install
```

### 2. Supabase Setup

1. Create a new project at [supabase.com](https://supabase.com)
2. Go to **SQL Editor** and run the `supabase-schema.sql` file
3. Go to **Settings → API** and copy:
   - Project URL
   - Anon/Public key

### 3. Environment Variables

Create a `.env.local` file:

```bash
cp .env.example .env.local
```

Fill in your values:

```env
# Supabase
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key

# Shop Location (Ambalangoda coordinates)
NEXT_PUBLIC_SHOP_LAT=6.2357
NEXT_PUBLIC_SHOP_LNG=80.0534
NEXT_PUBLIC_SHOP_NAME=Ambalangoda Grocery
NEXT_PUBLIC_SHOP_ADDRESS=City Center, Ambalangoda
NEXT_PUBLIC_SHOP_PHONE=+94771234567

# Delivery Settings
NEXT_PUBLIC_MAX_DELIVERY_RADIUS_KM=5
NEXT_PUBLIC_BASE_DELIVERY_FEE=100
NEXT_PUBLIC_PER_KM_FEE=40
NEXT_PUBLIC_EXPRESS_FEE=150
NEXT_PUBLIC_FREE_DELIVERY_THRESHOLD=5000

# Email (Choose Resend OR SMTP)
RESEND_API_KEY=re_xxxxx

# OR use SMTP
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your-email@gmail.com
SMTP_PASS=your-app-password
SMTP_FROM=your-email@gmail.com

# Admin
ADMIN_EMAIL=admin@yourshop.lk

# WhatsApp
WHATSAPP_PHONE=94771234567
```

### 4. Configure Admin Access

Update the SQL policy in Supabase to match your admin email, or run:

```sql
-- Replace admin@yourshop.lk with your actual email
```

### 5. Enable Supabase Auth

In your Supabase dashboard:

1. **Authentication → Providers**:
   - Enable **Email** (OTP/Magic Link)
   - Enable **Phone** (optional, requires SMS provider like Twilio)
   
2. **Authentication → Email Templates**:
   - Customize the magic link email template

3. **Authentication → URL Configuration** (important for magic links):
   - **Site URL**: Use your app URL. For local dev use `http://localhost:3000`; for production use your Vercel URL (e.g. `https://your-app.vercel.app`).
   - **Redirect URLs**: Add both:
     - `http://localhost:3000/auth/callback` (dev)
     - `https://your-app.vercel.app/auth/callback` (replace with your Vercel URL)
   If the magic link sends you to localhost after deploying, set **Site URL** to your Vercel URL and ensure the Vercel callback URL is in **Redirect URLs**.

### 6. Get Email Credentials

**Option A: Resend (Recommended)**
1. Sign up at [resend.com](https://resend.com)
2. Create an API key
3. Add to `.env.local`: `RESEND_API_KEY=re_xxxxx`

**Option B: Gmail SMTP**
1. Enable 2-Factor Authentication on your Google Account
2. Generate an App Password: [myaccount.google.com/apppasswords](https://myaccount.google.com/apppasswords)
3. Add credentials to `.env.local`

### 7. Run Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

## 🌍 Deployment to Vercel

### Deploy the App

1. Push your code to GitHub
2. Go to [vercel.com](https://vercel.com) and import your repository
3. Add all environment variables from `.env.local`, **and set**:
   - `NEXT_PUBLIC_APP_URL` = your Vercel URL (e.g. `https://your-app.vercel.app`) so magic links go to the deployed site, not localhost.
4. In **Supabase Dashboard → Authentication → URL Configuration**:
   - Set **Site URL** to your Vercel URL (e.g. `https://your-app.vercel.app`)
   - Add **Redirect URLs**: `https://your-app.vercel.app/auth/callback` (and keep `http://localhost:3000/auth/callback` for local dev)
5. Deploy!

### Magic link redirects to localhost?

If after deploying to Vercel the magic link sends you to `localhost` instead of your live site:

1. **Vercel**: In Project → Settings → Environment Variables, add:
   - `NEXT_PUBLIC_APP_URL` = `https://your-app.vercel.app` (your actual Vercel URL, no trailing slash)
2. **Supabase**: Dashboard → **Authentication** → **URL Configuration**:
   - Set **Site URL** to `https://your-app.vercel.app`
   - In **Redirect URLs**, add `https://your-app.vercel.app/auth/callback`
3. Redeploy on Vercel after adding the env var, then try sign-in again.

### Connect Hostinger Domain

In Vercel:
1. Go to **Settings → Domains**
2. Add your domain (e.g., `yourshop.lk`)
3. Copy the DNS records shown

In Hostinger:
1. Go to **Domains → DNS/Nameservers**
2. Add Vercel's A records and CNAME
3. Wait for propagation (usually < 1 hour)

## 📱 Phone Auth Setup (Optional)

To enable phone OTP:

1. In Supabase Dashboard → **Authentication → Providers**
2. Enable **Phone**
3. Choose a provider:
   - **Twilio** (most reliable)
   - **MessageBird**
   - **Vonage**
4. Add provider credentials
5. Test with a Sri Lankan number: `+9477XXXXXXX`

**Note**: Phone auth requires a paid SMS provider. For testing, use email auth.

## 🗺️ Adjusting Shop Location

Update your shop's GPS coordinates in `.env.local`:

```env
NEXT_PUBLIC_SHOP_LAT=6.2357
NEXT_PUBLIC_SHOP_LNG=80.0534
```

To find your coordinates:
1. Open Google Maps
2. Right-click your shop location
3. Copy the coordinates (e.g., `6.235700, 80.053400`)

## 📦 Product Management

Products are managed via Supabase:

1. Go to Supabase **Table Editor → products**
2. Add/edit products directly
3. Required fields:
   - `name`: Product name (English)
   - `name_si`: Sinhala name (optional)
   - `price`: Price in LKR
   - `category`: Category name
   - `is_available`: true/false

## 🎨 Customization

### Colors
Edit `tailwind.config.ts`:
```typescript
colors: {
  primary: { /* Your green shades */ },
  accent: { /* Your yellow/orange shades */ }
}
```

### Shop Info
Update in `.env.local`:
```env
NEXT_PUBLIC_SHOP_NAME=Your Shop Name
NEXT_PUBLIC_SHOP_ADDRESS=Your Address
NEXT_PUBLIC_SHOP_PHONE=+94XXXXXXXXX
```

## 🔒 Security Notes

- **Admin Dashboard**: Only accessible to `ADMIN_EMAIL` users
- **Row-Level Security**: Enabled on all Supabase tables
- **Protected Routes**: Checkout and orders require authentication
- **Environment Variables**: Never commit `.env.local` to Git

## 📊 Project Structure

```
├── app/                      # Next.js 14 App Router
│   ├── admin/               # Admin dashboard
│   ├── api/orders/          # Order API routes
│   ├── auth/                # Authentication pages
│   ├── checkout/            # Checkout page
│   ├── orders/              # Order history & success
│   └── page.tsx             # Home page
├── components/
│   ├── cart/                # Cart drawer
│   ├── checkout/            # Location picker
│   ├── home/                # Hero, features
│   ├── layout/              # Header, footer
│   └── products/            # Product grid, cards
├── lib/
│   ├── email/               # Email sending logic
│   ├── supabase/            # Supabase clients & types
│   └── utils/               # Helper functions
├── supabase-schema.sql      # Database schema
├── .env.example             # Environment template
└── README.md
```

## 🤝 Support

For questions or issues:
- Check [Supabase Docs](https://supabase.com/docs)
- Check [Next.js Docs](https://nextjs.org/docs)
- Email: (add your support email)

## 📄 License

MIT License - feel free to use for your business!

---

## 🎯 Quick Start Checklist

- [ ] Install dependencies
- [ ] Create Supabase project
- [ ] Run database schema
- [ ] Configure `.env.local`
- [ ] Enable Supabase Auth
- [ ] Get email credentials (Resend or SMTP)
- [ ] Run `npm run dev`
- [ ] Test signup and order flow
- [ ] Add your products to Supabase
- [ ] Deploy to Vercel
- [ ] Connect domain (optional)

## 🚀 Going Live

1. **Test thoroughly** with real data
2. **Update shop location** coordinates
3. **Add real products** to Supabase
4. **Set up email** (Resend or SMTP)
5. **Configure admin email** in `.env.local`
6. **Deploy to Vercel**
7. **Test on mobile** devices
8. **Share with customers!**

---

**Built with ❤️ for Sri Lankan businesses**
