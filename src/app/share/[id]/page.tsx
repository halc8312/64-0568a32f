"use client"

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Image from 'next/image'
import Link from 'next/link'
import { FaTwitter, FaFacebook, FaLine, FaLink } from 'react-icons/fa'
import { supabase } from '@/supabase'

type ShareSettings = {
  includePersonalityType: boolean
  includeAdvice: boolean
  includeCompatibility: boolean
  customMessage: string
}

type SharePlatform = 'twitter' | 'facebook' | 'line' | 'copy'

export default function ShareSettings({ params }: { params: { id: string } }) {
  const router = useRouter()
  const [settings, setSettings] = useState<ShareSettings>({
    includePersonalityType: true,
    includeAdvice: true,
    includeCompatibility: true,
    customMessage: ''
  })
  const [diagnoseData, setDiagnoseData] = useState<any>(null)
  const [shareUrl, setShareUrl] = useState('')
  const [copied, setCopied] = useState(false)

  useEffect(() => {
    const fetchDiagnoseData = async () => {
      const { data, error } = await supabase
        .from('personality_diagnoses')
        .select('personality_type')
        .eq('id', params.id)
        .single()

      if (error) {
        console.error('Error fetching diagnose data:', error)
        return
      }

      setDiagnoseData(data)
    }

    fetchDiagnoseData()
  }, [params.id])

  const handleSettingChange = (key: keyof ShareSettings, value: boolean | string) => {
    setSettings(prev => ({ ...prev, [key]: value }))
  }

  const generateShareContent = async () => {
    try {
      const response = await fetch('/api/share-content-generate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          diagnoseId: params.id,
          settings
        }),
      })
      const data = await response.json()
      setShareUrl(data.shareUrl)

      await supabase.from('shared_contents').insert({
        diagnosis_id: params.id,
        share_settings: settings,
        share_url: data.shareUrl
      })
    } catch (error) {
      console.error('Error generating share content:', error)
    }
  }

  const handleShare = async (platform: SharePlatform) => {
    if (!shareUrl) {
      await generateShareContent()
    }

    const shareText = `私の性格診断結果をチェックしてください！ ${settings.customMessage}`
    const encodedText = encodeURIComponent(shareText)
    const encodedUrl = encodeURIComponent(shareUrl || window.location.href)

    switch (platform) {
      case 'twitter':
        window.open(`https://twitter.com/intent/tweet?text=${encodedText}&url=${encodedUrl}`)
        break
      case 'facebook':
        window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`)
        break
      case 'line':
        window.open(`https://social-plugins.line.me/lineit/share?url=${encodedUrl}`)
        break
      case 'copy':
        navigator.clipboard.writeText(shareUrl)
        setCopied(true)
        setTimeout(() => setCopied(false), 2000)
        break
    }
  }

  return (
    <div className="min-h-screen h-full bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4">
        <h1 className="text-3xl font-bold text-gray-800 mb-8">シェア設定</h1>

        <div className="bg-white rounded-lg shadow p-6 mb-8">
          <h2 className="text-xl font-semibold mb-4">シェア内容のカスタマイズ</h2>
          
          <div className="space-y-4">
            <label className="flex items-center space-x-2">
              <input
                type="checkbox"
                checked={settings.includePersonalityType}
                onChange={(e) => handleSettingChange('includePersonalityType', e.target.checked)}
                className="form-checkbox h-5 w-5 text-blue-600"
              />
              <span>性格タイプを含める</span>
            </label>

            <label className="flex items-center space-x-2">
              <input
                type="checkbox"
                checked={settings.includeAdvice}
                onChange={(e) => handleSettingChange('includeAdvice', e.target.checked)}
                className="form-checkbox h-5 w-5 text-blue-600"
              />
              <span>アドバイスを含める</span>
            </label>

            <label className="flex items-center space-x-2">
              <input
                type="checkbox"
                checked={settings.includeCompatibility}
                onChange={(e) => handleSettingChange('includeCompatibility', e.target.checked)}
                className="form-checkbox h-5 w-5 text-blue-600"
              />
              <span>相性診断結果を含める</span>
            </label>

            <div className="space-y-2">
              <label className="block">カスタムメッセージ</label>
              <textarea
                value={settings.customMessage}
                onChange={(e) => handleSettingChange('customMessage', e.target.value)}
                className="w-full border rounded-md p-2"
                rows={3}
                placeholder="シェア時に表示するメッセージを入力してください"
              />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6 mb-8">
          <h2 className="text-xl font-semibold mb-4">プレビュー</h2>
          <div className="border rounded-lg p-4">
            <div className="aspect-w-16 aspect-h-9 mb-4">
              <Image
                src="https://placehold.co/600x400"
                alt="診断結果プレビュー"
                width={600}
                height={400}
                className="rounded-lg"
              />
            </div>
            {diagnoseData && (
              <div className="text-gray-700">
                <p className="font-semibold">性格タイプ: {diagnoseData.personality_type}</p>
                <p className="mt-2">{settings.customMessage}</p>
              </div>
            )}
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-semibold mb-4">シェア先を選択</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <button
              onClick={() => handleShare('twitter')}
              className="flex items-center justify-center space-x-2 bg-[#1DA1F2] text-white p-3 rounded-lg hover:opacity-90"
            >
              <FaTwitter className="text-xl" />
              <span>Twitter</span>
            </button>
            <button
              onClick={() => handleShare('facebook')}
              className="flex items-center justify-center space-x-2 bg-[#4267B2] text-white p-3 rounded-lg hover:opacity-90"
            >
              <FaFacebook className="text-xl" />
              <span>Facebook</span>
            </button>
            <button
              onClick={() => handleShare('line')}
              className="flex items-center justify-center space-x-2 bg-[#00B900] text-white p-3 rounded-lg hover:opacity-90"
            >
              <FaLine className="text-xl" />
              <span>LINE</span>
            </button>
            <button
              onClick={() => handleShare('copy')}
              className="flex items-center justify-center space-x-2 bg-gray-600 text-white p-3 rounded-lg hover:opacity-90"
            >
              <FaLink className="text-xl" />
              <span>{copied ? 'コピーしました！' : 'URLをコピー'}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}