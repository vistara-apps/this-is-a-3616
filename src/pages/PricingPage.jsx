import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Check, Sparkles, Zap, Crown } from 'lucide-react'
import SubscriptionManager from '../components/SubscriptionManager'
import { useAuth } from '../contexts/AuthContext'
import { getUser } from '../lib/supabase'

const PricingPage = () => {
  const { user } = useAuth()
  const [userPlan, setUserPlan] = useState('free')

  useEffect(() => {
    if (user) {
      loadUserPlan()
    }
  }, [user])

  const loadUserPlan = async () => {
    try {
      const userData = await getUser(user.id)
      setUserPlan(userData?.subscription_plan || 'free')
    } catch (error) {
      console.error('Failed to load user plan:', error)
    }
  }

  const plans = [
    {
      name: "Free",
      price: "$0",
      icon: Sparkles,
      description: "Perfect for getting started",
      features: [
        "5 generations per month",
        "TikTok & Instagram support",
        "Basic ad templates",
        "Community support",
        "Standard AI models"
      ],
      buttonText: "Get Started Free",
      buttonStyle: "btn-secondary",
      popular: false
    },
    {
      name: "Creator",
      price: "$19",
      icon: Zap,
      description: "For active content creators",
      features: [
        "50 generations per month",
        "All social platforms",
        "Premium templates",
        "Priority support",
        "A/B testing tools",
        "Advanced AI models",
        "Direct posting to test accounts"
      ],
      buttonText: "Start Creating",
      buttonStyle: "btn-primary",
      popular: true
    },
    {
      name: "Pro",
      price: "$49",
      icon: Crown,
      description: "For serious businesses",
      features: [
        "Unlimited generations",
        "All platforms + custom",
        "Custom brand templates",
        "24/7 priority support",
        "Advanced analytics",
        "API access",
        "Team collaboration",
        "White-label options"
      ],
      buttonText: "Go Pro",
      buttonStyle: "btn-primary",
      popular: false
    }
  ]

  const faqs = [
    {
      question: "How does the AI ad generation work?",
      answer: "Simply upload your product image and provide basic details. Our AI analyzes your product and creates multiple ad variations with compelling copy optimized for each platform."
    },
    {
      question: "Can I customize the generated ads?",
      answer: "Yes! All generated copy can be edited, and you can regenerate variations until you find the perfect fit for your brand voice."
    },
    {
      question: "What platforms are supported?",
      answer: "Currently we support TikTok and Instagram, with Facebook, Twitter, and LinkedIn coming soon. Pro plans include early access to new platforms."
    },
    {
      question: "Is there a free trial?",
      answer: "Yes! Our free plan gives you 5 generations per month to try out the platform. No credit card required."
    },
    {
      question: "Can I cancel anytime?",
      answer: "Absolutely. You can cancel your subscription at any time. You'll continue to have access until the end of your billing period."
    }
  ]

  return (
    <div className="min-h-screen py-12">
      {/* Header */}
      <section className="text-center mb-16">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8"
        >
          <h1 className="text-4xl lg:text-5xl font-bold text-text mb-6">
            Choose Your
            <span className="block text-transparent bg-gradient-main bg-clip-text">
              Creative Power
            </span>
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Start free and scale as you grow. All plans include our core AI ad generation features.
          </p>
        </motion.div>
      </section>

      {/* Pricing Cards */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 mb-20">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {plans.map((plan, index) => {
            const Icon = plan.icon
            return (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className={`
                  card p-8 text-center relative transition-all duration-200
                  ${plan.popular 
                    ? 'border-2 border-primary shadow-xl scale-105 bg-gradient-to-b from-primary/5 to-transparent' 
                    : 'hover:shadow-lg hover:scale-105'
                  }
                `}
              >
                {plan.popular && (
                  <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                    <span className="bg-primary text-white px-6 py-2 rounded-full text-sm font-medium shadow-lg">
                      Most Popular
                    </span>
                  </div>
                )}
                
                <div className="mb-6">
                  <div className={`inline-flex items-center justify-center w-16 h-16 rounded-full mb-4 ${
                    plan.popular ? 'bg-primary text-white' : 'bg-primary/10 text-primary'
                  }`}>
                    <Icon className="h-8 w-8" />
                  </div>
                  <h3 className="text-2xl font-bold text-text mb-2">{plan.name}</h3>
                  <div className="mb-2">
                    <span className="text-4xl font-bold text-text">{plan.price}</span>
                    {plan.price !== "$0" && <span className="text-gray-500 text-lg">/month</span>}
                  </div>
                  <p className="text-gray-600">{plan.description}</p>
                </div>
                
                <ul className="space-y-4 mb-8 text-left">
                  {plan.features.map((feature, featureIndex) => (
                    <li key={featureIndex} className="flex items-start space-x-3">
                      <Check className="h-5 w-5 text-green-500 mt-0.5 flex-shrink-0" />
                      <span className="text-gray-600">{feature}</span>
                    </li>
                  ))}
                </ul>
                
                <Link
                  to="/auth?mode=signup"
                  className={`w-full py-3 px-6 rounded-md font-medium transition-all duration-200 inline-block ${plan.buttonStyle}`}
                >
                  {plan.buttonText}
                </Link>
              </motion.div>
            )
          })}
        </div>
      </section>
    </div>
  )
}

export default PricingPage
