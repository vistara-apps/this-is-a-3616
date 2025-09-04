import React, { useState, useRef } from 'react'
import { Upload, X, Image } from 'lucide-react'
import { motion } from 'framer-motion'
import toast from 'react-hot-toast'

const ImageUploader = ({ onImageUpload, existingImage = null }) => {
  const [dragActive, setDragActive] = useState(false)
  const [uploading, setUploading] = useState(false)
  const [preview, setPreview] = useState(existingImage)
  const fileInputRef = useRef(null)

  const handleDrag = (e) => {
    e.preventDefault()
    e.stopPropagation()
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true)
    } else if (e.type === "dragleave") {
      setDragActive(false)
    }
  }

  const handleDrop = (e) => {
    e.preventDefault()
    e.stopPropagation()
    setDragActive(false)
    
    const files = Array.from(e.dataTransfer.files)
    if (files.length > 0) {
      handleFile(files[0])
    }
  }

  const handleFileInput = (e) => {
    const file = e.target.files?.[0]
    if (file) {
      handleFile(file)
    }
  }

  const handleFile = async (file) => {
    if (!file.type.startsWith('image/')) {
      toast.error('Please upload an image file')
      return
    }

    if (file.size > 5 * 1024 * 1024) { // 5MB limit
      toast.error('Image size must be less than 5MB')
      return
    }

    setUploading(true)
    
    try {
      // Create preview
      const reader = new FileReader()
      reader.onload = (e) => {
        setPreview(e.target.result)
      }
      reader.readAsDataURL(file)

      // Simulate upload delay
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      // In a real app, you would upload to Supabase storage here
      const mockUrl = URL.createObjectURL(file)
      
      onImageUpload({
        file,
        url: mockUrl,
        name: file.name
      })
      
      toast.success('Image uploaded successfully!')
    } catch (error) {
      toast.error('Failed to upload image')
      console.error('Upload error:', error)
    } finally {
      setUploading(false)
    }
  }

  const clearImage = () => {
    setPreview(null)
    onImageUpload(null)
    if (fileInputRef.current) {
      fileInputRef.current.value = ''
    }
  }

  const openFileDialog = () => {
    fileInputRef.current?.click()
  }

  if (preview) {
    return (
      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="relative card p-4"
      >
        <div className="relative group">
          <img 
            src={preview} 
            alt="Product preview" 
            className="w-full h-64 object-cover rounded-md"
          />
          <div className="absolute inset-0 bg-black/0 group-hover:bg-black/50 transition-colors duration-200 rounded-md flex items-center justify-center">
            <button
              onClick={clearImage}
              className="opacity-0 group-hover:opacity-100 transition-opacity duration-200 bg-red-500 hover:bg-red-600 text-white p-2 rounded-full"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
        </div>
      </motion.div>
    )
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className={`
        relative card p-8 border-2 border-dashed cursor-pointer transition-all duration-200
        ${dragActive ? 'border-primary bg-primary/5' : 'border-gray-300'}
        ${uploading ? 'pointer-events-none opacity-75' : 'hover:border-primary hover:bg-primary/5'}
      `}
      onDragEnter={handleDrag}
      onDragLeave={handleDrag}
      onDragOver={handleDrag}
      onDrop={handleDrop}
      onClick={openFileDialog}
    >
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={handleFileInput}
        className="hidden"
      />
      
      <div className="text-center">
        {uploading ? (
          <div className="flex flex-col items-center space-y-4">
            <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin" />
            <p className="text-text">Uploading image...</p>
          </div>
        ) : (
          <div className="flex flex-col items-center space-y-4">
            <div className="p-4 bg-primary/10 rounded-full">
              <Upload className="h-8 w-8 text-primary" />
            </div>
            <div>
              <p className="text-lg font-medium text-text">Upload Product Image</p>
              <p className="text-sm text-gray-500 mt-1">
                Drag and drop or click to browse
              </p>
              <p className="text-xs text-gray-400 mt-2">
                PNG, JPG, GIF up to 5MB
              </p>
            </div>
          </div>
        )}
      </div>
    </motion.div>
  )
}

export default ImageUploader