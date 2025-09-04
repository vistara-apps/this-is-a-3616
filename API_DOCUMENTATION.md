# AdAlchemy API Documentation

## Overview

AdAlchemy is a comprehensive AI-powered ad creative generation platform that transforms product images into viral social media advertisements. This document outlines all API integrations, database operations, and service implementations.

## Architecture

```
Frontend (React + Vite)
├── Authentication (Supabase Auth)
├── Database (Supabase PostgreSQL)
├── AI Services (OpenAI via OpenRouter)
├── Payments (Stripe)
└── Social Media (Mock APIs for demo)
```

## Database Schema

### Users Table
```sql
CREATE TABLE users (
  user_id UUID REFERENCES auth.users(id) PRIMARY KEY,
  email TEXT UNIQUE NOT NULL,
  subscription_plan TEXT DEFAULT 'free',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

### Products Table
```sql
CREATE TABLE products (
  product_id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES users(user_id) ON DELETE CASCADE,
  product_name TEXT NOT NULL,
  product_description TEXT,
  uploaded_image_url TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

### Ad Creatives Table
```sql
CREATE TABLE ad_creatives (
  creative_id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES users(user_id) ON DELETE CASCADE,
  product_id UUID REFERENCES products(product_id) ON DELETE CASCADE,
  prompt TEXT NOT NULL,
  image_url TEXT,
  generated_copy TEXT NOT NULL,
  platform TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

### Usage Tracking Table
```sql
CREATE TABLE usage_tracking (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES users(user_id) ON DELETE CASCADE,
  action_type TEXT NOT NULL,
  count INTEGER DEFAULT 1,
  month_year TEXT NOT NULL, -- Format: 'YYYY-MM'
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id, action_type, month_year)
);
```

### Social Accounts Table
```sql
CREATE TABLE social_accounts (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES users(user_id) ON DELETE CASCADE,
  platform TEXT NOT NULL,
  account_name TEXT NOT NULL,
  account_id TEXT,
  access_token TEXT,
  is_test_account BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

## API Services

### 1. Supabase Database Operations

#### User Management
```javascript
// Create user
const createUser = async (userData) => {
  const { data, error } = await supabase
    .from('users')
    .insert([{
      user_id: userData.id,
      email: userData.email,
      subscription_plan: 'free'
    }])
    .select()
    .single()
}

// Get user
const getUser = async (userId) => {
  const { data, error } = await supabase
    .from('users')
    .select('*')
    .eq('user_id', userId)
    .single()
}

// Update subscription
const updateUserSubscription = async (userId, subscriptionPlan) => {
  const { data, error } = await supabase
    .from('users')
    .update({ subscription_plan: subscriptionPlan })
    .eq('user_id', userId)
    .select()
    .single()
}
```

#### Product Management
```javascript
// Create product
const createProduct = async (productData) => {
  const { data, error } = await supabase
    .from('products')
    .insert([productData])
    .select()
    .single()
}

// Get user products
const getUserProducts = async (userId) => {
  const { data, error } = await supabase
    .from('products')
    .select('*')
    .eq('user_id', userId)
    .order('created_at', { ascending: false })
}
```

#### Ad Creative Management
```javascript
// Create ad creative
const createAdCreative = async (creativeData) => {
  const { data, error } = await supabase
    .from('ad_creatives')
    .insert([creativeData])
    .select()
    .single()
}

// Get user ad creatives
const getUserAdCreatives = async (userId) => {
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
}
```

#### Usage Tracking
```javascript
// Track usage
const trackUsage = async (userId, actionType) => {
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
}

// Get user usage
const getUserUsage = async (userId, monthYear = null) => {
  const targetMonth = monthYear || new Date().toISOString().slice(0, 7)
  
  const { data, error } = await supabase
    .from('usage_tracking')
    .select('*')
    .eq('user_id', userId)
    .eq('month_year', targetMonth)
}
```

### 2. OpenAI Integration

#### Ad Copy Generation
```javascript
const generateAdCopy = async (productName, productDescription, platform, imageUrl) => {
  const platformPrompts = {
    tiktok: "Create viral, trending TikTok ad copy that's engaging, uses current slang, and includes hooks that grab attention in the first 3 seconds.",
    instagram: "Create compelling Instagram ad copy that's visually focused, includes relevant hashtags, and encourages engagement and sharing."
  }

  const prompt = `
Product: ${productName}
Description: ${productDescription}
Platform: ${platform}

${platformPrompts[platform]}

Generate 3 different ad variations with:
1. A catchy headline
2. Engaging body copy (2-3 sentences max)
3. Strong call-to-action
4. Relevant hashtags (for Instagram)

Format as JSON with this structure:
{
  "variations": [
    {
      "headline": "...",
      "body": "...",
      "cta": "...",
      "hashtags": "..." (Instagram only)
    }
  ]
}
`

  const completion = await openai.chat.completions.create({
    model: "google/gemini-2.0-flash-001",
    messages: [
      {
        role: "system",
        content: "You are an expert social media marketer and copywriter specializing in viral ad content."
      },
      {
        role: "user",
        content: prompt
      }
    ],
    temperature: 0.8,
    max_tokens: 1000,
  })

  return JSON.parse(completion.choices[0].message.content)
}
```

### 3. Stripe Payment Integration

#### Subscription Plans
```javascript
const SUBSCRIPTION_PLANS = {
  free: {
    id: 'free',
    name: 'Free',
    price: 0,
    priceId: null,
    features: [
      '5 generations per month',
      'Basic ad templates',
      'TikTok & Instagram support',
      'Copy to clipboard'
    ],
    limits: {
      generations: 5,
      products: 3
    }
  },
  creator: {
    id: 'creator',
    name: 'Creator',
    price: 19,
    priceId: 'price_creator_monthly',
    features: [
      '50 generations per month',
      'Advanced ad templates',
      'All social platforms',
      'Direct posting to test accounts',
      'Basic analytics',
      'Priority support'
    ],
    limits: {
      generations: 50,
      products: 25
    }
  },
  pro: {
    id: 'pro',
    name: 'Pro',
    price: 49,
    priceId: 'price_pro_monthly',
    features: [
      'Unlimited generations',
      'Premium ad templates',
      'All social platforms',
      'Direct posting to test accounts',
      'Advanced analytics & insights',
      'A/B testing tools',
      'Priority support',
      'Custom branding'
    ],
    limits: {
      generations: -1, // Unlimited
      products: -1 // Unlimited
    }
  }
}
```

#### Checkout Session Creation
```javascript
const createCheckoutSession = async (priceId, userId) => {
  const response = await fetch('/api/create-checkout-session', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      priceId,
      userId,
      successUrl: `${window.location.origin}/dashboard?success=true`,
      cancelUrl: `${window.location.origin}/pricing?canceled=true`,
    }),
  })

  return await response.json()
}
```

#### Permission Checking
```javascript
const canUserPerformAction = (userPlan, action, currentUsage = {}) => {
  const plan = SUBSCRIPTION_PLANS[userPlan] || SUBSCRIPTION_PLANS.free
  
  switch (action) {
    case 'generate_ad':
      if (plan.limits.generations === -1) return true
      return (currentUsage.generations || 0) < plan.limits.generations
    
    case 'create_product':
      if (plan.limits.products === -1) return true
      return (currentUsage.products || 0) < plan.limits.products
    
    case 'post_to_social':
      return ['creator', 'pro'].includes(userPlan)
    
    case 'view_analytics':
      return ['creator', 'pro'].includes(userPlan)
    
    case 'ab_testing':
      return userPlan === 'pro'
    
    default:
      return true
  }
}
```

### 4. Social Media Integration

#### Platform Configuration
```javascript
const SUPPORTED_PLATFORMS = {
  tiktok: {
    name: 'TikTok',
    maxTextLength: 2200,
    supportedFormats: ['mp4', 'mov'],
    aspectRatio: '9:16'
  },
  instagram: {
    name: 'Instagram',
    maxTextLength: 2200,
    supportedFormats: ['jpg', 'png', 'mp4'],
    aspectRatio: '1:1'
  }
}
```

#### Content Posting
```javascript
const postToSocialMedia = async (platform, content, testAccount = null) => {
  // Simulate API call delay
  await new Promise(resolve => setTimeout(resolve, 2000))

  // Validate platform
  if (!SUPPORTED_PLATFORMS[platform]) {
    throw new Error(`Unsupported platform: ${platform}`)
  }

  // Mock successful post response
  const mockPostId = `${platform}_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
  
  return {
    success: true,
    postId: mockPostId,
    platform,
    url: `https://${platform}.com/post/${mockPostId}`,
    timestamp: new Date().toISOString(),
    testAccount: testAccount || `test_${platform}_account`,
    metrics: {
      views: 0,
      likes: 0,
      shares: 0,
      comments: 0
    }
  }
}
```

#### Content Optimization
```javascript
const optimizeContentForPlatform = (content, platform) => {
  const platformConfig = SUPPORTED_PLATFORMS[platform]
  
  if (!platformConfig) {
    throw new Error(`Unsupported platform: ${platform}`)
  }

  let optimizedContent = { ...content }

  switch (platform) {
    case 'tiktok':
      optimizedContent = {
        ...content,
        text: addTikTokOptimizations(content.text),
        hashtags: generateTikTokHashtags(content.hashtags),
        callToAction: makeCTAMoreEngaging(content.callToAction, 'tiktok')
      }
      break

    case 'instagram':
      optimizedContent = {
        ...content,
        text: addInstagramOptimizations(content.text),
        hashtags: generateInstagramHashtags(content.hashtags),
        callToAction: makeCTAMoreEngaging(content.callToAction, 'instagram')
      }
      break
  }

  return optimizedContent
}
```

## Component Architecture

### Core Components

1. **ImageUploader** - Handles product image upload with drag & drop
2. **CopyGenerator** - Interfaces with OpenAI for ad copy generation
3. **AdCard** - Displays generated ad creatives with actions
4. **SelectSocial** - Platform selection interface
5. **AnalyticsDashboard** - Performance metrics and insights
6. **SubscriptionManager** - Plan management and billing

### Pages

1. **HomePage** - Landing page with value proposition
2. **AuthPage** - Authentication (login/signup)
3. **DashboardPage** - Main application interface
4. **PricingPage** - Subscription plans and pricing

## Environment Variables

```env
# Supabase Configuration
VITE_SUPABASE_URL=your_supabase_project_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key

# OpenAI Configuration (using OpenRouter)
VITE_OPENAI_API_KEY=your_openrouter_api_key

# Stripe Configuration (for payments)
VITE_STRIPE_PUBLISHABLE_KEY=your_stripe_publishable_key
```

## Deployment Checklist

### Frontend Deployment
- [ ] Build optimized production bundle
- [ ] Configure environment variables
- [ ] Set up CDN for static assets
- [ ] Configure domain and SSL

### Database Setup
- [ ] Run database migrations
- [ ] Set up Row Level Security policies
- [ ] Configure backup strategy
- [ ] Set up monitoring

### API Configuration
- [ ] Configure OpenAI/OpenRouter API keys
- [ ] Set up Stripe webhooks
- [ ] Configure rate limiting
- [ ] Set up error monitoring

### Security
- [ ] Enable HTTPS everywhere
- [ ] Configure CORS policies
- [ ] Set up API rate limiting
- [ ] Implement input validation
- [ ] Configure security headers

## Testing Strategy

### Unit Tests
- Component rendering
- API service functions
- Utility functions
- State management

### Integration Tests
- Authentication flow
- Payment processing
- Ad generation workflow
- Social media posting

### E2E Tests
- Complete user journey
- Subscription upgrade flow
- Ad creation and posting
- Analytics dashboard

## Performance Optimization

### Frontend
- Code splitting by routes
- Lazy loading of components
- Image optimization
- Bundle size optimization

### Backend
- Database query optimization
- Caching strategies
- API response compression
- CDN configuration

### Monitoring
- Performance metrics
- Error tracking
- User analytics
- API usage monitoring

## Future Enhancements

### Planned Features
1. **Real Social Media Integration** - Actual TikTok/Instagram APIs
2. **Advanced Analytics** - Detailed performance tracking
3. **A/B Testing Tools** - Creative performance comparison
4. **Team Collaboration** - Multi-user workspaces
5. **Custom Branding** - White-label solutions
6. **API Access** - Developer API for integrations

### Technical Improvements
1. **Real-time Updates** - WebSocket integration
2. **Advanced AI Models** - Custom fine-tuned models
3. **Image Generation** - AI-powered image variations
4. **Video Support** - Video ad creation
5. **Multi-language** - International support

## Support and Maintenance

### Monitoring
- Application performance monitoring
- Error tracking and alerting
- User behavior analytics
- API usage monitoring

### Backup and Recovery
- Automated database backups
- Disaster recovery procedures
- Data retention policies
- Security incident response

### Updates and Maintenance
- Regular security updates
- Feature releases
- Bug fixes and improvements
- Performance optimizations
