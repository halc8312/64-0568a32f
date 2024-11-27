"use client"

import { useEffect, useState } from 'react'
import { Line } from 'react-chartjs-2'
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
} from 'chart.js'

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
)

interface CompareChartProps {
  compareData: {
    diagnosed_at: string
    personality_type: {
      traits: {
        name: string
        score: number
      }[]
    }
  }[]
}

const CompareChart = ({ compareData }: CompareChartProps) => {
  const [chartData, setChartData] = useState<any>(null)

  useEffect(() => {
    if (!compareData?.length) return

    const labels = compareData[0].personality_type.traits.map(trait => trait.name)
    const datasets = compareData.map((result, index) => ({
      label: new Date(result.diagnosed_at).toLocaleDateString(),
      data: result.personality_type.traits.map(trait => trait.score),
      borderColor: getLineColor(index),
      backgroundColor: getLineColor(index, 0.2),
      tension: 0.4
    }))

    setChartData({
      labels,
      datasets
    })
  }, [compareData])

  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top' as const,
      },
      title: {
        display: true,
        text: '性格特性の時系列比較',
        color: '#333333',
        font: {
          size: 16,
          family: 'Noto Sans JP'
        }
      }
    },
    scales: {
      r: {
        min: 0,
        max: 100,
        ticks: {
          stepSize: 20
        }
      }
    }
  }

  const getLineColor = (index: number, alpha = 1) => {
    const colors = [
      `rgba(74, 144, 226, ${alpha})`,
      `rgba(245, 166, 35, ${alpha})`,
      `rgba(126, 211, 33, ${alpha})`,
      `rgba(208, 2, 27, ${alpha})`
    ]
    return colors[index % colors.length]
  }

  if (!chartData) {
    return <div className="flex justify-center items-center h-64">データを読み込み中...</div>
  }

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <div className="h-[400px]">
        <Line data={chartData} options={options} />
      </div>
      <div className="mt-4 text-sm text-gray-600">
        <p className="mb-2">※ グラフは各性格特性の強さを0-100のスコアで表示しています</p>
        <p>※ 時系列での変化を確認することで、性格特性の変動を把握できます</p>
      </div>
    </div>
  )
}

export default CompareChart