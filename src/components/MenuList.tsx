"use client"

import { useRouter } from 'next/navigation'
import { IoPersonOutline, IoBookOutline, IoStatsChartOutline, IoSettingsOutline } from 'react-icons/io5'

interface MenuItem {
  id: string
  icon: React.ReactNode
  title: string
  description: string
  path: string
}

const MenuList = () => {
  const router = useRouter()

  const menuItems: MenuItem[] = [
    {
      id: 'diagnosis',
      icon: <IoPersonOutline className="w-8 h-8 text-blue-500" />,
      title: '性格診断',
      description: '64種類の詳細な性格タイプを診断',
      path: '/diagnosis/guidance'
    },
    {
      id: 'advice',
      icon: <IoBookOutline className="w-8 h-8 text-orange-500" />,
      title: 'アドバイス',
      description: '恋愛・仕事・お金の個別アドバイス',
      path: '/advice'
    },
    {
      id: 'history',
      icon: <IoStatsChartOutline className="w-8 h-8 text-green-500" />,
      title: '診断履歴',
      description: '過去の診断結果を確認',
      path: '/history'
    },
    {
      id: 'settings',
      icon: <IoSettingsOutline className="w-8 h-8 text-gray-500" />,
      title: '設定',
      description: 'プロフィールとアプリの設定',
      path: '/settings/profile'
    }
  ]

  return (
    <nav className="w-full max-w-4xl mx-auto p-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {menuItems.map((item) => (
          <button
            key={item.id}
            onClick={() => router.push(item.path)}
            className="flex items-start p-6 bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300 border border-gray-100"
          >
            <div className="flex-shrink-0 mr-4">
              {item.icon}
            </div>
            <div className="flex flex-col text-left">
              <h3 className="text-lg font-bold text-gray-800 mb-1">
                {item.title}
              </h3>
              <p className="text-sm text-gray-600">
                {item.description}
              </p>
            </div>
          </button>
        ))}
      </div>
    </nav>
  )
}

export default MenuList