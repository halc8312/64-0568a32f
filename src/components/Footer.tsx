import Link from 'next/link'
import { FaTwitter, FaFacebook, FaInstagram } from 'react-icons/fa'

const Footer = () => {
  return (
    <footer className="bg-gray-800 text-white py-8 mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="space-y-3">
            <h3 className="text-lg font-bold">PersonalityPro</h3>
            <p className="text-sm text-gray-300">
              あなたの性格を理解し、より良い人生の選択をサポートします。
            </p>
          </div>

          <div>
            <h4 className="text-lg font-semibold mb-3">サービス</h4>
            <ul className="space-y-2">
              <li><Link href="/diagnosis/guidance" className="text-gray-300 hover:text-white">性格診断</Link></li>
              <li><Link href="/advice" className="text-gray-300 hover:text-white">個別アドバイス</Link></li>
              <li><Link href="/history" className="text-gray-300 hover:text-white">診断履歴</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="text-lg font-semibold mb-3">サポート</h4>
            <ul className="space-y-2">
              <li><Link href="/help" className="text-gray-300 hover:text-white">ヘルプ</Link></li>
              <li><Link href="/contact" className="text-gray-300 hover:text-white">お問い合わせ</Link></li>
              <li><Link href="/privacy" className="text-gray-300 hover:text-white">プライバシーポリシー</Link></li>
              <li><Link href="/terms" className="text-gray-300 hover:text-white">利用規約</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="text-lg font-semibold mb-3">フォロー</h4>
            <div className="flex space-x-4">
              <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" className="text-gray-300 hover:text-white">
                <FaTwitter className="w-6 h-6" />
              </a>
              <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" className="text-gray-300 hover:text-white">
                <FaFacebook className="w-6 h-6" />
              </a>
              <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" className="text-gray-300 hover:text-white">
                <FaInstagram className="w-6 h-6" />
              </a>
            </div>
          </div>
        </div>

        <div className="mt-8 pt-8 border-t border-gray-700">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <p className="text-sm text-gray-300">
              © {new Date().getFullYear()} PersonalityPro. All rights reserved.
            </p>
            <div className="mt-4 md:mt-0">
              <Link href="/sitemap" className="text-sm text-gray-300 hover:text-white">
                サイトマップ
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}

export default Footer