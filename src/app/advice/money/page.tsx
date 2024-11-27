"use client"

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { FaMoneyBillWave, FaPiggyBank, FaChartLine, FaBars } from 'react-icons/fa'
import { supabase } from '@/supabase'

export default function MoneyAdvice() {
  const router = useRouter()
  const [adviceContent, setAdviceContent] = useState<any>(null)
  const [isSidebarOpen, setIsSidebarOpen] = useState(false)

  useEffect(() => {
    const fetchAdvice = async () => {
      try {
        const { data, error } = await supabase
          .from('advice_records')
          .select('advice_content')
          .eq('category', 'money')
          .single()

        if (error) throw error

        setAdviceContent(data?.advice_content || {
          mainAdvice: "収入と支出のバランスを意識し、長期的な視点で資産形成を行うことが重要です。",
          managementTips: [
            "毎月の収支を記録する習慣をつける",
            "緊急時の備えとして3-6ヶ月分の生活費を確保",
            "投資は分散投資を心がける"
          ],
          investmentProfile: {
            riskTolerance: "中程度",
            recommendedProducts: ["投資信託", "ETF", "債券"],
            monthlyInvestmentTarget: "収入の20%程度"
          }
        })
      } catch (error) {
        console.error('Error fetching advice:', error)
      }
    }

    fetchAdvice()
  }, [])

  const handleSaveAdvice = async () => {
    try {
      const { error } = await supabase
        .from('advice_records')
        .insert({
          category: 'money',
          advice_content: adviceContent
        })

      if (error) throw error
      alert('アドバイスを保存しました')
    } catch (error) {
      console.error('Error saving advice:', error)
      alert('保存に失敗しました')
    }
  }

  return (
    <div className="min-h-screen h-full bg-gray-50">
      {/* Sidebar */}
      <div className={`fixed top-0 left-0 h-full w-64 bg-white shadow-lg transform ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'} transition-transform duration-300 ease-in-out z-50`}>
        <div className="p-4">
          <h2 className="text-xl font-bold mb-4">メニュー</h2>
          <nav>
            <Link href="/advice/love" className="block py-2 text-gray-600 hover:text-blue-500">恋愛アドバイス</Link>
            <Link href="/advice/work" className="block py-2 text-gray-600 hover:text-blue-500">仕事アドバイス</Link>
            <Link href="/advice/money" className="block py-2 text-blue-500 font-bold">金銭管理アドバイス</Link>
          </nav>
        </div>
      </div>

      {/* Main Content */}
      <div className="p-6 lg:p-8">
        <button
          onClick={() => setIsSidebarOpen(!isSidebarOpen)}
          className="fixed top-4 left-4 z-50 bg-white p-2 rounded-md shadow-md"
        >
          <FaBars className="text-gray-600" />
        </button>

        <div className="max-w-4xl mx-auto">
          <h1 className="text-3xl font-bold text-gray-800 mb-8 text-center">金銭管理アドバイス</h1>

          {adviceContent && (
            <div className="space-y-8">
              {/* Main Advice Section */}
              <div className="bg-white p-6 rounded-lg shadow-md">
                <div className="flex items-center mb-4">
                  <FaMoneyBillWave className="text-green-500 text-2xl mr-2" />
                  <h2 className="text-xl font-bold text-gray-800">総合アドバイス</h2>
                </div>
                <p className="text-gray-600 leading-relaxed">{adviceContent.mainAdvice}</p>
              </div>

              {/* Management Tips Section */}
              <div className="bg-white p-6 rounded-lg shadow-md">
                <div className="flex items-center mb-4">
                  <FaPiggyBank className="text-blue-500 text-2xl mr-2" />
                  <h2 className="text-xl font-bold text-gray-800">家計管理のコツ</h2>
                </div>
                <ul className="list-disc list-inside space-y-2">
                  {adviceContent.managementTips.map((tip: string, index: number) => (
                    <li key={index} className="text-gray-600">{tip}</li>
                  ))}
                </ul>
              </div>

              {/* Investment Profile Section */}
              <div className="bg-white p-6 rounded-lg shadow-md">
                <div className="flex items-center mb-4">
                  <FaChartLine className="text-purple-500 text-2xl mr-2" />
                  <h2 className="text-xl font-bold text-gray-800">投資適性診断</h2>
                </div>
                <div className="space-y-4">
                  <p className="text-gray-600">
                    <span className="font-semibold">リスク許容度:</span> {adviceContent.investmentProfile.riskTolerance}
                  </p>
                  <div>
                    <p className="font-semibold text-gray-700">おすすめの投資商品:</p>
                    <ul className="list-disc list-inside mt-2">
                      {adviceContent.investmentProfile.recommendedProducts.map((product: string, index: number) => (
                        <li key={index} className="text-gray-600">{product}</li>
                      ))}
                    </ul>
                  </div>
                  <p className="text-gray-600">
                    <span className="font-semibold">月々の投資目標:</span> {adviceContent.investmentProfile.monthlyInvestmentTarget}
                  </p>
                </div>
              </div>

              <div className="flex justify-center mt-8">
                <button
                  onClick={handleSaveAdvice}
                  className="bg-blue-500 text-white px-6 py-3 rounded-md hover:bg-blue-600 transition-colors duration-300"
                >
                  アドバイスを保存する
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}