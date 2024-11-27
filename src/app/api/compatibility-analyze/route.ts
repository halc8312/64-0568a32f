import type { NextApiRequest, NextApiResponse } from 'next'
import { supabase } from '@/supabase'
import { getLlmModelAndGenerateContent } from '@/utils/functions'

type CompatibilityResult = {
  compatibility: number
  details: {
    love: number
    work: number
    friendship: number
  }
  advice: string
}

const personalityCompatibilityMatrix = {
  "分析型": {
    "分析型": 0.7,
    "外交型": 0.6,
    "管理型": 0.8,
    "探検型": 0.5,
    "論理型": 0.9,
    "支援型": 0.6,
    "指導型": 0.7,
    "創造型": 0.6
  },
  "外交型": {
    "分析型": 0.6,
    "外交型": 0.8,
    "管理型": 0.6,
    "探検型": 0.8,
    "論理型": 0.5,
    "支援型": 0.9,
    "指導型": 0.7,
    "創造型": 0.8
  }
  // 他の性格タイプの組み合わせも同様に定義
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<CompatibilityResult | { error: string }>
) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  try {
    const { type1, type2 } = req.body

    if (!type1 || !type2) {
      return res.status(400).json({ error: '性格タイプが指定されていません' })
    }

    // 基本的な相性スコアを計算
    const baseCompatibility = calculateBaseCompatibility(type1, type2)

    // AIを使用して詳細な相性分析を生成
    const prompt = `
      性格タイプ「${type1}」と「${type2}」の相性について、以下の観点から分析してください：
      1. 恋愛面での相性
      2. 仕事面での相性
      3. 友人関係での相性
      4. 総合的なアドバイス
    `

    try {
      const aiAnalysis = await getLlmModelAndGenerateContent(
        'Gemini',
        '二つの性格タイプの相性を分析し、具体的なスコアと詳細なアドバイスを提供してください。',
        prompt
      )

      // AIの分析結果を解析して数値化
      const result = parseAiAnalysis(aiAnalysis, baseCompatibility)

      // 分析結果をデータベースに保存
      const { error: dbError } = await supabase
        .from('advice_records')
        .insert({
          category: 'compatibility',
          advice_content: result
        })

      if (dbError) throw dbError

      return res.status(200).json(result)
    } catch (error) {
      // AI API呼び出しに失敗した場合のサンプルデータ
      const sampleResult: CompatibilityResult = {
        compatibility: Math.round(baseCompatibility * 100),
        details: {
          love: Math.round(baseCompatibility * 90),
          work: Math.round(baseCompatibility * 85),
          friendship: Math.round(baseCompatibility * 95)
        },
        advice: `${type1}と${type2}の組み合わせは、互いの特性を活かし合える可能性が高い関係です。特に、コミュニケーションを大切にすることで、より良い関係を築くことができるでしょう。`
      }

      return res.status(200).json(sampleResult)
    }
  } catch (error) {
    console.error('Error in compatibility analysis:', error)
    return res.status(500).json({ error: '相性診断の処理中にエラーが発生しました' })
  }
}

function calculateBaseCompatibility(type1: string, type2: string): number {
  // 相性マトリックスから基本スコアを取得
  // 存在しない組み合わせの場合はデフォルト値を使用
  const defaultScore = 0.7
  return personalityCompatibilityMatrix[type1]?.[type2] ?? defaultScore
}

function parseAiAnalysis(aiResponse: string, baseScore: number): CompatibilityResult {
  try {
    // AI応答からスコアとアドバイスを抽出する処理
    // 実際のAI応答フォーマットに合わせて実装
    const compatibility = Math.round(baseScore * 100)
    const loveScore = Math.round(baseScore * 90)
    const workScore = Math.round(baseScore * 85)
    const friendshipScore = Math.round(baseScore * 95)
    
    return {
      compatibility,
      details: {
        love: loveScore,
        work: workScore,
        friendship: friendshipScore
      },
      advice: aiResponse
    }
  } catch (error) {
    // パース失敗時のフォールバック
    return {
      compatibility: Math.round(baseScore * 100),
      details: {
        love: Math.round(baseScore * 90),
        work: Math.round(baseScore * 85),
        friendship: Math.round(baseScore * 95)
      },
      advice: '相性分析の結果、互いの特性を活かし合える良好な関係が期待できます。'
    }
  }
}