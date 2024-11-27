"use client"

import { useState, useEffect } from 'react'
import { useRouter, useParams } from 'next/navigation'
import { FiArrowLeft, FiArrowRight } from 'react-icons/fi'
import { supabase } from '@/supabase'

const questions = [
  {
    id: 1,
    text: "新しい環境に置かれたとき、あなたは...",
    options: [
      "積極的に周りに話しかける",
      "様子を見ながら徐々に慣れていく",
      "自分のペースを保つことを優先する",
      "環境に応じて柔軟に対応する"
    ]
  },
  {
    id: 2,
    text: "重要な決定を下すとき、あなたは...",
    options: [
      "直感を重視する",
      "論理的に考える",
      "他人の意見を参考にする",
      "時間をかけて熟考する"
    ]
  },
  // 他の質問も同様に追加
]

export default function DiagnosisQuestion() {
  const router = useRouter()
  const params = useParams()
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0)
  const [answers, setAnswers] = useState<{[key: number]: number}>({})
  const [selectedOption, setSelectedOption] = useState<number | null>(null)

  useEffect(() => {
    const questionId = Number(params.id)
    setCurrentQuestionIndex(questionId - 1)
  }, [params.id])

  const handleAnswer = async (optionIndex: number) => {
    setSelectedOption(optionIndex)
    const updatedAnswers = {
      ...answers,
      [currentQuestionIndex]: optionIndex
    }
    setAnswers(updatedAnswers)
  }

  const handleNext = async () => {
    if (currentQuestionIndex < questions.length - 1) {
      router.push(`/diagnosis/question/${currentQuestionIndex + 2}`)
      setSelectedOption(null)
    } else {
      try {
        const { data: { user } } = await supabase.auth.getUser()
        
        await supabase.from('personality_diagnoses').insert({
          user_id: user?.id,
          answers: answers,
          diagnosed_at: new Date().toISOString()
        })

        router.push('/diagnosis/result')
      } catch (error) {
        console.error('Error saving diagnosis:', error)
      }
    }
  }

  const handlePrevious = () => {
    if (currentQuestionIndex > 0) {
      router.push(`/diagnosis/question/${currentQuestionIndex}`)
    }
  }

  const currentQuestion = questions[currentQuestionIndex]
  const progress = ((currentQuestionIndex + 1) / questions.length) * 100

  return (
    <div className="min-h-screen h-full bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        <div className="bg-white rounded-lg shadow-lg p-6 mb-8">
          <div className="mb-6">
            <div className="w-full bg-gray-200 rounded-full h-2.5">
              <div
                className="bg-blue-600 h-2.5 rounded-full transition-all duration-300"
                style={{ width: `${progress}%` }}
              ></div>
            </div>
            <p className="text-right text-sm text-gray-600 mt-2">
              {currentQuestionIndex + 1} / {questions.length}
            </p>
          </div>

          <h2 className="text-2xl font-bold text-gray-900 mb-8">
            {currentQuestion.text}
          </h2>

          <div className="space-y-4">
            {currentQuestion.options.map((option, index) => (
              <button
                key={index}
                onClick={() => handleAnswer(index)}
                className={`w-full text-left p-4 rounded-lg border transition-all duration-200 
                  ${selectedOption === index 
                    ? 'border-blue-500 bg-blue-50' 
                    : 'border-gray-200 hover:border-blue-300 hover:bg-blue-50'
                  }`}
              >
                {option}
              </button>
            ))}
          </div>

          <div className="flex justify-between mt-8">
            <button
              onClick={handlePrevious}
              disabled={currentQuestionIndex === 0}
              className={`flex items-center px-4 py-2 rounded-lg
                ${currentQuestionIndex === 0 
                  ? 'text-gray-400 cursor-not-allowed' 
                  : 'text-blue-600 hover:bg-blue-50'
                }`}
            >
              <FiArrowLeft className="mr-2" />
              前の質問
            </button>

            <button
              onClick={handleNext}
              disabled={selectedOption === null}
              className={`flex items-center px-6 py-2 rounded-lg
                ${selectedOption === null
                  ? 'bg-gray-300 cursor-not-allowed'
                  : 'bg-blue-600 text-white hover:bg-blue-700'
                }`}
            >
              {currentQuestionIndex === questions.length - 1 ? '診断する' : '次へ'}
              <FiArrowRight className="ml-2" />
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}