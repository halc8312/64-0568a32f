"use client"

import { FC } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { FiClock, FiAlertCircle, FiChevronRight } from 'react-icons/fi'

const GuidancePage: FC = () => {
  const router = useRouter()

  return (
    <div className="min-h-screen h-full bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        <div className="bg-white shadow rounded-lg p-6 sm:p-8">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-4">
              64種類の性格診断テスト
            </h1>
            <p className="text-lg text-gray-600">
              あなたの本質的な性格タイプを科学的に分析します
            </p>
          </div>

          <div className="space-y-6">
            <div className="flex items-center justify-center space-x-2 text-gray-600">
              <FiClock className="w-5 h-5 text-blue-500" />
              <span>所要時間：約15-20分</span>
            </div>

            <div className="border-t border-b border-gray-200 py-6">
              <h2 className="text-xl font-semibold mb-4">診断の特徴</h2>
              <ul className="space-y-3">
                <li className="flex items-start">
                  <FiChevronRight className="w-5 h-5 text-blue-500 mt-0.5 flex-shrink-0" />
                  <span className="ml-2">心理学に基づいた科学的なアプローチ</span>
                </li>
                <li className="flex items-start">
                  <FiChevronRight className="w-5 h-5 text-blue-500 mt-0.5 flex-shrink-0" />
                  <span className="ml-2">64種類の詳細な性格タイプ分析</span>
                </li>
                <li className="flex items-start">
                  <FiChevronRight className="w-5 h-5 text-blue-500 mt-0.5 flex-shrink-0" />
                  <span className="ml-2">恋愛・仕事・人間関係の具体的なアドバイス</span>
                </li>
              </ul>
            </div>

            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
              <div className="flex items-start">
                <FiAlertCircle className="w-5 h-5 text-yellow-500 mt-0.5 flex-shrink-0" />
                <div className="ml-3">
                  <h3 className="text-sm font-medium text-yellow-800">注意事項</h3>
                  <ul className="mt-2 text-sm text-yellow-700 space-y-1">
                    <li>• できるだけ正直に回答してください</li>
                    <li>• 直感的に答えを選んでください</li>
                    <li>• 途中で中断すると進行状況は保存されません</li>
                  </ul>
                </div>
              </div>
            </div>

            <div className="text-center pt-4">
              <Link
                href="/diagnosis/questions"
                className="inline-flex items-center justify-center px-8 py-3 border border-transparent text-base font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 md:py-4 md:text-lg md:px-10 transition duration-150 ease-in-out"
              >
                診断を開始する
              </Link>
              <p className="mt-3 text-sm text-gray-500">
                開始ボタンをクリックすると、質問画面に移動します
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default GuidancePage