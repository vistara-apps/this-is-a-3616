import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { Sparkles, RefreshCw } from 'lucide-react'
import { generateAdCopy } from '../lib/openai'
import LoadingSpinner from './LoadingSpinner'
import toast from 'react-hot-toast'

const CopyGenerator = ({ 
  productName, 
  productDescription, 
  platform, 
  imageUrl,
  onCopyGenerated,
  variant = 'default' 
}) => {
  const [generating, setGenerating] = useState(false)
  const [variations, setVariations] = useState([])

  const handleGenerate = async () => {
    if (!productName || !productDescription || !platform) {
      toast.error('Please fill in all product details and select a platform')
      return
    }

    setGenerating(true)
    try {
      const result = await generateAdCopy(productName, productDescription, platform, imageUrl)
      setVariations(result.variations)
      onCopyGenerated?.(result.variations)
      toast.success(`Generated ${result.variations.length} ad variations!`)
    } catch (error) {
      toast.error('Failed to generate ad copy')
      console.error('Generation error:', error)
    } finally {
      setGenerating(false)
    }
  }

  const handleRegenerate = () => {
    setVariations([])
    handleGenerate()
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-medium text-text">AI Copy Generator</h3>
        {variations.length > 0 && (
          <button
            onClick={handleRegenerate}
            disabled={generating}
            className="flex items-center space-x-2 px-4 py-2 text-sm bg-gray-100 hover:bg-gray-200 disabled:opacity-50 rounded-md transition-colors"
          >
            <RefreshCw className={`h-4 w-4 ${generating ? 'animate-spin' : ''}`} />
            <span>Regenerate</span>
          </button>
        )}
      </div>

      {variations.length === 0 ? (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="card p-8 text-center"
        >
          <div className="space-y-4">
            <div className="p-4 bg-primary/10 rounded-full inline-block">
              <Sparkles className="h-8 w-8 text-primary" />
            </div>
            <div>
              <h4 className="text-lg font-medium text-text">Ready to Generate Ad Copy</h4>
              <p className="text-gray-500 mt-2">
                Our AI will create multiple engaging ad variations tailored for {platform || 'your selected platform'}
              </p>
            </div>
            <button
              onClick={handleGenerate}
              disabled={generating || !productName || !productDescription || !platform}
              className="btn-primary disabled:opacity-50 disabled:cursor-not-allowed inline-flex items-center space-x-2"
            >
              {generating ? (
                <>
                  <LoadingSpinner size="small" />
                  <span>Generating Magic...</span>
                </>
              ) : (
                <>
                  <Sparkles className="h-4 w-4" />
                  <span>Generate Ad Variations</span>
                </>
              )}
            </button>
          </div>
        </motion.div>
      ) : (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="space-y-4"
        >
          <p className="text-sm text-gray-600">
            Generated {variations.length} ad variations for {platform}
          </p>
          <div className="text-xs text-gray-500">
            Copy generated successfully! View your ad creatives below.
          </div>
        </motion.div>
      )}
    </div>
  )
}

export default CopyGenerator