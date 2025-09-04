import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { Copy, Download, Share2, Instagram, MessageCircle, Check } from 'lucide-react'
import toast from 'react-hot-toast'

const AdCard = ({ 
  creative, 
  variant = 'default', 
  onEdit, 
  onPost, 
  productImage,
  platform 
}) => {
  const [copied, setCopied] = useState(false)

  const copyToClipboard = async (text) => {
    try {
      await navigator.clipboard.writeText(text)
      setCopied(true)
      toast.success('Copied to clipboard!')
      setTimeout(() => setCopied(false), 2000)
    } catch (error) {
      toast.error('Failed to copy text')
    }
  }

  const handleDownload = () => {
    // Create a canvas to combine image and text
    const canvas = document.createElement('canvas')
    const ctx = canvas.getContext('2d')
    
    // For demo purposes, just show success message
    toast.success('Ad creative would be downloaded as image')
  }

  const handlePost = () => {
    onPost?.(creative)
    toast.success(`Posted to ${platform} test account!`)
  }

  const platformIcon = platform === 'instagram' ? Instagram : MessageCircle
  const PlatformIcon = platformIcon

  const adText = `${creative.headline}\n\n${creative.body}\n\n${creative.cta}${creative.hashtags ? `\n\n${creative.hashtags}` : ''}`

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -2 }}
      className="card p-6 space-y-4"
    >
      {/* Platform indicator */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <PlatformIcon className="h-5 w-5 text-primary" />
          <span className="text-sm font-medium capitalize">{platform}</span>
        </div>
        {variant === 'withEdit' && (
          <button
            onClick={() => onEdit?.(creative)}
            className="text-xs text-gray-500 hover:text-primary"
          >
            Edit
          </button>
        )}
      </div>

      {/* Visual preview */}
      <div className="relative bg-gray-100 rounded-md aspect-square overflow-hidden">
        {productImage ? (
          <img 
            src={productImage} 
            alt="Product" 
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <span className="text-gray-400">Product Image</span>
          </div>
        )}
        
        {/* Overlay with ad text preview */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent p-4 flex flex-col justify-end">
          <h3 className="text-white font-bold text-sm mb-1 line-clamp-2">
            {creative.headline}
          </h3>
          <p className="text-white/90 text-xs line-clamp-2">
            {creative.body}
          </p>
        </div>
      </div>

      {/* Ad copy details */}
      <div className="space-y-3">
        <div>
          <label className="text-xs font-medium text-gray-500 uppercase tracking-wide">
            Headline
          </label>
          <p className="text-sm font-medium text-text mt-1">{creative.headline}</p>
        </div>
        
        <div>
          <label className="text-xs font-medium text-gray-500 uppercase tracking-wide">
            Body
          </label>
          <p className="text-sm text-text mt-1">{creative.body}</p>
        </div>
        
        <div>
          <label className="text-xs font-medium text-gray-500 uppercase tracking-wide">
            Call to Action
          </label>
          <p className="text-sm font-medium text-primary mt-1">{creative.cta}</p>
        </div>
        
        {creative.hashtags && (
          <div>
            <label className="text-xs font-medium text-gray-500 uppercase tracking-wide">
              Hashtags
            </label>
            <p className="text-sm text-blue-600 mt-1">{creative.hashtags}</p>
          </div>
        )}
      </div>

      {/* Actions */}
      <div className="flex items-center space-x-2 pt-4 border-t border-gray-100">
        <button
          onClick={() => copyToClipboard(adText)}
          className="flex items-center space-x-1 px-3 py-2 text-xs bg-gray-100 hover:bg-gray-200 rounded-md transition-colors"
        >
          {copied ? <Check className="h-3 w-3" /> : <Copy className="h-3 w-3" />}
          <span>{copied ? 'Copied!' : 'Copy'}</span>
        </button>
        
        <button
          onClick={handleDownload}
          className="flex items-center space-x-1 px-3 py-2 text-xs bg-gray-100 hover:bg-gray-200 rounded-md transition-colors"
        >
          <Download className="h-3 w-3" />
          <span>Download</span>
        </button>
        
        <button
          onClick={handlePost}
          className="flex items-center space-x-1 px-3 py-2 text-xs bg-primary text-white hover:bg-primary/90 rounded-md transition-colors"
        >
          <Share2 className="h-3 w-3" />
          <span>Post</span>
        </button>
      </div>
    </motion.div>
  )
}

export default AdCard