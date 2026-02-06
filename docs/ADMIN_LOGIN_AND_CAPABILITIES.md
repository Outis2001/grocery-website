# Admin Login & Capabilities

This document describes how to log in as an admin and what admins can do in the grocery website.

---

## How to Log In as an Admin

### 1. Go to the Admin Login Page

- Open your site and go to **`/admin/login`** (e.g. `https://yoursite.com/admin/login`).
- You can also go to **`/admin`** — you will be redirected to `/admin/login` if you are not signed in.

### 2. Enter Your Credentials

- **Admin Email**: The email of an account that has been set up as an admin.
- **Password**: The password for that account (set in Supabase or when the user was created).

### 3. Sign In

- Click **Sign In**.
- If the account is an admin, you are redirected to the **Admin Dashboard** at `/admin`.
- If the account is not an admin, you see: *"Access denied. Admin credentials required."* and are signed out.

### Who Counts as an Admin?

A user is treated as an admin if **either**:

- Their email matches **`NEXT_PUBLIC_ADMIN_EMAIL`** in `.env.local`, or  
- Their profile in the database has **`is_admin = true`** in the `user_profiles` table.

Admin login does **not** require email verification; admins can sign in with email and password only.

### Troubleshooting Login

| Issue | What to check |
|-------|----------------|
| "Invalid email or password" | Correct email/password in Supabase Auth; user exists in **Authentication → Users**. |
| "Access denied. Admin credentials required." | User is not an admin: run the SQL scripts below to promote the user, or set `NEXT_PUBLIC_ADMIN_EMAIL` to this email. |
| "Too many attempts" | Wait and try again (Supabase rate limiting). |
| "Connection error" | Network/server and Supabase project status. |

---

## Creating and Promoting Admin Accounts

Admin accounts are **not** created through the website. They are created in Supabase and then marked as admin via SQL.

### First Admin (Existing User)

If the user already exists in **Supabase → Authentication → Users**:

1. Open **Supabase → SQL Editor**.
2. Open **`migrate-existing-admin.sql`** in the project.
3. Replace the email in the script (e.g. `'benujith@gmail.com'`) with your admin email.
4. Run the script.
5. Set **`NEXT_PUBLIC_ADMIN_EMAIL`** in `.env.local` to that same email (optional but recommended for fallback).

The user can then sign in at **`/admin/login`** with that email and their password.

### Adding Another Admin

1. In Supabase: **Authentication → Users → Add User**.  
   Enter email and password, then confirm the user (e.g. "Confirm email" in the dashboard).
2. In **SQL Editor**, run the contents of **`create-admin-user.sql`**, or run:
   ```sql
   SELECT public.promote_to_admin('admin@example.com');
   ```
   Replace `'admin@example.com'` with the new admin’s email.
3. (Optional) Set **`NEXT_PUBLIC_ADMIN_EMAIL`** in `.env.local` to this email if you want it as the primary fallback admin.

**Prerequisite:** **`supabase-admin-schema.sql`** must have been run first (it creates the `promote_to_admin` function and `is_admin` / `skip_verification` columns).

---

## What Admins Can Do

After logging in at `/admin/login`, admins use the **Admin Dashboard** at **`/admin`**. It has two main sections: **Orders** and **Products**.

### Orders Tab

- **View all orders**  
  List of every order with order number, date, customer, items, and status.

- **Search orders**  
  Search by order number, customer name, or phone number.

- **Filter by status**  
  Filter by: All, Pending, Confirmed, Packing, Ready, Dispatched, Completed, Cancelled.

- **Update order status**  
  Change an order’s status (e.g. Pending → Confirmed → Packing → Ready → Dispatched → Completed) or set to Cancelled.

- **Print invoice**  
  Open a printable invoice for an order (shop name, address, phone, order details, items, totals, delivery fee, customer notes).

### Products Tab

- **View all products**  
  List of products with name, category, price, availability, and image.

- **Search products**  
  Search by product name (including Sinhala name) or category.

- **Filter by category**  
  Show only products in a selected category.

- **Toggle availability**  
  Mark a product as **Available** or **Unavailable** so it can be shown or hidden from the store.

- **Upload product image**  
  For each product: upload an image (replaces existing if any).  
  - Allowed: image files.  
  - Max size: 5 MB.

- **Update product image**  
  Upload a new image for a product that already has one; the old image is replaced.

- **Remove product image**  
  Delete the current image for a product so it has no image.

- **Summary**  
  See counts of total products, products with images, and products without images.

---

## Route Protection

- **`/admin/login`**  
  Public; anyone can open the page. Only admin accounts will successfully sign in and reach the dashboard.

- **`/admin`** and **`/admin/*`** (except `/admin/login`)  
  Protected: if there is no session, the user is redirected to **`/admin/login`** (with an optional `?redirect=/admin` so they return to the dashboard after login).  
  If the user is signed in but is **not** an admin (`is_admin` or `NEXT_PUBLIC_ADMIN_EMAIL`), they are redirected to the home page with an error (e.g. `?error=admin_access_denied`).

---

## Environment Variable

| Variable | Purpose |
|----------|--------|
| `NEXT_PUBLIC_ADMIN_EMAIL` | Email used as **fallback** to treat a user as admin. If the signed-in user’s email matches this value, they are allowed admin access even without `is_admin` in the database. Set this in `.env.local` (e.g. to your primary admin email). |

---

## Related Files

- **`app/admin/login/page.tsx`** — Admin login page and sign-in logic.
- **`app/admin/page.tsx`** — Admin dashboard (orders + products tabs).
- **`components/admin/ProductManagement.tsx`** — Product list, filters, availability toggle, image upload.
- **`components/admin/ProductImageUpload.tsx`** — Upload/update/delete product images.
- **`middleware.ts`** — Redirects unauthenticated users from `/admin` to `/admin/login`.
- **`supabase-admin-schema.sql`** — Schema for `is_admin`, `skip_verification`, and `promote_to_admin()`.
- **`migrate-existing-admin.sql`** — One-time script to mark an existing user as admin.
- **`create-admin-user.sql`** — Script/call to promote any user to admin by email.
