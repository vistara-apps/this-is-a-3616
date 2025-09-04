import { loadStripe } from '@stripe/stripe-js'

const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY || 'pk_test_demo')

export const getStripe = () => stripePromise

export const createCheckoutSession = async (priceId, userId) => {
  try {
    // In a real app, this would call your backend API
    // For demo purposes, we'll simulate the checkout process
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

    if (!response.ok) {
      throw new Error('Failed to create checkout session')
    }

    const session = await response.json()
    return session
  } catch (error) {
    console.error('Stripe checkout error:', error)
    throw error
  }
}

export const redirectToCheckout = async (sessionId) => {
  const stripe = await getStripe()
  const { error } = await stripe.redirectToCheckout({ sessionId })
  
  if (error) {
    console.error('Stripe redirect error:', error)
    throw error
  }
}

// Subscription plans configuration
export const SUBSCRIPTION_PLANS = {
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
    priceId: 'price_creator_monthly', // Replace with actual Stripe price ID
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
    priceId: 'price_pro_monthly', // Replace with actual Stripe price ID
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

export const getPlanByPriceId = (priceId) => {
  return Object.values(SUBSCRIPTION_PLANS).find(plan => plan.priceId === priceId)
}

export const canUserPerformAction = (userPlan, action, currentUsage = {}) => {
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
