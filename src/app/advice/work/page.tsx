"use client"

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import Image from 'next/image'
import { supabase } from '@/supabase'
import { FaBriefcase, FaRegBookmark, FaChevronRight } from 'react-icons/fa'
import { BsPersonWorkspace } from 'react-icons/bs'
import { MdOutlineWorkHistory } from 'react-icons/md'

type WorkAdvice = {
  id: string
  advice_content: {
    general: string
    suitable_jobs: string[]
    career_steps: string[]
    strengths: string[]
    growth_areas: string[]
  }
}

export default function WorkAdvice() {
  const router = useRouter()
  const [advice, setAdvice] = useState<WorkAdvice | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchAdvice = async () => {
      try {
        const { data: adviceData, error } = await supabase
          .from('advice_records')
          .select('id, advice_content')
          .eq('category', 'work')
          .single()

        if (error) throw error
        setAdvice(adviceData)
      } catch (error) {
        // フォールバックデータ
        setAdvice({
          id: '1',
          advice_content: {
            general: 'あなたは論理的思考と創造性のバランスが取れているタイプです。',
            suitable_jobs: ['システムアナリスト', 'プロジェクトマネージャー', 'UXデザイナー'],
            career_steps: [
              '専門スキルの習得',
              'チーム内でのリーダーシップの発揮',
              'プロジェクト管理スキルの向上'
            ],
            strengths: ['問題解決能力', '分析的思考', 'コミュニケーション力'],
            growth_areas: ['リスク管理', 'タイムマネジメント']
          }
        })
      } finally {
        setLoading(false)
      }
    }
    fetchAdvice()
  }, [])

  const saveAdvice = async () => {
    try {
      const { error } = await supabase
        .from('advice_records')
        .insert({
          category: 'work',
          advice_content: advice?.advice_content
        })
      if (error) throw error
      alert('アドバイスを保存しました')
    } catch (error) {
      alert('保存に失敗しました')
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen h-full flex items-center justify-center bg-gray-50">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      </div>
    )
  }

  return (
    <div className="min-h-screen h-full bg-gray-50">
      {/* サイドバー */}
      <div className="fixed left-0 top-0 h-full w-64 bg-white shadow-lg p-6">
        <div className="space-y-6">
          <Link href="/advice" className="flex items-center space-x-2 text-gray-600 hover:text-blue-500">
            <BsPersonWorkspace className="text-xl" />
            <span>アドバイストップ</span>
          </Link>
          <Link href="/advice/love" className="flex items-center space-x-2 text-gray-600 hover:text-blue-500">
            <FaChevronRight className="text-sm" />
            <span>恋愛アドバイス</span>
          </Link>
          <div className="flex items-center space-x-2 text-blue-500 font-bold">
            <FaChevronRight className="text-sm" />
            <span>仕事アドバイス</span>
          </div>
          <Link href="/advice/money" className="flex items-center space-x-2 text-gray-600 hover:text-blue-500">
            <FaChevronRight className="text-sm" />
            <span>金銭管理アドバイス</span>
          </Link>
        </div>
      </div>

      {/* メインコンテンツ */}
      <div className="ml-64 p-8">
        <div className="max-w-4xl mx-auto space-y-8">
          <div className="bg-white rounded-lg shadow-md p-6">
            <h1 className="text-2xl font-bold text-gray-800 mb-4 flex items-center">
              <FaBriefcase className="mr-2" />
              キャリアアドバイス
            </h1>
            <p className="text-gray-600 leading-relaxed">{advice?.advice_content.general}</p>
          </div>

          <div className="grid grid-cols-2 gap-6">
            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-xl font-bold text-gray-800 mb-4">あなたに向いている職種</h2>
              <ul className="space-y-3">
                {advice?.advice_content.suitable_jobs.map((job, index) => (
                  <li key={index} className="flex items-center text-gray-600">
                    <MdOutlineWorkHistory className="mr-2" />
                    {job}
                  </li>
                ))}
              </ul>
            </div>

            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-xl font-bold text-gray-800 mb-4">強みと成長分野</h2>
              <div className="space-y-4">
                <div>
                  <h3 className="font-semibold text-gray-700 mb-2">強み</h3>
                  <ul className="list-disc list-inside text-gray-600 space-y-1">
                    {advice?.advice_content.strengths.map((strength, index) => (
                      <li key={index}>{strength}</li>
                    ))}
                  </ul>
                </div>
                <div>
                  <h3 className="font-semibold text-gray-700 mb-2">成長分野</h3>
                  <ul className="list-disc list-inside text-gray-600 space-y-1">
                    {advice?.advice_content.growth_areas.map((area, index) => (
                      <li key={index}>{area}</li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-bold text-gray-800 mb-4">キャリアステップ</h2>
            <div className="space-y-4">
              {advice?.advice_content.career_steps.map((step, index) => (
                <div key={index} className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center text-white font-bold">
                    {index + 1}
                  </div>
                  <p className="text-gray-600">{step}</p>
                </div>
              ))}
            </div>
          </div>

          <button
            onClick={saveAdvice}
            className="fixed bottom-8 right-8 bg-blue-500 text-white px-6 py-3 rounded-full shadow-lg hover:bg-blue-600 transition-colors flex items-center"
          >
            <FaRegBookmark className="mr-2" />
            アドバイスを保存
          </button>
        </div>
      </div>
    </div>
  )
}