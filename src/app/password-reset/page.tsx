"use client"

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { supabase } from '@/supabase'
import { FiMail, FiArrowLeft } from 'react-icons/fi'

export default function PasswordReset() {
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState('')
  const [error, setError] = useState('')

  const handlePasswordReset = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    setMessage('')

    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/password-update`,
      })

      if (error) throw error

      setMessage('パスワードリセットのメールを送信しました。メールをご確認ください。')
    } catch (error: any) {
      setError('パスワードリセットに失敗しました。もう一度お試しください。')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen h-full bg-gray-50 flex flex-col">
      <div className="flex-1 flex flex-col justify-center items-center px-4 sm:px-6 lg:px-8">
        <div className="max-w-md w-full space-y-8">
          <div>
            <Link 
              href="/login"
              className="flex items-center text-sm text-gray-600 hover:text-gray-900 mb-8"
            >
              <FiArrowLeft className="mr-2" />
              ログイン画面に戻る
            </Link>
            <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
              パスワードをリセット
            </h2>
            <p className="mt-2 text-center text-sm text-gray-600">
              登録したメールアドレスを入力してください。
              <br />
              パスワードリセット用のリンクをお送りします。
            </p>
          </div>
          <form className="mt-8 space-y-6" onSubmit={handlePasswordReset}>
            <div className="rounded-md shadow-sm -space-y-px">
              <div className="relative">
                <FiMail className="absolute top-3 left-3 text-gray-400" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="appearance-none rounded-md relative block w-full px-10 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm"
                  placeholder="メールアドレス"
                />
              </div>
            </div>

            {error && (
              <div className="rounded-md bg-red-50 p-4">
                <div className="text-sm text-red-700">{error}</div>
              </div>
            )}

            {message && (
              <div className="rounded-md bg-green-50 p-4">
                <div className="text-sm text-green-700">{message}</div>
              </div>
            )}

            <div>
              <button
                type="submit"
                disabled={loading}
                className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? 'sending...' : 'リセットメールを送信'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}