"use client"

import { FiHelpCircle } from "react-icons/fi"
import Topbar from "@/components/Topbar"

interface DiagnosisLayoutProps {
  children: React.ReactNode
}

export default function DiagnosisLayout({ children }: DiagnosisLayoutProps) {
  return (
    <div className="min-h-screen h-full bg-[#F8F9FA]">
      <Topbar />
      
      <div className="container mx-auto px-4 py-6">
        <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
          <div className="flex items-center justify-between mb-4">
            <h1 className="text-2xl font-bold text-[#333333]">性格診断</h1>
            <button className="text-[#4A90E2] hover:text-[#357ABD] transition-colors">
              <FiHelpCircle size={24} />
            </button>
          </div>
          
          <div className="border-t border-gray-100 pt-4">
            <div className="space-y-4">
              {children}
            </div>
          </div>
        </div>
        
        <div className="text-center text-sm text-gray-500 mt-8">
          <p>回答内容は統計的な分析にのみ使用され、個人情報は保護されます。</p>
          <p>より正確な診断結果のため、できるだけ正直にお答えください。</p>
        </div>
      </div>
    </div>
  )
}