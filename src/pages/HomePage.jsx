import React from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { 
  Sparkles, 
  Zap, 
  Target, 
  TrendingUp, 
  ArrowRight,
  Check,
  Star,
  Instagram,
  MessageCircle
} from 'lucide-react'

const HomePage = () => {
  const features = [
    {
      icon: Sparkles,
      title: "AI Ad Variation Generator",
      description: "Transform one product image into 3-5 distinct ad creatives with AI-generated copy"
    },
    {
      icon: Zap,
      title: "AI-Powered Copywriting",
      description: "High-impact ad copy optimized for engagement on TikTok and Instagram"
    },
    {
      icon: Target,
      title: "Direct Social Posting",
      description: "Post generated ads directly to test accounts for quick performance review"
    },
    {
      icon: TrendingUp,
      title: "AI Growth Hacking",
      description: "Get optimization strategies and insights to improve your ad performance"
    }
  ]

  const testimonials = [
    {
      name: "Sarah Chen",
      role: "E-commerce Founder",
      content: "AdAlchemy helped me create 20+ ad variations in minutes. My conversion rates increased by 40%!",
      rating: 5
    },
    {
      name: "Mike Rodriguez",
      role: "Solo Entrepreneur",
      content: "Finally, I can compete with big brands. The AI copy is better than what I paid agencies for.",
      rating: 5
    },
    {
      name: "Emma Thompson",
      role: "Dropshipping Expert",
      content: "The TikTok variations went viral! This tool pays for itself with just one successful ad.",
      rating: 5
    }
  ]

  const pricingPlans = [
    {
      name: "Free",
      price: "$0",
      description: "Perfect for getting started",
      features: ["5 generations/month", "2 platforms", "Basic templates", "Community support"],
      buttonText: "Start Free",
      popular: false
    },
    {
      name: "Creator",
      price: "$19",
      description: "For active content creators",
      features: ["50 generations/month", "All platforms", "Premium templates", "Priority support", "A/B testing"],
      buttonText: "Start Creating",
      popular: true
    },
    {
      name: "Pro",
      price: "$49",
      description: "For serious businesses",
      features: ["Unlimited generations", "All platforms", "Custom templates", "24/7 support", "Advanced analytics", "API access"],
      buttonText: "Go Pro",
      popular: false
    }
  ]

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-dark text-white py-20 lg:py-32">
        <div className="absolute inset-0 bg-[url('data:image/svg+xml,%3Csvg%20width%3D%2260%22%20height%3D%2260%22%20viewBox%3D%220%200%2060%2060%22%20xmlns%3D%22http%3A//www.w3.org/2000/svg%22%3E%3Cg%20fill%3D%22none%22%20fill-rule%3D%22evenodd%22%3E%3Cg%20fill%3D%22%239C92AC%22%20fill-opacity%3D%220.1%22%3E%3Ccircle%20cx%3D%2230%22%20cy%3D%2230%22%20r%3D%221%22/%3E%3C/g%3E%3C/g%3E%3C/svg%3E')] opacity-20"></div>
        
        <div className="relative max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center max-w-4xl mx-auto"
          >
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2, type: "spring" }}
              className="inline-flex items-center space-x-2 bg-white/10 backdrop-blur-sm rounded-full px-4 py-2 mb-8"
            >
              <Sparkles className="h-5 w-5 text-yellow-300" />
              <span className="text-sm font-medium">Powered by Advanced AI</span>
            </motion.div>
            
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold mb-6 bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">
              Spin Product Photos into
              <span className="block text-transparent bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text">
                Viral Ad Creatives
              </span>
            </h1>
            
            <p className="text-xl text-gray-300 mb-8 max-w-2xl mx-auto leading-relaxed">
              Transform a single product image into multiple high-converting ad variations with AI-generated copy, 
              optimized for TikTok and Instagram. Perfect for solo founders and small businesses.
            </p>
            
            <div className="flex flex-col sm:flex-row items-center justify-center space-y-4 sm:space-y-0 sm:space-x-4">
              <Link 
                to="/auth?mode=signup" 
                className="btn-primary text-lg px-8 py-4 inline-flex items-center space-x-2"
              >
                <span>Start Creating for Free</span>
                <ArrowRight className="h-5 w-5" />
              </Link>
              <Link 
                to="/pricing" 
                className="text-gray-300 hover:text-white transition-colors inline-flex items-center space-x-2"
              >
                <span>View Pricing</span>
                <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
            
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1 }}
              className="mt-12 flex items-center justify-center space-x-8 text-sm text-gray-400"
            >
              <div className="flex items-center space-x-2">
                <Instagram className="h-5 w-5" />
                <span>Instagram Ready</span>
              </div>
              <div className="flex items-center space-x-2">
                <MessageCircle className="h-5 w-5" />
                <span>TikTok Optimized</span>
              </div>
              <div className="flex items-center space-x-2">
                <Zap className="h-5 w-5" />
                <span>AI Powered</span>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-surface">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl lg:text-4xl font-bold text-text mb-4">
              Everything You Need to Scale Your Ads
            </h2>
            <p className="text-gray-600 text-lg max-w-2xl mx-auto">
              From product image to viral ad creative in minutes. Our AI handles the heavy lifting 
              so you can focus on growing your business.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => {
              const Icon = feature.icon
              return (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                  className="card p-6 text-center hover:shadow-lg transition-shadow"
                >
                  <div className="inline-flex items-center justify-center w-12 h-12 bg-primary/10 rounded-lg mb-4">
                    <Icon className="h-6 w-6 text-primary" />
                  </div>
                  <h3 className="text-lg font-medium text-text mb-2">{feature.title}</h3>
                  <p className="text-gray-600 text-sm">{feature.description}</p>
                </motion.div>
              )
            })}
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl lg:text-4xl font-bold text-text mb-4">
              Trusted by Creators Worldwide
            </h2>
            <p className="text-gray-600 text-lg">
              See how AdAlchemy is helping entrepreneurs scale their businesses
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="card p-6"
              >
                <div className="flex items-center space-x-1 mb-4">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star key={i} className="h-4 w-4 text-yellow-400 fill-current" />
                  ))}
                </div>
                <p className="text-gray-600 mb-4 italic">"{testimonial.content}"</p>
                <div>
                  <p className="font-medium text-text">{testimonial.name}</p>
                  <p className="text-sm text-gray-500">{testimonial.role}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section className="py-20 bg-surface">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl lg:text-4xl font-bold text-text mb-4">
              Simple, Transparent Pricing
            </h2>
            <p className="text-gray-600 text-lg">
              Choose the plan that fits your needs. Upgrade or downgrade anytime.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto">
            {pricingPlans.map((plan, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className={`
                  card p-8 text-center relative
                  ${plan.popular ? 'border-2 border-primary shadow-lg scale-105' : ''}
                `}
              >
                {plan.popular && (
                  <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                    <span className="bg-primary text-white px-4 py-1 rounded-full text-xs font-medium">
                      Most Popular
                    </span>
                  </div>
                )}
                
                <h3 className="text-xl font-bold text-text mb-2">{plan.name}</h3>
                <div className="mb-4">
                  <span className="text-3xl font-bold text-text">{plan.price}</span>
                  {plan.price !== "$0" && <span className="text-gray-500">/month</span>}
                </div>
                <p className="text-gray-600 mb-6">{plan.description}</p>
                
                <ul className="space-y-3 mb-8">
                  {plan.features.map((feature, featureIndex) => (
                    <li key={featureIndex} className="flex items-center space-x-2">
                      <Check className="h-4 w-4 text-green-500" />
                      <span className="text-sm text-gray-600">{feature}</span>
                    </li>
                  ))}
                </ul>
                
                <Link
                  to="/auth?mode=signup"
                  className={`
                    w-full py-3 px-4 rounded-md font-medium transition-colors inline-block
                    ${plan.popular 
                      ? 'bg-primary text-white hover:bg-primary/90' 
                      : 'bg-gray-100 text-text hover:bg-gray-200'
                    }
                  `}
                >
                  {plan.buttonText}
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-dark text-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="text-3xl lg:text-4xl font-bold mb-4">
              Ready to Transform Your Product Photos?
            </h2>
            <p className="text-xl text-gray-300 mb-8 max-w-2xl mx-auto">
              Join thousands of entrepreneurs using AdAlchemy to create viral ad creatives 
              and scale their businesses with AI.
            </p>
            <Link 
              to="/auth?mode=signup" 
              className="btn-primary text-lg px-8 py-4 inline-flex items-center space-x-2"
            >
              <span>Start Your Free Trial</span>
              <ArrowRight className="h-5 w-5" />
            </Link>
          </motion.div>
        </div>
      </section>
    </div>
  )
}

export default HomePage
