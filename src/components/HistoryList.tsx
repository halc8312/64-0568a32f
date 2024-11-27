"use client"

import { useState, useEffect } from 'react'
import { formatDistanceToNow } from 'date-fns'
import { ja } from 'date-fns/locale'
import { FiClock, FiChevronRight, FiFilter, FiArrowDown, FiArrowUp } from 'react-icons/fi'
import { useRouter } from 'next/navigation'
import { supabase } from '@/supabase'

type HistoryItem = {
  id: string
  diagnosed_at: string
  personality_type: {
    type: string
    description: string
  }
}

const HistoryList = () => {
  const router = useRouter()
  const [historyData, setHistoryData] = useState<HistoryItem[]>([])
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc')
  const [filterType, setFilterType] = useState<string>('all')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchHistory()
  }, [])

  const fetchHistory = async () => {
    try {
      const { data, error } = await supabase
        .from('personality_diagnoses')
        .select('*')
        .order('diagnosed_at', { ascending: false })

      if (error) throw error

      setHistoryData(data || [])
    } catch (error) {
      console.error('Error fetching history:', error)
      // サンプルデータを設定
      setHistoryData([
        {
          id: '1',
          diagnosed_at: new Date().toISOString(),
          personality_type: {
            type: '論理的リーダー',
            description: '冷静で分析的な判断力を持つタイプ'
          }
        },
        {
          id: '2',
          diagnosed_at: new Date(Date.now() - 86400000).toISOString(),
          personality_type: {
            type: '創造的イノベーター',
            description: '独創的なアイデアで問題解決を図るタイプ'
          }
        }
      ])
    } finally {
      setLoading(false)
    }
  }

  const handleSort = () => {
    const newOrder = sortOrder === 'asc' ? 'desc' : 'asc'
    setSortOrder(newOrder)
    const sortedData = [...historyData].sort((a, b) => {
      const comparison = new Date(a.diagnosed_at).getTime() - new Date(b.diagnosed_at).getTime()
      return newOrder === 'asc' ? comparison : -comparison
    })
    setHistoryData(sortedData)
  }

  const handleFilter = (type: string) => {
    setFilterType(type)
  }

  const navigateToDetail = (id: string) => {
    router.push(`/history/${id}`)
  }

  if (loading) {
    return (
      <div className="min-h-screen h-full flex justify-center items-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      </div>
    )
  }

  return (
    <div className="min-h-screen h-full bg-gray-50 p-4">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white rounded-lg shadow p-4 mb-4">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-bold text-gray-800">診断履歴</h2>
            <div className="flex gap-2">
              <button
                onClick={() => handleFilter(filterType === 'all' ? 'recent' : 'all')}
                className="flex items-center gap-1 px-3 py-2 rounded bg-gray-100 hover:bg-gray-200 transition-colors"
              >
                <FiFilter className="text-gray-600" />
                <span className="text-sm text-gray-600">
                  {filterType === 'all' ? 'すべて' : '最近'}
                </span>
              </button>
              <button
                onClick={handleSort}
                className="flex items-center gap-1 px-3 py-2 rounded bg-gray-100 hover:bg-gray-200 transition-colors"
              >
                {sortOrder === 'asc' ? (
                  <FiArrowUp className="text-gray-600" />
                ) : (
                  <FiArrowDown className="text-gray-600" />
                )}
                <span className="text-sm text-gray-600">日付</span>
              </button>
            </div>
          </div>

          <div className="space-y-4">
            {historyData.map((item) => (
              <div
                key={item.id}
                className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors cursor-pointer"
                onClick={() => navigateToDetail(item.id)}
              >
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-lg font-semibold text-gray-800">
                      {item.personality_type.type}
                    </span>
                  </div>
                  <p className="text-sm text-gray-600 mb-2">
                    {item.personality_type.description}
                  </p>
                  <div className="flex items-center gap-1 text-sm text-gray-500">
                    <FiClock className="w-4 h-4" />
                    <span>
                      {formatDistanceToNow(new Date(item.diagnosed_at), {
                        addSuffix: true,
                        locale: ja
                      })}
                    </span>
                  </div>
                </div>
                <FiChevronRight className="w-5 h-5 text-gray-400" />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

export default HistoryList