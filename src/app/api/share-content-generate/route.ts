import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/supabase';
import { getLlmModelAndGenerateContent } from '@/utils/functions';
import crypto from 'crypto';
import axios from 'axios';

type ShareSettings = {
  includePersonalityType: boolean;
  includeAdvice: boolean;
  includeCompatibility: boolean;
  customMessage: string;
};

export async function POST(req: NextRequest) {
  try {
    const { diagnoseId, settings }: { diagnoseId: string; settings: ShareSettings } = await req.json();

    // 診断結果データの取得
    const { data: diagnoseData, error: diagnoseError } = await supabase
      .from('personality_diagnoses')
      .select(`
        personality_type,
        advice_records (
          category,
          advice_content
        )
      `)
      .eq('id', diagnoseId)
      .single();

    if (diagnoseError) {
      throw new Error('診断結果の取得に失敗しました');
    }

    // シェアコンテンツの生成
    let shareContent = '';
    if (settings.includePersonalityType) {
      shareContent += `【性格タイプ】
${diagnoseData.personality_type.type_name}

`;
    }

    if (settings.includeAdvice && diagnoseData.advice_records) {
      shareContent += '【アドバイス】
';
      diagnoseData.advice_records.forEach((advice: any) => {
        shareContent += `${advice.category}: ${advice.advice_content.summary}
`;
      });
      shareContent += '
';
    }

    if (settings.customMessage) {
      shareContent += `${settings.customMessage}

`;
    }

    // AIによるシェア文言の最適化
    const prompt = `
      以下の診断結果とメッセージをSNSでシェアするための魅力的な文章に最適化してください：
      ${shareContent}
      
      条件：
      - 簡潔で読みやすい
      - 興味を引く表現
      - ポジティブな tone
    `;

    let optimizedContent;
    try {
      optimizedContent = await getLlmModelAndGenerateContent('Gemini', 'あなたはSNSマーケティングの専門家です。', prompt);
    } catch (error) {
      optimizedContent = shareContent;
    }

    // シェアURL生成
    const hash = crypto.createHash('sha256').update(diagnoseId + Date.now().toString()).digest('hex').slice(0, 8);
    const shareUrl = `${process.env.NEXT_PUBLIC_BASE_URL}/share/${hash}`;

    // OGP画像生成
    let ogpImageUrl;
    try {
      const { data: ogpData } = await axios.post(`${process.env.OGP_GENERATOR_URL}/api/generate`, {
        type: diagnoseData.personality_type.type_name,
        text: optimizedContent.slice(0, 100)
      });
      ogpImageUrl = ogpData.imageUrl;
    } catch (error) {
      ogpImageUrl = `${process.env.NEXT_PUBLIC_BASE_URL}/default-ogp.png`;
    }

    // シェアデータの保存
    const { error: shareError } = await supabase.from('shared_contents').insert({
      diagnosis_id: diagnoseId,
      share_settings: settings,
      share_url: shareUrl,
      share_hash: hash,
      content: optimizedContent,
      ogp_image_url: ogpImageUrl
    });

    if (shareError) {
      throw new Error('シェアデータの保存に失敗しました');
    }

    return NextResponse.json({
      success: true,
      shareUrl,
      shareContent: optimizedContent,
      ogpImageUrl
    });

  } catch (error) {
    console.error('Error generating share content:', error);
    
    // エラー時のサンプルデータ
    const sampleShareUrl = `${process.env.NEXT_PUBLIC_BASE_URL}/share/sample`;
    const sampleContent = '私の性格診断結果をチェックしてください！意外な発見があるかもしれません。';
    
    return NextResponse.json({
      success: false,
      shareUrl: sampleShareUrl,
      shareContent: sampleContent,
      ogpImageUrl: `${process.env.NEXT_PUBLIC_BASE_URL}/default-ogp.png`,
      error: error instanceof Error ? error.message : '不明なエラーが発生しました'
    });
  }
}