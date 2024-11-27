"use client"

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '@/supabase'
import { FaUserFriends, FaChartLine, FaHeart, FaHandshake } from 'react-icons/fa'
import Image from 'next/image'
import Link from 'next/link'

export default function CompatibilityDiagnosis() {
  const router = useRouter()
  const [userType, setUserType] = useState('')
  const [compareType, setCompareType] = useState('')
  const [result, setResult] = useState(null)
  const [loading, setLoading] = useState(false)
  const [personalityTypes, setPersonalityTypes] = useState([])

  useEffect(() => {
    const fetchUserType = async () => {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) {
        router.push('/auth/login')
        return
      }

      const { data, error } = await supabase
        .from('personality_diagnoses')
        .select('personality_type')
        .eq('user_id', user.id)
        .single()

      if (data) {
        setUserType(data.personality_type)
      }
    }

    const fetchPersonalityTypes = async () => {
      // サンプルデータ
      const types = [
        "分析型", "外交型", "管理型", "探検型",
        "論理型", "支援型", "指導型", "創造型"
      ]
      setPersonalityTypes(types)
    }

    fetchUserType()
    fetchPersonalityTypes()
  }, [router])

  const handleCompatibilityCheck = async () => {
    if (!compareType) {
      alert('比較する性格タイプを選択してください')
      return
    }

    setLoading(true)
    try {
      // サンプルデータ
      const sampleResult = {
        compatibility: 85,
        details: {
          love: 90,
          work: 80,
          friendship: 85
        },
        advice: "非常に良い相性です。お互いの長所を活かし合える関係性が期待できます。"
      }
      setResult(sampleResult)

      await supabase.from('advice_records').insert({
        category: 'compatibility',
        advice_content: sampleResult
      })
    } catch (error) {
      console.error('Error:', error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen h-full bg-gray-50">
      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="bg-white rounded-lg shadow-lg p-6 mb-8">
          <h1 className="text-2xl font-bold text-gray-800 mb-6 flex items-center">
            <FaUserFriends className="mr-2 text-blue-500" />
            相性診断
          </h1>

          <div className="mb-8">
            <h2 className="text-xl font-semibold mb-4">あなたの性格タイプ</h2>
            <div className="p-4 bg-blue-50 rounded-lg">
              <p className="text-lg">{userType || "未診断"}</p>
            </div>
          </div>

          <div className="mb-8">
            <h2 className="text-xl font-semibold mb-4">比較する性格タイプを選択</h2>
            <select
              className="w-full p-3 border rounded-lg"
              value={compareType}
              onChange={(e) => setCompareType(e.target.value)}
            >
              <option value="">選択してください</option>
              {personalityTypes.map((type) => (
                <option key={type} value={type}>{type}</option>
              ))}
            </select>
          </div>

          <button
            onClick={handleCompatibilityCheck}
            disabled={loading}
            className="w-full bg-blue-500 hover:bg-blue-600 text-white font-bold py-3 px-6 rounded-lg transition duration-300"
          >
            {loading ? "診断中..." : "相性を診断する"}
          </button>
        </div>

        {result && (
          <div className="bg-white rounded-lg shadow-lg p-6">
            <h2 className="text-2xl font-bold mb-6 flex items-center">
              <FaChartLine className="mr-2 text-green-500" />
              診断結果
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              <div className="bg-pink-50 p-4 rounded-lg text-center">
                <FaHeart className="mx-auto text-2xl text-pink-500 mb-2" />
                <p className="font-semibold">恋愛面の相性</p>
                <p className="text-2xl font-bold text-pink-500">{result.details.love}%</p>
              </div>
              <div className="bg-blue-50 p-4 rounded-lg text-center">
                <FaHandshake className="mx-auto text-2xl text-blue-500 mb-2" />
                <p className="font-semibold">仕事面の相性</p>
                <p className="text-2xl font-bold text-blue-500">{result.details.work}%</p>
              </div>
              <div className="bg-green-50 p-4 rounded-lg text-center">
                <FaUserFriends className="mx-auto text-2xl text-green-500 mb-2" />
                <p className="font-semibold">友情面の相性</p>
                <p className="text-2xl font-bold text-green-500">{result.details.friendship}%</p>
              </div>
            </div>

            <div className="bg-gray-50 p-6 rounded-lg mb-6">
              <h3 className="text-xl font-semibold mb-4">総合評価</h3>
              <div className="flex items-center justify-center mb-4">
                <div className="text-4xl font-bold text-blue-500">{result.compatibility}%</div>
              </div>
              <p className="text-gray-700">{result.advice}</p>
            </div>

            <div className="flex justify-center space-x-4">
              <Link
                href="/advice"
                className="bg-gray-500 hover:bg-gray-600 text-white font-bold py-2 px-6 rounded-lg transition duration-300"
              >
                戻る
              </Link>
              <button
                onClick={() => setResult(null)}
                className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-6 rounded-lg transition duration-300"
              >
                別の診断を行う
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}