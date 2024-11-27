import { NextApiRequest, NextApiResponse } from 'next'
import { supabase } from '@/supabase'
import { getLlmModelAndGenerateContent } from '@/utils/functions'

type ResponseData = {
  success: boolean
  message: string
  error?: string
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<ResponseData>
) {
  if (req.method !== 'POST') {
    return res.status(405).json({
      success: false,
      message: 'Method not allowed',
      error: 'POSTメソッドのみ許可されています。'
    })
  }

  try {
    const { email } = req.body

    if (!email) {
      return res.status(400).json({
        success: false,
        message: 'Invalid request',
        error: 'メールアドレスは必須です。'
      })
    }

    const { data: existingUser, error: userError } = await supabase
      .from('users')
      .select('email')
      .eq('email', email)
      .single()

    if (userError || !existingUser) {
      return res.status(404).json({
        success: false,
        message: 'User not found',
        error: '指定されたメールアドレスのユーザーが見つかりません。'
      })
    }

    const { error: resetError } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${process.env.NEXT_PUBLIC_SITE_URL}/password-update`
    })

    if (resetError) {
      throw new Error(resetError.message)
    }

    try {
      const emailTemplate = await getLlmModelAndGenerateContent(
        'Gemini',
        'パスワードリセットメールのテンプレートを生成してください。',
        `ユーザーのメールアドレス: ${email}`
      )
      console.log('Email template generated:', emailTemplate)
    } catch (aiError) {
      console.error('AI template generation failed:', aiError)
    }

    return res.status(200).json({
      success: true,
      message: 'パスワードリセット用のメールを送信しました。'
    })

  } catch (error: any) {
    console.error('Password reset error:', error)
    return res.status(500).json({
      success: false,
      message: 'Internal server error',
      error: 'パスワードリセットの処理中にエラーが発生しました。'
    })
  }
}