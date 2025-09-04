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

- **Free**: 5 generations/month, basic features
- **Creator ($19/mo)**: 50 generations/month, advanced features
- **Pro ($49/mo)**: Unlimited generations, premium features

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Submit a pull request

## License

MIT License - see LICENSE file for details