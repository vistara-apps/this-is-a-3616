# AdAlchemy - AI Ad Creative Generator

Transform product photos into viral ad creatives with AI-powered copywriting, optimized for TikTok and Instagram.

## Features

- **AI Ad Variation Generator**: Create 3-5 distinct ad creatives from a single product image
- **Platform-Optimized Copy**: AI-generated copy tailored for TikTok and Instagram
- **Direct Social Posting**: Post to test accounts for quick performance review
- **Growth Analytics**: AI-powered insights and optimization strategies

## Tech Stack

- **Frontend**: React 18 + Vite
- **Styling**: Tailwind CSS v3
- **Authentication**: Supabase Auth
- **Database**: Supabase (PostgreSQL)
- **AI**: OpenAI API via OpenRouter
- **Animations**: Framer Motion
- **State Management**: Zustand
- **Notifications**: React Hot Toast

## Quick Start

1. **Clone and Install**
   ```bash
   git clone <repository-url>
   cd adalchemy
   npm install --legacy-peer-deps
   ```

2. **Environment Setup**
   ```bash
   cp .env.example .env
   # Fill in your API keys
   ```

3. **Database Setup**
   - Create a Supabase project
   - Run the SQL from `src/lib/supabase.js` in your Supabase SQL editor
   - Update environment variables

4. **Development**
   ```bash
   npm run dev
   ```

## Environment Variables

```env
VITE_SUPABASE_URL=your_supabase_project_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
VITE_OPENAI_API_KEY=your_openrouter_api_key
VITE_STRIPE_PUBLISHABLE_KEY=your_stripe_publishable_key
```

## Database Schema

### Users
- `user_id` (UUID, references auth.users)
- `email` (TEXT)
- `subscription_plan` (TEXT)
- `created_at` (TIMESTAMP)

### Products
- `product_id` (UUID)
- `user_id` (UUID, foreign key)
- `product_name` (TEXT)
- `product_description` (TEXT)
- `uploaded_image_url` (TEXT)
- `created_at` (TIMESTAMP)

### Ad Creatives
- `creative_id` (UUID)
- `user_id` (UUID, foreign key)
- `product_id` (UUID, foreign key)
- `prompt` (TEXT)
- `image_url` (TEXT)
- `generated_copy` (TEXT)
- `platform` (TEXT)
- `created_at` (TIMESTAMP)

## Architecture

```
src/
├── components/          # Reusable UI components
│   ├── AdCard.jsx      # Ad creative display card
│   ├── ImageUploader.jsx  # Product image upload
│   ├── SelectSocial.jsx   # Platform selection
│   └── CopyGenerator.jsx  # AI copy generation
├── contexts/           # React contexts
│   └── AuthContext.jsx # Authentication state
├── lib/               # Utilities and configurations
│   ├── supabase.js    # Database client
│   └── openai.js      # AI API client
├── pages/             # Route components
│   ├── HomePage.jsx   # Landing page
│   ├── AuthPage.jsx   # Login/signup
│   ├── DashboardPage.jsx # Main app interface
│   └── PricingPage.jsx   # Pricing plans
└── App.jsx            # Root component
```

## Subscription Plans

- **Free**: 5 generations/month, basic features, TikTok & Instagram support
- **Creator ($19/mo)**: 50 generations/month, direct social posting, analytics dashboard
- **Pro ($49/mo)**: Unlimited generations, A/B testing, advanced analytics, priority support

## ✨ New Features Completed

### 🎯 Core Features Implemented
- ✅ **AI Ad Variation Generator** - Generate 3-5 distinct ad creatives from product images
- ✅ **AI-Powered Copywriting** - Platform-optimized copy for TikTok and Instagram
- ✅ **Direct Social Posting** - Post to test accounts with content optimization
- ✅ **Analytics Dashboard** - Performance tracking and AI-powered insights
- ✅ **Subscription Management** - Complete billing and plan management
- ✅ **Usage Tracking** - Monitor generations and enforce plan limits

### 🔧 Technical Enhancements
- ✅ **Enhanced Database Schema** - Usage tracking, social accounts, comprehensive RLS
- ✅ **Stripe Integration** - Complete payment processing and subscription management
- ✅ **Social Media Optimization** - Platform-specific content optimization
- ✅ **Permission System** - Plan-based feature access control
- ✅ **Real-time Usage Monitoring** - Live usage tracking and limit enforcement

### 📊 Analytics & Insights
- ✅ **Performance Metrics** - Views, likes, shares, comments tracking
- ✅ **Engagement Analytics** - Detailed engagement rate analysis
- ✅ **AI Recommendations** - Smart insights for content optimization
- ✅ **Growth Tracking** - Monitor performance trends over time

### 💳 Business Logic
- ✅ **Plan Limits Enforcement** - Automatic usage limit checking
- ✅ **Upgrade Prompts** - Smart upgrade suggestions based on usage
- ✅ **Payment Processing** - Secure Stripe checkout integration
- ✅ **Subscription Lifecycle** - Complete plan management workflow

## 📚 Documentation

### API Documentation
- **[API_DOCUMENTATION.md](./API_DOCUMENTATION.md)** - Complete API reference and integration guide
- **[DEPLOYMENT_GUIDE.md](./DEPLOYMENT_GUIDE.md)** - Step-by-step production deployment instructions

### Key Components
- **ImageUploader** - Drag & drop product image upload with validation
- **CopyGenerator** - AI-powered ad copy generation with platform optimization
- **AdCard** - Interactive ad creative display with social posting
- **AnalyticsDashboard** - Comprehensive performance metrics and insights
- **SubscriptionManager** - Complete billing and plan management interface

### Database Schema
- **Users** - User profiles and subscription information
- **Products** - Product catalog with images and descriptions
- **Ad Creatives** - Generated ad variations with platform targeting
- **Usage Tracking** - Monthly usage monitoring and limit enforcement
- **Social Accounts** - Test account management for social posting

## 🚀 Production Ready Features

### Security
- ✅ Row Level Security (RLS) policies
- ✅ Environment variable protection
- ✅ Input validation and sanitization
- ✅ Secure payment processing with Stripe

### Performance
- ✅ Optimized bundle size with code splitting
- ✅ Image optimization and lazy loading
- ✅ Efficient database queries with proper indexing
- ✅ Caching strategies for API responses

### Scalability
- ✅ Serverless architecture with Supabase
- ✅ CDN-ready static asset optimization
- ✅ Horizontal scaling support
- ✅ Usage-based pricing model

### Monitoring
- ✅ Error tracking and logging
- ✅ Performance monitoring
- ✅ Usage analytics and insights
- ✅ Real-time user activity tracking

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Submit a pull request

## License

MIT License - see LICENSE file for details
