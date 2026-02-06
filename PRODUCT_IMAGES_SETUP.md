# Product Images Setup Guide

This guide will help you set up product image uploads in your grocery website admin panel.

## 🚀 Quick Setup (5 minutes)

### Step 1: Create Storage Bucket in Supabase

1. Go to your Supabase Dashboard: https://cxvbuzkcfvmcifzptnjv.supabase.co
2. Click on **Storage** in the left sidebar
3. Click **New Bucket**
4. Enter the following:
   - **Name**: `product-images`
   - **Public bucket**: ✅ **YES** (check this box)
   - **Allowed MIME types**: Leave empty (allows all image types)
   - **File size limit**: Leave default or set to 5MB
5. Click **Create bucket**

### Step 2: Set Up Storage Policies

1. In Supabase Dashboard, go to **SQL Editor**
2. Click **New query**
3. Copy and paste the contents of `supabase-storage-setup.sql`
4. Click **Run** (or press Ctrl+Enter)
5. You should see "Success. No rows returned"

### Step 3: Test the Upload Feature

1. Make sure your development server is running:

   ```bash
   npm run dev
   ```

2. Go to http://localhost:3000/admin

3. Sign in with your admin email (benujith@gmail.com)

4. Click on the **Products** tab

5. Choose any product and click **Upload Image**

6. Select an image file (JPG, PNG, or WEBP, max 5MB)

7. The image should upload and display immediately!

## ✨ Features

### For Admins:

- **Upload images**: Click "Upload Image" on any product
- **Change images**: Upload a new image to replace the current one
- **Delete images**: Hover over an image and click the X button
- **Search products**: Find products by name or category
- **Filter by category**: View products from specific categories
- **Toggle availability**: Mark products as available/unavailable

### Technical Details:

- Images are stored in Supabase Storage (free 1GB)
- Each image is automatically named with product ID + timestamp
- Old images are automatically deleted when replaced
- Images are served via CDN for fast loading
- Maximum file size: 5MB
- Supported formats: JPG, PNG, WEBP, GIF

## 🎨 How It Works

1. **Upload**: Admin selects an image file
2. **Storage**: Image is uploaded to Supabase Storage bucket
3. **Database**: Product record is updated with the public image URL
4. **Display**: Image appears on the website immediately
5. **Cleanup**: Old images are automatically deleted when replaced

## 📝 Product Image Guidelines

For best results:

- **Recommended size**: 800x800 pixels (square)
- **Format**: JPG or PNG
- **File size**: Keep under 500KB for fast loading
- **Background**: White or transparent
- **Quality**: High resolution, well-lit photos

## 🔧 Troubleshooting

### "Failed to upload image" error

- Check that the storage bucket is named exactly `product-images`
- Verify the storage policies were created successfully
- Make sure the bucket is set to **public**
- Check file size is under 5MB

### Images not displaying

- Check browser console for errors
- Verify the image URL in Supabase (Products table → image_url column)
- Make sure the storage bucket is public
- Try clearing browser cache

### Permission errors

- Verify you're logged in as admin (benujith@gmail.com)
- Check the storage policies are applied correctly
- Try logging out and back in

## 📊 Storage Limits

**Supabase Free Tier:**

- 1GB storage (approximately 2,000-3,000 product images)
- 2GB bandwidth per month
- Unlimited API requests

If you need more storage, upgrade to Supabase Pro ($25/month) for:

- 100GB storage
- 200GB bandwidth
- Priority support

## 🌐 After Deployment

When you deploy to Vercel:

1. No additional configuration needed
2. Images will work automatically
3. Storage is managed by Supabase
4. CDN delivers images globally

## 📱 Mobile Support

The admin panel is mobile-friendly:

- Upload images from your phone
- Take photos with your camera
- Manage products on the go

---

**Need help?** Check the Supabase Storage documentation: https://supabase.com/docs/guides/storage
