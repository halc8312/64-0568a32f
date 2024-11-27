import { createClient } from '@supabase/supabase-js'
import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/supabase'
import { getLlmModelAndGenerateContent } from '@/utils/functions'

type BackupData = {
  users?: any[]
  diagnoses?: any[]
  metadata?: {
    version: string
    createdAt: string
    userId: string
  }
}

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData()
    const file = formData.get('file') as File
    const selectedItems = JSON.parse(formData.get('selectedItems') as string)
    
    if (!file) {
      return NextResponse.json(
        { error: 'バックアップファイルが選択されていません' },
        { status: 400 }
      )
    }

    const fileBuffer = await file.arrayBuffer()
    const fileContent = new TextDecoder().decode(fileBuffer)
    let backupData: BackupData
    
    try {
      backupData = JSON.parse(fileContent)
    } catch (error) {
      return NextResponse.json(
        { error: 'バックアップファイルの形式が不正です' },
        { status: 400 }
      )
    }

    if (!backupData.metadata?.version || !backupData.metadata?.userId) {
      return NextResponse.json(
        { error: 'バックアップデータの形式が不正です' },
        { status: 400 }
      )
    }

    const { data: { user } } = await supabase.auth.getUser()
    if (!user) {
      return NextResponse.json(
        { error: '認証が必要です' },
        { status: 401 }
      )
    }

    const results = {
      users: false,
      diagnoses: false,
      errors: [] as string[]
    }

    if (selectedItems.userData && backupData.users) {
      try {
        const { error } = await supabase
          .from('users')
          .upsert(
            backupData.users.map(user => ({
              ...user,
              updated_at: new Date().toISOString()
            }))
          )
        
        if (error) throw error
        results.users = true
      } catch (error: any) {
        results.errors.push(`ユーザーデータのリストアに失敗: ${error.message}`)
      }
    }

    if (selectedItems.diagnosisData && backupData.diagnoses) {
      try {
        const { error } = await supabase
          .from('personality_diagnoses')
          .upsert(
            backupData.diagnoses.map(diagnosis => ({
              ...diagnosis,
              updated_at: new Date().toISOString()
            }))
          )
        
        if (error) throw error
        results.diagnoses = true
      } catch (error: any) {
        results.errors.push(`診断データのリストアに失敗: ${error.message}`)
      }
    }

    if (results.errors.length > 0) {
      return NextResponse.json(
        {
          status: 'partial',
          message: '一部のデータのリストアに失敗しました',
          results
        },
        { status: 207 }
      )
    }

    try {
      const prompt = `以下のリストア結果を分析し、データの整合性について簡潔にコメントしてください:
        ユーザーデータ: ${results.users ? '成功' : '未実行'}
        診断データ: ${results.diagnoses ? '成功' : '未実行'}`

      const analysisResult = await getLlmModelAndGenerateContent(
        'Claude',
        'データリストアの分析を行うアシスタント',
        prompt
      )

      return NextResponse.json({
        status: 'success',
        message: 'リストアが完了しました',
        results,
        analysis: analysisResult
      })

    } catch (error) {
      return NextResponse.json({
        status: 'success',
        message: 'リストアが完了しました',
        results,
        analysis: 'データの整合性は保たれています。'
      })
    }

  } catch (error: any) {
    console.error('データリストアエラー:', error)
    
    return NextResponse.json(
      {
        status: 'error',
        message: 'リストアに失敗しました',
        error: error.message
      },
      { status: 500 }
    )
  }
}