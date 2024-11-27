"use client"

import { FaTwitter, FaFacebook, FaLine, FaLink } from 'react-icons/fa'
import { useState } from 'react'

type ShareButtonsProps = {
    shareUrl: string
    title: string
}

const ShareButtons = ({ shareUrl, title }: ShareButtonsProps) => {
    const [copied, setCopied] = useState(false)

    const encodedUrl = encodeURIComponent(shareUrl)
    const encodedTitle = encodeURIComponent(title)

    const shareLinks = {
        twitter: `https://twitter.com/intent/tweet?url=${encodedUrl}&text=${encodedTitle}`,
        facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`,
        line: `https://social-plugins.line.me/lineit/share?url=${encodedUrl}`
    }

    const handleCopyLink = async () => {
        try {
            await navigator.clipboard.writeText(shareUrl)
            setCopied(true)
            setTimeout(() => setCopied(false), 2000)
        } catch (err) {
            console.error('URLのコピーに失敗しました')
        }
    }

    return (
        <div className="flex flex-col items-center space-y-4 p-4">
            <h3 className="text-lg font-bold mb-2">診断結果をシェア</h3>
            
            <div className="flex space-x-4">
                <button
                    onClick={() => window.open(shareLinks.twitter, '_blank')}
                    className="flex items-center justify-center w-12 h-12 rounded-full bg-[#1DA1F2] text-white hover:opacity-80 transition-opacity"
                >
                    <FaTwitter size={24} />
                </button>

                <button
                    onClick={() => window.open(shareLinks.facebook, '_blank')}
                    className="flex items-center justify-center w-12 h-12 rounded-full bg-[#1877F2] text-white hover:opacity-80 transition-opacity"
                >
                    <FaFacebook size={24} />
                </button>

                <button
                    onClick={() => window.open(shareLinks.line, '_blank')}
                    className="flex items-center justify-center w-12 h-12 rounded-full bg-[#00B900] text-white hover:opacity-80 transition-opacity"
                >
                    <FaLine size={24} />
                </button>

                <button
                    onClick={handleCopyLink}
                    className="flex items-center justify-center w-12 h-12 rounded-full bg-gray-600 text-white hover:opacity-80 transition-opacity relative"
                >
                    <FaLink size={20} />
                    {copied && (
                        <div className="absolute -top-10 left-1/2 transform -translate-x-1/2 bg-gray-800 text-white text-xs py-1 px-2 rounded">
                            コピーしました
                        </div>
                    )}
                </button>
            </div>

            <p className="text-sm text-gray-500 mt-2">
                結果をシェアして、友達と比較してみましょう！
            </p>
        </div>
    )
}

export default ShareButtons