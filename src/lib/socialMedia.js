// Social Media Posting Service
// This handles posting to test accounts for TikTok and Instagram

export const SUPPORTED_PLATFORMS = {
  tiktok: {
    name: 'TikTok',
    maxTextLength: 2200,
    supportedFormats: ['mp4', 'mov'],
    aspectRatio: '9:16'
  },
  instagram: {
    name: 'Instagram',
    maxTextLength: 2200,
    supportedFormats: ['jpg', 'png', 'mp4'],
    aspectRatio: '1:1'
  }
}

// Mock social media posting for demo purposes
// In production, this would integrate with actual social media APIs
export const postToSocialMedia = async (platform, content, testAccount = null) => {
  try {
    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 2000))

    // Validate platform
    if (!SUPPORTED_PLATFORMS[platform]) {
      throw new Error(`Unsupported platform: ${platform}`)
    }

    // Validate content length
    const platformConfig = SUPPORTED_PLATFORMS[platform]
    if (content.text && content.text.length > platformConfig.maxTextLength) {
      throw new Error(`Text too long for ${platform}. Max ${platformConfig.maxTextLength} characters.`)
    }

    // Mock successful post response
    const mockPostId = `${platform}_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
    
    return {
      success: true,
      postId: mockPostId,
      platform,
      url: `https://${platform}.com/post/${mockPostId}`,
      timestamp: new Date().toISOString(),
      testAccount: testAccount || `test_${platform}_account`,
      metrics: {
        views: 0,
        likes: 0,
        shares: 0,
        comments: 0
      }
    }
  } catch (error) {
    console.error(`Failed to post to ${platform}:`, error)
    throw error
  }
}

// Generate optimized content for each platform
export const optimizeContentForPlatform = (content, platform) => {
  const platformConfig = SUPPORTED_PLATFORMS[platform]
  
  if (!platformConfig) {
    throw new Error(`Unsupported platform: ${platform}`)
  }

  let optimizedContent = { ...content }

  switch (platform) {
    case 'tiktok':
      // TikTok optimizations
      optimizedContent = {
        ...content,
        text: addTikTokOptimizations(content.text),
        hashtags: generateTikTokHashtags(content.hashtags),
        callToAction: makeCTAMoreEngaging(content.callToAction, 'tiktok')
      }
      break

    case 'instagram':
      // Instagram optimizations
      optimizedContent = {
        ...content,
        text: addInstagramOptimizations(content.text),
        hashtags: generateInstagramHashtags(content.hashtags),
        callToAction: makeCTAMoreEngaging(content.callToAction, 'instagram')
      }
      break

    default:
      break
  }

  // Ensure text doesn't exceed platform limits
  if (optimizedContent.text && optimizedContent.text.length > platformConfig.maxTextLength) {
    optimizedContent.text = optimizedContent.text.substring(0, platformConfig.maxTextLength - 3) + '...'
  }

  return optimizedContent
}

// TikTok-specific optimizations
const addTikTokOptimizations = (text) => {
  if (!text) return text
  
  // Add trending elements for TikTok
  const trendingPhrases = [
    'POV:',
    'This is your sign to',
    'Tell me why',
    'Not me',
    'The way I',
    'It\'s the',
    'When you realize'
  ]
  
  // Randomly add a trending phrase (30% chance)
  if (Math.random() < 0.3) {
    const randomPhrase = trendingPhrases[Math.floor(Math.random() * trendingPhrases.length)]
    return `${randomPhrase} ${text.toLowerCase()}`
  }
  
  return text
}

// Instagram-specific optimizations
const addInstagramOptimizations = (text) => {
  if (!text) return text
  
  // Add Instagram-style formatting
  return text
    .split('\n')
    .map(line => line.trim())
    .filter(line => line.length > 0)
    .join('\n\n') // Double line breaks for better Instagram formatting
}

// Generate platform-specific hashtags
const generateTikTokHashtags = (existingHashtags = '') => {
  const tiktokTrending = [
    '#fyp', '#foryou', '#viral', '#trending', '#tiktok',
    '#musthave', '#gameChanger', '#lifehack', '#amazing'
  ]
  
  const existing = existingHashtags.split(' ').filter(tag => tag.startsWith('#'))
  const additional = tiktokTrending.filter(tag => !existing.includes(tag)).slice(0, 5)
  
  return [...existing, ...additional].join(' ')
}

const generateInstagramHashtags = (existingHashtags = '') => {
  const instagramTrending = [
    '#instagood', '#photooftheday', '#love', '#beautiful',
    '#happy', '#follow', '#picoftheday', '#instadaily'
  ]
  
  const existing = existingHashtags.split(' ').filter(tag => tag.startsWith('#'))
  const additional = instagramTrending.filter(tag => !existing.includes(tag)).slice(0, 5)
  
  return [...existing, ...additional].join(' ')
}

// Make CTAs more engaging for each platform
const makeCTAMoreEngaging = (cta, platform) => {
  if (!cta) return cta
  
  const platformCTAs = {
    tiktok: [
      'Drop a 🔥 if you agree!',
      'Comment your thoughts below!',
      'Save this for later!',
      'Share with someone who needs this!',
      'Follow for more tips like this!'
    ],
    instagram: [
      'Double tap if you love this! ❤️',
      'Save this post for later!',
      'Tag a friend who needs to see this!',
      'What do you think? Comment below!',
      'Follow us for more amazing content!'
    ]
  }
  
  // 50% chance to replace with platform-specific CTA
  if (Math.random() < 0.5 && platformCTAs[platform]) {
    const randomCTA = platformCTAs[platform][Math.floor(Math.random() * platformCTAs[platform].length)]
    return randomCTA
  }
  
  return cta
}

// Get posting analytics (mock data for demo)
export const getPostAnalytics = async (postId) => {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 1000))
  
  // Generate mock analytics data
  const baseViews = Math.floor(Math.random() * 10000) + 100
  const engagementRate = Math.random() * 0.1 + 0.02 // 2-12% engagement
  
  return {
    postId,
    views: baseViews,
    likes: Math.floor(baseViews * engagementRate * 0.7),
    shares: Math.floor(baseViews * engagementRate * 0.1),
    comments: Math.floor(baseViews * engagementRate * 0.2),
    engagementRate: (engagementRate * 100).toFixed(2) + '%',
    reach: Math.floor(baseViews * 0.8),
    impressions: Math.floor(baseViews * 1.2),
    lastUpdated: new Date().toISOString()
  }
}

// Validate test account credentials
export const validateTestAccount = async (platform, accountData) => {
  try {
    // Simulate validation
    await new Promise(resolve => setTimeout(resolve, 1500))
    
    // Mock validation logic
    if (!accountData.username || !accountData.accessToken) {
      throw new Error('Missing required account credentials')
    }
    
    return {
      valid: true,
      platform,
      username: accountData.username,
      accountId: `${platform}_${accountData.username}`,
      permissions: ['post', 'read_insights'],
      expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString() // 30 days
    }
  } catch (error) {
    console.error(`Failed to validate ${platform} account:`, error)
    throw error
  }
}

// Schedule posts for optimal timing
export const getOptimalPostingTimes = (platform, timezone = 'UTC') => {
  const optimalTimes = {
    tiktok: [
      { hour: 6, minute: 0, day: 'tuesday' },
      { hour: 10, minute: 0, day: 'tuesday' },
      { hour: 19, minute: 0, day: 'tuesday' },
      { hour: 9, minute: 0, day: 'wednesday' },
      { hour: 12, minute: 0, day: 'thursday' },
      { hour: 17, minute: 0, day: 'friday' }
    ],
    instagram: [
      { hour: 11, minute: 0, day: 'monday' },
      { hour: 14, minute: 0, day: 'tuesday' },
      { hour: 17, minute: 0, day: 'wednesday' },
      { hour: 11, minute: 0, day: 'thursday' },
      { hour: 14, minute: 0, day: 'friday' }
    ]
  }
  
  return optimalTimes[platform] || []
}
