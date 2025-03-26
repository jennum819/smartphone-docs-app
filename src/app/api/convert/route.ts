import { NextRequest, NextResponse } from 'next/server';
// pdf-parseモジュールのインポートを一時的にコメントアウト
// import * as pdfParse from 'pdf-parse';
import { detectFileType, downloadFile, getGoogleDocsExportUrl, getGoogleSlidesExportUrl, logConversionError } from '@/utils/fileConverter';

export async function POST(request: NextRequest) {
  try {
    const { url, type } = await request.json();
    
    if (!url) {
      return NextResponse.json({ error: 'URLが指定されていません' }, { status: 400 });
    }
    
    // ファイルタイプの検出
    const fileType = type || detectFileType(url);
    
    // 進捗状況の初期化
    let progress = 0;
    let markdown = '';
    let conversionErrors = [];
    
    // PDFの処理を一時的にコメントアウトまたは修正
    if (fileType === 'pdf') {
      try {
        const fileBuffer = await downloadFile(url);
        progress = 50;
        
        // PDFパース処理を一時的にスキップ
        markdown = "# PDF変換機能は現在準備中です\n\nPDFの変換機能は現在実装中です。しばらくお待ちください。";
        
        /*
        // 以下のコードをコメントアウト
        const pdfData = await pdfParse(fileBuffer);
        const text = pdfData.text;
        markdown = `# ${url.split('/').pop()}\n\n${text}`;
        */
        
        progress = 100;
      } catch (error) {
        console.error('PDF処理エラー:', error);
        conversionErrors.push({
          section: 'PDF処理',
          reason: error.message || 'PDFの処理中にエラーが発生しました'
        });
        markdown = "# PDF変換エラー\n\nPDFの変換中にエラーが発生しました。別のファイルを試してください。";
      }
    }
    
    // 他のファイルタイプの処理（変更なし）
    else if (fileType === 'google-docs') {
      // Google Docsの処理
      const exportUrl = getGoogleDocsExportUrl(url);
      // ...残りのコード
    }
    else if (fileType === 'google-slides') {
      // Google Slidesの処理
      const exportUrl = getGoogleSlidesExportUrl(url);
      // ...残りのコード
    }
    else {
      // 未対応のファイルタイプ
      return NextResponse.json({ 
        error: `未対応のファイルタイプです: ${fileType}` 
      }, { status: 400 });
    }
    
    return NextResponse.json({ 
      markdown, 
      progress, 
      conversionErrors 
    });
    
  } catch (error) {
    console.error('変換エラー:', error);
    return NextResponse.json({ 
      error: error.message || '変換中にエラーが発生しました' 
    }, { status: 500 });
  }
}
