"use client"

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { FaUserCircle, FaChartBar, FaHeart, FaBriefcase, FaHistory, FaCog } from 'react-icons/fa'
import { supabase } from '@/supabase'

const Index = () => {
  const router = useRouter()
  const [isLoggedIn, setIsLoggedIn] = useState(false)

  useEffect(() => {
    checkUser()
  }, [])

  const checkUser = async () => {
    const { data: { session } } = await supabase.auth.getSession()
    setIsLoggedIn(!!session)
  }

  return (
    <div className="min-h-screen h-full bg-gray-50">
      {/* ヘッダー */}
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center">
          <h1 className="text-2xl font-bold text-[#4A90E2]">性格診断アプリ</h1>
          {isLoggedIn ? (
            <Link href="/mypage" className="flex items-center text-gray-600 hover:text-[#4A90E2]">
              <FaUserCircle className="mr-2" />
              マイページ
            </Link>
          ) : (
            <Link href="/login" className="flex items-center text-gray-600 hover:text-[#4A90E2]">
              <FaUserCircle className="mr-2" />
              ログイン
            </Link>
          )}
        </div>
      </header>

      {/* メインビジュアル */}
      <div className="relative h-[500px] bg-gradient-to-r from-[#4A90E2] to-[#F5A623]">
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-center text-white">
            <h2 className="text-4xl font-bold mb-6">あなたの真の性格を発見しよう</h2>
            <p className="text-xl mb-8">64種類の性格タイプから、あなたにぴったりのタイプを診断</p>
            <Link href="/diagnosis" 
              className="inline-block bg-white text-[#4A90E2] px-8 py-4 rounded-full font-bold hover:bg-opacity-90 transition duration-300">
              診断を始める
            </Link>
          </div>
        </div>
      </div>

      {/* 機能メニュー */}
      <div className="max-w-7xl mx-auto px-4 py-16">
        <h3 className="text-2xl font-bold text-center mb-12">主な機能</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="bg-white p-8 rounded-lg shadow-sm text-center">
            <FaChartBar className="mx-auto text-4xl text-[#4A90E2] mb-4" />
            <h4 className="text-xl font-bold mb-4">詳細な性格診断</h4>
            <p className="text-gray-600">科学的根拠に基づいた64種類の性格タイプ診断を提供</p>
          </div>
          <div className="bg-white p-8 rounded-lg shadow-sm text-center">
            <FaHeart className="mx-auto text-4xl text-[#F5A623] mb-4" />
            <h4 className="text-xl font-bold mb-4">分野別アドバイス</h4>
            <p className="text-gray-600">恋愛・仕事・金銭管理など、様々な分野でのアドバイス</p>
          </div>
          <div className="bg-white p-8 rounded-lg shadow-sm text-center">
            <FaHistory className="mx-auto text-4xl text-[#7ED321] mb-4" />
            <h4 className="text-xl font-bold mb-4">診断履歴管理</h4>
            <p className="text-gray-600">過去の診断結果を保存し、いつでも確認可能</p>
          </div>
        </div>
      </div>

      {/* 最新情報 */}
      <div className="bg-white py-16">
        <div className="max-w-7xl mx-auto px-4">
          <h3 className="text-2xl font-bold text-center mb-12">最新情報</h3>
          <div className="space-y-6">
            <div className="border-b pb-4">
              <p className="text-gray-500 text-sm">2024.01.20</p>
              <p className="text-lg">新しい診断機能が追加されました</p>
            </div>
            <div className="border-b pb-4">
              <p className="text-gray-500 text-sm">2024.01.15</p>
              <p className="text-lg">アプリのデザインをリニューアル</p>
            </div>
            <div className="border-b pb-4">
              <p className="text-gray-500 text-sm">2024.01.10</p>
              <p className="text-lg">性格タイプ解説の詳細度がアップ</p>
            </div>
          </div>
        </div>
      </div>

      {/* フッター */}
      <footer className="bg-gray-800 text-white py-8">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div>
              <h5 className="font-bold mb-4">About</h5>
              <ul className="space-y-2">
                <li><Link href="/about" className="hover:text-[#4A90E2]">サービス概要</Link></li>
                <li><Link href="/terms" className="hover:text-[#4A90E2]">利用規約</Link></li>
                <li><Link href="/privacy" className="hover:text-[#4A90E2]">プライバシーポリシー</Link></li>
              </ul>
            </div>
            <div>
              <h5 className="font-bold mb-4">Support</h5>
              <ul className="space-y-2">
                <li><Link href="/faq" className="hover:text-[#4A90E2]">よくある質問</Link></li>
                <li><Link href="/contact" className="hover:text-[#4A90E2]">お問い合わせ</Link></li>
              </ul>
            </div>
            <div>
              <h5 className="font-bold mb-4">Follow Us</h5>
              <div className="flex space-x-4">
                <a href="#" className="hover:text-[#4A90E2]">Twitter</a>
                <a href="#" className="hover:text-[#4A90E2]">Facebook</a>
                <a href="#" className="hover:text-[#4A90E2]">Instagram</a>
              </div>
            </div>
          </div>
          <div className="text-center mt-8 pt-8 border-t border-gray-700">
            <p>© 2024 性格診断アプリ All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}

export default Index