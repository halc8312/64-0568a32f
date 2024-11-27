"use client"

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { FaBriefcase, FaHeart, FaMoneyBillWave, FaChartLine } from 'react-icons/fa'
import { BiTime } from 'react-icons/bi'
import { supabase } from '@/supabase'

type AdviceRecord = {
  category: string
  advice_content: {
    title: string
    description: string
  }
}

export default function AdviceTop() {
  const router = useRouter()
  const [recentAdvice, setRecentAdvice] = useState<AdviceRecord[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchRecentAdvice = async () => {
      try {
        const { data: session } = await supabase.auth.getSession()
        if (!session) {
          router.push('/login')
          return
        }

        const { data, error } = await supabase
          .from('advice_records')
          .select('category, advice_content')
          .order('created_at', { ascending: false })
          .limit(3)

        if (error) throw error

        setRecentAdvice(data || [])
      } catch (error) {
        console.error('Error fetching advice:', error)
        setRecentAdvice([
          {
            category: '恋愛',
            advice_content: {
              title: 'サンプルアドバイス',
              description: '恋愛に関する最近のアドバイス'
            }
          }
        ])
      } finally {
        setLoading(false)
      }
    }

    fetchRecentAdvice()
  }, [router])

  const categories = [
    { name: '恋愛', icon: <FaHeart />, path: '/advice/love', color: 'bg-pink-500' },
    { name: '仕事', icon: <FaBriefcase />, path: '/advice/work', color: 'bg-blue-500' },
    { name: '金銭管理', icon: <FaMoneyBillWave />, path: '/advice/money', color: 'bg-green-500' },
    { name: '相性診断', icon: <FaChartLine />, path: '/advice/compatibility', color: 'bg-purple-500' }
  ]

  return (
    <div className="min-h-screen h-full bg-gray-50">
      <div className="max-w-6xl mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold text-gray-800 mb-8">アドバイス</h1>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          {categories.map((category) => (
            <Link href={category.path} key={category.name}>
              <div className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow duration-300">
                <div className={`${category.color} w-12 h-12 rounded-full flex items-center justify-center text-white mb-4`}>
                  <span className="text-xl">{category.icon}</span>
                </div>
                <h3 className="text-xl font-semibold text-gray-800">{category.name}</h3>
                <p className="text-gray-600 mt-2">あなたの性格タイプに基づいた{category.name}のアドバイスを確認できます</p>
              </div>
            </Link>
          ))}
        </div>

        <section className="mb-12">
          <div className="flex items-center mb-6">
            <BiTime className="text-2xl text-gray-600 mr-2" />
            <h2 className="text-2xl font-bold text-gray-800">最近のアドバイス</h2>
          </div>
          
          {loading ? (
            <div className="text-center py-8">
              <div className="animate-spin w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full mx-auto"></div>
            </div>
          ) : (
            <div className="grid md:grid-cols-3 gap-6">
              {recentAdvice.map((advice, index) => (
                <div key={index} className="bg-white rounded-lg shadow-md p-6">
                  <span className="inline-block px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800 mb-4">
                    {advice.category}
                  </span>
                  <h3 className="text-lg font-semibold text-gray-800 mb-2">{advice.advice_content.title}</h3>
                  <p className="text-gray-600">{advice.advice_content.description}</p>
                </div>
              ))}
            </div>
          )}
        </section>

        <section className="bg-gradient-to-r from-blue-500 to-purple-500 rounded-lg p-8 text-white">
          <h2 className="text-2xl font-bold mb-4">あなたへのおすすめ</h2>
          <p className="mb-6">より詳しい性格分析とアドバイスを受けてみませんか？</p>
          <Link href="/diagnosis">
            <button className="bg-white text-blue-500 px-6 py-2 rounded-lg font-semibold hover:bg-opacity-90 transition-colors duration-300">
              新しい診断を開始
            </button>
          </Link>
        </section>
      </div>
    </div>
  )
}