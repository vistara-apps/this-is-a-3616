import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { 
  Upload, 
  Sparkles, 
  LogOut, 
  User, 
  Settings,
  Plus,
  Image as ImageIcon,
  TrendingUp,
  Zap,
  BarChart3,
  Crown,
  AlertCircle
} from 'lucide-react'
import { useAuth } from '../contexts/AuthContext'
import ImageUploader from '../components/ImageUploader'
import SelectSocial from '../components/SelectSocial'
import CopyGenerator from '../components/CopyGenerator'
import AdCard from '../components/AdCard'
import LoadingSpinner from '../components/LoadingSpinner'
import AnalyticsDashboard from '../components/AnalyticsDashboard'
import SubscriptionManager from '../components/SubscriptionManager'
import { 
  getUser, 
  getUserUsage, 
  trackUsage, 
  createProduct, 
  createAdCreative,
  getUserAdCreatives 
} from '../lib/supabase'
import { canUserPerformAction, SUBSCRIPTION_PLANS } from '../lib/stripe'
import { postToSocialMedia, optimizeContentForPlatform } from '../lib/socialMedia'
import toast from 'react-hot-toast'

const DashboardPage = () => {
  const { user, signOut } = useAuth()
  const navigate = useNavigate()
  
  // View management
  const [currentView, setCurrentView] = useState('create') // 'create', 'analytics', 'subscription'
  
  // Step management
  const [currentStep, setCurrentStep] = useState(1)
  const steps = [
    { id: 1, title: 'Upload Product', icon: Upload },
    { id: 2, title: 'Product Details', icon: Settings },
    { id: 3, title: 'Select Platform', icon: TrendingUp },
    { id: 4, title: 'Generate Ads', icon: Sparkles }
  ]

  // Form state
  const [productImage, setProductImage] = useState(null)
  const [productName, setProductName] = useState('')
  const [productDescription, setProductDescription] = useState('')
  const [selectedPlatform, setSelectedPlatform] = useState('')
  const [generatedAds, setGeneratedAds] = useState([])
  const [loading, setLoading] = useState(false)

  // User data
  const [userData, setUserData] = useState(null)
  const [userUsage, setUserUsage] = useState({})
  const [userPlan, setUserPlan] = useState('free')
  const [adCreatives, setAdCreatives] = useState([])

  // Load user data and usage
  useEffect(() => {
    if (user) {
      loadUserData()
    }
  }, [user])

  const loadUserData = async () => {
    try {
      const [userInfo, usage, creatives] = await Promise.all([
        getUser(user.id),
        getUserUsage(user.id),
        getUserAdCreatives(user.id)
      ])
      
      setUserData(userInfo)
      setUserUsage(usage)
      setUserPlan(userInfo?.subscription_plan || 'free')
      setAdCreatives(creatives)
    } catch (error) {
      console.error('Failed to load user data:', error)
      // Set defaults for demo
      setUserPlan('free')
      setUserUsage({ generate_ad: 3 })
    }
  }

  const handleSignOut = async () => {
    await signOut()
    navigate('/')
  }

  const nextStep = () => {
    if (currentStep < steps.length) {
      setCurrentStep(currentStep + 1)
    }
  }

  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1)
    }
  }

  const handleImageUpload = (imageData) => {
    setProductImage(imageData)
    if (imageData) {
      nextStep()
    }
  }

  const handleProductDetails = () => {
    if (!productName.trim() || !productDescription.trim()) {
      toast.error('Please fill in all product details')
      return
    }
    nextStep()
  }

  const handlePlatformSelect = (platform) => {
    setSelectedPlatform(platform)
    nextStep()
  }

  const handleCopyGenerated = async (variations) => {
    try {
      // Check if user can generate ads
      if (!canUserPerformAction(userPlan, 'generate_ad', userUsage)) {
        toast.error('Generation limit reached. Please upgrade your plan.')
        return
      }

      // Track usage
      await trackUsage(user.id, 'generate_ad')
      
      // Save product if not exists
      const productData = {
        user_id: user.id,
        product_name: productName,
        product_description: productDescription,
        uploaded_image_url: productImage?.url || ''
      }
      const savedProduct = await createProduct(productData)

      // Save ad creatives
      const creativePromises = variations.map(variation => 
        createAdCreative({
          user_id: user.id,
          product_id: savedProduct.product_id,
          prompt: `${productName} - ${productDescription}`,
          image_url: productImage?.url || '',
          generated_copy: JSON.stringify(variation),
          platform: selectedPlatform
        })
      )
      
      await Promise.all(creativePromises)
      
      setGeneratedAds(variations)
      
      // Refresh user data
      await loadUserData()
      
      toast.success(`Generated ${variations.length} ad variations!`)
    } catch (error) {
      console.error('Failed to save ad creatives:', error)
      setGeneratedAds(variations) // Still show the ads even if saving fails
      toast.success(`Generated ${variations.length} ad variations!`)
    }
  }

  const handleAdPost = async (creative) => {
    try {
      // Check if user can post to social media
      if (!canUserPerformAction(userPlan, 'post_to_social')) {
        toast.error('Social posting requires Creator or Pro plan. Please upgrade.')
        return
      }

      setLoading(true)
      
      // Optimize content for platform
      const optimizedContent = optimizeContentForPlatform({
        text: `${creative.headline}\n\n${creative.body}`,
        hashtags: creative.hashtags,
        callToAction: creative.cta
      }, selectedPlatform)

      // Post to social media
      const result = await postToSocialMedia(selectedPlatform, {
        text: optimizedContent.text,
        image: productImage?.url,
        hashtags: optimizedContent.hashtags
      })

      if (result.success) {
        toast.success(`Posted to ${selectedPlatform} test account successfully!`)
        
        // Track usage
        await trackUsage(user.id, 'social_post')
        await loadUserData()
      }
    } catch (error) {
      console.error('Failed to post to social media:', error)
      toast.error('Failed to post to social media')
    } finally {
      setLoading(false)
    }
  }

  const resetFlow = () => {
    setCurrentStep(1)
    setProductImage(null)
    setProductName('')
    setProductDescription('')
    setSelectedPlatform('')
    setGeneratedAds([])
  }

  const canProceedToNext = () => {
    switch (currentStep) {
      case 1:
        return productImage !== null
      case 2:
        return productName.trim() && productDescription.trim()
      case 3:
        return selectedPlatform !== ''
      default:
        return false
    }
  }

  return (
    <div className="min-h-screen bg-gradient-dark">
      {/* Sidebar */}
      <div className="fixed left-0 top-0 h-full w-64 bg-gray-900 text-white p-6 z-10">
        <div className="flex items-center space-x-2 mb-8">
          <Sparkles className="h-8 w-8 text-blue-400" />
          <span className="text-xl font-bold">AdAlchemy</span>
        </div>

        {/* User Info */}
        <div className="mb-8 p-4 bg-gray-800 rounded-lg">
          <div className="flex items-center space-x-3 mb-3">
            <div className="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center">
              <User className="h-5 w-5" />
            </div>
            <div>
              <p className="font-medium text-sm">{user?.email}</p>
              <div className="flex items-center space-x-1">
                <p className="text-xs text-gray-400 capitalize">{userPlan} Plan</p>
                {userPlan !== 'free' && <Crown className="h-3 w-3 text-yellow-400" />}
              </div>
            </div>
          </div>
          
          {/* Usage Display */}
          <div className="text-xs text-gray-400">
            {(() => {
              const plan = SUBSCRIPTION_PLANS[userPlan]
              const used = userUsage.generate_ad || 0
              const limit = plan?.limits?.generations || 5
              
              if (limit === -1) {
                return `${used} generations used (Unlimited)`
              }
              return `${used}/${limit} generations used`
            })()}
          </div>
          <div className="w-full bg-gray-700 rounded-full h-2 mt-2">
            <div 
              className={`h-2 rounded-full transition-all duration-300 ${
                (() => {
                  const plan = SUBSCRIPTION_PLANS[userPlan]
                  const used = userUsage.generate_ad || 0
                  const limit = plan?.limits?.generations || 5
                  const percentage = limit === -1 ? 0 : (used / limit) * 100
                  
                  if (percentage >= 90) return 'bg-red-500'
                  if (percentage >= 70) return 'bg-yellow-500'
                  return 'bg-blue-500'
                })()
              }`}
              style={{ 
                width: `${(() => {
                  const plan = SUBSCRIPTION_PLANS[userPlan]
                  const used = userUsage.generate_ad || 0
                  const limit = plan?.limits?.generations || 5
                  
                  if (limit === -1) return 10 // Show small bar for unlimited
                  return Math.min((used / limit) * 100, 100)
                })()}%` 
              }}
            />
          </div>
          
          {/* Upgrade prompt for free users */}
          {userPlan === 'free' && (userUsage.generate_ad || 0) >= 3 && (
            <div className="mt-3 p-2 bg-primary/10 rounded-md">
              <div className="flex items-center space-x-2">
                <AlertCircle className="h-3 w-3 text-primary" />
                <span className="text-xs text-primary">Almost at limit!</span>
              </div>
              <button 
                onClick={() => setCurrentView('subscription')}
                className="text-xs text-primary hover:underline mt-1"
              >
                Upgrade now →
              </button>
            </div>
          )}
        </div>

        {/* Stats */}
        <div className="space-y-4 mb-8">
          <div className="p-3 bg-gray-800 rounded-lg">
            <div className="flex items-center space-x-2">
              <ImageIcon className="h-4 w-4 text-green-400" />
              <span className="text-sm">Total Ads Created</span>
            </div>
            <p className="text-2xl font-bold text-green-400">{adCreatives.length}</p>
          </div>
          <div className="p-3 bg-gray-800 rounded-lg">
            <div className="flex items-center space-x-2">
              <Zap className="h-4 w-4 text-yellow-400" />
              <span className="text-sm">Social Posts</span>
            </div>
            <p className="text-2xl font-bold text-yellow-400">{userUsage.social_post || 0}</p>
          </div>
        </div>

        {/* Navigation */}
        <nav className="space-y-2 mb-8">
          <button
            onClick={() => {
              setCurrentView('create')
              resetFlow()
            }}
            className={`w-full flex items-center space-x-3 px-3 py-2 rounded-lg transition-colors ${
              currentView === 'create' ? 'bg-gray-800 text-white' : 'hover:bg-gray-800'
            }`}
          >
            <Plus className="h-4 w-4" />
            <span>Create Ad Campaign</span>
          </button>
          
          <button
            onClick={() => setCurrentView('analytics')}
            className={`w-full flex items-center space-x-3 px-3 py-2 rounded-lg transition-colors ${
              currentView === 'analytics' ? 'bg-gray-800 text-white' : 'hover:bg-gray-800'
            }`}
          >
            <BarChart3 className="h-4 w-4" />
            <span>Analytics</span>
            {!['creator', 'pro'].includes(userPlan) && (
              <Crown className="h-3 w-3 text-yellow-400 ml-auto" />
            )}
          </button>
          
          <button
            onClick={() => setCurrentView('subscription')}
            className={`w-full flex items-center space-x-3 px-3 py-2 rounded-lg transition-colors ${
              currentView === 'subscription' ? 'bg-gray-800 text-white' : 'hover:bg-gray-800'
            }`}
          >
            <Crown className="h-4 w-4" />
            <span>Subscription</span>
          </button>
        </nav>

        {/* Sign Out */}
        <button
          onClick={handleSignOut}
          className="w-full flex items-center space-x-3 px-3 py-2 rounded-lg hover:bg-gray-800 transition-colors text-red-400"
        >
          <LogOut className="h-4 w-4" />
          <span>Sign Out</span>
        </button>
      </div>

      {/* Main Content */}
      <div className="ml-64 min-h-screen">
        {/* Header */}
        <div className="bg-white border-b border-gray-200 px-8 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Ad Creation Studio</h1>
              <p className="text-gray-600">Transform your product into viral ad creatives</p>
            </div>
            
            {/* Step Indicator */}
            <div className="flex items-center space-x-4">
              {steps.map((step) => {
                const Icon = step.icon
                const isActive = step.id === currentStep
                const isCompleted = step.id < currentStep
                
                return (
                  <div key={step.id} className="flex items-center space-x-2">
                    <div className={`
                      w-10 h-10 rounded-full flex items-center justify-center transition-colors
                      ${isActive ? 'bg-primary text-white' : 
                        isCompleted ? 'bg-green-500 text-white' : 'bg-gray-200 text-gray-400'}
                    `}>
                      <Icon className="h-5 w-5" />
                    </div>
                    <span className={`text-sm ${isActive ? 'text-primary font-medium' : 'text-gray-500'}`}>
                      {step.title}
                    </span>
                    {step.id < steps.length && (
                      <div className="w-8 h-0.5 bg-gray-200 ml-2" />
                    )}
                  </div>
                )
              })}
            </div>
          </div>
        </div>

        {/* Content Area */}
        <div className="p-8">
          <div className="max-w-4xl mx-auto">
            {/* Analytics View */}
            {currentView === 'analytics' && (
              <AnalyticsDashboard 
                userPlan={userPlan} 
                adCreatives={adCreatives}
              />
            )}

            {/* Subscription View */}
            {currentView === 'subscription' && (
              <SubscriptionManager 
                currentPlan={userPlan}
                onPlanChange={(newPlan) => {
                  setUserPlan(newPlan)
                  loadUserData()
                }}
              />
            )}

            {/* Create Ad Campaign View */}
            {currentView === 'create' && (
              <>
                {/* Step 1: Upload Product Image */}
                {currentStep === 1 && (
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                className="space-y-6"
              >
                <div className="text-center mb-8">
                  <h2 className="text-3xl font-bold text-white mb-4">Upload Your Product Image</h2>
                  <p className="text-gray-300">Start by uploading a high-quality image of your product</p>
                </div>
                
                <ImageUploader 
                  onImageUpload={handleImageUpload}
                  existingImage={productImage?.url}
                />
              </motion.div>
            )}

            {/* Step 2: Product Details */}
            {currentStep === 2 && (
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                className="space-y-6"
              >
                <div className="text-center mb-8">
                  <h2 className="text-3xl font-bold text-white mb-4">Tell Us About Your Product</h2>
                  <p className="text-gray-300">Provide details to help our AI create compelling copy</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div className="space-y-6">
                    <div>
                      <label className="block text-sm font-medium text-white mb-2">
                        Product Name *
                      </label>
                      <input
                        type="text"
                        value={productName}
                        onChange={(e) => setProductName(e.target.value)}
                        className="input-field"
                        placeholder="e.g., Wireless Bluetooth Headphones"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-white mb-2">
                        Product Description *
                      </label>
                      <textarea
                        value={productDescription}
                        onChange={(e) => setProductDescription(e.target.value)}
                        rows={4}
                        className="input-field"
                        placeholder="Describe your product's key features, benefits, and what makes it special..."
                      />
                    </div>

                    <div className="flex space-x-4">
                      <button onClick={prevStep} className="btn-secondary">
                        Back
                      </button>
                      <button 
                        onClick={handleProductDetails}
                        disabled={!canProceedToNext()}
                        className="btn-primary disabled:opacity-50"
                      >
                        Continue
                      </button>
                    </div>
                  </div>

                  <div className="card p-6">
                    <h4 className="font-medium text-text mb-4">Preview</h4>
                    {productImage && (
                      <img 
                        src={productImage.url} 
                        alt="Product preview"
                        className="w-full h-48 object-cover rounded-md mb-4"
                      />
                    )}
                    <div className="space-y-2">
                      <p className="font-medium text-text">
                        {productName || 'Product Name'}
                      </p>
                      <p className="text-sm text-gray-600">
                        {productDescription || 'Product description will appear here...'}
                      </p>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}

            {/* Step 3: Select Platform */}
            {currentStep === 3 && (
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                className="space-y-6"
              >
                <div className="text-center mb-8">
                  <h2 className="text-3xl font-bold text-white mb-4">Choose Your Platform</h2>
                  <p className="text-gray-300">Select the social media platform for your ad campaign</p>
                </div>

                <SelectSocial 
                  selectedPlatform={selectedPlatform}
                  onSelect={handlePlatformSelect}
                />

                <div className="flex space-x-4">
                  <button onClick={prevStep} className="btn-secondary">
                    Back
                  </button>
                </div>
              </motion.div>
            )}

            {/* Step 4: Generate and View Ads */}
            {currentStep === 4 && (
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                className="space-y-8"
              >
                <div className="text-center mb-8">
                  <h2 className="text-3xl font-bold text-white mb-4">AI Ad Generator</h2>
                  <p className="text-gray-300">Generate compelling ad variations for {selectedPlatform}</p>
                </div>

                <CopyGenerator
                  productName={productName}
                  productDescription={productDescription}
                  platform={selectedPlatform}
                  imageUrl={productImage?.url}
                  onCopyGenerated={handleCopyGenerated}
                />

                {generatedAds.length > 0 && (
                  <div className="space-y-6">
                    <div className="flex items-center justify-between">
                      <h3 className="text-xl font-bold text-white">Your Ad Variations</h3>
                      <button onClick={resetFlow} className="btn-secondary text-sm">
                        Create New Campaign
                      </button>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                      {generatedAds.map((creative, index) => (
                        <AdCard
                          key={index}
                          creative={creative}
                          platform={selectedPlatform}
                          productImage={productImage?.url}
                          onPost={handleAdPost}
                          variant="withEdit"
                        />
                      ))}
                    </div>
                  </div>
                )}

                <div className="flex space-x-4">
                  <button onClick={prevStep} className="btn-secondary">
                    Back
                  </button>
                </div>
              </motion.div>
            )}
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default DashboardPage
