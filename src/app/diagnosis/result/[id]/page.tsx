"use client"

import { useEffect, useState } from 'react'
import { useRouter, useParams } from 'next/navigation'
import Link from 'next/link'
import Image from 'next/image'
import { FiShare2, FiChevronRight, FiMenu } from 'react-icons/fi'
import { supabase } from '@/supabase'
import { IoPersonOutline, IoBusinessOutline, IoHeartOutline, IoWalletOutline } from 'react-icons/io5'

type PersonalityType = {
  type: string
  description: string
  characteristics: string[]
  strengths: string[]
  weaknesses: string[]
  score: {
    emotional: number
    logical: number
    extrovert: number
    introvert: number
  }
}

export default function DiagnosisResult() {
  const router = useRouter()
  const params = useParams()
  const [personalityData, setPersonalityData] = useState<PersonalityType | null>(null)
  const [sidebarOpen, setSidebarOpen] = useState(false)

  useEffect(() => {
    const fetchDiagnosisResult = async () => {
      try {
        const { data, error } = await supabase
          .from('personality_diagnoses')
          .select('personality_type')
          .eq('id', params.id)
          .single()

        if (error) throw error

        setPersonalityData(data.personality_type)
      } catch (error) {
        // フォールバックデータ
        setPersonalityData({
          type: "バランス型リーダー",
          description: "論理的思考と感情的知性をバランスよく備えた理想的なリーダータイプです。",
          characteristics: ["決断力がある", "共感力が高い", "目標志向"],
          strengths: ["チームマネジメント", "問題解決能力", "コミュニケーション力"],
          weaknesses: ["完璧主義", "過度な責任感"],
          score: {
            emotional: 75,
            logical: 80,
            extrovert: 70,
            introvert: 60
          }
        })
      }
    }

    fetchDiagnosisResult()
  }, [params.id])

  if (!personalityData) return null

  return (
    <div className="min-h-screen h-full bg-gray-50">
      {/* サイドバー */}
      <div className={`fixed top-0 left-0 h-full w-64 bg-white shadow-lg transform ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'} transition-transform duration-300 ease-in-out z-50`}>
        <div className="p-4">
          <h2 className="text-xl font-bold text-gray-800 mb-4">メニュー</h2>
          <nav className="space-y-2">
            <Link href="/diagnosis" className="flex items-center p-2 text-gray-600 hover:bg-gray-100 rounded">
              <IoPersonOutline className="mr-2" />
              診断トップ
            </Link>
            <Link href="/advice" className="flex items-center p-2 text-gray-600 hover:bg-gray-100 rounded">
              <IoBusinessOutline className="mr-2" />
              アドバイス
            </Link>
            <Link href="/love" className="flex items-center p-2 text-gray-600 hover:bg-gray-100 rounded">
              <IoHeartOutline className="mr-2" />
              相性診断
            </Link>
            <Link href="/money" className="flex items-center p-2 text-gray-600 hover:bg-gray-100 rounded">
              <IoWalletOutline className="mr-2" />
              金銭管理
            </Link>
          </nav>
        </div>
      </div>

      {/* メインコンテンツ */}
      <div className="max-w-4xl mx-auto px-4 py-8">
        <button 
          onClick={() => setSidebarOpen(!sidebarOpen)}
          className="fixed top-4 left-4 p-2 bg-white rounded-full shadow-md z-40"
        >
          <FiMenu className="text-gray-600 text-xl" />
        </button>

        <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
          <h1 className="text-2xl font-bold text-center text-gray-800 mb-4">
            あなたの性格タイプ
          </h1>
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold text-blue-600 mb-2">
              {personalityData.type}
            </h2>
            <p className="text-gray-600">
              {personalityData.description}
            </p>
          </div>

          {/* スコアグラフ */}
          <div className="mb-8">
            <h3 className="text-xl font-bold text-gray-800 mb-4">パーソナリティスコア</h3>
            <div className="space-y-4">
              {Object.entries(personalityData.score).map(([key, value]) => (
                <div key={key} className="space-y-2">
                  <div className="flex justify-between text-sm text-gray-600">
                    <span className="capitalize">{key}</span>
                    <span>{value}%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2.5">
                    <div 
                      className="bg-blue-600 h-2.5 rounded-full"
                      style={{ width: `${value}%` }}
                    ></div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* 特徴 */}
          <div className="mb-8">
            <h3 className="text-xl font-bold text-gray-800 mb-4">主な特徴</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {personalityData.characteristics.map((trait, index) => (
                <div key={index} className="flex items-center bg-blue-50 p-3 rounded">
                  <span className="text-blue-600 mr-2">•</span>
                  {trait}
                </div>
              ))}
            </div>
          </div>

          {/* 長所・短所 */}
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <h3 className="text-xl font-bold text-gray-800 mb-4">長所</h3>
              <ul className="space-y-2">
                {personalityData.strengths.map((strength, index) => (
                  <li key={index} className="flex items-center text-gray-600">
                    <FiChevronRight className="text-green-500 mr-2" />
                    {strength}
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <h3 className="text-xl font-bold text-gray-800 mb-4">短所</h3>
              <ul className="space-y-2">
                {personalityData.weaknesses.map((weakness, index) => (
                  <li key={index} className="flex items-center text-gray-600">
                    <FiChevronRight className="text-red-500 mr-2" />
                    {weakness}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        {/* アクションボタン */}
        <div className="flex justify-center gap-4">
          <button 
            onClick={() => {}} 
            className="flex items-center px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            <FiShare2 className="mr-2" />
            結果をシェア
          </button>
          <Link
            href={`/diagnosis/detail/${params.id}`}
            className="px-6 py-3 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors"
          >
            詳細を見る
          </Link>
        </div>
      </div>
    </div>
  )
}