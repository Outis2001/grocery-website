export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      products: {
        Row: {
          id: string
          name: string
          name_si: string | null
          name_ta: string | null
          price: number
          image_url: string | null
          description: string | null
          description_si: string | null
          description_ta: string | null
          category: string
          is_available: boolean
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          name: string
          name_si?: string | null
          name_ta?: string | null
          price: number
          image_url?: string | null
          description?: string | null
          description_si?: string | null
          description_ta?: string | null
          category: string
          is_available?: boolean
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          name?: string
          name_si?: string | null
          name_ta?: string | null
          price?: number
          image_url?: string | null
          description?: string | null
          description_si?: string | null
          description_ta?: string | null
          category?: string
          is_available?: boolean
          created_at?: string
          updated_at?: string
        }
      }
      orders: {
        Row: {
          id: string
          order_number: string
          created_at: string
          updated_at: string
          user_id: string
          customer_name: string
          customer_phone: string
          customer_email: string | null
          fulfillment_type: 'pickup' | 'delivery'
          delivery_address: string | null
          delivery_lat: number | null
          delivery_lng: number | null
          delivery_distance_km: number | null
          subtotal: number
          delivery_fee: number
          express_delivery: boolean
          total: number
          status: 'pending' | 'confirmed' | 'packing' | 'ready' | 'dispatched' | 'completed' | 'cancelled'
          customer_notes: string | null
          admin_notes: string | null
        }
        Insert: {
          id?: string
          order_number?: string
          created_at?: string
          updated_at?: string
          user_id: string
          customer_name: string
          customer_phone: string
          customer_email?: string | null
          fulfillment_type: 'pickup' | 'delivery'
          delivery_address?: string | null
          delivery_lat?: number | null
          delivery_lng?: number | null
          delivery_distance_km?: number | null
          subtotal: number
          delivery_fee?: number
          express_delivery?: boolean
          total: number
          status?: 'pending' | 'confirmed' | 'packing' | 'ready' | 'dispatched' | 'completed' | 'cancelled'
          customer_notes?: string | null
          admin_notes?: string | null
        }
        Update: {
          id?: string
          order_number?: string
          created_at?: string
          updated_at?: string
          user_id?: string
          customer_name?: string
          customer_phone?: string
          customer_email?: string | null
          fulfillment_type?: 'pickup' | 'delivery'
          delivery_address?: string | null
          delivery_lat?: number | null
          delivery_lng?: number | null
          delivery_distance_km?: number | null
          subtotal?: number
          delivery_fee?: number
          express_delivery?: boolean
          total?: number
          status?: 'pending' | 'confirmed' | 'packing' | 'ready' | 'dispatched' | 'completed' | 'cancelled'
          customer_notes?: string | null
          admin_notes?: string | null
        }
      }
      order_items: {
        Row: {
          id: string
          order_id: string
          product_id: string
          product_name: string
          quantity: number
          price_at_purchase: number
          subtotal: number
          created_at: string
        }
        Insert: {
          id?: string
          order_id: string
          product_id: string
          product_name: string
          quantity: number
          price_at_purchase: number
          subtotal: number
          created_at?: string
        }
        Update: {
          id?: string
          order_id?: string
          product_id?: string
          product_name?: string
          quantity?: number
          price_at_purchase?: number
          subtotal?: number
          created_at?: string
        }
      }
    }
  }
}
