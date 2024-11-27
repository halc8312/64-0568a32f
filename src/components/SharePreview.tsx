"use client"

import { useState } from 'react'
import { BiShareAlt, BiCopy } from 'react-icons/bi'
import { FaFacebookF, FaTwitter, FaLine } from 'react-icons/fa'

type PreviewData = {
  personalityType: string
  description: string
  chartData?: any
  shareUrl: string
}

const SharePreview = ({ previewData }: { previewData: PreviewData }) => {
  const [copied, setCopied] = useState(false)

  const handleCopyUrl = async () => {
    try {
      await navigator.clipboard.writeText(previewData.shareUrl)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch (err) {
      console.error('Failed to copy URL:', err)
    }
  }

  const handleShare = (platform: string) => {
    const text = `私の性格診断結果：${previewData.personalityType}`
    const url = previewData.shareUrl
    
    switch (platform) {
      case 'twitter':
        window.open(`https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(url)}`)
        break
      case 'facebook':
        window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`)
        break
      case 'line':
        window.open(`https://social-plugins.line.me/lineit/share?url=${encodeURIComponent(url)}`)
        break
    }
  }

  return (
    <div className="w-full max-w-2xl mx-auto bg-white rounded-lg shadow-md p-6">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-800 mb-2">シェアプレビュー</h2>
        <p className="text-gray-600 text-sm">下記の内容でシェアされます</p>
      </div>

      <div className="bg-gray-50 rounded-lg p-4 mb-6">
        <div className="border-b pb-4 mb-4">
          <h3 className="text-xl font-semibold text-gray-800">{previewData.personalityType}</h3>
          <p className="text-gray-600 mt-2">{previewData.description}</p>
        </div>

        {previewData.chartData && (
          <div className="aspect-w-16 aspect-h-9 bg-gray-200 rounded-lg mb-4">
            <img
              src="https://placehold.co/600x400/e2e8f0/475569?text=Chart+Preview"
              alt="性格診断チャート"
              className="rounded-lg object-cover"
            />
          </div>
        )}

        <div className="flex items-center justify-between bg-white rounded p-3">
          <span className="text-sm text-gray-600 truncate flex-1">{previewData.shareUrl}</span>
          <button
            onClick={handleCopyUrl}
            className="ml-2 text-blue-600 hover:text-blue-700 transition-colors"
          >
            <div className="flex items-center">
              <BiCopy className="w-5 h-5 mr-1" />
              {copied ? "コピー完了!" : "URLをコピー"}
            </div>
          </button>
        </div>
      </div>

      <div className="space-y-4">
        <h3 className="text-lg font-semibold text-gray-800">シェア先を選択</h3>
        <div className="flex space-x-4">
          <button
            onClick={() => handleShare('twitter')}
            className="flex-1 bg-[#1DA1F2] text-white py-3 rounded-lg hover:bg-[#1a8cd8] transition-colors flex items-center justify-center"
          >
            <FaTwitter className="w-5 h-5 mr-2" />
            Twitter
          </button>
          <button
            onClick={() => handleShare('facebook')}
            className="flex-1 bg-[#4267B2] text-white py-3 rounded-lg hover:bg-[#365899] transition-colors flex items-center justify-center"
          >
            <FaFacebookF className="w-5 h-5 mr-2" />
            Facebook
          </button>
          <button
            onClick={() => handleShare('line')}
            className="flex-1 bg-[#00B900] text-white py-3 rounded-lg hover:bg-[#009900] transition-colors flex items-center justify-center"
          >
            <FaLine className="w-5 h-5 mr-2" />
            LINE
          </button>
        </div>
      </div>
    </div>
  )
}

export default SharePreview