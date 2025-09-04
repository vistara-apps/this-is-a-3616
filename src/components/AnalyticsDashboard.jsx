import React, { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { 
  TrendingUp, 
  Eye, 
  Heart, 
  Share2, 
  MessageCircle,
  Calendar,
  Target,
  BarChart3,
  PieChart,
  Activity
} from 'lucide-react'
import { getPostAnalytics } from '../lib/socialMedia'
import LoadingSpinner from './LoadingSpinner'

const AnalyticsDashboard = ({ userPlan, adCreatives = [] }) => {
  const [analytics, setAnalytics] = useState(null)
  const [loading, setLoading] = useState(true)
  const [selectedTimeframe, setSelectedTimeframe] = useState('7d')

  useEffect(() => {
    loadAnalytics()
  }, [selectedTimeframe, adCreatives])

  const loadAnalytics = async () => {
    setLoading(true)
    try {
      // Simulate loading analytics for all ad creatives
      const analyticsPromises = adCreatives.slice(0, 5).map(creative => 
        getPostAnalytics(creative.creative_id || `mock_${Math.random()}`)
      )
      
      const results = await Promise.all(analyticsPromises)
      
      // Aggregate analytics data
      const aggregated = {
        totalViews: results.reduce((sum, r) => sum + r.views, 0),
        totalLikes: results.reduce((sum, r) => sum + r.likes, 0),
        totalShares: results.reduce((sum, r) => sum + r.shares, 0),
        totalComments: results.reduce((sum, r) => sum + r.comments, 0),
        avgEngagementRate: (results.reduce((sum, r) => sum + parseFloat(r.engagementRate), 0) / results.length).toFixed(2),
        totalReach: results.reduce((sum, r) => sum + r.reach, 0),
        totalImpressions: results.reduce((sum, r) => sum + r.impressions, 0),
        postAnalytics: results
      }
      
      setAnalytics(aggregated)
    } catch (error) {
      console.error('Failed to load analytics:', error)
      // Set mock data for demo
      setAnalytics({
        totalViews: 15420,
        totalLikes: 1234,
        totalShares: 89,
        totalComments: 156,
        avgEngagementRate: '8.2',
        totalReach: 12336,
        totalImpressions: 18504,
        postAnalytics: []
      })
    } finally {
      setLoading(false)
    }
  }

  if (!['creator', 'pro'].includes(userPlan)) {
    return (
      <div className="card p-8 text-center">
        <div className="space-y-4">
          <div className="p-4 bg-primary/10 rounded-full inline-block">
            <BarChart3 className="h-8 w-8 text-primary" />
          </div>
          <div>
            <h3 className="text-lg font-medium text-text">Analytics Dashboard</h3>
            <p className="text-gray-500 mt-2">
              Upgrade to Creator or Pro plan to access detailed analytics and insights
            </p>
          </div>
          <button className="btn-primary">
            Upgrade Plan
          </button>
        </div>
      </div>
    )
  }

  if (loading) {
    return (
      <div className="card p-8">
        <div className="flex items-center justify-center">
          <LoadingSpinner />
          <span className="ml-3 text-text">Loading analytics...</span>
        </div>
      </div>
    )
  }

  const timeframeOptions = [
    { value: '7d', label: 'Last 7 days' },
    { value: '30d', label: 'Last 30 days' },
    { value: '90d', label: 'Last 90 days' }
  ]

  const metricCards = [
    {
      title: 'Total Views',
      value: analytics.totalViews.toLocaleString(),
      icon: Eye,
      color: 'text-blue-500',
      bgColor: 'bg-blue-50',
      change: '+12.5%'
    },
    {
      title: 'Total Likes',
      value: analytics.totalLikes.toLocaleString(),
      icon: Heart,
      color: 'text-red-500',
      bgColor: 'bg-red-50',
      change: '+8.3%'
    },
    {
      title: 'Total Shares',
      value: analytics.totalShares.toLocaleString(),
      icon: Share2,
      color: 'text-green-500',
      bgColor: 'bg-green-50',
      change: '+15.7%'
    },
    {
      title: 'Total Comments',
      value: analytics.totalComments.toLocaleString(),
      icon: MessageCircle,
      color: 'text-purple-500',
      bgColor: 'bg-purple-50',
      change: '+6.2%'
    }
  ]

  const engagementMetrics = [
    {
      title: 'Engagement Rate',
      value: `${analytics.avgEngagementRate}%`,
      icon: Activity,
      description: 'Average across all posts'
    },
    {
      title: 'Reach',
      value: analytics.totalReach.toLocaleString(),
      icon: Target,
      description: 'Unique accounts reached'
    },
    {
      title: 'Impressions',
      value: analytics.totalImpressions.toLocaleString(),
      icon: TrendingUp,
      description: 'Total times content was displayed'
    }
  ]

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-text">Analytics Dashboard</h2>
          <p className="text-gray-500">Track your ad performance and engagement</p>
        </div>
        
        <select
          value={selectedTimeframe}
          onChange={(e) => setSelectedTimeframe(e.target.value)}
          className="input-field w-auto"
        >
          {timeframeOptions.map(option => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      </div>

      {/* Main Metrics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {metricCards.map((metric, index) => {
          const Icon = metric.icon
          return (
            <motion.div
              key={metric.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="card p-6"
            >
              <div className="flex items-center justify-between mb-4">
                <div className={`p-3 rounded-full ${metric.bgColor}`}>
                  <Icon className={`h-6 w-6 ${metric.color}`} />
                </div>
                <span className="text-sm font-medium text-green-600">
                  {metric.change}
                </span>
              </div>
              <div>
                <p className="text-sm text-gray-500">{metric.title}</p>
                <p className="text-2xl font-bold text-text">{metric.value}</p>
              </div>
            </motion.div>
          )
        })}
      </div>

      {/* Engagement Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {engagementMetrics.map((metric, index) => {
          const Icon = metric.icon
          return (
            <motion.div
              key={metric.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 + index * 0.1 }}
              className="card p-6"
            >
              <div className="flex items-center space-x-3 mb-3">
                <Icon className="h-5 w-5 text-primary" />
                <h3 className="font-medium text-text">{metric.title}</h3>
              </div>
              <p className="text-2xl font-bold text-text mb-1">{metric.value}</p>
              <p className="text-sm text-gray-500">{metric.description}</p>
            </motion.div>
          )
        })}
      </div>

      {/* Performance Chart Placeholder */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.7 }}
        className="card p-6"
      >
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-medium text-text">Performance Over Time</h3>
          <div className="flex items-center space-x-2">
            <PieChart className="h-5 w-5 text-primary" />
            <span className="text-sm text-gray-500">Views & Engagement</span>
          </div>
        </div>
        
        {/* Mock Chart */}
        <div className="h-64 bg-gray-50 rounded-lg flex items-center justify-center">
          <div className="text-center">
            <BarChart3 className="h-12 w-12 text-gray-400 mx-auto mb-3" />
            <p className="text-gray-500">Interactive charts coming soon</p>
            <p className="text-sm text-gray-400">Track views, engagement, and growth trends</p>
          </div>
        </div>
      </motion.div>

      {/* Top Performing Posts */}
      {analytics.postAnalytics.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.9 }}
          className="card p-6"
        >
          <h3 className="text-lg font-medium text-text mb-4">Top Performing Posts</h3>
          <div className="space-y-4">
            {analytics.postAnalytics.slice(0, 3).map((post, index) => (
              <div key={post.postId} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center">
                    <span className="text-sm font-medium text-primary">#{index + 1}</span>
                  </div>
                  <div>
                    <p className="font-medium text-text">Post {post.postId.slice(-6)}</p>
                    <p className="text-sm text-gray-500">{post.platform}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-medium text-text">{post.views.toLocaleString()} views</p>
                  <p className="text-sm text-gray-500">{post.engagementRate} engagement</p>
                </div>
              </div>
            ))}
          </div>
        </motion.div>
      )}

      {/* Insights & Recommendations */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1.1 }}
        className="card p-6"
      >
        <h3 className="text-lg font-medium text-text mb-4">AI Insights & Recommendations</h3>
        <div className="space-y-4">
          <div className="p-4 bg-blue-50 rounded-lg border-l-4 border-blue-500">
            <h4 className="font-medium text-blue-900 mb-2">🎯 Best Performing Content</h4>
            <p className="text-blue-800 text-sm">
              Your posts with product demonstrations get 40% more engagement. Consider creating more how-to content.
            </p>
          </div>
          <div className="p-4 bg-green-50 rounded-lg border-l-4 border-green-500">
            <h4 className="font-medium text-green-900 mb-2">⏰ Optimal Posting Times</h4>
            <p className="text-green-800 text-sm">
              Your audience is most active on Tuesday and Thursday between 2-4 PM. Schedule posts during these times for better reach.
            </p>
          </div>
          <div className="p-4 bg-purple-50 rounded-lg border-l-4 border-purple-500">
            <h4 className="font-medium text-purple-900 mb-2">📈 Growth Opportunity</h4>
            <p className="text-purple-800 text-sm">
              Instagram posts are performing 25% better than TikTok. Consider focusing more content on Instagram.
            </p>
          </div>
        </div>
      </motion.div>
    </div>
  )
}

export default AnalyticsDashboard
