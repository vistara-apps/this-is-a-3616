import React from 'react'
import { motion } from 'framer-motion'

const LoadingSpinner = ({ size = 'default' }) => {
  const sizeClasses = {
    small: 'w-4 h-4',
    default: 'w-8 h-8',
    large: 'w-12 h-12'
  }

  return (
    <motion.div
      className={`${sizeClasses[size]} border-2 border-gray-200 border-t-primary rounded-full`}
      animate={{ rotate: 360 }}
      transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
    />
  )
}

export default LoadingSpinner