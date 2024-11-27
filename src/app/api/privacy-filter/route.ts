import { NextApiRequest, NextApiResponse } from 'next'
import { supabase } from '@/supabase'

type PrivacySettings = {
  profileVisibility: 'private' | 'friends' | 'public'
  notificationEnabled: boolean
  dataSharing: {
    personalityType: boolean
    adviceHistory: boolean
    diagnosticResults: boolean
  }
}

type FilteredData = {
  personalityDiagnoses?: any[]
  adviceRecords?: any[]
  profile?: any
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'メソッドが許可されていません' })
  }

  const userId = req.query.userId as string
  const viewerId = req.query.viewerId as string

  if (!userId || !viewerId) {
    return res.status(400).json({ error: 'ユーザーIDが必要です' })
  }

  try {
    // プライバシー設定の取得
    const { data: settingsData, error: settingsError } = await supabase
      .from('user_settings')
      .select('privacy_settings')
      .eq('user_id', userId)
      .single()

    if (settingsError) {
      throw settingsError
    }

    const privacySettings = settingsData?.privacy_settings as PrivacySettings

    // アクセス権のチェック
    const canAccess = await checkAccessPermission(userId, viewerId, privacySettings)
    if (!canAccess) {
      return res.status(403).json({ error: 'アクセスが許可されていません' })
    }

    // データの取得とフィルタリング
    const filteredData = await filterDataBasedOnPrivacy(userId, privacySettings)

    return res.status(200).json(filteredData)

  } catch (error) {
    console.error('プライバシーフィルター処理エラー:', error)
    return res.status(500).json({ 
      error: 'データの取得中にエラーが発生しました',
      // エラー時のサンプルデータ
      data: {
        personalityDiagnoses: [],
        adviceRecords: [],
        profile: {
          nickname: '匿名ユーザー',
          occupation: '非公開',
          birth_date: null
        }
      }
    })
  }
}

async function checkAccessPermission(
  userId: string,
  viewerId: string,
  privacySettings: PrivacySettings
): Promise<boolean> {
  // 自分自身の場合は常にアクセス可能
  if (userId === viewerId) {
    return true
  }

  // プロフィールが完全非公開の場合
  if (privacySettings.profileVisibility === 'private') {
    return false
  }

  // フレンドのみの場合、フレンド関係をチェック
  if (privacySettings.profileVisibility === 'friends') {
    const { data: friendshipData } = await supabase
      .from('friendships')
      .select('*')
      .match({ 
        user_id: userId,
        friend_id: viewerId,
        status: 'accepted'
      })
      .single()

    return !!friendshipData
  }

  // 公開設定の場合は誰でもアクセス可能
  return privacySettings.profileVisibility === 'public'
}

async function filterDataBasedOnPrivacy(
  userId: string,
  privacySettings: PrivacySettings
): Promise<FilteredData> {
  const filteredData: FilteredData = {}

  // 性格診断データのフィルタリング
  if (privacySettings.dataSharing.personalityType) {
    const { data: diagnoses } = await supabase
      .from('personality_diagnoses')
      .select('*')
      .eq('user_id', userId)
    filteredData.personalityDiagnoses = diagnoses
  }

  // アドバイス履歴のフィルタリング
  if (privacySettings.dataSharing.adviceHistory) {
    const { data: advice } = await supabase
      .from('advice_records')
      .select('*')
      .eq('user_id', userId)
    filteredData.adviceRecords = advice
  }

  // プロフィール情報の取得
  const { data: profileData } = await supabase
    .from('users')
    .select('profile')
    .eq('id', userId)
    .single()

  if (profileData) {
    filteredData.profile = privacySettings.profileVisibility === 'public' 
      ? profileData.profile
      : {
          nickname: profileData.profile.nickname,
          occupation: '非公開',
          birth_date: null
        }
  }

  return filteredData
}