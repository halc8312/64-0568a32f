"use client"

import Image from 'next/image'
import { motion } from 'framer-motion'

interface MainVisualProps {
  imageSrc: string
  title: string
  description: string
}

const MainVisual = ({ imageSrc = "/images/main-visual.jpg", title = "あなたの個性を科学的に診断", description = "64種類の性格タイプから、あなたの真の姿を見つけ出します" }: MainVisualProps) => {
  return (
    <div className="relative w-full h-[600px] lg:h-[700px] overflow-hidden">
      <Image
        src={imageSrc}
        alt="メインビジュアル"
        fill
        priority
        className="object-cover"
      />
      <div className="absolute inset-0 bg-black bg-opacity-40">
        <div className="container mx-auto h-full flex items-center px-4">
          <div className="max-w-2xl text-white">
            <motion.h1 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6"
            >
              {title}
            </motion.h1>
            <motion.p 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="text-lg md:text-xl lg:text-2xl mb-8"
            >
              {description}
            </motion.p>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
            >
              <button className="bg-[#F5A623] hover:bg-[#f39c0b] text-white font-bold py-3 px-8 rounded-lg transition duration-300 transform hover:scale-105">
                診断を始める
              </button>
            </motion.div>
          </div>
        </div>
      </div>
      
      <div className="absolute bottom-0 left-0 w-full">
        <svg
          className="w-full h-16 text-white fill-current"
          viewBox="0 0 1440 48"
          preserveAspectRatio="none"
        >
          <path d="M0,48 L1440,48 L1440,0 C1440,0 1140,48 720,48 C300,48 0,0 0,0 L0,48 Z" />
        </svg>
      </div>
    </div>
  )
}

export default MainVisual