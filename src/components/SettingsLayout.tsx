"use client"

import { useRouter, usePathname } from 'next/navigation'
import Link from 'next/link'
import { BsGear, BsShieldLock, BsKey, BsCloudArrowUp, BsCloudArrowDown } from 'react-icons/bs'
import { ReactNode } from 'react'
import Topbar from '@/components/Topbar'

interface SettingsLayoutProps {
  children: ReactNode
}

const SettingsLayout = ({ children }: SettingsLayoutProps) => {
  const router = useRouter()
  const pathname = usePathname()

  const menuItems = [
    { path: '/settings/profile', icon: <BsGear className="w-5 h-5" />, label: 'プロフィール設定' },
    { path: '/settings/privacy', icon: <BsShieldLock className="w-5 h-5" />, label: 'プライバシー設定' },
    { path: '/settings/password', icon: <BsKey className="w-5 h-5" />, label: 'パスワード変更' },
    { path: '/settings/backup', icon: <BsCloudArrowUp className="w-5 h-5" />, label: 'バックアップ' },
    { path: '/settings/restore', icon: <BsCloudArrowDown className="w-5 h-5" />, label: 'リストア' }
  ]

  return (
    <div className="min-h-screen h-full bg-gray-50">
      <Topbar />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col md:flex-row gap-8">
          <aside className="w-full md:w-64 shrink-0">
            <nav className="bg-white rounded-lg shadow-sm p-4">
              <h2 className="text-lg font-semibold text-gray-700 mb-4">設定メニュー</h2>
              <div className="space-y-2">
                {menuItems.map((item) => (
                  <Link
                    key={item.path}
                    href={item.path}
                    className={`flex items-center gap-3 px-4 py-3 rounded-md transition-colors ${
                      pathname === item.path
                        ? 'bg-blue-50 text-blue-600'
                        : 'text-gray-600 hover:bg-gray-50'
                    }`}
                  >
                    {item.icon}
                    <span className="text-sm font-medium">{item.label}</span>
                  </Link>
                ))}
              </div>
            </nav>
          </aside>
          
          <main className="flex-1">
            <div className="bg-white rounded-lg shadow-sm p-6">
              {children}
            </div>
          </main>
        </div>
      </div>
    </div>
  )
}

export default SettingsLayout