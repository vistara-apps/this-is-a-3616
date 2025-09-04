import React, { useState, useEffect } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Eye, EyeOff, Sparkles } from 'lucide-react'
import { useAuth } from '../contexts/AuthContext'
import LoadingSpinner from '../components/LoadingSpinner'

const AuthPage = () => {
  const [searchParams] = useSearchParams()
  const [mode, setMode] = useState(searchParams.get('mode') || 'signin')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  
  const { signIn, signUp, user } = useAuth()
  const navigate = useNavigate()

  useEffect(() => {
    if (user) {
      navigate('/dashboard')
    }
  }, [user, navigate])

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)

    try {
      if (mode === 'signup') {
        await signUp(email, password)
      } else {
        await signIn(email, password)
      }
      navigate('/dashboard')
    } catch (error) {
      console.error('Auth error:', error)
    } finally {
      setLoading(false)
    }
  }

  const toggleMode = () => {
    setMode(mode === 'signin' ? 'signup' : 'signin')
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-dark py-12 px-4 sm:px-6 lg:px-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-md w-full"
      >
        <div className="card p-8">
          <div className="text-center mb-8">
            <div className="flex justify-center mb-4">
              <div className="p-3 bg-primary/10 rounded-full">
                <Sparkles className="h-8 w-8 text-primary" />
              </div>
            </div>
            <h2 className="text-2xl font-bold text-text">
              {mode === 'signup' ? 'Create Your Account' : 'Welcome Back'}
            </h2>
            <p className="text-gray-600 mt-2">
              {mode === 'signup' 
                ? 'Start creating viral ad creatives with AI' 
                : 'Sign in to your AdAlchemy account'
              }
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-text mb-2">
                Email Address
              </label>
              <input
                id="email"
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="input-field"
                placeholder="Enter your email"
              />
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-text mb-2">
                Password
              </label>
              <div className="relative">
                <input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="input-field pr-10"
                  placeholder="Enter your password"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full btn-primary disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
            >
              {loading ? (
                <LoadingSpinner size="small" />
              ) : (
                <span>{mode === 'signup' ? 'Create Account' : 'Sign In'}</span>
              )}
            </button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-gray-600">
              {mode === 'signup' ? 'Already have an account?' : "Don't have an account?"}
              <button
                onClick={toggleMode}
                className="ml-1 text-primary hover:text-primary/80 font-medium"
              >
                {mode === 'signup' ? 'Sign In' : 'Sign Up'}
              </button>
            </p>
          </div>

          {mode === 'signup' && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              className="mt-6 p-4 bg-primary/5 rounded-md"
            >
              <h4 className="text-sm font-medium text-text mb-2">🎉 Free Plan Includes:</h4>
              <ul className="text-xs text-gray-600 space-y-1">
                <li>• 5 AI-generated ad variations per month</li>
                <li>• TikTok and Instagram optimization</li>
                <li>• Basic templates and copy styles</li>
                <li>• Community support</li>
              </ul>
            </motion.div>
          )}
        </div>
      </motion.div>
    </div>
  )
}

export default AuthPage