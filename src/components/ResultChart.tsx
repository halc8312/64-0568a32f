"use client"

import { useEffect, useRef } from 'react'
import { Chart } from 'chart.js/auto'

type ResultChartProps = {
  resultData: {
    personalityType: string
    scores: {
      category: string
      score: number
    }[]
  }
}

const ResultChart = ({ resultData }: ResultChartProps) => {
  const chartRef = useRef<HTMLCanvasElement>(null)
  const chartInstance = useRef<Chart | null>(null)

  useEffect(() => {
    if (!chartRef.current || !resultData.scores) return

    if (chartInstance.current) {
      chartInstance.current.destroy()
    }

    const ctx = chartRef.current.getContext('2d')
    if (!ctx) return

    chartInstance.current = new Chart(ctx, {
      type: 'radar',
      data: {
        labels: resultData.scores.map(item => item.category),
        datasets: [{
          label: '性格特性スコア',
          data: resultData.scores.map(item => item.score),
          backgroundColor: 'rgba(74, 144, 226, 0.2)',
          borderColor: '#4A90E2',
          borderWidth: 2,
          pointBackgroundColor: '#4A90E2',
          pointBorderColor: '#fff',
          pointHoverBackgroundColor: '#fff',
          pointHoverBorderColor: '#4A90E2'
        }]
      },
      options: {
        scales: {
          r: {
            beginAtZero: true,
            max: 100,
            ticks: {
              stepSize: 20
            }
          }
        },
        plugins: {
          legend: {
            display: false
          }
        },
        elements: {
          line: {
            tension: 0.4
          }
        }
      }
    })

    return () => {
      if (chartInstance.current) {
        chartInstance.current.destroy()
      }
    }
  }, [resultData])

  return (
    <div className="w-full max-w-2xl mx-auto bg-white rounded-lg shadow-md p-6">
      <div className="mb-4">
        <h3 className="text-xl font-bold text-gray-800 mb-2">
          性格タイプ: {resultData.personalityType}
        </h3>
        <p className="text-gray-600 text-sm">
          以下のグラフは、あなたの性格特性を5つの主要な側面から分析した結果です。
        </p>
      </div>
      <div className="relative aspect-square w-full">
        <canvas ref={chartRef} />
      </div>
      <div className="mt-4 text-sm text-gray-500">
        <p>※スコアは0-100の範囲で表示されています</p>
      </div>
    </div>
  )
}

export default ResultChart