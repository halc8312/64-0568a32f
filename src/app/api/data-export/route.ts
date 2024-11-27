import { NextApiRequest, NextApiResponse } from 'next'
import { supabase } from '@/supabase'
import { createCipheriv, createHash, randomBytes } from 'crypto'
import { getLlmModelAndGenerateContent } from '@/utils/functions'

type BackupData = {
  userData: any
  diagnosisHistory: any
  userSettings: any
  timestamp: string
}

const ENCRYPTION_KEY = process.env.ENCRYPTION_KEY || 'default-encryption-key-32-characters'
const IV_LENGTH = 16

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  try {
    const { user } = await supabase.auth.getUser()
    if (!user) {
      return res.status(401).json({ error: '認証が必要です' })
    }

    const { selectedItems } = req.body
    if (!selectedItems) {
      return res.status(400).json({ error: 'バックアップ項目が選択されていません' })
    }

    // データの取得
    const backupData: BackupData = {
      userData: null,
      diagnosisHistory: null,
      userSettings: null,
      timestamp: new Date().toISOString()
    }

    if (selectedItems.personalityData) {
      const { data: userData, error: userError } = await supabase
        .from('users')
        .select('*')
        .eq('id', user.id)
        .single()

      if (userError) throw userError
      backupData.userData = userData
    }

    if (selectedItems.diagnosisHistory) {
      const { data: diagnosisData, error: diagnosisError } = await supabase
        .from('personality_diagnoses')
        .select('*')
        .eq('user_id', user.id)

      if (diagnosisError) throw diagnosisError
      backupData.diagnosisHistory = diagnosisData
    }

    if (selectedItems.userSettings) {
      const { data: settingsData, error: settingsError } = await supabase
        .from('user_settings')
        .select('*')
        .eq('user_id', user.id)
        .single()

      if (settingsError && settingsError.code !== 'PGRST116') throw settingsError
      backupData.userSettings = settingsData
    }

    // データの暗号化
    const iv = randomBytes(IV_LENGTH)
    const key = createHash('sha256').update(ENCRYPTION_KEY).digest('base64').slice(0, 32)
    const cipher = createCipheriv('aes-256-cbc', key, iv)

    const encryptedData = Buffer.concat([
      cipher.update(JSON.stringify(backupData)),
      cipher.final()
    ])

    // エクスポートファイルの生成
    const exportData = {
      iv: iv.toString('hex'),
      data: encryptedData.toString('base64'),
      version: '1.0'
    }

    // 一時ストレージにアップロード
    const fileName = `backup-${user.id}-${Date.now()}.json`
    const { data: uploadData, error: uploadError } = await supabase.storage
      .from('backups')
      .upload(fileName, JSON.stringify(exportData))

    if (uploadError) {
      throw uploadError
    }

    // 一時的なダウンロードURLの生成
    const { data: { signedUrl }, error: urlError } = await supabase.storage
      .from('backups')
      .createSignedUrl(fileName, 3600) // 1時間有効

    if (urlError) {
      throw urlError
    }

    return res.status(200).json({
      success: true,
      downloadUrl: signedUrl
    })

  } catch (error) {
    console.error('バックアップエラー:', error)

    // エラー時のサンプルレスポンス
    const sampleData = {
      success: false,
      error: 'バックアップの作成に失敗しました',
      downloadUrl: null
    }

    return res.status(500).json(sampleData)
  }
}