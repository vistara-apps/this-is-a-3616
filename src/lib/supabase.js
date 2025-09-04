import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://demo.supabase.co'
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'demo-key'

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// Database schema setup (run these in Supabase SQL editor)
export const createTables = `
-- Users table (extends Supabase auth.users)
CREATE TABLE IF NOT EXISTS users (
  user_id UUID REFERENCES auth.users(id) PRIMARY KEY,
  email TEXT UNIQUE NOT NULL,
  subscription_plan TEXT DEFAULT 'free',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Products table
CREATE TABLE IF NOT EXISTS products (
  product_id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES users(user_id) ON DELETE CASCADE,
  product_name TEXT NOT NULL,
  product_description TEXT,
  uploaded_image_url TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Ad Creatives table
CREATE TABLE IF NOT EXISTS ad_creatives (
  creative_id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES users(user_id) ON DELETE CASCADE,
  product_id UUID REFERENCES products(product_id) ON DELETE CASCADE,
  prompt TEXT NOT NULL,
  image_url TEXT,
  generated_copy TEXT NOT NULL,
  platform TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable Row Level Security
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE products ENABLE ROW LEVEL SECURITY;
ALTER TABLE ad_creatives ENABLE ROW LEVEL SECURITY;

-- Policies
CREATE POLICY "Users can view own data" ON users FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can update own data" ON users FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can view own products" ON products FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own products" ON products FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can view own creatives" ON ad_creatives FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own creatives" ON ad_creatives FOR INSERT WITH CHECK (auth.uid() = user_id);
`