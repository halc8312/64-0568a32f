"use client"

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { FaHeart, FaSave, FaChevronRight, FaChevronDown } from 'react-icons/fa'
import { supabase } from '@/supabase'
import { IoPersonAdd } from 'react-icons/io5'
import { MdOutlineTipsAndUpdates } from 'react-icons/md'

const LoveAdvicePage = () => {
  const router = useRouter()
  const [advice, setAdvice] = useState<any>(null)
  const [expandedSections, setExpandedSections] = useState<string[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchAdvice = async () => {
      try {
        const { data, error } = await supabase
          .from('advice_records')
          .select('advice_content')
          .eq('category', 'love')
          .single()

        if (error) throw error

        setAdvice(data?.advice_content || getSampleAdvice())
      } catch (error) {
        console.error('Error fetching advice:', error)
        setAdvice(getSampleAdvice())
      } finally {
        setLoading(false)
      }
    }

    fetchAdvice()
  }, [])

  const getSampleAdvice = () => ({
    main: "あなたの性格タイプは、深い感情的なつながりを重視するタイプです。",
    details: [
      {
        title: "恋愛における強み",
        content: "誠実さと思いやりの心を持ち、パートナーの気持ちに寄り添える特徴があります。",
      },
      {
        title: "改善のポイント",
        content: "時には自分の気持ちも大切にすることを忘れないようにしましょう。",
      },
      {
        title: "理想的な出会い方",
        content: "共通の趣味や関心事を通じた自然な出会いが、あなたに適しています。",
      }
    ],
    tips: [
      "日々の小さな気遣いを大切にする",
      "コミュニケーションを積極的に取る",
      "自分の価値観を大切にする"
    ]
  })

  const toggleSection = (section: string) => {
    setExpandedSections(prev =>
      prev.includes(section)
        ? prev.filter(s => s !== section)
        : [...prev, section]
    )
  }

  const saveAdvice = async () => {
    try {
      const { error } = await supabase
        .from('advice_records')
        .insert({
          category: 'love',
          advice_content: advice
        })

      if (error) throw error
      alert('アドバイスを保存しました')
    } catch (error) {
      console.error('Error saving advice:', error)
      alert('保存に失敗しました')
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen h-full flex items-center justify-center bg-gradient-to-b from-pink-50 to-white">
        <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-pink-500"></div>
      </div>
    )
  }

  return (
    <div className="min-h-screen h-full bg-gradient-to-b from-pink-50 to-white">
      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="mb-8 text-center">
          <h1 className="text-3xl font-bold text-gray-800 mb-4 flex items-center justify-center">
            <FaHeart className="text-pink-500 mr-2" />
            恋愛アドバイス
          </h1>
          <p className="text-gray-600">{advice.main}</p>
        </div>

        <div className="space-y-6">
          {advice.details.map((section: any, index: number) => (
            <div
              key={index}
              className="bg-white rounded-lg shadow-md overflow-hidden"
            >
              <button
                className="w-full px-6 py-4 flex items-center justify-between bg-white hover:bg-gray-50"
                onClick={() => toggleSection(section.title)}
              >
                <span className="font-semibold text-gray-700">{section.title}</span>
                {expandedSections.includes(section.title) ? (
                  <FaChevronDown className="text-gray-400" />
                ) : (
                  <FaChevronRight className="text-gray-400" />
                )}
              </button>
              {expandedSections.includes(section.title) && (
                <div className="px-6 py-4 bg-gray-50">
                  <p className="text-gray-600">{section.content}</p>
                </div>
              )}
            </div>
          ))}

          <div className="bg-white rounded-lg shadow-md p-6">
            <h3 className="text-xl font-semibold text-gray-800 mb-4 flex items-center">
              <MdOutlineTipsAndUpdates className="text-pink-500 mr-2" />
              実践のヒント
            </h3>
            <ul className="space-y-2">
              {advice.tips.map((tip: string, index: number) => (
                <li key={index} className="flex items-center text-gray-600">
                  <span className="w-6 h-6 flex items-center justify-center bg-pink-100 rounded-full text-pink-500 mr-3">
                    {index + 1}
                  </span>
                  {tip}
                </li>
              ))}
            </ul>
          </div>

          <div className="flex justify-center space-x-4 mt-8">
            <button
              onClick={saveAdvice}
              className="flex items-center px-6 py-3 bg-pink-500 text-white rounded-lg hover:bg-pink-600 transition-colors"
            >
              <FaSave className="mr-2" />
              アドバイスを保存
            </button>
            <Link
              href="/compatibility"
              className="flex items-center px-6 py-3 bg-white text-pink-500 border border-pink-500 rounded-lg hover:bg-pink-50 transition-colors"
            >
              <IoPersonAdd className="mr-2" />
              相性診断へ
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}

export default LoveAdvicePage