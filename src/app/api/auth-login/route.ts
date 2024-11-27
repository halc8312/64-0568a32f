import { NextResponse } from 'next/server'
import { supabase } from '@/supabase'
import axios from 'axios'
import { getLlmModelAndGenerateContent } from '@/utils/functions'

export async function POST(request: Request) {
  try {
    const { email, password } = await request.json()

    if (!email || !password) {
      return NextResponse.json(
        { error: 'メールアドレスとパスワードは必須です' },
        { status: 400 }
      )
    }

    // Supabaseの認証機能を使用してログイン
    const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
      email,
      password,
    })

    if (authError) {
      return NextResponse.json(
        { error: '認証に失敗しました。メールアドレスまたはパスワードが正しくありません。' },
        { status: 401 }
      )
    }

    // ユーザー情報の取得
    const { data: userData, error: userError } = await supabase
      .from('users')
      .select('*')
      .eq('email', email)
      .single()

    if (userError) {
      return NextResponse.json(
        { error: 'ユーザー情報の取得に失敗しました' },
        { status: 500 }
      )
    }

    // レスポンスデータの構築
    const responseData = {
      user: {
        id: userData.id,
        email: userData.email,
        profile: userData.profile,
      },
      session: {
        access_token: authData.session?.access_token,
        refresh_token: authData.session?.refresh_token,
        expires_at: authData.session?.expires_at,
      },
    }

    // AIを使用してログイン時の歓迎メッセージを生成
    try {
      const welcomeMessage = await getLlmModelAndGenerateContent(
        'Gemini',
        'ユーザーのログイン時に表示する、前向きで温かみのある歓迎メッセージを生成してください。',
        `ユーザー名: ${userData.profile?.nickname || 'ゲスト'}様`
      )
      responseData.welcomeMessage = welcomeMessage
    } catch (error) {
      responseData.welcomeMessage = 'おかえりなさい！本日もよろしくお願いします。'
    }

    // ログイン履歴の記録
    await supabase.from('login_history').insert([
      {
        user_id: userData.id,
        login_at: new Date().toISOString(),
        ip_address: request.headers.get('x-forwarded-for') || 'unknown',
      },
    ])

    return NextResponse.json(responseData, { status: 200 })

  } catch (error) {
    console.error('ログインエラー:', error)
    return NextResponse.json(
      { error: 'ログイン処理中にエラーが発生しました' },
      { status: 500 }
    )
  }
}

export async function OPTIONS(request: Request) {
  return new NextResponse(null, {
    status: 200,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    },
  })
}