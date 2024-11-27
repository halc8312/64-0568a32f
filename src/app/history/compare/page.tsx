"use client"

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { supabase } from '@/supabase'
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar } from 'recharts'
import { FiArrowLeft, FiCalendar, FiBarChart2 } from 'react-icons/fi'

type PersonalityDiagnosis = {
  id: string
  personality_type: {
    type: string
    scores: {
      category: string
      score: number
    }[]
  }
  diagnosed_at: string
}

export default function CompareResults() {
  const router = useRouter()
  const [diagnoses, setDiagnoses] = useState<PersonalityDiagnosis[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchDiagnoses()
  }, [])

  const fetchDiagnoses = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) {
        router.push('/auth/login')
        return
      }

      const { data, error } = await supabase
        .from('personality_diagnoses')
        .select('id, personality_type, diagnosed_at')
        .eq('user_id', user.id)
        .order('diagnosed_at', { ascending: false })
        .limit(3)

      if (error) throw error

      setDiagnoses(data || [])
    } catch (error) {
      console.error('Error fetching diagnoses:', error)
      // サンプルデータ
      setDiagnoses([
        {
          id: '1',
          personality_type: {
            type: 'タイプA',
            scores: [
              { category: '外向性', score: 80 },
              { category: '協調性', score: 65 },
              { category: '勤勉性', score: 70 }
            ]
          },
          diagnosed_at: '2024-01-01'
        },
        {
          id: '2',
          personality_type: {
            type: 'タイプB',
            scores: [
              { category: '外向性', score: 75 },
              { category: '協調性', score: 70 },
              { category: '勤勉性', score: 75 }
            ]
          },
          diagnosed_at: '2024-01-15'
        }
      ])
    } finally {
      setLoading(false)
    }
  }

  const renderTimelineChart = () => {
    const data = diagnoses.map(d => ({
      date: new Date(d.diagnosed_at).toLocaleDateString(),
      ...d.personality_type.scores.reduce((acc, score) => ({
        ...acc,
        [score.category]: score.score
      }), {})
    }))

    return (
      <div className="bg-white p-6 rounded-lg shadow-lg">
        <h3 className="text-xl font-bold mb-4">時系列変化</h3>
        <div className="h-[300px]">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={data}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" />
              <YAxis />
              <Tooltip />
              <Legend />
              {diagnoses[0]?.personality_type.scores.map((score, index) => (
                <Line
                  key={score.category}
                  type="monotone"
                  dataKey={score.category}
                  stroke={`hsl(${index * 120}, 70%, 50%)`}
                />
              ))}
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>
    )
  }

  const renderRadarChart = () => {
    const latestDiagnosis = diagnoses[0]
    if (!latestDiagnosis) return null

    return (
      <div className="bg-white p-6 rounded-lg shadow-lg">
        <h3 className="text-xl font-bold mb-4">特性比較</h3>
        <div className="h-[300px]">
          <ResponsiveContainer width="100%" height="100%">
            <RadarChart data={latestDiagnosis.personality_type.scores}>
              <PolarGrid />
              <PolarAngleAxis dataKey="category" />
              <PolarRadiusAxis />
              <Radar
                name={latestDiagnosis.personality_type.type}
                dataKey="score"
                fill="#4A90E2"
                fillOpacity={0.6}
              />
            </RadarChart>
          </ResponsiveContainer>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen h-full bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center mb-8">
          <Link href="/history" className="text-gray-600 hover:text-gray-800 mr-4">
            <FiArrowLeft size={24} />
          </Link>
          <h1 className="text-2xl font-bold">診断結果比較</h1>
        </div>

        {loading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900"></div>
          </div>
        ) : (
          <div className="space-y-8">
            <div className="bg-white p-6 rounded-lg shadow-lg">
              <h2 className="text-xl font-bold mb-4">比較概要</h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {diagnoses.map((diagnosis, index) => (
                  <div key={diagnosis.id} className="p-4 border rounded-lg">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm text-gray-500">
                        <FiCalendar className="inline mr-2" />
                        {new Date(diagnosis.diagnosed_at).toLocaleDateString()}
                      </span>
                      <span className="text-sm font-medium text-blue-600">
                        #{index + 1}
                      </span>
                    </div>
                    <h3 className="text-lg font-semibold mb-2">
                      {diagnosis.personality_type.type}
                    </h3>
                  </div>
                ))}
              </div>
            </div>

            {renderTimelineChart()}
            {renderRadarChart()}

            <div className="bg-white p-6 rounded-lg shadow-lg">
              <h3 className="text-xl font-bold mb-4">主な変化点</h3>
              <ul className="space-y-4">
                {diagnoses.length > 1 && diagnoses[0].personality_type.scores.map((score, index) => {
                  const prevScore = diagnoses[1].personality_type.scores[index].score
                  const diff = score.score - prevScore
                  return (
                    <li key={score.category} className="flex items-center">
                      <FiBarChart2 className="mr-2" />
                      <span className="font-medium">{score.category}:</span>
                      <span className={`ml-2 ${diff > 0 ? 'text-green-600' : diff < 0 ? 'text-red-600' : 'text-gray-600'}`}>
                        {diff > 0 ? '+' : ''}{diff}%
                      </span>
                    </li>
                  )
                })}
              </ul>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}