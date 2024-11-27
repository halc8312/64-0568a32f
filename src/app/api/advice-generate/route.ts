import { NextApiRequest, NextApiResponse } from 'next'
import { supabase } from '@/supabase'
import { getLlmModelAndGenerateContent } from '@/utils/functions'

type AdviceContent = {
  title: string
  description: string
  action_items: string[]
  recommendations: string[]
}

type AdviceResponse = {
  category: string
  advice_content: AdviceContent
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  try {
    const { user_id, category, personality_type } = req.body

    if (!user_id || !category || !personality_type) {
      return res.status(400).json({ error: '必要なパラメータが不足しています' })
    }

    // 性格タイプの詳細データを取得
    const { data: diagnosisData, error: diagnosisError } = await supabase
      .from('personality_diagnoses')
      .select('personality_type')
      .eq('user_id', user_id)
      .order('diagnosed_at', { ascending: false })
      .limit(1)
      .single()

    if (diagnosisError || !diagnosisData) {
      throw new Error('性格診断データの取得に失敗しました')
    }

    // カテゴリーに応じたシステムプロンプトを設定
    const categoryPrompts = {
      love: '以下の性格タイプの人向けの恋愛アドバイスを生成してください。アドバイスには具体的な行動指針と推奨事項を含めてください。',
      work: '以下の性格タイプの人向けのキャリアアドバイスを生成してください。職種の提案や働き方のアドバイスを含めてください。',
      money: '以下の性格タイプの人向けの金銭管理アドバイスを生成してください。投資スタイルや節約のコツを含めてください。',
      compatibility: '以下の性格タイプの人向けの対人関係アドバイスを生成してください。相性の良い性格タイプや円滑なコミュニケーション方法を含めてください。'
    }

    const systemPrompt = categoryPrompts[category as keyof typeof categoryPrompts]
    const userPrompt = JSON.stringify(diagnosisData.personality_type)

    // AI APIを使用してアドバイスを生成
    let adviceContent: AdviceContent
    try {
      const aiResponse = await getLlmModelAndGenerateContent('Gemini', systemPrompt, userPrompt)
      adviceContent = JSON.parse(aiResponse)
    } catch (error) {
      // APIエラー時のサンプルデータ
      adviceContent = {
        title: `${category}に関するアドバイス`,
        description: `${personality_type}タイプの方への${category}アドバイス`,
        action_items: ['具体的な行動指針1', '具体的な行動指針2', '具体的な行動指針3'],
        recommendations: ['おすすめポイント1', 'おすすめポイント2', 'おすすめポイント3']
      }
    }

    // 生成したアドバイスをデータベースに保存
    const { data: adviceRecord, error: insertError } = await supabase
      .from('advice_records')
      .insert({
        diagnosis_id: diagnosisData.id,
        category: category,
        advice_content: adviceContent,
        created_at: new Date().toISOString()
      })
      .select()
      .single()

    if (insertError) {
      throw new Error('アドバイスの保存に失敗しました')
    }

    const response: AdviceResponse = {
      category: category,
      advice_content: adviceContent
    }

    return res.status(200).json(response)

  } catch (error) {
    console.error('Error generating advice:', error)
    return res.status(500).json({ error: 'アドバイスの生成に失敗しました' })
  }
}