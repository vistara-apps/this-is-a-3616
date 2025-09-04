# AdAlchemy Deployment Guide

## Overview

This guide provides step-by-step instructions for deploying AdAlchemy to production. The application consists of a React frontend with multiple backend services.

## Prerequisites

- Node.js 18+ installed
- Git repository access
- Supabase account
- OpenRouter account (for OpenAI API access)
- Stripe account (for payments)
- Domain name (optional but recommended)

## Architecture Overview

```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   Frontend      │    │   Supabase      │    │   External APIs │
│   (React/Vite)  │────│   (Database +   │    │   - OpenRouter  │
│   - Vercel      │    │    Auth)        │    │   - Stripe      │
│   - Netlify     │    │                 │    │   - Social APIs │
└─────────────────┘    └─────────────────┘    └─────────────────┘
```

## Step 1: Environment Setup

### 1.1 Clone Repository
```bash
git clone <repository-url>
cd adalchemy
npm install
```

### 1.2 Environment Variables
Create `.env` file with the following variables:

```env
# Supabase Configuration
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key

# OpenAI Configuration (using OpenRouter)
VITE_OPENAI_API_KEY=your_openrouter_api_key

# Stripe Configuration
VITE_STRIPE_PUBLISHABLE_KEY=pk_live_your_stripe_publishable_key
```

## Step 2: Supabase Setup

### 2.1 Create Supabase Project
1. Go to [supabase.com](https://supabase.com)
2. Create new project
3. Note down your project URL and anon key

### 2.2 Database Setup
Run the following SQL in your Supabase SQL editor:

```sql
-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

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

-- Enable Row Level Security
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE products ENABLE ROW LEVEL SECURITY;
ALTER TABLE ad_creatives ENABLE ROW LEVEL SECURITY;
ALTER TABLE usage_tracking ENABLE ROW LEVEL SECURITY;
ALTER TABLE social_accounts ENABLE ROW LEVEL SECURITY;

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

CREATE POLICY "Users can view own usage" ON usage_tracking FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own usage" ON usage_tracking FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own usage" ON usage_tracking FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can manage own social accounts" ON social_accounts FOR ALL USING (auth.uid() = user_id);
```

### 2.3 Authentication Setup
1. Go to Authentication > Settings
2. Configure Site URL: `https://yourdomain.com`
3. Add redirect URLs:
   - `https://yourdomain.com/auth/callback`
   - `http://localhost:5173/auth/callback` (for development)

### 2.4 Storage Setup (Optional)
If you want to store images in Supabase:
1. Go to Storage
2. Create bucket named `product-images`
3. Set up policies for authenticated users

## Step 3: OpenRouter Setup

### 3.1 Create Account
1. Go to [openrouter.ai](https://openrouter.ai)
2. Create account and get API key
3. Add credits to your account

### 3.2 Test API Access
```bash
curl -X POST "https://openrouter.ai/api/v1/chat/completions" \
  -H "Authorization: Bearer YOUR_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "model": "google/gemini-2.0-flash-001",
    "messages": [{"role": "user", "content": "Hello"}]
  }'
```

## Step 4: Stripe Setup

### 4.1 Create Stripe Account
1. Go to [stripe.com](https://stripe.com)
2. Create account and complete verification
3. Get publishable and secret keys

### 4.2 Create Products and Prices
```bash
# Create Creator plan
stripe products create \
  --name="Creator Plan" \
  --description="50 generations per month with advanced features"

stripe prices create \
  --product=prod_XXXXXXXXXX \
  --unit-amount=1900 \
  --currency=usd \
  --recurring[interval]=month

# Create Pro plan
stripe products create \
  --name="Pro Plan" \
  --description="Unlimited generations with premium features"

stripe prices create \
  --product=prod_XXXXXXXXXX \
  --unit-amount=4900 \
  --currency=usd \
  --recurring[interval]=month
```

### 4.3 Update Price IDs
Update `src/lib/stripe.js` with your actual price IDs:
```javascript
creator: {
  // ...
  priceId: 'price_XXXXXXXXXX', // Your actual Creator price ID
},
pro: {
  // ...
  priceId: 'price_XXXXXXXXXX', // Your actual Pro price ID
}
```

## Step 5: Frontend Deployment

### Option A: Vercel Deployment

#### 5.1 Install Vercel CLI
```bash
npm i -g vercel
```

#### 5.2 Deploy
```bash
vercel --prod
```

#### 5.3 Configure Environment Variables
In Vercel dashboard:
1. Go to Project Settings > Environment Variables
2. Add all environment variables from `.env`
3. Redeploy

### Option B: Netlify Deployment

#### 5.1 Build Configuration
Create `netlify.toml`:
```toml
[build]
  publish = "dist"
  command = "npm run build"

[[redirects]]
  from = "/*"
  to = "/index.html"
  status = 200

[build.environment]
  NODE_VERSION = "18"
```

#### 5.2 Deploy
1. Connect GitHub repository to Netlify
2. Configure build settings
3. Add environment variables
4. Deploy

### Option C: Custom Server Deployment

#### 5.1 Build Application
```bash
npm run build
```

#### 5.2 Serve Static Files
```bash
# Using serve
npm install -g serve
serve -s dist -l 3000

# Using nginx
# Copy dist/ contents to /var/www/html/
# Configure nginx to serve static files
```

## Step 6: Domain and SSL Setup

### 6.1 Domain Configuration
1. Point your domain to deployment platform
2. Configure DNS records
3. Set up SSL certificate (usually automatic)

### 6.2 Update Supabase URLs
1. Go to Supabase Authentication settings
2. Update Site URL to your domain
3. Update redirect URLs

## Step 7: Monitoring and Analytics

### 7.1 Error Tracking
Consider integrating:
- Sentry for error tracking
- LogRocket for session replay
- Google Analytics for usage analytics

### 7.2 Performance Monitoring
- Vercel Analytics (if using Vercel)
- Google PageSpeed Insights
- Web Vitals monitoring

## Step 8: Security Checklist

### 8.1 Environment Variables
- [ ] All sensitive keys are in environment variables
- [ ] No hardcoded secrets in code
- [ ] Production keys are different from development

### 8.2 Database Security
- [ ] Row Level Security enabled
- [ ] Proper policies configured
- [ ] Regular backups scheduled

### 8.3 API Security
- [ ] Rate limiting configured
- [ ] CORS properly configured
- [ ] Input validation implemented

### 8.4 Frontend Security
- [ ] HTTPS enabled
- [ ] Security headers configured
- [ ] Content Security Policy set

## Step 9: Testing Production Deployment

### 9.1 Functionality Tests
- [ ] User registration/login works
- [ ] Image upload works
- [ ] Ad generation works
- [ ] Payment flow works
- [ ] Social posting works (if implemented)

### 9.2 Performance Tests
- [ ] Page load times < 3 seconds
- [ ] Images optimized
- [ ] Bundle size optimized
- [ ] API response times acceptable

### 9.3 Mobile Testing
- [ ] Responsive design works
- [ ] Touch interactions work
- [ ] Performance on mobile devices

## Step 10: Post-Deployment

### 10.1 Monitoring Setup
```bash
# Set up uptime monitoring
# Configure alerts for errors
# Monitor API usage and costs
```

### 10.2 Backup Strategy
- Database backups (Supabase handles this)
- Code repository backups
- Environment variable backups

### 10.3 Update Process
1. Test changes in development
2. Deploy to staging environment
3. Run automated tests
4. Deploy to production
5. Monitor for issues

## Troubleshooting

### Common Issues

#### Build Failures
```bash
# Clear node modules and reinstall
rm -rf node_modules package-lock.json
npm install

# Check for TypeScript errors
npm run type-check

# Check for linting errors
npm run lint
```

#### Environment Variable Issues
```bash
# Verify environment variables are loaded
console.log(import.meta.env.VITE_SUPABASE_URL)

# Check for typos in variable names
# Ensure VITE_ prefix for client-side variables
```

#### Database Connection Issues
```bash
# Test Supabase connection
curl -X GET "https://your-project.supabase.co/rest/v1/" \
  -H "apikey: your-anon-key"
```

#### Payment Issues
```bash
# Test Stripe connection
curl -X GET "https://api.stripe.com/v1/products" \
  -H "Authorization: Bearer sk_test_..."
```

### Performance Issues

#### Slow Loading
- Enable gzip compression
- Optimize images
- Use CDN for static assets
- Implement code splitting

#### High API Costs
- Implement caching
- Add rate limiting
- Monitor API usage
- Optimize API calls

## Maintenance

### Regular Tasks
- [ ] Monitor error rates
- [ ] Check API usage and costs
- [ ] Update dependencies
- [ ] Review security logs
- [ ] Backup verification

### Monthly Tasks
- [ ] Performance review
- [ ] Security audit
- [ ] Cost optimization
- [ ] Feature usage analysis

### Quarterly Tasks
- [ ] Dependency updates
- [ ] Security penetration testing
- [ ] Disaster recovery testing
- [ ] Performance optimization

## Support

### Documentation
- API Documentation: `API_DOCUMENTATION.md`
- Component Documentation: In-code comments
- Database Schema: In Supabase dashboard

### Monitoring
- Application logs: Platform-specific
- Database logs: Supabase dashboard
- Error tracking: Sentry/similar service
- Performance: Analytics dashboard

### Backup and Recovery
- Database: Automatic Supabase backups
- Code: Git repository
- Configuration: Environment variable backup
- Disaster recovery: Documented procedures
