"use client"

import { FC, useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { FaUser, FaBars, FaTimes } from 'react-icons/fa'
import { supabase } from '@/supabase'

type HeaderProps = {
  isLoggedIn: boolean
  userName: string
}

const Header: FC<HeaderProps> = ({ isLoggedIn, userName }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const router = useRouter()

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen)
  }

  const handleLogout = async () => {
    try {
      await supabase.auth.signOut()
      router.push('/')
    } catch (error) {
      console.error('ログアウトエラー:', error)
    }
  }

  return (
    <header className="fixed top-0 left-0 w-full bg-white shadow-md z-50">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <Link href="/" className="text-2xl font-bold text-[#4A90E2]">
            性格診断アプリ
          </Link>

          <div className="hidden md:flex items-center space-x-8">
            <Link href="/diagnosis/guidance" className="text-gray-700 hover:text-[#4A90E2]">
              診断開始
            </Link>
            <Link href="/advice" className="text-gray-700 hover:text-[#4A90E2]">
              アドバイス
            </Link>
            <Link href="/history" className="text-gray-700 hover:text-[#4A90E2]">
              診断履歴
            </Link>
          </div>

          <div className="hidden md:flex items-center space-x-4">
            {isLoggedIn ? (
              <div className="flex items-center space-x-4">
                <div className="text-gray-700">
                  <FaUser className="inline-block mr-2" />
                  {userName}
                </div>
                <button
                  onClick={handleLogout}
                  className="bg-[#F5A623] text-white px-4 py-2 rounded hover:bg-opacity-90"
                >
                  ログアウト
                </button>
              </div>
            ) : (
              <div className="flex space-x-4">
                <Link
                  href="/login"
                  className="bg-[#4A90E2] text-white px-4 py-2 rounded hover:bg-opacity-90"
                >
                  ログイン
                </Link>
                <Link
                  href="/register"
                  className="bg-[#F5A623] text-white px-4 py-2 rounded hover:bg-opacity-90"
                >
                  新規登録
                </Link>
              </div>
            )}
          </div>

          <button className="md:hidden text-gray-700" onClick={toggleMenu}>
            {isMenuOpen ? <FaTimes size={24} /> : <FaBars size={24} />}
          </button>
        </div>
      </div>

      {/* モバイルメニュー */}
      {isMenuOpen && (
        <div className="md:hidden bg-white">
          <div className="container mx-auto px-4 py-4 space-y-4">
            <Link
              href="/diagnosis/guidance"
              className="block text-gray-700 hover:text-[#4A90E2]"
              onClick={toggleMenu}
            >
              診断開始
            </Link>
            <Link
              href="/advice"
              className="block text-gray-700 hover:text-[#4A90E2]"
              onClick={toggleMenu}
            >
              アドバイス
            </Link>
            <Link
              href="/history"
              className="block text-gray-700 hover:text-[#4A90E2]"
              onClick={toggleMenu}
            >
              診断履歴
            </Link>
            {isLoggedIn ? (
              <>
                <div className="text-gray-700">
                  <FaUser className="inline-block mr-2" />
                  {userName}
                </div>
                <button
                  onClick={() => {
                    handleLogout()
                    toggleMenu()
                  }}
                  className="w-full bg-[#F5A623] text-white px-4 py-2 rounded hover:bg-opacity-90"
                >
                  ログアウト
                </button>
              </>
            ) : (
              <>
                <Link
                  href="/login"
                  className="block w-full text-center bg-[#4A90E2] text-white px-4 py-2 rounded hover:bg-opacity-90"
                  onClick={toggleMenu}
                >
                  ログイン
                </Link>
                <Link
                  href="/register"
                  className="block w-full text-center bg-[#F5A623] text-white px-4 py-2 rounded hover:bg-opacity-90"
                  onClick={toggleMenu}
                >
                  新規登録
                </Link>
              </>
            )}
          </div>
        </div>
      )}
    </header>
  )
}

export default Header