import { NextApiRequest, NextApiResponse } from 'next'
import { supabase } from '@/supabase'
import { getLlmModelAndGenerateContent } from '@/utils/functions'

type PersonalityScore = {
  category: string
  score: number
}

type PersonalityType = {
  type: string
  scores: PersonalityScore[]
}

type DiagnosisResult = {
  id: string
  personality_type: PersonalityType
  diagnosed_at: string
}

type AnalysisResult = {
  timelineData: any[]
  radarData: PersonalityScore[]
  changes: {
    category: string
    difference: number
    significance: 'increase' | 'decrease' | 'stable'
  }[]
  insights: string
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  try {
    const { user_id } = req.query

    if (!user_id) {
      return res.status(400).json({ error: 'ユーザーIDが必要です' })
    }

    const { data: diagnoses, error } = await supabase
      .from('personality_diagnoses')
      .select('id, personality_type, diagnosed_at')
      .eq('user_id', user_id)
      .order('diagnosed_at', { ascending: false })
      .limit(3)

    if (error) throw error

    if (!diagnoses || diagnoses.length === 0) {
      return res.status(404).json({ error: '診断結果が見つかりません' })
    }

    const analysis: AnalysisResult = await analyzeResults(diagnoses)

    try {
      const insights = await generateInsights(analysis)
      analysis.insights = insights
    } catch (error) {
      console.error('AIによる分析生成エラー:', error)
      analysis.insights = '申し訳ありません。現在、詳細な分析を生成できません。'
    }

    return res.status(200).json(analysis)

  } catch (error) {
    console.error('比較分析エラー:', error)
    return res.status(500).json({
      error: 'データの分析中にエラーが発生しました',
      sampleData: getSampleAnalysisData()
    })
  }
}

async function analyzeResults(diagnoses: DiagnosisResult[]): Promise<AnalysisResult> {
  const timelineData = diagnoses.map(d => ({
    date: d.diagnosed_at,
    ...d.personality_type.scores.reduce((acc, score) => ({
      ...acc,
      [score.category]: score.score
    }), {})
  }))

  const changes = diagnoses.length > 1 
    ? diagnoses[0].personality_type.scores.map((currentScore, index) => {
      const previousScore = diagnoses[1].personality_type.scores[index]
      const difference = currentScore.score - previousScore.score
      return {
        category: currentScore.category,
        difference,
        significance: difference > 0 ? 'increase' : difference < 0 ? 'decrease' : 'stable'
      }
    })
    : []

  return {
    timelineData,
    radarData: diagnoses[0].personality_type.scores,
    changes,
    insights: ''
  }
}

async function generateInsights(analysis: AnalysisResult): Promise<string> {
  const prompt = `
以下の性格診断の分析結果から、重要な洞察と改善のアドバイスを日本語で生成してください：

変化点データ:
${analysis.changes.map(c => 
  `${c.category}: ${c.difference > 0 ? '+' : ''}${c.difference}%`
).join('
')}

特に注目すべき点:
- 最も大きな変化がある特性
- 改善が見られる領域
- 今後の成長に向けたアドバイス
`

  const result = await getLlmModelAndGenerateContent(
    'Gemini',
    '性格分析の専門家として、建設的でポジティブな分析とアドバイスを提供してください。',
    prompt
  )

  return result || '分析を生成できませんでした。'
}

function getSampleAnalysisData(): AnalysisResult {
  return {
    timelineData: [
      {
        date: '2024-01-01',
        外向性: 80,
        協調性: 65,
        勤勉性: 70
      },
      {
        date: '2024-01-15',
        外向性: 75,
        協調性: 70,
        勤勉性: 75
      }
    ],
    radarData: [
      { category: '外向性', score: 80 },
      { category: '協調性', score: 65 },
      { category: '勤勉性', score: 70 }
    ],
    changes: [
      { category: '外向性', difference: 5, significance: 'increase' },
      { category: '協調性', difference: -5, significance: 'decrease' },
      { category: '勤勉性', difference: -5, significance: 'decrease' }
    ],
    insights: '性格特性の変化が見られ、特に外向性が向上しています。他者とのコミュニケーションがより活発になっている可能性があります。協調性と勤勉性にはやや低下が見られますが、これは一時的な変化かもしれません。'
  }
}