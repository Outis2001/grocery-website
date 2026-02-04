-- Ambalangoda Grocery Shop Database Schema
-- Run this in your Supabase SQL Editor

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Products Table
CREATE TABLE products (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  name_si TEXT, -- Sinhala name
  name_ta TEXT, -- Tamil name
  price DECIMAL(10, 2) NOT NULL,
  image_url TEXT,
  description TEXT,
  description_si TEXT,
  description_ta TEXT,
  category TEXT NOT NULL,
  is_available BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Orders Table
CREATE TABLE orders (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  order_number TEXT UNIQUE NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  
  -- Customer Info
  user_id UUID REFERENCES auth.users(id),
  customer_name TEXT NOT NULL,
  customer_phone TEXT NOT NULL,
  customer_email TEXT,
  
  -- Fulfillment
  fulfillment_type TEXT NOT NULL CHECK (fulfillment_type IN ('pickup', 'delivery')),
  
  -- Delivery Info (nullable for pickup orders)
  delivery_address TEXT,
  delivery_lat DECIMAL(10, 8),
  delivery_lng DECIMAL(11, 8),
  delivery_distance_km DECIMAL(5, 2),
  
  -- Pricing
  subtotal DECIMAL(10, 2) NOT NULL,
  delivery_fee DECIMAL(10, 2) DEFAULT 0,
  express_delivery BOOLEAN DEFAULT false,
  total DECIMAL(10, 2) NOT NULL,
  
  -- Status
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'confirmed', 'packing', 'ready', 'dispatched', 'completed', 'cancelled')),
  
  -- Notes
  customer_notes TEXT,
  admin_notes TEXT
);

-- Order Items Table
CREATE TABLE order_items (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  order_id UUID REFERENCES orders(id) ON DELETE CASCADE,
  product_id UUID REFERENCES products(id),
  product_name TEXT NOT NULL, -- Snapshot at time of order
  quantity INTEGER NOT NULL CHECK (quantity > 0),
  price_at_purchase DECIMAL(10, 2) NOT NULL,
  subtotal DECIMAL(10, 2) NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Indexes for better performance
CREATE INDEX idx_orders_user_id ON orders(user_id);
CREATE INDEX idx_orders_status ON orders(status);
CREATE INDEX idx_orders_created_at ON orders(created_at DESC);
CREATE INDEX idx_order_items_order_id ON order_items(order_id);
CREATE INDEX idx_products_category ON products(category);
CREATE INDEX idx_products_is_available ON products(is_available);

-- Row Level Security (RLS)
ALTER TABLE products ENABLE ROW LEVEL SECURITY;
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE order_items ENABLE ROW LEVEL SECURITY;

-- Products: Everyone can read, only admins can modify
CREATE POLICY "Anyone can view available products" ON products
  FOR SELECT USING (is_available = true);

CREATE POLICY "Admins can manage products" ON products
  FOR ALL USING (
    auth.jwt() ->> 'email' = 'admin@yourshop.lk'
  );

-- Orders: Users can view their own orders, admins can view all
CREATE POLICY "Users can view their own orders" ON orders
  FOR SELECT USING (
    auth.uid() = user_id OR
    auth.jwt() ->> 'email' = 'admin@yourshop.lk'
  );

CREATE POLICY "Users can create their own orders" ON orders
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Admins can update orders" ON orders
  FOR UPDATE USING (
    auth.jwt() ->> 'email' = 'admin@yourshop.lk'
  );

-- Order Items: Same as orders
CREATE POLICY "Users can view their own order items" ON order_items
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM orders 
      WHERE orders.id = order_items.order_id 
      AND (orders.user_id = auth.uid() OR auth.jwt() ->> 'email' = 'admin@yourshop.lk')
    )
  );

CREATE POLICY "Users can create order items for their orders" ON order_items
  FOR INSERT WITH CHECK (
    EXISTS (
      SELECT 1 FROM orders 
      WHERE orders.id = order_items.order_id 
      AND orders.user_id = auth.uid()
    )
  );

-- Function to generate order number
CREATE OR REPLACE FUNCTION generate_order_number()
RETURNS TEXT AS $$
DECLARE
  new_number TEXT;
BEGIN
  new_number := 'ORD' || TO_CHAR(NOW(), 'YYYYMMDD') || LPAD(NEXTVAL('order_number_seq')::TEXT, 4, '0');
  RETURN new_number;
END;
$$ LANGUAGE plpgsql;

-- Create sequence for order numbers
CREATE SEQUENCE IF NOT EXISTS order_number_seq START 1;

-- Trigger to auto-generate order number
CREATE OR REPLACE FUNCTION set_order_number()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.order_number IS NULL THEN
    NEW.order_number := generate_order_number();
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_set_order_number
BEFORE INSERT ON orders
FOR EACH ROW
EXECUTE FUNCTION set_order_number();

-- Sample Products (Essential Grocery Items - Sri Lankan Context)
INSERT INTO products (name, name_si, price, category, description) VALUES
-- Rice & Grains
('White Rice (1kg)', 'සුදු හාල්', 250, 'Rice & Grains', 'Premium white rice'),
('Red Rice (1kg)', 'රතු හාල්', 280, 'Rice & Grains', 'Nutritious red rice'),
('Samba Rice (1kg)', 'සම්බා හාල්', 300, 'Rice & Grains', 'Samba rice'),

-- Lentils & Pulses
('Red Lentils (500g)', 'පරිප්පු', 180, 'Lentils', 'Red lentils'),
('Green gram (500g)', 'මුං ඇට', 220, 'Lentils', 'Green gram'),

-- Oils & Ghee
('Coconut Oil (750ml)', 'පොල් තෙල්', 450, 'Oils', 'Pure coconut oil'),
('Sunflower Oil (1L)', 'සූරියකාන්ත තෙල්', 550, 'Oils', 'Cooking oil'),

-- Spices
('Curry Powder (100g)', 'කරපිංචා කුඩු', 150, 'Spices', 'Fresh curry powder'),
('Chili Powder (100g)', 'මිරිස් කුඩු', 120, 'Spices', 'Red chili powder'),
('Turmeric (100g)', 'කහ', 100, 'Spices', 'Turmeric powder'),

-- Dairy & Eggs
('Fresh Milk (1L)', 'කිරි', 350, 'Dairy', 'Fresh milk'),
('Eggs (10 pack)', 'බිත්තර', 450, 'Dairy', 'Farm fresh eggs'),
('Yogurt (400g)', 'දඹ', 200, 'Dairy', 'Fresh yogurt'),

-- Vegetables
('Potatoes (1kg)', 'අල', 180, 'Vegetables', 'Fresh potatoes'),
('Onions (1kg)', 'ළුණු', 220, 'Vegetables', 'Red onions'),
('Tomatoes (1kg)', 'තක්කාලි', 200, 'Vegetables', 'Fresh tomatoes'),
('Green Chilies (250g)', 'මිරිස්', 150, 'Vegetables', 'Fresh green chilies'),

-- Bread & Bakery
('White Bread', 'පාන්', 140, 'Bakery', 'Fresh bread loaf'),
('Wheat Bread', 'තිරිඟු පාන්', 180, 'Bakery', 'Wheat bread'),

-- Beverages
('Tea (200g)', 'තේ', 450, 'Beverages', 'Ceylon tea'),
('Coffee (100g)', 'කෝපි', 380, 'Beverages', 'Instant coffee'),

-- Snacks
('Biscuits (200g)', 'බිස්කට්', 180, 'Snacks', 'Assorted biscuits'),
('Vadai (250g)', 'වඩේ', 220, 'Snacks', 'Traditional snack'),

-- Cleaning
('Washing Powder (1kg)', 'සබන් කුඩු', 450, 'Cleaning', 'Laundry detergent'),
('Dish Soap (500ml)', 'පිඟන් සබන්', 180, 'Cleaning', 'Dishwashing liquid'),

-- Personal Care
('Soap (100g)', 'සබන්', 120, 'Personal Care', 'Bath soap'),
('Toothpaste (100g)', 'දන්ත ක්‍රීම්', 200, 'Personal Care', 'Toothpaste'),
('Shampoo (200ml)', 'ෂෑම්පු', 350, 'Personal Care', 'Hair shampoo'),

-- Frozen
('Chicken (1kg)', 'කුකුල් මස්', 950, 'Frozen', 'Frozen chicken'),
('Fish (1kg)', 'මාළු', 850, 'Frozen', 'Frozen fish');

COMMENT ON TABLE products IS 'Product catalog for grocery items';
COMMENT ON TABLE orders IS 'Customer orders with pickup/delivery options';
COMMENT ON TABLE order_items IS 'Individual items in each order';
