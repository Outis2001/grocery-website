import { User } from '@supabase/supabase-js';

/**
 * User profile from user_profiles table (joined with auth.users)
 */
export interface UserProfile {
  id: string;
  user_id: string;
  email?: string;
  phone?: string | null;
  is_admin: boolean;
  skip_verification: boolean;
  created_at: string;
  updated_at: string;
}

/**
 * Auth user extending Supabase User with optional profile
 */
export interface AuthUser extends User {
  profile?: UserProfile;
}

/**
 * Product from products table
 */
export interface Product {
  id: string;
  name: string;
  name_si: string | null;
  name_ta?: string | null;
  category: string;
  price: number;
  is_available: boolean;
  image_url: string | null;
  description?: string | null;
  created_at: string;
  updated_at: string;
}

/**
 * Order item (product line in an order)
 */
export interface OrderItem {
  id?: string;
  order_id?: string;
  product_id: string;
  product_name: string;
  quantity: number;
  price_at_purchase?: number;
  price?: number;
  subtotal?: number;
  created_at?: string;
}

/**
 * Order status
 */
export type OrderStatus =
  | 'pending'
  | 'confirmed'
  | 'packing'
  | 'ready'
  | 'dispatched'
  | 'completed'
  | 'cancelled';

/**
 * Order from orders table
 */
export interface Order {
  id: string;
  order_number: string;
  user_id: string;
  customer_name: string;
  customer_phone: string;
  customer_email: string | null;
  fulfillment_type: 'pickup' | 'delivery';
  delivery_address: string | null;
  delivery_lat: number | null;
  delivery_lng: number | null;
  delivery_distance_km: number | null;
  subtotal: number;
  delivery_fee: number;
  express_delivery: boolean;
  total: number;
  status: OrderStatus;
  customer_notes: string | null;
  admin_notes: string | null;
  created_at: string;
  updated_at: string;
  order_items?: OrderItem[];
}
