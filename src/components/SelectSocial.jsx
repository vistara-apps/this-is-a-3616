import React from 'react'
import { motion } from 'framer-motion'
import { Instagram, MessageCircle } from 'lucide-react'

const SelectSocial = ({ selectedPlatform, onSelect, variant = 'default' }) => {
  const platforms = [
    {
      id: 'tiktok',
      name: 'TikTok',
      icon: MessageCircle,
      color: 'bg-black',
      description: 'Viral, engaging content for Gen Z'
    },
    {
      id: 'instagram',
      name: 'Instagram',
      icon: Instagram,
      color: 'bg-gradient-to-r from-purple-500 to-pink-500',
      description: 'Visual storytelling and lifestyle'
    }
  ]

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-medium text-text">Select Platform</h3>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {platforms.map((platform) => {
          const Icon = platform.icon
          const isSelected = selectedPlatform === platform.id
          
          return (
            <motion.button
              key={platform.id}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => onSelect(platform.id)}
              className={`
                card p-6 text-left transition-all duration-200 border-2
                ${isSelected 
                  ? 'border-primary bg-primary/5' 
                  : 'border-transparent hover:border-gray-200'
                }
              `}
            >
              <div className="flex items-start space-x-4">
                <div className={`p-3 rounded-lg ${platform.color} text-white`}>
                  <Icon className="h-6 w-6" />
                </div>
                <div className="flex-1">
                  <h4 className="font-medium text-text">{platform.name}</h4>
                  <p className="text-sm text-gray-500 mt-1">{platform.description}</p>
                  {isSelected && (
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="mt-2 text-xs text-primary font-medium"
                    >
                      ✓ Selected
                    </motion.div>
                  )}
                </div>
              </div>
            </motion.button>
          )
        })}
      </div>
    </div>
  )
}

export default SelectSocial