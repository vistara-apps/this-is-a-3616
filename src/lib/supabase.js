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
CREATE POLICY "Users can insert own data" ON users FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can view own products" ON products FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own products" ON products FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own products" ON products FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete own products" ON products FOR DELETE USING (auth.uid() = user_id);
CREATE POLICY "Users can view own creatives" ON ad_creatives FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own creatives" ON ad_creatives FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own creatives" ON ad_creatives FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete own creatives" ON ad_creatives FOR DELETE USING (auth.uid() = user_id);

-- Usage tracking table
CREATE TABLE IF NOT EXISTS usage_tracking (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES users(user_id) ON DELETE CASCADE,
  action_type TEXT NOT NULL,
  count INTEGER DEFAULT 1,
  month_year TEXT NOT NULL, -- Format: 'YYYY-MM'
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id, action_type, month_year)
);

ALTER TABLE usage_tracking ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can view own usage" ON usage_tracking FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own usage" ON usage_tracking FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own usage" ON usage_tracking FOR UPDATE USING (auth.uid() = user_id);

-- Social accounts table for test posting
CREATE TABLE IF NOT EXISTS social_accounts (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES users(user_id) ON DELETE CASCADE,
  platform TEXT NOT NULL,
  account_name TEXT NOT NULL,
  account_id TEXT,
  access_token TEXT,
  is_test_account BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

ALTER TABLE social_accounts ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can manage own social accounts" ON social_accounts FOR ALL USING (auth.uid() = user_id);
`

// Database operations
export const createUser = async (userData) => {
  const { data, error } = await supabase
    .from('users')
    .insert([{
      user_id: userData.id,
      email: userData.email,
      subscription_plan: 'free'
    }])
    .select()
    .single()

  if (error) throw error
  return data
}

export const getUser = async (userId) => {
  const { data, error } = await supabase
    .from('users')
    .select('*')
    .eq('user_id', userId)
    .single()

  if (error) throw error
  return data
}

export const updateUserSubscription = async (userId, subscriptionPlan) => {
  const { data, error } = await supabase
    .from('users')
    .update({ subscription_plan: subscriptionPlan })
    .eq('user_id', userId)
    .select()
    .single()

  if (error) throw error
  return data
}

export const createProduct = async (productData) => {
  const { data, error } = await supabase
    .from('products')
    .insert([productData])
    .select()
    .single()

  if (error) throw error
  return data
}

export const getUserProducts = async (userId) => {
  const { data, error } = await supabase
    .from('products')
    .select('*')
    .eq('user_id', userId)
    .order('created_at', { ascending: false })

  if (error) throw error
  return data
}

export const createAdCreative = async (creativeData) => {
  const { data, error } = await supabase
    .from('ad_creatives')
    .insert([creativeData])
    .select()
    .single()

  if (error) throw error
  return data
}

export const getUserAdCreatives = async (userId) => {
  const { data, error } = await supabase
    .from('ad_creatives')
    .select(`
      *,
      products (
        product_name,
        uploaded_image_url
      )
    `)
    .eq('user_id', userId)
    .order('created_at', { ascending: false })

  if (error) throw error
  return data
}

export const trackUsage = async (userId, actionType) => {
  const monthYear = new Date().toISOString().slice(0, 7) // YYYY-MM format
  
  const { data, error } = await supabase
    .from('usage_tracking')
    .upsert({
      user_id: userId,
      action_type: actionType,
      month_year: monthYear,
      count: 1
    }, {
      onConflict: 'user_id,action_type,month_year',
      ignoreDuplicates: false
    })
    .select()

  if (error) {
    // If upsert fails, try to increment existing record
    const { data: existingData, error: selectError } = await supabase
      .from('usage_tracking')
      .select('count')
      .eq('user_id', userId)
      .eq('action_type', actionType)
      .eq('month_year', monthYear)
      .single()

    if (!selectError && existingData) {
      const { data: updateData, error: updateError } = await supabase
        .from('usage_tracking')
        .update({ count: existingData.count + 1 })
        .eq('user_id', userId)
        .eq('action_type', actionType)
        .eq('month_year', monthYear)
        .select()

      if (updateError) throw updateError
      return updateData
    }
  }

  return data
}

export const getUserUsage = async (userId, monthYear = null) => {
  const targetMonth = monthYear || new Date().toISOString().slice(0, 7)
  
  const { data, error } = await supabase
    .from('usage_tracking')
    .select('*')
    .eq('user_id', userId)
    .eq('month_year', targetMonth)

  if (error) throw error
  
  // Convert to object for easier access
  const usage = {}
  data.forEach(item => {
    usage[item.action_type] = item.count
  })
  
  return usage
}

export const addSocialAccount = async (accountData) => {
  const { data, error } = await supabase
    .from('social_accounts')
    .insert([accountData])
    .select()
    .single()

  if (error) throw error
  return data
}

export const getUserSocialAccounts = async (userId) => {
  const { data, error } = await supabase
    .from('social_accounts')
    .select('*')
    .eq('user_id', userId)
    .order('created_at', { ascending: false })

  if (error) throw error
  return data
}
