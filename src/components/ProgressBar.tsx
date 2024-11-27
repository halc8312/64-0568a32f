"use client"

import { FaCheck } from 'react-icons/fa'

interface ProgressBarProps {
  current: number
  total: number
}

const ProgressBar = ({ current, total }: ProgressBarProps) => {
  const progress = (current / total) * 100

  return (
    <div className="w-full max-w-3xl mx-auto p-4">
      <div className="relative">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm font-semibold text-gray-700">
            質問 {current} / {total}
          </span>
          <span className="text-sm font-semibold text-gray-700">
            {Math.round(progress)}%
          </span>
        </div>
        
        <div className="h-2 bg-gray-200 rounded-full">
          <div
            className="h-full bg-blue-500 rounded-full transition-all duration-300 ease-in-out"
            style={{ width: `${progress}%` }}
          />
        </div>

        <div className="absolute top-8 left-0 w-full flex justify-between">
          {Array.from({ length: total }).map((_, index) => (
            <div
              key={index}
              className={`flex flex-col items-center ${
                index === current - 1
                  ? 'text-blue-500'
                  : index < current - 1
                  ? 'text-green-500'
                  : 'text-gray-300'
              }`}
            >
              <div
                className={`w-6 h-6 rounded-full flex items-center justify-center ${
                  index === current - 1
                    ? 'bg-blue-500 text-white'
                    : index < current - 1
                    ? 'bg-green-500 text-white'
                    : 'bg-gray-200'
                }`}
              >
                {index < current - 1 ? (
                  <FaCheck className="w-3 h-3" />
                ) : (
                  <span className="text-xs">{index + 1}</span>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

export default ProgressBar