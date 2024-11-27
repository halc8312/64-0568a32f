"use client"

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { FiDownload, FiCheck, FiAlertCircle } from 'react-icons/fi'
import { IoMdSettings } from 'react-icons/io'
import { supabase } from '@/supabase'
import Link from 'next/link'

const Backup = () => {
  const router = useRouter()
  const [selectedItems, setSelectedItems] = useState({
    personalityData: true,
    diagnosisHistory: true,
    userSettings: true
  })
  const [isProcessing, setIsProcessing] = useState(false)
  const [progress, setProgress] = useState(0)
  const [status, setStatus] = useState<'idle' | 'processing' | 'success' | 'error'>('idle')
  const [downloadUrl, setDownloadUrl] = useState('')

  const handleItemToggle = (item: keyof typeof selectedItems) => {
    setSelectedItems(prev => ({
      ...prev,
      [item]: !prev[item]
    }))
  }

  const startBackup = async () => {
    setIsProcessing(true)
    setStatus('processing')
    try {
      const { data: { session } } = await supabase.auth.getSession()
      if (!session) {
        router.push('/login')
        return
      }

      // Simulate progress
      for (let i = 0; i <= 100; i += 10) {
        setProgress(i)
        await new Promise(resolve => setTimeout(resolve, 200))
      }

      const { data: userData } = await supabase
        .from('users')
        .select('*')
        .eq('id', session.user.id)
        .single()

      const { data: diagnosisData } = await supabase
        .from('personality_diagnoses')
        .select('*')
        .eq('user_id', session.user.id)

      const backupData = {
        userData: selectedItems.personalityData ? userData : null,
        diagnosisHistory: selectedItems.diagnosisHistory ? diagnosisData : null,
        timestamp: new Date().toISOString()
      }

      const blob = new Blob([JSON.stringify(backupData, null, 2)], { type: 'application/json' })
      const url = window.URL.createObjectURL(blob)
      setDownloadUrl(url)
      setStatus('success')
    } catch (error) {
      console.error('Backup failed:', error)
      setStatus('error')
    } finally {
      setIsProcessing(false)
    }
  }

  return (
    <div className="min-h-screen h-full bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-3xl mx-auto bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center mb-6">
            <IoMdSettings className="text-2xl text-blue-600 mr-2" />
            <h1 className="text-2xl font-bold text-gray-800">データバックアップ</h1>
          </div>

          <div className="space-y-4 mb-8">
            <div className="border rounded-lg p-4">
              <label className="flex items-center space-x-3">
                <input
                  type="checkbox"
                  checked={selectedItems.personalityData}
                  onChange={() => handleItemToggle('personalityData')}
                  className="form-checkbox h-5 w-5 text-blue-600"
                />
                <span className="text-gray-700">パーソナリティデータ</span>
              </label>
            </div>

            <div className="border rounded-lg p-4">
              <label className="flex items-center space-x-3">
                <input
                  type="checkbox"
                  checked={selectedItems.diagnosisHistory}
                  onChange={() => handleItemToggle('diagnosisHistory')}
                  className="form-checkbox h-5 w-5 text-blue-600"
                />
                <span className="text-gray-700">診断履歴</span>
              </label>
            </div>

            <div className="border rounded-lg p-4">
              <label className="flex items-center space-x-3">
                <input
                  type="checkbox"
                  checked={selectedItems.userSettings}
                  onChange={() => handleItemToggle('userSettings')}
                  className="form-checkbox h-5 w-5 text-blue-600"
                />
                <span className="text-gray-700">ユーザー設定</span>
              </label>
            </div>
          </div>

          {status === 'processing' && (
            <div className="mb-6">
              <div className="w-full bg-gray-200 rounded-full h-2.5">
                <div
                  className="bg-blue-600 h-2.5 rounded-full transition-all duration-500"
                  style={{ width: `${progress}%` }}
                ></div>
              </div>
              <p className="text-sm text-gray-600 mt-2">バックアップを作成中... {progress}%</p>
            </div>
          )}

          {status === 'success' && (
            <div className="mb-6 p-4 bg-green-50 rounded-lg flex items-center">
              <FiCheck className="text-green-500 mr-2" />
              <p className="text-green-700">バックアップが完了しました</p>
            </div>
          )}

          {status === 'error' && (
            <div className="mb-6 p-4 bg-red-50 rounded-lg flex items-center">
              <FiAlertCircle className="text-red-500 mr-2" />
              <p className="text-red-700">バックアップに失敗しました。もう一度お試しください。</p>
            </div>
          )}

          <div className="flex flex-col sm:flex-row space-y-3 sm:space-y-0 sm:space-x-4">
            <button
              onClick={startBackup}
              disabled={isProcessing || !Object.values(selectedItems).some(Boolean)}
              className={`flex items-center justify-center px-6 py-3 rounded-lg ${
                isProcessing || !Object.values(selectedItems).some(Boolean)
                  ? 'bg-gray-300 cursor-not-allowed'
                  : 'bg-blue-600 hover:bg-blue-700'
              } text-white font-medium transition-colors duration-200`}
            >
              <FiDownload className="mr-2" />
              バックアップを作成
            </button>

            {downloadUrl && (
              <a
                href={downloadUrl}
                download="backup.json"
                className="flex items-center justify-center px-6 py-3 rounded-lg bg-green-600 hover:bg-green-700 text-white font-medium transition-colors duration-200"
              >
                ダウンロード
              </a>
            )}
          </div>
        </div>

        <div className="mt-6 text-center">
          <Link
            href="/settings"
            className="text-blue-600 hover:text-blue-800 text-sm font-medium"
          >
            設定画面に戻る
          </Link>
        </div>
      </div>
    </div>
  )
}

export default Backup