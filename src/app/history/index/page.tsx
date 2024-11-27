"use client"

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { FaHistory, FaFilter, FaSort, FaSearch } from 'react-icons/fa'
import { format } from 'date-fns'
import { ja } from 'date-fns/locale'
import { supabase } from '@/supabase'

type DiagnosisHistory = {
  id: string
  diagnosed_at: string
  personality_type: {
    type: string
    description: string
  }
}

export default function DiagnosisHistoryPage() {
  const router = useRouter()
  const [histories, setHistories] = useState<DiagnosisHistory[]>([])
  const [filteredHistories, setFilteredHistories] = useState<DiagnosisHistory[]>([])
  const [searchTerm, setSearchTerm] = useState('')
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc')

  useEffect(() => {
    const fetchHistories = async () => {
      const { data: { user } } = await supabase.auth.getUser()
      
      if (!user) {
        router.push('/login')
        return
      }

      const { data, error } = await supabase
        .from('personality_diagnoses')
        .select('id, diagnosed_at, personality_type')
        .eq('user_id', user.id)
        .order('diagnosed_at', { ascending: false })

      if (error) {
        console.error('Error fetching histories:', error)
        return
      }

      setHistories(data || [])
      setFilteredHistories(data || [])
    }

    fetchHistories()
  }, [router])

  const handleSearch = (value: string) => {
    setSearchTerm(value)
    const filtered = histories.filter(history =>
      history.personality_type.type.toLowerCase().includes(value.toLowerCase())
    )
    setFilteredHistories(filtered)
  }

  const handleSort = () => {
    const newOrder = sortOrder === 'asc' ? 'desc' : 'asc'
    setSortOrder(newOrder)
    const sorted = [...filteredHistories].sort((a, b) => {
      if (newOrder === 'asc') {
        return new Date(a.diagnosed_at).getTime() - new Date(b.diagnosed_at).getTime()
      }
      return new Date(b.diagnosed_at).getTime() - new Date(a.diagnosed_at).getTime()
    })
    setFilteredHistories(sorted)
  }

  return (
    <div className="min-h-screen h-full bg-gray-50">
      <div className="max-w-6xl mx-auto px-4 py-8">
        <div className="bg-white rounded-lg shadow-lg p-6">
          <div className="flex items-center justify-between mb-8">
            <h1 className="text-2xl font-bold text-gray-800 flex items-center">
              <FaHistory className="mr-2" />
              診断履歴一覧
            </h1>
            <div className="flex items-center space-x-4">
              <div className="relative">
                <input
                  type="text"
                  placeholder="タイプで検索..."
                  className="pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  value={searchTerm}
                  onChange={(e) => handleSearch(e.target.value)}
                />
                <FaSearch className="absolute left-3 top-3 text-gray-400" />
              </div>
              <button
                onClick={handleSort}
                className="flex items-center px-4 py-2 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
              >
                <FaSort className="mr-2" />
                {sortOrder === 'asc' ? '古い順' : '新しい順'}
              </button>
            </div>
          </div>

          <div className="space-y-4">
            {filteredHistories.map((history) => (
              <Link href={`/history/${history.id}`} key={history.id}>
                <div className="border rounded-lg p-4 hover:bg-gray-50 transition-colors cursor-pointer">
                  <div className="flex justify-between items-center">
                    <div>
                      <h3 className="text-lg font-semibold text-gray-800">
                        {history.personality_type.type}
                      </h3>
                      <p className="text-gray-600 mt-1">
                        {history.personality_type.description?.substring(0, 100)}...
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm text-gray-500">
                        診断日時：{format(new Date(history.diagnosed_at), 'yyyy年MM月dd日 HH:mm', { locale: ja })}
                      </p>
                    </div>
                  </div>
                </div>
              </Link>
            ))}

            {filteredHistories.length === 0 && (
              <div className="text-center py-12">
                <p className="text-gray-500">診断履歴がありません</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}