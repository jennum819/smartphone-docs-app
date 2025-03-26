import { NextRequest, NextResponse } from 'next/server';
import pdfParse from 'pdf-parse';
import { detectFileType, downloadFile, getGoogleDocsExportUrl, getGoogleSlidesExportUrl, logConversionError } from '@/utils/fileConverter';

export async function POST(request: NextRequest) {
  try {
    const data = await request.json();
    const { url } = data;

    if (!url) {
      return NextResponse.json({ error: 'URLが指定されていません' }, { status: 400 });
    }

    // ファイルタイプを検出
    const fileType = detectFileType(url);
    
    // 処理するURLを決定
    let processUrl = url;
    
    // Google DocsやSlidesの場合はエクスポートURLを生成
    if (fileType === 'google-doc') {
      processUrl = getGoogleDocsExportUrl(url, 'pdf');
    } else if (fileType === 'google-slide') {
      processUrl = getGoogleSlidesExportUrl(url, 'pdf');
    }
    
    // ファイルをダウンロード
    const fileData = await downloadFile(processUrl);
    
    // ファイルタイプに応じた変換処理
    let markdown = '';
    const conversionErrors = [];
    
    if (fileType === 'pdf' || fileType === 'google-doc' || fileType === 'google-slide') {
      try {
        // PDFをテキストに変換
        const pdfData = await pdfParse(Buffer.from(fileData));
        
        // 簡易的なマークダウン変換（実際のアプリではより高度な変換が必要）
        markdown = pdfData.text
          .split('\n\n')
          .map(paragraph => paragraph.trim())
          .filter(paragraph => paragraph.length > 0)
          .map(paragraph => {
            // 見出しっぽい行を検出（大文字や数字で始まり短い行）
            if (paragraph.length < 50 && 
                (paragraph === paragraph.toUpperCase() || /^\d+\./.test(paragraph))) {
              return `## ${paragraph}`;
            }
            return paragraph;
          })
          .join('\n\n');
        
        // 変換できなかった可能性のある要素を記録
        if (pdfData.text.includes('図') || pdfData.text.includes('表')) {
          conversionErrors.push({
            section: '図表',
            reason: '図表の正確な変換ができない可能性があります'
          });
        }
      } catch (error) {
        logConversionError('PDF解析', error instanceof Error ? error.message : '不明なエラー');
        conversionErrors.push({
          section: 'PDF解析',
          reason: '文書の解析中にエラーが発生しました'
        });
      }
    } else if (fileType === 'markdown') {
      // マークダウンファイルの場合はそのまま使用
      const decoder = new TextDecoder('utf-8');
      markdown = decoder.decode(fileData);
    } else {
      // 未対応のファイル形式
      return NextResponse.json({
        error: `未対応のファイル形式です: ${fileType}`,
      }, { status: 400 });
    }
    
    return NextResponse.json({
      markdown,
      fileType,
      conversionErrors,
    });
    
  } catch (error) {
    console.error('変換処理中にエラーが発生しました:', error);
    return NextResponse.json({
      error: '変換処理中にエラーが発生しました',
    }, { status: 500 });
  }
}
