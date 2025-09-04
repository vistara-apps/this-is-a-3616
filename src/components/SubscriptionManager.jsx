import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { 
  Crown, 
  Check, 
  X, 
  CreditCard, 
  Calendar,
  TrendingUp,
  Zap,
  Star
} from 'lucide-react'
import { SUBSCRIPTION_PLANS, createCheckoutSession, redirectToCheckout } from '../lib/stripe'
import { updateUserSubscription } from '../lib/supabase'
import { useAuth } from '../contexts/AuthContext'
import toast from 'react-hot-toast'

const SubscriptionManager = ({ currentPlan = 'free', onPlanChange }) => {
  const { user } = useAuth()
  const [loading, setLoading] = useState(null)
  const [showBilling, setShowBilling] = useState(false)

  const handleUpgrade = async (planId) => {
    if (!user) {
      toast.error('Please sign in to upgrade your plan')
      return
    }

    const plan = SUBSCRIPTION_PLANS[planId]
    if (!plan || !plan.priceId) {
      toast.error('Invalid plan selected')
      return
    }

    setLoading(planId)
    try {
      // Create Stripe checkout session
      const session = await createCheckoutSession(plan.priceId, user.id)
      
      // Redirect to Stripe checkout
      await redirectToCheckout(session.id)
    } catch (error) {
      console.error('Upgrade error:', error)
      toast.error('Failed to start checkout process')
    } finally {
      setLoading(null)
    }
  }

  const handleCancelSubscription = async () => {
    if (!confirm('Are you sure you want to cancel your subscription? You will lose access to premium features.')) {
      return
    }

    setLoading('cancel')
    try {
      // In a real app, this would call your backend to cancel the subscription
      await updateUserSubscription(user.id, 'free')
      onPlanChange?.('free')
      toast.success('Subscription cancelled successfully')
    } catch (error) {
      console.error('Cancel error:', error)
      toast.error('Failed to cancel subscription')
    } finally {
      setLoading(null)
    }
  }

  const PlanCard = ({ plan, isCurrentPlan, isPopular }) => (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className={`
        relative card p-6 transition-all duration-200
        ${isCurrentPlan ? 'ring-2 ring-primary bg-primary/5' : 'hover:shadow-lg'}
        ${isPopular ? 'border-primary' : ''}
      `}
    >
      {isPopular && (
        <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
          <div className="bg-primary text-white px-3 py-1 rounded-full text-xs font-medium flex items-center space-x-1">
            <Star className="h-3 w-3" />
            <span>Most Popular</span>
          </div>
        </div>
      )}

      <div className="text-center mb-6">
        <h3 className="text-xl font-bold text-text mb-2">{plan.name}</h3>
        <div className="mb-4">
          <span className="text-3xl font-bold text-text">${plan.price}</span>
          {plan.price > 0 && <span className="text-gray-500">/month</span>}
        </div>
        
        {isCurrentPlan && (
          <div className="inline-flex items-center space-x-1 bg-primary/10 text-primary px-3 py-1 rounded-full text-sm font-medium">
            <Crown className="h-4 w-4" />
            <span>Current Plan</span>
          </div>
        )}
      </div>

      <div className="space-y-3 mb-6">
        {plan.features.map((feature, index) => (
          <div key={index} className="flex items-center space-x-3">
            <Check className="h-4 w-4 text-green-500 flex-shrink-0" />
            <span className="text-sm text-gray-600">{feature}</span>
          </div>
        ))}
      </div>

      <div className="space-y-3">
        {!isCurrentPlan ? (
          <button
            onClick={() => handleUpgrade(plan.id)}
            disabled={loading === plan.id}
            className={`
              w-full py-3 px-4 rounded-md font-medium transition-colors
              ${isPopular 
                ? 'bg-primary text-white hover:bg-primary/90' 
                : 'bg-gray-100 text-gray-900 hover:bg-gray-200'
              }
              disabled:opacity-50 disabled:cursor-not-allowed
            `}
          >
            {loading === plan.id ? (
              <div className="flex items-center justify-center space-x-2">
                <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
                <span>Processing...</span>
              </div>
            ) : (
              `Upgrade to ${plan.name}`
            )}
          </button>
        ) : currentPlan !== 'free' && (
          <button
            onClick={() => setShowBilling(true)}
            className="w-full py-3 px-4 rounded-md font-medium bg-gray-100 text-gray-900 hover:bg-gray-200 transition-colors"
          >
            Manage Billing
          </button>
        )}
      </div>
    </motion.div>
  )

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="text-center">
        <h2 className="text-3xl font-bold text-text mb-4">Choose Your Plan</h2>
        <p className="text-gray-600 max-w-2xl mx-auto">
          Unlock the full power of AdAlchemy with our flexible subscription plans. 
          Start free and upgrade as your business grows.
        </p>
      </div>

      {/* Plans Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
        {Object.values(SUBSCRIPTION_PLANS).map((plan) => (
          <PlanCard
            key={plan.id}
            plan={plan}
            isCurrentPlan={currentPlan === plan.id}
            isPopular={plan.id === 'creator'}
          />
        ))}
      </div>

      {/* Feature Comparison */}
      <div className="max-w-4xl mx-auto">
        <h3 className="text-2xl font-bold text-text text-center mb-8">Feature Comparison</h3>
        
        <div className="card overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-4 text-left text-sm font-medium text-gray-500">Features</th>
                  <th className="px-6 py-4 text-center text-sm font-medium text-gray-500">Free</th>
                  <th className="px-6 py-4 text-center text-sm font-medium text-gray-500">Creator</th>
                  <th className="px-6 py-4 text-center text-sm font-medium text-gray-500">Pro</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                <tr>
                  <td className="px-6 py-4 text-sm text-gray-900">Monthly Generations</td>
                  <td className="px-6 py-4 text-center">5</td>
                  <td className="px-6 py-4 text-center">50</td>
                  <td className="px-6 py-4 text-center">Unlimited</td>
                </tr>
                <tr>
                  <td className="px-6 py-4 text-sm text-gray-900">Products</td>
                  <td className="px-6 py-4 text-center">3</td>
                  <td className="px-6 py-4 text-center">25</td>
                  <td className="px-6 py-4 text-center">Unlimited</td>
                </tr>
                <tr>
                  <td className="px-6 py-4 text-sm text-gray-900">Social Media Platforms</td>
                  <td className="px-6 py-4 text-center"><Check className="h-4 w-4 text-green-500 mx-auto" /></td>
                  <td className="px-6 py-4 text-center"><Check className="h-4 w-4 text-green-500 mx-auto" /></td>
                  <td className="px-6 py-4 text-center"><Check className="h-4 w-4 text-green-500 mx-auto" /></td>
                </tr>
                <tr>
                  <td className="px-6 py-4 text-sm text-gray-900">Direct Social Posting</td>
                  <td className="px-6 py-4 text-center"><X className="h-4 w-4 text-red-500 mx-auto" /></td>
                  <td className="px-6 py-4 text-center"><Check className="h-4 w-4 text-green-500 mx-auto" /></td>
                  <td className="px-6 py-4 text-center"><Check className="h-4 w-4 text-green-500 mx-auto" /></td>
                </tr>
                <tr>
                  <td className="px-6 py-4 text-sm text-gray-900">Analytics Dashboard</td>
                  <td className="px-6 py-4 text-center"><X className="h-4 w-4 text-red-500 mx-auto" /></td>
                  <td className="px-6 py-4 text-center"><Check className="h-4 w-4 text-green-500 mx-auto" /></td>
                  <td className="px-6 py-4 text-center"><Check className="h-4 w-4 text-green-500 mx-auto" /></td>
                </tr>
                <tr>
                  <td className="px-6 py-4 text-sm text-gray-900">A/B Testing</td>
                  <td className="px-6 py-4 text-center"><X className="h-4 w-4 text-red-500 mx-auto" /></td>
                  <td className="px-6 py-4 text-center"><X className="h-4 w-4 text-red-500 mx-auto" /></td>
                  <td className="px-6 py-4 text-center"><Check className="h-4 w-4 text-green-500 mx-auto" /></td>
                </tr>
                <tr>
                  <td className="px-6 py-4 text-sm text-gray-900">Priority Support</td>
                  <td className="px-6 py-4 text-center"><X className="h-4 w-4 text-red-500 mx-auto" /></td>
                  <td className="px-6 py-4 text-center"><Check className="h-4 w-4 text-green-500 mx-auto" /></td>
                  <td className="px-6 py-4 text-center"><Check className="h-4 w-4 text-green-500 mx-auto" /></td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Current Plan Status */}
      {currentPlan !== 'free' && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-2xl mx-auto card p-6"
        >
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-medium text-text">Current Subscription</h3>
            <div className="flex items-center space-x-2 text-green-600">
              <Check className="h-4 w-4" />
              <span className="text-sm font-medium">Active</span>
            </div>
          </div>
          
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-gray-600">Plan</span>
              <span className="font-medium text-text capitalize">{currentPlan}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-gray-600">Price</span>
              <span className="font-medium text-text">
                ${SUBSCRIPTION_PLANS[currentPlan]?.price || 0}/month
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-gray-600">Next Billing</span>
              <span className="font-medium text-text">
                {new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toLocaleDateString()}
              </span>
            </div>
          </div>

          <div className="flex space-x-3 mt-6">
            <button
              onClick={() => setShowBilling(true)}
              className="flex-1 py-2 px-4 bg-gray-100 text-gray-900 rounded-md hover:bg-gray-200 transition-colors"
            >
              Update Payment Method
            </button>
            <button
              onClick={handleCancelSubscription}
              disabled={loading === 'cancel'}
              className="flex-1 py-2 px-4 bg-red-100 text-red-700 rounded-md hover:bg-red-200 transition-colors disabled:opacity-50"
            >
              {loading === 'cancel' ? 'Cancelling...' : 'Cancel Subscription'}
            </button>
          </div>
        </motion.div>
      )}

      {/* FAQ */}
      <div className="max-w-3xl mx-auto">
        <h3 className="text-2xl font-bold text-text text-center mb-8">Frequently Asked Questions</h3>
        
        <div className="space-y-6">
          <div className="card p-6">
            <h4 className="font-medium text-text mb-2">Can I change my plan anytime?</h4>
            <p className="text-gray-600 text-sm">
              Yes! You can upgrade or downgrade your plan at any time. Changes take effect immediately, 
              and we'll prorate any billing differences.
            </p>
          </div>
          
          <div className="card p-6">
            <h4 className="font-medium text-text mb-2">What happens if I exceed my generation limit?</h4>
            <p className="text-gray-600 text-sm">
              If you reach your monthly generation limit, you'll be prompted to upgrade your plan. 
              Your existing ads and data remain safe and accessible.
            </p>
          </div>
          
          <div className="card p-6">
            <h4 className="font-medium text-text mb-2">Is there a free trial for paid plans?</h4>
            <p className="text-gray-600 text-sm">
              We offer a generous free plan to get you started. You can upgrade to paid plans anytime 
              to unlock additional features and higher limits.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default SubscriptionManager
