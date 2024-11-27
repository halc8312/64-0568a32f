"use client"

import React from 'react'
import { FiHome, FiHeart, FiBriefcase, FiDollarSign, FiUsers } from 'react-icons/fi'
import Link from 'next/link'
import { usePathname } from 'next/navigation'

type AdviceLayoutProps = {
  children: React.ReactNode
}

const AdviceLayout = ({ children }: AdviceLayoutProps) => {
  const pathname = usePathname()

  const menuItems = [
    { href: '/advice', icon: FiHome, label: 'アドバイストップ' },
    { href: '/advice/love', icon: FiHeart, label: '恋愛' },
    { href: '/advice/work', icon: FiBriefcase, label: '仕事' },
    { href: '/advice/money', icon: FiDollarSign, label: '金銭管理' },
    { href: '/advice/compatibility', icon: FiUsers, label: '相性診断' },
  ]

  return (
    <div className="min-h-screen h-full bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row gap-6 py-6">
          <aside className="w-full md:w-64 flex-shrink-0">
            <nav className="bg-white rounded-lg shadow-sm p-4">
              <ul className="space-y-2">
                {menuItems.map((item) => {
                  const Icon = item.icon
                  const isActive = pathname === item.href
                  return (
                    <li key={item.href}>
                      <Link
                        href={item.href}
                        className={`flex items-center space-x-3 px-4 py-3 rounded-md transition-colors ${
                          isActive
                            ? 'bg-blue-50 text-blue-600'
                            : 'text-gray-600 hover:bg-gray-50'
                        }`}
                      >
                        <Icon className="w-5 h-5" />
                        <span className="font-medium">{item.label}</span>
                      </Link>
                    </li>
                  )
                })}
              </ul>
            </nav>
            <div className="mt-6 bg-white rounded-lg shadow-sm p-4">
              <div className="text-sm text-gray-500">
                <h3 className="font-medium text-gray-900 mb-2">アドバイスについて</h3>
                <p>
                  各カテゴリーのアドバイスは、あなたの性格診断結果に基づいてカスタマイズされています。
                </p>
              </div>
            </div>
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

export default AdviceLayout