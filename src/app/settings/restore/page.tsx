"use client"

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '@/supabase'
import { FaCloudUploadAlt, FaCheck, FaExclamationTriangle } from 'react-icons/fa'
import { BiArrowBack } from 'react-icons/bi'
import Link from 'next/link'

const RestorePage = () => {
  const router = useRouter()
  const [backups, setBackups] = useState([])
  const [selectedBackup, setSelectedBackup] = useState(null)
  const [selectedItems, setSelectedItems] = useState({
    userData: true,
    diagnosisData: true,
  })
  const [isRestoring, setIsRestoring] = useState(false)
  const [status, setStatus] = useState('')

  useEffect(() => {
    fetchBackups()
  }, [])

  const fetchBackups = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) {
        router.push('/login')
        return
      }

      const { data, error } = await supabase
        .storage
        .from('backups')
        .list(`${user.id}/`)

      if (error) throw error
      setBackups(data || [])
    } catch (error) {
      console.error('バックアップの取得に失敗しました:', error)
      // サンプルデータ
      setBackups([
        { name: 'backup_2024_01_01.json', created_at: '2024-01-01' },
        { name: 'backup_2023_12_31.json', created_at: '2023-12-31' },
      ])
    }
  }

  const handleRestore = async () => {
    if (!selectedBackup) {
      setStatus('バックアップを選択してください')
      return
    }

    setIsRestoring(true)
    setStatus('リストア中...')

    try {
      const { data: { user } } = await supabase.auth.getUser()
      const { data, error } = await supabase
        .storage
        .from('backups')
        .download(`${user.id}/${selectedBackup.name}`)

      if (error) throw error

      const backupData = await data.text()
      const parsedData = JSON.parse(backupData)

      if (selectedItems.userData) {
        await supabase
          .from('users')
          .upsert(parsedData.users)
      }

      if (selectedItems.diagnosisData) {
        await supabase
          .from('personality_diagnoses')
          .upsert(parsedData.diagnoses)
      }

      setStatus('リストアが完了しました')
    } catch (error) {
      console.error('リストアに失敗しました:', error)
      setStatus('リストアに失敗しました')
    } finally {
      setIsRestoring(false)
    }
  }

  return (
    <div className="min-h-screen h-full bg-gray-50">
      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="mb-6 flex items-center">
          <Link href="/settings" className="flex items-center text-gray-600 hover:text-gray-900">
            <BiArrowBack className="mr-2" />
            設定に戻る
          </Link>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <h1 className="text-2xl font-bold mb-6">データリストア</h1>

          <div className="mb-8">
            <h2 className="text-lg font-semibold mb-4">バックアップの選択</h2>
            <div className="space-y-3">
              {backups.map((backup) => (
                <div
                  key={backup.name}
                  className={`p-4 border rounded-lg cursor-pointer transition-colors ${
                    selectedBackup?.name === backup.name
                      ? 'border-blue-500 bg-blue-50'
                      : 'border-gray-200 hover:border-blue-300'
                  }`}
                  onClick={() => setSelectedBackup(backup)}
                >
                  <div className="flex items-center">
                    <FaCloudUploadAlt className="text-gray-500 mr-3" size={24} />
                    <div>
                      <div className="font-medium">{backup.name}</div>
                      <div className="text-sm text-gray-500">
                        作成日: {new Date(backup.created_at).toLocaleDateString()}
                      </div>
                    </div>
                    {selectedBackup?.name === backup.name && (
                      <FaCheck className="ml-auto text-blue-500" />
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="mb-8">
            <h2 className="text-lg font-semibold mb-4">リストア項目の選択</h2>
            <div className="space-y-3">
              <label className="flex items-center">
                <input
                  type="checkbox"
                  checked={selectedItems.userData}
                  onChange={(e) =>
                    setSelectedItems({ ...selectedItems, userData: e.target.checked })
                  }
                  className="form-checkbox h-5 w-5 text-blue-500"
                />
                <span className="ml-3">ユーザーデータ</span>
              </label>
              <label className="flex items-center">
                <input
                  type="checkbox"
                  checked={selectedItems.diagnosisData}
                  onChange={(e) =>
                    setSelectedItems({ ...selectedItems, diagnosisData: e.target.checked })
                  }
                  className="form-checkbox h-5 w-5 text-blue-500"
                />
                <span className="ml-3">診断データ</span>
              </label>
            </div>
          </div>

          {status && (
            <div
              className={`mb-6 p-4 rounded-lg ${
                status.includes('失敗')
                  ? 'bg-red-100 text-red-700'
                  : status.includes('完了')
                  ? 'bg-green-100 text-green-700'
                  : 'bg-blue-100 text-blue-700'
              }`}
            >
              <div className="flex items-center">
                {status.includes('失敗') ? (
                  <FaExclamationTriangle className="mr-2" />
                ) : status.includes('完了') ? (
                  <FaCheck className="mr-2" />
                ) : null}
                {status}
              </div>
            </div>
          )}

          <button
            onClick={handleRestore}
            disabled={isRestoring || !selectedBackup}
            className={`w-full py-3 px-4 rounded-lg font-medium text-white ${
              isRestoring || !selectedBackup
                ? 'bg-gray-400 cursor-not-allowed'
                : 'bg-blue-500 hover:bg-blue-600'
            }`}
          >
            {isRestoring ? 'リストア中...' : 'リストアを実行'}
          </button>
        </div>
      </div>
    </div>
  )
}

export default RestorePage