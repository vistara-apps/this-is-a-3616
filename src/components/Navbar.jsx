import React from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import { Sparkles, User, LogOut } from 'lucide-react'

const Navbar = () => {
  const { user, signOut } = useAuth()
  const navigate = useNavigate()

  const handleSignOut = async () => {
    await signOut()
    navigate('/')
  }

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-surface/80 backdrop-blur-md border-b border-gray-200">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <Link to="/" className="flex items-center space-x-2">
            <Sparkles className="h-8 w-8 text-primary" />
            <span className="text-xl font-bold text-text">AdAlchemy</span>
          </Link>

          <div className="hidden md:flex items-center space-x-6">
            <Link to="/pricing" className="text-text hover:text-primary transition-colors">
              Pricing
            </Link>
            {user ? (
              <div className="flex items-center space-x-4">
                <Link 
                  to="/dashboard" 
                  className="btn-primary"
                >
                  Dashboard
                </Link>
                <div className="relative group">
                  <button className="flex items-center space-x-2 text-text hover:text-primary">
                    <User className="h-5 w-5" />
                    <span className="text-sm">{user.email}</span>
                  </button>
                  <div className="absolute right-0 mt-2 w-48 bg-surface rounded-md shadow-card border border-gray-100 invisible group-hover:visible">
                    <button
                      onClick={handleSignOut}
                      className="flex items-center space-x-2 w-full px-4 py-2 text-left hover:bg-gray-50"
                    >
                      <LogOut className="h-4 w-4" />
                      <span>Sign Out</span>
                    </button>
                  </div>
                </div>
              </div>
            ) : (
              <div className="flex items-center space-x-4">
                <Link 
                  to="/auth" 
                  className="text-text hover:text-primary transition-colors"
                >
                  Sign In
                </Link>
                <Link 
                  to="/auth?mode=signup" 
                  className="btn-primary"
                >
                  Get Started
                </Link>
              </div>
            )}
          </div>

          {/* Mobile menu */}
          <div className="md:hidden">
            {user ? (
              <Link to="/dashboard" className="btn-primary text-sm px-4 py-2">
                Dashboard
              </Link>
            ) : (
              <Link to="/auth" className="btn-primary text-sm px-4 py-2">
                Sign In
              </Link>
            )}
          </div>
        </div>
      </div>
    </nav>
  )
}

export default Navbar