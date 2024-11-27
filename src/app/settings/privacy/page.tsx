"use client"

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { FiLock, FiBell, FiShare2, FiSave } from 'react-icons/fi'
import { supabase } from '@/supabase'

export default function PrivacySettings() {
  const router = useRouter()
  const [settings, setSettings] = useState({
    profileVisibility: 'private',
    notificationEnabled: true,
    dataSharing: {
      personalityType: false,
      adviceHistory: false,
      diagnosticResults: false
    }
  })
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState('')

  useEffect(() => {
    fetchSettings()
  }, [])

  const fetchSettings = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) {
        router.push('/login')
        return
      }

      const { data, error } = await supabase
        .from('user_settings')
        .select('privacy_settings')
        .eq('user_id', user.id)
        .single()

      if (error) throw error
      if (data?.privacy_settings) {
        setSettings(data.privacy_settings)
      }
    } catch (error) {
      console.error('Error fetching settings:', error)
    }
  }

  const saveSettings = async () => {
    try {
      setLoading(true)
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) {
        router.push('/login')
        return
      }

      const { error } = await supabase
        .from('user_settings')
        .upsert({
          user_id: user.id,
          privacy_settings: settings,
          updated_at: new Date().toISOString()
        })

      if (error) throw error
      setMessage('設定を保存しました')
      setTimeout(() => setMessage(''), 3000)
    } catch (error) {
      console.error('Error saving settings:', error)
      setMessage('設定の保存に失敗しました')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen h-full bg-gray-50">
      <div className="max-w-3xl mx-auto py-8 px-4">
        <h1 className="text-2xl font-bold text-gray-800 mb-8">プライバシー設定</h1>

        <div className="bg-white rounded-lg shadow p-6 mb-6">
          <div className="flex items-center mb-4">
            <FiLock className="text-blue-500 mr-2" size={20} />
            <h2 className="text-lg font-semibold">公開範囲設定</h2>
          </div>
          <select
            value={settings.profileVisibility}
            onChange={(e) => setSettings({...settings, profileVisibility: e.target.value})}
            className="w-full p-2 border rounded-md"
          >
            <option value="private">非公開</option>
            <option value="friends">フレンドのみ</option>
            <option value="public">公開</option>
          </select>
        </div>

        <div className="bg-white rounded-lg shadow p-6 mb-6">
          <div className="flex items-center mb-4">
            <FiBell className="text-blue-500 mr-2" size={20} />
            <h2 className="text-lg font-semibold">通知設定</h2>
          </div>
          <label className="flex items-center">
            <input
              type="checkbox"
              checked={settings.notificationEnabled}
              onChange={(e) => setSettings({...settings, notificationEnabled: e.target.checked})}
              className="mr-2"
            />
            通知を受け取る
          </label>
        </div>

        <div className="bg-white rounded-lg shadow p-6 mb-6">
          <div className="flex items-center mb-4">
            <FiShare2 className="text-blue-500 mr-2" size={20} />
            <h2 className="text-lg font-semibold">データ共有設定</h2>
          </div>
          <div className="space-y-3">
            <label className="flex items-center">
              <input
                type="checkbox"
                checked={settings.dataSharing.personalityType}
                onChange={(e) => setSettings({
                  ...settings,
                  dataSharing: {...settings.dataSharing, personalityType: e.target.checked}
                })}
                className="mr-2"
              />
              性格タイプの共有を許可
            </label>
            <label className="flex items-center">
              <input
                type="checkbox"
                checked={settings.dataSharing.adviceHistory}
                onChange={(e) => setSettings({
                  ...settings,
                  dataSharing: {...settings.dataSharing, adviceHistory: e.target.checked}
                })}
                className="mr-2"
              />
              アドバイス履歴の共有を許可
            </label>
            <label className="flex items-center">
              <input
                type="checkbox"
                checked={settings.dataSharing.diagnosticResults}
                onChange={(e) => setSettings({
                  ...settings,
                  dataSharing: {...settings.dataSharing, diagnosticResults: e.target.checked}
                })}
                className="mr-2"
              />
              診断結果の共有を許可
            </label>
          </div>
        </div>

        <div className="flex justify-end">
          <button
            onClick={saveSettings}
            disabled={loading}
            className="flex items-center bg-blue-500 hover:bg-blue-600 text-white px-6 py-2 rounded-md transition-colors"
          >
            <FiSave className="mr-2" />
            {loading ? '保存中...' : '設定を保存'}
          </button>
        </div>

        {message && (
          <div className="mt-4 p-3 bg-green-100 text-green-700 rounded-md">
            {message}
          </div>
        )}
      </div>
    </div>
  )
}